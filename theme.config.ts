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
  text: {
    label: "Text",
    styles: {
      lg: {
        label: "Large",
        styles: {
          fontSize: {
            label: "Font Size",
            type: "number",
            plugin: "text",
            default: "12pt",
          },
        },
      },
    },
  },
  colors: {
    label: "Colors",
    styles: {
      text: {
        label: "Text",
        plugin: "colors",
        type: "color",
        default: "black",
      },
      border: {
        label: "Border",
        plugin: "colors",
        type: "color",
        default: "hsl(214 100% 39%)",
      },
      input: {
        label: "Input",
        plugin: "colors",
        type: "color",
        default: "hsl(214.3 31.8% 91.4%)",
      },
      ring: {
        label: "Ring",
        plugin: "colors",
        type: "color",
        default: "hsl(215 20.2% 65.1%)",
      },
      background: {
        label: "Background",
        plugin: "colors",
        type: "color",
        default: "hsl(0 0% 100%)",
      },
      foreground: {
        label: "Foreground",
        plugin: "colors",
        type: "color",
        default: "hsl(0 2% 11%)",
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
      secondary: {
        label: "Secondary",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(11 100% 26%)",
          },
          foreground: {
            label: "Foreground",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 100%)",
          },
        },
      },
      destructive: {
        label: "Destructive",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(0 100% 50%)",
          },
          foreground: {
            label: "Foreground",
            plugin: "colors",
            type: "color",
            default: "hsl(210 40% 98%)",
          },
        },
      },
      muted: {
        label: "Muted",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(210 40% 96.1%)",
          },
          foreground: {
            label: "Foreground",
            plugin: "colors",
            type: "color",
            default: "hsl(215.4 16.3% 46.9%)",
          },
        },
      },
      accent: {
        label: "Accent",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(166 55% 67%)",
          },
          foreground: {
            label: "Foreground",
            plugin: "colors",
            type: "color",
            default: "hsl(0 0% 0%)",
          },
        },
      },
      popover: {
        label: "Secondary",
        styles: {
          DEFAULT: {
            label: "Default",
            plugin: "colors",
            type: "color",
            default: "hsl(225 7% 12%)",
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
