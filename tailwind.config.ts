import type { Config } from "tailwindcss";
import { themeConfig } from "./theme.config";
import { themeResolver } from "@yext/visual-editor";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: themeResolver(
        {
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
          colors: {
            "brand-primary": "#1B78D0",
            "brand-secondary": "#073866",
            "brand-gray": {
              100: "#F7F7F7",
              200: "#EDEDED",
              300: "#CCC",
              400: "#767676",
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
          container: {
            center: true,
            padding: {
              DEFAULT: "1rem",
              sm: "2rem",
              lg: "4rem",
              xl: "5rem",
            },
          },
        },
        themeConfig
    ),
  },
  plugins: [],
} satisfies Config;