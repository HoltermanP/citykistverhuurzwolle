export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const AFBEELDINGEN = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const DOCUMENTEN = ["application/pdf"];
const MAX_MB_AFBEELDING = 5;
const MAX_MB_DOCUMENT = 25;

export async function POST(req: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Opslag niet geconfigureerd (BLOB_READ_WRITE_TOKEN ontbreekt)." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const slug = (formData.get("slug") as string | null)?.trim() || "bestand";
    // Doelmap binnen de blob-store (bv. "producten" of "handleidingen").
    const map = ((formData.get("map") as string | null)?.trim() || "producten").replace(/[^a-z0-9-]/gi, "");
    const files = [...formData.getAll("files"), ...formData.getAll("file")].filter(
      (f): f is File => f instanceof File
    );

    if (files.length === 0) return NextResponse.json({ error: "Geen bestand" }, { status: 400 });

    for (const file of files) {
      const isAfbeelding = AFBEELDINGEN.includes(file.type);
      const isDocument = DOCUMENTEN.includes(file.type);
      if (!isAfbeelding && !isDocument) {
        return NextResponse.json({ error: "Alleen afbeeldingen (JPG/PNG/GIF/WebP) of PDF toegestaan" }, { status: 400 });
      }
      const maxMb = isDocument ? MAX_MB_DOCUMENT : MAX_MB_AFBEELDING;
      if (file.size > maxMb * 1024 * 1024) {
        return NextResponse.json({ error: `Bestand mag maximaal ${maxMb}MB zijn` }, { status: 400 });
      }
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const blob = await put(`${map}/${slug}.${ext}`, file, {
          access: "public",
          addRandomSuffix: true,
          contentType: file.type,
        });
        return blob.url;
      })
    );

    return NextResponse.json({ urls, url: urls[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload mislukt" }, { status: 500 });
  }
}
