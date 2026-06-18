import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { AV_META, AV_ARTIKELEN } from "@/lib/algemene-voorwaarden";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden",
  description:
    "De algemene voorwaarden van CityKist Beamerverhuur Zwolle. Lees ze online of download ze als PDF.",
  alternates: { canonical: "/algemene-voorwaarden" },
  openGraph: {
    title: "Algemene Voorwaarden — CityKist Verhuur Zwolle",
    description: "Lees de algemene voorwaarden van CityKist of download ze als PDF.",
    url: "/algemene-voorwaarden",
  },
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-party-dark">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
          <span className="inline-block text-cyan-300 font-bold text-sm uppercase tracking-wider mb-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
            Juridisch
          </span>
          <h1 className="text-white font-black text-3xl md:text-5xl [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-lime-300">
              Algemene Voorwaarden
            </span>
          </h1>
          <p className="text-white/90 text-base md:text-lg mt-3 max-w-2xl mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            {AV_META.bedrijf}. {AV_META.vestiging}.
          </p>

          <a
            href="/algemene-voorwaarden/pdf"
            className="inline-flex items-center gap-2 mt-6 bg-white text-party font-bold rounded-xl px-5 py-3 hover:bg-cyan-50 transition-colors shadow-lg"
          >
            <Download size={18} />
            Download als PDF
          </a>
        </div>
      </section>

      {/* ── INHOUD ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Bedrijfsgegevens */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="w-11 h-11 bg-party/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-party" />
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="text-slate-900 font-semibold">{AV_META.bedrijf}</p>
            <p>{AV_META.vestiging}.</p>
            <p>{AV_META.kvk}.</p>
            <p className="text-slate-400 text-xs pt-1">{AV_META.versie}</p>
          </div>
        </div>

        {/* Inhoudsopgave */}
        <nav
          aria-label="Inhoudsopgave"
          className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-10"
        >
          <h2 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wide">Inhoud</h2>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {AV_ARTIKELEN.map((a) => (
              <li key={a.nr}>
                <a
                  href={`#artikel-${a.nr}`}
                  className="text-slate-600 hover:text-party text-sm transition-colors"
                >
                  <span className="text-slate-400 tabular-nums mr-1">Art. {a.nr}.</span>
                  {a.titel}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Artikelen */}
        <div className="space-y-10">
          {AV_ARTIKELEN.map((a) => (
            <article key={a.nr} id={`artikel-${a.nr}`} className="scroll-mt-24">
              <h2 className="text-slate-900 font-black text-xl md:text-2xl mb-4 flex items-baseline gap-3">
                <span className="text-party tabular-nums">Artikel {a.nr}</span>
                <span className="text-slate-700 font-bold text-lg md:text-xl">{a.titel}</span>
              </h2>

              <div className="space-y-3">
                {a.blokken.map((blok, i) => {
                  if (blok.type === "lid") {
                    return (
                      <div key={i} className="flex gap-3">
                        <span className="text-party font-bold tabular-nums flex-shrink-0 w-6 text-right">
                          {blok.nr}.
                        </span>
                        <p className="text-slate-600 leading-relaxed">{blok.tekst}</p>
                      </div>
                    );
                  }
                  if (blok.type === "kop") {
                    return (
                      <h3
                        key={i}
                        className="text-slate-900 font-bold text-base pt-3 uppercase tracking-wide"
                      >
                        {blok.tekst}
                      </h3>
                    );
                  }
                  if (blok.type === "lijst") {
                    return (
                      <ul key={i} className="space-y-2 pl-1">
                        {blok.items.map((item, j) => (
                          <li key={j} className="flex gap-3 text-slate-600 leading-relaxed">
                            <span className="text-party flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-party" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-slate-600 leading-relaxed">
                      {blok.tekst}
                    </p>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        {/* Download onderaan */}
        <div className="mt-12 pt-8 border-t border-dark-border text-center">
          <a
            href="/algemene-voorwaarden/pdf"
            className="inline-flex items-center gap-2 bg-gradient-party text-white font-bold rounded-xl px-6 py-3 hover:opacity-90 transition-opacity shadow-lg"
          >
            <Download size={18} />
            Download de algemene voorwaarden (PDF)
          </a>
        </div>
      </div>
    </>
  );
}
