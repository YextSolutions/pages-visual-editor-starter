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
  },
  defaultVariants: {
    size: "base",
    weight: "default",
  },
});

// Omit 'color' from HTMLAttributes<HTMLParagraphElement> to avoid conflict
export interface BodyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof bodyVariants> {}

const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, size, weight, ...props }, ref) => {
    return (
      <p
        className={cn(bodyVariants({ size, weight, className }))}
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
