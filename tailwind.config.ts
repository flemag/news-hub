import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B0E1A",
        panel: "#151B32",
        panelAlt: "#1A213A",
        line: "#2E3658",
        ink: "#F1F4FC",
        muted: "#A8B0CC",
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
