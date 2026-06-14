import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Algemene party kleuren (tropical: teal → lime)
        party: {
          DEFAULT: "#0891B2", // cyan-600 — leesbaar als tekst/knop op wit
          light: "#22D3EE", // cyan-400 — voor accenten op donkere hero
          dark: "#0E7490", // cyan-700 — hover
        },
        pink: {
          party: "#84CC16", // lime — secundaire feestkleur
        },
        cyan: {
          party: "#06B6D4",
        },
        // WK-specifiek
        oranje: {
          DEFAULT: "#FF6B00",
          light: "#FF8C33",
          dark: "#CC5500",
        },
        marine: {
          DEFAULT: "#003580",
          light: "#1A4DA0",
          dark: "#00245A",
        },
        // Achtergrond (licht thema — tokennamen behouden voor compatibiliteit)
        dark: {
          DEFAULT: "#F4F5F8", // pagina-achtergrond
          card: "#FFFFFF", // kaarten / panelen
          border: "#E4E7EC", // randen
        },
        navy: {
          DEFAULT: "#EEF1F6",
          light: "#E4E9F2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-party": "linear-gradient(135deg, #0891B2 0%, #65A30D 100%)",
        "gradient-party-dark": "linear-gradient(135deg, #0E7490 0%, #0891B2 45%, #65A30D 100%)",
        "gradient-wk": "linear-gradient(135deg, #1A4DA0 0%, #003580 55%, #1A4DA0 100%)",
        "gradient-oranje": "linear-gradient(135deg, #FF6B00, #CC5500)",
        "gradient-card": "linear-gradient(145deg, #FFFFFF, #F7F8FB)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
