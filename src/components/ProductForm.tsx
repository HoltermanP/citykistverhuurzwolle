"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save, Upload, X, ImageIcon } from "lucide-react";

interface ProductFormData {
  naam: string;
  slug: string;
  artikelnummer: string;
  categorie: string;
  beschrijving: string;
  kenmerken: string[];
  prijsPerDag: string;
  isKoop: boolean;
  beschikbaar: boolean;
  populair: boolean;
  volgorde: number;
  afbeeldingen: string[];
}

interface Props {
  initieel?: Partial<ProductFormData> & { id?: number };
  mode: "nieuw" | "bewerken";
}

const CATEGORIEN = [
  { id: "beamer", naam: "📽️ Beamers & Schermen" },
  { id: "audio", naam: "🔊 Geluid & Speakers" },
  { id: "karaoke", naam: "🎤 Karaoke" },
  { id: "verlichting", naam: "💡 Verlichting" },
  { id: "effecten", naam: "🌫️ Rook & Bellen" },
  { id: "accessoires", naam: "🔌 Accessoires" },
  { id: "glow-in-the-dark", naam: "🪩 Glow in the Dark" },
];

function naarSlug(naam: string): string {
  return naam
    .toLowerCase()
    .replace(/[àáäâ]/g, "a")
    .replace(/[èéëê]/g, "e")
    .replace(/[ìíïî]/g, "i")
    .replace(/[òóöô]/g, "o")
    .replace(/[ùúüû]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProductForm({ initieel, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [laden, setLaden] = useState(false);
  const [uploadLaden, setUploadLaden] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState<ProductFormData>({
    naam: initieel?.naam || "",
    slug: initieel?.slug || "",
    artikelnummer: initieel?.artikelnummer || "",
    categorie: initieel?.categorie || "beamer",
    beschrijving: initieel?.beschrijving || "",
    kenmerken: initieel?.kenmerken || [],
    prijsPerDag: initieel?.prijsPerDag || "",
    isKoop: initieel?.isKoop || false,
    beschikbaar: initieel?.beschikbaar ?? true,
    populair: initieel?.populair || false,
    volgorde: initieel?.volgorde || 0,
    afbeeldingen: initieel?.afbeeldingen || [],
  });
  const [nieuwKenmerk, setNieuwKenmerk] = useState("");

  function updateForm<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "naam" && !initieel?.slug ? { slug: naarSlug(value as string) } : {}),
    }));
  }

  function voegKenmerkToe() {
    if (!nieuwKenmerk.trim()) return;
    updateForm("kenmerken", [...form.kenmerken, nieuwKenmerk.trim()]);
    setNieuwKenmerk("");
  }

  function verwijderKenmerk(i: number) {
    updateForm("kenmerken", form.kenmerken.filter((_, idx) => idx !== i));
  }

  async function handleUpload(files: FileList | File[]) {
    if (!form.slug) {
      setUploadError("Vul eerst de slug in voor je foto's uploadt.");
      return;
    }
    const lijst = Array.from(files);
    if (lijst.length === 0) return;

    setUploadLaden(true);
    setUploadError("");

    const fd = new FormData();
    lijst.forEach((f) => fd.append("files", f));
    fd.append("slug", form.slug);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload mislukt");
      } else {
        const nieuwe: string[] = data.urls || (data.url ? [data.url] : []);
        setForm((prev) => ({ ...prev, afbeeldingen: [...prev.afbeeldingen, ...nieuwe] }));
      }
    } catch {
      setUploadError("Verbindingsfout bij het uploaden.");
    }
    setUploadLaden(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleUpload(e.target.files);
    e.target.value = ""; // reset zodat dezelfde foto opnieuw gekozen kan worden
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files);
  }

  function verwijderAfbeelding(i: number) {
    setForm((prev) => ({ ...prev, afbeeldingen: prev.afbeeldingen.filter((_, idx) => idx !== i) }));
  }

  function maakHoofdfoto(i: number) {
    setForm((prev) => {
      const arr = [...prev.afbeeldingen];
      const [gekozen] = arr.splice(i, 1);
      return { ...prev, afbeeldingen: [gekozen, ...arr] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setError("");

    try {
      const url = mode === "nieuw" ? "/api/admin/products" : `/api/admin/products/${initieel!.id}`;
      const method = mode === "nieuw" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, afbeeldingUrl: form.afbeeldingen[0] || "" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Er is iets misgegaan");
        return;
      }

      router.push("/admin/producten");
      router.refresh();
    } catch {
      setError("Verbindingsfout. Probeer opnieuw.");
    } finally {
      setLaden(false);
    }
  }

  async function handleVerwijderen() {
    if (!confirm("Weet je zeker dat je dit product wilt verwijderen?")) return;
    setLaden(true);
    await fetch(`/api/admin/products/${initieel!.id}`, { method: "DELETE" });
    router.push("/admin/producten");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Linkse kolom */}
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
            <h3 className="text-slate-900 font-semibold">Productinformatie</h3>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Naam *</label>
              <input required value={form.naam} onChange={(e) => updateForm("naam", e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party" />
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Slug (URL) *</label>
              <input required value={form.slug} onChange={(e) => updateForm("slug", e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party font-mono" />
              <p className="text-slate-400 text-xs mt-1">Wordt gebruikt als bestandsnaam voor de foto</p>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Artikelnummer</label>
              <input value={form.artikelnummer} onChange={(e) => updateForm("artikelnummer", e.target.value)}
                placeholder="bijv. 82"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party" />
              <p className="text-slate-400 text-xs mt-1">Wordt op de productpagina getoond als &quot;Artikelnr.&quot;</p>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Categorie *</label>
              <select value={form.categorie} onChange={(e) => updateForm("categorie", e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party">
                {CATEGORIEN.map((c) => <option key={c.id} value={c.id}>{c.naam}</option>)}
              </select>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Prijs (excl. BTW) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                <input required type="number" step="0.01" min="0" value={form.prijsPerDag}
                  onChange={(e) => updateForm("prijsPerDag", e.target.value)}
                  className="w-full bg-dark border border-dark-border rounded-xl pl-7 pr-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party" />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Beschrijving</label>
              <textarea value={form.beschrijving} onChange={(e) => updateForm("beschrijving", e.target.value)}
                rows={3} className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party resize-none" />
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Volgorde</label>
              <input type="number" value={form.volgorde} onChange={(e) => updateForm("volgorde", Number(e.target.value))}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-party" />
            </div>
          </div>

          {/* Foto's upload */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-party" />
              Productfoto&apos;s
              {form.afbeeldingen.length > 0 && (
                <span className="text-slate-400 text-sm font-normal">({form.afbeeldingen.length})</span>
              )}
            </h3>

            {/* Preview-grid */}
            {form.afbeeldingen.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {form.afbeeldingen.map((url, i) => (
                  <div
                    key={url}
                    className="relative rounded-xl overflow-hidden bg-dark border border-dark-border aspect-square flex items-center justify-center group"
                  >
                    <Image src={url} alt={`Foto ${i + 1}`} fill className="object-contain p-2" unoptimized />
                    {i === 0 ? (
                      <span className="absolute top-1 left-1 bg-party text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Hoofdfoto
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => maakHoofdfoto(i)}
                        title="Als hoofdfoto instellen"
                        className="absolute top-1 left-1 bg-white/90 hover:bg-white text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Hoofdfoto
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => verwijderAfbeelding(i)}
                      title="Verwijderen"
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropzone (altijd zichtbaar om bij te uploaden) */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-dark-border hover:border-party/50 rounded-xl h-28 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group"
            >
              {uploadLaden ? (
                <Loader2 size={22} className="text-party animate-spin" />
              ) : (
                <>
                  <Upload size={22} className="text-slate-400 group-hover:text-party transition-colors" />
                  <p className="text-slate-500 text-sm text-center">
                    Sleep foto&apos;s hierheen<br />
                    <span className="text-xs">of klik om te bladeren (meerdere mogelijk)</span>
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
            <p className="text-slate-400 text-xs mt-2">JPG, PNG, GIF of WebP — max. 5MB per foto. De eerste foto is de hoofdfoto.</p>
          </div>
        </div>

        {/* Rechtse kolom */}
        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
            <h3 className="text-slate-900 font-semibold">Opties</h3>

            {[
              { field: "beschikbaar", label: "Beschikbaar", desc: "Product tonen op de website" },
              { field: "populair", label: "Populair", desc: "Tonen in populaire producten" },
              { field: "isKoop", label: "Koop artikel", desc: "Dit is een koopartikel (niet huur)" },
            ].map(({ field, label, desc }) => (
              <label key={field} className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-slate-900 text-sm font-medium">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateForm(field as keyof ProductFormData, !form[field as keyof ProductFormData] as any)}
                  className={`flex-shrink-0 inline-flex items-center w-11 h-6 px-0.5 rounded-full transition-colors ${form[field as keyof ProductFormData] ? "bg-green-500" : "bg-slate-300"}`}
                >
                  <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${form[field as keyof ProductFormData] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </label>
            ))}
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="text-slate-900 font-semibold mb-3">Kenmerken</h3>
            <div className="space-y-2 mb-3">
              {form.kenmerken.map((k, i) => (
                <div key={i} className="flex items-center gap-2 bg-dark border border-dark-border rounded-lg px-3 py-1.5">
                  <span className="text-slate-700 text-sm flex-1">{k}</span>
                  <button type="button" onClick={() => verwijderKenmerk(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nieuwKenmerk}
                onChange={(e) => setNieuwKenmerk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), voegKenmerkToe())}
                placeholder="Nieuw kenmerk..."
                className="flex-1 bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-party"
              />
              <button type="button" onClick={voegKenmerkToe} className="bg-party hover:bg-party-dark text-white w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between">
        {mode === "bewerken" && (
          <button type="button" onClick={handleVerwijderen} disabled={laden}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Trash2 size={15} />
            Verwijderen
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button type="button" onClick={() => router.back()} className="bg-slate-50 hover:bg-slate-100 border border-dark-border text-slate-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Annuleren
          </button>
          <button type="submit" disabled={laden || uploadLaden}
            className="flex items-center gap-2 bg-party hover:bg-party-dark disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            {laden ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {mode === "nieuw" ? "Product opslaan" : "Wijzigingen opslaan"}
          </button>
        </div>
      </div>
    </form>
  );
}
