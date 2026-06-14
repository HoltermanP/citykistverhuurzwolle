export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  naam: z.string().min(2),
  email: z.string().email(),
  telefoon: z.string().optional().default(""),
  bericht: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);
    await sendContactEmail(data);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validatie mislukt", details: err.issues }, { status: 400 });
    }
    console.error("Contactmail error:", err);
    return NextResponse.json({ error: "Versturen mislukt. Probeer het later opnieuw." }, { status: 500 });
  }
}
