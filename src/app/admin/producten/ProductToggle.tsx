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
      className={`flex-shrink-0 inline-flex items-center w-11 h-6 px-0.5 rounded-full transition-colors ${actief ? "bg-green-500" : "bg-slate-300"}`}
    >
      <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${actief ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
