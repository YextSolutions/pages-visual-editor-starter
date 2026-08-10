// @ts-nocheck
import { DefaultComponentProps, Fields, setDeep, Slot } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  ComplexImageType,
  ImageType,
} from "@yext/pages-components";
import {
  backgroundColors,
  ThemeColor,
  HeadingLevel,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { VisibilityWrapper } from "../atoms/visibilityWrapper";
import { msg } from "@yext/visual-editor/section-library-support";
import { getAnalyticsScopeHash } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { CTAVariant } from "../atoms/cta";
import { HeadingTextProps } from "../contentBlocks/HeadingText";
import { HoursStatusProps } from "../contentBlocks/HoursStatus";
import { ImageWrapperProps } from "../contentBlocks/image/Image";
import { CTAWrapperProps } from "../contentBlocks/CtaWrapper";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import type { YextPuckField } from "@yext/visual-editor/section-library-support";
import { TranslatableAssetImage, AssetImageType } from "@yext/visual-editor/section-library-support";
import { ClassicHero } from "./heroVariants/ClassicHero";
import { CompactHero } from "./heroVariants/CompactHero";
import { SpotlightHero } from "./heroVariants/SpotlightHero";
import { ImmersiveHero } from "./heroVariants/ImmersiveHero";
import { getRandomPlaceholderImageObject } from "@yext/visual-editor/section-library-support";
import { ComponentErrorBoundary } from "@yext/visual-editor/section-library-support";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export interface HeroData {
  backgroundImage: YextEntityField<
    ImageType | ComplexImageType | AssetImageType | TranslatableAssetImage
  >;
}

export interface HeroStyles {
  /**
   * The visual variant for the hero section.
   * @defaultValue classic
   */
  variant: "classic" | "immersive" | "spotlight" | "compact";

  /**
   * The background color for the entire section (classic and compact variants).
   * The background color for the featured content (spotlight variant).
   * @defaultValue Background Color 1
   */
  backgroundColor?: ThemeColor;

  /**
   * Image Height for the hero image with Immersive or Spotlight variant
   * Minimum height: content height + Page Section Top/Bottom Padding
   * @defaultValue 500px
   */
  imageHeight?: number;

  /**
   * Container position on desktop (spotlight and immersive variants).
   * @defaultValue left
   */
  desktopContainerPosition?: "left" | "center";

  /**
   * Content alignment for mobile viewports.
   * @defaultValue left
   */
  mobileContentAlignment?: "left" | "center";

  /**
   * Positions the image to the left or right of the hero content on desktop (classic and compact variants).
   * @defaultValue right
   */
  desktopImagePosition: "left" | "right";

  /**
   * Positions the image to the top or bottom of the hero content on mobile (classic and compact variants).
   * @defaultValue top
   */
  mobileImagePosition: "bottom" | "top";

  /**
   * Whether to show the business name.
   * @defaultValue true
   */
  showBusinessName: boolean;

  /**
   * Whether to show the geomodifier.
   * @defaultValue true
   */
  showGeomodifier: boolean;

  /**
   * Whether to show the hours status.
   * @defaultValue true
   */
  showHoursStatus: boolean;

  /**
   * If 'true', displays the entity's average review rating.
   * @defaultValue true
   */
  showAverageReview: boolean;

  /**
   * The color applied to review stars when average review is shown.
   */
  reviewStarsColor?: ThemeColor;

  /**
   * Whether to show the primary CTA.
   * @defaultValue true
   */
  showPrimaryCTA: boolean;

  /**
   * Whether to show the secondary CTA.
   * @defaultValue true
   */
  showSecondaryCTA: boolean;

  /**
   * Whether to show the hero image (classic and compact variant).
   * @defaultValue true
   */
  showImage: boolean;
}

export interface HeroSectionProps {
  /**
   * This object contains the content to be displayed by the component.
   * @propCategory Data Props
   */
  data: HeroData;

  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: HeroStyles;

  slots: {
    BusinessNameSlot: Slot;
    GeomodifierSlot: Slot;
    HoursStatusSlot: Slot;
    ImageSlot: Slot;
    PrimaryCTASlot: Slot;
    SecondaryCTASlot: Slot;
  };

  /** @internal */
  conditionalRender?: {
    hours: boolean;
  };

  /** @internal */
  analytics: {
    scope?: string;
  };

  /**
   * If 'true', the component is visible on the live page; if 'false', it's hidden.
   * @defaultValue true
   */
  liveVisibility?: boolean;
}

export type HeroVariantProps = Pick<
  HeroSectionProps,
  "data" | "styles" | "slots" | "conditionalRender"
>;

export type HeroImageProps = {
  className: string;
  styles: HeroStyles;
  slots: HeroSectionProps["slots"];
};

const heroSectionFields: YextFields<HeroSectionProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      backgroundImage: {
        type: "entityField",
        label: msg("fields.image", "Image"),
        filter: {
          types: ["type.image"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      variant: {
        type: "basicSelector",
        label: msg("fields.variant", "Variant"),
        options: [
          { label: msg("fields.options.classic", "Classic"), value: "classic" },
          {
            label: msg("fields.options.immersive", "Immersive"),
            value: "immersive",
          },
          {
            label: msg("fields.options.spotlight", "Spotlight"),
            value: "spotlight",
          },
          {
            label: msg("fields.options.compact", "Compact"),
            value: "compact",
          },
        ],
      },
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      imageHeight: {
        type: "number",
        label: msg("fields.imageHeight", "Image Height"),
        min: 0,
      },
      desktopContainerPosition: {
        label: msg(
          "fields.desktopContainerPosition",
          "Desktop Container Position"
        ),
        type: "radio",
        options: [
          {
            label: msg("fields.options.left", "Left", {
              context: "direction",
            }),
            value: "left",
          },
          {
            label: msg("fields.options.center", "Center", {
              context: "direction",
            }),
            value: "center",
          },
        ],
      },
      mobileContentAlignment: {
        label: msg("fields.mobileContentAlignment", "Mobile Content Alignment"),
        type: "radio",
        options: [
          {
            label: msg("fields.options.left", "Left", {
              context: "direction",
            }),
            value: "left",
          },
          {
            label: msg("fields.options.center", "Center", {
              context: "direction",
            }),
            value: "center",
          },
        ],
      },
      desktopImagePosition: {
        label: msg("fields.desktopImagePosition", "Desktop Image Position"),
        type: "radio",
        options: [
          {
            label: msg("fields.options.left", "Left", {
              context: "direction",
            }),
            value: "left",
          },
          {
            label: msg("fields.options.right", "Right", {
              context: "direction",
            }),
            value: "right",
          },
        ],
      },
      mobileImagePosition: {
        label: msg("fields.mobileImagePosition", "Mobile Image Position"),
        type: "radio",
        options: ThemeOptions.VERTICAL_POSITION,
      },
      showBusinessName: {
        label: msg("fields.showBusinessName", "Show Business Name"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showGeomodifier: {
        label: msg("fields.showGeomodifier", "Show Geomodifier"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showHoursStatus: {
        label: msg("fields.showHoursStatus", "Show Hours Status"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showAverageReview: {
        label: msg("fields.showAverageReview", "Show Average Review"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      reviewStarsColor: {
        type: "basicSelector",
        label: msg("fields.reviewStarsColor", "Review Stars Color"),
        options: "SITE_COLOR",
      },
      showPrimaryCTA: {
        label: msg("fields.showPrimaryCTA", "Show Primary CTA"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showSecondaryCTA: {
        label: msg("fields.showSecondaryCTA", "Show Secondary CTA"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
      showImage: {
        label: msg("fields.showImage", "Show Image"),
        type: "radio",
        options: ThemeOptions.SHOW_HIDE,
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      BusinessNameSlot: { type: "slot" },
      GeomodifierSlot: { type: "slot" },
      HoursStatusSlot: { type: "slot" },
      ImageSlot: { type: "slot" },
      PrimaryCTASlot: { type: "slot" },
      SecondaryCTASlot: { type: "slot" },
    },
    visible: false,
  },
  analytics: {
    type: "object",
    label: msg("fields.analytics", "Analytics"),
    visible: false,
    objectFields: {
      scope: {
        label: msg("fields.scope", "Scope"),
        type: "text",
      },
    },
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

export const HeroSection: YextComponentConfig<HeroSectionProps> = {
  label: msg("components.heroSection", "Hero Section"),
  fields: heroSectionFields,
  defaultProps: {
    data: {
      backgroundImage: {
        field: "",
        constantValue: {
          ...getRandomPlaceholderImageObject({ width: 640, height: 360 }),
          width: 640,
          height: 360,
        },
        constantValueEnabled: true,
      },
    },
    styles: {
      variant: "classic",
      backgroundColor: backgroundColors.background1.value,
      imageHeight: 500,
      desktopImagePosition: "right",
      desktopContainerPosition: "left",
      mobileContentAlignment: "left",
      mobileImagePosition: "bottom",
      showBusinessName: true,
      showGeomodifier: true,
      showHoursStatus: true,
      showAverageReview: true,
      showPrimaryCTA: true,
      showSecondaryCTA: true,
      showImage: true,
    },
    slots: {
      BusinessNameSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "Business Name" },
                constantValueEnabled: true,
                field: "",
              },
            },
            styles: { level: 3, align: "left" },
          } satisfies HeadingTextProps,
        },
      ],
      GeomodifierSlot: [
        {
          type: "HeadingTextSlot",
          props: {
            data: {
              text: {
                constantValue: { defaultValue: "Geomodifier" },
                constantValueEnabled: true,
                field: "",
              },
            },
            styles: { level: 1, align: "left" },
          } satisfies HeadingTextProps,
        },
      ],
      HoursStatusSlot: [
        {
          type: "HoursStatusSlot",
          props: {
            data: {
              hours: {
                field: "hours",
                constantValue: {},
              },
            },
            styles: {
              dayOfWeekFormat: "long",
              showDayNames: true,
              showCurrentStatus: true,
            },
          } satisfies HoursStatusProps,
        },
      ],
      ImageSlot: [
        {
          type: "HeroImageSlot",
          props: {
            data: {
              image: {
                field: "",
                constantValue: {
                  ...getRandomPlaceholderImageObject({
                    width: 640,
                    height: 360,
                  }),
                  width: 640,
                  height: 360,
                },
                constantValueEnabled: true,
              },
            },
            styles: {
              aspectRatio: 1.78,
              width: 490,
            },
          } satisfies ImageWrapperProps,
        },
      ],
      PrimaryCTASlot: [
        {
          type: "CTASlot",
          props: {
            data: {
              actionType: "link",
              normalizeLink: true,
              buttonText: { defaultValue: "Button" },
              entityField: {
                field: "",
                constantValue: {
                  label: { defaultValue: "Call To Action" },
                  link: { defaultValue: "#" },
                  linkType: "URL",
                  ctaType: "textAndLink",
                },
              },
            },
            eventName: "primaryCta",
            styles: {
              variant: "primary",
              presetImage: "app-store",
            },
          } satisfies CTAWrapperProps,
        },
      ],
      SecondaryCTASlot: [
        {
          type: "CTASlot",
          props: {
            data: {
              actionType: "link",
              normalizeLink: true,
              buttonText: { defaultValue: "Button" },
              entityField: {
                field: "",
                constantValue: {
                  label: { defaultValue: "Learn More" },
                  link: { defaultValue: "#" },
                  linkType: "URL",
                  ctaType: "textAndLink",
                },
                selectedType: "textAndLink",
              },
            },
            styles: {
              variant: "secondary",
              presetImage: "app-store",
            },
            eventName: "secondaryCta",
          } satisfies CTAWrapperProps,
        },
      ],
    },
    analytics: {
      scope: "heroSection",
    },
    liveVisibility: true,
  },
  resolveData: (data, params) => {
    data = setDeep(
      data,
      "props.slots.ImageSlot[0].props.variant",
      data.props.styles.variant
    );

    const ctaClassNameFn = (variant: CTAVariant): string => {
      switch (variant) {
        case "link":
          return (
            "py-3 border-2 border-transparent w-fit " +
            (data.props.styles.mobileContentAlignment === "center"
              ? " mx-auto sm:m-0"
              : "")
          );
        default:
          return "";
      }
    };

    data = setDeep(
      data,
      "props.slots.PrimaryCTASlot[0].props.parentStyles.classNameFn",
      ctaClassNameFn
    );

    data = setDeep(
      data,
      "props.slots.SecondaryCTASlot[0].props.parentStyles.classNameFn",
      ctaClassNameFn
    );

    const geomodifierLevel =
      data.props.slots.GeomodifierSlot[0]?.props.styles.level;
    data = setDeep(
      data,
      "props.slots.BusinessNameSlot[0].props.styles.semanticLevelOverride",
      geomodifierLevel < 6 ? ((geomodifierLevel + 1) as HeadingLevel) : "span"
    );

    switch (data.props.styles.variant) {
      case "compact":
        data = setDeep(
          data,
          "props.slots.ImageSlot[0].props.className",
          themeManagerCn(
            "w-full h-full",
            data.props.styles.desktopImagePosition === "left"
              ? "mr-auto"
              : "ml-auto"
          )
        );
        break;
      case "classic":
        data = setDeep(
          data,
          "props.slots.ImageSlot[0].props.className",
          "mx-auto max-w-full md:max-w-[350px] lg:max-w-[calc(min(calc(100vw-1.5rem),var(--maxWidth-pageSection-contentWidth))-350px)] rounded-image-borderRadius"
        );
        break;
    }

    const streamDocument = params.metadata?.streamDocument;
    const locale = streamDocument?.locale;
    if (!locale || !streamDocument) {
      return { ...data };
    }

    // Check if the HoursStatusSlot has content to display
    const resolvedHours = resolveComponentData(
      data?.props?.slots?.HoursStatusSlot.map(
        (slot) => slot.props.data.hours
      )[0],
      locale,
      streamDocument
    );

    return {
      ...data,
      props: {
        ...data.props,
        conditionalRender: { hours: !!resolvedHours },
      },
    };
  },
  resolveFields: (data) => {
    let fields = heroSectionFields;

    switch (data.props.styles.variant) {
      case "compact": {
        // compact should also remove the props removed by classic
      }
      case "classic": {
        fields = updateFields(
          fields,
          [
            "data",
            "styles.objectFields.imageHeight",
            "styles.objectFields.desktopContainerPosition",
          ],
          undefined
        );

        if (!data.props.styles.showImage) {
          fields = updateFields(
            fields,
            [
              "styles.objectFields.mobileImagePosition",
              "styles.objectFields.desktopImagePosition",
            ],
            undefined
          );
        }
        break;
      }
      case "immersive": {
        fields = updateFields(
          fields,
          ["styles.objectFields.backgroundColor", "slots.ImageSlot"],
          undefined
        );
        // immersive should also remove the props removed by spotlight
      }
      case "spotlight": {
        fields = updateFields(
          fields,
          [
            "styles.objectFields.showImage",
            "styles.objectFields.mobileImagePosition",
            "styles.objectFields.desktopImagePosition",
          ],
          undefined
        );
        break;
      }
    }

    return toPuckFields(fields);
  },
  render: (props) => {
    let HeroVariant = <ClassicHero {...props} />;
    switch (props.styles.variant) {
      case "immersive":
        HeroVariant = <ImmersiveHero {...props} />;
        break;
      case "spotlight":
        HeroVariant = <SpotlightHero {...props} />;
        break;
      case "compact":
        HeroVariant = <CompactHero {...props} />;
        break;
    }

    return (
      <ComponentErrorBoundary
        isEditing={props.puck.isEditing}
        resetKeys={[props]}
      >
        <AnalyticsScopeProvider
          name={`${props.analytics?.scope ?? "heroSection"}${getAnalyticsScopeHash(props.id)}`}
        >
          <VisibilityWrapper
            liveVisibility={!!props.liveVisibility}
            isEditing={props.puck.isEditing}
          >
            {HeroVariant}
          </VisibilityWrapper>
        </AnalyticsScopeProvider>
      </ComponentErrorBoundary>
    );
  },
};

/**
 * updateFields is a resolveFields helper that can update or remove fields
 * based on a dot notation path
 * @internal
 */
export const updateFields = <T extends DefaultComponentProps>(
  obj: Record<string, any>,
  paths: (string | undefined)[],
  value: any
): YextFields<T> => {
  const newObj = { ...obj };

  for (const path of paths) {
    if (!path) {
      continue;
    }

    const keys = path.split(".");
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Create new objects along the path to ensure deep immutability
      current[key] = { ...current[key] };
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];

    if (value === undefined) {
      delete current[lastKey];
    } else {
      current[lastKey] = value;
    }
  }

  return newObj as Fields<T, YextPuckField>;
};
