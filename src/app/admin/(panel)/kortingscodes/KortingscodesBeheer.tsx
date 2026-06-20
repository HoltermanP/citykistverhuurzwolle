"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Kortingscode } from "@/lib/schema";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

type Concept = { _key: string; id?: number; code: string; percentage: number; actief: boolean };

export default function KortingscodesBeheer({ initieel }: { initieel: Kortingscode[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Concept[]>(
    initieel.map((k) => ({ _key: String(k.id), id: k.id, code: k.code, percentage: k.percentage, actief: k.actief ?? true }))
  );

  function nieuw() {
    setItems((prev) => [{ _key: "nieuw-" + prev.length, code: "", percentage: 10, actief: true }, ...prev]);
  }

  return (
    <div className="space-y-4">
      <button
        onClick={nieuw}
        className="flex items-center gap-2 bg-party hover:bg-party-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        <Plus size={16} /> Nieuwe kortingscode
      </button>

      {items.length === 0 && <p className="text-slate-500 text-sm">Nog geen kortingscodes.</p>}

      <div className="space-y-3">
        {items.map((it) => (
          <Rij
            key={it._key}
            item={it}
            onChange={(patch) => setItems((prev) => prev.map((x) => (x._key === it._key ? { ...x, ...patch } : x)))}
            onWeg={() => setItems((prev) => prev.filter((x) => x._key !== it._key))}
            onOpgeslagen={(k) => {
              setItems((prev) =>
                prev.map((x) =>
                  x._key === it._key
                    ? { _key: it._key, id: k.id, code: k.code, percentage: k.percentage, actief: k.actief ?? true }
                    : x
                )
              );
              router.refresh();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Rij({
  item,
  onChange,
  onWeg,
  onOpgeslagen,
}: {
  item: Concept;
  onChange: (patch: Partial<Concept>) => void;
  onWeg: () => void;
  onOpgeslagen: (k: Kortingscode) => void;
}) {
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const isNieuw = !item.id;

  async function opslaan() {
    if (!item.code.trim()) {
      setFout("Code is verplicht");
      return;
    }
    if (!(item.percentage >= 1 && item.percentage <= 100)) {
      setFout("Percentage moet tussen 1 en 100 liggen");
      return;
    }
    setBezig(true);
    setFout("");
    try {
      const res = await fetch(isNieuw ? "/api/admin/kortingscodes" : `/api/admin/kortingscodes/${item.id}`, {
        method: isNieuw ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: item.code, percentage: item.percentage, actief: item.actief }),
      });
      const data = await res.json();
      if (!res.ok) setFout(data.error || "Opslaan mislukt");
      else onOpgeslagen(data);
    } catch {
      setFout("Verbindingsfout");
    }
    setBezig(false);
  }

  async function verwijderen() {
    if (item.id && !confirm("Deze kortingscode verwijderen?")) return;
    if (item.id) await fetch(`/api/admin/kortingscodes/${item.id}`, { method: "DELETE" });
    onWeg();
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[160px]">
        <label className="text-slate-600 text-xs block mb-1">Code</label>
        <input
          value={item.code}
          onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
          placeholder="ZOMER10"
          className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm font-mono uppercase focus:outline-none focus:border-party"
        />
      </div>
      <div className="w-28">
        <label className="text-slate-600 text-xs block mb-1">Korting %</label>
        <input
          type="number"
          min={1}
          max={100}
          value={item.percentage}
          onChange={(e) => onChange({ percentage: Number(e.target.value) })}
          className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <button
          type="button"
          onClick={() => onChange({ actief: !item.actief })}
          className={`inline-flex items-center w-11 h-6 px-0.5 rounded-full transition-colors ${item.actief ? "bg-green-500" : "bg-slate-300"}`}
        >
          <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${item.actief ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        <span className="text-slate-600 text-sm">{item.actief ? "Actief" : "Inactief"}</span>
      </label>

      <div className="flex items-center gap-2 ml-auto">
        {fout && <span className="text-red-500 text-xs">{fout}</span>}
        <button
          type="button"
          onClick={verwijderen}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm px-2 py-2 transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <button
          type="button"
          onClick={opslaan}
          disabled={bezig}
          className="flex items-center gap-2 bg-party hover:bg-party-dark disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
        >
          {bezig ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Opslaan
        </button>
      </div>
    </div>
  );
}
