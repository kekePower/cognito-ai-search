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
        border: {
          DEFAULT: 'hsl(214.3 31.8% 91.4%)',
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        input: {
          DEFAULT: 'hsl(214.3 31.8% 91.4%)',
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        ring: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)',
          dark: 'hsl(224.3 76.3% 48%)'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#0B1120'
        },
        foreground: {
          DEFAULT: '#0B1120',
          dark: '#F0F0F0'
        },
        primary: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)',
          foreground: {
            DEFAULT: 'hsl(210 40% 98%)',
            dark: 'hsl(222.2 47.4% 11.2%)'
          },
          dark: 'hsl(217.2 91.2% 59.8%)'
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: {
            DEFAULT: 'hsl(222.2 47.4% 11.2%)',
            dark: 'hsl(210 40% 98%)'
          },
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: {
            DEFAULT: 'hsl(210 40% 98%)',
            dark: 'hsl(210 40% 98%)' // Assuming same as light, adjust if needed
          },
          dark: 'hsl(0 62.8% 30.6%)'
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: {
            DEFAULT: 'hsl(215.4 16.3% 46.9%)',
            dark: 'hsl(215 20.2% 65.1%)'
          },
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: {
            DEFAULT: 'hsl(222.2 47.4% 11.2%)',
            dark: 'hsl(210 40% 98%)'
          },
          dark: 'hsl(217.2 32.6% 17.5%)'
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(210 40% 98%)'
          },
          dark: 'hsl(222.2 84% 4.9%)'
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(210 40% 98%)'
          },
          dark: 'hsl(222.2 84% 4.9%)'
        }
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
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'pulse-shadow': {
          '0%': { boxShadow: '0 0 5px 0px rgba(var(--primary-rgb), 0.3)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(var(--primary-rgb), 0.5)' },
          '100%': { boxShadow: '0 0 5px 0px rgba(var(--primary-rgb), 0.3)' },
        },
        'pulse-shadow-white': {
          '0%': { boxShadow: '0 0 5px 0px rgba(255, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.5)' },
          '100%': { boxShadow: '0 0 5px 0px rgba(255, 255, 255, 0.3)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
        slideInFromLeft: 'slideInFromLeft 0.5s ease-in-out',
        slideOutToLeft: 'slideOutToLeft 0.5s ease-in-out',
        'pulse-shadow': 'pulse-shadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-shadow-white': 'pulse-shadow-white 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  // plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

export default config
