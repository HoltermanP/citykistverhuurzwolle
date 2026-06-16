import { db } from "@/lib/db";
import { products, orders } from "@/lib/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RecenteBestelling = {
  id: number;
  naam: string;
  email: string;
  status: string | null;
  totaal: string | null;
  createdAt: Date | null;
};

export default async function AdminDashboard() {
  let stats = { producten: 0, bestellingen: 0, nieuweBestellingen: 0 };
  let recenteBestellingen: RecenteBestelling[] = [];
  let dbError: string | null = null;

  try {
    const [{ value: aantalProducten }] = await db.select({ value: count() }).from(products);
    const [{ value: aantalBestellingen }] = await db.select({ value: count() }).from(orders);
    const [{ value: nieuw }] = await db.select({ value: count() }).from(orders).where(eq(orders.status, "nieuw"));
    recenteBestellingen = await db
      .select({
        id: orders.id,
        naam: orders.naam,
        email: orders.email,
        status: orders.status,
        totaal: orders.totaal,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);
    stats = { producten: Number(aantalProducten), bestellingen: Number(aantalBestellingen), nieuweBestellingen: Number(nieuw) };
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
    console.error("[admin/dashboard] DB query mislukt:", err);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overzicht van jouw verhuurplatform</p>
      </div>

      {dbError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm">
          <p className="font-semibold mb-1">Gegevens konden niet worden geladen</p>
          <p className="text-red-600/80 font-mono text-xs break-all">{dbError}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Package size={20} className="text-party" />
            <Link href="/admin/producten/nieuw" className="text-party hover:text-party-dark text-xs flex items-center gap-1">
              <Plus size={12} />Toevoegen
            </Link>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.producten}</div>
          <div className="text-slate-500 text-sm mt-1">Producten</div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <ShoppingBag size={20} className="text-party" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.bestellingen}</div>
          <div className="text-slate-500 text-sm mt-1">Totaal bestellingen</div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.nieuweBestellingen}</div>
          <div className="text-slate-500 text-sm mt-1">Nieuwe bestellingen</div>
        </div>
      </div>

      {/* Snelle acties */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <h2 className="text-slate-900 font-bold mb-4">Snelle acties</h2>
          <div className="space-y-2">
            <Link href="/admin/producten/nieuw" className="flex items-center gap-2 w-full bg-party hover:bg-party-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Plus size={16} />Nieuw product toevoegen
            </Link>
            <Link href="/admin/producten" className="flex items-center gap-2 w-full bg-slate-50 hover:bg-slate-100 border border-dark-border text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Package size={16} />Producten beheren
            </Link>
            <Link href="/admin/bestellingen" className="flex items-center gap-2 w-full bg-slate-50 hover:bg-slate-100 border border-dark-border text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <ShoppingBag size={16} />Bestellingen bekijken
            </Link>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <h2 className="text-slate-900 font-bold mb-4">Database setup</h2>
          <p className="text-slate-600 text-sm mb-4">
            Heb je de database nog niet gevuld? Gebruik de seed om alle producten van citykistverhuur.nl te laden.
          </p>
          <SeedButton />
        </div>
      </div>

      {/* Recente bestellingen */}
      {recenteBestellingen.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 font-bold">Recente bestellingen</h2>
            <Link href="/admin/bestellingen" className="text-party text-xs hover:underline">Alle bekijken →</Link>
          </div>
          <div className="space-y-2">
            {recenteBestellingen.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-dark border border-dark-border rounded-xl">
                <div>
                  <span className="text-slate-900 text-sm font-medium">{o.naam}</span>
                  <span className="text-slate-500 text-xs ml-2">{o.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-xs">{new Date(o.createdAt!).toLocaleDateString("nl-NL")}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    o.status === "nieuw" ? "bg-green-100 text-green-700" :
                    o.status === "bevestigd" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>{o.status}</span>
                  <span className="text-party font-bold text-sm">€{Number(o.totaal).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SeedButton() {
  return <SeedButtonClient />;
}

// Client component voor de seed knop
import SeedButtonClient from "./SeedButton";
