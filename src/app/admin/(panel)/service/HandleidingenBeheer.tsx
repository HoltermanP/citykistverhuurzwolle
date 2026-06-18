"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Handleiding } from "@/lib/schema";
import { Plus, Trash2, Save, Upload, Loader2, FileText, ExternalLink } from "lucide-react";

const CATEGORIEEN = ["Beamer & scherm", "Geluid & speakers", "Aansluitschema's", "Algemeen"];

interface ProductOptie {
  id: number;
  naam: string;
}

type Concept = Partial<Handleiding> & { _key: string };

export default function HandleidingenBeheer({
  initieel,
  producten,
}: {
  initieel: Handleiding[];
  producten: ProductOptie[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Concept[]>(initieel.map((h) => ({ ...h, _key: String(h.id) })));

  function nieuw() {
    setItems((prev) => [
      { _key: "nieuw-" + prev.length, titel: "", categorie: "Algemeen", beschrijving: "", bestandUrl: "", productId: null, volgorde: prev.length + 1 },
      ...prev,
    ]);
  }

  function update(key: string, patch: Partial<Concept>) {
    setItems((prev) => prev.map((it) => (it._key === key ? { ...it, ...patch } : it)));
  }

  return (
    <div className="space-y-4">
      <button
        onClick={nieuw}
        className="flex items-center gap-2 bg-party hover:bg-party-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      >
        <Plus size={16} /> Nieuwe handleiding
      </button>

      {items.length === 0 && (
        <p className="text-slate-500 text-sm">Nog geen handleidingen. Voeg er een toe.</p>
      )}

      {items.map((it) => (
        <Rij
          key={it._key}
          item={it}
          producten={producten}
          onChange={(patch) => update(it._key, patch)}
          onWeg={() => setItems((prev) => prev.filter((x) => x._key !== it._key))}
          onOpgeslagen={(opgeslagen) => {
            update(it._key, { ...opgeslagen, _key: it._key } as Partial<Concept>);
            router.refresh();
          }}
        />
      ))}
    </div>
  );
}

function Rij({
  item,
  producten,
  onChange,
  onWeg,
  onOpgeslagen,
}: {
  item: Concept;
  producten: ProductOptie[];
  onChange: (patch: Partial<Concept>) => void;
  onWeg: () => void;
  onOpgeslagen: (h: Handleiding) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [uploadBezig, setUploadBezig] = useState(false);
  const [fout, setFout] = useState("");
  const isNieuw = !item.id;

  async function upload(file: File) {
    setUploadBezig(true);
    setFout("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("map", "handleidingen");
    fd.append("slug", (item.titel || "handleiding").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "handleiding");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setFout(data.error || "Upload mislukt");
      else onChange({ bestandUrl: data.url });
    } catch {
      setFout("Verbindingsfout bij uploaden");
    }
    setUploadBezig(false);
  }

  async function opslaan() {
    if (!item.titel?.trim()) {
      setFout("Titel is verplicht");
      return;
    }
    setBezig(true);
    setFout("");
    const body = {
      titel: item.titel,
      beschrijving: item.beschrijving || "",
      categorie: item.categorie || "Algemeen",
      bestandUrl: item.bestandUrl || "",
      productId: item.productId ?? null,
      volgorde: item.volgorde ?? 0,
    };
    try {
      const res = await fetch(isNieuw ? "/api/admin/handleidingen" : `/api/admin/handleidingen/${item.id}`, {
        method: isNieuw ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setFout(data.error || "Opslaan mislukt");
      else onOpgeslagen(data);
    } catch {
      setFout("Verbindingsfout bij opslaan");
    }
    setBezig(false);
  }

  async function verwijderen() {
    if (item.id && !confirm("Deze handleiding verwijderen?")) return;
    if (item.id) await fetch(`/api/admin/handleidingen/${item.id}`, { method: "DELETE" });
    onWeg();
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-600 text-xs block mb-1">Titel *</label>
          <input
            value={item.titel || ""}
            onChange={(e) => onChange({ titel: e.target.value })}
            className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
          />
        </div>
        <div>
          <label className="text-slate-600 text-xs block mb-1">Categorie</label>
          <select
            value={item.categorie || "Algemeen"}
            onChange={(e) => onChange({ categorie: e.target.value })}
            className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
          >
            {CATEGORIEEN.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-slate-600 text-xs block mb-1">Beschrijving (optioneel)</label>
        <textarea
          value={item.beschrijving || ""}
          onChange={(e) => onChange({ beschrijving: e.target.value })}
          rows={2}
          className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party resize-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-slate-600 text-xs block mb-1">Koppel aan product (optioneel)</label>
          <select
            value={item.productId ?? ""}
            onChange={(e) => onChange({ productId: e.target.value ? Number(e.target.value) : null })}
            className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
          >
            <option value="">— Geen (alleen op servicepagina) —</option>
            {producten.map((p) => (
              <option key={p.id} value={p.id}>{p.naam}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-600 text-xs block mb-1">Volgorde</label>
          <input
            type="number"
            value={item.volgorde ?? 0}
            onChange={(e) => onChange({ volgorde: Number(e.target.value) })}
            className="w-full bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-600 text-xs block mb-1">PDF / bestand</label>
        <div className="flex flex-wrap items-center gap-2">
          {item.bestandUrl ? (
            <a href={item.bestandUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-party text-sm hover:underline">
              <FileText size={14} /> Bekijk huidig bestand <ExternalLink size={12} />
            </a>
          ) : (
            <span className="text-slate-400 text-sm">Nog geen bestand</span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadBezig}
            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-dark-border text-slate-600 hover:text-party px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            {uploadBezig ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {item.bestandUrl ? "Vervang PDF" : "Upload PDF"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) upload(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </div>
        <input
          value={item.bestandUrl || ""}
          onChange={(e) => onChange({ bestandUrl: e.target.value })}
          placeholder="…of plak een link naar een PDF"
          className="w-full mt-2 bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party font-mono"
        />
      </div>

      {fout && <p className="text-red-500 text-xs">{fout}</p>}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={verwijderen}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm transition-colors"
        >
          <Trash2 size={14} /> Verwijderen
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
