export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kortingscodes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1).optional(),
  percentage: z.number().int().min(1).max(100).optional(),
  actief: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = schema.parse(await req.json());
    const patch: Record<string, unknown> = { ...data };
    if (typeof data.code === "string") patch.code = data.code.trim().toUpperCase().replace(/\s+/g, "");
    const [rij] = await db
      .update(kortingscodes)
      .set(patch)
      .where(eq(kortingscodes.id, Number(id)))
      .returning();
    if (!rij) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json(rij);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Deze code bestaat al" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(kortingscodes).where(eq(kortingscodes.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
