import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { OrderItem } from "@/lib/schema";
import OrderStatusSelect from "./OrderStatusSelect";
import { FileText } from "lucide-react";

function formatDate(d: Date | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_KLEUR: Record<string, string> = {
  nieuw: "bg-green-100 text-green-700",
  bevestigd: "bg-blue-100 text-blue-700",
  geleverd: "bg-purple-100 text-purple-700",
  afgerond: "bg-slate-100 text-slate-500",
  geannuleerd: "bg-red-100 text-red-700",
};

function betaalBadge(order: { betaalmethode: string | null; betaalstatus: string | null }) {
  if (order.betaalmethode === "ideal") {
    const map: Record<string, { label: string; cls: string }> = {
      betaald: { label: "iDEAL · betaald", cls: "bg-green-100 text-green-700" },
      open: { label: "iDEAL · wacht op betaling", cls: "bg-amber-100 text-amber-700" },
      mislukt: { label: "iDEAL · mislukt", cls: "bg-red-100 text-red-700" },
    };
    return map[order.betaalstatus || "open"] || map.open;
  }
  return { label: "Contant bij ophalen", cls: "bg-slate-100 text-slate-600" };
}

export default async function BestellingenPage() {
  let allOrders: typeof orders.$inferSelect[] = [];
  try {
    allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch {
    // DB niet geconfigureerd
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Bestellingen</h1>
        <p className="text-slate-500 text-sm mt-1">{allOrders.length} totaal</p>
      </div>

      {allOrders.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-slate-600">Nog geen bestellingen ontvangen</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => {
            const items = (order.items as OrderItem[]) || [];
            return (
              <div key={order.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm font-mono">#{order.id}</span>
                    <div>
                      <span className="text-slate-900 font-semibold">{order.naam}</span>
                      <span className="text-slate-500 text-sm ml-2">{order.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{formatDate(order.createdAt)}</span>
                    {(() => {
                      const b = betaalBadge(order);
                      return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.cls}`}>{b.label}</span>;
                    })()}
                    <OrderStatusSelect id={order.id} status={order.status || "nieuw"} />
                    <span className="text-party font-bold">€{Number(order.totaal).toFixed(2)} <span className="text-slate-400 font-normal text-xs">incl. BTW</span></span>
                    <a
                      href={`/api/admin/orders/${order.id}/factuur`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Factuur (PDF) bekijken"
                      className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-party border border-dark-border rounded-lg px-2.5 py-1.5 transition-colors"
                    >
                      <FileText size={14} /> Factuur
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 py-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Contactgegevens</p>
                    <div className="space-y-1 text-sm text-slate-700">
                      <p>📞 {order.telefoon}</p>
                      {order.adres && <p>📍 {order.adres}, {order.postcode} {order.stad}</p>}
                      <p>📅 Ophalen: <span className="text-slate-900 font-medium">{order.ophaaldatum}</span></p>
                      <p>📅 Retour: <span className="text-slate-900 font-medium">{order.retourdatum}</span></p>
                      {order.notities && <p>💬 {order.notities}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Bestelde artikelen</p>
                    <div className="space-y-1">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{item.aantal}× {item.productNaam}</span>
                          <span className="text-slate-500 text-xs">{item.dagen}d × €{item.prijsPerDag} = <span className="text-slate-900 font-medium">€{item.subtotaal.toFixed(2)}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
