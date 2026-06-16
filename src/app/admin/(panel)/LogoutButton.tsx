"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const [bezig, setBezig] = useState(false);

  async function uitloggen() {
    setBezig(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Ook bij netwerkfout doorgaan: cookie is httpOnly, server moet 'm wissen.
    }
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={uitloggen}
      disabled={bezig}
      className="flex items-center gap-2 text-slate-500 hover:text-red-600 text-xs px-3 py-2 transition-colors disabled:opacity-50"
    >
      <LogOut size={14} />
      {bezig ? "Uitloggen…" : "Uitloggen"}
    </button>
  );
}
