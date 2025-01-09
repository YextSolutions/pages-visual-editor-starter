import type { Config } from "tailwindcss";
import { themeConfig } from "./theme.config";
import { themeResolver } from "@yext/visual-editor";

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@yext/visual-editor/dist/**/*.js",
  ],
  theme: {
    extend: themeResolver({}, themeConfig),
  },
  plugins: [],
} satisfies Config;
