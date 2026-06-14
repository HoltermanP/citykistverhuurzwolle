export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  try {
    const rows = await db.select().from(products).orderBy(asc(products.categorie), asc(products.naam));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

const productSchema = z.object({
  naam: z.string().min(1),
  slug: z.string().min(1),
  categorie: z.string().min(1),
  beschrijving: z.string().optional().default(""),
  kenmerken: z.array(z.string()).optional().default([]),
  prijsPerDag: z.string(),
  isKoop: z.boolean().optional().default(false),
  beschikbaar: z.boolean().optional().default(true),
  populair: z.boolean().optional().default(false),
  volgorde: z.number().optional().default(0),
  afbeeldingUrl: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    const [product] = await db.insert(products).values(data).returning();
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
