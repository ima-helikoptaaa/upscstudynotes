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
        background: "var(--color-bg)",
        sidebar: "var(--color-sidebar)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted: "var(--color-text-muted)",
      },
      fontFamily: {
        sentient: ["Sentient", "Georgia", "serif"],
        satoshi: ["Satoshi", "Inter", "sans-serif"],
        sans: ["Satoshi", "Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        h2: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        h4: ["1.0625rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        body: ["0.9375rem", { lineHeight: "1.65", letterSpacing: "-0.01em" }],
        sm: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        xs: ["0.75rem", { lineHeight: "1.4", letterSpacing: "-0.005em" }],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.25rem",
      },
      /* Zero shadows — depth via borders + bg contrast only */
      boxShadow: {
        none: "none",
      },
      keyframes: {
        "border-beam": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition: "400% 0" },
        },
      },
      animation: {
        "border-beam": "border-beam 2.5s linear infinite",
        "fade-up": "fade-up 175ms ease-out",
        "slide-in-left": "slide-in-left 200ms ease-out",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
