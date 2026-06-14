export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { syncOrderPayment } from "@/lib/payments";

// Mollie roept deze webhook aan (x-www-form-urlencoded) met het payment-id zodra
// de status wijzigt. We halen de bestelling op en synchroniseren de betaalstatus.
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const paymentId = form.get("id");
    if (typeof paymentId !== "string") {
      return NextResponse.json({ error: "Geen payment id" }, { status: 400 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.molliePaymentId, paymentId));
    if (order) {
      await syncOrderPayment(order);
    }

    // Mollie verwacht altijd 200 OK, ook als de bestelling niet gevonden is.
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
