import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.citykistverhuurzwolle.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Beheer + aanvraag-flow + API horen niet in zoekmachines.
        disallow: ["/admin", "/admin/", "/api/", "/aanvraag", "/aanvraag/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
