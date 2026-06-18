export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB = 5;

export async function POST(req: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Opslag niet geconfigureerd (BLOB_READ_WRITE_TOKEN ontbreekt)." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const slug = (formData.get("slug") as string | null)?.trim();
    // Ondersteun zowel meerdere ("files") als één ("file") bestand.
    const files = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ].filter((f): f is File => f instanceof File);

    if (files.length === 0) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
    if (!slug) return NextResponse.json({ error: "Geen slug opgegeven" }, { status: 400 });

    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: "Alleen JPG, PNG, GIF of WebP toegestaan" }, { status: 400 });
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        return NextResponse.json({ error: `Elk bestand mag maximaal ${MAX_MB}MB zijn` }, { status: 400 });
      }
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const blob = await put(`producten/${slug}.${ext}`, file, {
          access: "public",
          addRandomSuffix: true, // uniek per upload — meerdere foto's per product
          contentType: file.type,
        });
        return blob.url;
      })
    );

    // 'url' voor enkele upload (achterwaarts compatibel), 'urls' voor meerdere.
    return NextResponse.json({ urls, url: urls[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload mislukt" }, { status: 500 });
  }
}
