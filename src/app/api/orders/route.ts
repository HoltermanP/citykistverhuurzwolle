export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, NewOrder } from "@/lib/schema";
import { sendOrderEmail } from "@/lib/email";
import { getMollie } from "@/lib/payments";
import { metBtw } from "@/lib/btw";
import { PaymentMethod } from "@mollie/api-client";
import { eq } from "drizzle-orm";
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

    // Contant bij ophalen: direct bevestigingsmail sturen (fire and forget).
    sendOrderEmail(order).catch((err) => console.error("Mail error:", err));

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
