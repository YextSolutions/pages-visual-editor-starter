import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

// Define the variants for the body component
const bodyVariants = cva("font-bold", {
  variants: {
    size: {
      small: "text-sm",
      base: "text-base",
      large: "text-lg",
    },
    weight: {
      default: "font-normal",
      bold: "font-bold",
    },
    color: {
      default: "text-default",
      primary: "text-primary",
      secondary: "text-secondary",
      gray: "text-slate-700"
    }
  },
  defaultVariants: {
    size: "base",
    weight: "default",
    color: "default",
  },
});

// Omit 'color' from HTMLAttributes<HTMLParagraphElement> to avoid conflict
export interface BodyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof bodyVariants> {}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, size, weight, color, ...props }, ref) => {
    return (
      <p
        className={cn(bodyVariants({ size, weight, color, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </p>
    );
  },
);

Body.displayName = "Body";

export { Body, bodyVariants };
