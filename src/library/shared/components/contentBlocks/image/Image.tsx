import { PuckComponent, setDeep } from "@puckeditor/core";
import { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  AssetImageType,
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
  TranslatableAssetImage,
} from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import {
  Image,
  ImgSizesByBreakpoint,
  imgSizesHelper,
} from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { EmptyImageState } from "./EmptyImageState";
import { ImageStylingFields, ImageStylingProps } from "./styling";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/640x360";
const DEFAULT_LINK = "#";
const LINK_REGEX_VALIDATION = /^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*)$/;

export interface ImageWrapperProps {
  data: {
    /** The image to display. */
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    link?: TranslatableString;
  };

  /** Size and aspect ratio of the image. */
  styles: ImageStylingProps;

  /** @internal Controlled data from the parent section. */
  parentData?: {
    field: string;
    image: ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  };

  /** Additional CSS classes to apply to the image. */
  className?: string;

  sizes?: ImgSizesByBreakpoint;

  hideWidthProp?: boolean;

  /** @internal If true, shows the imageConstrain prop. */
  showImageConstrain?: boolean;
}

export const ImageWrapperFields: YextFields<ImageWrapperProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      image: {
        type: "entityField",
        label: msg("fields.options.image", "Image"),
        filter: {
          types: ["type.image"],
        },
      },
      link: {
        type: "translatableString",
        label: msg("fields.link", "Link"),
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      ...ImageStylingFields,
    },
  },
  showImageConstrain: {
    label: msg("fields.showImageConstrain", "Show Image Constrain"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
    visible: false,
  },
};

export const getImageUrl = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  locale: string
): string | undefined => {
  if (!image) {
    return undefined;
  }

  if (isLocalizedAssetImage(image)) {
    return resolveLocalizedAssetImage(image, locale)?.url;
  }

  if ("image" in image) {
    return image.image?.url;
  }

  return image.url;
};

const ImageWrapperComponent: PuckComponent<ImageWrapperProps> = (props) => {
  const {
    data,
    styles,
    parentData,
    className,
    puck,
    sizes = {
      base: styles.width ? `min(100vw, width)` : "100vw",
      md: styles.width
        ? `min(width, calc((maxWidth - 32px) / 2))`
        : "maxWidth / 2",
    },
    hideWidthProp,
    showImageConstrain = false,
  } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const resolvedImage = React.useMemo(() => {
    return parentData
      ? parentData?.image
      : resolveComponentData(data.image, i18n.language, streamDocument);
  }, [parentData, data.image, i18n.language, streamDocument]);

  const imageUrl = getImageUrl(resolvedImage, i18n.language);
  const isEmpty =
    !resolvedImage ||
    !imageUrl ||
    (typeof imageUrl === "string" && imageUrl.trim() === "");

  const inputLink = resolveComponentData(
    data.link ?? { defaultValue: DEFAULT_LINK },
    i18n.language,
    streamDocument
  );

  const resolvedLink =
    typeof inputLink === "string" &&
    LINK_REGEX_VALIDATION.test(inputLink.trim()) &&
    inputLink.trim() !== DEFAULT_LINK
      ? inputLink.trim()
      : undefined;

  if (isEmpty) {
    return (
      <EmptyImageState
        isEmpty={isEmpty}
        isEditing={puck.isEditing ?? false}
        constantValueEnabled={data.image.constantValueEnabled ?? false}
        constantValue={data.image.constantValue as AssetImageType | undefined}
        fieldId={parentData ? parentData.field : data.image.field}
        containerStyle={{
          ...(hideWidthProp
            ? {}
            : styles.width
              ? { width: `${styles.width}px` }
              : {}),
          ...(styles.aspectRatio ? { aspectRatio: styles.aspectRatio } : {}),
        }}
        containerClassName={
          className || "max-w-full rounded-image-borderRadius w-full h-full"
        }
        fullHeight
        dragRef={puck.dragRef ?? undefined}
        hasParentData={!!parentData}
      />
    );
  }

  const transformedSizes = imgSizesHelper(sizes, `${styles.width}px`);

  return (
    <EntityField
      displayName={pt("fields.image", "Image")}
      fieldId={parentData ? parentData.field : data.image.field}
      constantValueEnabled={!parentData && data.image.constantValueEnabled}
      fullHeight
      ref={puck.dragRef}
    >
      <div className="w-full">
        <MaybeLink
          className="w-auto"
          eventName="logoLink"
          href={resolvedLink}
          alwaysHideCaret={true}
        >
          <Image
            image={resolvedImage}
            aspectRatio={styles.aspectRatio}
            imageFillType={styles.imageFillType}
            width={
              hideWidthProp ||
              (showImageConstrain && styles.imageConstrain === "fill")
                ? undefined
                : styles.width
            }
            className={
              className || "max-w-full rounded-image-borderRadius w-full"
            }
            sizes={transformedSizes}
          />
        </MaybeLink>
      </div>
    </EntityField>
  );
};

export const imageDefaultProps = {
  data: {
    image: {
      field: "",
      constantValue: {
        url: PLACEHOLDER_IMAGE_URL,
        height: 360,
        width: 640,
      },
      constantValueEnabled: true,
    },
    link: { defaultValue: DEFAULT_LINK },
  },
  styles: {
    aspectRatio: 1.78,
    imageFillType: "fill" as const,
    width: 640,
  },
  allowWidthProp: true,
};

export const ImageWrapper: YextComponentConfig<ImageWrapperProps> = {
  label: msg("components.image", "Image"),
  inline: true,
  fields: ImageWrapperFields,
  defaultProps: imageDefaultProps,
  resolveFields: (data, params) => {
    let fields = resolveDataFromParent(ImageWrapperFields, data);
    const parentType = params.parent?.type;

    if (
      data.props.hideWidthProp ||
      data.props.styles.imageConstrain === "fill"
    ) {
      fields = setDeep(fields, "styles.objectFields.width.visible", false);
    } else {
      fields = setDeep(fields, "styles.objectFields.width.visible", true);
    }

    fields = setDeep(
      fields,
      "styles.objectFields.imageConstrain.visible",
      !!data.props.showImageConstrain
    );

    if (parentType !== "PrimaryHeaderSlot") {
      return setDeep(fields, "data.objectFields.link.visible", false);
    }

    return fields;
  },
  render: (props) => <ImageWrapperComponent {...props} />,
};
