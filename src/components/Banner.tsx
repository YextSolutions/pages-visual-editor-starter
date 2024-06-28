import { BodyProps, Body } from "./atoms/body";
import { ComponentConfig, Fields } from "@measured/puck";

export type BannerProps = {
  text: string;
  textAlignment: "end" | "start" | "center";
  textSize: BodyProps["size"];
  fontWeight: BodyProps["weight"];
  textColor: BodyProps["color"];
  backgroundColor: "white" | "primary" | "secondary";
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
      { label: "Left", value: "start" },
      { label: "Right", value: "end" },
      { label: "Center", value: "center" },
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
      { label: "Default", value: "white" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
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
    <div className={`Banner bg-${backgroundColor} py-4 components`}>
      <div className={`container flex justify-${textAlignment} items-center`}>
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
    textAlignment: "center",
    textSize: "base",
    fontWeight: "default",
    textColor: "default",
    backgroundColor: "white",
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
