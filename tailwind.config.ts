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
        // Paleta de marca Fotoeditores
        midnight: "#0A1628",
        electric: "#0066FF",
        cyan: {
          digital: "#00D4FF",
          DEFAULT: "#00D4FF",
        },
        gold: "#FFB800",
        cosmos: "#1A1A2E",
        "ice-blue": "#E8F4FD",
        "clean-white": "#F0F4F8",
        coral: "#FF4D6D",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-main":
          "linear-gradient(135deg, #0A1628 0%, #0066FF 100%)",
        "gradient-energy":
          "linear-gradient(90deg, #0066FF 0%, #00D4FF 100%)",
        "gradient-gold":
          "linear-gradient(45deg, #0A1628 0%, #FFB800 100%)",
        "gradient-dark":
          "linear-gradient(180deg, #0A1628 0%, #1A1A2E 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(0,102,255,0.1) 0%, rgba(0,212,255,0.05) 100%)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(0, 212, 255, 0.3)",
        "glow-blue": "0 0 30px rgba(0, 102, 255, 0.4)",
        "glow-gold": "0 0 30px rgba(255, 184, 0, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
