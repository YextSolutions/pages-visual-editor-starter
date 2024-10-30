import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Define the variants for the heading component
const headingVariants = cva("components", {
  variants: {
    weight: {
      default: "",
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    color: {
      default: "",
      primary: "text-palette-primary",
      secondary: "text-palette-secondary",
      accent: "text-palette-accent",
      text: "text-palette-text",
      background: "text-palette-background",
    },
    transform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    level: {
      1: "font-heading1-fontWeight text-heading1-fontSize text-heading1-color",
      2: "font-heading2-fontWeight text-heading2-fontSize text-heading2-color",
      3: "font-heading3-fontWeight text-heading3-fontSize text-heading3-color",
      4: "font-heading4-fontWeight text-heading4-fontSize text-heading4-color",
      5: "font-heading5-fontWeight text-heading5-fontSize text-heading5-color",
      6: "font-heading6-fontWeight text-heading6-fontSize text-heading6-color",
    },
  },
  defaultVariants: {
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
  ({ className, level = 1, color, weight, transform, ...props }, ref) => {
    const Tag = `h${level}` as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    >;

    return (
      <Tag
        id="tag"
        className={headingVariants({
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
