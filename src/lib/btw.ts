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
