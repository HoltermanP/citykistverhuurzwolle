export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { genereerFactuurPdf, factuurnummerVoor } from "@/lib/factuur";

// Levert de PDF-factuur van een bestelling. Gebruikt de opgeslagen factuur
// indien aanwezig; anders wordt 'm on-the-fly gegenereerd.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.id, Number(id)));
  if (!order) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

  const factuurnummer = factuurnummerVoor(order);
  const pdf = order.factuurPdf
    ? Buffer.from(order.factuurPdf, "base64")
    : Buffer.from(await genereerFactuurPdf({ ...order, factuurnummer }));

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factuur-${factuurnummer}.pdf"`,
    },
  });
}
