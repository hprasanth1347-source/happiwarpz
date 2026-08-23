import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand red palette
        brand: {
          50:  "#fff0f0",
          100: "#ffe0e0",
          200: "#ffb8b8",
          300: "#ff8080",
          400: "#ff4040",
          500: "#DC2626",  // Primary red
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#450a0a",
        },
        // Dark theme surfaces
        dark: {
          bg:      "#0d0d0d",   // deepest background
          surface: "#141414",   // card/panel background
          card:    "#1a1a1a",   // card slight lift
          border:  "#2a2a2a",   // subtle borders
          hover:   "#222222",   // hover states
        },
        // Gold accents
        gold: "#D4AF37",
        // Legacy luxury tokens (keep for compatibility)
        luxury: {
          black:    "#0d0d0d",
          dark:     "#1a1a1a",
          charcoal: "#262626",
          gray:     "#6b7280",
          lightGray:"#F5F5F5",
          gold:     "#D4AF37",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
