import * as React from "react";
import { ComponentConfig, Fields } from "@measured/puck";
import { Image, ImageProps, ImageType } from "@yext/pages-components";
import {
  yextCn,
  useDocument,
  resolveYextEntityField,
  EntityField,
  YextEntityField,
  YextEntityFieldSelector,
  FontSizeSelector,
} from "@yext/visual-editor";
import { Body } from "./atoms/body.js";
import { CTA, CTAProps } from "./atoms/cta.js";
import { Heading, HeadingProps } from "./atoms/heading.js";
import { Section } from "./atoms/section.js";
import { imageWrapperVariants, ImageWrapperProps } from "./Image.js";
import { C_deliveryPromo, C_locationPromo } from "../types/autogen.js";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";

interface PromoProps {
  orientation: "left" | "right";
  promo: YextEntityField<C_locationPromo>;
  title: {
    text: YextEntityField<string>;
    fontSize: HeadingProps["fontSize"];
    color: HeadingProps["color"];
    transform: HeadingProps["transform"];
  };
  description: {
    text: YextEntityField<string>;
    fontSize: HeadingProps["fontSize"];
    color: HeadingProps["color"];
    transform: HeadingProps["transform"];
  };
  image: {
    image: YextEntityField<ImageType>;
    size: ImageWrapperProps["size"];
    aspectRatio: ImageWrapperProps["aspectRatio"];
    rounded: ImageWrapperProps["rounded"];
  };
  cta: {
    entityField: YextEntityField<CTAProps>;
    variant: CTAProps["variant"];
    fontSize: HeadingProps["fontSize"];
  };
}

const promoFields: Fields<PromoProps> = {
  promo: YextEntityFieldSelector<any, C_locationPromo>({
    label: "Promo",
    filter: {
      types: ["c_locationPromo"],
    },
  }),
  orientation: {
    type: "select",
    label: "Orientation",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  title: {
    type: "object",
    label: "Title",
    objectFields: {
      text: YextEntityFieldSelector<any, string>({
        label: "Entity Field",
        filter: {
          types: ["type.string"],
        },
      }),
      fontSize: FontSizeSelector(),
      color: {
        label: "Font Color",
        type: "select",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Accent", value: "accent" },
          { label: "Text", value: "text" },
          { label: "Background", value: "background" },
          { label: "Foreground", value: "foreground" },
        ],
      },
      transform: {
        label: "Text Transform",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "lowercase", label: "Lowercase" },
          { value: "uppercase", label: "Uppercase" },
          { value: "capitalize", label: "Capitalize" },
        ],
      },
    },
  },
  description: {
    type: "object",
    label: "Description",
    objectFields: {
      text: YextEntityFieldSelector<any, string>({
        label: "Entity Field",
        filter: {
          types: ["type.string"],
        },
      }),
      fontSize: FontSizeSelector(),
      color: {
        label: "Font Color",
        type: "select",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Accent", value: "accent" },
          { label: "Text", value: "text" },
          { label: "Background", value: "background" },
          { label: "Foreground", value: "foreground" },
        ],
      },
      transform: {
        label: "Text Transform",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "lowercase", label: "Lowercase" },
          { value: "uppercase", label: "Uppercase" },
          { value: "capitalize", label: "Capitalize" },
        ],
      },
    },
  },
  image: {
    type: "object",
    label: "Image",
    objectFields: {
      image: YextEntityFieldSelector<any, ImageType>({
        label: "Image",
        filter: {
          types: ["type.image"],
        },
      }),
      size: {
        type: "select",
        label: "Size",
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
          { label: "Full Width", value: "full" },
        ],
      },
      aspectRatio: {
        type: "select",
        label: "Aspect Ratio",
        options: [
          { label: "Auto", value: "auto" },
          { label: "Square", value: "square" },
          { label: "Video (16:9)", value: "video" },
          { label: "Portrait (3:4)", value: "portrait" },
        ],
      },
      rounded: {
        type: "select",
        label: "Rounded Corners",
        options: [
          { label: "None", value: "none" },
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
          { label: "Full", value: "full" },
        ],
      },
    },
  },
  cta: {
    type: "object",
    label: "Call to Action",
    objectFields: {
      entityField: YextEntityFieldSelector({
        label: "Entity Field",
        filter: {
          types: ["type.cta"],
        },
      }),
      variant: {
        type: "select",
        label: "Variant",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Link", value: "link" },
        ],
      },
      fontSize: FontSizeSelector(),
    },
  },
};

const PromoWrapper: React.FC<PromoProps> = ({
  promo,
  orientation,
  title,
  description,
  image,
  cta,
}) => {
  const document = useDocument();
  const resolvedImage = resolveYextEntityField<ImageProps["image"]>(
    document,
    image.image
  );
  const resolvedCTA = resolveYextEntityField(document, cta.entityField);
  const resolvedPromo = resolveYextEntityField<C_locationPromo>(
    document,
    promo
  );

  if (!resolvedImage) {
    return null;
  }

  return (
    <Section className="components">
      <div
        className={yextCn(
          "flex flex-col md:flex-row bg-white overflow-hidden md:gap-8",
          orientation === "right" && "md:flex-row-reverse"
        )}
      >
        {resolvedImage && (
          <EntityField displayName="Image" fieldId={image.image.field}>
            <div
              className={yextCn(
                imageWrapperVariants({
                  size: image.size,
                  rounded: image.rounded,
                  aspectRatio: image.aspectRatio,
                }),
                "overflow-hidden"
              )}
            >
              <Image
                image={resolvedImage}
                className="w-full h-full object-cover"
              />
            </div>
          </EntityField>
        )}
        <div className="flex flex-col justify-center gap-y-4 md:gap-y-8 p-4 md:px-16 md:py-0 w-full break-all">
          {title?.text && (
            <Heading
              fontSize={title.fontSize}
              color={title.color}
              transform={title.transform}
            >
              {resolveYextEntityField(document, title.text)}
            </Heading>
          )}
          {description?.text && (
            <Body
              fontSize={description.fontSize}
              textTransform={description.transform}
              color={description.color}
            >
              {resolveYextEntityField(document, description.text)}
            </Body>
          )}
          {resolvedCTA && (
            <CTA
              variant={cta.variant}
              label={resolvedCTA.name}
              link={resolvedCTA.link ?? "#"}
              fontSize={cta.fontSize}
            />
          )}
        </div>
      </div>
    </Section>
  );
};

export const PromoComponent: ComponentConfig<PromoProps> = {
  label: "Promo",
  fields: promoFields,
  defaultProps: {
    orientation: "left",
    title: {
      text: {
        field: "",
        constantValue: "Title",
        constantValueEnabled: true,
      },
      fontSize: "default",
      color: "default",
      transform: "none",
    },
    description: {
      text: {
        field: "",
        constantValue: "Description",
        constantValueEnabled: true,
      },
      fontSize: "default",
      color: "default",
      transform: "none",
    },
    image: {
      image: {
        field: "primaryPhoto",
        constantValue: {
          alternateText: "",
          height: 360,
          width: 640,
          url: PLACEHOLDER_IMAGE_URL,
        },
        constantValueEnabled: true,
      },
      size: "medium",
      rounded: "none",
      aspectRatio: "auto",
    },
    cta: {
      entityField: {
        field: "",
        constantValue: {
          name: "Call to Action",
        },
      },
      fontSize: "default",
      variant: "primary",
    },
  },
  render: (props) => <PromoWrapper {...props} />,
};

export { PromoComponent as Promo, type PromoProps };
