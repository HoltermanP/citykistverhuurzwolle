export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handleidingen } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  try {
    const rows = await db.select().from(handleidingen).orderBy(asc(handleidingen.volgorde));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

const schema = z.object({
  titel: z.string().min(1),
  beschrijving: z.string().optional().default(""),
  categorie: z.string().optional().default("Algemeen"),
  bestandUrl: z.string().optional().default(""),
  productId: z.number().nullable().optional(),
  volgorde: z.number().optional().default(0),
});

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());
    const [rij] = await db.insert(handleidingen).values(data).returning();
    return NextResponse.json(rij, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
