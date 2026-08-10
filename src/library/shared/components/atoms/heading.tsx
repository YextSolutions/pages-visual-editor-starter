// @ts-nocheck
import { ThemeColor, HeadingLevel } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { getTextColorClass, getTextColorStyle } from "@yext/visual-editor/section-library-support";

// Define the variants for the heading component
export const headingVariants = cva("components", {
  variants: {
    level: {
      1:
        "font-h2-fontWeight text-h2-fontSize font-h2-fontFamily " +
        "sm:font-h1-fontWeight sm:text-h1-fontSize sm:font-h1-fontFamily",
      2:
        "font-h3-fontWeight text-h3-fontSize font-h3-fontFamily " +
        "sm:font-h2-fontWeight sm:text-h2-fontSize sm:font-h2-fontFamily",
      3:
        "font-h4-fontWeight text-h4-fontSize font-h4-fontFamily " +
        "sm:font-h3-fontWeight sm:text-h3-fontSize sm:font-h3-fontFamily",
      4:
        "font-h5-fontWeight text-h5-fontSize font-h5-fontFamily " +
        "sm:font-h4-fontWeight sm:text-h4-fontSize sm:font-h4-fontFamily",
      5:
        "font-h6-fontWeight text-h6-fontSize font-h6-fontFamily " +
        "sm:font-h5-fontWeight sm:text-h5-fontSize sm:font-h5-fontFamily",
      6: "font-h6-fontWeight text-h6-fontSize font-h6-fontFamily",
    },
    fontSize: {
      default: "",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
      "7xl": "text-7xl",
      "8xl": "text-8xl",
      "9xl": "text-9xl",
    },
    weight: {
      default: "",
      "100": "font-thin",
      "200": "font-extralight",
      "300": "font-light",
      "400": "font-normal",
      "500": "font-medium",
      "600": "font-semibold",
      "700": "font-bold",
      "800": "font-extrabold",
      "900": "font-black",
    },
  },
  defaultVariants: {
    fontSize: "default",
    weight: "default",
  },
});

// Omit 'color' from HTMLAttributes<HTMLHeadingElement> to avoid conflict
export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  level: HeadingLevel;
  semanticLevelOverride?: HeadingLevel | "span";
  color?: ThemeColor;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      level = 1,
      weight,
      fontSize,
      semanticLevelOverride,
      style,
      color,
      ...props
    },
    ref
  ) => {
    const Tag = (
      semanticLevelOverride
        ? typeof semanticLevelOverride === "string"
          ? semanticLevelOverride
          : `h${semanticLevelOverride}`
        : `h${level}`
    ) as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span"
    >;
    const textColorClass = getTextColorClass(color);

    return (
      <Tag
        className={themeManagerCn(
          headingVariants({
            fontSize,
            weight,
            level,
          }),
          textColorClass,
          Tag === "span" && "block",
          className
        )}
        style={{
          ...getTextColorStyle(color),
          // @ts-ignore: the css variable here resolves to a valid enum value
          textTransform: `var(--textTransform-h${level}-textTransform)`,
          ...style,
        }}
        ref={ref}
        {...props}
      >
        {props.children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";
