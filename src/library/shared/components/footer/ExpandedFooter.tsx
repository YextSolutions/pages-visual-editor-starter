import { AnalyticsScopeProvider } from "@yext/pages-components";
import { Slot, PuckComponent, setDeep } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import {
  backgroundColors,
  ThemeColor,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { msg } from "@yext/visual-editor/section-library-support";
import { getMaxWidthOptions } from "@yext/visual-editor/section-library-support";
import { Background } from "@yext/visual-editor/section-library-support";
import { PageSection, PageSectionProps } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { defaultCopyrightMessageSlotProps } from "./CopyrightMessageSlot";
import { VisibilityWrapper } from "@yext/visual-editor/section-library-support";
import { FooterLogoSlotProps } from "./FooterLogoSlot";
import { FooterSocialLinksSlotProps } from "./FooterSocialLinksSlot";
import { FooterUtilityImagesSlotProps } from "./FooterUtilityImagesSlot";
import { FooterLinksSlotProps } from "./FooterLinksSlot";
import { FooterExpandedLinksWrapperProps } from "./FooterExpandedLinksWrapper";
import { SecondaryFooterSlotProps } from "./SecondaryFooterSlot";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const PLACEHOLDER_LOGO_IMAGE: string =
  "https://a.mktgcdn.com/p/wa83C1O1lvtxHI9cGqEdP2HILyUzbD0jvtzwWpOAJfE/196x196.jpg";

export const defaultLink = {
  linkType: "URL" as const,
  label: { defaultValue: "Footer Link" },
  link: "#",
  normalizeLink: true,
  openInNewTab: false,
};

export const defaultLinks = [
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
  { ...defaultLink },
];

export const validPatterns: Record<string, RegExp> = {
  xLink: /^https:\/\/(www\.)?(x\.com|twitter\.com)\/.+/,
  facebookLink: /^https:\/\/(www\.)?facebook\.com\/.+/,
  instagramLink: /^https:\/\/(www\.)?instagram\.com\/.+/,
  pinterestLink: /^https:\/\/(www\.)?pinterest\.com\/.+/,
  linkedInLink: /^https:\/\/(www\.)?linkedin\.com\/.+/,
  youtubeLink: /^(https:\/\/(www\.)?youtube\.com\/.+|https:\/\/youtu\.be\/.+)$/,
  tiktokLink: /^https:\/\/(www\.)?tiktok\.com\/.+/,
};

const sideContentAlignment = cva("", {
  variants: {
    desktopContentAlignment: {
      left: "md:items-start",
      center: "md:items-center",
      right: "md:items-end",
    },
    mobileContentAlignment: {
      left: "items-start",
      center: "items-center",
      right: "items-end",
    },
  },
  defaultVariants: {
    desktopContentAlignment: "left",
    mobileContentAlignment: "left",
  },
});

export interface ExpandedFooterData {
  /** Content for the primary footer bar. */
  primaryFooter: {
    /**
     * Whether to expand the footer to show additional link categories.
     * expandedFooter: false uses a single row of footerLinks.
     * expandedFooter: true uses multiple columns of expandedFooterLinks.
     */
    expandedFooter: boolean;
    /** Whether to show the logo in the primary footer. */
    showLogo: boolean;
    /** Whether to show social links in the primary footer. */
    showSocialLinks: boolean;
    /** Whether to show utility images in the primary footer. */
    showUtilityImages: boolean;
  };

  /** Content for the secondary footer bar. */
  secondaryFooter: {
    /** Whether to show the secondary footer. */
    show: boolean;
  };
}

export interface ExpandedFooterStyles {
  /** Styling for the primary footer bar. */
  primaryFooter: {
    backgroundColor?: ThemeColor;
    linksPosition: "left" | "right";
    desktopContentAlignment: "left" | "center" | "right";
    mobileContentAlignment: "left" | "center" | "right";
  };
  /** The maximum width of the footer. */
  maxWidth: PageSectionProps["maxWidth"];
}

export interface ExpandedFooterProps {
  /**
   * This object contains all the content for both footer tiers.
   * @propCategory Data Props
   */
  data: ExpandedFooterData;

  /**
   * This object contains properties for customizing the appearance of both footer tiers.
   * @propCategory Style Props
   */
  styles: ExpandedFooterStyles;

  /** @internal */
  slots: {
    LogoSlot: Slot;
    SocialLinksSlot: Slot;
    UtilityImagesSlot: Slot;
    PrimaryLinksWrapperSlot: Slot;
    ExpandedLinksWrapperSlot: Slot;
    SecondaryFooterSlot: Slot;
  };

  /** @internal */
  analytics: {
    scope?: string;
  };

  /**
   * Indicates which props should not be checked for missing translations.
   * @internal */
  ignoreLocaleWarning?: string[];
}

const expandedFooterSectionFields: YextFields<ExpandedFooterProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      primaryFooter: {
        type: "object",
        label: msg("fields.primaryFooter", "Primary Footer"),
        objectFields: {
          expandedFooter: {
            label: msg("fields.expandFooter", "Expand Footer"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          showLogo: {
            label: msg("fields.showLogo", "Show Logo"),
            type: "radio",
            options: ThemeOptions.SHOW_HIDE,
          },
          showSocialLinks: {
            label: msg("fields.showSocialLinks", "Show Social Links"),
            type: "radio",
            options: ThemeOptions.SHOW_HIDE,
          },
          showUtilityImages: {
            label: msg("fields.showUtilityImages", "Show Utility Images"),
            type: "radio",
            options: ThemeOptions.SHOW_HIDE,
          },
        },
      },
      secondaryFooter: {
        type: "object",
        label: msg("fields.secondaryFooter", "Secondary Footer"),
        objectFields: {
          show: {
            label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      primaryFooter: {
        type: "object",
        label: msg("fields.primaryFooter", "Primary Footer"),
        objectFields: {
          backgroundColor: {
            type: "basicSelector",
            label: msg("fields.backgroundColor", "Background Color"),
            options: "BACKGROUND_COLOR",
          },
          linksPosition: {
            label: msg("fields.desktopLinkPosition", "Desktop Link Position"),
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
          desktopContentAlignment: {
            label: msg(
              "fields.desktopContentAlignment",
              "Desktop Content Alignment"
            ),
            type: "radio",
            options: ThemeOptions.ALIGNMENT,
          },
          mobileContentAlignment: {
            label: msg(
              "fields.mobileContentAlignment",
              "Mobile Content Alignment"
            ),
            type: "radio",
            options: ThemeOptions.ALIGNMENT,
          },
          // Logo and utility image styles are controlled within their respective slots
        },
      },
      maxWidth: {
        type: "basicSelector",
        label: msg("fields.maxWidth", "Max Width"),
        disableSearch: true,
        optionGroups: [
          {
            description: msg(
              "maxWidthTip",
              "For optimal content alignment, we recommend setting the header and footer width to match or exceed the page content grid."
            ),
            options: getMaxWidthOptions(),
          },
        ],
      },
    },
  },
  slots: {
    type: "object",
    objectFields: {
      LogoSlot: { type: "slot" },
      SocialLinksSlot: { type: "slot" },
      UtilityImagesSlot: { type: "slot" },
      PrimaryLinksWrapperSlot: { type: "slot" },
      ExpandedLinksWrapperSlot: { type: "slot" },
      SecondaryFooterSlot: { type: "slot" },
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
};

const ExpandedFooterWrapper: PuckComponent<ExpandedFooterProps> = (props) => {
  const {
    data: {
      primaryFooter: {
        expandedFooter,
        showLogo = true,
        showSocialLinks = true,
        showUtilityImages = true,
      },
      secondaryFooter: { show: secondaryFooterVisibleOnLivePage },
    },
    styles: {
      primaryFooter: {
        linksPosition: primaryLinksAlignment,
        backgroundColor,
        desktopContentAlignment = "left",
        mobileContentAlignment = "left",
      },
      maxWidth,
    },
    slots,
    puck,
  } = props;

  const shouldRenderSideContent =
    showLogo || showSocialLinks || showUtilityImages;
  const shouldRenderMobileBottomContent = showSocialLinks || showUtilityImages;
  const linksDesktopOrderClass =
    primaryLinksAlignment === "left" ? "lg:order-1" : "lg:order-2";
  const sideContentDesktopOrderClass =
    primaryLinksAlignment === "left" ? "lg:order-2" : "lg:order-1";
  const contentAlignmentClasses = sideContentAlignment({
    desktopContentAlignment,
    mobileContentAlignment,
  });

  return (
    <Background className="mt-auto" ref={puck.dragRef} as="footer">
      {/* Primary footer section. */}
      <PageSection
        verticalPadding="footer"
        background={backgroundColor}
        maxWidth={maxWidth}
        className="flex flex-col lg:flex-row lg:justify-start w-full lg:items-start gap-6 md:gap-8"
      >
        {showLogo && (
          <div
            className={themeManagerCn(
              "order-1 md:hidden flex flex-col gap-6 md:gap-6",
              contentAlignmentClasses
            )}
          >
            <slots.LogoSlot
              style={{ height: "auto", maxWidth: "max-content" }}
              allow={[]}
            />
          </div>
        )}
        {shouldRenderSideContent && (
          <div
            className={themeManagerCn(
              "hidden md:flex flex-col",
              sideContentDesktopOrderClass,
              contentAlignmentClasses
            )}
          >
            {showLogo && (
              <slots.LogoSlot
                style={{ height: "auto", maxWidth: "max-content" }}
                allow={[]}
              />
            )}
            {showSocialLinks && (
              <slots.SocialLinksSlot
                className="mt-6 first:mt-0 empty:mt-0"
                style={{
                  height: "auto",
                  maxWidth: "max-content",
                }}
                allow={[]}
              />
            )}
            {showUtilityImages && (
              <slots.UtilityImagesSlot
                className="mt-6 first:mt-0 empty:mt-0"
                style={{
                  height: "auto",
                  maxWidth: "max-content",
                }}
                allow={[]}
              />
            )}
          </div>
        )}
        <div
          className={themeManagerCn("order-2 flex-1", linksDesktopOrderClass)}
        >
          {expandedFooter ? (
            <slots.ExpandedLinksWrapperSlot
              style={{ height: "auto", flex: 1 }}
              allow={[]}
            />
          ) : (
            <slots.PrimaryLinksWrapperSlot
              style={{ height: "auto", flex: 1 }}
              allow={[]}
            />
          )}
        </div>
        {shouldRenderMobileBottomContent && (
          <div
            className={themeManagerCn(
              "order-3 md:hidden flex flex-col",
              contentAlignmentClasses
            )}
          >
            {showSocialLinks && (
              <slots.SocialLinksSlot
                className="mt-6 empty:mt-0"
                style={{ height: "auto", maxWidth: "max-content" }}
                allow={[]}
              />
            )}
            {showUtilityImages && (
              <slots.UtilityImagesSlot
                className="mt-6 empty:mt-0"
                style={{ height: "auto", maxWidth: "max-content" }}
                allow={[]}
              />
            )}
          </div>
        )}
      </PageSection>
      {/* Secondary footer section */}
      <VisibilityWrapper
        liveVisibility={secondaryFooterVisibleOnLivePage}
        isEditing={puck.isEditing}
      >
        <slots.SecondaryFooterSlot style={{ height: "auto" }} allow={[]} />
      </VisibilityWrapper>
    </Background>
  );
};

/**
 * The Expanded Footer is a comprehensive, two-tiered site-wide component for large websites.
 * It includes a primary footer area for a logo, social media links, and utility images, and features two distinct layouts: a standard link list or an "expanded" multi-column mega-footer.
 * It also includes an optional secondary sub-footer for copyright notices and legal links.
 */
export const ExpandedFooter: YextComponentConfig<ExpandedFooterProps> = {
  label: msg("components.expandedFooter", "Expanded Footer"),
  fields: expandedFooterSectionFields,
  defaultProps: {
    data: {
      primaryFooter: {
        expandedFooter: false,
        showLogo: true,
        showSocialLinks: true,
        showUtilityImages: true,
      },
      secondaryFooter: {
        show: true,
      },
    },
    slots: {
      LogoSlot: [
        {
          type: "FooterLogoSlot",
          props: {
            data: {
              image: {
                field: "",
                constantValue: {
                  url: PLACEHOLDER_LOGO_IMAGE,
                  height: 100,
                  width: 100,
                  alternateText: { defaultValue: "Logo" },
                },
                constantValueEnabled: true,
              },
            },
            styles: {
              imageFillType: "fill",
              width: 100,
              aspectRatio: 1,
            },
          } satisfies FooterLogoSlotProps,
        },
      ],
      SocialLinksSlot: [
        {
          type: "FooterSocialLinksSlot",
          props: {
            data: {
              xLink: "",
              facebookLink: "",
              instagramLink: "",
              linkedInLink: "",
              pinterestLink: "",
              tiktokLink: "",
              youtubeLink: "",
            },
          } satisfies FooterSocialLinksSlotProps,
        },
      ],
      UtilityImagesSlot: [
        {
          type: "FooterUtilityImagesSlot",
          props: {
            data: {
              utilityImages: [],
            },
            styles: {
              imageFillType: "fill",
              width: 0,
              aspectRatio: 1,
            },
            desktopContentAlignment: "left",
            mobileContentAlignment: "left",
          } satisfies FooterUtilityImagesSlotProps,
        },
      ],
      PrimaryLinksWrapperSlot: [
        {
          type: "FooterLinksSlot",
          props: {
            data: {
              links: defaultLinks,
            },
            variant: "primary",
            eventNamePrefix: "primary",
            desktopContentAlignment: "left",
            mobileContentAlignment: "left",
          } satisfies FooterLinksSlotProps,
        },
      ],
      ExpandedLinksWrapperSlot: [
        {
          type: "FooterExpandedLinksWrapper",
          props: {
            data: {
              sections: [
                {
                  label: { defaultValue: "Footer Label" },
                  links: defaultLinks,
                },
                {
                  label: { defaultValue: "Footer Label" },
                  links: defaultLinks,
                },
                {
                  label: { defaultValue: "Footer Label" },
                  links: defaultLinks,
                },
                {
                  label: { defaultValue: "Footer Label" },
                  links: defaultLinks,
                },
              ],
            },
            desktopContentAlignment: "left",
            mobileContentAlignment: "left",
          } satisfies FooterExpandedLinksWrapperProps,
        },
      ],
      SecondaryFooterSlot: [
        {
          type: "SecondaryFooterSlot",
          props: {
            styles: {
              backgroundColor: backgroundColors.background2.value,
              desktopContentAlignment: "left",
              mobileContentAlignment: "left",
              showLinks: true,
            },
            maxWidth: "theme",
            slots: {
              SecondaryLinksWrapperSlot: [
                {
                  type: "FooterLinksSlot",
                  props: {
                    data: {
                      links: defaultLinks,
                    },
                    variant: "secondary",
                    eventNamePrefix: "secondary",
                    desktopContentAlignment: "left",
                    mobileContentAlignment: "left",
                  },
                },
              ],
              CopyrightSlot: [
                {
                  type: "CopyrightMessageSlot",
                  props: defaultCopyrightMessageSlotProps,
                },
              ],
            },
          } satisfies SecondaryFooterSlotProps,
        },
      ],
    },
    styles: {
      primaryFooter: {
        backgroundColor: backgroundColors.background6.value,
        linksPosition: "right",
        desktopContentAlignment: "left",
        mobileContentAlignment: "left",
      },
      maxWidth: "theme",
    },
    analytics: {
      scope: "expandedFooter",
    },
  },
  resolveData: async (data) => {
    let updatedData = { ...data };
    const hiddenProps: string[] = [];

    // Track hidden fields based on expandedFooter toggle
    if (data.props.data.primaryFooter.expandedFooter) {
      hiddenProps.push("slots.PrimaryLinksWrapperSlot");
    } else {
      hiddenProps.push("slots.ExpandedLinksWrapperSlot");
    }

    if (data.props.data.primaryFooter.showLogo === false) {
      hiddenProps.push("slots.LogoSlot");
    }
    if (data.props.data.primaryFooter.showSocialLinks === false) {
      hiddenProps.push("slots.SocialLinksSlot");
    }
    if (data.props.data.primaryFooter.showUtilityImages === false) {
      hiddenProps.push("slots.UtilityImagesSlot");
    }

    // Check if secondary footer is hidden
    if (data.props.data.secondaryFooter.show === false) {
      hiddenProps.push("slots.SecondaryFooterSlot");
    }

    // Pass maxWidth to SecondaryFooterSlot
    if (updatedData.props.slots?.PrimaryLinksWrapperSlot?.[0]?.props) {
      updatedData = setDeep(
        updatedData,
        "props.slots.PrimaryLinksWrapperSlot[0].props.desktopContentAlignment",
        updatedData.props.styles.primaryFooter.desktopContentAlignment
      );
      updatedData = setDeep(
        updatedData,
        "props.slots.PrimaryLinksWrapperSlot[0].props.mobileContentAlignment",
        updatedData.props.styles.primaryFooter.mobileContentAlignment
      );
    }

    if (updatedData.props.slots?.ExpandedLinksWrapperSlot?.[0]?.props) {
      updatedData = setDeep(
        updatedData,
        "props.slots.ExpandedLinksWrapperSlot[0].props.desktopContentAlignment",
        updatedData.props.styles.primaryFooter.desktopContentAlignment
      );
      updatedData = setDeep(
        updatedData,
        "props.slots.ExpandedLinksWrapperSlot[0].props.mobileContentAlignment",
        updatedData.props.styles.primaryFooter.mobileContentAlignment
      );
    }

    if (updatedData.props.slots?.UtilityImagesSlot?.[0]?.props) {
      updatedData = setDeep(
        updatedData,
        "props.slots.UtilityImagesSlot[0].props.desktopContentAlignment",
        updatedData.props.styles.primaryFooter.desktopContentAlignment
      );
      updatedData = setDeep(
        updatedData,
        "props.slots.UtilityImagesSlot[0].props.mobileContentAlignment",
        updatedData.props.styles.primaryFooter.mobileContentAlignment
      );
    }

    if (
      updatedData?.props?.slots?.SecondaryFooterSlot &&
      Array.isArray(updatedData.props.slots.SecondaryFooterSlot)
    ) {
      updatedData.props.slots.SecondaryFooterSlot =
        updatedData.props.slots.SecondaryFooterSlot.map((slot: any) => ({
          ...slot,
          props: {
            ...slot.props,
            maxWidth: updatedData.props.styles.maxWidth || "theme",
          },
        }));
    }

    return {
      ...updatedData,
      props: {
        ...updatedData.props,
        ignoreLocaleWarning: hiddenProps,
      },
    };
  },
  inline: true,
  render: (props) => (
    <AnalyticsScopeProvider name={props.analytics?.scope ?? "expandedFooter"}>
      <ExpandedFooterWrapper {...props} />
    </AnalyticsScopeProvider>
  ),
};
