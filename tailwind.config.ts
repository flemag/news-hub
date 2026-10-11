import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B0E1A",
        panel: "#151B32",
        panelAlt: "#1A213A",
        line: "#3A4568",
        /* Titres / corps principal — contraste fort sur panel */
        ink: "#F4F6FC",
        /* Secondaire : un cran plus clair qu’avant pour le desktop */
        muted: "#B8C0D6",
        cyan: "#5EEBFF",
        magenta: "#FF6BB5",
        amber: "#FFC45C",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
