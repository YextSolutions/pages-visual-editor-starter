import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "#ff9500",
        "dark-orange": "#db8000",
      },
      scale: {
        1.02: "1.02",
      },
    },
  },
  plugins: [],
} satisfies Config;
