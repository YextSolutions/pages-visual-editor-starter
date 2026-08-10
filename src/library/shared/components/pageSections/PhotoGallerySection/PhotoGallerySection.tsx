// @ts-nocheck
import { useTranslation } from "react-i18next";
import { PuckComponent, setDeep, Slot } from "@puckeditor/core";
import "pure-react-carousel/dist/react-carousel.es.css";
import {
  backgroundColors,
  ThemeColor,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { PageSection } from "../../atoms/pageSection";
import { VisibilityWrapper } from "../../atoms/visibilityWrapper";
import { msg } from "@yext/visual-editor/section-library-support";
import { HeadingTextProps } from "../../contentBlocks/HeadingText";
import { AssetImageType } from "@yext/visual-editor/section-library-support";
import { PhotoGalleryWrapperProps } from "./PhotoGalleryWrapper";
import { getRandomPlaceholderImageObject } from "@yext/visual-editor/section-library-support";
import { ComponentErrorBoundary } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import {
  isMappedEntityFieldSelected,
  MappedEntityFieldConditionalRender,
  withMappedEntityFieldConditionalRender,
} from "../entityFieldSectionUtils";
import {
  getPhotoGalleryImageData,
  PhotoGalleryImageValue,
} from "./photoGalleryUtils";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

// Generate 3 random placeholder images for the gallery
export const PLACEHOLDER: AssetImageType = {
  ...getRandomPlaceholderImageObject({ width: 1000, height: 570 }),
  width: 1000,
  height: 570,
  assetImage: {
    name: "Placeholder",
  },
};

export interface PhotoGalleryStyles {
  /**
   * The background color for the entire section, selected from the theme.
   * @defaultValue Background Color 1
   */
  backgroundColor?: ThemeColor;

  /**
   * The layout style for displaying images in the gallery.
   * @defaultValue "gallery"
   */
  variant: "gallery" | "carousel";

  /**
   * Whether to show the section heading
   * @defaultValue true
   */
  showSectionHeading: boolean;
}

export interface PhotoGallerySectionProps {
  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: PhotoGalleryStyles;

  /** @internal */
  slots: {
    HeadingSlot: Slot;
    PhotoGalleryWrapper: Slot;
  };

  /** @internal */
  conditionalRender?: MappedEntityFieldConditionalRender;

  /**
   * If 'true', the component is visible on the live page; if 'false', it's hidden.
   * @defaultValue true
   */
  liveVisibility: boolean;
}

const photoGallerySectionFields: YextFields<PhotoGallerySectionProps> = {
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      variant: {
        type: "basicSelector",
        label: msg("fields.variant", "Variant"),
        options: [
          { label: msg("fields.options.gallery", "Gallery"), value: "gallery" },
          {
            label: msg("fields.options.carousel", "Carousel"),
            value: "carousel",
          },
        ],
      },
      showSectionHeading: {
        label: msg("fields.showSectionHeading", "Show Section Heading"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      HeadingSlot: { type: "slot" },
      PhotoGalleryWrapper: { type: "slot" },
    },
    visible: false,
  },
  liveVisibility: {
    label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
  },
};

const PhotoGallerySectionComponent: PuckComponent<PhotoGallerySectionProps> = ({
  styles,
  slots,
}) => {
  const { t } = useTranslation();

  return (
    <PageSection
      aria-label={t("photoGallerySection", "Photo Gallery Section")}
      background={styles.backgroundColor}
      className="flex flex-col gap-8"
    >
      {styles.showSectionHeading && (
        <slots.HeadingSlot style={{ height: "auto" }} allow={[]} />
      )}
      <slots.PhotoGalleryWrapper style={{ height: "auto" }} allow={[]} />
    </PageSection>
  );
};

/**
 * The Photo Gallery Section is designed to display a collection of images in a visually appealing format. It consists of a main heading for the section and a flexible grid of images, with options for styling the image presentation.
 * Available on Location templates.
 */
export const PhotoGallerySection: YextComponentConfig<PhotoGallerySectionProps> =
  {
    label: msg("components.photoGallerySection", "Photo Gallery Section"),
    fields: photoGallerySectionFields,
    defaultProps: {
      styles: {
        variant: "gallery",
        backgroundColor: backgroundColors.background1.value,
        showSectionHeading: true,
      },
      slots: {
        HeadingSlot: [
          {
            type: "HeadingTextSlot",
            props: {
              data: {
                text: {
                  field: "",
                  constantValue: { defaultValue: "Gallery" },
                  constantValueEnabled: true,
                },
              },
              styles: {
                level: 2,
                align: "left",
              },
            } satisfies HeadingTextProps,
          },
        ],
        PhotoGalleryWrapper: [
          {
            type: "PhotoGalleryWrapper",
            props: {
              data: {
                images: {
                  field: "",
                  constantValue: [
                    { assetImage: PLACEHOLDER },
                    { assetImage: PLACEHOLDER },
                    { assetImage: PLACEHOLDER },
                  ],
                  constantValueEnabled: true,
                },
              },
              styles: {
                image: {
                  aspectRatio: 1.78,
                },
                imageFillType: "fill",
                carouselImageCount: 1,
              },
              parentData: {
                variant: "gallery",
              },
            } satisfies PhotoGalleryWrapperProps,
          },
        ],
      },
      liveVisibility: true,
    },
    resolveData(data, params) {
      let updatedData = data;

      if (
        data.props.slots.PhotoGalleryWrapper[0]?.props.parentData?.variant !==
        data.props.styles.variant
      ) {
        updatedData = setDeep(
          data,
          "props.slots.PhotoGalleryWrapper[0].props.parentData.variant",
          data.props.styles.variant
        );
      }

      const photoGalleryWrapperProps = updatedData.props.slots
        .PhotoGalleryWrapper[0]?.props as unknown as
        | PhotoGalleryWrapperProps
        | undefined;
      const streamDocument = params.metadata.streamDocument;
      const locale = streamDocument?.locale ?? "en";
      const resolvedImages = photoGalleryWrapperProps?.data?.images
        ? (resolveComponentData(
            photoGalleryWrapperProps.data.images as any,
            locale,
            streamDocument
          ) as unknown as PhotoGalleryImageValue[] | undefined)
        : undefined;
      const { hasRenderableImages } = getPhotoGalleryImageData({
        resolvedImages,
        locale,
        streamDocument,
        aspectRatio: photoGalleryWrapperProps?.styles?.image?.aspectRatio,
        width: photoGalleryWrapperProps?.styles?.image?.width,
        isEditing: false,
      });

      return withMappedEntityFieldConditionalRender(
        updatedData,
        isMappedEntityFieldSelected(photoGalleryWrapperProps?.data?.images) &&
          !hasRenderableImages
      );
    },
    render: (props) => (
      <ComponentErrorBoundary
        isEditing={props.puck.isEditing}
        resetKeys={[props]}
      >
        <VisibilityWrapper
          liveVisibility={props.liveVisibility}
          isEditing={props.puck.isEditing}
        >
          {props.conditionalRender?.isMappedContentEmpty &&
          !props.puck.isEditing ? (
            <></>
          ) : (
            <PhotoGallerySectionComponent {...props} />
          )}
        </VisibilityWrapper>
      </ComponentErrorBoundary>
    ),
  };
