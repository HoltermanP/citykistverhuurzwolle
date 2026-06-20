export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { vindActieveKortingscode } from "@/lib/kortingen";

// Publieke validatie: klant voert een code in bij het bestellen.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") || "";
  try {
    const korting = await vindActieveKortingscode(code);
    if (!korting) {
      return NextResponse.json({ geldig: false, error: "Ongeldige of verlopen kortingscode" }, { status: 200 });
    }
    return NextResponse.json({ geldig: true, code: korting.code, percentage: korting.percentage });
  } catch {
    return NextResponse.json({ geldig: false, error: "Server error" }, { status: 500 });
  }
}
