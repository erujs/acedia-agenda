import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",          // ✅ required for App Router
    "./components/**/*.{ts,tsx,js,jsx}",   // ✅ required if you use /components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
