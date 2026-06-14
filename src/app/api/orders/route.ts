export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, NewOrder } from "@/lib/schema";
import { sendOrderEmail } from "@/lib/email";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = orderSchema.parse(body);

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
      totaal: data.totaal.toFixed(2),
      items: data.items,
      status: "nieuw",
    };

    const [order] = await db.insert(orders).values(newOrder).returning();

    // Stuur e-mail (fire and forget — geen blocking)
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
