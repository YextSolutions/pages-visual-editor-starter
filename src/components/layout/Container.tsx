import { ComponentConfig, DropZone, Fields } from "@measured/puck";
import { cn } from "../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("mx-auto", {
  variants: {
    padding: {
      small: "p-2",
      medium: "p-4",
      large: "p-8",
    },
    margin: {
      small: "m-2",
      medium: "m-4",
      large: "m-8",
    },
    horizontalAlign: {
      left: "text-left",
      middle: "text-center",
      right: "text-right",
    },
    verticalAlign: {
      top: "items-start",
      center: "items-center",
      bottom: "items-end",
    },
    verticalSpacing: {
      small: "space-y-2",
      medium: "space-y-4",
      large: "space-y-8",
    },
  },
  defaultVariants: {
    padding: "medium",
    margin: "medium",
    horizontalAlign: "left",
    verticalAlign: "top",
    verticalSpacing: "medium",
  },
});

export type ContainerProps = {
  padding: "small" | "medium" | "large";
  margin: "small" | "medium" | "large";
  horizontalAlign: "left" | "middle" | "right";
  verticalAlign: "top" | "center" | "bottom";
  verticalSpacing: "small" | "medium" | "large";
  renderDropZone: any;
} & VariantProps<typeof containerVariants>;

const containerFields: Fields<Omit<ContainerProps, "renderDropZone">> = {
  padding: {
    type: "radio",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  margin: {
    type: "radio",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  horizontalAlign: {
    type: "radio",
    options: [
      { label: "Left", value: "left" },
      { label: "Middle", value: "middle" },
      { label: "Right", value: "right" },
    ],
  },
  verticalAlign: {
    type: "radio",
    options: [
      { label: "Top", value: "top" },
      { label: "Center", value: "center" },
      { label: "Bottom", value: "bottom" },
    ],
  },
  verticalSpacing: {
    type: "radio",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
};

const Container = ({
  padding,
  margin,
  horizontalAlign,
  verticalAlign,
  renderDropZone,
  verticalSpacing,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        containerVariants({
          padding,
          margin,
          horizontalAlign,
          verticalAlign,
          verticalSpacing,
        }),
        "flex flex-col"
      )}
    >
      {renderDropZone({ zone: "content" })}
    </div>
  );
};

const ContainerComponent: ComponentConfig<
  Omit<ContainerProps, "renderDropZone">
> = {
  fields: containerFields,
  defaultProps: {
    padding: "medium",
    margin: "medium",
    horizontalAlign: "left",
    verticalAlign: "top",
    verticalSpacing: "medium",
  },
  label: "Container",
  render: (props) => (
    <Container {...props} renderDropZone={props.puck.renderDropZone} />
  ),
};

export { Container, ContainerComponent, containerFields };
