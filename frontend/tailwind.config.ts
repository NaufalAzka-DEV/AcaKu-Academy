import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201a",
        muted: "#5d695f",
        paper: "#f7f7f4",
        line: "#dbe3dd",
        brand: "#0f766e",
        brandDark: "#0b4f4a",
        accent: "#f97316",
        gold: "#eab308"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 26, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
