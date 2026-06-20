"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { bedragen } from "@/lib/btw";
import { CheckCircle, ShoppingCart, Trash2, ArrowLeft, Loader2, AlertCircle, Banknote, Wallet, Tag, X } from "lucide-react";
import Link from "next/link";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export default function AanvraagPage() {
  const { state, verwijder, leegMaken, totaalPrijs } = useCart();
  const [form, setForm] = useState({
    naam: "", email: "", telefoon: "",
    adres: "", postcode: "", stad: "",
    notities: "",
  });
  const [betaalmethode, setBetaalmethode] = useState<"ideal" | "contant">("ideal");
  const [succes, setSucces] = useState(false);
  const [error, setError] = useState("");
  const [laden, setLaden] = useState(false);

  // Kortingscode
  const [codeInput, setCodeInput] = useState("");
  const [korting, setKorting] = useState<{ code: string; percentage: number } | null>(null);
  const [kortingError, setKortingError] = useState("");
  const [kortingLaden, setKortingLaden] = useState(false);

  const totalen = bedragen(totaalPrijs, korting?.percentage || 0);

  async function pasCodeToe() {
    const code = codeInput.trim();
    if (!code) return;
    setKortingLaden(true);
    setKortingError("");
    try {
      const res = await fetch(`/api/kortingscode?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.geldig) {
        setKorting({ code: data.code, percentage: data.percentage });
        setCodeInput(data.code);
      } else {
        setKorting(null);
        setKortingError(data.error || "Ongeldige kortingscode");
      }
    } catch {
      setKortingError("Kon de code niet controleren. Probeer opnieuw.");
    }
    setKortingLaden(false);
  }

  function verwijderKorting() {
    setKorting(null);
    setCodeInput("");
    setKortingError("");
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.items.length === 0) {
      setError("Voeg eerst producten toe aan je aanvraag.");
      return;
    }
    setLaden(true);
    setError("");

    const items = state.items.map((item) => {
      const dagen = Math.max(1, Math.ceil(
        (new Date(item.eindDatum).getTime() - new Date(item.startDatum).getTime()) / 86400000
      ));
      return {
        productId: item.product.id,
        productNaam: item.product.naam,
        prijsPerDag: Number(item.product.prijsPerDag),
        aantal: item.aantal,
        dagen,
        subtotaal: item.totaalprijs,
        startDatum: item.startDatum,
        eindDatum: item.eindDatum,
      };
    });

    // Gebruik de vroegste startdatum en laatste einddatum als globale datums
    const startDatums = state.items.map((i) => i.startDatum).sort();
    const eindDatums = state.items.map((i) => i.eindDatum).sort();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          betaalmethode,
          kortingCode: korting?.code || "",
          ophaaldatum: startDatums[0],
          retourdatum: eindDatums[eindDatums.length - 1],
          items,
          totaal: totalen.incl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er is iets misgegaan. Probeer opnieuw.");
        setLaden(false);
        return;
      }

      if (data.checkoutUrl) {
        // iDEAL: stuur de klant door naar de Mollie-betaalpagina.
        leegMaken();
        window.location.href = data.checkoutUrl;
        return;
      }

      // Contant: direct bevestiging tonen.
      setSucces(true);
      leegMaken();
      setLaden(false);
    } catch {
      setError("Verbindingsfout. Controleer je internet en probeer opnieuw.");
      setLaden(false);
    }
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-slate-900 font-black text-3xl mb-3">Aanvraag verzonden!</h1>
          <p className="text-slate-600 leading-relaxed mb-6">
            Bedankt voor je aanvraag. We nemen zo snel mogelijk contact op ter bevestiging. Controleer ook je e-mail voor een bevestiging.
          </p>
          <Link href="/producten" className="bg-gradient-party text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity inline-block">
            Terug naar producten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Link href="/producten" className="flex items-center gap-2 text-slate-600 hover:text-party text-sm mb-4 transition-colors">
          <ArrowLeft size={16} />
          Terug naar producten
        </Link>
        <span className="inline-block text-party font-bold text-sm uppercase tracking-wider mb-1">Bijna klaar</span>
        <h1 className="text-slate-900 font-black text-3xl md:text-4xl">
          Aanvraag <span className="text-transparent bg-clip-text bg-gradient-party">indienen</span>
        </h1>
        <p className="text-slate-600 mt-2">Vul je gegevens in en wij nemen contact op ter bevestiging.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulier */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
            <h2 className="text-slate-900 font-bold text-lg">Jouw gegevens</h2>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Naam *</label>
              <input
                required
                type="text"
                value={form.naam}
                onChange={(e) => updateForm("naam", e.target.value)}
                placeholder="Voor- en achternaam"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 text-sm block mb-1">E-mailadres *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="jouw@email.nl"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm block mb-1">Telefoonnummer *</label>
                <input
                  required
                  type="tel"
                  value={form.telefoon}
                  onChange={(e) => updateForm("telefoon", e.target.value)}
                  placeholder="06-12345678"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Adres</label>
              <input
                type="text"
                value={form.adres}
                onChange={(e) => updateForm("adres", e.target.value)}
                placeholder="Straatnaam en huisnummer"
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 text-sm block mb-1">Postcode</label>
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(e) => updateForm("postcode", e.target.value)}
                  placeholder="1234 AB"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm block mb-1">Stad</label>
                <input
                  type="text"
                  value={form.stad}
                  onChange={(e) => updateForm("stad", e.target.value)}
                  placeholder="Zwolle"
                  className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 text-sm block mb-1">Opmerkingen</label>
              <textarea
                value={form.notities}
                onChange={(e) => updateForm("notities", e.target.value)}
                placeholder="Eventuele vragen of bijzonderheden..."
                rows={3}
                className="w-full bg-dark border border-dark-border rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-party resize-none"
              />
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3">
            <h2 className="text-slate-900 font-bold text-lg">Betaalwijze</h2>
            <button
              type="button"
              onClick={() => setBetaalmethode("ideal")}
              className={`w-full flex items-center gap-3 text-left p-4 rounded-xl border transition-colors ${
                betaalmethode === "ideal" ? "border-party bg-party/5" : "border-dark-border hover:border-party/50"
              }`}
            >
              <Wallet className={betaalmethode === "ideal" ? "text-party" : "text-slate-400"} size={22} />
              <span className="flex-1">
                <span className="block text-slate-900 font-semibold">iDEAL — direct online betalen</span>
                <span className="block text-slate-500 text-sm">Veilig afrekenen via je eigen bank.</span>
              </span>
              <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${betaalmethode === "ideal" ? "border-party bg-party" : "border-slate-300"}`} />
            </button>
            <button
              type="button"
              onClick={() => setBetaalmethode("contant")}
              className={`w-full flex items-center gap-3 text-left p-4 rounded-xl border transition-colors ${
                betaalmethode === "contant" ? "border-party bg-party/5" : "border-dark-border hover:border-party/50"
              }`}
            >
              <Banknote className={betaalmethode === "contant" ? "text-party" : "text-slate-400"} size={22} />
              <span className="flex-1">
                <span className="block text-slate-900 font-semibold">Contant bij het ophalen</span>
                <span className="block text-slate-500 text-sm">Betaal ter plaatse wanneer je de spullen ophaalt.</span>
              </span>
              <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${betaalmethode === "contant" ? "border-party bg-party" : "border-slate-300"}`} />
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={laden || state.items.length === 0}
            className="w-full bg-gradient-party hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-opacity flex items-center justify-center gap-2"
          >
            {laden ? (
              <><Loader2 className="animate-spin" size={20} /> Verzenden...</>
            ) : betaalmethode === "ideal" ? (
              "Betalen met iDEAL →"
            ) : (
              "Aanvraag versturen →"
            )}
          </button>
          <p className="text-slate-400 text-xs text-center">
            {betaalmethode === "ideal"
              ? "Je betaalt direct online via iDEAL. We nemen daarna contact op ter bevestiging."
              : "Je betaalt contant bij het ophalen. We nemen contact op ter bevestiging."}
          </p>
        </form>

        {/* Overzicht */}
        <div>
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingCart className="text-party" size={20} />
              <h2 className="text-slate-900 font-bold text-lg">Jouw Aanvraag</h2>
              <span className="text-slate-500 text-sm">({state.items.length} artikel{state.items.length !== 1 ? "en" : ""})</span>
            </div>

            {state.items.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-slate-600 text-sm">Nog geen producten toegevoegd</p>
                <Link href="/producten" className="text-party text-sm hover:underline mt-2 inline-block">
                  Bekijk producten →
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5">
                  {state.items.map((item) => {
                    const dagen = Math.max(1, Math.ceil(
                      (new Date(item.eindDatum).getTime() - new Date(item.startDatum).getTime()) / 86400000
                    ));
                    return (
                      <div key={item.product.id} className="flex items-start gap-3 p-3 bg-dark rounded-xl border border-dark-border">
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 text-sm font-medium truncate">{item.product.naam}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {item.aantal}x · {formatDate(item.startDatum)} – {formatDate(item.eindDatum)}
                          </p>
                          <p className="text-slate-500 text-xs">{dagen} dag{dagen !== 1 ? "en" : ""} × €{Number(item.product.prijsPerDag).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-party font-bold text-sm">€{item.totaalprijs.toFixed(2)}</span>
                          <button onClick={() => verwijder(item.product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-dark-border pt-4">
                  {/* Kortingscode */}
                  {korting ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-3">
                      <span className="text-green-700 text-sm font-medium flex items-center gap-1.5">
                        <Tag size={14} /> Code {korting.code} toegepast (−{korting.percentage}%)
                      </span>
                      <button type="button" onClick={verwijderKorting} className="text-green-700 hover:text-green-900">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <div className="flex gap-2">
                        <input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pasCodeToe(); } }}
                          placeholder="Kortingscode"
                          className="flex-1 bg-dark border border-dark-border rounded-xl px-3 py-2 text-slate-900 text-sm font-mono uppercase placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-party"
                        />
                        <button
                          type="button"
                          onClick={pasCodeToe}
                          disabled={kortingLaden || !codeInput.trim()}
                          className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                        >
                          {kortingLaden ? <Loader2 size={15} className="animate-spin" /> : "Toepassen"}
                        </button>
                      </div>
                      {kortingError && <p className="text-red-500 text-xs mt-1">{kortingError}</p>}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Subtotaal (excl. BTW)</span>
                      <span className="text-slate-700">€{totalen.excl.toFixed(2)}</span>
                    </div>
                    {korting && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Korting ({korting.percentage}%)</span>
                        <span className="text-green-700">−€{totalen.korting.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">BTW 21%</span>
                      <span className="text-slate-700">€{totalen.btw.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-border">
                      <span className="text-slate-900 font-semibold">Totaal (incl. BTW)</span>
                      <span className="text-slate-900 font-black text-2xl">€{totalen.incl.toFixed(2)}</span>
                    </div>
                    <p className="text-slate-400 text-xs pt-1">Definitief bedrag na bevestiging</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
