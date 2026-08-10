// @ts-nocheck
import * as React from "react";
import {
  ComplexImageType,
  Image as ImageComponent,
  ImageType,
} from "@yext/pages-components";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  AssetImageType,
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
  TranslatableAssetImage,
  ImageFillType,
} from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { getThemeValue } from "@yext/visual-editor/section-library-support";

export interface ImageProps {
  image: ImageType | ComplexImageType | TranslatableAssetImage;
  aspectRatio?: number;
  width?: number;
  imageFillType?: ImageFillType;
  className?: string;
  /** sizes attribute of the underlying img tag */
  sizes?: string;
  loading?: "lazy" | "eager";
  /**
   * Entity data used to resolve embedded fields.
   * Defaults to the stream document if not provided.
   */
  streamDocumentOverride?: Record<string, any>;
  style?: React.CSSProperties;
}

export const getImageAltText = (
  image: ImageType | ComplexImageType | AssetImageType | undefined,
  locale: string,
  streamDocument: StreamDocument | Record<string, any>
): string | undefined => {
  if (!image) {
    return undefined;
  }

  let altTextField: string | TranslatableString | undefined = undefined;
  if (isComplexImageType(image)) {
    altTextField = image.image.alternateText;
  } else if (image?.alternateText) {
    altTextField = image.alternateText;
  }

  return typeof altTextField === "object"
    ? resolveComponentData(altTextField, locale, streamDocument)
    : altTextField;
};

export const Image: React.FC<ImageProps> = ({
  image: rawImage,
  aspectRatio,
  width,
  imageFillType,
  className,
  sizes,
  loading = "lazy",
  streamDocumentOverride,
  style,
}) => {
  const { i18n } = useTranslation();
  const streamDocument: StreamDocument | Record<string, any> =
    streamDocumentOverride ?? useDocument();

  const image = React.useMemo(() => {
    if (rawImage && isLocalizedAssetImage(rawImage)) {
      return resolveLocalizedAssetImage(rawImage, i18n.language);
    }
    return rawImage as ImageType | ComplexImageType | AssetImageType;
  }, [rawImage, i18n.language]);

  if (!image) {
    return null;
  }

  // Calculate height based on width and aspect ratio if width is provided
  const calculatedHeight =
    width && aspectRatio ? width / aspectRatio : undefined;

  // Determine container styles based on whether width is specified
  const containerStyles = width
    ? `overflow-hidden` // No w-full when width is specified
    : `overflow-hidden w-full`; // Use w-full when no width specified

  const altText = getImageAltText(image, i18n.language, streamDocument);
  const imageStyle: React.CSSProperties = {
    objectFit: imageFillType === "fit" ? "contain" : "cover",
    ...style,
  };

  return (
    <div
      className={themeManagerCn(containerStyles, className)}
      style={width ? { width: `${width}px` } : undefined}
    >
      {aspectRatio ? (
        <ImageComponent
          image={{ ...image, alternateText: altText }}
          layout={"aspect"}
          aspectRatio={aspectRatio}
          className="object-cover w-full h-full"
          imgOverrides={{ sizes }}
          loading={loading}
          style={imageStyle}
        />
      ) : !!width && !!calculatedHeight ? (
        <ImageComponent
          image={{ ...image, alternateText: altText }}
          layout={"fixed"}
          width={width}
          height={calculatedHeight}
          className="object-cover"
          imgOverrides={{ sizes }}
          loading={loading}
          style={imageStyle}
        />
      ) : (
        <img
          src={isComplexImageType(image) ? image.image.url : image.url}
          alt={altText}
          className="object-cover w-full h-full"
          loading={loading}
          style={imageStyle}
        />
      )}
    </div>
  );
};

function isComplexImageType(
  image: ImageType | ComplexImageType | AssetImageType
): image is ComplexImageType {
  return "image" in image;
}

export type ImgSizesByBreakpoint = {
  base: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  "2xl"?: string;
};

/**
 * Creates an img sizes attribute based on the default Tailwind breakpoints.
 * Replaces `maxWidth` with the current page section max width from the theme.
 * Replaces `width` with the width parameter.
 * @param sizes - the width of the image at different breakpoints
 * @param width - the current width prop of the image
 * @returns a string for the sizes attribute of an img tag
 */
export const imgSizesHelper = (
  sizes: ImgSizesByBreakpoint,
  width?: string
): string => {
  const streamDocument = useDocument();

  let maxWidth = getThemeValue(
    "--maxWidth-pageSection-contentWidth",
    streamDocument
  );
  if (!maxWidth && streamDocument?.__?.theme) {
    maxWidth = "1024px";
  }

  const updatedBreakpointSizes = Object.fromEntries(
    Object.entries(sizes).map(([key, value]) => [
      key,
      value
        .replace("maxWidth", maxWidth || "1440px")
        .replace("width", width || 640 + "px"),
    ])
  );

  let sizesString = updatedBreakpointSizes.base;
  if (updatedBreakpointSizes.sm) {
    sizesString =
      `(min-width: 640px) ${updatedBreakpointSizes.sm}, ` + sizesString;
  }
  if (updatedBreakpointSizes.md) {
    sizesString =
      `(min-width: 768px) ${updatedBreakpointSizes.md}, ` + sizesString;
  }
  if (updatedBreakpointSizes.lg) {
    sizesString =
      `(min-width: 1024px) ${updatedBreakpointSizes.lg}, ` + sizesString;
  }
  if (updatedBreakpointSizes.xl) {
    sizesString =
      `(min-width: 1280px) ${updatedBreakpointSizes.xl}, ` + sizesString;
  }
  if (updatedBreakpointSizes["2xl"]) {
    sizesString =
      `(min-width: 1536px) ${updatedBreakpointSizes["2xl"]}, ` + sizesString;
  }
  return sizesString;
};
