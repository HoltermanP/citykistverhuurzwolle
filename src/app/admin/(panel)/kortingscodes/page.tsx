import { db } from "@/lib/db";
import { kortingscodes } from "@/lib/schema";
import { desc } from "drizzle-orm";
import KortingscodesBeheer from "./KortingscodesBeheer";

export const dynamic = "force-dynamic";

export default async function AdminKortingscodesPage() {
  let lijst: (typeof kortingscodes.$inferSelect)[] = [];
  try {
    lijst = await db.select().from(kortingscodes).orderBy(desc(kortingscodes.createdAt));
  } catch {
    // DB nog niet geconfigureerd
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Kortingscodes</h1>
        <p className="text-slate-500 text-sm mt-1">
          Klanten kunnen een actieve code invoeren bij het bestellen. De korting geldt op het
          totaal (excl. BTW). Zet een code op inactief om hem tijdelijk uit te schakelen.
        </p>
      </div>
      <KortingscodesBeheer initieel={lijst} />
    </div>
  );
}
