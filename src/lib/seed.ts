import { db } from "./db";
import { products } from "./schema";

const seedProducts = [
  // ── BEAMERS & PROJECTIE ──────────────────────────────────────
  { naam: "Beamer huren", slug: "beamer-huren", categorie: "beamer", prijsPerDag: "24.79", populair: false, beschrijving: "Standaard beamer voor presentaties en feesten in Zwolle en omgeving.", kenmerken: ["Incl. HDMI-kabel", "Eenvoudig in gebruik", "Ophalen in Zwolle"] },
  { naam: "Beamer set incl. scherm, tafel & speaker", slug: "beamer-set-compleet", categorie: "beamer", prijsPerDag: "60.00", populair: true, beschrijving: "Complete beamer set inclusief projectiescherm, projectietafel en speaker.", kenmerken: ["Beamer + scherm + tafel + speaker", "Direct klaar voor gebruik", "Perfect voor feesten & presentaties"] },
  { naam: "Beamer set incl. speaker & laptop", slug: "beamer-set-laptop", categorie: "beamer", prijsPerDag: "65.00", populair: false, beschrijving: "Alles-in-één beamer set inclusief laptop voor presentaties en evenementen.", kenmerken: ["Beamer + speaker + laptop", "Geen eigen laptop nodig", "Plug & play"] },
  { naam: "Beamer voor het weekend", slug: "beamer-weekend", categorie: "beamer", prijsPerDag: "45.00", populair: true, beschrijving: "Speciale weekendtarieven voor beamerverhuur. Ophalen vrijdag, retour maandag.", kenmerken: ["Weekend tarief", "Ophalen vrijdag", "Retour maandag"] },
  { naam: "Professionele HD Beamer", slug: "professionele-hd-beamer", categorie: "beamer", prijsPerDag: "80.00", populair: false, beschrijving: "Professionele HD beamer voor grote evenementen en zakelijke presentaties.", kenmerken: ["Full HD 1080p", "Hoog lichtsterke", "Zakelijk kwaliteit"] },
  { naam: "Projectiescherm 2.40m x 2.40m", slug: "projectiescherm-groot", categorie: "beamer", prijsPerDag: "24.80", populair: false, beschrijving: "Groot projectiescherm van 2.40m x 2.40m voor grote ruimtes.", kenmerken: ["Formaat: 2.40 x 2.40m", "Stabiel statief", "Eenvoudig opbouwen"] },
  { naam: "Projectiescherm standaard", slug: "projectiescherm-standaard", categorie: "beamer", prijsPerDag: "9.50", populair: false, beschrijving: "Standaard projectiescherm voor thuis of kleine evenementen.", kenmerken: ["Stabiel statief", "Eenvoudig opvouwbaar", "Incl. tas"] },
  { naam: "Mobiel Projectiescherm", slug: "projectiescherm-mobiel", categorie: "beamer", prijsPerDag: "33.06", populair: false, beschrijving: "Mobiel oprolbaar projectiescherm, gemakkelijk mee te nemen.", kenmerken: ["Oprolbaar systeem", "Lichtgewicht", "Inclusief tas"] },
  { naam: "Beamertafel / Projectietafel", slug: "beamertafel", categorie: "beamer", prijsPerDag: "2.90", populair: false, beschrijving: "Stabiele tafel voor het plaatsen van een beamer op de juiste hoogte.", kenmerken: ["Verstelbare hoogte", "Stabiel", "Lichtgewicht"] },

  // ── GELUID / AUDIO ──────────────────────────────────────────
  { naam: "Actieve speaker 600 watt", slug: "speaker-600w", categorie: "audio", prijsPerDag: "20.00", populair: true, beschrijving: "Actieve muziekbox van 600 watt, ideaal voor feesten en kleine evenementen.", kenmerken: ["600 watt", "Actieve speaker", "AUX ingang"] },
  { naam: "Actieve speaker set 2800 watt", slug: "speaker-set-2800w", categorie: "audio", prijsPerDag: "99.50", populair: false, beschrijving: "Professionele actieve speaker set van 2800 watt voor grote feesten en evenementen.", kenmerken: ["2800 watt totaal", "2x actieve boxen", "Professionele kwaliteit"] },
  { naam: "Actieve speaker 800 watt", slug: "speaker-800w-actief", categorie: "audio", prijsPerDag: "37.19", populair: false, beschrijving: "Actieve muziekbox van 800 watt voor middelgrote evenementen.", kenmerken: ["800 watt", "Actieve speaker", "Bluetooth & AUX"] },
  { naam: "Speaker 800 watt", slug: "speaker-800w", categorie: "audio", prijsPerDag: "30.00", populair: false, beschrijving: "Muziekbox van 800 watt voor feesten en evenementen.", kenmerken: ["800 watt", "Krachtig geluid", "Veelzijdig"] },
  { naam: "Speaker set 1600 watt", slug: "speaker-set-1600w", categorie: "audio", prijsPerDag: "60.00", populair: true, beschrijving: "Complete geluidsinstallatie van 1600 watt. Incl. kabels en statieven.", kenmerken: ["1600 watt totaal", "Incl. statieven", "Incl. kabels"] },
  { naam: "Speaker set 1200 watt", slug: "speaker-set-1200w", categorie: "audio", prijsPerDag: "40.00", populair: false, beschrijving: "Geluidsinstallatie van 1200 watt voor middelgrote evenementen.", kenmerken: ["1200 watt", "Compleet systeem", "Incl. kabels"] },
  { naam: "Muziek speaker 1400 watt", slug: "speaker-1400w", categorie: "audio", prijsPerDag: "53.72", populair: false, beschrijving: "Krachtige muziek speaker van 1400 watt voor grote ruimtes.", kenmerken: ["1400 watt", "Hoog vermogen", "Professioneel"] },
  { naam: "Microfoon voor instrumenten", slug: "microfoon-instrument", categorie: "audio", prijsPerDag: "4.13", populair: false, beschrijving: "Dynamische microfoon speciaal geschikt voor het opnemen van instrumenten.", kenmerken: ["Dynamisch", "Hoge gevoeligheid", "Incl. klem"] },
  { naam: "Microfoon voor zang & presentaties", slug: "microfoon-zang", categorie: "audio", prijsPerDag: "4.13", populair: false, beschrijving: "Microfoon voor zang en presentaties. Met standaard en kabel.", kenmerken: ["Zang kwaliteit", "Met standaard", "Incl. kabel"] },
  { naam: "Speaker standaard", slug: "speaker-standaard", categorie: "audio", prijsPerDag: "4.13", populair: false, beschrijving: "Vaste speaker standaard voor het plaatsen van een speaker.", kenmerken: ["Stabiel", "Vaste hoogte", "Universeel"] },
  { naam: "Speaker statief", slug: "speaker-statief", categorie: "audio", prijsPerDag: "8.26", populair: false, beschrijving: "Verstelbaar speaker statief voor optimale geluidspositionering.", kenmerken: ["Verstelbare hoogte", "Stabiel", "Lichtgewicht aluminium"] },

  // ── KARAOKE ────────────────────────────────────────────────
  { naam: "Karaoke digitaal", slug: "karaoke-digitaal", categorie: "karaoke", prijsPerDag: "52.48", populair: true, beschrijving: "Digitaal karaoke systeem met uitgebreide muzieklijst. Inclusief 2 microfoons.", kenmerken: ["Digitaal systeem", "2 microfoons incl.", "Uitgebreide muzieklijst"] },
  { naam: "Karaoke feestje digitaal", slug: "karaoke-feestje", categorie: "karaoke", prijsPerDag: "78.52", populair: true, beschrijving: "Compleet karaoke feestpakket inclusief speaker en scherm. Perfect voor verjaardagen.", kenmerken: ["Compleet pakket", "Speaker incl.", "Scherm incl.", "2 microfoons"] },
  { naam: "Karaoke set digitaal compleet", slug: "karaoke-set-compleet", categorie: "karaoke", prijsPerDag: "115.70", populair: false, beschrijving: "Het ultieme karaoke systeem voor grote feesten en evenementen.", kenmerken: ["Professioneel systeem", "Grote muzieklijst", "4 microfoons", "PA speaker incl."] },

  // ── VERLICHTING ────────────────────────────────────────────
  { naam: "Alien disco party verlichting", slug: "alien-disco-verlichting", categorie: "verlichting", prijsPerDag: "8.27", populair: false, beschrijving: "Kleurrijke alien-stijl disco party verlichting met LED effecten.", kenmerken: ["LED verlichting", "Meerdere kleuren", "Automatische patronen"] },
  { naam: "Laser disco party verlichting", slug: "laser-disco-verlichting", categorie: "verlichting", prijsPerDag: "8.27", populair: false, beschrijving: "Laser disco party verlichting met kleurrijke lichtpatronen.", kenmerken: ["Laser effecten", "Meerdere kleuren", "Automatisch"] },
  { naam: "Licht Spin Spot", slug: "licht-spin-spot", categorie: "verlichting", prijsPerDag: "5.37", populair: false, beschrijving: "Draaiende spot met kleurrijke lichteffecten voor de dansvloer.", kenmerken: ["Draaiende beweging", "Kleurrijk", "LED"] },
  { naam: "Licht spot par 64", slug: "licht-spot-par64", categorie: "verlichting", prijsPerDag: "7.44", populair: false, beschrijving: "Professionele par 64 lichtspot voor sfeervolle verlichting.", kenmerken: ["Par 64 formaat", "Professioneel", "Incl. statief"] },
  { naam: "Licht spot set par 64", slug: "licht-spot-set-par64", categorie: "verlichting", prijsPerDag: "24.79", populair: false, beschrijving: "Set par 64 lichtspots met statief en kleuren voor complete sfeerverlichting.", kenmerken: ["Set van 4 spots", "Par 64", "Incl. statieven"] },
  { naam: "Mini 4 head moon LED verlichting", slug: "mini-moon-led", categorie: "verlichting", prijsPerDag: "8.27", populair: false, beschrijving: "Mini 4-koppig moon LED lichteffect voor de dansvloer.", kenmerken: ["4 LED koppen", "Moon effect", "Kleurwisselend"] },
  { naam: "Mini star LED verlichting", slug: "mini-star-led", categorie: "verlichting", prijsPerDag: "2.90", populair: false, beschrijving: "Mini sterren LED verlichting voor sfeervolle achtergrondverlichting.", kenmerken: ["Sterrenlicht effect", "LED", "Energiezuinig"] },
  { naam: "Moving head lichteffect", slug: "moving-head", categorie: "verlichting", prijsPerDag: "16.53", populair: true, beschrijving: "Professioneel draaiend spotlicht voor shows en grote feesten.", kenmerken: ["Beweegbare kop", "Meerdere effecten", "Professioneel"] },
  { naam: "Multitrix lichteffect disco", slug: "multitrix-disco", categorie: "verlichting", prijsPerDag: "16.53", populair: false, beschrijving: "Multitrix lichteffect met meerdere kleuren en disco patronen.", kenmerken: ["Meerdere patronen", "Kleurrijk", "LED"] },
  { naam: "Party disco verlichting complete set", slug: "party-disco-set", categorie: "verlichting", prijsPerDag: "25.00", populair: true, beschrijving: "Complete party disco verlichtingsset voor een complete feestsfeer.", kenmerken: ["Compleet pakket", "Meerdere effecten", "Direct klaar voor gebruik"] },
  { naam: "Revo lichteffect", slug: "revo-lichteffect", categorie: "verlichting", prijsPerDag: "8.27", populair: false, beschrijving: "Revo LED lichteffect met roterende kleurpatronen.", kenmerken: ["Roterend effect", "LED", "Kleurrijk"] },
  { naam: "Terminator lichteffect met laser", slug: "terminator-laser", categorie: "verlichting", prijsPerDag: "12.81", populair: false, beschrijving: "Terminator lichteffect met ingebouwde laser voor spectaculaire effecten.", kenmerken: ["Laser + LED", "Spectaculair effect", "Automatisch"] },
  { naam: "Stroboscoop", slug: "stroboscoop", categorie: "verlichting", prijsPerDag: "2.90", populair: false, beschrijving: "Klassieke stroboscoop voor de perfecte feestsfeer.", kenmerken: ["Instelbare snelheid", "Helder strobe licht", "Compact"] },

  // ── ROOK & BELLEN ──────────────────────────────────────────
  { naam: "Bellenblaas machine", slug: "bellenblaas-machine", categorie: "effecten", prijsPerDag: "6.50", populair: false, beschrijving: "Automatische bellenblaas machine voor sfeervolle zeepbellen.", kenmerken: ["Automatisch", "Veel bellen", "Incl. vloeistof"] },
  { naam: "Professionele bellenblaasmachine", slug: "bellenblaas-machine-pro", categorie: "effecten", prijsPerDag: "12.50", populair: false, beschrijving: "Professionele bellenblaas machine met hoge output voor grote feesten.", kenmerken: ["Hoge output", "Professioneel", "Incl. vloeistof"] },
  { naam: "Bellenblaas vloeistof", slug: "bellenblaas-vloeistof", categorie: "effecten", prijsPerDag: "3.25", isKoop: true, populair: false, beschrijving: "Navulbare bellenblaas vloeistof voor bellenblaas machines.", kenmerken: ["Navulbaar", "Koop artikel", "1 liter"] },
  { naam: "Rookmachine met verlichting", slug: "rookmachine-verlichting", categorie: "effecten", prijsPerDag: "10.34", populair: true, beschrijving: "Rookmachine met ingebouwde LED verlichting voor spectaculaire feest-effecten.", kenmerken: ["Rookeffect", "LED verlichting", "Timer functie"] },
  { naam: "Rook vloeistof", slug: "rook-vloeistof", categorie: "effecten", prijsPerDag: "3.51", isKoop: true, populair: false, beschrijving: "Navulbare rookvloeistof voor rookmachines.", kenmerken: ["Navulbaar", "Koop artikel", "0.5 liter"] },

  // ── LAPTOPS & ACCESSOIRES ─────────────────────────────────
  { naam: "Dell Laptop huren", slug: "laptop-dell", categorie: "accessoires", prijsPerDag: "7.44", populair: false, beschrijving: "Dell laptop huren voor presentaties, shows en evenementen.", kenmerken: ["Dell merk", "Windows", "Goed voor presentaties"] },
  { naam: "Draadloze USB Presenter", slug: "presenter-draadloos", categorie: "accessoires", prijsPerDag: "4.50", populair: false, beschrijving: "Draadloze USB presenter voor presentaties en diavoorstellingen.", kenmerken: ["Draadloos", "USB ontvanger", "Plug & play"] },
  { naam: "Kabel haspel verlengsnoer 10m", slug: "kabel-haspel-10m", categorie: "accessoires", prijsPerDag: "1.65", populair: false, beschrijving: "Kabel haspel met verlengsnoer van 10 meter voor extra bereik.", kenmerken: ["10 meter", "4 stopcontacten", "Oprolbaar"] },

  // ── GLOW IN THE DARK ───────────────────────────────────────
  { naam: "Neon ringen", slug: "glow-neon-ringen", categorie: "glow-in-the-dark", prijsPerDag: "0.75", isKoop: true, volgorde: 1, afbeeldingUrl: "/images/glow/glow-neon-ringen.webp", beschrijving: "Glow-in-the-dark neonringen in diverse kleuren. Leuk uitdeelartikel voor elk neon- of blacklightfeest.", kenmerken: ["Per stuk", "Diverse kleuren", "Licht op in het donker"] },
  { naam: "Neon brillen", slug: "glow-neon-brillen", categorie: "glow-in-the-dark", prijsPerDag: "0.90", isKoop: true, volgorde: 2, afbeeldingUrl: "/images/glow/glow-neon-brillen.webp", beschrijving: "Oplichtende neon feestbrillen voor de complete glow-look op je feest.", kenmerken: ["Per stuk", "Diverse kleuren", "Glow in the dark"] },
  { naam: "Neon ballonnen", slug: "glow-neon-ballonnen", categorie: "glow-in-the-dark", prijsPerDag: "1.00", isKoop: true, volgorde: 3, afbeeldingUrl: "/images/glow/glow-neon-ballonnen.webp", beschrijving: "Felgekleurde neonballonnen die opvallen onder blacklight.", kenmerken: ["Per stuk", "Neonkleuren", "Reageert op blacklight"] },
  { naam: "Knipperende feestbrillen", slug: "glow-knipperende-brillen", categorie: "glow-in-the-dark", prijsPerDag: "1.10", isKoop: true, volgorde: 4, afbeeldingUrl: "/images/glow/glow-knipperende-brillen.webp", beschrijving: "Knipperende LED-feestbrillen in verschillende kleuren voor extra feestplezier.", kenmerken: ["Per stuk", "Knipperende LED's", "Diverse kleuren"] },
  { naam: "LED fiber optische lichtjes", slug: "glow-led-fiber", categorie: "glow-in-the-dark", prijsPerDag: "1.10", isKoop: true, volgorde: 5, afbeeldingUrl: "/images/glow/glow-led-fiber.webp", beschrijving: "Sfeervolle fiber-optische lichtjes met kleurwisselend LED-effect.", kenmerken: ["Per stuk", "Kleurwisselend", "Op batterij"] },
  { naam: "Neon glowsticks", slug: "glow-glowsticks", categorie: "glow-in-the-dark", prijsPerDag: "1.65", isKoop: true, populair: true, volgorde: 6, afbeeldingUrl: "/images/glow/glow-glowsticks.webp", beschrijving: "Klassieke glowsticks die urenlang oplichten. Onmisbaar op elk neonfeest.", kenmerken: ["Per stuk", "Urenlang glow", "Diverse kleuren"] },
  { naam: "Neon feesthoeden", slug: "glow-neon-feesthoeden", categorie: "glow-in-the-dark", prijsPerDag: "1.85", isKoop: true, volgorde: 7, afbeeldingUrl: "/images/glow/glow-neon-feesthoeden.webp", beschrijving: "Oplichtende neon feesthoeden voor een vrolijke glow-uitstraling.", kenmerken: ["Per stuk", "Neonkleuren", "Glow in the dark"] },
  { naam: "Neon bril met ledverlichting", slug: "glow-neon-bril-led", categorie: "glow-in-the-dark", prijsPerDag: "1.99", isKoop: true, volgorde: 8, afbeeldingUrl: "/images/glow/glow-neon-bril-led.webp", beschrijving: "Neon feestbril met ingebouwde ledverlichting voor extra schittering.", kenmerken: ["Per stuk", "Met LED-verlichting", "Diverse kleuren"] },
  { naam: "Neon stickers", slug: "glow-neon-stickers", categorie: "glow-in-the-dark", prijsPerDag: "2.00", isKoop: true, volgorde: 9, afbeeldingUrl: "/images/glow/glow-neon-stickers.webp", beschrijving: "Set neon stickers die oplichten onder blacklight. Leuk voor decoratie en gezichten.", kenmerken: ["Per set", "Reageert op blacklight", "Neonkleuren"] },
  { naam: "Neon tape (6 stuks)", slug: "glow-neon-tape", categorie: "glow-in-the-dark", prijsPerDag: "4.95", isKoop: true, volgorde: 10, afbeeldingUrl: "/images/glow/glow-neon-tape.webp", beschrijving: "Set van 6 rollen neon tape om mee te decoreren — oplichtend onder blacklight.", kenmerken: ["6 rollen", "Neonkleuren", "Reageert op blacklight"] },
  { naam: "Neon schmink set 12-delig", slug: "glow-neon-schmink", categorie: "glow-in-the-dark", prijsPerDag: "10.34", isKoop: true, volgorde: 11, afbeeldingUrl: "/images/glow/glow-neon-schmink.webp", beschrijving: "12-delige neon schminkset voor gezicht en lichaam, oplichtend onder blacklight.", kenmerken: ["12 kleuren", "Voor huid", "Reageert op blacklight"] },
  { naam: "Blacklight lamp", slug: "glow-blacklight-lamp", categorie: "glow-in-the-dark", prijsPerDag: "5.50", populair: true, volgorde: 12, afbeeldingUrl: "/images/glow/glow-blacklight-lamp.webp", beschrijving: "UV blacklight lamp die alle neon- en glow-artikelen laat oplichten. Per dag te huur.", kenmerken: ["UV blacklight", "Laat neon oplichten", "Eenvoudig te plaatsen"] },
  { naam: "Party disco verlichting", slug: "glow-party-disco", categorie: "glow-in-the-dark", prijsPerDag: "6.61", volgorde: 13, afbeeldingUrl: "/images/glow/glow-party-disco.webp", beschrijving: "Kleurrijke disco party verlichting voor een sfeervolle glow-dansvloer.", kenmerken: ["LED-effecten", "Meerdere kleuren", "Automatische patronen"] },
  { naam: "Laser disco verlichting", slug: "glow-laser-disco", categorie: "glow-in-the-dark", prijsPerDag: "8.27", volgorde: 14, afbeeldingUrl: "/images/glow/glow-laser-disco.jpg", beschrijving: "Laser disco verlichting met kleurrijke lichtpatronen voor een spectaculair neonfeest.", kenmerken: ["Laser-effecten", "Meerdere kleuren", "Automatisch"] },
  { naam: "Blacklight verlichtingsbalk", slug: "glow-blacklight-balk", categorie: "glow-in-the-dark", prijsPerDag: "16.52", volgorde: 15, afbeeldingUrl: "/images/glow/glow-blacklight-balk.webp", beschrijving: "Krachtige UV verlichtingsbalk die een hele ruimte in glow-sfeer zet. Per dag te huur.", kenmerken: ["Brede UV-dekking", "Voor grote ruimtes", "Op statief te plaatsen"] },
  { naam: "Blacklight doek 'Fantasie Boom'", slug: "glow-blacklight-doek", categorie: "glow-in-the-dark", prijsPerDag: "16.53", volgorde: 16, afbeeldingUrl: "/images/glow/glow-blacklight-doek.webp", beschrijving: "Sfeervol blacklight wanddoek met fantasieboom-print die oplicht onder UV-licht.", kenmerken: ["Wanddecoratie", "Licht op onder blacklight", "Per dag te huur"] },
];

export async function seed() {
  console.log("Seeding database with products...");
  for (const product of seedProducts) {
    await db
      .insert(products)
      .values({
        naam: product.naam,
        slug: product.slug,
        categorie: product.categorie,
        beschrijving: product.beschrijving || "",
        kenmerken: product.kenmerken || [],
        prijsPerDag: product.prijsPerDag,
        isKoop: product.isKoop || false,
        populair: product.populair || false,
        beschikbaar: true,
        afbeeldingUrl: (product as { afbeeldingUrl?: string }).afbeeldingUrl || "",
        volgorde: (product as { volgorde?: number }).volgorde ?? 0,
      })
      .onConflictDoNothing();
  }
  console.log(`Seeded ${seedProducts.length} products.`);
}
