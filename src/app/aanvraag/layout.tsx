import type { Metadata } from "next";

// /aanvraag is een formulier achter de winkelmand — niet relevant voor Google.
// Wel nette title/description voor wanneer iemand de URL deelt.
export const metadata: Metadata = {
  title: "Aanvraag plaatsen",
  description:
    "Vul je gegevens in om je verhuuraanvraag definitief te maken bij CityKist Verhuur Zwolle.",
  robots: { index: false, follow: false },
};

export default function AanvraagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
