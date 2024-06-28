import { useState } from "react";
import { BodyProps, Body } from "./atoms/body";
import { ComponentConfig, Fields } from "@measured/puck";
import { FaTimes } from "react-icons/fa";

export type BannerProps = {
  text: string;
  textAlignment: "end" | "start" | "center";
  textSize: BodyProps["size"];
  fontWeight: BodyProps["weight"];
  textColor: BodyProps["color"];
  backgroundColor: "white" | "primary" | "secondary";
  hasCloseBtn: "true" | "false";
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
      { label: "Left", value: "end" },
      { label: "Right", value: "start" },
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
  hasCloseBtn: {
    label: "Close Button",
    type: "radio",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
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
  hasCloseBtn,
}: BannerProps) => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) {
    return null;
  }

  return (
    <div className={`Banner bg-${backgroundColor} py-4`}>
      <div className={`container flex justify-${textAlignment} items-center`}>
        <Body color={textColor} weight={fontWeight} size={textSize}>
          {text}
        </Body>
        {hasCloseBtn && (
          <button onClick={() => setShowBanner(false)}>
            <FaTimes className="w-4 h-4" />
            <span className="sr-only">Hide banner</span>
          </button>
        )}
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
    hasCloseBtn: "false",
  },
  render: ({
    text,
    textAlignment,
    textSize,
    fontWeight,
    textColor,
    backgroundColor,
    hasCloseBtn,
  }) => (
    <Banner
      text={text}
      textAlignment={textAlignment}
      textSize={textSize}
      fontWeight={fontWeight}
      textColor={textColor}
      backgroundColor={backgroundColor}
      hasCloseBtn={hasCloseBtn}
    />
  ),
};
