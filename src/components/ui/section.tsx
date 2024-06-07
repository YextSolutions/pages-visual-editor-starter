import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const sectionVariants = cva("max-w-6xl px-[150px] py-16", {
  variants: {
    padding: {
      default: "px-[150px] py-16",
      small: "px-4 py-8",
      large: "px-[200px] py-24",
    },
    maxWidth: {
      default: "max-w-6xl",
      full: "max-w-full",
      xl: "max-w-4xl",
    },
  },
  defaultVariants: {
    padding: "default",
    maxWidth: "default",
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, padding, maxWidth, ...props }, ref) => {
    return (
      <div
        className={cn(sectionVariants({ padding, maxWidth, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
Section.displayName = "Section";

export { Section, sectionVariants };
