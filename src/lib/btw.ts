// Centrale BTW-berekening. Productprijzen worden exclusief BTW opgeslagen;
// klanten rekenen af inclusief 21% BTW.
export const BTW_TARIEF = 0.21;

function rond(n: number): number {
  return Math.round(n * 100) / 100;
}

export function metBtw(exclBtw: number): { excl: number; btw: number; incl: number } {
  const excl = rond(exclBtw);
  const incl = rond(excl * (1 + BTW_TARIEF));
  return { excl, btw: rond(incl - excl), incl };
}

// Volledige bedragopbouw met optionele korting. De korting wordt op het bedrag
// exclusief BTW toegepast; de BTW wordt over het bedrag ná korting berekend.
export function bedragen(
  exclBtw: number,
  kortingPercentage = 0
): { excl: number; kortingPercentage: number; korting: number; exclNaKorting: number; btw: number; incl: number } {
  const excl = rond(exclBtw);
  const pct = Math.max(0, Math.min(100, kortingPercentage || 0));
  const korting = rond((excl * pct) / 100);
  const exclNaKorting = rond(excl - korting);
  const btw = rond(exclNaKorting * BTW_TARIEF);
  const incl = rond(exclNaKorting + btw);
  return { excl, kortingPercentage: pct, korting, exclNaKorting, btw, incl };
}
