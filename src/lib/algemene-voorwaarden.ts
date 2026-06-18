// Algemene voorwaarden van CityKist (Beamerverhuur Zwolle).
//
// Dit is de ENIGE bron van de tekst: zowel de webpagina
// (/algemene-voorwaarden) als de downloadbare PDF (/algemene-voorwaarden/pdf)
// worden hieruit opgebouwd. Pas je de tekst hier aan, dan veranderen beide mee.
//
// De brontekst kwam uit een PDF-export waarin ARTIKEL 15 opgeknipt was en de
// heater-handleiding ertussen stond; die is hier weer in de juiste volgorde
// gezet (ARTIKEL 15 hersteld, heater-inhoud onder ARTIKEL 16).

export type AvBlok =
  | { type: "lid"; nr: number; tekst: string } // genummerd lid
  | { type: "alinea"; tekst: string } // losse alinea zonder nummer
  | { type: "kop"; tekst: string } // tussenkopje binnen een artikel
  | { type: "lijst"; items: string[] }; // opsomming met bullets

export interface AvArtikel {
  nr: number;
  titel: string;
  blokken: AvBlok[];
}

export const AV_META = {
  titel: "Algemene Voorwaarden",
  bedrijf: "CityKist Beamerverhuur Zwolle",
  vestiging: "Gevestigd en kantoorhoudende te Zwolle",
  kvk: "Gedeponeerd bij de Kamer van Koophandel te Zwolle onder nummer: 08207924",
  // Datum waarop de voorwaarden voor het laatst zijn herzien. Pas aan bij
  // wijzigingen — verschijnt op de pagina en in de PDF.
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
        'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen en huurovereenkomsten evenals op de uitvoering daarvan door CityKist Beamerverhuur Zwolle, gedaan aan en/of aangegaan met derden, hierna te noemen "huurder".'
      ),
      lid(
        2,
        "Deze algemene voorwaarden zijn met uitsluiting van eventuele door de huurder gehanteerde algemene voorwaarden en/of condities van toepassing."
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
        "Afbeeldingen, beschrijvingen, aanbiedingen, reclamemateriaal evenals andere door CityKist Beamerverhuur Zwolle verstrekte gegevens binden haar niet."
      ),
      lid(
        3,
        "Een overeenkomst komt tot stand indien CityKist Beamerverhuur Zwolle de opdracht en/of aanvaarding van het aanbod heeft bevestigd."
      ),
      lid(
        4,
        "Eventuele of beweerde onjuistheden in de (opdracht)bevestiging van CityKist Beamerverhuur Zwolle dienen binnen 7 dagen na de datum van de bevestiging door de huurder aan CityKist Beamerverhuur Zwolle te worden meegedeeld, bij gebreke waarvan de inhoud van de bevestiging bindend is."
      ),
      lid(
        5,
        "De administratie van CityKist Beamerverhuur Zwolle strekt tegenover de huurder tot volledig bewijs, behoudens het door de huurder te leveren tegenbewijs."
      ),
      lid(
        6,
        "De goederen worden gehuurd voor de periode zoals vermeld in de huurovereenkomst of (opdracht)bevestiging van CityKist Beamerverhuur Zwolle. Indien de gehuurde goederen na het verstrijken van de huurperiode niet tijdig worden geretourneerd, dan wel niet op het afgesproken tijdstip voor transport gereed staan, zal voor iedere dag dat CityKist Beamerverhuur Zwolle de goederen niet tot haar beschikking heeft de normale huurprijs in rekening worden gebracht onverminderd het recht van CityKist Beamerverhuur Zwolle op schadevergoeding."
      ),
      lid(7, "Annulering: 10% annuleringskosten worden in rekening gebracht als u de order annuleert."),
    ],
  },
  {
    nr: 3,
    titel: "Prijzen",
    blokken: [
      lid(1, "Alle prijzen zijn exclusief B.T.W., tenzij anders is vermeld."),
      lid(
        2,
        "Indien na het aanbod en/of na het tot stand komen van een overeenkomst kostprijsbepalende factoren wijzigen, waaronder o.a. begrepen belastingen, accijnzen, invoerrechten en andere heffingen en lasten van overheidswege, valutakoersen, lonen, premies, de prijzen van zaken al dan niet door CityKist Beamerverhuur Zwolle van derden betrokken en/of andere factoren, die de prijs van zaken en/of diensten (mede) bepalen, is CityKist Beamerverhuur Zwolle gerechtigd de in het aanbod vermelde prijs en/of de overeengekomen prijs dienovereenkomstig te wijzigen. De huurder die als natuurlijk persoon niet handelt in de uitoefening van een beroep of bedrijf is gerechtigd de overeenkomst te ontbinden indien de prijs binnen 3 maanden na het sluiten van de overeenkomst wordt verhoogd, tenzij de verhoging het gevolg is van wettelijke bepalingen, in welk geval de huurder te allen tijde aan de verhoging is gebonden."
      ),
    ],
  },
  {
    nr: 4,
    titel: "Waarborgsom",
    blokken: [
      lid(
        1,
        "De huurder is gehouden bij ondertekening van de huurovereenkomst doch in ieder geval voordat de huurder de gehuurde goederen in ontvangst neemt de in de huurovereenkomst of (opdracht)bevestiging genoemde waarborgsom te voldoen. Na beëindiging van de huurovereenkomst en nadat de gehuurde goederen aan CityKist Beamerverhuur Zwolle zijn geretourneerd, wordt de waarborgsom terugbetaald onder aftrek van de nog onbetaalde rekeningen en/of schadevergoedingen, ook indien deze voortvloeien uit andere (huur)overeenkomsten."
      ),
      lid(
        2,
        "De huurder is gehouden de gehuurde goederen in dezelfde staat te retourneren als waarin de huurder de goederen bij aanvang van de huurovereenkomst heeft ontvangen. CityKist Beamerverhuur Zwolle is met inachtneming van het hiervoor in lid 1 vermelde slechts gehouden tot restitueren van de waarborgsom op het moment dat de huurder aan al zijn verplichtingen heeft voldaan."
      ),
      lid(3, "CityKist Beamerverhuur Zwolle is over de waarborgsom geen rente verschuldigd."),
    ],
  },
  {
    nr: 5,
    titel: "Transport",
    blokken: [
      lid(
        1,
        "Indien de huurder zelf zorg draagt voor het transport van de gehuurde goederen, geschiedt dit transport geheel voor rekening en risico van de huurder. De huurder is verplicht de gehuurde goederen te verpakken en te laden in overeenstemming met de aard van de goederen en de wijze van transport. Indien op verzoek van de huurder bij het laden/lossen van de gehuurde goederen gebruik wordt gemaakt van de diensten van CityKist Beamerverhuur Zwolle, geschiedt dit geheel voor rekening en risico van de huurder."
      ),
      lid(
        2,
        "Indien CityKist Beamerverhuur Zwolle zorg draagt voor het transport van de gehuurde goederen, vindt bezorging uitsluitend plaats achter de eerste deur op de begane grond. De huurder dient ervoor te zorgen dat iemand gedurende de afgesproken bezorgdag en tijdstip aanwezig is voor het in ontvangst nemen van de gehuurde goederen, bij gebreke waarvan CityKist Beamerverhuur Zwolle het recht heeft om het gehuurde mee terug te nemen. De hierdoor ontstane kosten zijn voor rekening van de huurder."
      ),
      lid(
        3,
        "De goederen dienen op de haaldag op de begane grond gereed te staan voor transport, op deze wijze en plek als door CityKist Beamerverhuur Zwolle is afgeleverd. Zijn de goederen niet in gereedheid gebracht voor transport, dan dient de huurder de extra kosten die hierdoor ontstaan te vergoeden. Deze extra kosten bestaan onder meer uit de huurprijs die per dag voor het gehuurde wordt berekend, extra transportkosten, extra arbeidsloon e.d."
      ),
      lid(
        4,
        "Meubilair, inrichtingen, tenten etc. dienen aan het einde van een huurperiode zo dicht mogelijk bij elkaar opgestapeld te staan om zodoende een spoedig transport mogelijk te maken."
      ),
    ],
  },
  {
    nr: 6,
    titel: "Weersinvloeden",
    blokken: [
      lid(
        1,
        "CityKist Beamerverhuur Zwolle behoudt zich het recht voor om bij slechte klimatologische omstandigheden, een en ander uitsluitend ter beoordeling van CityKist Beamerverhuur Zwolle, de huurovereenkomst ter zake tenten / springkussen(s) etc. te annuleren zonder dat dit de huurder het recht geeft om schadevergoeding of enige andere vergoeding te vorderen. Door CityKist Beamerverhuur Zwolle al ontvangen bedragen zullen volledig aan de huurder worden terugbetaald. CityKist Beamerverhuur Zwolle is hierover geen rente verschuldigd."
      ),
    ],
  },
  {
    nr: 7,
    titel: "Verplichtingen van de huurder",
    blokken: [
      lid(
        1,
        "Huurder dient partygoederen / tenten / springkussen(s) bij inontvangstneming te controleren. Bij het constateren van manco's, gebreken of andere klachten dient huurder direct contact op te nemen met CityKist Beamerverhuur Zwolle."
      ),
      lid(
        2,
        "De huurder is gedurende de gehele huurperiode aansprakelijk voor verlies en/of beschadiging van de gehuurde goederen."
      ),
      lid(
        3,
        "Huurder zal de gehuurde goederen gedurende de huurperiode als een goede huurder onder zich houden en in overeenstemming met de bestemming gebruiken."
      ),
      lid(
        4,
        "Het is de huurder niet toegestaan de gehuurde goederen zonder voorafgaande schriftelijke toestemming van CityKist Beamerverhuur Zwolle aan een ander onder te verhuren, weer te verhuren of aan de andere kant in gebruik te geven."
      ),
      lid(5, "Huurder is niet gerechtigd veranderingen in c.q. aan het gehuurde aan te brengen."),
    ],
  },
  {
    nr: 8,
    titel: "Partygoederen",
    blokken: [
      lid(
        1,
        "Zodra CityKist Beamerverhuur Zwolle de gehuurde goederen heeft terugontvangen, worden deze goederen gecontroleerd en in aanwezigheid van de huurder geteld. De telling door CityKist Beamerverhuur Zwolle is bindend."
      ),
      lid(
        2,
        "De huurder is tijdens de huurperiode en zolang hij de goederen onder zich heeft aansprakelijk voor verlies, beschadiging, breuk van en elke kwaliteitsvermindering aan de goederen, door welke oorzaak dan ook. In deze gevallen blijft de huurprijs verschuldigd, daarnaast wordt de vervangingswaarde van de verloren gegane en beschadigde goederen aan de huurder in rekening gebracht."
      ),
      lid(
        4,
        "De huurder dient goederen van stof, zoals linnengoed, tenten, springkussens, die tijdens het gebruik nat geworden zijn, te drogen, alvorens deze in te pakken ter voorkoming van vochtvlekken."
      ),
      lid(5, "Tafels, stoelen, dienen schoongemaakt te worden geretourneerd."),
    ],
  },
  {
    nr: 9,
    titel: "Tenten",
    blokken: [
      lid(
        1,
        "Indien voor plaatsing van het gehuurde volgens de plaatselijke gemeentelijke instantie een vergunning is vereist, zal de huurder er zorg voor dragen dat een dergelijke vergunning aanwezig is op het moment dat met de montage van het gehuurde een aanvang wordt gemaakt. De uit de vergunningsaanvraag voortgekomen kosten komen geheel voor rekening van de huurder."
      ),
      lid(
        2,
        "Het is de huurder niet toegestaan open vuur, zoals barbecue e.d., in de tent te gebruiken. Verwarmingsbronnen, zoals hete luchtbranders, straalkachels en verlichting dienen zodanig te worden geplaatst of opgehangen, dat geen schade aan de tent / zeil kan worden toegebracht."
      ),
      lid(
        3,
        "Versiering die in de tent wordt opgehangen, zoals crêpepapier en papieren pavoiseerlijnen, dient zodanig te worden opgehangen dat bij neerslag, condens, vocht e.d. de kleurstof geen vlekken op het tentdoek veroorzaakt."
      ),
      lid(
        4,
        "CityKist Beamerverhuur Zwolle is niet aansprakelijk voor schade welke door hulpkrachten van de huurder is veroorzaakt, tijdens het assisteren bij de (de)montage van de tenten."
      ),
      lid(
        5,
        "Het beplakken of beschilderen van het tentdoek en de constructie, alsmede het ophangen van materiaal door middel van nietjes en plakband is niet toegestaan."
      ),
      lid(
        6,
        "Huurder dient er zorg voor te dragen dat de gehuurde goederen schoon, droog en netjes gevouwen retour worden gegeven. Indien dit niet het geval is zullen de extra kosten €50,- per object bedragen."
      ),
    ],
  },
  {
    nr: 10,
    titel: "Schade en schadevergoeding",
    blokken: [
      lid(1, "Het gehuurde blijft te allen tijde eigendom van CityKist Beamerverhuur Zwolle."),
      lid(
        2,
        "De huurder is aansprakelijk voor verlies, diefstal, beschadiging, breuk of het op enigerlei wijze onbruikbaar worden van de gehuurde goederen en zal dan de gehuurde goederen tegen nieuwwaarde dienen te vergoeden. Indien schade aan tenten, springkussens is geconstateerd, zal de schadevergoeding door CityKist Beamerverhuur Zwolle worden gebaseerd op de gebruikswaarde van de tent, springkussen(s). Deze waardebepaling zal namens CityKist Beamerverhuur Zwolle worden vastgesteld en is voor de huurder bindend."
      ),
      lid(
        3,
        "Bij verlies, diefstal, schade, beschadigingen, e.d. dient de huurder hiervan CityKist Beamerverhuur Zwolle onmiddellijk op de hoogte te brengen."
      ),
      lid(
        4,
        "Indien zoekgeraakte goederen of onderdelen daarvan door de huurder worden teruggevonden, dient de huurder deze binnen 14 dagen nadat de goederen in overeenstemming met afspraak hadden moeten zijn geretourneerd alsnog aan CityKist Beamerverhuur Zwolle te retourneren. En eventuele al door de huurder betaalde schadevergoeding zal, indien de teruggevonden goederen zich nog in dezelfde staat bevinden als bij aanvang van de huurperiode, door CityKist Beamerverhuur Zwolle aan huurder worden terugbetaald. CityKist Beamerverhuur Zwolle is hierover geen rente aan de huurder verschuldigd."
      ),
      lid(
        5,
        "De huurder wordt geadviseerd de risico's tegen storm, diefstal, vernieling, brand, blikseminslag enz. te verzekeren."
      ),
      lid(
        6,
        "De expertisekosten ten behoeve van het vaststellen van schade, reparatie- en reinigingskosten komen voor rekening van de huurder. De huurder is te allen tijde gebonden aan de bevindingen van CityKist Beamerverhuur Zwolle dan wel aan de bevindingen van de door CityKist Beamerverhuur Zwolle ingeschakelde expert. Indien CityKist Beamerverhuur Zwolle de schade beneden de €750,- begroot, zal de expertise door CityKist Beamerverhuur Zwolle zelf worden verricht."
      ),
    ],
  },
  {
    nr: 11,
    titel: "Springkussens / opblaasbare objecten",
    blokken: [
      lid(
        1,
        "Huurder is te allen tijde zelf verantwoordelijk voor het plaatsen en vastzetten van het springkussen / opblaasbare objecten."
      ),
      lid(
        2,
        "Beplakken of beschilderen van het zeildoek en de constructie, evenals het betreden van het kussen met schoenen en etenswaren, ophangen van materiaal door middel van nietjes en plakband is niet toegestaan."
      ),
      lid(
        3,
        "Indien u het kussen zelf heeft geplaatst dan dient u het springkussen of opblaasobject schoon en goed op te vouwen zoals hij is geleverd. Is dit niet het geval dan zijn hier kosten aan verbonden voor het opnieuw opvouwen en transportklaar maken van het object. Kosten hiervoor zijn €50,00 per object."
      ),
    ],
  },
  {
    nr: 12,
    titel: "Niet-toerekenbare tekortkoming",
    blokken: [
      lid(
        1,
        "Indien CityKist Beamerverhuur Zwolle door een niet-toerekenbare tekortkoming is verhinderd de overeenkomst na te komen, is CityKist Beamerverhuur Zwolle gerechtigd de uitvoering van de overeenkomst op te schorten en kan zij ten gevolge daarvan niet langer worden gehouden aan de opgegeven levertijd. De huurder kan uit dien hoofde geen recht op een eventueel overeengekomen boete noch op vergoeding van kosten, schade, daaronder begrepen gevolgschade, of interesten doen gelden."
      ),
      lid(
        2,
        "Als een niet-toerekenbare tekortkoming zal o.a. gelden: oorlog, oorlogsgevaar, mobilisatie, oproer, staat van beleg, werkstaking of uitsluiting, brand, slechte weersomstandigheden, ongeval en ziekte van personeel, bedrijfsstoring, stagnatie in het vervoer, beperkingen van invoer/uitvoer of andere beperkingen van overheidswege, evenals elke belemmerende omstandigheid die niet uitsluitend van de wil van CityKist Beamerverhuur Zwolle afhankelijk is, zoals de niet tijdige levering van zaken of diensten door derden die door CityKist Beamerverhuur Zwolle zijn ingeschakeld."
      ),
    ],
  },
  {
    nr: 13,
    titel: "Aansprakelijkheid",
    blokken: [
      lid(
        1,
        "CityKist Beamerverhuur Zwolle is niet aansprakelijk voor welke schade dan ook, directe en/of gevolgschade, daaronder begrepen schade aan personen, zaken of percelen van derden, ontstaan door welke oorzaak dan ook, behoudens in geval van grove schuld of opzet van haar kant."
      ),
      lid(
        2,
        "CityKist Beamerverhuur Zwolle is eveneens niet aansprakelijk in de hierboven bedoelde zin voor handelingen van haar werknemers of andere personen, die binnen zijn risicosfeer vallen, hierbij inbegrepen (grove) schuld of opzet van deze personen."
      ),
      lid(
        3,
        "Indien CityKist Beamerverhuur Zwolle op basis van haar op dat moment bekende feiten en/of omstandigheden overgaat tot uitoefening van een opschortings- of ontbindingsrecht, terwijl nadien onherroepelijk komt vast te staan dat de uitoefening van een dergelijk recht ten onrechte is geschied, is CityKist Beamerverhuur Zwolle niet aansprakelijk en niet gehouden tot enigerlei vergoeding van schade over te gaan."
      ),
      lid(
        4,
        "In die gevallen waarin CityKist Beamerverhuur Zwolle aansprakelijk is, is de aansprakelijkheid beperkt tot de huurprijs van de goederen, ongeacht een eventuele dekking door de verzekeraar(s)."
      ),
      lid(
        5,
        "De huurder vrijwaart CityKist Beamerverhuur Zwolle tegen iedere vordering tot schadevergoeding van derden, ongeacht de oorzaak."
      ),
    ],
  },
  {
    nr: 14,
    titel: "Conversie",
    blokken: [
      lid(
        1,
        "De nietigheid of vernietigbaarheid van enige bepaling van deze algemene voorwaarden of van overeenkomsten waarop deze voorwaarden toepasselijk zijn, laat de geldigheid van de overige bepalingen onverlet."
      ),
      lid(
        2,
        "CityKist Beamerverhuur Zwolle en de huurder zijn gehouden bepalingen welke nietig zijn of zijn vernietigd te vervangen door bepalingen met zoveel mogelijk dezelfde strekking als de nietige of vernietigde bepalingen."
      ),
    ],
  },
  {
    nr: 15,
    titel: "Geschillen",
    blokken: [
      lid(
        1,
        "Op alle overeenkomsten welke door CityKist Beamerverhuur Zwolle worden gesloten, is uitsluitend Nederlands recht van toepassing."
      ),
      lid(
        2,
        "Alle geschillen welke bij de uitvoering van of in verband met een overeenkomst zijn ontstaan, zullen uitsluitend beslecht worden door de Arrondissementsrechtbank te Zwolle, tenzij de Kantonrechter als gevolg van dwingende wettelijke bepalingen ter zake een zodanig geschil bevoegd is."
      ),
      lid(
        3,
        "Indien CityKist Beamerverhuur Zwolle in rechte wordt betrokken en nadien blijkt dat dit geheel of grotendeels ten onrechte is geschied, is de huurder de kosten van buitengerechtelijk verweer tot aan de datum van dagvaarding aan CityKist Beamerverhuur Zwolle verschuldigd."
      ),
    ],
  },
  {
    nr: 16,
    titel: "Heaters",
    blokken: [
      {
        type: "alinea",
        tekst:
          "CityKist Beamerverhuur Zwolle is niet verantwoordelijk voor onzorgvuldig gebruik. Hartelijk dank dat u voor een EUROM terrasverwarmer hebt gekozen. U hebt daarmee een goede keus gemaakt! Wij hopen dat hij tot uw volle tevredenheid zal functioneren.",
      },
      {
        type: "alinea",
        tekst:
          "Om het beste uit uw terrasstraler te halen is het belangrijk dat u dit instructieboekje vóór gebruik aandachtig en in zijn geheel doorleest en ook begrijpt. Schenk daarbij speciaal aandacht aan de veiligheidsvoorschriften; die worden vermeld ter bescherming van u en uw omgeving! Bewaar het instructieboekje vervolgens om het in de toekomst nog eens te kunnen raadplegen. Bewaar ook de verpakking: dat is de beste bescherming voor uw terrasstraler tijdens de opslag buiten het seizoen. En mocht u het apparaat ooit aan iemand anders overdragen, lever er dan het instructieboekje en de verpakking bij.",
      },
      { type: "kop", tekst: "Belangrijke veiligheidsvoorschriften" },
      {
        type: "alinea",
        tekst:
          "Bij het gebruik van dit apparaat dienen altijd een aantal basale veiligheidsregels in acht te worden genomen om het risico van brand of lichamelijk letsel enz. te voorkomen. Lees daarom de veiligheidsvoorschriften, maar ook de instructies voor plaatsing en werking van het apparaat zorgvuldig door voordat u het apparaat in gebruik neemt.",
      },
      {
        type: "lijst",
        items: [
          "Voor gebruik dient het apparaat geheel volgens de instructies te zijn opgebouwd. Houd tijdens de opbouw brandbare materialen uit de buurt!",
          "Plaats uw loungeheater altijd op een stevige, vlakke, horizontale en trillingvrije ondergrond.",
          "Gebruik alleen propaan- of butaangas.",
          "Draai de kraan van de gasfles of de gasdrukregelaar dicht na gebruik.",
          "Voor gebruik buitenshuis en in ruimten die tijdens het gebruik goed geventileerd worden. Niet voor gebruik in caravans, campers, boten enz. Een ruimte is goed geventileerd wanneer 25% van het oppervlak van de wanden open is. De oppervlakte van de wanden is de som van het totale oppervlak. Gebruik in gesloten ruimtes kan gevaarlijk zijn en is VERBODEN.",
          "Dit apparaat moet worden geïnstalleerd in overeenstemming met de instructies en volgens de wettelijke voorschriften.",
          "Toestelcategorie: A.",
          "De ventilatieopeningen in de gasflesbehuizing mogen nooit worden geblokkeerd. Houd ze ook vrij van vuil.",
          "Voor het gebruik van gasflessen bestaan wettelijke voorschriften. Installeer en bewaar de gasfles conform deze voorschriften. Gebruik geen ander gas of andere licht ontvlambare vloeistof in de terrasverwarmer dan het door de fabrikant voorgeschreven propaan- of butaangas, in EEC-goedgekeurde gascilinders met een veiligheidsventiel. Gebruik nooit een gasfles met een beschadigd oppervlak, ventiel, ring of bodem!",
          "Vervang de gasfles buitenshuis, en uit de buurt van vuur, vonken en andere ontstekingsbronnen.",
          "Bewaar geen lichtontvlambare vloeistoffen of materialen als verf, benzine, gastankjes enz. in de onmiddellijke nabijheid van het apparaat. Gebruik het apparaat niet in een brandgevaarlijke omgeving zoals nabij gastanks, gasleidingen of spuitbussen. Dat levert explosie- en brandgevaar op!",
          "Als het apparaat beschadiging of storing vertoont, wend u dan tot uw leverancier, de fabrikant of een erkend servicepunt ter reparatie of vervanging. Voer zelf geen reparaties uit, dat kan gevaarlijk zijn! Reparaties, uitgevoerd door onbevoegden of wijzigingen aan het apparaat doen de garantie en de aansprakelijkheid van de fabrikant vervallen.",
          "Vervang de flexibele slang op de voorgeschreven tijden.",
          "Probeer op geen enkele wijze veranderingen aan het apparaat aan te brengen. Verkeerde installatie, onoordeelkundig gebruik, wijzigingen of aanpassingen aan het apparaat kunnen schade of letsel veroorzaken. Fabrikant en importeur aanvaarden hiervoor geen enkele verantwoordelijkheid!",
          "Gebruik uitsluitend de regelaar die door de fabrikant wordt meegeleverd, ook bij eventuele vervanging.",
          "Het hele gassysteem, slangregulatie, waakvlam en brander moeten voor gebruik en na het verwisselen van de gasfles eerst gecontroleerd worden, en daarna minstens elke maand een keer. Alle lekkagecontroles moeten worden uitgevoerd met een zeepoplossing, nooit met vuur! Neem de verwarmer niet in gebruik voordat alle verbindingen op lekkages gecontroleerd zijn. Rook niet tijdens de controles.",
          "Draai het ventiel van de gasfles onmiddellijk dicht als u de geur van gas waarneemt. Gas is licht ontvlambaar, explosief en zwaarder dan lucht, dus het blijft laag hangen. In zijn natuurlijke staat heeft propaangas geen geur; voor uw veiligheid is er een geur aan toegevoegd, te vergelijken met die van verrotte kool.",
          "Verplaats de terrasstraler niet terwijl hij in werking is. Draai de gasfles dicht voordat u het apparaat verplaatst en laat de terrasverwarmer eerst afkoelen.",
          "Als de terrasverwarmer niet in gebruik is dient de gasfles dichtgedraaid te zijn en de bedieningsknop op UIT (OFF).",
          "Controleer regelmatig of de aansluitingen op de gasdrukregelaar passend en in goede conditie zijn.",
          "Bedieningspaneel, brander en de luchtcirculatiegang moeten regelmatig worden gereinigd. Zorg er wel voor alle voor de reiniging verwijderde (beveiligings)onderdelen terug te plaatsen!",
          "Verf vlammenscherm, besturingspaneel of reflectorkap niet.",
          "Zorg ervoor dat gasdrukregelaar en slang zich te allen tijde op een zodanige plaats bevinden dat er geen toevallige schade aan kan worden toegebracht en niemand erover kan struikelen.",
          "Gebruik de terrasverwarmer uitsluitend voor het doel waarvoor hij is ontworpen: het verwarmen van een terras of vergelijkbare ruimte. Dus niet om zalen, kassen, bars o.i.d. te verwarmen en niet voor het drogen van textiel of andere vochtige voorwerpen.",
          "Houd ontvlambare materialen uit de buurt van de verwarmer.",
          "De terrasverwarmer kan intense hitte voortbrengen. Stel mensen (i.h.b. kleine kinderen en ouderen) en dieren niet aan de directe hitte van de terrasverwarmer bloot. Pas ook op voor brandwonden en kledingschade!",
          "Contact met vloeibaar gas kan bevriezingswonden veroorzaken.",
          "Zorg voor zorgvuldig toezicht wanneer dit apparaat wordt gebruikt in de aanwezigheid van kinderen, handelingsonbekwame personen of huisdieren. Dit apparaat is niet geschikt om te worden gebruikt door personen (incl. kinderen) met een fysieke-, zintuiglijke- of mentale beperking, of gebrek aan ervaring en kennis, ongeacht of er toezicht is of instructie is gegeven aangaande het gebruik van het apparaat door een persoon die verantwoordelijk is voor hun veiligheid. Er dient op te worden toegezien dat kinderen niet met het apparaat spelen.",
          "Bij stevige wind dienen er maatregelen te worden getroffen tegen omwaaien van de terrasstraler.",
          "Dompel het apparaat nooit in water, zorg ervoor dat hij er niet in kan vallen en voorkom dat water het apparaat kan binnendringen.",
        ],
      },
      {
        type: "alinea",
        tekst:
          "Bij de volgende verschijnselen dient u de terrasverwarmer onmiddellijk uit te schakelen en na te (laten) kijken:",
      },
      {
        type: "lijst",
        items: [
          "Als de verwarming niet heet genoeg wordt.",
          "Als de brander ploppende geluiden maakt tijdens het gebruik (een zacht geluidje tijdens het doven is normaal).",
          "Als de vlampunten extreem geel zijn en u gas ruikt.",
        ],
      },
      {
        type: "alinea",
        tekst: "Waarschuwing! Laat het apparaat nooit zonder toezicht achter als het in werking is.",
      },
      { type: "kop", tekst: "Plaatsing" },
      {
        type: "lijst",
        items: [
          "Gebruik het apparaat uitsluitend buiten of in een goed geventileerde ruimte. Een ruimte is goed geventileerd wanneer minimaal 25% van het oppervlak van de wanden open is.",
          "Plaats het apparaat altijd op een stevige, vlakke, horizontale en trillingvrije ondergrond.",
          "Zorg altijd voor voldoende afstand tot brandbare materialen: minimaal 1 meter.",
          "Gebruik het apparaat nooit in een omgeving waar licht ontvlambare vloeistoffen of gassen zijn opgeslagen: explosiegevaar!",
        ],
      },
      { type: "kop", tekst: "Gas-eisen" },
      {
        type: "lijst",
        items: [
          "Gebruik uitsluitend propaan- of butaangas.",
          "De maximale ingangsdruk van de gasregelaar mag de 10 bar niet overschrijden.",
          "Een minimale aanvoerdruk van 20 mbar is vereist.",
          "De te gebruiken gasdrukregelaar en slang moeten voldoen aan de wettelijke richtlijnen.",
          "De slang dient 60 cm lang te zijn en van het type EN1763-1-class 2-6.3-20bar propaan/butaan met schroefkoppeling.",
          "De installatie dient conform de wettelijke richtlijnen voor opslag en gebruik van vloeibare petroleumgassen plaats te vinden.",
          "Een gedeukte, geroeste of beschadigde gasfles kan gevaarlijk zijn en moet gecontroleerd worden door uw gasleverancier. Gebruik nooit een gasfles met een beschadigd ventiel.",
          "Verbind nooit een gastank die niet aan de voorschriften voldoet aan de terrasverwarmer!",
          "Sluit de drukregelaar aan op de gasfles en draai de sluiting stevig aan met een verstelbare schroefsleutel, tegen de klok in.",
          "Plaats de gasfles in de omkasting en sluit deze. Uw terrasverwarmer is nu gemonteerd.",
        ],
      },
      {
        type: "alinea",
        tekst:
          "Voer nu een uitgebreide lekkagetest uit: bestrijk de hele 'gasroute' met de zeepoplossing en stel vast dat nergens gas weglekt. Met name de aansluitpunten zijn risicoplaatsen: intensiveer daar de controles! Pas wanneer u 100% zeker weet dat er nergens gas weglekt, mag u de terrasverwarmer in gebruik nemen. Zie ook het hoofdstuk: Controle op gaslekkage.",
      },
      { type: "kop", tekst: "Controle op gaslekkage" },
      {
        type: "alinea",
        tekst:
          "De verbindingen van de terrasverwarmer zijn voor verscheping in de fabriek gecontroleerd op lekkage. Om de mogelijkheid van schade tijdens het transport of door hoge druk uit te sluiten dient er tijdens de installatie nogmaals een complete lekkagetest te worden uitgevoerd.",
      },
      {
        type: "lijst",
        items: [
          "Voer de controle uit met een volle gasfles.",
          "Zet de bedieningsknop in de UIT (OFF) stand.",
          "Maak een zeepoplossing van één deel vloeibare zeep en één deel water.",
          "Breng de zeepoplossing op het hele systeem, in het bijzonder op de verbindingen, aan met een spuitfles, borstel of doek.",
          "Draai de gastoevoer open. Als er sprake is van een lek zullen er zeepbellen ontstaan.",
          "Als er sprake is van een lek, schakel dan de gastoevoer uit. Bevestig het lekkende onderdeel strakker, schakel de gastoevoer weer in en controleer opnieuw. Blijven er bellen ontstaan, neem dan contact op met uw leverancier.",
          "Zorg ervoor dat er geen vuur of vonken in de buurt zijn als u de lekkagetest uitvoert en rook er niet bij!",
          "Als de gasslang tekenen van barsten, scheuren of andere beschadigingen vertoont, moet hij worden vervangen door een nieuwe buis of slang van dezelfde lengte en van equivalente kwaliteit.",
        ],
      },
      { type: "kop", tekst: "De geur van gas" },
      {
        type: "alinea",
        tekst:
          "Aan gas is een geur toegevoegd om u in staat te stellen een gaslek te ontdekken. Gas is zwaarder dan lucht; probeer dus vlak boven de grond de geur op te vangen! Neem onmiddellijk maatregelen als u gas ruikt!",
      },
      {
        type: "lijst",
        items: [
          "Sluit onmiddellijk de gastoevoer.",
          "Doe niets wat tot vonk of vuur kan leiden om ontsteking van het gas te voorkomen. Schakel geen elektriciteit in of uit, steek geen lucifer, aansteker o.i.d. aan en gebruik uw telefoon niet.",
          "Haal iedereen weg uit de buurt van de gasbron en geef het gas ruimschoots de tijd te verwaaien. Blijf tijdens dat proces uit de buurt! Blijft u gas ruiken of vertrouwt u de situatie niet, alarmeer dan de brandweer.",
          "Laat een gaslek door gekwalificeerde mensen repareren!",
        ],
      },
    ],
  },
];
