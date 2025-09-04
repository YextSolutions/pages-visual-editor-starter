import type { Config } from "tailwindcss";
import {
  themeResolver,
  defaultThemeTailwindExtensions,
  defaultThemeConfig,
  VisualEditorComponentsContentPath,
} from "@yext/visual-editor";
import { ComponentsContentPath as SearchUIComponentsContentPath } from "@yext/search-ui-react";

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    VisualEditorComponentsContentPath,
    SearchUIComponentsContentPath,
  ],
  theme: {
    extend: themeResolver(defaultThemeTailwindExtensions, defaultThemeConfig),
  },
  plugins: [],
} satisfies Config;
