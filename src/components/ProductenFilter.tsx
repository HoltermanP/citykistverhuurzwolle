"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

interface Categorie {
  id: string;
  naam: string;
  emoji: string;
}

interface Props {
  categorien: Categorie[];
  actief: string;
  zoek: string;
}

export default function ProductenFilter({ categorien, actief, zoek }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [zoekInput, setZoekInput] = useState(zoek);

  function navigeer(cat: string, z?: string) {
    const params = new URLSearchParams();
    if (cat && cat !== "alle") params.set("cat", cat);
    if (z) params.set("zoek", z);
    const query = params.toString();
    startTransition(() => {
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    });
  }

  function handleZoek(e: React.FormEvent) {
    e.preventDefault();
    navigeer(actief, zoekInput);
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Zoekbalk */}
      <form onSubmit={handleZoek} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={zoekInput}
          onChange={(e) => setZoekInput(e.target.value)}
          placeholder="Zoek een product..."
          className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-party"
        />
      </form>

      {/* Categorie tabs */}
      <div className="flex flex-wrap gap-2">
        {categorien.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigeer(cat.id, zoekInput)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              actief === cat.id
                ? "bg-gradient-party text-white"
                : "bg-dark-card border border-dark-border text-slate-600 hover:text-party hover:border-party/40"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.naam}</span>
          </button>
        ))}
      </div>

      {isPending && (
        <p className="text-slate-400 text-xs animate-pulse">Laden...</p>
      )}
    </div>
  );
}
