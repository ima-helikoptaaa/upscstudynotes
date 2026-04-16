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
        background:      "var(--color-bg)",
        surface:         "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        primary: {
          DEFAULT: "var(--color-primary)",
          hover:   "var(--color-primary-hover)",
          light:   "var(--color-primary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light:   "var(--color-accent-light)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong:  "var(--color-border-strong)",
        },
      },
      textColor: {
        primary:   "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        muted:     "var(--color-text-muted)",
      },
      fontFamily: {
        sentient: ["var(--font-sentient)", "Georgia", "serif"],
        satoshi:  ["var(--font-satoshi)", "Inter", "sans-serif"],
        sans:     ["var(--font-satoshi)", "Inter", "sans-serif"],
      },
      fontSize: {
        /* Larger, readable scale */
        h1:   ["3rem",      { lineHeight: "1.1",  letterSpacing: "-0.03em"  }],
        h2:   ["2.25rem",   { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        h3:   ["1.5rem",    { lineHeight: "1.25", letterSpacing: "-0.02em"  }],
        h4:   ["1.25rem",   { lineHeight: "1.3",  letterSpacing: "-0.015em" }],
        body: ["1.0625rem", { lineHeight: "1.65", letterSpacing: "-0.01em"  }],
        sm:   ["0.9375rem", { lineHeight: "1.5",  letterSpacing: "-0.01em"  }],
        xs:   ["0.8125rem", { lineHeight: "1.4"                             }],
      },
      borderRadius: {
        sm:    "0.375rem",
        DEFAULT:"0.5rem",
        md:    "0.75rem",
        lg:    "1rem",
        xl:    "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      /* Zero box-shadows — depth through borders + background contrast */
      boxShadow: {
        none: "none",
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)"   },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition: "400% 0"  },
        },
      },
      animation: {
        "fade-up": "fade-up 175ms ease-out",
        shimmer:   "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
