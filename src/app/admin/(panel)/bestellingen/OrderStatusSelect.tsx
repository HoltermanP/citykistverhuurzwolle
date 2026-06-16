"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  status: string;
}

const STATUSSEN = ["nieuw", "bevestigd", "geleverd", "afgerond", "geannuleerd"];

const STATUS_KLEUR: Record<string, string> = {
  nieuw: "bg-green-100 text-green-700 border-green-300",
  bevestigd: "bg-blue-100 text-blue-700 border-blue-300",
  geleverd: "bg-purple-100 text-purple-700 border-purple-300",
  afgerond: "bg-slate-100 text-slate-500 border-slate-300",
  geannuleerd: "bg-red-100 text-red-700 border-red-300",
};

export default function OrderStatusSelect({ id, status }: Props) {
  const [huidigStatus, setHuidigStatus] = useState(status);
  const router = useRouter();

  async function handleChange(nieuwStatus: string) {
    setHuidigStatus(nieuwStatus);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nieuwStatus }),
    });
    router.refresh();
  }

  return (
    <select
      value={huidigStatus}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${STATUS_KLEUR[huidigStatus] || STATUS_KLEUR.nieuw}`}
    >
      {STATUSSEN.map((s) => (
        <option key={s} value={s} className="bg-white text-slate-900">
          {s}
        </option>
      ))}
    </select>
  );
}
