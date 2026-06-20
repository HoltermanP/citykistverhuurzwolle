import { db } from "@/lib/db";
import { verhuringen, orders } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDatum(d: string) {
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

export default async function VerhuuragendaPage() {
  let rijen: {
    id: number;
    productNaam: string | null;
    aantal: number | null;
    startDatum: string;
    eindDatum: string;
    orderId: number;
    klant: string | null;
    status: string | null;
    betaalstatus: string | null;
  }[] = [];
  try {
    rijen = await db
      .select({
        id: verhuringen.id,
        productNaam: verhuringen.productNaam,
        aantal: verhuringen.aantal,
        startDatum: verhuringen.startDatum,
        eindDatum: verhuringen.eindDatum,
        orderId: verhuringen.orderId,
        klant: orders.naam,
        status: orders.status,
        betaalstatus: orders.betaalstatus,
      })
      .from(verhuringen)
      .leftJoin(orders, eq(verhuringen.orderId, orders.id))
      .orderBy(asc(verhuringen.startDatum), asc(verhuringen.productNaam));
  } catch {
    // DB nog niet geconfigureerd
  }

  const vandaag = new Date().toISOString().split("T")[0];
  const lopendOfToekomstig = rijen.filter((r) => r.eindDatum >= vandaag);
  const verleden = rijen.filter((r) => r.eindDatum < vandaag);

  function Tabel({ data }: { data: typeof rijen }) {
    return (
      <div className="overflow-x-auto bg-dark-card border border-dark-border rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border text-slate-500 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Periode</th>
              <th className="text-left font-medium px-4 py-3">Product</th>
              <th className="text-center font-medium px-4 py-3">Aantal</th>
              <th className="text-left font-medium px-4 py-3">Klant</th>
              <th className="text-left font-medium px-4 py-3">Bestelling</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-b border-dark-border last:border-0">
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {formatDatum(r.startDatum)} – {formatDatum(r.eindDatum)}
                </td>
                <td className="px-4 py-3 text-slate-900 font-medium">{r.productNaam}</td>
                <td className="px-4 py-3 text-center text-slate-700">{r.aantal ?? 1}×</td>
                <td className="px-4 py-3 text-slate-700">{r.klant || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  <span className="font-mono">#{r.orderId}</span>
                  {r.status && (
                    <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{r.status}</span>
                  )}
                  {r.betaalstatus === "open" && (
                    <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">betaling open</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl flex items-center gap-2">
          <CalendarDays size={22} className="text-party" /> Verhuuragenda
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welke verhuurproducten op welke data zijn gereserveerd. {lopendOfToekomstig.length} lopend/komend.
        </p>
      </div>

      {rijen.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-slate-600">Er zijn nog geen verhuringen.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div>
            <h2 className="text-slate-900 font-bold mb-3">Lopend &amp; komend</h2>
            {lopendOfToekomstig.length > 0 ? (
              <Tabel data={lopendOfToekomstig} />
            ) : (
              <p className="text-slate-500 text-sm">Geen lopende of komende verhuringen.</p>
            )}
          </div>
          {verleden.length > 0 && (
            <div>
              <h2 className="text-slate-500 font-bold mb-3">Afgelopen</h2>
              <div className="opacity-70">
                <Tabel data={verleden} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
