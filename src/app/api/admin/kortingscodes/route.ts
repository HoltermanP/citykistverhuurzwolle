export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { kortingscodes } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  try {
    const rows = await db.select().from(kortingscodes).orderBy(desc(kortingscodes.createdAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

const schema = z.object({
  code: z.string().min(1),
  percentage: z.number().int().min(1).max(100),
  actief: z.boolean().optional().default(true),
});

// Normaliseer naar hoofdletters zonder spaties zodat de invoer hoofdletter-
// ongevoelig werkt.
function normaliseer(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());
    const code = normaliseer(data.code);
    if (!code) return NextResponse.json({ error: "Code mag niet leeg zijn" }, { status: 400 });
    const [rij] = await db
      .insert(kortingscodes)
      .values({ code, percentage: data.percentage, actief: data.actief })
      .returning();
    return NextResponse.json(rij, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    // Unieke-constraint schending → code bestaat al.
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Deze code bestaat al" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
