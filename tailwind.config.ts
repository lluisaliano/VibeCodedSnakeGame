import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05060b",
        neon: "#4cffc5",
        neonBlue: "#6ae4ff",
        neonPink: "#ff5bd5",
        panel: "#0d1220"
      },
      boxShadow: {
        glow: "0 0 18px rgba(76, 255, 197, 0.35)",
        glowStrong: "0 0 30px rgba(106, 228, 255, 0.55)"
      },
      fontFamily: {
        display: ["'Share Tech Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        body: ["'Space Grotesk'", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
