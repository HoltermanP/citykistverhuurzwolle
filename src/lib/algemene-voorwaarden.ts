// Algemene voorwaarden + privacyverklaring (AVG) van Citykist.
//
// Dit is de ENIGE bron van de tekst: zowel de webpagina
// (/algemene-voorwaarden) als de downloadbare PDF (/algemene-voorwaarden/pdf)
// worden hieruit opgebouwd. Pas je de tekst hier aan, dan veranderen beide mee.

export type AvBlok =
  | { type: "lid"; nr: number; tekst: string } // genummerd lid
  | { type: "alinea"; tekst: string } // losse alinea zonder nummer
  | { type: "kop"; tekst: string } // tussenkopje
  | { type: "lijst"; items: string[] }; // opsomming met bullets

export interface AvArtikel {
  nr: number;
  titel: string;
  blokken: AvBlok[];
}

export const AV_META = {
  titel: "Algemene Voorwaarden",
  bedrijf: "Citykist",
  vestiging: "Gevestigd en kantoorhoudende aan de Tichelmeesterlaan 24, 8014 LB Zwolle",
  kvk: "Ingeschreven bij de Kamer van Koophandel te Zwolle onder nummer 08207924",
  btw: "BTW-nummer: NL105614701B01",
  // Datum waarop de voorwaarden voor het laatst zijn herzien.
  versie: "Versie juni 2026",
};

function lid(nr: number, tekst: string): AvBlok {
  return { type: "lid", nr, tekst };
}

export const AV_ARTIKELEN: AvArtikel[] = [
  {
    nr: 1,
    titel: "Algemeen",
    blokken: [
      lid(
        1,
        'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen en huurovereenkomsten, evenals op de uitvoering daarvan, door Citykist gedaan aan en/of aangegaan met derden, hierna te noemen "huurder".'
      ),
      lid(
        2,
        "Deze algemene voorwaarden zijn van toepassing met uitsluiting van eventuele door de huurder gehanteerde algemene voorwaarden en/of condities."
      ),
      lid(
        3,
        "Afwijkende voorwaarden en/of condities zijn slechts van toepassing indien en voor zover dat uitdrukkelijk schriftelijk is overeengekomen. De huurder kan hieraan in andere overeenkomsten geen rechten ontlenen."
      ),
    ],
  },
  {
    nr: 2,
    titel: "Aanbiedingen en overeenkomsten",
    blokken: [
      lid(1, "Alle aanbiedingen zijn vrijblijvend, tenzij uitdrukkelijk anders is vermeld."),
      lid(
        2,
        "Afbeeldingen, beschrijvingen, aanbiedingen, reclamemateriaal en andere door Citykist verstrekte gegevens binden haar niet."
      ),
      lid(
        3,
        "Een overeenkomst komt tot stand zodra Citykist de opdracht en/of de aanvaarding van het aanbod heeft bevestigd."
      ),
      lid(
        4,
        "Eventuele of beweerde onjuistheden in de (opdracht)bevestiging van Citykist dienen binnen 7 dagen na de datum van de bevestiging door de huurder te worden gemeld, bij gebreke waarvan de inhoud van de bevestiging bindend is."
      ),
      lid(
        5,
        "De administratie van Citykist strekt tegenover de huurder tot volledig bewijs, behoudens door de huurder te leveren tegenbewijs."
      ),
      lid(
        6,
        "De apparatuur wordt gehuurd voor de periode zoals vermeld in de huurovereenkomst of (opdracht)bevestiging. Indien de gehuurde apparatuur na het verstrijken van de huurperiode niet tijdig wordt geretourneerd, dan wel niet op het afgesproken tijdstip voor transport gereedstaat, wordt voor iedere dag dat Citykist de apparatuur niet tot haar beschikking heeft de normale huurprijs in rekening gebracht, onverminderd het recht op schadevergoeding."
      ),
      lid(
        7,
        "Annulering: bij annulering van de order door de huurder wordt 10% annuleringskosten in rekening gebracht."
      ),
    ],
  },
  {
    nr: 3,
    titel: "Prijzen",
    blokken: [
      lid(1, "Alle prijzen zijn exclusief btw, tenzij anders vermeld."),
      lid(
        2,
        "Indien na het aanbod en/of na het tot stand komen van een overeenkomst kostprijsbepalende factoren wijzigen — waaronder belastingen, accijnzen, heffingen en lasten van overheidswege, valutakoersen, lonen, premies, inkoopprijzen van Citykist en/of andere prijsbepalende factoren — is Citykist gerechtigd de in het aanbod vermelde of overeengekomen prijs dienovereenkomstig te wijzigen. De huurder die als natuurlijk persoon niet handelt in de uitoefening van een beroep of bedrijf, is gerechtigd de overeenkomst te ontbinden indien de prijs binnen 3 maanden na het sluiten van de overeenkomst wordt verhoogd, tenzij de verhoging het gevolg is van wettelijke bepalingen."
      ),
    ],
  },
  {
    nr: 4,
    titel: "Waarborgsom",
    blokken: [
      lid(
        1,
        "De huurder is gehouden bij ondertekening van de huurovereenkomst, doch in ieder geval voordat de huurder de gehuurde apparatuur in ontvangst neemt, de in de huurovereenkomst of (opdracht)bevestiging genoemde waarborgsom te voldoen. Na beëindiging van de huurovereenkomst en nadat de apparatuur aan Citykist is geretourneerd, wordt de waarborgsom terugbetaald onder aftrek van nog onbetaalde rekeningen en/of schadevergoedingen, ook indien deze voortvloeien uit andere (huur)overeenkomsten."
      ),
      lid(
        2,
        "De huurder is gehouden de gehuurde apparatuur in dezelfde staat te retourneren als waarin hij deze bij aanvang heeft ontvangen. Citykist is, met inachtneming van het in lid 1 bepaalde, slechts gehouden tot restitutie van de waarborgsom op het moment dat de huurder aan al zijn verplichtingen heeft voldaan."
      ),
      lid(3, "Over de waarborgsom is Citykist geen rente verschuldigd."),
    ],
  },
  {
    nr: 5,
    titel: "Transport en bezorging",
    blokken: [
      lid(
        1,
        "Indien de huurder zelf zorg draagt voor het transport van de gehuurde apparatuur, geschiedt dit geheel voor rekening en risico van de huurder. De huurder is verplicht de apparatuur te verpakken en te vervoeren op een wijze die past bij de aard van de apparatuur. Indien op verzoek van de huurder bij het laden/lossen gebruik wordt gemaakt van de diensten van Citykist, geschiedt dit geheel voor rekening en risico van de huurder."
      ),
      lid(
        2,
        "Indien Citykist zorg draagt voor het transport, vindt bezorging uitsluitend plaats achter de eerste deur op de begane grond. De huurder dient ervoor te zorgen dat op de afgesproken bezorgdag en het afgesproken tijdstip iemand aanwezig is om de apparatuur in ontvangst te nemen, bij gebreke waarvan Citykist het recht heeft de apparatuur weer mee terug te nemen. De hierdoor ontstane kosten zijn voor rekening van de huurder."
      ),
      lid(
        3,
        "De apparatuur dient op de ophaaldag op de begane grond gereed te staan voor transport, op dezelfde wijze en plek als waarop deze door Citykist is afgeleverd. Staat de apparatuur niet gereed voor transport, dan dient de huurder de daardoor ontstane extra kosten te vergoeden. Deze kosten bestaan onder meer uit de huurprijs per dag, extra transportkosten en extra arbeidsloon."
      ),
    ],
  },
  {
    nr: 6,
    titel: "Verplichtingen van de huurder",
    blokken: [
      lid(
        1,
        "De huurder dient de apparatuur bij inontvangstneming te controleren. Bij het constateren van manco's, gebreken of andere klachten dient de huurder direct contact op te nemen met Citykist."
      ),
      lid(
        2,
        "De huurder is gedurende de gehele huurperiode aansprakelijk voor verlies en/of beschadiging van de gehuurde apparatuur."
      ),
      lid(
        3,
        "De huurder houdt de gehuurde apparatuur gedurende de huurperiode als een goed huurder onder zich en gebruikt deze overeenkomstig haar bestemming."
      ),
      lid(
        4,
        "Het is de huurder niet toegestaan de gehuurde apparatuur zonder voorafgaande schriftelijke toestemming van Citykist aan een ander onder te verhuren, door te verhuren of anderszins in gebruik te geven."
      ),
      lid(5, "De huurder is niet gerechtigd veranderingen aan of in de gehuurde apparatuur aan te brengen."),
      lid(
        6,
        "De huurder dient de apparatuur droog en schoon te houden en te beschermen tegen vocht, stof, extreme temperaturen en stroompieken. De apparatuur dient schoon en compleet, inclusief alle meegeleverde kabels, afstandsbedieningen en toebehoren, te worden geretourneerd."
      ),
    ],
  },
  {
    nr: 7,
    titel: "Controle bij retournering",
    blokken: [
      lid(
        1,
        "Zodra Citykist de gehuurde apparatuur heeft terugontvangen, wordt deze gecontroleerd en, indien van toepassing, in aanwezigheid van de huurder geteld. De telling en controle door Citykist zijn bindend."
      ),
      lid(
        2,
        "De huurder is tijdens de huurperiode en zolang hij de apparatuur onder zich heeft aansprakelijk voor verlies, beschadiging, breuk en elke kwaliteitsvermindering, door welke oorzaak dan ook. In deze gevallen blijft de huurprijs verschuldigd en wordt daarnaast de vervangingswaarde van de verloren of beschadigde apparatuur aan de huurder in rekening gebracht."
      ),
    ],
  },
  {
    nr: 8,
    titel: "Schade en schadevergoeding",
    blokken: [
      lid(1, "De gehuurde apparatuur blijft te allen tijde eigendom van Citykist."),
      lid(
        2,
        "De huurder is aansprakelijk voor verlies, diefstal, beschadiging, breuk of het op enigerlei wijze onbruikbaar worden van de gehuurde apparatuur en dient deze tegen nieuwwaarde te vergoeden. De waardebepaling geschiedt namens Citykist en is voor de huurder bindend."
      ),
      lid(3, "Bij verlies, diefstal of schade dient de huurder Citykist hiervan onmiddellijk op de hoogte te brengen."),
      lid(
        4,
        "Indien zoekgeraakte apparatuur of onderdelen daarvan door de huurder worden teruggevonden, dient de huurder deze binnen 14 dagen na de afgesproken retourdatum alsnog aan Citykist te retourneren. Eventueel reeds betaalde schadevergoeding wordt, indien de teruggevonden apparatuur zich nog in dezelfde staat bevindt als bij aanvang van de huurperiode, door Citykist terugbetaald. Citykist is hierover geen rente verschuldigd."
      ),
      lid(
        5,
        "De huurder wordt geadviseerd de risico's tegen diefstal, vernieling, brand, waterschade en blikseminslag te verzekeren."
      ),
      lid(
        6,
        "De expertisekosten voor het vaststellen van schade, alsmede reparatie- en reinigingskosten, komen voor rekening van de huurder. De huurder is gebonden aan de bevindingen van Citykist dan wel aan die van de door Citykist ingeschakelde expert. Indien Citykist de schade beneden € 750,- begroot, verricht zij de expertise zelf."
      ),
    ],
  },
  {
    nr: 9,
    titel: "Niet-toerekenbare tekortkoming (overmacht)",
    blokken: [
      lid(
        1,
        "Indien Citykist door een niet-toerekenbare tekortkoming is verhinderd de overeenkomst na te komen, is zij gerechtigd de uitvoering op te schorten en kan zij niet langer worden gehouden aan de opgegeven levertijd. De huurder kan uit dien hoofde geen recht op een eventueel overeengekomen boete, noch op vergoeding van kosten, schade (waaronder gevolgschade) of interesten doen gelden."
      ),
      lid(
        2,
        "Als niet-toerekenbare tekortkoming geldt onder meer: oorlog, oorlogsgevaar, mobilisatie, oproer, staat van beleg, werkstaking of uitsluiting, brand, slechte weersomstandigheden, ongeval en ziekte van personeel, bedrijfsstoring, stagnatie in het vervoer, beperkingen van overheidswege, alsmede elke belemmerende omstandigheid die niet uitsluitend van de wil van Citykist afhankelijk is, zoals de niet-tijdige levering van zaken of diensten door ingeschakelde derden."
      ),
    ],
  },
  {
    nr: 10,
    titel: "Aansprakelijkheid",
    blokken: [
      lid(
        1,
        "Citykist is niet aansprakelijk voor welke schade dan ook, directe en/of gevolgschade, daaronder begrepen schade aan personen, zaken of percelen van derden, ontstaan door welke oorzaak dan ook, behoudens in geval van grove schuld of opzet aan haar kant."
      ),
      lid(
        2,
        "Citykist is evenmin in voornoemde zin aansprakelijk voor handelingen van haar werknemers of andere personen die binnen haar risicosfeer vallen, daaronder begrepen (grove) schuld of opzet van deze personen."
      ),
      lid(
        3,
        "Indien Citykist op basis van de haar op dat moment bekende feiten en/of omstandigheden overgaat tot uitoefening van een opschortings- of ontbindingsrecht, terwijl nadien onherroepelijk komt vast te staan dat dit ten onrechte is geschied, is Citykist niet aansprakelijk en niet gehouden tot enigerlei schadevergoeding."
      ),
      lid(
        4,
        "In gevallen waarin Citykist aansprakelijk is, is de aansprakelijkheid beperkt tot de huurprijs van de apparatuur, ongeacht een eventuele dekking door de verzekeraar(s)."
      ),
      lid(5, "De huurder vrijwaart Citykist tegen iedere vordering tot schadevergoeding van derden, ongeacht de oorzaak."),
    ],
  },
  {
    nr: 11,
    titel: "Conversie",
    blokken: [
      lid(
        1,
        "De nietigheid of vernietigbaarheid van enige bepaling van deze algemene voorwaarden of van overeenkomsten waarop deze voorwaarden van toepassing zijn, laat de geldigheid van de overige bepalingen onverlet."
      ),
      lid(
        2,
        "Citykist en de huurder zijn gehouden nietige of vernietigde bepalingen te vervangen door bepalingen met zoveel mogelijk dezelfde strekking."
      ),
    ],
  },
  {
    nr: 12,
    titel: "Toepasselijk recht en geschillen",
    blokken: [
      lid(
        1,
        "Op alle overeenkomsten die door Citykist worden gesloten, is uitsluitend Nederlands recht van toepassing."
      ),
      lid(
        2,
        "Alle geschillen die bij de uitvoering van of in verband met een overeenkomst ontstaan, worden uitsluitend beslecht door de bevoegde rechter van de Rechtbank Overijssel, locatie Zwolle, tenzij de kantonrechter op grond van dwingende wettelijke bepalingen bevoegd is."
      ),
      lid(
        3,
        "Indien Citykist in rechte wordt betrokken en nadien blijkt dat dit geheel of grotendeels ten onrechte is geschied, is de huurder de kosten van buitengerechtelijk verweer tot aan de datum van dagvaarding aan Citykist verschuldigd."
      ),
    ],
  },
];

// Privacyverklaring (AVG) — wordt onder de artikelen getoond op de pagina en in de PDF.
export const AV_PRIVACY: { titel: string; blokken: AvBlok[] } = {
  titel: "Privacyverklaring (AVG)",
  blokken: [
    {
      type: "alinea",
      tekst:
        "Citykist, gevestigd aan de Tichelmeesterlaan 24, 8014 LB Zwolle, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.",
    },
    { type: "kop", tekst: "Contactgegevens" },
    {
      type: "lijst",
      items: [
        "Citykist — Tichelmeesterlaan 24, 8014 LB Zwolle",
        "Telefoon: 06-27531889",
        "E-mail: hurenenverhuurzwolle@outlook.com",
        "Website: www.hurenenverhuurzwolle.nl",
      ],
    },
    {
      type: "alinea",
      tekst:
        "Herman Kist is de contactpersoon voor gegevensbescherming van Citykist en is bereikbaar via hermankist@live.nl.",
    },
    { type: "kop", tekst: "Persoonsgegevens die wij verwerken" },
    {
      type: "alinea",
      tekst:
        "Citykist verwerkt uw persoonsgegevens doordat u gebruikmaakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder een overzicht van de persoonsgegevens die wij verwerken:",
    },
    {
      type: "lijst",
      items: [
        "Voor- en achternaam",
        "Geboortedatum",
        "Geboorteplaats",
        "Adresgegevens",
        "Telefoonnummer",
        "E-mailadres",
        "Bankrekeningnummer",
        "Overige persoonsgegevens die u actief verstrekt, bijvoorbeeld in correspondentie of telefonisch",
        "Een kopie van een identiteitsbewijs ten behoeve van de borg; deze wordt verwijderd zodra de gehuurde apparatuur is geretourneerd",
      ],
    },
    { type: "kop", tekst: "Bijzondere en/of gevoelige persoonsgegevens" },
    {
      type: "alinea",
      tekst:
        "Onze website en/of dienst heeft niet de intentie gegevens te verzamelen over websitebezoekers die jonger zijn dan 16 jaar, tenzij zij toestemming hebben van ouders of voogd. Wij kunnen echter niet controleren of een bezoeker ouder dan 16 is. Wij raden ouders dan ook aan betrokken te zijn bij de online activiteiten van hun kinderen, om te voorkomen dat er zonder ouderlijke toestemming gegevens over kinderen worden verzameld. Bent u ervan overtuigd dat wij zonder die toestemming persoonlijke gegevens hebben verzameld over een minderjarige, neem dan contact op via hurenenverhuurzwolle@outlook.com, dan verwijderen wij deze informatie.",
    },
    { type: "kop", tekst: "Doel en grondslag van de verwerking" },
    { type: "alinea", tekst: "Citykist verwerkt uw persoonsgegevens voor de volgende doelen:" },
    {
      type: "lijst",
      items: [
        "Het afhandelen van uw betaling",
        "Het uitvoeren van de huurovereenkomst, waaronder het afleveren en ophalen van apparatuur",
        "U te kunnen bellen of e-mailen indien dit nodig is voor onze dienstverlening",
        "Het verzenden van onze nieuwsbrief (indien u zich hiervoor heeft aangemeld)",
      ],
    },
    {
      type: "alinea",
      tekst:
        "De grondslagen voor deze verwerkingen zijn de uitvoering van de overeenkomst, het voldoen aan een wettelijke verplichting en — voor de nieuwsbrief — uw toestemming.",
    },
    { type: "kop", tekst: "Geautomatiseerde besluitvorming" },
    {
      type: "alinea",
      tekst:
        "Citykist neemt geen besluiten op basis van geautomatiseerde verwerkingen over zaken die (aanzienlijke) gevolgen kunnen hebben voor personen. Het gaat hier om besluiten die worden genomen door computerprogramma's of -systemen zonder tussenkomst van een mens.",
    },
    { type: "kop", tekst: "Bewaartermijnen" },
    {
      type: "alinea",
      tekst:
        "Citykist bewaart uw persoonsgegevens niet langer dan strikt noodzakelijk is om de doelen te realiseren waarvoor de gegevens worden verzameld. Wij hanteren de volgende bewaartermijnen:",
    },
    {
      type: "lijst",
      items: [
        "Kopie identiteitsbewijs (borg): wordt verwijderd direct na retournering van de gehuurde apparatuur.",
        "Gegevens in de financiële administratie (zoals naam, adres, factuur- en betaalgegevens): 7 jaar, op grond van de wettelijke fiscale bewaarplicht.",
        "Contact- en klantgegevens voor de uitvoering van de overeenkomst: tot 2 jaar na de laatste transactie, daarna verwijderd of geanonimiseerd.",
        "Nieuwsbriefgegevens: totdat u zich afmeldt.",
      ],
    },
    { type: "kop", tekst: "Delen van persoonsgegevens met derden" },
    {
      type: "alinea",
      tekst:
        "Citykist verstrekt uitsluitend gegevens aan derden als dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.",
    },
    { type: "kop", tekst: "Cookies" },
    { type: "alinea", tekst: "Citykist gebruikt geen cookies of vergelijkbare technieken." },
    { type: "kop", tekst: "Gegevens inzien, aanpassen of verwijderen" },
    {
      type: "alinea",
      tekst:
        "U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking, en heeft u recht op gegevensoverdraagbaarheid. Dat betekent dat u bij ons een verzoek kunt indienen om de persoonsgegevens die wij van u hebben in een computerbestand naar u of een door u genoemde organisatie te sturen.",
    },
    {
      type: "alinea",
      tekst:
        "U kunt een verzoek tot inzage, correctie, verwijdering of gegevensoverdracht van uw persoonsgegevens, of een verzoek tot intrekking van uw toestemming of bezwaar tegen de verwerking, sturen naar hurenenverhuurzwolle@outlook.com. Om er zeker van te zijn dat het verzoek door u is gedaan, vragen wij u een kopie van uw identiteitsbewijs met het verzoek mee te sturen. Maak in deze kopie uw pasfoto, MRZ (de strook met nummers onderaan), paspoortnummer en burgerservicenummer (BSN) zwart, ter bescherming van uw privacy. Wij reageren zo snel mogelijk, maar in ieder geval binnen vier weken, op uw verzoek.",
    },
    {
      type: "alinea",
      tekst:
        "Citykist wijst u er tevens op dat u de mogelijkheid heeft een klacht in te dienen bij de nationale toezichthouder, de Autoriteit Persoonsgegevens, via: https://autoriteitpersoonsgegevens.nl/nl/contact-met-de-autoriteit-persoonsgegevens/tip-ons",
    },
    { type: "kop", tekst: "Beveiliging van persoonsgegevens" },
    {
      type: "alinea",
      tekst:
        "Citykist neemt de bescherming van uw gegevens serieus en treft passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. Heeft u de indruk dat uw gegevens niet goed beveiligd zijn of zijn er aanwijzingen van misbruik, neem dan contact op via hurenenverhuurzwolle@outlook.com. Citykist heeft onder meer de volgende maatregelen genomen:",
    },
    {
      type: "lijst",
      items: [
        "Beveiligingssoftware, zoals een virusscanner en firewall",
        "TLS-versleuteling: wij versturen uw gegevens via een beveiligde internetverbinding, herkenbaar aan 'https' en het slotje in de adresbalk",
      ],
    },
  ],
};
