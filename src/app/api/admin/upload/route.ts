export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB = 5;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = (formData.get("slug") as string | null)?.trim();

    if (!file) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Geen slug opgegeven" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Alleen JPG, PNG, GIF of WebP toegestaan" }, { status: 400 });
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Bestand mag maximaal ${MAX_MB}MB zijn` }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${slug}.${ext}`;
    const dir = path.join(process.cwd(), "public", "images", "producten");
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/images/producten/${filename}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload mislukt" }, { status: 500 });
  }
}
