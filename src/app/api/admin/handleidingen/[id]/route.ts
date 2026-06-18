export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handleidingen } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  titel: z.string().min(1).optional(),
  beschrijving: z.string().optional(),
  categorie: z.string().optional(),
  bestandUrl: z.string().optional(),
  productId: z.number().nullable().optional(),
  volgorde: z.number().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = schema.parse(await req.json());
    const [rij] = await db
      .update(handleidingen)
      .set(data)
      .where(eq(handleidingen.id, Number(id)))
      .returning();
    if (!rij) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json(rij);
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
    await db.delete(handleidingen).where(eq(handleidingen.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
