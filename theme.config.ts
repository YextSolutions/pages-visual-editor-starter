import { ThemeConfig } from "@yext/visual-editor";

export const themeConfig: ThemeConfig = {
  borderRadius: {
    label: "Border Radius",
    styles: {
      lg: {
        label: "Radius",
        type: "number",
        plugin: "borderRadius",
        default: "20px",
      },
    },
  },
  colors: {
    label: "Colors",
    styles: {
      foreground: {
        label: "Foreground",
        plugin: "colors",
        type: "select",
        options: [
          { value: "#000000", label: "Black" },
          { value: "hsl(0 68% 51%)", label: "Red" },
        ],
        default: "hsl(0 68% 51%)",
      },
      primary: {
        label: "Primary",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(0 68% 51%)",
          },
          foreground: {
            label: "Foreground",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
        },
      },
    },
  },
};
