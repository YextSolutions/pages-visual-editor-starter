// @ts-nocheck
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  AssetImageType,
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
  TranslatableAssetImage,
} from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "../atoms/maybeLink";
import { getImageAltText, Image } from "../atoms/image";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { ImageStylingFields } from "../contentBlocks/image/styling";
import { ComplexImageType, ImageType } from "@yext/pages-components";
import { getImageUrl } from "../contentBlocks/image/Image";
import { YextComponentConfig } from "@yext/visual-editor/section-library-support";

export interface FooterLogoSlotProps {
  data: {
    image: YextEntityField<
      ImageType | ComplexImageType | AssetImageType | TranslatableAssetImage
    >;
    linkTarget?: string;
  };
  styles: {
    width?: number;
    aspectRatio?: number;
  };
}

const FooterLogoSlotInternal: PuckComponent<FooterLogoSlotProps> = (props) => {
  const { data, styles, puck } = props;
  const streamDocument = useDocument();
  const { i18n, t } = useTranslation();

  const resolvedImage:
    | ImageType
    | ComplexImageType
    | TranslatableAssetImage
    | undefined = resolveComponentData(
    data.image,
    i18n.language,
    streamDocument
  );
  const simplifiedImage: ImageType | AssetImageType | undefined =
    resolvedImage && "image" in resolvedImage
      ? resolvedImage.image
      : resolvedImage && isLocalizedAssetImage(resolvedImage)
        ? resolveLocalizedAssetImage(resolvedImage, i18n.language)
        : resolvedImage;

  const imageUrl = getImageUrl(simplifiedImage, i18n.language);

  if (!simplifiedImage || !imageUrl) {
    return puck.isEditing ? <div className="h-20 w-[100px]" /> : <></>;
  }

  const width = styles.width || 150;
  const aspectRatio = styles.aspectRatio || 1.78;

  const imgElement = (
    <Image
      image={simplifiedImage}
      aspectRatio={aspectRatio}
      width={width}
      className="object-contain"
    />
  );

  const altText = getImageAltText(
    simplifiedImage,
    i18n.language,
    streamDocument
  );
  const ariaLabel = altText || t("logo", "Logo");

  return (
    <div className="w-fit">
      <MaybeLink
        href={data.linkTarget}
        className="block"
        ariaLabel={ariaLabel}
        alwaysHideCaret={true}
      >
        {imgElement}
      </MaybeLink>
    </div>
  );
};

export const FooterLogoSlot: YextComponentConfig<FooterLogoSlotProps> = {
  label: msg("components.footerLogoSlot", "Logo"),
  fields: {
    data: {
      type: "object",
      label: msg("fields.data", "Data"),
      objectFields: {
        image: {
          type: "entityField",
          label: msg("fields.image", "Image"),
          filter: {
            types: ["type.image"],
          },
        },
        linkTarget: {
          label: msg("fields.linkTarget", "Link Target"),
          type: "text",
        },
      },
    },
    styles: {
      type: "object",
      label: msg("fields.styles", "Styles"),
      objectFields: {
        width: ImageStylingFields.width,
        aspectRatio: ImageStylingFields.aspectRatio,
      },
    },
  },
  defaultProps: {
    data: {
      image: {
        field: "",
        constantValue: {
          // Placeholder logo, uploaded to account 4174974
          url: "https://a.mktgcdn.com/p/wa83C1O1lvtxHI9cGqEdP2HILyUzbD0jvtzwWpOAJfE/196x196.jpg",
          height: 100,
          width: 100,
          alternateText: { defaultValue: "Logo" },
        },
        constantValueEnabled: true,
      },
    },
    styles: {
      width: 0,
      aspectRatio: 1,
    },
  },
  render: (props) => <FooterLogoSlotInternal {...props} />,
};
