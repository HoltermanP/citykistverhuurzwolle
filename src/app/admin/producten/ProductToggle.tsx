"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  beschikbaar: boolean;
}

export default function ProductToggle({ id, beschikbaar }: Props) {
  const [actief, setActief] = useState(beschikbaar);
  const [laden, setLaden] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLaden(true);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beschikbaar: !actief }),
    });
    if (res.ok) {
      setActief(!actief);
      router.refresh();
    }
    setLaden(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={laden}
      className={`flex-shrink-0 w-10 h-6 rounded-full transition-colors relative ${actief ? "bg-green-500" : "bg-slate-300"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${actief ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}
