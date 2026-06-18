import { createMollieClient, MollieClient, PaymentStatus } from "@mollie/api-client";
import { db } from "./db";
import { orders, verhuringen, Order } from "./schema";
import { and, eq, ne } from "drizzle-orm";
import { sendOrderEmail } from "./email";

let _client: MollieClient | null = null;

export function getMollie(): MollieClient {
  if (!_client) {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) throw new Error("MOLLIE_API_KEY is niet ingesteld in .env.local");
    _client = createMollieClient({ apiKey });
  }
  return _client;
}

// Vertaal een Mollie-betaalstatus naar onze interne betaalstatus.
export function mapMollieStatus(status: string): "open" | "betaald" | "mislukt" {
  switch (status) {
    case PaymentStatus.paid:
      return "betaald";
    case PaymentStatus.failed:
    case PaymentStatus.canceled:
    case PaymentStatus.expired:
      return "mislukt";
    default:
      // open, pending, authorized
      return "open";
  }
}

/**
 * Haalt de actuele betaalstatus op bij Mollie en werkt de bestelling bij.
 * Idempotent: de bevestigingsmail wordt alleen verstuurd op de overgang naar
 * "betaald" (de conditionele update levert enkel een rij op als de status
 * daadwerkelijk verandert), dus dubbele aanroepen (webhook + retourpagina)
 * versturen niet meerdere mails.
 */
export async function syncOrderPayment(order: Order): Promise<string> {
  if (!order.molliePaymentId) return order.betaalstatus || "n.v.t.";

  const payment = await getMollie().payments.get(order.molliePaymentId);
  const nieuweStatus = mapMollieStatus(payment.status);

  if (nieuweStatus === (order.betaalstatus || "")) return nieuweStatus;

  if (nieuweStatus === "betaald") {
    const [bijgewerkt] = await db
      .update(orders)
      .set({ betaalstatus: "betaald" })
      .where(and(eq(orders.id, order.id), ne(orders.betaalstatus, "betaald")))
      .returning();
    // Alleen mailen wanneer wij de status nu daadwerkelijk op betaald zetten.
    // We awaiten bewust: in een serverless-runtime wordt de functie anders
    // afgebroken vóór de mail is verstuurd (fire-and-forget gaat verloren).
    if (bijgewerkt) {
      try {
        await sendOrderEmail(bijgewerkt);
      } catch (err) {
        console.error("[syncOrderPayment] mail mislukt:", err);
      }
    }
  } else {
    await db.update(orders).set({ betaalstatus: nieuweStatus }).where(eq(orders.id, order.id));
    // Mislukte/geannuleerde/verlopen betaling: verhuurperiodes weer vrijgeven.
    if (nieuweStatus === "mislukt") {
      await db.delete(verhuringen).where(eq(verhuringen.orderId, order.id));
    }
  }

  return nieuweStatus;
}
