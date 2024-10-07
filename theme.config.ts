import { ThemeConfig } from "@yext/visual-editor";

export const themeConfig: ThemeConfig = {
  colors: {
    label: "Colors",
    styles: {
      text: {
        label: "Text Color",
        plugin: "colors",
        type: "color",
        default: "black",
      },
      border: {
        label: "Border Color",
        plugin: "colors",
        type: "color",
        default: "hsl(var(--border))",
      },
      input: {
        label: "Input Color",
        plugin: "colors",
        type: "color",
        default: "hsl(var(--input))",
      },
      ring: {
        label: "Ring Color",
        plugin: "colors",
        type: "color",
        default: "hsl(var(--ring))",
      },
      background: {
        label: "Background Color",
        plugin: "colors",
        type: "color",
        default: "hsl(var(--background))",
      },
      foreground: {
        label: "Foreground Color",
        plugin: "colors",
        type: "color",
        default: "hsl(var(--foreground))",
      },
      primary: {
        label: "Primary Color",
        styles: {
          DEFAULT: {
            label: "Primary Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--primary))",
          },
          foreground: {
            label: "Primary Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--primary-foreground))",
          },
        },
      },
      secondary: {
        label: "Secondary Color",
        styles: {
          DEFAULT: {
            label: "Secondary Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--secondary))",
          },
          foreground: {
            label: "Secondary Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--secondary-foreground))",
          },
        },
      },
      destructive: {
        label: "Destructive Color",
        styles: {
          DEFAULT: {
            label: "Destructive Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--destructive))",
          },
          foreground: {
            label: "Destructive Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--destructive-foreground))",
          },
        },
      },
      muted: {
        label: "Muted Color",
        styles: {
          DEFAULT: {
            label: "Muted Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--muted))",
          },
          foreground: {
            label: "Muted Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--muted-foreground))",
          },
        },
      },
      accent: {
        label: "Accent Color",
        styles: {
          DEFAULT: {
            label: "Accent Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--accent))",
          },
          foreground: {
            label: "Accent Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--accent-foreground))",
          },
        },
      },
      popover: {
        label: "Popover Color",
        styles: {
          DEFAULT: {
            label: "Popover Color (Default)",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--popover))",
          },
          foreground: {
            label: "Popover Foreground Color",
            plugin: "colors",
            type: "color",
            default: "hsl(var(--popover-foreground))",
          },
        },
      },
    },
  },
  borderRadius: {
    label: "Border Radius",
    styles: {
      lg: {
        label: "Large Border Radius",
        plugin: "borderRadius",
        type: "number",
        default: `var(--radius)`,
      },
      md: {
        label: "Medium Border Radius",
        plugin: "borderRadius",
        type: "number",
        default: `calc(var(--radius) - 2px)`,
      },
      sm: {
        label: "Small Border Radius",
        plugin: "borderRadius",
        type: "number",
        default: "calc(var(--radius) - 4px)",
      },
    }
  }
};