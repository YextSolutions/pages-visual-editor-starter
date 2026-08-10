// @ts-nocheck
import * as React from "react";
import { useTranslation } from "react-i18next";
import { PuckComponent, setDeep } from "@puckeditor/core";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { Image, imgSizesHelper } from "../../atoms/image";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { AssetImageType } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import {
  getImageUrl,
  imageDefaultProps,
  ImageWrapperFields,
  ImageWrapperProps,
} from "./Image";
import { EmptyImageState } from "./EmptyImageState";
import { YextComponentConfig } from "@yext/visual-editor/section-library-support";

export interface HeroImageProps extends ImageWrapperProps {
  /** @internal from the parent Hero Section Component */
  variant?: "classic" | "compact" | "immersive" | "spotlight";
}

const HeroImageComponent: PuckComponent<HeroImageProps> = (props) => {
  const { data, styles, className, puck, variant } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const resolvedImage = resolveComponentData(
    data.image,
    i18n.language,
    streamDocument
  );
  const imageUrl = getImageUrl(resolvedImage, i18n.language);
  const isEmpty =
    !resolvedImage ||
    !imageUrl ||
    (typeof imageUrl === "string" && imageUrl.trim() === "");

  if (isEmpty) {
    return (
      <EmptyImageState
        isEmpty={isEmpty}
        isEditing={puck?.isEditing ?? false}
        constantValueEnabled={data.image.constantValueEnabled ?? false}
        constantValue={data.image.constantValue as AssetImageType | undefined}
        fieldId={data.image.field}
        containerStyle={{ minHeight: "250px" }}
        containerClassName={
          className || "max-w-full rounded-image-borderRadius w-full h-full"
        }
        fullHeight={true}
        hasParentData={false}
      />
    );
  }

  return (
    <EntityField
      displayName={pt("fields.image", "Image")}
      fieldId={data.image.field}
      constantValueEnabled={data.image.constantValueEnabled}
      fullHeight={true}
      ref={puck?.dragRef}
    >
      <Image
        image={resolvedImage}
        aspectRatio={styles.aspectRatio}
        imageFillType={styles.imageFillType}
        width={variant === "classic" ? styles.width : undefined}
        className={className || "max-w-full rounded-image-borderRadius w-full"}
        sizes={imgSizesHelper({
          base: "calc(100vw - 32px)",
          md: "calc(maxWidth / 2)",
        })}
        loading="eager"
      />
    </EntityField>
  );
};

export const HeroImage: YextComponentConfig<HeroImageProps> = {
  label: msg("components.heroImage", "Hero Image"),
  fields: ImageWrapperFields,
  defaultProps: imageDefaultProps,
  resolveFields: (data) => {
    let fields = setDeep(
      resolveDataFromParent(ImageWrapperFields, data),
      "styles.objectFields.width.visible",
      true
    );
    const filteredAspectRatioOptions = (
      ImageWrapperFields.styles as {
        objectFields: {
          aspectRatio: {
            options: { label: string; value: number }[];
          };
        };
      }
    ).objectFields.aspectRatio.options.filter(
      (option) => !["4:1", "3:1", "2:1", "9:16"].includes(option.label)
    );

    switch (data.props.variant ?? "classic") {
      case "compact": {
        fields = setDeep(fields, "styles.objectFields.width.visible", false);
        // compact should also hide the props hidden by classic
      }
      case "classic": {
        fields = setDeep(
          fields,
          "styles.objectFields.aspectRatio.options",
          filteredAspectRatioOptions
        );
        break;
      }
    }
    return fields;
  },
  render: (props) => <HeroImageComponent {...props} />,
};
