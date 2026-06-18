import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import { AV_META, AV_ARTIKELEN } from "@/lib/algemene-voorwaarden";

// Genereert de algemene voorwaarden als nette, gepagineerde A4-PDF.
// Bron is src/lib/algemene-voorwaarden.ts — dezelfde inhoud als de webpagina.

const ACCENT = rgb(8 / 255, 145 / 255, 178 / 255); // party-cyaan
const DONKER = rgb(0.13, 0.16, 0.21);
const GRIJS = rgb(0.42, 0.45, 0.5);
const LICHTGRIJS = rgb(0.9, 0.92, 0.94);

const A4: [number, number] = [595.28, 841.89];
const M = 56; // marge
const BREEDTE = A4[0] - 2 * M;

// Helvetica (WinAnsi) kan niet alle Unicode-tekens; vervang de bekende
// "slimme" leestekens door ASCII-equivalenten zodat embedden nooit faalt.
function veilig(s: string): string {
  return s
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ");
}

export async function GET() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage(A4);
  let y = A4[1] - M;

  // Breekt tekst af op woordgrenzen zodat het binnen `maxBreedte` past.
  function wrap(tekst: string, f: PDFFont, size: number, maxBreedte: number): string[] {
    const woorden = veilig(tekst).split(/\s+/);
    const regels: string[] = [];
    let huidig = "";
    for (const w of woorden) {
      const test = huidig ? `${huidig} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) > maxBreedte && huidig) {
        regels.push(huidig);
        huidig = w;
      } else {
        huidig = test;
      }
    }
    if (huidig) regels.push(huidig);
    return regels;
  }

  // Zorgt dat er nog `nodig` punten hoogte over zijn; anders nieuwe pagina.
  function ruimte(nodig: number) {
    if (y - nodig < M) {
      page = pdf.addPage(A4);
      y = A4[1] - M;
    }
  }

  // Tekent tekst met omloop op positie x, verlaagt y per regel.
  function schrijf(
    tekst: string,
    x: number,
    maxBreedte: number,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; lineHeight?: number } = {}
  ) {
    const f = opts.font ?? font;
    const size = opts.size ?? 10;
    const lh = opts.lineHeight ?? size * 1.45;
    for (const regel of wrap(tekst, f, size, maxBreedte)) {
      ruimte(lh);
      page.drawText(regel, { x, y: y - size, size, font: f, color: opts.color ?? DONKER });
      y -= lh;
    }
  }

  // ── Titelblok ──
  page.drawText(veilig(AV_META.titel), { x: M, y: y - 26, size: 26, font: bold, color: ACCENT });
  y -= 40;
  schrijf(AV_META.bedrijf, M, BREEDTE, { size: 11, font: bold, color: DONKER });
  schrijf(AV_META.vestiging + ".", M, BREEDTE, { size: 10, color: GRIJS });
  schrijf(AV_META.kvk + ".", M, BREEDTE, { size: 10, color: GRIJS });
  schrijf(AV_META.versie, M, BREEDTE, { size: 9, color: GRIJS });
  y -= 6;
  ruimte(2);
  page.drawLine({ start: { x: M, y }, end: { x: A4[0] - M, y }, thickness: 1.5, color: ACCENT });
  y -= 22;

  // ── Artikelen ──
  for (const a of AV_ARTIKELEN) {
    // Houd de kop bij minstens de eerste regel inhoud.
    ruimte(46);
    y -= 4;
    page.drawText(veilig(`Artikel ${a.nr}  ${a.titel}`), {
      x: M,
      y: y - 13,
      size: 13,
      font: bold,
      color: DONKER,
    });
    y -= 24;

    for (const blok of a.blokken) {
      if (blok.type === "lid") {
        const nr = `${blok.nr}.`;
        const inspring = 20;
        ruimte(15);
        // Nummer op de basislijn van de eerste regel.
        page.drawText(nr, { x: M, y: y - 10, size: 10, font: bold, color: ACCENT });
        schrijf(blok.tekst, M + inspring, BREEDTE - inspring, { size: 10, color: DONKER });
        y -= 4;
      } else if (blok.type === "kop") {
        y -= 6;
        schrijf(blok.tekst.toUpperCase(), M, BREEDTE, { size: 10, font: bold, color: DONKER });
        y -= 2;
      } else if (blok.type === "lijst") {
        for (const item of blok.items) {
          const inspring = 16;
          ruimte(15);
          page.drawText("•", { x: M + 4, y: y - 10, size: 10, font, color: ACCENT });
          schrijf(item, M + inspring, BREEDTE - inspring, { size: 10, color: DONKER });
          y -= 3;
        }
      } else {
        schrijf(blok.tekst, M, BREEDTE, { size: 10, color: DONKER });
        y -= 4;
      }
    }
    y -= 10;
  }

  // ── Voettekst met paginanummers op elke pagina ──
  const paginas = pdf.getPages();
  const totaal = paginas.length;
  paginas.forEach((p: PDFPage, i: number) => {
    p.drawLine({
      start: { x: M, y: M - 14 },
      end: { x: A4[0] - M, y: M - 14 },
      thickness: 0.5,
      color: LICHTGRIJS,
    });
    const links = veilig(`${AV_META.bedrijf} - Algemene Voorwaarden`);
    p.drawText(links, { x: M, y: M - 26, size: 8, font, color: GRIJS });
    const rechts = `Pagina ${i + 1} van ${totaal}`;
    const w = font.widthOfTextAtSize(rechts, 8);
    p.drawText(rechts, { x: A4[0] - M - w, y: M - 26, size: 8, font, color: GRIJS });
  });

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="algemene-voorwaarden-citykist.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
