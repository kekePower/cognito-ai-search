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
          50: "hsl(var(--secondary-50))",
          100: "hsl(var(--secondary-100))",
          200: "hsl(var(--secondary-200))",
          700: "hsl(var(--secondary-700))",
          800: "hsl(var(--secondary-800))",
          900: "hsl(var(--secondary-900))",
          950: "hsl(var(--secondary-950))",
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
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
          subtle: "hsl(var(--text-subtle))",
          disabled: "hsl(var(--text-disabled))",
          inverse: "hsl(var(--text-inverse))",
          accent: "hsl(var(--text-accent))",
          success: "hsl(var(--text-success))",
          warning: "hsl(var(--text-warning))",
          error: "hsl(var(--text-error))",
        },
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
        },
        neon: {
          cyan: "hsl(var(--neon-cyan))",
          magenta: "hsl(var(--neon-magenta))",
          blue: "hsl(var(--neon-blue))",
        },
        shimmer: {
          1: "hsl(var(--shimmer-1))",
          2: "hsl(var(--shimmer-2))",
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(255, 255, 255, 0.18)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'neon-magenta': '0 0 20px rgba(236, 72, 153, 0.5)',
        'cognito': '0 4px 16px rgba(59, 130, 246, 0.2), 0 8px 32px rgba(139, 92, 246, 0.1)',
        'sharp-glow': '0 0 20px rgba(var(--color-primary), 0.6), 0 0 30px rgba(var(--color-primary), 0.4)',
        'soft-glow': '0 0 15px rgba(var(--color-accent), 0.5)',
        'card-hover': '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.08)',
      },
      keyframes: {
        "glint-sweep": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { transform: "translateX(0%)", opacity: "0.5" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
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
            backgroundImage: "linear-gradient(90deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-blue)) 50%, hsl(var(--neon-magenta)) 100%)",
            backgroundSize: "100% 2px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 0"
          }
        },
        "border-sweep-out": {
          "0%": { 
            backgroundImage: "linear-gradient(90deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-blue)) 50%, hsl(var(--neon-magenta)) 100%)",
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
            borderColor: "hsl(var(--neon-cyan) / 0.2)",
            boxShadow: "0 0 0 1px hsl(var(--neon-cyan) / 0.1)"
          },
          "50%": { 
            borderColor: "hsl(var(--neon-cyan) / 0.8)",
            boxShadow: "0 0 0 4px hsl(var(--neon-cyan) / 0.3)"
          }
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "cognito-glow": {
          '0%, 100%': { 
            textShadow: '0 0 5px var(--tw-gradient-from), 0 0 10px var(--tw-gradient-from), 0 0 15px var(--tw-gradient-to), 0 0 20px var(--tw-gradient-to)', 
            opacity: '0.8'
          },
          '50%': { 
            textShadow: '0 0 10px var(--tw-gradient-from), 0 0 20px var(--tw-gradient-from), 0 0 30px var(--tw-gradient-to), 0 0 40px var(--tw-gradient-to)',
            opacity: '1'
          },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
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
        "shimmer": "shimmer 2s linear infinite",
        "cognito-glow": "cognito-glow 3s ease-in-out infinite",
        "neon-pulse": "neon-pulse 1.5s ease-in-out infinite",
        "glint-sweep": "glint-sweep 0.75s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}

export default config
