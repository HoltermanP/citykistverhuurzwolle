// JSON-LD structured data voor Google. Maakt rich-result eligibility mogelijk
// (bedrijfsknowledge panel, openingstijden, locatie, telefoon).
// LocalBusiness schema met sub-type "RentalBusiness" past het beste.

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.citykistverhuurzwolle.nl";

export default function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "@id": `${SITE_URL}/#business`,
    name: "CityKist Verhuur",
    legalName: "CityKist Verhuur Zwolle",
    description:
      "Verhuurbedrijf voor feest- en evenementenmaterialen in Zwolle: beamers, geluid, karaoke, verlichting, rookmachines en glow-in-the-dark.",
    url: SITE_URL,
    telephone: "+31622632107",
    email: "info@citykistverhuurzwolle.nl",
    image: `${SITE_URL}/images/sfeer/stage.jpg`,
    logo: `${SITE_URL}/images/sfeer/lights.jpg`,
    priceRange: "€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tichelmeesterlaan 24",
      postalCode: "8014 LB",
      addressLocality: "Zwolle",
      addressRegion: "Overijssel",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.5046,
      longitude: 6.0822,
    },
    areaServed: [
      { "@type": "City", name: "Zwolle" },
      { "@type": "City", name: "Kampen" },
      { "@type": "City", name: "Hattem" },
      { "@type": "AdministrativeArea", name: "Overijssel" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    sameAs: [],
    knowsAbout: [
      "Beamers verhuren",
      "Geluidsinstallatie verhuren",
      "Karaoke verhuren",
      "Verlichting verhuren",
      "Rookmachine verhuren",
      "Glow-in-the-dark verhuur",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "CityKist Verhuur",
    inLanguage: "nl-NL",
    publisher: { "@id": `${SITE_URL}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/producten?zoek={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
