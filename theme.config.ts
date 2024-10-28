import { ThemeConfig } from "@yext/visual-editor";

const getColorOptions = () => {
  return [
    { label: "Primary", value: "var(--colors-primary)" },
    { label: "Secondary", value: "var(--colors-secondary)" },
    { label: "Accent", value: "var(--colors-accent)" },
    { label: "Text", value: "var(--colors-text)" },
    { label: "Background", value: "var(--colors-background)" },
    { label: "Foreground", value: "var(--colors-foreground)" },
  ];
};

const getWeightOptions = () => {
  return [
    { label: "Thin", value: "100" },
    { label: "Extralight", value: "200" },
    { label: "Light", value: "300" },
    { label: "Normal", value: "400" },
    { label: "Medium", value: "500" },
    { label: "Semibold", value: "600" },
    { label: "Bold", value: "700" },
    { label: "Extrabold", value: "800" },
    { label: "Black", value: "900" },
  ];
};

export const themeConfig: ThemeConfig = {
  fontSize: {
    label: "Text Size",
    styles: {
      "heading1-fontSize": {
        label: "Heading 1",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "heading2-fontSize": {
        label: "Heading 2",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "heading3-fontSize": {
        label: "Heading 3",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "heading4-fontSize": {
        label: "Heading 4",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "heading5-fontSize": {
        label: "Heading 5",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "heading6-fontSize": {
        label: "Heading 6",
        type: "number",
        plugin: "fontSize",
        default: 24,
      },
      "button-fontSize": {
        label: "Button",
        type: "number",
        plugin: "fontSize",
        default: 12,
      },
      "body-fontSize": {
        label: "Body",
        type: "number",
        plugin: "fontSize",
        default: 12,
      },
    },
  },
  fontWeight: {
    label: "Font Weight",
    styles: {
      "heading1-fontWeight": {
        label: "Heading 1",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "700",
      },
      "heading2-fontWeight": {
        label: "Heading 2",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "700",
      },
      "heading3-fontWeight": {
        label: "Heading 3",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "600",
      },
      "heading4-fontWeight": {
        label: "Heading 4",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "600",
      },
      "heading5-fontWeight": {
        label: "Heading 5",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "400",
      },
      "heading6-fontWeight": {
        label: "Heading 6",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "400",
      },
      "body-fontWeight": {
        label: "Body",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "400",
      },
      "button-fontWeight": {
        label: "Button",
        type: "select",
        plugin: "fontWeight",
        options: getWeightOptions(),
        default: "400",
      },
    },
  },
  colors: {
    label: "Color",
    styles: {
      primary: {
        label: "Primary",
        type: "color",
        default: "#D83B18",
        plugin: "colors",
      },
      secondary: {
        label: "Secondary",
        type: "color",
        default: "#871900",
        plugin: "colors",
      },
      accent: {
        label: "Accent",
        type: "color",
        default: "#FFFFFF",
        plugin: "colors",
      },
      text: {
        label: "Text",
        type: "color",
        default: "#000000",
        plugin: "colors",
      },
      background: {
        label: "Background",
        type: "color",
        default: "#F7F7F7",
        plugin: "colors",
      },
      foreground: {
        label: "Foreground",
        type: "color",
        plugin: "color",
        default: "#000000",
      },
      footer: {
        label: "Footer",
        type: "color",
        plugin: "color",
        default: "#000000",
      },
      "heading1-color": {
        label: "Heading 1",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "heading2-color": {
        label: "Heading 2",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "heading3-color": {
        label: "Heading 3",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "heading4-color": {
        label: "Heading 4",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "heading5-color": {
        label: "Heading 5",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "heading6-color": {
        label: "Heading 6",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "body-color": {
        label: "Body",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-text)",
      },
      "button-primary": {
        label: "Button Primary",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-primary)",
      },
      "button-primary-foreground": {
        label: "Button Primary Foreground",
        type: "select",
        plugin: "color",
        options: getColorOptions(),
        default: "var(--colors-foreground)",
      },
    },
  },
  backgroundColor: {
    label: "Background Color",
    styles: {
      main: {
        label: "Background Color",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-background)",
      },
      grid: {
        label: "Grid Background",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-background)",
      },
    },
  },
  borderRadius: {
    label: "Border Radius",
    styles: {
      lg: {
        label: "Button",
        type: "number",
        plugin: "borderRadius",
        default: 20,
      },
    },
  },
  maxWidth: {
    label: "Max Width",
    styles: {
      grid: {
        label: "Grid Section",
        type: "select",
        plugin: "maxWidth",
        options: [
          { label: "2XL", value: "1536px" },
          { label: "XL", value: "1280px" },
          { label: "LG", value: "1024px" },
        ],
        default: "1280px",
      },
    },
  },
  gap: {
    label: "Vertical Spacing",
    styles: {
      grid: {
        label: "Grid Section",
        type: "number",
        plugin: "gap",
        default: 8,
      },
    },
  },
};
