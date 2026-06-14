"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/schema";

const CATEGORIE_EMOJI: Record<string, string> = {
  beamer: "📽️",
  audio: "🔊",
  karaoke: "🎤",
  verlichting: "💡",
  effecten: "🌫️",
  accessoires: "🔌",
};

const CATEGORIE_GRADIENT: Record<string, string> = {
  beamer: "from-blue-100 to-blue-200",
  audio: "from-slate-100 to-slate-200",
  karaoke: "from-pink-100 to-pink-200",
  verlichting: "from-amber-100 to-amber-200",
  effecten: "from-cyan-100 to-cyan-200",
  accessoires: "from-slate-100 to-slate-200",
};

interface Props {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: Props) {
  const { voegToe, openCart } = useCart();
  const [toegevoegd, setToeGevoegd] = useState(false);
  const [showKenmerken, setShowKenmerken] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [startDatum, setStartDatum] = useState(new Date().toISOString().split("T")[0]);
  const [eindDatum, setEindDatum] = useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [aantal, setAantal] = useState(1);

  const dagen = Math.max(1, Math.ceil(
    (new Date(eindDatum).getTime() - new Date(startDatum).getTime()) / 86400000
  ));
  const totaal = Number(product.prijsPerDag) * aantal * dagen;

  function handleToevoegen() {
    voegToe(product, aantal, startDatum, eindDatum);
    setToeGevoegd(true);
    openCart();
    setTimeout(() => setToeGevoegd(false), 2500);
  }

  const emoji = CATEGORIE_EMOJI[product.categorie] || "📦";
  const gradient = CATEGORIE_GRADIENT[product.categorie] || "from-slate-100 to-slate-200";
  const kenmerken = (product.kenmerken as string[]) || [];
  const heeftAfbeelding = !!product.afbeeldingUrl && !imgError;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-party/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group flex flex-col">
      {/* Visual */}
      <div className={`relative h-40 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
        {heeftAfbeelding ? (
          <Image
            src={product.afbeeldingUrl!}
            alt={product.naam}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl">{emoji}</span>
        )}
        {product.populair && (
          <span className="absolute top-2 right-2 bg-gradient-party text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
            Populair
          </span>
        )}
        {product.isKoop && (
          <span className="absolute top-2 left-2 bg-cyan-100 border border-cyan-300 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded-full z-10">
            Koop
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-1">
          {product.naam}
        </h3>

        {!compact && product.beschrijving && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-2">
            {product.beschrijving}
          </p>
        )}

        {/* Kenmerken toggle */}
        {!compact && kenmerken.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowKenmerken(!showKenmerken)}
              className="flex items-center gap-1 text-slate-500 hover:text-party text-xs transition-colors"
            >
              {showKenmerken ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showKenmerken ? "Minder" : "Specificaties"}
            </button>
            {showKenmerken && (
              <ul className="mt-2 space-y-1">
                {kenmerken.map((k, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-600 text-xs">
                    <span className="text-party mt-0.5">✓</span>
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Datumkiezer */}
        {!compact && !product.isKoop && (
          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 text-xs block mb-1">Van</label>
                <input
                  type="date"
                  value={startDatum}
                  onChange={(e) => setStartDatum(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-slate-100 border border-dark-border rounded-lg px-2 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-party"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs block mb-1">Tot</label>
                <input
                  type="date"
                  value={eindDatum}
                  onChange={(e) => setEindDatum(e.target.value)}
                  min={startDatum}
                  className="w-full bg-slate-100 border border-dark-border rounded-lg px-2 py-1.5 text-slate-900 text-xs focus:outline-none focus:border-party"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">Aantal</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setAantal(Math.max(1, aantal - 1))} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm flex items-center justify-center">−</button>
                <span className="text-slate-900 font-semibold w-5 text-center text-sm">{aantal}</span>
                <button onClick={() => setAantal(aantal + 1)} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-dark-border">
              <span className="text-slate-500 text-xs">Totaal ({dagen} dag{dagen !== 1 ? "en" : ""})</span>
              <span className="text-slate-900 font-bold">€{totaal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Prijs + knop */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-dark-border">
          <div>
            <span className="text-party font-black text-lg">
              €{Number(product.prijsPerDag).toFixed(2)}
            </span>
            <span className="text-slate-500 text-xs ml-1">
              {product.isKoop ? "(koop)" : "/ dag"}
            </span>
          </div>

          <button
            onClick={handleToevoegen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              toegevoegd
                ? "bg-green-600 text-white"
                : "bg-party hover:bg-party-dark text-white"
            }`}
          >
            {toegevoegd ? <>✓ Toegevoegd</> : <><Plus size={13} />Toevoegen</>}
          </button>
        </div>
      </div>
    </div>
  );
}
