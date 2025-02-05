import {
  ThemeConfig,
  defaultFonts,
  FontRegistry,
  getFontWeightOptions,
  constructFontSelectOptions,
  getFontSizeOptions,
  getBorderRadiusOptions,
} from "@yext/visual-editor";

const getColorOptions = () => {
  return [
    { label: "Primary", value: "var(--colors-palette-primary)" },
    { label: "Secondary", value: "var(--colors-palette-secondary)" },
    { label: "Accent", value: "var(--colors-palette-accent)" },
    { label: "Text", value: "var(--colors-palette-text)" },
    { label: "Background", value: "var(--colors-palette-background)" },
  ];
};

const fonts: FontRegistry = {
  // other developer defined fonts here
  ...defaultFonts,
};
const fontOptions = constructFontSelectOptions(fonts);
const fontWeightOptions = (fontVariable?: string) => {
  return () =>
    getFontWeightOptions({
      fontCssVariable: fontVariable,
      fontList: fonts,
    });
};

export const themeConfig: ThemeConfig = {
  palette: {
    label: "Color Palette",
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
        default: "#FFFFFF",
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
        plugin: "colors",
        default: "#FFFFFF",
      },
    },
  },
  heading1: {
    label: "Heading 1",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "48px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading1-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  heading2: {
    label: "Heading 2",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading2-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  heading3: {
    label: "Heading 3",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading3-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  heading4: {
    label: "Heading 4",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading4-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  heading5: {
    label: "Heading 5",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading5-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  heading6: {
    label: "Heading 6",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-heading6-fontFamily"),
        default: "700",
      },
      color: {
        label: "Text Color",
        type: "select",
        plugin: "colors",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  body: {
    label: "Body Text",
    styles: {
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(),
        default: "16px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-body-fontFamily"),
        default: "400",
      },
      color: {
        label: "Text Color",
        plugin: "colors",
        type: "select",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
    },
  },
  grid: {
    label: "Grid Section",
    styles: {
      maxWidth: {
        label: "Maximum Width",
        type: "select",
        plugin: "maxWidth",
        options: [
          { label: "2XL (1536px)", value: "1536px" },
          { label: "XL (1280px)", value: "1280px" },
          { label: "LG (1024px)", value: "1024px" },
        ],
        default: "1280px",
      },
      backgroundColor: {
        label: "Background Color",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-palette-background)",
      },
    },
  },
  header: {
    label: "Header",
    styles: {
      backgroundColor: {
        label: "Background Color",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-palette-background)",
      },
    },
  },
  footer: {
    label: "Footer",
    styles: {
      backgroundColor: {
        label: "Background Color",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-palette-background)",
      },
    },
  },
  button: {
    label: "Button",
    styles: {
      borderRadius: {
        label: "Border Radius",
        type: "select",
        plugin: "borderRadius",
        options: getBorderRadiusOptions(),
        default: "16px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-body-fontFamily"),
        default: "400",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: getFontSizeOptions(false),
        default: "12px",
      },
      backgroundColor: {
        label: "Background Color",
        type: "select",
        plugin: "backgroundColor",
        options: getColorOptions(),
        default: "var(--colors-palette-background)",
      },
      textColor: {
        label: "Text Color",
        plugin: "colors",
        type: "select",
        options: getColorOptions(),
        default: "var(--colors-palette-text)",
      },
    },
  },
};
