// @ts-nocheck
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { getTextColorClass, getTextColorStyle } from "@yext/visual-editor/section-library-support";

// Define the variants for the body component
export const bodyVariants = cva(
  "components font-body-fontFamily font-body-fontWeight",
  {
    variants: {
      variant: {
        xs: "text-body-xs-fontSize",
        sm: "text-body-sm-fontSize",
        base: "text-body-fontSize",
        lg: "text-body-lg-fontSize",
      },
    },
    defaultVariants: {
      variant: "base",
    },
  }
);

// Omit 'color' from HTMLAttributes<HTMLParagraphElement> to avoid conflict
export interface BodyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof bodyVariants> {
  color?: ThemeColor;
}

export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, variant, color, style, ...props }, ref) => {
    return (
      <p
        className={themeManagerCn(
          bodyVariants({
            variant,
          }),
          getTextColorClass(color),
          className
        )}
        style={{
          ...getTextColorStyle(color),
          // @ts-ignore: the css variable here resolves to a valid enum value
          textTransform: `var(--textTransform-body-textTransform)`,
          ...style,
        }}
        ref={ref}
        {...props}
      >
        {props.children}
      </p>
    );
  }
);
Body.displayName = "Body";
