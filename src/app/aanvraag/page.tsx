"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle, ShoppingCart, Trash2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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
  const [succes, setSucces] = useState(false);
  const [error, setError] = useState("");
  const [laden, setLaden] = useState(false);

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
          ophaaldatum: startDatums[0],
          retourdatum: eindDatums[eindDatums.length - 1],
          items,
          totaal: totaalPrijs,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er is iets misgegaan. Probeer opnieuw.");
      } else {
        setSucces(true);
        leegMaken();
      }
    } catch {
      setError("Verbindingsfout. Controleer je internet en probeer opnieuw.");
    } finally {
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
        <h1 className="text-slate-900 font-black text-3xl">
          Aanvraag <span className="text-transparent bg-clip-text bg-gradient-party">indienen</span>
        </h1>
        <p className="text-slate-600 mt-1">Vul je gegevens in en wij nemen contact op ter bevestiging.</p>
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
            ) : (
              "Aanvraag versturen →"
            )}
          </button>
          <p className="text-slate-400 text-xs text-center">
            Geen online betaling vereist. Betaling achteraf na bevestiging.
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600">Totaal (excl. BTW)</span>
                    <span className="text-slate-900 font-black text-2xl">€{totaalPrijs.toFixed(2)}</span>
                  </div>
                  <p className="text-slate-400 text-xs">Definitief bedrag na bevestiging</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
