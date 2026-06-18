// Beschikbaarheidslogica voor verhuurproducten op datumbasis.
// Datums zijn ISO-strings ("YYYY-MM-DD") en kunnen lexicografisch vergeleken
// worden. Een verhuurproduct is op een periode niet beschikbaar als die periode
// overlapt met een reeds geboekte periode (inclusief de randdatums, zodat een
// retour- en ophaaldag op dezelfde dag niet botst).

export type Periode = { startDatum: string; eindDatum: string };

export function overlapt(a: Periode, b: Periode): boolean {
  return a.startDatum <= b.eindDatum && b.startDatum <= a.eindDatum;
}

export function isBeschikbaar(gewenst: Periode, geboekt: Periode[]): boolean {
  return !geboekt.some((g) => overlapt(gewenst, g));
}
