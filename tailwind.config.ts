import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary Red Palette (based on #B80238)
        primary: {
          50: '#fef2f2',
          100: '#fee2e2', 
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#B80238', // Main brand color
          600: '#a60232',
          700: '#8c022b',
          800: '#720224',
          900: '#58021c',
          950: '#3e0114',
        },
        // Professional Black Palette
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Semantic colors using the primary palette
        destructive: {
          DEFAULT: '#B80238',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: {
          DEFAULT: '#fef2f2',
          foreground: '#B80238',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#171717',
        },
        border: '#e5e5e5',
        input: '#e5e5e5',
        ring: '#B80238',
        background: '#ffffff',
        foreground: '#171717',
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#171717',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
