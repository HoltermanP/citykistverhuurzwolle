"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Check, Loader2 } from "lucide-react";
import type { Product } from "@/lib/schema";

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none">
      <span className="text-slate-400 text-[11px] uppercase tracking-wide hidden lg:inline">{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`flex-shrink-0 inline-flex items-center w-11 h-6 px-0.5 rounded-full transition-colors ${on ? "bg-green-500" : "bg-slate-300"}`}
      >
        <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </label>
  );
}

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [naam, setNaam] = useState(product.naam);
  const [prijs, setPrijs] = useState(String(product.prijsPerDag));
  const [beschikbaar, setBeschikbaar] = useState(product.beschikbaar ?? true);
  const [populair, setPopulair] = useState(product.populair ?? false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(patch: Record<string, unknown>) {
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  function saveNaam() {
    const v = naam.trim();
    if (!v || v === product.naam) {
      setNaam(product.naam);
      return;
    }
    save({ naam: v });
  }

  function savePrijs() {
    const v = prijs.trim().replace(",", ".");
    if (!v || v === String(product.prijsPerDag) || isNaN(Number(v))) {
      setPrijs(String(product.prijsPerDag));
      return;
    }
    setPrijs(v);
    save({ prijsPerDag: v });
  }

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
      {/* Naam + beschrijving */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <input
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            onBlur={saveNaam}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="w-full max-w-sm bg-transparent text-slate-900 text-sm font-medium rounded px-1.5 py-1 -ml-1.5 hover:bg-white focus:bg-white border border-transparent hover:border-dark-border focus:border-party focus:outline-none transition-colors"
          />
          {product.isKoop && (
            <span className="flex-shrink-0 text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full">Koop</span>
          )}
        </div>
        {product.beschrijving && (
          <p className="text-slate-500 text-xs mt-0.5 truncate px-1.5">{product.beschrijving}</p>
        )}
      </div>

      {/* Prijs */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <span className="text-slate-400 text-sm">€</span>
        <input
          value={prijs}
          onChange={(e) => setPrijs(e.target.value)}
          onBlur={savePrijs}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          inputMode="decimal"
          className="w-16 bg-transparent text-party font-bold text-sm rounded px-1.5 py-1 hover:bg-white focus:bg-white border border-transparent hover:border-dark-border focus:border-party focus:outline-none transition-colors"
        />
        <span className="text-slate-400 text-xs w-7">{product.isKoop ? "" : "/dag"}</span>
      </div>

      {/* Toggles */}
      <Toggle on={populair} label="Populair" onChange={() => { const n = !populair; setPopulair(n); save({ populair: n }); }} />
      <Toggle on={beschikbaar} label="Zichtbaar" onChange={() => { const n = !beschikbaar; setBeschikbaar(n); save({ beschikbaar: n }); }} />

      {/* Status */}
      <div className="w-5 flex-shrink-0 flex items-center justify-center">
        {status === "saving" && <Loader2 size={14} className="text-slate-400 animate-spin" />}
        {status === "saved" && <Check size={14} className="text-green-500" />}
        {status === "error" && <span className="text-red-500 text-sm font-bold" title="Opslaan mislukt">!</span>}
      </div>

      {/* Volledig bewerken */}
      <Link
        href={`/admin/producten/${product.id}`}
        className="flex-shrink-0 w-8 h-8 bg-slate-50 hover:bg-slate-100 border border-dark-border rounded-lg flex items-center justify-center transition-colors"
        title="Volledig bewerken"
      >
        <Pencil size={14} className="text-slate-500" />
      </Link>
    </div>
  );
}
