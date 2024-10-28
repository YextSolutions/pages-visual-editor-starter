import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// Define the variants for the body component
const bodyVariants = cva("components text-body-fontSize", {
  variants: {
    fontWeight: {
      default: "font-body-fontWeight",
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
      default: "text-body-color",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      text: "text-text",
      background: "text-primary-background",
      foreground: "text-foreground-background",
    },
    textTransform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
  },
  defaultVariants: {
    fontWeight: "default",
    color: "default",
    textTransform: "none",
  },
});

// Omit 'color' from HTMLAttributes<HTMLParagraphElement> to avoid conflict
export interface BodyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof bodyVariants> {}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, fontWeight, color, textTransform, ...props }, ref) => {
    return (
      <p
        className={cn(
          bodyVariants({
            fontWeight,
            color,
            textTransform,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </p>
    );
  }
);
Body.displayName = "Body";

export { Body, bodyVariants };
