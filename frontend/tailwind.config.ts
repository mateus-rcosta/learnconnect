import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5c64f4", // Azul neon principal
        dark: "#121212", // Fundo escuro
        darkGray: "#1a1a1a", // Segundo plano escuro
        white: "#FFFFFF", // Branco para textos
        background: "var(--background)", // Mantendo suporte a variáveis CSS
        foreground: "var(--foreground)", // Mantendo suporte a variáveis CSS
      },
      boxShadow: {
        neon: "0 0 15px rgba(92, 100, 244, 0.6)", // Efeito neon azul
      },
    },
  },
  plugins: [],
} satisfies Config;
