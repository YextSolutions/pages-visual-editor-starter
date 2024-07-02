import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const sectionVariants = cva(" px-4  md:px-8 py-16 mx-auto", {
  variants: {
    padding: {
      default: "py-16",
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
      <div className="bg-[#F9FAFB]">
        <div
          className={cn(sectionVariants({ padding, maxWidth, className }))}
          ref={ref}
          {...props}
        >
          {props.children}
        </div>
      </div>
    );
  },
);
Section.displayName = "Section";

export { Section, sectionVariants };
