import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentConfig, Fields } from "@measured/puck";
import { Section } from "./atoms/section";
import { cn } from "../utils/cn";

const backgroundVariants = cva("components", {
  variants: {
    backgroundColor: {
      default: "bg-grid",
      primary: "bg-primary",
      secondary: "bg-secondary",
      text: "bg-text",
      accent: "bg-accent",
      background: "bg-background",
      foreground: "bg-foreground",
    },
    maxContentWidth: {
      default: "max-w-grid",
      lg: "max-w-[1024px]",
      xl: "max-w-[1280px]",
      xxl: "max-w-[1536px]",
    },
  },
  defaultVariants: {
    backgroundColor: "default",
    maxContentWidth: "default",
  },
});

const gridSectionVariants = cva(
  "components flex flex-col min-h-0 min-w-0 md:grid md:grid-cols-12 mx-auto",
  {
    variants: {
      horizontalSpacing: {
        small: "gap-x-2 md:gap-x-4",
        medium: "gap-x-8 md:gap-x-12",
        large: "gap-x-12 md:gap-x-16",
      },
    },
    defaultVariants: {
      horizontalSpacing: "medium",
    },
  }
);

const columnVariants = cva("flex flex-col", {
  variants: {
    verticalAlignment: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      spaceBetween: "justify-between",
    },
    verticalSpacing: {
      default: "gap-y-grid",
      small: "gap-y-2",
      medium: "gap-y-4",
      large: "gap-y-8",
    },
    padding: {
      none: "",
      small: "p-2",
      medium: "p-4",
      large: "p-8",
    },
  },
  defaultVariants: {
    verticalAlignment: "start",
    verticalSpacing: "medium",
    padding: "none",
  },
});

export interface ColumnProps extends VariantProps<typeof columnVariants> {
  span?: number;
}

export interface GridSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridSectionVariants>,
    VariantProps<typeof backgroundVariants> {
  distribution: "auto" | "manual";
  columns: ColumnProps[];
  renderDropZone?: any;
}

const GridSection = React.forwardRef<HTMLDivElement, GridSectionProps>(
  (
    {
      className,
      distribution,
      columns,
      horizontalSpacing,
      maxContentWidth,
      renderDropZone,
      backgroundColor,
      ...props
    },
    ref
  ) => {
    return (
      <Section
        className={backgroundVariants({ maxContentWidth, backgroundColor })}
      >
        <div
          className={cn(
            gridSectionVariants({
              horizontalSpacing,
              className,
            })
          )}
          ref={ref}
          style={{
            gridTemplateColumns:
              distribution === "manual"
                ? "repeat(12, 1fr)"
                : `repeat(${columns.length}, 1fr)`,
          }}
          {...props}
        >
          {columns.map(
            ({ span, verticalAlignment, verticalSpacing, padding }, idx) => (
              <div
                key={idx}
                className={cn(
                  columnVariants({
                    verticalAlignment,
                    verticalSpacing,
                    padding,
                  })
                )}
                style={{
                  gridColumn:
                    span && distribution === "manual"
                      ? `span ${Math.max(Math.min(span, 12), 1)}`
                      : "",
                }}
              >
                {renderDropZone({ zone: `column-${idx}` })}
              </div>
            )
          )}
        </div>
      </Section>
    );
  }
);

GridSection.displayName = "GridSection";

const gridSectionFields: Fields<GridSectionProps> = {
  distribution: {
    type: "radio",
    options: [
      { value: "auto", label: "Auto" },
      { value: "manual", label: "Manual" },
    ],
  },
  columns: {
    type: "array",
    getItemSummary: (col, id) =>
      `Column ${(id ?? 0) + 1}, span ${
        col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"
      }`,
    arrayFields: {
      span: {
        label: "Span (1-12)",
        type: "number",
        min: 0,
        max: 12,
      },
      verticalAlignment: {
        label: "Vertical Alignment",
        type: "select",
        options: [
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" },
          { value: "spaceBetween", label: "Space Between" },
        ],
      },
      verticalSpacing: {
        label: "Vertical Spacing",
        type: "select",
        options: [
          { value: "default", label: "Default" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      padding: {
        label: "Padding",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
    },
  },
  horizontalSpacing: {
    label: "Horizontal Spacing",
    type: "select",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  maxContentWidth: {
    label: "Maximum Content Width",
    type: "select",
    options: [
      { value: "default", label: "Default" },
      { value: "lg", label: "LG" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "2XL" },
    ],
  },
  backgroundColor: {
    label: "Background Color",
    type: "select",
    options: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Accent", value: "accent" },
      { label: "Text", value: "text" },
      { label: "Foreground", value: "foreground" },
      { label: "Background", value: "background" },
    ],
  },
};

export const GridSectionComponent: ComponentConfig<GridSectionProps> = {
  label: "Grid Section",
  fields: gridSectionFields,
  defaultProps: {
    distribution: "auto",
    columns: [
      {
        verticalAlignment: "start",
        verticalSpacing: "medium",
        padding: "none",
      },
      {
        verticalAlignment: "start",
        verticalSpacing: "medium",
        padding: "none",
      },
    ],
    backgroundColor: "default",
    horizontalSpacing: "medium",
    maxContentWidth: "default",
  },
  render: ({
    columns,
    distribution,
    backgroundColor,
    maxContentWidth,
    puck: { renderDropZone },
  }) => (
    <GridSection
      renderDropZone={renderDropZone}
      columns={columns}
      distribution={distribution}
      backgroundColor={backgroundColor}
      maxContentWidth={maxContentWidth}
    />
  ),
};

export { GridSection, gridSectionVariants };
