import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentConfig, Fields } from "@measured/puck";
import { Section } from "./atoms/section";
import { cn } from "../utils/cn";

const gridSectionVariants = cva(
  "components flex flex-col min-h-0 min-w-0 md:grid md:grid-cols-12",
  {
    variants: {
      horizontalSpacing: {
        small: "gap-2 md:gap-4",
        medium: "gap-8 md:gap-12",
        large: "gap-12 md:gap-16",
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
      small: "gap-2",
      medium: "gap-4",
      large: "gap-8",
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
    VariantProps<typeof gridSectionVariants> {
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
      renderDropZone,
      ...props
    },
    ref
  ) => {
    return (
      <Section>
        <div
          className={cn(gridSectionVariants({ horizontalSpacing, className }))}
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
        type: "select",
        options: [
          { value: "start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "end", label: "End" },
          { value: "spaceBetween", label: "Space Between" },
        ],
      },
      verticalSpacing: {
        type: "select",
        options: [
          { value: "small", label: "Small" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
        ],
      },
      padding: {
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
    type: "select",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
};

export const GridSectionComponent: ComponentConfig<GridSectionProps> = {
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
    horizontalSpacing: "medium",
  },
  render: ({ columns, distribution, puck: { renderDropZone } }) => (
    <GridSection
      renderDropZone={renderDropZone}
      columns={columns}
      distribution={distribution}
    />
  ),
};

export { GridSection, gridSectionVariants };
