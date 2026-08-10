// @ts-nocheck
import { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  AssetImageType,
  isLocalizedAssetImage,
  resolveLocalizedAssetImage,
  TranslatableAssetImage,
} from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";

export type PhotoGalleryImageValue =
  | ImageType
  | ComplexImageType
  | { assetImage: AssetImageType | TranslatableAssetImage };

export type ResolvedGalleryImage = {
  isEmpty: boolean;
  originalIndex: number;
  image: ImageType | AssetImageType;
  aspectRatio?: number;
  width?: number;
  originalImage: PhotoGalleryImageValue;
};

/**
 * Normalizes the resolved photo gallery field value into the image shape used by
 * the gallery renderers and reports whether the mapped field produced any
 * renderable images.
 *
 * Empty images are retained only in editor mode so the wrapper can still render
 * its empty state; live rendering filters them out entirely.
 */
export const getPhotoGalleryImageData = ({
  resolvedImages,
  locale,
  streamDocument,
  aspectRatio,
  width,
  isEditing,
}: {
  resolvedImages: PhotoGalleryImageValue[] | undefined;
  locale: string;
  streamDocument?: Record<string, any>;
  aspectRatio?: number;
  width?: number;
  isEditing: boolean;
}): {
  galleryImages: ResolvedGalleryImage[];
  hasRenderableImages: boolean;
} => {
  const allGalleryImages = (
    Array.isArray(resolvedImages) ? resolvedImages : []
  ).map((rawImage, originalIndex) => {
    let image: ImageType | AssetImageType | undefined;
    let altText = "";

    if (
      typeof rawImage === "object" &&
      rawImage !== null &&
      "assetImage" in rawImage
    ) {
      if (isLocalizedAssetImage(rawImage.assetImage)) {
        image = resolveLocalizedAssetImage(rawImage.assetImage, locale);
        altText = resolveComponentData(
          image?.alternateText ?? "",
          locale,
          streamDocument
        );
      } else {
        image = rawImage.assetImage;
        altText = resolveComponentData(
          rawImage.assetImage?.alternateText ?? "",
          locale,
          streamDocument
        );
      }
    } else if (
      typeof rawImage === "object" &&
      rawImage !== null &&
      "image" in rawImage
    ) {
      image = rawImage.image;
      altText = rawImage.image?.alternateText ?? "";
    } else {
      image = rawImage;
      altText = rawImage?.alternateText ?? "";
    }

    const url = image?.url;
    const imageHeight = image?.height || 570;
    const imageWidth = image?.width || 1000;
    const isEmpty = !url || (typeof url === "string" && url.trim() === "");

    return {
      isEmpty,
      originalIndex,
      image: isEmpty
        ? {
            url: "",
            alternateText: altText,
            height: 570,
            width: 1000,
          }
        : {
            url,
            alternateText: altText,
            height: imageHeight,
            width: imageWidth,
          },
      aspectRatio,
      width: width || 1000,
      originalImage: rawImage,
    };
  });

  return {
    galleryImages: allGalleryImages.filter(
      (galleryImage) => isEditing || !galleryImage.isEmpty
    ),
    hasRenderableImages: allGalleryImages.some(
      (galleryImage) => !galleryImage.isEmpty
    ),
  };
};
