export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, verhuringen } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status } = await req.json();
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, Number(id)))
      .returning();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: "Ongeldig bestelnummer" }, { status: 400 });
  }
  try {
    const [verwijderd] = await db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id });
    if (!verwijderd) {
      return NextResponse.json({ error: "Bestelling niet gevonden" }, { status: 404 });
    }
    // Bijbehorende verhuurperiodes vrijgeven zodat de producten weer
    // beschikbaar zijn op die data.
    await db.delete(verhuringen).where(eq(verhuringen.orderId, orderId));
    return NextResponse.json({ success: true, id: verwijderd.id });
  } catch (err) {
    console.error("[admin/orders DELETE] mislukt:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
