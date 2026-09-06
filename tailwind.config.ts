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
        panel: "#12162A",
        panelAlt: "#171C33",
        line: "#242B4A",
        ink: "#E8ECF7",
        muted: "#8891B0",
        cyan: "#3DE8FF",
        magenta: "#FF4FA3",
        amber: "#FFB347",
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
