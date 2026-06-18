import { db } from "@/lib/db";
import { handleidingen, products } from "@/lib/schema";
import { asc } from "drizzle-orm";
import HandleidingenBeheer from "./HandleidingenBeheer";

export const dynamic = "force-dynamic";

export default async function AdminServicePage() {
  let lijst: (typeof handleidingen.$inferSelect)[] = [];
  let prods: { id: number; naam: string }[] = [];
  try {
    lijst = await db.select().from(handleidingen).orderBy(asc(handleidingen.volgorde));
    prods = await db
      .select({ id: products.id, naam: products.naam })
      .from(products)
      .orderBy(asc(products.naam));
  } catch {
    // DB nog niet geconfigureerd
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Service &amp; handleidingen</h1>
        <p className="text-slate-500 text-sm mt-1">
          Beheer de handleidingen op de servicepagina. Koppel een handleiding aan een product om
          deze ook bij dat artikel te tonen.
        </p>
      </div>
      <HandleidingenBeheer initieel={lijst} producten={prods} />
    </div>
  );
}
