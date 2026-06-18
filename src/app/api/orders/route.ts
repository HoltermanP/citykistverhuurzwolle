export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, NewOrder, products, verhuringen } from "@/lib/schema";
import { sendOrderEmail } from "@/lib/email";
import { getMollie } from "@/lib/payments";
import { metBtw } from "@/lib/btw";
import { isBeschikbaar, Periode } from "@/lib/beschikbaarheid";
import { PaymentMethod } from "@mollie/api-client";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

const orderSchema = z.object({
  naam: z.string().min(2),
  email: z.string().email(),
  telefoon: z.string().min(9),
  adres: z.string().optional().default(""),
  postcode: z.string().optional().default(""),
  stad: z.string().optional().default(""),
  ophaaldatum: z.string(),
  retourdatum: z.string(),
  notities: z.string().optional().default(""),
  betaalmethode: z.enum(["ideal", "contant"]).default("contant"),
  items: z.array(z.object({
    productId: z.number(),
    productNaam: z.string(),
    prijsPerDag: z.number(),
    aantal: z.number(),
    dagen: z.number(),
    subtotaal: z.number(),
    startDatum: z.string().optional(),
    eindDatum: z.string().optional(),
  })),
  totaal: z.number(),
});

// Bepaalt de publieke basis-URL voor redirect- en webhook-URL's.
function getBaseUrl(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);

    const isIdeal = data.betaalmethode === "ideal";

    // Bedragen autoritatief op de server berekenen (niet de client vertrouwen):
    // productprijzen zijn excl. BTW, de klant betaalt incl. 21% BTW.
    const exclTotaal = data.items.reduce((s, i) => s + i.subtotaal, 0);
    const { incl: totaalIncl } = metBtw(exclTotaal);

    // ── Beschikbaarheid van verhuurproducten controleren ──
    // Koopartikelen (isKoop) zijn niet aan een periode gebonden en worden
    // overgeslagen. Voor verhuurartikelen mag de gevraagde periode niet
    // overlappen met een al geboekte periode.
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const productRijen = productIds.length
      ? await db
          .select({ id: products.id, isKoop: products.isKoop })
          .from(products)
          .where(inArray(products.id, productIds))
      : [];
    const isKoopMap = new Map(productRijen.map((p) => [p.id, p.isKoop === true]));

    const teBoeken = data.items
      .filter((i) => !isKoopMap.get(i.productId)) // alleen verhuur
      .map((i) => ({
        productId: i.productId,
        productNaam: i.productNaam,
        periode: {
          startDatum: i.startDatum || data.ophaaldatum,
          eindDatum: i.eindDatum || data.retourdatum,
        } as Periode,
      }));

    if (teBoeken.length > 0) {
      const verhuurIds = [...new Set(teBoeken.map((i) => i.productId))];
      const bestaande = await db
        .select()
        .from(verhuringen)
        .where(inArray(verhuringen.productId, verhuurIds));
      const perProduct = new Map<number, Periode[]>();
      for (const v of bestaande) {
        const lijst = perProduct.get(v.productId) || [];
        lijst.push({ startDatum: v.startDatum, eindDatum: v.eindDatum });
        perProduct.set(v.productId, lijst);
      }
      const conflicten = teBoeken.filter(
        (i) => !isBeschikbaar(i.periode, perProduct.get(i.productId) || [])
      );
      if (conflicten.length > 0) {
        const namen = [...new Set(conflicten.map((c) => c.productNaam))].join(", ");
        return NextResponse.json(
          {
            error: `Helaas, ${namen} is op de gekozen datum(s) al verhuurd. Kies een andere periode of neem contact met ons op.`,
          },
          { status: 409 }
        );
      }
    }

    const newOrder: NewOrder = {
      naam: data.naam,
      email: data.email,
      telefoon: data.telefoon,
      adres: data.adres,
      postcode: data.postcode,
      stad: data.stad,
      ophaaldatum: data.ophaaldatum,
      retourdatum: data.retourdatum,
      notities: data.notities,
      totaal: totaalIncl.toFixed(2),
      items: data.items,
      status: "nieuw",
      betaalmethode: data.betaalmethode,
      betaalstatus: isIdeal ? "open" : "n.v.t.",
    };

    const [order] = await db.insert(orders).values(newOrder).returning();

    // Verhuurperiodes vastleggen zodat deze producten op die data niet
    // opnieuw verhuurd kunnen worden.
    if (teBoeken.length > 0) {
      await db.insert(verhuringen).values(
        teBoeken.map((i) => ({
          orderId: order.id,
          productId: i.productId,
          productNaam: i.productNaam,
          startDatum: i.periode.startDatum,
          eindDatum: i.periode.eindDatum,
        }))
      );
    }

    if (isIdeal) {
      // Maak een iDEAL-betaling aan bij Mollie en stuur de klant door naar de checkout.
      const baseUrl = getBaseUrl(req);
      const webhookUrl = `${baseUrl}/api/payments/webhook`;
      const isPubliek = baseUrl.startsWith("https://") && !baseUrl.includes("localhost") && !baseUrl.includes("127.0.0.1");

      const payment = await getMollie().payments.create({
        amount: { currency: "EUR", value: totaalIncl.toFixed(2) },
        description: `CityKist Verhuur — bestelling #${order.id}`,
        redirectUrl: `${baseUrl}/aanvraag/betaald?order=${order.id}`,
        // Mollie weigert webhooks naar localhost; in dev vertrouwen we op de retourpagina.
        ...(isPubliek ? { webhookUrl } : {}),
        method: PaymentMethod.ideal,
        metadata: { orderId: order.id },
      });

      await db.update(orders).set({ molliePaymentId: payment.id }).where(eq(orders.id, order.id));

      const checkoutUrl = payment.getCheckoutUrl();
      if (!checkoutUrl) {
        return NextResponse.json({ error: "Kon betaling niet starten" }, { status: 502 });
      }
      return NextResponse.json({ success: true, orderId: order.id, checkoutUrl });
    }

    // Contant bij ophalen: direct bevestigingsmail sturen. We awaiten bewust,
    // want in een serverless-runtime (Vercel) wordt de functie afgebroken zodra
    // de response is verzonden. Een mail-fout mag de bestelling niet laten
    // mislukken — de order staat al in de DB.
    let mailVerzonden = true;
    try {
      await sendOrderEmail(order);
    } catch (err) {
      mailVerzonden = false;
      console.error("[orders POST] mail mislukt:", err);
    }

    return NextResponse.json({ success: true, orderId: order.id, mailVerzonden });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
