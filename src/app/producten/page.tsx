import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import ProductenFilter from "@/components/ProductenFilter";

const CATEGORIEN = [
  { id: "alle", naam: "Alle producten", emoji: "✨" },
  { id: "beamer", naam: "Beamers & Schermen", emoji: "📽️" },
  { id: "audio", naam: "Geluid & Speakers", emoji: "🔊" },
  { id: "karaoke", naam: "Karaoke", emoji: "🎤" },
  { id: "verlichting", naam: "Verlichting", emoji: "💡" },
  { id: "effecten", naam: "Rook & Bellen", emoji: "🌫️" },
  { id: "accessoires", naam: "Accessoires", emoji: "🔌" },
];

interface PageProps {
  searchParams: Promise<{ cat?: string; zoek?: string }>;
}

export default async function ProductenPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const actieveCat = params.cat || "alle";
  const zoek = params.zoek || "";

  let allProducts: (typeof products.$inferSelect)[] = [];
  try {
    allProducts = await db
      .select()
      .from(products)
      .where(eq(products.beschikbaar, true))
      .orderBy(asc(products.volgorde), asc(products.naam));
  } catch {
    // DB nog niet geconfigureerd
  }

  const gefilterd = allProducts.filter((p) => {
    const matchesCat = actieveCat === "alle" || p.categorie === actieveCat;
    const matchesZoek = !zoek || p.naam.toLowerCase().includes(zoek.toLowerCase());
    return matchesCat && matchesZoek;
  });

  const groepenMap: Record<string, typeof allProducts> = {};
  if (actieveCat === "alle") {
    for (const p of gefilterd) {
      if (!groepenMap[p.categorie]) groepenMap[p.categorie] = [];
      groepenMap[p.categorie].push(p);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-3xl md:text-4xl">
          Alle <span className="text-transparent bg-clip-text bg-gradient-party">Producten</span>
        </h1>
        <p className="text-slate-600 mt-2">
          {allProducts.length > 0 ? `${allProducts.length} artikelen beschikbaar` : "Laden..."} — dagprijzen excl. BTW
        </p>
      </div>

      <ProductenFilter categorien={CATEGORIEN} actief={actieveCat} zoek={zoek} />

      {allProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-slate-900 text-xl font-bold mb-2">Database nog niet gekoppeld</h2>
          <p className="text-slate-600 mb-4">Stel je DATABASE_URL in .env.local in en voer de seed uit.</p>
          <p className="text-slate-500 text-sm">
            Daarna ga je naar <code className="bg-slate-100 text-slate-700 px-2 py-1 rounded">/admin</code> voor het beheer.
          </p>
        </div>
      ) : gefilterd.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-600 text-lg">Geen producten gevonden</p>
          <p className="text-slate-500 text-sm mt-1">Probeer een andere zoekterm of categorie</p>
        </div>
      ) : actieveCat === "alle" ? (
        <div className="space-y-12">
          {CATEGORIEN.filter((c) => c.id !== "alle").map((cat) => {
            const items = groepenMap[cat.id] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h2 className="text-slate-900 font-black text-xl">{cat.naam}</h2>
                  <span className="text-slate-400 text-sm">({items.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gefilterd.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
