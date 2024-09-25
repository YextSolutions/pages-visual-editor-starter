import { ComponentConfig, DropZone, Fields, e } from "@measured/puck";
import { Section, SectionProps } from "../atoms/section";

export type SectionWrapperProps = {
  padding: SectionProps["padding"];
  maxWidth: SectionProps["maxWidth"];
  // TODO: Fix this type
  renderDropZone: any;
};

const sectionWrapperFields: Fields<
  Omit<SectionWrapperProps, "renderDropZone">
> = {
  padding: {
    label: "Padding",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Small", value: "small" },
      { label: "Large", value: "large" },
    ],
  },
  maxWidth: {
    label: "Max Width",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Full", value: "full" },
      { label: "XL", value: "xl" },
    ],
  },
};

const SectionWrapper = ({
  padding,
  maxWidth,
  renderDropZone,
}: SectionWrapperProps) => {
  return (
    <Section padding={padding} maxWidth={maxWidth}>
      {renderDropZone({ zone: "my-content" })}
    </Section>
  );
};

const SectionWrapperComponent: ComponentConfig<
  Omit<SectionWrapperProps, "renderDropZone">
> = {
  fields: sectionWrapperFields,
  defaultProps: {
    padding: "default",
    maxWidth: "default",
  },
  label: "Section",
  render: (props) => (
    <SectionWrapper {...props} renderDropZone={props.puck.renderDropZone} />
  ),
};

export { SectionWrapper, SectionWrapperComponent, sectionWrapperFields };
