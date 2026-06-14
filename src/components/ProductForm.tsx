"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save, Upload, X, ImageIcon } from "lucide-react";

interface ProductFormData {
  naam: string;
  slug: string;
  categorie: string;
  beschrijving: string;
  kenmerken: string[];
  prijsPerDag: string;
  isKoop: boolean;
  beschikbaar: boolean;
  populair: boolean;
  volgorde: number;
  afbeeldingUrl: string;
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
    categorie: initieel?.categorie || "beamer",
    beschrijving: initieel?.beschrijving || "",
    kenmerken: initieel?.kenmerken || [],
    prijsPerDag: initieel?.prijsPerDag || "",
    isKoop: initieel?.isKoop || false,
    beschikbaar: initieel?.beschikbaar ?? true,
    populair: initieel?.populair || false,
    volgorde: initieel?.volgorde || 0,
    afbeeldingUrl: initieel?.afbeeldingUrl || "",
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

  async function handleUpload(file: File) {
    if (!form.slug) {
      setUploadError("Vul eerst de slug in voor je een foto uploadt.");
      return;
    }
    setUploadLaden(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", form.slug);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setUploadError(data.error || "Upload mislukt");
    } else {
      // Voeg cache-buster toe zodat een nieuwe upload direct zichtbaar is
      updateForm("afbeeldingUrl", data.url + "?t=" + Date.now());
    }
    setUploadLaden(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
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
        body: JSON.stringify(form),
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

          {/* Foto upload */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-party" />
              Productfoto
            </h3>

            {/* Preview */}
            {form.afbeeldingUrl ? (
              <div className="relative mb-3 rounded-xl overflow-hidden bg-dark border border-dark-border h-48 flex items-center justify-center group">
                <Image
                  src={form.afbeeldingUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-3"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => updateForm("afbeeldingUrl", "")}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-dark-border hover:border-party/50 rounded-xl h-36 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors mb-3 group"
              >
                {uploadLaden ? (
                  <Loader2 size={24} className="text-party animate-spin" />
                ) : (
                  <>
                    <Upload size={24} className="text-slate-400 group-hover:text-party transition-colors" />
                    <p className="text-slate-500 text-sm text-center">
                      Sleep een foto hierheen<br />
                      <span className="text-xs">of klik om te bladeren</span>
                    </p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Vervang foto knop als er al een is */}
            {form.afbeeldingUrl && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploadLaden}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-dark-border text-slate-600 hover:text-party px-4 py-2 rounded-xl text-sm transition-colors"
              >
                {uploadLaden ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadLaden ? "Uploaden..." : "Andere foto kiezen"}
              </button>
            )}

            {uploadError && (
              <p className="text-red-500 text-xs mt-2">{uploadError}</p>
            )}
            <p className="text-slate-400 text-xs mt-2">JPG, PNG, GIF of WebP — max. 5MB</p>
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
                  className={`w-10 h-6 rounded-full transition-colors relative ${form[field as keyof ProductFormData] ? "bg-green-500" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form[field as keyof ProductFormData] ? "translate-x-4" : "translate-x-0.5"}`} />
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
