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
        tradeflow: {
          dark: "#0f172a", // slate-900 equivalent
          accent: "#3b82f6", // blue-500 equivalent
          secondary: "#1e293b", // slate-800 equivalent
          muted: "#475569", // slate-600 equivalent
          success: "#10b981", // emerald-500 equivalent
          warning: "#f59e0b", // amber-500 equivalent
        },
      },
    },
  },
  plugins: [],
};

export default config;
