import {
  ThemeConfig,
  defaultFonts,
  FontRegistry,
  getFontWeightOptions,
  constructFontSelectOptions,
  ThemeOptions,
} from "@yext/visual-editor";

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
    label: "Colors",
    styles: {
      primary: {
        label: "Primary",
        type: "color",
        default: "#CF0A2C",
        plugin: "colors",
      },
      secondary: {
        label: "Secondary",
        type: "color",
        default: "#737B82",
        plugin: "colors",
      },
      tertiary: {
        label: "Tertiary",
        type: "color",
        default: "#FF7E7E",
        plugin: "colors",
      },
      quaternary: {
        label: "Quaternary",
        type: "color",
        default: "#000000",
        plugin: "colors",
      },
    },
  },
  h1: {
    label: "H1",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "48px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h1-fontFamily"),
        default: "700",
      },
    },
  },
  h2: {
    label: "H2",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "40px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h2-fontFamily"),
        default: "700",
      },
    },
  },
  h3: {
    label: "H3",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "32px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h3-fontFamily"),
        default: "700",
      },
    },
  },
  h4: {
    label: "H4",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "24px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h4-fontFamily"),
        default: "700",
      },
    },
  },
  h5: {
    label: "H5",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "20px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h5-fontFamily"),
        default: "700",
      },
    },
  },
  h6: {
    label: "H6",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "18px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-h6-fontFamily"),
        default: "700",
      },
    },
  },
  body: {
    label: "Body Text",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "16px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-body-fontFamily"),
        default: "400",
      },
    },
  },
  pageSection: {
    label: "Page Section",
    styles: {
      contentWidth: {
        label: "Content Width",
        type: "select",
        plugin: "maxWidth",
        options: [
          { label: "Compact (768px)", value: "768px" },
          { label: "Narrow (960px)", value: "960px" },
          { label: "Standard (1024px)", value: "1024px" },
          { label: "Wide (1280px)", value: "1280px" },
          { label: "Extra Wide (1440px)", value: "1440px" },
        ],
        default: "1024px",
      },
      verticalPadding: {
        label: "Top/Bottom Padding",
        type: "select",
        plugin: "padding",
        options: ThemeOptions.SPACING,
        default: "32px",
      },
    },
  },
  button: {
    label: "Button",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "16px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-button-fontFamily"),
        default: "400",
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        plugin: "textTransform",
        options: ThemeOptions.TEXT_TRANSFORM,
        default: "none",
      },
      letterSpacing: {
        label: "Letter Spacing",
        type: "select",
        plugin: "letterSpacing",
        options: ThemeOptions.LETTER_SPACING,
        default: "0em",
      },
    },
  },
  link: {
    label: "Links",
    styles: {
      fontFamily: {
        label: "Font",
        type: "select",
        plugin: "fontFamily",
        options: fontOptions,
        default: "'Open Sans', sans-serif",
      },
      fontSize: {
        label: "Font Size",
        type: "select",
        plugin: "fontSize",
        options: ThemeOptions.FONT_SIZE,
        default: "16px",
      },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        plugin: "fontWeight",
        options: fontWeightOptions("--fontFamily-link-fontFamily"),
        default: "400",
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        plugin: "textTransform",
        options: ThemeOptions.TEXT_TRANSFORM,
        default: "none",
      },
      letterSpacing: {
        label: "Letter Spacing",
        type: "select",
        plugin: "letterSpacing",
        options: ThemeOptions.LETTER_SPACING,
        default: "0em",
      },
      caret: {
        label: "Include Caret",
        type: "select",
        plugin: "display",
        options: [
          { label: "Yes", value: "block" },
          { label: "No", value: "none" },
        ],
        default: "block",
      },
    },
  },
};
