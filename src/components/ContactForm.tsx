"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ naam: "", email: "", telefoon: "", bericht: "" });
  const [laden, setLaden] = useState(false);
  const [succes, setSucces] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Er is iets misgegaan. Probeer opnieuw.");
      } else {
        setSucces(true);
      }
    } catch {
      setError("Verbindingsfout. Controleer je internet en probeer opnieuw.");
    } finally {
      setLaden(false);
    }
  }

  if (succes) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-1">Bericht verzonden!</h3>
        <p className="text-slate-600 text-sm">Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-4">
      <h2 className="text-slate-900 font-bold text-xl flex items-center gap-2">
        <Send size={18} className="text-party" />
        Stuur ons een bericht
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-600 text-sm block mb-1">Naam *</label>
          <input
            required
            type="text"
            value={form.naam}
            onChange={(e) => update("naam", e.target.value)}
            placeholder="Voor- en achternaam"
            className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-party"
          />
        </div>
        <div>
          <label className="text-slate-600 text-sm block mb-1">Telefoon</label>
          <input
            type="tel"
            value={form.telefoon}
            onChange={(e) => update("telefoon", e.target.value)}
            placeholder="06-12345678"
            className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-party"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-600 text-sm block mb-1">E-mailadres *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="jouw@email.nl"
          className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-party"
        />
      </div>

      <div>
        <label className="text-slate-600 text-sm block mb-1">Bericht *</label>
        <textarea
          required
          value={form.bericht}
          onChange={(e) => update("bericht", e.target.value)}
          placeholder="Waarmee kunnen we je helpen?"
          rows={4}
          className="w-full bg-dark border border-dark-border rounded-xl px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-party resize-none"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={laden}
        className="w-full bg-gradient-party hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-opacity flex items-center justify-center gap-2"
      >
        {laden ? (
          <><Loader2 className="animate-spin" size={18} /> Verzenden...</>
        ) : (
          <><Send size={16} /> Bericht versturen</>
        )}
      </button>
    </form>
  );
}
