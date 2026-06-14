export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  naam: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  categorie: z.string().min(1).optional(),
  beschrijving: z.string().optional(),
  kenmerken: z.array(z.string()).optional(),
  prijsPerDag: z.string().optional(),
  isKoop: z.boolean().optional(),
  beschikbaar: z.boolean().optional(),
  populair: z.boolean().optional(),
  volgorde: z.number().optional(),
  afbeeldingUrl: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const [updated] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(products).where(eq(products.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
