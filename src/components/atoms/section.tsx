import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const sectionVariants = cva("mx-auto", {
  variants: {
    padding: {
      default: "px-4 py-16 md:px-8",
      none: "",
      small: "px-4 py-8 md:px-8",
      large: "px-[200px] py-24 md:px-8",
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
      <div className="components bg-main">
        <div
          className={clsx(className, sectionVariants({ padding, maxWidth }))}
          ref={ref}
          {...props}
        >
          {props.children}
        </div>
      </div>
    );
  }
);
Section.displayName = "Section";

export { Section, sectionVariants };
