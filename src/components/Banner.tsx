import {
  YextEntityField,
  resolveYextEntityField,
  YextEntityFieldSelector,
  Body,
  BodyProps,
  useDocument
} from "@yext/visual-editor";
import { ComponentConfig, Fields } from "@measured/puck";
import { config } from "../templates/location";
import { LocationStream } from "../types/autogen";

export type BannerProps = {
  text: YextEntityField<string>;
  textAlignment: "justify-end" | "justify-start" | "justify-center";
  textSize: BodyProps["size"];
  fontWeight: BodyProps["weight"];
  textColor: BodyProps["color"];
  backgroundColor: "bg-white" | "palette-primary" | "palette-secondary";
};

const bannerFields: Fields<BannerProps> = {
  text: YextEntityFieldSelector<typeof config, string>({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
    },
  }),
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
      { label: "Primary", value: "palette-primary" },
      { label: "Secondary", value: "palette-secondary" },
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
  const document = useDocument<LocationStream>();
  return (
    <div className={`Banner ${backgroundColor} components px-4 md:px-20 py-6`}>
      <div className={`flex ${textAlignment} items-center`}>
        <Body color={textColor} weight={fontWeight} size={textSize}>
          {resolveYextEntityField(document, text)}
        </Body>
      </div>
    </div>
  );
};

export const BannerComponent: ComponentConfig<BannerProps> = {
  fields: bannerFields,
  defaultProps: {
    text: {
      field: "",
      constantValue: "Banner Text",
      constantValueEnabled: true
    },
    textAlignment: "justify-center",
    textSize: "base",
    fontWeight: "default",
    textColor: "default",
    backgroundColor: "bg-white",
  },
  render: (props) => <Banner {...props} />,
};
