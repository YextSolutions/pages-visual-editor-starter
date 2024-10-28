import * as React from "react";
import { ComponentConfig, Fields } from "@measured/puck";
import { Image, ImageProps, ImageType } from "@yext/pages-components";
import {
  EntityField,
  YextEntityField,
  resolveYextEntityField,
  YextEntityFieldSelector,
  useDocument,
} from "@yext/visual-editor";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { config } from "../templates/location";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";

const imageWrapperVariants = cva("", {
  variants: {
    size: {
      small: "max-w-xs",
      medium: "max-w-md",
      large: "max-w-xl",
      full: "w-full",
    },
    aspectRatio: {
      auto: "aspect-auto",
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
    },
    rounded: {
      none: "",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    size: "medium",
    aspectRatio: "auto",
    rounded: null,
  },
});

export interface ImageWrapperProps
  extends VariantProps<typeof imageWrapperVariants> {
  image: YextEntityField<ImageType>;
}

const imageWrapperFields: Fields<ImageWrapperProps> = {
  image: YextEntityFieldSelector<typeof config, ImageType>({
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
};

const ImageWrapper: React.FC<ImageWrapperProps> = ({
  image: imageField,
  size,
  aspectRatio,
  rounded,
}) => {
  const document = useDocument();
  const resolvedImage = resolveYextEntityField<ImageProps["image"]>(
    document,
    imageField
  );

  if (!resolvedImage) {
    return null;
  }

  return (
    <EntityField displayName="Image" fieldId={imageField.field}>
      <div
        className={cn(
          imageWrapperVariants({ size, aspectRatio, rounded }),
          "overflow-hidden"
        )}
      >
        <Image image={resolvedImage} className="w-full h-full object-cover" />
      </div>
    </EntityField>
  );
};

export const ImageWrapperComponent: ComponentConfig<ImageWrapperProps> = {
  label: "Image",
  fields: imageWrapperFields,
  defaultProps: {
    image: {
      field: "primaryPhoto",
      constantValue: {
        alternateText: "",
        height: 360,
        width: 640,
        url: PLACEHOLDER_IMAGE_URL,
      },
    },
    size: "medium",
    aspectRatio: "auto",
    rounded: "none",
  },
  render: (props) => <ImageWrapper {...props} />,
};

export { ImageWrapper, imageWrapperVariants };
