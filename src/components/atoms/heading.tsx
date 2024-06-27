import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// Define the variants for the heading component
const headingVariants = cva("font-bold", {
  variants: {
    size: {
      page: "text-5xl",
      section: "text-[34px]",
      subheading: "text-2xl",
    },
    color: {
      default: "text-default",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
    },
  },
  defaultVariants: {
    size: "section",
    color: "default",
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
  ({ className, level = 1, size, color, ...props }, ref) => {
    const Tag = `h${level}` as keyof Pick<
      JSX.IntrinsicElements,
      "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    >;

    return (
      <Tag
        className={cn(headingVariants({ size, color, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </Tag>
    );
  },
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
