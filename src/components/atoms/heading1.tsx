import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
// import { cn } from "@yext/visual-editor";

// Define the variants for the heading component
const headingVariants = cva("py-2", {
  variants: {
    level: {
      1: "text-[48px]",
      2: "text-[24px]",
      3: "text-[20px]",
      4: "text-[16px]",
      5: "text-[12px]",
      6: "text-[8px]",
    },
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
      primary: "text-header-primary",
      secondary: "text-header-secondary",
      accent: "text-header-accent",
      text: "text-header-text"
    },
    transform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
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
  // size?: number;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, level = 1, color, weight, transform, ...props }, ref) => {
      const Tag = `h${level}` as keyof Pick<
          JSX.IntrinsicElements,
          "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      >;

      // const dynamicStyles = {
      //   fontSize: size ? size + "px" : undefined,
      // };

      return (
          <Tag
              id="tag"
              className={
                  "components " +
                  headingVariants({ color, className, weight, transform, level })
              }
              ref={ref}
              // style={dynamicStyles ?? ""}
              {...props}
          >
            {props.children}
          </Tag>
      );
    }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
