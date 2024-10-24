import { ThemeConfig } from "@yext/visual-editor";

export const themeConfig: ThemeConfig = {
  colors: {
    label: "Colors",
    styles: {
      primary: {
        label: "Buttons",
        styles: {
          DEFAULT: {
            label: "Button Background",
            plugin: "colors",
            type: "color",
            default: "hsl(0 68% 51%)",
          },
          foreground: {
            label: "Button Text",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
        },
      },
      header: {
        label: "Color Palette",
        styles: {
          primary: {
            label: "Primary",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
          secondary: {
            label: "Secondary",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
          accent: {
            label: "Accent",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
          text: {
            label: "Text",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
        },
      },
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
    },
  },
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
};
