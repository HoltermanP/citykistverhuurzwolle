"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  id: number;
  naam: string;
}

export default function DeleteOrderButton({ id, naam }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verwijder() {
    setBezig(true);
    setFout(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFout(data.error || "Verwijderen mislukt");
        setBezig(false);
        return;
      }
      setOpen(false);
      setBezig(false);
      router.refresh();
    } catch {
      setFout("Verbinding mislukt. Probeer opnieuw.");
      setBezig(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          title="Bestelling verwijderen"
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-600 border border-dark-border hover:border-red-200 hover:bg-red-50 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bestelling #{id} verwijderen?</AlertDialogTitle>
          <AlertDialogDescription>
            Je staat op het punt de bestelling van <strong>{naam}</strong> definitief te
            verwijderen. Deze actie kan niet ongedaan worden gemaakt.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {fout && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {fout}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={bezig}>Annuleren</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              verwijder();
            }}
            disabled={bezig}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
          >
            {bezig ? (
              <>
                <Loader2 className="animate-spin" /> Verwijderen…
              </>
            ) : (
              "Definitief verwijderen"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
