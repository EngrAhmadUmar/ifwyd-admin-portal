import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Matches the brand colors used on the public IFWYD website.
        ifwyd: {
          sidebar: "#1F1420",
          "sidebar-active": "#3A1F35",
          brand: "#D54B9C",
          "brand-dark": "#B53A84",
          muted: "#6B7280",
          surface: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};

export default config;
