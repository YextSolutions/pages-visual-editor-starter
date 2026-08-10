// @ts-nocheck
import * as React from "react";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { Background } from "./background";
import { cva, VariantProps } from "class-variance-authority";

const pageSectionVariants = cva("px-4 md:px-6", {
  variants: {
    verticalPadding: {
      none: "",
      sm: "py-4",
      default: "py-pageSection-verticalPadding",
      header: "py-2 sm:py-6",
      footer: "py-8 sm:py-20",
      footerSecondary: "py-8 sm:py-10",
    },
  },
  defaultVariants: {
    verticalPadding: "default",
  },
});

const maxWidthVariants = cva("mx-auto", {
  variants: {
    maxWidth: {
      theme: "max-w-pageSection-contentWidth",
      "768px": "max-w-[768px]",
      "960px": "max-w-[960px]",
      "1024px": "max-w-[1024px]",
      "1280px": "max-w-[1280px]",
      "1440px": "max-w-[1440px]",
      fullWidth: "",
    },
  },
  defaultVariants: {
    maxWidth: "theme",
  },
});

export interface PageSectionProps
  extends VariantProps<typeof maxWidthVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  background?: ThemeColor;
  verticalPadding?: VariantProps<typeof pageSectionVariants>["verticalPadding"];
  as?: "div" | "section" | "nav" | "header" | "footer" | "main" | "aside";
  outerClassName?: string;
  outerStyle?: React.CSSProperties;
}

export const PageSection = React.forwardRef<HTMLDivElement, PageSectionProps>(
  (
    {
      className,
      background,
      verticalPadding,
      outerClassName,
      outerStyle,
      as,
      maxWidth,
      ...props
    },
    ref
  ) => {
    const InnerComponent = as ?? "section";

    return (
      <Background
        className={themeManagerCn(
          "components w-full px-4",
          pageSectionVariants({ verticalPadding }),
          outerClassName
        )}
        style={outerStyle}
        background={background}
        ref={ref}
      >
        <InnerComponent
          className={themeManagerCn(maxWidthVariants({ maxWidth }), className)}
          {...props}
        >
          {props.children}
        </InnerComponent>
      </Background>
    );
  }
);
PageSection.displayName = "PageSection";
