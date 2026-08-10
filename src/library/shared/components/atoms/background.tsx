// @ts-nocheck
import * as React from "react";
import {
  ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { BackgroundProvider } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { getThemeValue } from "@yext/visual-editor/section-library-support";
import {
  getBackgroundColorClasses,
  getBackgroundColorStyle,
} from "@yext/visual-editor/section-library-support";

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: ThemeColor;
  as?: "div" | "section" | "nav" | "header" | "footer" | "main" | "aside";
}

export const Background = React.forwardRef<HTMLDivElement, BackgroundProps>(
  ({ className, background, as, children, style, ...props }, ref) => {
    const streamDocument = useDocument();
    const Component = as ?? "div";
    const selectedBackground = background ?? backgroundColors.background1.value;

    const backgroundValue: Required<ThemeColor> = React.useMemo(() => {
      // Our built-in backgrounds are always light or dark
      if (
        selectedBackground.contrastingColor === "white" ||
        selectedBackground.contrastingColor === "black"
      ) {
        return {
          selectedColor: selectedBackground.selectedColor,
          contrastingColor: selectedBackground.contrastingColor,
          isDarkColor: selectedBackground.contrastingColor === "white",
        };
      }

      // of the form `palette-x`
      const paletteColor = selectedBackground.selectedColor;
      // of the form `--colors-palette-x-contrast`
      const paletteColorContrastCSSVariable = `--colors-${paletteColor}-contrast`;

      const contrastColor = getThemeValue(
        paletteColorContrastCSSVariable,
        streamDocument
      );
      if (contrastColor) {
        return {
          selectedColor: selectedBackground.selectedColor,
          contrastingColor: selectedBackground.contrastingColor,
          isDarkColor: contrastColor.toUpperCase() === "#FFFFFF",
        };
      }

      // Handle color palette defaults and fallback.
      let isDarkColor;
      switch (paletteColorContrastCSSVariable) {
        case "--colors-palette-primary-contrast":
          isDarkColor = true;
          break;
        case "--colors-palette-secondary-contrast":
          isDarkColor = true;
          break;
        case "--colors-palette-tertiary-contrast":
          isDarkColor = false;
          break;
        case "--colors-palette-quaternary-contrast":
          isDarkColor = true;
          break;
        default:
          isDarkColor = false;
          break;
      }

      return {
        selectedColor: selectedBackground.selectedColor,
        contrastingColor: selectedBackground.contrastingColor,
        isDarkColor,
      };
    }, [selectedBackground, streamDocument]);

    return (
      <BackgroundProvider value={backgroundValue}>
        <Component
          className={themeManagerCn(
            "components",
            getBackgroundColorClasses(background),
            className
          )}
          style={{
            ...getBackgroundColorStyle(background),
            ...style,
          }}
          ref={ref}
          {...props}
        >
          {children}
        </Component>
      </BackgroundProvider>
    );
  }
);
Background.displayName = "Background";
