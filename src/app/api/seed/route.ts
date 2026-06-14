export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { seed } from "@/lib/seed";

export async function POST() {
  try {
    await seed();
    return NextResponse.json({ success: true, message: "Database gevuld met producten." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Seed mislukt" }, { status: 500 });
  }
}
