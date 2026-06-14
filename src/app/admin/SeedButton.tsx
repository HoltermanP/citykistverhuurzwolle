"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";

export default function SeedButton() {
  const [laden, setLaden] = useState(false);
  const [bericht, setBericht] = useState("");

  async function handleSeed() {
    setLaden(true);
    setBericht("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setBericht(data.success ? "✅ " + data.message : "❌ " + data.error);
    } catch {
      setBericht("❌ Verbindingsfout");
    } finally {
      setLaden(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSeed}
        disabled={laden}
        className="flex items-center gap-2 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 text-cyan-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
      >
        {laden ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
        {laden ? "Seeden..." : "Database seeden (producten laden)"}
      </button>
      {bericht && (
        <p className="text-slate-600 text-xs mt-2">{bericht}</p>
      )}
    </div>
  );
}
