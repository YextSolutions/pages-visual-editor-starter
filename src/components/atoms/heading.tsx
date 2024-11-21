import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Define the variants for the heading component
const headingVariants = cva("components", {
  variants: {
    fontSize: {
      default: "",
      xs: "!text-xs",
      sm: "!text-sm",
      base: "!text-base",
      lg: "!text-lg",
      xl: "!text-xl",
      "2xl": "!text-2xl",
      "3xl": "!text-3xl",
      "4xl": "!text-4xl",
      "5xl": "!text-5xl",
      "6xl": "!text-6xl",
      "7xl": "!text-7xl",
      "8xl": "!text-8xl",
      "9xl": "!text-9xl",
    },
    weight: {
      default: "",
      "100": "!font-thin",
      "200": "!font-extralight",
      "300": "!font-light",
      "400": "!font-normal",
      "500": "!font-medium",
      "600": "!font-semibold",
      "700": "!font-bold",
      "800": "!font-extrabold",
      "900": "!font-black",
    },
    color: {
      default: "",
      primary: "!text-palette-primary",
      secondary: "!text-palette-secondary",
      accent: "!text-palette-accent",
      text: "!text-palette-text",
      background: "!text-palette-background",
    },
    transform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    level: {
      1: "font-heading1-fontWeight text-heading1-fontSize text-heading1-color font-heading1-fontFamily",
      2: "font-heading2-fontWeight text-heading2-fontSize text-heading2-color font-heading2-fontFamily",
      3: "font-heading3-fontWeight text-heading3-fontSize text-heading3-color font-heading3-fontFamily",
      4: "font-heading4-fontWeight text-heading4-fontSize text-heading4-color font-heading4-fontFamily",
      5: "font-heading5-fontWeight text-heading5-fontSize text-heading5-color font-heading5-fontFamily",
      6: "font-heading6-fontWeight text-heading6-fontSize text-heading6-color font-heading6-fontFamily",
    },
  },
  defaultVariants: {
    fontSize: "default",
    color: "primary",
    weight: "default",
    transform: "none",
  },
});

// Define the valid levels for the heading element
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Omit 'color' from HTMLAttributes<HTMLHeadingElement> to avoid conflict
export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  level?: HeadingLevel;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { className, level = 1, color, weight, transform, fontSize, ...props },
    ref
  ) => {
    const Tag = `h${level}` as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    >;

    return (
      <Tag
        id="tag"
        className={headingVariants({
          fontSize,
          color,
          className,
          weight,
          transform,
          level,
        })}
        ref={ref}
        {...props}
      >
        {props.children}
      </Tag>
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
