import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import ProductToggle from "./ProductToggle";

const CATEGORIE_LABEL: Record<string, string> = {
  beamer: "📽️ Beamers",
  audio: "🔊 Geluid",
  karaoke: "🎤 Karaoke",
  verlichting: "💡 Verlichting",
  effecten: "🌫️ Effecten",
  accessoires: "🔌 Accessoires",
  "glow-in-the-dark": "🪩 Glow in the Dark",
};

export default async function AdminProductenPage() {
  let allProducts: (typeof products.$inferSelect)[] = [];
  try {
    allProducts = await db.select().from(products).orderBy(asc(products.categorie), asc(products.naam));
  } catch {
    // DB niet geconfigureerd
  }

  const perCategorie: Record<string, typeof allProducts> = {};
  for (const p of allProducts) {
    if (!perCategorie[p.categorie]) perCategorie[p.categorie] = [];
    perCategorie[p.categorie].push(p);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-slate-900 font-black text-2xl">Producten</h1>
          <p className="text-slate-500 text-sm mt-1">{allProducts.length} artikelen</p>
        </div>
        <Link
          href="/admin/producten/nieuw"
          className="flex items-center gap-2 bg-party hover:bg-party-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Nieuw product
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-600 mb-4">Geen producten gevonden</p>
          <p className="text-slate-400 text-sm mb-6">Seed de database of voeg handmatig een product toe</p>
          <Link href="/admin/producten/nieuw" className="bg-party text-white px-6 py-3 rounded-xl font-semibold hover:bg-party-dark transition-colors inline-flex items-center gap-2">
            <Plus size={16} />
            Eerste product toevoegen
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(perCategorie).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-3">
                {CATEGORIE_LABEL[cat] || cat} ({items.length})
              </h2>
              <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
                {items.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i !== items.length - 1 ? "border-b border-dark-border" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 text-sm font-medium truncate">{p.naam}</span>
                        {p.populair && (
                          <span className="text-xs bg-party/10 text-party px-1.5 py-0.5 rounded-full">Populair</span>
                        )}
                        {p.isKoop && (
                          <span className="text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full">Koop</span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 truncate">{p.beschrijving}</p>
                    </div>
                    <div className="text-party font-bold text-sm flex-shrink-0">
                      €{Number(p.prijsPerDag).toFixed(2)}
                      <span className="text-slate-400 font-normal">{p.isKoop ? "" : "/dag"}</span>
                    </div>
                    <ProductToggle id={p.id} beschikbaar={p.beschikbaar ?? true} />
                    <Link
                      href={`/admin/producten/${p.id}`}
                      className="flex-shrink-0 w-8 h-8 bg-slate-50 hover:bg-slate-100 border border-dark-border rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Pencil size={14} className="text-slate-500" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
