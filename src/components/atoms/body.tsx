import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

// Define the variants for the body component
const bodyVariants = cva("components font-body-fontFamily", {
  variants: {
    fontSize: {
      default: "text-body-fontSize",
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
    fontWeight: {
      default: "font-body-fontWeight",
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
    color: {
      default: "text-body-color",
      primary: "text-palette-primary",
      secondary: "text-palette-secondary",
      accent: "text-palette-accent",
      text: "text-palette-text",
      background: "text-palette-background",
    },
    textTransform: {
      none: "",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
  },
  defaultVariants: {
    fontSize: "default",
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
  (
    { className, fontSize, fontWeight, color, textTransform, ...props },
    ref
  ) => {
    return (
      <p
        className={clsx(
          className,
          bodyVariants({
            fontSize,
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
