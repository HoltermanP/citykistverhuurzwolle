import { db } from "./db";
import { kortingscodes, Kortingscode } from "./schema";
import { and, eq } from "drizzle-orm";

export function normaliseerCode(code: string): string {
  return (code || "").trim().toUpperCase().replace(/\s+/g, "");
}

// Zoekt een actieve kortingscode op (hoofdletter-ongevoelig). Geeft null als de
// code niet bestaat of niet actief is.
export async function vindActieveKortingscode(code: string): Promise<Kortingscode | null> {
  const genormaliseerd = normaliseerCode(code);
  if (!genormaliseerd) return null;
  const [rij] = await db
    .select()
    .from(kortingscodes)
    .where(and(eq(kortingscodes.code, genormaliseerd), eq(kortingscodes.actief, true)));
  return rij || null;
}
