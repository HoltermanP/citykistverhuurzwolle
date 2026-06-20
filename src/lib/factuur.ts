import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import { Order, OrderItem } from "./schema";
import { bedragen } from "./btw";

// Bedrijfsgegevens voor op de factuur. KvK, BTW-id, IBAN en adres zijn
// (nog) niet in de codebase bekend — vul ze in via env-vars of pas ze
// hieronder aan. Een Nederlandse factuur is pas geldig mét KvK- en BTW-nummer.
const BEDRIJF = {
  naam: "CityKist Verhuur",
  ondertitel: "Feest- & evenementenverhuur Zwolle",
  email: "info@citykistverhuurzwolle.nl",
  telefoon: "06-226 321 07",
  adres: process.env.FACTUUR_ADRES || "Zwolle en omgeving",
  kvk: process.env.FACTUUR_KVK || "",
  btwId: process.env.FACTUUR_BTW || "",
  iban: process.env.FACTUUR_IBAN || "",
};

// Merkkleuren (cyaan/limoen gradient → we gebruiken cyaan als accent).
const ACCENT = rgb(8 / 255, 145 / 255, 178 / 255);
const DONKER = rgb(0.13, 0.16, 0.21);
const GRIJS = rgb(0.42, 0.45, 0.5);
const LICHTGRIJS = rgb(0.93, 0.94, 0.96);
const GROEN = rgb(0.06, 0.5, 0.28);
const GROEN_BG = rgb(0.9, 0.99, 0.94);
const AMBER_BG = rgb(1, 0.97, 0.86);
const AMBER = rgb(0.55, 0.38, 0.03);

function euro(n: number): string {
  return "€ " + n.toFixed(2).replace(".", ",");
}

function formatDatum(d: Date | string | null): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export function factuurnummerVoor(order: Order): string {
  if (order.factuurnummer) return order.factuurnummer;
  const jaar = order.createdAt ? new Date(order.createdAt).getFullYear() : new Date().getFullYear();
  return `CK-${jaar}-${String(order.id).padStart(4, "0")}`;
}

export async function genereerFactuurPdf(order: Order): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const M = 50; // marge
  let y = height - M;

  const tekst = (
    s: string,
    x: number,
    yy: number,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb> } = {}
  ) => {
    page.drawText(s, { x, y: yy, size: opts.size ?? 10, font: opts.font ?? font, color: opts.color ?? DONKER });
  };

  const rechts = (
    s: string,
    rechtsX: number,
    yy: number,
    opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb> } = {}
  ) => {
    const f = opts.font ?? font;
    const size = opts.size ?? 10;
    const w = f.widthOfTextAtSize(s, size);
    tekst(s, rechtsX - w, yy, opts);
  };

  // ── Kop: bedrijfsnaam links, "FACTUUR" rechts ──
  tekst(BEDRIJF.naam, M, y - 6, { size: 24, font: bold, color: ACCENT });
  tekst(BEDRIJF.ondertitel, M, y - 24, { size: 9, color: GRIJS });
  rechts("FACTUUR", width - M, y - 4, { size: 22, font: bold, color: DONKER });

  const factuurnr = factuurnummerVoor(order);
  rechts(`Factuurnr: ${factuurnr}`, width - M, y - 24, { size: 9, color: GRIJS });
  rechts(`Datum: ${formatDatum(new Date())}`, width - M, y - 38, { size: 9, color: GRIJS });

  y -= 56;
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1.5, color: ACCENT });
  y -= 24;

  // ── Bedrijfsgegevens (links) en klantgegevens (rechts) ──
  const kolomY = y;
  tekst("Van", M, y, { size: 8, font: bold, color: GRIJS });
  let vy = y - 14;
  const vanRegels = [
    BEDRIJF.naam,
    BEDRIJF.adres,
    BEDRIJF.telefoon,
    BEDRIJF.email,
    ...(BEDRIJF.kvk ? [`KvK: ${BEDRIJF.kvk}`] : []),
    ...(BEDRIJF.btwId ? [`BTW-id: ${BEDRIJF.btwId}`] : []),
    ...(BEDRIJF.iban ? [`IBAN: ${BEDRIJF.iban}`] : []),
  ];
  for (const r of vanRegels) {
    tekst(r, M, vy, { size: 9, color: DONKER });
    vy -= 13;
  }

  const klantX = width / 2 + 10;
  tekst("Factuur voor", klantX, kolomY, { size: 8, font: bold, color: GRIJS });
  let ky = kolomY - 14;
  const klantRegels = [
    order.naam,
    ...(order.adres ? [order.adres] : []),
    ...(order.postcode || order.stad ? [`${order.postcode || ""} ${order.stad || ""}`.trim()] : []),
    order.telefoon,
    order.email,
  ].filter(Boolean) as string[];
  for (const r of klantRegels) {
    tekst(r, klantX, ky, { size: 9, color: DONKER });
    ky -= 13;
  }

  y = Math.min(vy, ky) - 10;

  // ── Huurperiode ──
  tekst(
    `Huurperiode: ${formatDatum(order.ophaaldatum)}  t/m  ${formatDatum(order.retourdatum)}`,
    M,
    y,
    { size: 9, color: GRIJS }
  );
  y -= 22;

  // ── Tabelkop ──
  const colOmschrijving = M + 8;
  const colAantal = 320;
  const colDagen = 372;
  const colPrijs = width - M - 8; // rechts uitgelijnd kolommen eindigen hier-ish
  const colSubtotaal = width - M - 8;

  page.drawRectangle({ x: M, y: y - 6, width: width - 2 * M, height: 22, color: ACCENT });
  tekst("Omschrijving", colOmschrijving, y, { size: 9, font: bold, color: rgb(1, 1, 1) });
  rechts("Aantal", colAantal + 30, y, { size: 9, font: bold, color: rgb(1, 1, 1) });
  rechts("Dagen", colDagen + 40, y, { size: 9, font: bold, color: rgb(1, 1, 1) });
  rechts("Prijs/dag", 478, y, { size: 9, font: bold, color: rgb(1, 1, 1) });
  rechts("Subtotaal", colSubtotaal, y, { size: 9, font: bold, color: rgb(1, 1, 1) });
  y -= 24;

  // ── Tabelregels ──
  const items = (order.items as OrderItem[]) || [];
  let rij = 0;
  for (const it of items) {
    if (rij % 2 === 1) {
      page.drawRectangle({ x: M, y: y - 6, width: width - 2 * M, height: 20, color: LICHTGRIJS });
    }
    // Omschrijving evt. inkorten zodat het niet over de kolommen loopt.
    let naam = it.productNaam;
    const maxW = colAantal - colOmschrijving - 10;
    while (font.widthOfTextAtSize(naam, 9) > maxW && naam.length > 4) {
      naam = naam.slice(0, -2);
    }
    if (naam !== it.productNaam) naam = naam.trimEnd() + "…";

    tekst(naam, colOmschrijving, y, { size: 9 });
    rechts(`${it.aantal}`, colAantal + 30, y, { size: 9 });
    rechts(`${it.dagen}`, colDagen + 40, y, { size: 9 });
    rechts(euro(it.prijsPerDag), 478, y, { size: 9 });
    rechts(euro(it.subtotaal), colSubtotaal, y, { size: 9 });
    y -= 20;
    rij++;
  }

  y -= 6;
  page.drawLine({ start: { x: M, y: y + 8 }, end: { x: width - M, y: y + 8 }, thickness: 0.75, color: GRIJS });

  // ── Totalen (rechts) ──
  const totalen = bedragen(
    items.reduce((s, i) => s + i.subtotaal, 0),
    order.kortingPercentage || 0
  );
  const labelX = width - M - 230;
  const bedragX = width - M - 8;

  y -= 6;
  tekst("Subtotaal (excl. BTW)", labelX, y, { size: 9, color: GRIJS });
  rechts(euro(totalen.excl), bedragX, y, { size: 9 });
  if (totalen.korting > 0) {
    y -= 16;
    const label = order.kortingCode
      ? `Korting ${order.kortingCode} (${totalen.kortingPercentage}%)`
      : `Korting (${totalen.kortingPercentage}%)`;
    tekst(label, labelX, y, { size: 9, color: GROEN });
    rechts("- " + euro(totalen.korting), bedragX, y, { size: 9, color: GROEN });
  }
  y -= 16;
  tekst("BTW 21%", labelX, y, { size: 9, color: GRIJS });
  rechts(euro(totalen.btw), bedragX, y, { size: 9 });
  y -= 8;
  page.drawLine({ start: { x: labelX, y }, end: { x: bedragX, y }, thickness: 0.75, color: GRIJS });
  y -= 16;
  tekst("Totaal (incl. BTW)", labelX, y, { size: 11, font: bold });
  rechts(euro(totalen.incl), bedragX, y, { size: 11, font: bold });

  // ── Betaalstatusvak ──
  y -= 40;
  const isBetaaldIdeal = order.betaalmethode === "ideal" && order.betaalstatus === "betaald";
  const vakX = M;
  const vakW = width - 2 * M;
  const vakH = 44;
  page.drawRectangle({
    x: vakX,
    y: y - vakH + 14,
    width: vakW,
    height: vakH,
    color: isBetaaldIdeal ? GROEN_BG : AMBER_BG,
    borderColor: isBetaaldIdeal ? GROEN : AMBER,
    borderWidth: 1,
  });
  if (isBetaaldIdeal) {
    tekst("Betaald", vakX + 14, y, { size: 11, font: bold, color: GROEN });
    tekst(
      `Dit bedrag is voldaan via iDEAL. Er hoeft niets meer betaald te worden.`,
      vakX + 14,
      y - 16,
      { size: 9, color: DONKER }
    );
  } else {
    tekst("Nog te voldoen - contant of via een tikkie bij ophalen", vakX + 14, y, { size: 11, font: bold, color: AMBER });
    tekst(
      `Gelieve ${euro(totalen.incl)} contant of via een Tikkie te voldoen bij het ophalen van de materialen.`,
      vakX + 14,
      y - 16,
      { size: 9, color: DONKER }
    );
  }

  // ── Voettekst ──
  const footerY = M + 4;
  page.drawLine({ start: { x: M, y: footerY + 18 }, end: { x: width - M, y: footerY + 18 }, thickness: 0.5, color: LICHTGRIJS });
  const footerTekst = [
    `${BEDRIJF.naam} • ${BEDRIJF.telefoon} • ${BEDRIJF.email}`,
    BEDRIJF.kvk || BEDRIJF.btwId || BEDRIJF.iban
      ? [BEDRIJF.kvk && `KvK ${BEDRIJF.kvk}`, BEDRIJF.btwId && `BTW ${BEDRIJF.btwId}`, BEDRIJF.iban && `IBAN ${BEDRIJF.iban}`].filter(Boolean).join("  •  ")
      : "Bedankt voor je bestelling bij CityKist Verhuur!",
  ];
  let fy = footerY + 6;
  for (const r of footerTekst) {
    const w = font.widthOfTextAtSize(r, 8);
    tekst(r, (width - w) / 2, fy, { size: 8, color: GRIJS });
    fy -= 11;
  }

  return pdf.save();
}
