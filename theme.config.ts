import { ThemeConfig } from "@yext/visual-editor";

export const themeConfig: ThemeConfig = {
  borderRadius: {
    label: "Border Radius",
    styles: {
      lg: {
        label: "Radius",
        type: "number",
        plugin: "borderRadius",
        default: 20,
      },
    },
  },
  colors: {
    label: "Colors",
    styles: {
      foreground: {
        label: "Footer",
        plugin: "colors",
        type: "select",
        options: [
          { value: "#000000", label: "Black" },
          { value: "#808080", label: "Grey" },
        ],
        default: "#808080",
      },
      primary: {
        label: "Primary",
        styles: {
          DEFAULT: {
            label: "Main",
            plugin: "colors",
            type: "color",
            default: "hsl(0 68% 51%)",
          },
          foreground: {
            label: "Accent",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
        },
      },
    },
  },
};
