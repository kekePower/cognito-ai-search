import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
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
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutToLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        "pulse-shadow": {
          "0%": { boxShadow: "0 0 5px 0px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 20px 5px hsl(var(--primary) / 0.5)" },
          "100%": { boxShadow: "0 0 5px 0px hsl(var(--primary) / 0.3)" },
        },
        "pulse-shadow-white": {
          "0%": { boxShadow: "0 0 5px 0px rgba(255, 255, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)" },
          "100%": { boxShadow: "0 0 5px 0px rgba(255, 255, 255, 0.3)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "border-sweep-in": {
          "0%": { 
            backgroundImage: "linear-gradient(90deg, transparent 0%, transparent 100%)",
            backgroundSize: "100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 0"
          },
          "100%": { 
            backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            backgroundSize: "100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 0"
          }
        },
        "border-sweep-out": {
          "0%": { 
            backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
            backgroundSize: "100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 0"
          },
          "100%": { 
            backgroundImage: "linear-gradient(90deg, transparent 0%, transparent 100%)",
            backgroundSize: "100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 0"
          }
        },
        "border-pulse": {
          "0%, 100%": { 
            borderColor: "rgb(59 130 246 / 0.2)",
            boxShadow: "0 0 0 1px rgb(59 130 246 / 0.1)"
          },
          "50%": { 
            borderColor: "rgb(59 130 246 / 0.8)",
            boxShadow: "0 0 0 4px rgb(59 130 246 / 0.3)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
        slideInFromLeft: "slideInFromLeft 0.5s ease-in-out",
        slideOutToLeft: "slideOutToLeft 0.5s ease-in-out",
        "pulse-shadow": "pulse-shadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-shadow-white": "pulse-shadow-white 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "border-spin": "spin 3s linear infinite",
        "border-sweep-in": "border-sweep-in 0.3s ease-out forwards",
        "border-sweep-out": "border-sweep-out 0.3s ease-out forwards",
        "border-pulse": "border-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

export default config
