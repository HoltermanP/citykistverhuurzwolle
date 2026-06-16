export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { syncOrderPayment } from "@/lib/payments";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Betaalstatus",
  description: "Status van je betaling bij CityKist Verhuur.",
  robots: { index: false, follow: false },
};

export default async function BetaaldPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderParam } = await searchParams;
  const orderId = Number(orderParam);

  let betaalstatus = "open";
  if (orderId) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (order) {
      try {
        // Ververs de status direct bij Mollie — werkt ook als de webhook (nog) niet kwam.
        betaalstatus = await syncOrderPayment(order);
      } catch {
        betaalstatus = order.betaalstatus || "open";
      }
    }
  }

  const config = {
    betaald: {
      icon: <CheckCircle className="text-green-600" size={40} />,
      bg: "bg-green-100",
      titel: "Betaling geslaagd!",
      tekst:
        "Bedankt! We hebben je betaling ontvangen. Je krijgt een bevestiging per e-mail en we nemen contact op om de details te bevestigen.",
    },
    open: {
      icon: <Clock className="text-amber-600" size={40} />,
      bg: "bg-amber-100",
      titel: "Betaling in verwerking",
      tekst:
        "Je betaling wordt nog verwerkt. Dit kan even duren. Je ontvangt een e-mail zodra de betaling is bevestigd.",
    },
    mislukt: {
      icon: <XCircle className="text-red-600" size={40} />,
      bg: "bg-red-100",
      titel: "Betaling niet gelukt",
      tekst:
        "De betaling is niet voltooid. Je kunt het opnieuw proberen of contact met ons opnemen. Er is nog niets afgeschreven.",
    },
  }[betaalstatus] ?? {
    icon: <Clock className="text-amber-600" size={40} />,
    bg: "bg-amber-100",
    titel: "Status onbekend",
    tekst: "We konden de betaalstatus niet ophalen. Neem gerust contact met ons op.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
          {config.icon}
        </div>
        <h1 className="text-slate-900 font-black text-3xl mb-3">{config.titel}</h1>
        <p className="text-slate-600 leading-relaxed mb-6">{config.tekst}</p>
        <div className="flex items-center justify-center gap-3">
          {betaalstatus === "mislukt" && (
            <Link href="/aanvraag" className="bg-gradient-party text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity inline-block">
              Opnieuw proberen
            </Link>
          )}
          <Link href="/producten" className="border border-dark-border text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-dark transition-colors inline-block">
            Naar producten
          </Link>
        </div>
      </div>
    </div>
  );
}
