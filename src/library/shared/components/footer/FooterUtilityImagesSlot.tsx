// @ts-nocheck
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { AssetImageType } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "../atoms/maybeLink";
import { Image } from "../atoms/image";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { ImageStylingFields } from "../contentBlocks/image/styling";
import { YextComponentConfig } from "@yext/visual-editor/section-library-support";

export interface FooterUtilityImagesSlotProps {
  data: {
    utilityImages: { image: AssetImageType; linkTarget?: string }[];
  };
  styles: {
    width?: number;
    aspectRatio?: number;
  };
  /** @internal */
  desktopContentAlignment?: "left" | "center" | "right";
  /** @internal */
  mobileContentAlignment?: "left" | "center" | "right";
}

const utilityImagesContainer = cva("flex flex-wrap gap-8", {
  variants: {
    desktopContentAlignment: {
      left: "md:justify-start",
      center: "md:justify-center",
      right: "md:justify-end",
    },
    mobileContentAlignment: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
});

const FooterUtilityImagesSlotInternal: PuckComponent<
  FooterUtilityImagesSlotProps
> = (props) => {
  const {
    data,
    styles,
    desktopContentAlignment = "left",
    mobileContentAlignment = "left",
    puck,
  } = props;
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const streamDocument = useDocument();

  const width = styles.width || 60;
  const aspectRatio = styles.aspectRatio || 1;

  // Filter to only valid images with URLs
  const validImages = (data.utilityImages || [])
    .map(
      (item: { image?: AssetImageType; url?: string; linkTarget?: string }) => {
        if (item.image) {
          return item;
        }
        if (item.url) {
          return {
            image: {
              url: item.url,
            } as AssetImageType,
            linkTarget: item.linkTarget,
          };
        }
        return item;
      }
    )
    .filter(
      (item): item is { image: AssetImageType; linkTarget?: string } =>
        !!item.image?.url ||
        (typeof item.image === "object" && "hasLocalizedValue" in item.image)
    );

  if (validImages.length === 0) {
    return puck.isEditing ? <div className="h-10 min-w-[100px]" /> : <></>;
  }

  return (
    <div
      className={utilityImagesContainer({
        desktopContentAlignment,
        mobileContentAlignment,
      })}
    >
      {validImages.map((item, index) => {
        const imgElement = (
          <Image
            image={item.image}
            aspectRatio={aspectRatio}
            width={width}
            className="object-contain"
          />
        );

        const altText = resolveComponentData(
          item.image?.alternateText ?? "",
          locale,
          streamDocument
        );
        const ariaLabel =
          altText ||
          t(
            "components.footerUtilityImagesSlot.defaultAlt",
            "Utility Image {{number}}",
            {
              number: index + 1,
            }
          );

        return (
          <div key={index}>
            {item.linkTarget ? (
              <MaybeLink
                href={item.linkTarget}
                className="block"
                ariaLabel={ariaLabel}
                alwaysHideCaret={true}
              >
                {imgElement}
              </MaybeLink>
            ) : (
              imgElement
            )}
          </div>
        );
      })}
    </div>
  );
};

export const FooterUtilityImagesSlot: YextComponentConfig<FooterUtilityImagesSlotProps> =
  {
    label: msg("components.footerUtilityImagesSlotLabel", "Utility Images"),
    fields: {
      data: {
        type: "object",
        label: msg("fields.data", "Data"),
        objectFields: {
          utilityImages: {
            type: "array",
            label: msg("fields.utilityImages", "Utility Images"),
            arrayFields: {
              image: {
                type: "image",
                label: msg("fields.image", "Image"),
              },
              linkTarget: {
                label: msg("fields.linkTarget", "Link Target"),
                type: "text",
              },
            },
            getItemSummary: (
              item: FooterUtilityImagesSlotProps["data"]["utilityImages"][number],
              index?: number
            ) => pt("utilityImage", "Utility Image") + " " + ((index ?? 0) + 1),
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
        utilityImages: [],
      },
      styles: {
        width: 60,
        aspectRatio: 1,
      },
      desktopContentAlignment: "left",
      mobileContentAlignment: "left",
    },
    render: (props) => <FooterUtilityImagesSlotInternal {...props} />,
  };
