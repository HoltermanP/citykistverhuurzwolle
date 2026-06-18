// Beschikbaarheidslogica voor verhuurproducten op datumbasis, rekening houdend
// met de voorraad (aantal exemplaren). Datums zijn ISO-strings ("YYYY-MM-DD")
// en worden lexicografisch vergeleken. Twee periodes overlappen inclusief de
// randdatums, zodat een retour- en ophaaldag op dezelfde dag niet botsen.

export type Periode = { startDatum: string; eindDatum: string };
export type GeboektePeriode = Periode & { aantal: number };

export function overlapt(a: Periode, b: Periode): boolean {
  return a.startDatum <= b.eindDatum && b.startDatum <= a.eindDatum;
}

// Aantal exemplaren dat in de gevraagde periode al verhuurd is.
export function gereserveerdAantal(gewenst: Periode, geboekt: GeboektePeriode[]): number {
  return geboekt
    .filter((g) => overlapt(gewenst, g))
    .reduce((som, g) => som + (g.aantal || 1), 0);
}

// Hoeveel exemplaren nog beschikbaar zijn in de gevraagde periode.
export function beschikbaarAantal(
  gewenst: Periode,
  voorraad: number,
  geboekt: GeboektePeriode[]
): number {
  return Math.max(0, (voorraad || 1) - gereserveerdAantal(gewenst, geboekt));
}
