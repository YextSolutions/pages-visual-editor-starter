import { BodyProps, Body } from "./atoms/body";
import { ComponentConfig, Fields } from "@measured/puck";

export type BannerProps = {
  text: string;
  textAlignment: "justify-end" | "justify-start" | "justify-center";
  textSize: BodyProps["size"];
  fontWeight: BodyProps["weight"];
  textColor: BodyProps["color"];
  backgroundColor: "bg-white" | "bg-primary" | "bg-secondary";
};

const bannerFields: Fields<BannerProps> = {
  text: {
    type: "text",
    label: "Text",
  },
  textAlignment: {
    label: "Text Alignment",
    type: "radio",
    options: [
      { label: "Left", value: "justify-start" },
      { label: "Center", value: "justify-center" },
      { label: "Right", value: "justify-end" },
    ],
  },
  textSize: {
    label: "Text Size",
    type: "radio",
    options: [
      { label: "Small", value: "small" },
      { label: "Base", value: "base" },
      { label: "Large", value: "large" },
    ],
  },
  fontWeight: {
    label: "Font Weight",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Bold", value: "bold" },
    ],
  },
  textColor: {
    label: "Text Color",
    type: "radio",
    options: [
      { label: "Default", value: "default" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
    ],
  },
  backgroundColor: {
    label: "Background Color",
    type: "radio",
    options: [
      { label: "Default", value: "bg-white" },
      { label: "Primary", value: "bg-primary" },
      { label: "Secondary", value: "bg-secondary" },
    ],
  },
};

const Banner = ({
  text,
  textAlignment,
  textSize,
  fontWeight,
  textColor,
  backgroundColor,
}: BannerProps) => {
  return (
    <div className={`Banner ${backgroundColor} components px-4 md:px-20 py-6`}>
      <div className={`flex ${textAlignment} items-center`}>
        <Body color={textColor} weight={fontWeight} size={textSize}>
          {text}
        </Body>
      </div>
    </div>
  );
};

export const BannerComponent: ComponentConfig<BannerProps> = {
  fields: bannerFields,
  defaultProps: {
    text: "Banner Text",
    textAlignment: "justify-center",
    textSize: "base",
    fontWeight: "default",
    textColor: "default",
    backgroundColor: "bg-white",
  },
  render: ({
    text,
    textAlignment,
    textSize,
    fontWeight,
    textColor,
    backgroundColor,
  }) => (
    <Banner
      text={text}
      textAlignment={textAlignment}
      textSize={textSize}
      fontWeight={fontWeight}
      textColor={textColor}
      backgroundColor={backgroundColor}
    />
  ),
};
