import Script from "next/script";

// Google Analytics (gtag.js) — geladen via next/script met "afterInteractive"
// zodat het de pagina niet vertraagt en pas na hydratatie wordt uitgevoerd.
// Gebruik de NEXT_PUBLIC_GA_ID env-var om in dev/staging te kunnen uitschakelen;
// zonder env-var valt het terug op het standaard productie-meet-ID.
const FALLBACK_GA_ID = "G-0RGYGTYD12";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || FALLBACK_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
