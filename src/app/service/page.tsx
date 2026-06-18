import type { Metadata } from "next";
import { db } from "@/lib/db";
import { handleidingen } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { FileText, Download, Lightbulb, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Service & handleidingen",
  description:
    "Handleidingen, aansluitschema's en tips voor de gehuurde apparatuur van CityKist Verhuur Zwolle: beamers, geluid, speakers en meer.",
  alternates: { canonical: "/service" },
  openGraph: {
    title: "Service & handleidingen — CityKist Verhuur Zwolle",
    description: "Handleidingen, aansluitschema's en tips voor je gehuurde apparatuur.",
    url: "/service",
  },
};

// Volgorde waarin de categorieën worden getoond.
const CATEGORIE_VOLGORDE = ["Beamer & scherm", "Geluid & speakers", "Aansluitschema's", "Algemeen"];

export default async function ServicePage() {
  let alle: (typeof handleidingen.$inferSelect)[] = [];
  try {
    alle = await db.select().from(handleidingen).orderBy(asc(handleidingen.volgorde));
  } catch {
    // DB nog niet geconfigureerd
  }

  const groepen: Record<string, typeof alle> = {};
  for (const h of alle) {
    const cat = h.categorie || "Algemeen";
    (groepen[cat] ||= []).push(h);
  }
  const categorieën = [
    ...CATEGORIE_VOLGORDE.filter((c) => groepen[c]?.length),
    ...Object.keys(groepen).filter((c) => !CATEGORIE_VOLGORDE.includes(c)),
  ];

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-party-dark via-party to-pink-party">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <span className="inline-flex items-center gap-2 text-cyan-200 font-bold text-sm uppercase tracking-wider mb-2">
            <Wrench size={16} /> Service
          </span>
          <h1 className="text-white font-black text-3xl md:text-5xl">
            Handleidingen &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">aansluitschema&apos;s</span>
          </h1>
          <p className="text-white/90 mt-3 max-w-2xl">
            Alles om je gehuurde apparatuur snel aan de praat te krijgen. Download de handleiding of
            het aansluitschema dat je nodig hebt. Vragen? Bel <strong>06-226 321 07</strong>.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {alle.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-slate-600 text-lg">Er zijn nog geen handleidingen beschikbaar.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categorieën.map((cat) => (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-dark-border">
                  <span className="w-1.5 h-7 rounded-full bg-gradient-party" />
                  <h2 className="text-slate-900 font-black text-xl">{cat}</h2>
                  <span className="text-slate-400 text-sm">({groepen[cat].length})</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {groepen[cat].map((h) =>
                    h.bestandUrl ? (
                      <a
                        key={h.id}
                        href={h.bestandUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-party/50 hover:shadow-lg hover:shadow-party/5 transition-all"
                      >
                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-party/10 text-party flex items-center justify-center group-hover:bg-party group-hover:text-white transition-colors">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-semibold leading-snug">{h.titel}</p>
                          {h.beschrijving && <p className="text-slate-500 text-sm mt-1">{h.beschrijving}</p>}
                          <span className="inline-flex items-center gap-1 text-party text-sm font-medium mt-2">
                            <Download size={14} /> Download PDF
                          </span>
                        </div>
                      </a>
                    ) : (
                      <div
                        key={h.id}
                        className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5"
                      >
                        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Lightbulb size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-semibold leading-snug">{h.titel}</p>
                          {h.beschrijving && <p className="text-slate-600 text-sm mt-1 leading-relaxed">{h.beschrijving}</p>}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
