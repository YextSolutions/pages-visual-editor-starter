import type { Config } from "tailwindcss";
import { themeConfig } from "./theme.config";
import {
  themeResolver,
  defaultThemeTailwindExtensions,
} from "@yext/visual-editor";
import {ComponentsContentPath as SearchUiComponentsContentPath} from "@yext/search-ui-react";

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@yext/visual-editor/dist/**/*.js",
    SearchUiComponentsContentPath
  ],
  theme: {
    extend: themeResolver(defaultThemeTailwindExtensions, themeConfig),
  },
  plugins: [],
} satisfies Config;
