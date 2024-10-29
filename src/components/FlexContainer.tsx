import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentConfig, Fields } from "@measured/puck";
import { cn } from "../utils/cn";

const flexContainerVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    alignment: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justification: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      spaceBetween: "justify-between",
      spaceAround: "justify-around",
    },
    spacing: {
      small: "gap-2",
      medium: "gap-4",
      large: "gap-8",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "column",
    alignment: "start",
    justification: "start",
    spacing: "medium",
    wrap: "wrap",
  },
});

export interface FlexContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexContainerVariants> {
  renderDropZone?: any;
}

const FlexContainer = React.forwardRef<HTMLDivElement, FlexContainerProps>(
  (
    {
      className,
      direction,
      alignment,
      justification,
      spacing,
      renderDropZone,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          flexContainerVariants({
            direction,
            alignment,
            justification,
            spacing,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {renderDropZone({ zone: "flex-container" })}
      </div>
    );
  }
);

FlexContainer.displayName = "FlexContainer";

const flexContainerFields: Fields<FlexContainerProps> = {
  direction: {
    label: "Direction",
    type: "select",
    options: [
      { value: "row", label: "Horizontal" },
      { value: "column", label: "Vertical" },
    ],
  },
  alignment: {
    label: "Alignment",
    type: "select",
    options: [
      { value: "start", label: "Start" },
      { value: "center", label: "Center" },
      { value: "end", label: "End" },
      { value: "stretch", label: "Stretch" },
    ],
  },
  justification: {
    label: "Justification",
    type: "select",
    options: [
      { value: "start", label: "Start" },
      { value: "center", label: "Center" },
      { value: "end", label: "End" },
      { value: "spaceBetween", label: "Space Between" },
      { value: "spaceAround", label: "Space Around" },
    ],
  },
  spacing: {
    label: "Spacing",
    type: "select",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  wrap: {
    label: "Wrap",
    type: "select",
    options: [
      { value: "nowrap", label: "No Wrap" },
      { value: "wrap", label: "Wrap" },
    ],
  },
};

export const FlexContainerComponent: ComponentConfig<FlexContainerProps> = {
  label: "Flex Container",
  fields: flexContainerFields,
  defaultProps: {
    direction: "column",
    alignment: "start",
    justification: "start",
    spacing: "medium",
    wrap: "nowrap",
  },
  render: ({
    direction,
    alignment,
    justification,
    spacing,
    puck: { renderDropZone },
  }) => (
    <FlexContainer
      renderDropZone={renderDropZone}
      direction={direction}
      alignment={alignment}
      justification={justification}
      spacing={spacing}
    />
  ),
};

export { FlexContainer, flexContainerVariants };
