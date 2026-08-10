import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  AnalyticsScopeProvider,
  Link,
  type ComplexImageType,
  type ImageType,
  type LinkType,
  useAnalytics,
} from "@yext/pages-components";
import {
  ComprehensiveCTA,
  type ComprehensiveCTAValue,
  EntityField,
  Image,
  type StreamDocument,
  type StyledButtonValue,
  type StyledImageValue,
  type StyledLinkValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  getAnalyticsScopeHash,
  i18nComponentsInstance,
  isDarkColor,
  normalizeLink,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";

type SharedHeaderVariant =
  | "centerLogoSplitNav"
  | "logoLeftInlineNav"
  | "stackedNavBelow"
  | "utilityTopRow";

type SharedHeaderLink = {
  label: TranslatableString;
  link: TranslatableString;
  linkType: LinkType;
  normalizeLink: boolean;
  openInNewTab: boolean;
};

type SharedHeaderAction = SharedHeaderLink & {
  iconImage: {
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
};

type YextCafeAndCoffeeShopHeaderProps = {
  variant: SharedHeaderVariant;
  section: {
    backgroundColor: ThemeColor;
    dividerColor?: ThemeColor;
    visibleOnLivePage: boolean;
  };
  navigation: {
    show: boolean;
    links: SharedHeaderLink[];
    fontColor?: ThemeColor;
    styles: StyledLinkValue;
  };
  utilities: {
    show: boolean;
    items: SharedHeaderAction[];
  };
  cta: {
    show: boolean;
    items: Array<{
      cta: ComprehensiveCTAValue;
    }>;
  };
  logoImage: {
    show: boolean;
    image: YextEntityField<
      ImageType | ComplexImageType | TranslatableAssetImage
    >;
    url: YextEntityField<TranslatableString>;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
};

const linkTypeOptions: Array<{ label: string; value: LinkType }> = [
  { label: "URL", value: "URL" },
  { label: "Phone", value: "PHONE" },
  { label: "Email", value: "EMAIL" },
];

const defaultPrimaryCtaColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const defaultLinkStyles: StyledLinkValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  includeCaret: "default",
};

const defaultButtonStyles: StyledButtonValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  letterSpacing: "default",
  borderRadius: "default",
};

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const defaultUtilityIconImage: SharedHeaderAction["iconImage"] = {
  image: {
    field: "",
    constantValueEnabled: true,
    constantValue: {
      url: "",
      width: 0,
      height: 0,
    },
  },
  aspectRatio: 1,
  imageConstrain: "fixed",
  styles: {
    borderRadius: "default",
  },
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (
  surfaceColor: ThemeColor,
  streamDocument?: StreamDocument,
): ThemeColor => {
  return {
    selectedColor: isDarkColor(surfaceColor, streamDocument)
      ? "white"
      : "black",
    contrastingColor: surfaceColor.selectedColor,
  };
};

const resolveThemeColorCssValue = (color?: ThemeColor): string | undefined => {
  if (!hasExplicitThemeColor(color)) {
    return undefined;
  }

  const customColorMatch = color.selectedColor.match(
    /^\[(#[0-9A-Fa-f]{3,8})\]$/,
  );
  if (customColorMatch) {
    return customColorMatch[1].toUpperCase();
  }

  switch (color.selectedColor) {
    case "palette-primary":
      return "var(--colors-palette-primary)";
    case "palette-secondary":
      return "var(--colors-palette-secondary)";
    case "palette-tertiary":
      return "var(--colors-palette-tertiary)";
    case "palette-quaternary":
      return "var(--colors-palette-quaternary)";
    case "palette-primary-light":
      return "hsl(from var(--colors-palette-primary) h s 98)";
    case "palette-secondary-light":
      return "hsl(from var(--colors-palette-secondary) h s 98)";
    case "palette-tertiary-light":
      return "hsl(from var(--colors-palette-tertiary) h s 98)";
    case "palette-quaternary-light":
      return "hsl(from var(--colors-palette-quaternary) h s 98)";
    case "palette-primary-dark":
      return "hsl(from var(--colors-palette-primary) h s 20)";
    case "palette-secondary-dark":
      return "hsl(from var(--colors-palette-secondary) h s 20)";
    case "white":
      return "#FFFFFF";
    default:
      return color.selectedColor;
  }
};

const resolveBorderRadius = (value?: string): string | undefined => {
  if (!value || value === "default") {
    return undefined;
  }

  return value;
};

const getTextStyles = ({
  color,
  styles,
}: {
  color?: ThemeColor;
  styles: Pick<
    StyledLinkValue,
    | "fontFamily"
    | "fontSize"
    | "fontWeight"
    | "fontStyle"
    | "textTransform"
    | "letterSpacing"
  >;
}): React.CSSProperties => {
  return {
    color: resolveThemeColorCssValue(color),
    fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
    fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
    fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
    fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
    textTransform:
      styles.textTransform === "default" ? undefined : styles.textTransform,
    letterSpacing:
      styles.letterSpacing === "default" ? undefined : styles.letterSpacing,
  };
};

const getTranslatableSummary = (
  value: TranslatableString | undefined,
  fallback: string,
): string => {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value;
  }

  return (
    resolveComponentData(value, i18nComponentsInstance.language, undefined) ||
    value.defaultValue ||
    fallback
  );
};

const resolveString = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument,
): string => {
  if (!value) {
    return "";
  }

  return resolveComponentData(value, locale, streamDocument) || "";
};

const normalizeResolvedLink = ({
  link,
  linkType,
  shouldNormalize,
}: {
  link: string;
  linkType: LinkType;
  shouldNormalize: boolean;
}): string => {
  if (!shouldNormalize) {
    return link;
  }

  return normalizeLink(link, linkType);
};

const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): boolean => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string" && image.url.trim()) {
    return true;
  }

  if (
    "image" in image &&
    image.image &&
    typeof image.image === "object" &&
    "url" in image.image &&
    typeof image.image.url === "string" &&
    image.image.url.trim()
  ) {
    return true;
  }

  return false;
};

const SharedHeaderDefaultUtilityIcon = () => (
  <svg
    fill="none"
    height="32"
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m11.75 9h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-.9656 0-1.75.7844-1.75 1.75v.25c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-.25c0-1.5187 1.2313-2.75 2.75-2.75zm-2.25 5c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm13 0c.275 0 .5.225.5.5v3c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-3c0-.275.225-.5.5-.5zm0-1.5c-.275 0-.5-.225-.5-.5v-.25c0-.9656-.7844-1.75-1.75-1.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c1.5188 0 2.75 1.2313 2.75 2.75v.25c0 .275-.225.5-.5.5zm.5 7.5v.25c0 1.5188-1.2312 2.75-2.75 2.75h-.25c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h.25c.9656 0 1.75-.7844 1.75-1.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm-13 0v.25c0 .9656.7844 1.75 1.75 1.75h.25c.275 0 .5.225.5.5s-.225.5-.5.5h-.25c-1.5187 0-2.75-1.2312-2.75-2.75v-.25c0-.275.225-.5.5-.5s.5.225.5.5zm4.5 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5zm-.5-13.5c0-.275.225-.5.5-.5h3c.275 0 .5.225.5.5s-.225.5-.5.5h-3c-.275 0-.5-.225-.5-.5z"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

const YextCafeAndCoffeeShopHeaderFields: YextFields<YextCafeAndCoffeeShopHeaderProps> =
  {
    variant: {
      label: "Variant",
      type: "select",
      options: [
        { label: "Centered Logo Split Nav", value: "centerLogoSplitNav" },
        { label: "Logo Left Inline Nav", value: "logoLeftInlineNav" },
        { label: "Stacked Nav Below", value: "stackedNavBelow" },
        { label: "Utility Top Row", value: "utilityTopRow" },
      ],
    },
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        dividerColor: {
          label: "Divider Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        visibleOnLivePage: {
          label: "Visible on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    navigation: {
      label: "Navigation",
      type: "object",
      objectFields: {
        show: {
          label: "Show on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        links: {
          label: "Links",
          type: "array",
          arrayFields: {
            label: {
              label: "Label",
              type: "translatableString",
            },
            link: {
              label: "Link",
              type: "translatableString",
            },
            linkType: {
              label: "Link Type",
              type: "select",
              options: linkTypeOptions,
            },
            normalizeLink: {
              label: "Normalize Link",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            openInNewTab: {
              label: "Open in New Tab",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
          },
          defaultItemProps: (index: number) => ({
            label: `Link ${index + 1}`,
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          }),
          getItemSummary: (item: SharedHeaderLink, index?: number) =>
            getTranslatableSummary(item.label, `Link ${index ?? 0}`),
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
        styles: {
          label: "Link Styles",
          type: "styledLink",
          showIncludeCaretField: false,
        },
      },
    },
    utilities: {
      label: "Utility Icons",
      type: "object",
      objectFields: {
        show: {
          label: "Show on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            iconImage: {
              label: "Icon Image",
              type: "object",
              objectFields: {
                image: {
                  type: "entityField",
                  label: "Image",
                  filter: {
                    types: ["type.image"],
                  },
                },
                aspectRatio: {
                  label: "Aspect Ratio",
                  type: "number",
                },
                imageConstrain: {
                  label: "Image Constrain",
                  type: "select",
                  options: [
                    { label: "Fixed", value: "fixed" },
                    { label: "Filled", value: "filled" },
                  ],
                },
                styles: {
                  label: "Image Styles",
                  type: "styledImage",
                },
              },
            },
            label: {
              label: "Label",
              type: "translatableString",
            },
            link: {
              label: "Link",
              type: "translatableString",
            },
            linkType: {
              label: "Link Type",
              type: "select",
              options: linkTypeOptions,
            },
            normalizeLink: {
              label: "Normalize Link",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            openInNewTab: {
              label: "Open in New Tab",
              type: "radio",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
          },
          defaultItemProps: (index: number) => ({
            iconImage: defaultUtilityIconImage,
            label: `Item ${index + 1}`,
            link: "#",
            linkType: "URL",
            normalizeLink: false,
            openInNewTab: false,
          }),
          getItemSummary: (item: SharedHeaderAction, index?: number) =>
            getTranslatableSummary(item.label, `Action ${index ?? 0}`),
        },
      },
    },
    cta: {
      label: "Call to Actions",
      type: "object",
      objectFields: {
        show: {
          label: "Show on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            cta: {
              label: "CTA",
              type: "comprehensiveCTA",
            },
          },
          defaultItemProps: {
            cta: {
              data: {
                actionType: "link",
                cta: {
                  field: "",
                  constantValueEnabled: true,
                  constantValue: {
                    ctaType: "textAndLink",
                    label: { defaultValue: "CTA Label" },
                    link: { defaultValue: "#" },
                    linkType: "URL",
                  },
                  selectedType: "textAndLink",
                },
                openInNewTab: false,
                buttonText: { defaultValue: "Button" },
                customId: "",
                customClass: "",
                dataAttributes: [],
                ariaLabel: { defaultValue: "CTA Label" },
              },
              styles: {
                variant: "primary",
                color: defaultPrimaryCtaColor,
                button: defaultButtonStyles,
                link: defaultLinkStyles,
              },
            },
          },
          getItemSummary: (
            item: { cta?: ComprehensiveCTAValue },
            index?: number,
          ) =>
            getTranslatableSummary(
              item.cta?.data?.cta?.constantValue?.label,
              `CTA ${index ?? 0}`,
            ),
        },
      },
    },
    logoImage: {
      label: "Logo Image",
      type: "object",
      objectFields: {
        show: {
          label: "Show on Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        url: {
          label: "URL",
          type: "entityField",
          filter: {
            types: ["type.string"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "number",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
  };

const YextCafeAndCoffeeShopHeaderComponent: PuckComponent<
  YextCafeAndCoffeeShopHeaderProps
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument.locale ?? "en";
  const [menuOpen, setMenuOpen] = React.useState(false);

  const resolvedLogoImage = resolveComponentData(
    props.logoImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const resolvedLogoUrl = (
    resolveComponentData(props.logoImage.url, locale, streamDocument) || ""
  )
    .toString()
    .trim();
  const logoUrl = resolvedLogoUrl
    ? normalizeLink(resolvedLogoUrl, "URL")
    : undefined;

  const showNavigation = props.navigation.show;
  const showUtilities = props.utilities.show;
  const showCta = props.cta.show;
  const showLogo = props.logoImage.show;

  const navigationColor: ThemeColor =
    (hasExplicitThemeColor(props.navigation.fontColor)
      ? props.navigation.fontColor
      : undefined) ??
    getReadableForegroundColor(props.section.backgroundColor, streamDocument);
  const dividerColorValue = resolveThemeColorCssValue(
    props.section.dividerColor,
  );
  const dividerStyle = dividerColorValue
    ? ({ borderColor: dividerColorValue } as React.CSSProperties)
    : undefined;

  const navigationTextStyles = getTextStyles({
    color: navigationColor,
    styles: props.navigation.styles,
  });

  const logoWrapperStyle: React.CSSProperties = {
    height: "50px",
    width:
      props.logoImage.aspectRatio > 0
        ? `${50 * props.logoImage.aspectRatio}px`
        : "50px",
    borderRadius: resolveBorderRadius(props.logoImage.styles?.borderRadius),
    overflow: "hidden",
  };

  const logoStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: props.logoImage.aspectRatio > 0 ? "cover" : "contain",
  };

  const navigationLinks = (props.navigation.links ?? [])
    .map((item, index) => {
      const label = resolveString(item.label, locale, streamDocument);
      const resolvedLink = resolveString(item.link, locale, streamDocument);
      const link = normalizeResolvedLink({
        link: resolvedLink,
        linkType: item.linkType,
        shouldNormalize: item.normalizeLink,
      });

      return {
        eventName: `headerLink${index}`,
        label,
        link,
        linkType: item.linkType,
        openInNewTab: item.openInNewTab,
      };
    })
    .filter((item) => Boolean(item.label) && Boolean(item.link));

  const utilityLinks = (props.utilities.items ?? [])
    .map((item, index) => {
      const label = resolveString(item.label, locale, streamDocument);
      const resolvedLink = resolveString(item.link, locale, streamDocument);
      const link = normalizeResolvedLink({
        link: resolvedLink,
        linkType: item.linkType,
        shouldNormalize: item.normalizeLink,
      });
      const resolvedIconImage = resolveComponentData(
        item.iconImage.image,
        locale,
        streamDocument,
      ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;

      return {
        eventName: `headerUtility${index}`,
        iconImage: resolvedIconImage,
        iconImageProps: item.iconImage,
        label,
        link,
        linkType: item.linkType,
        openInNewTab: item.openInNewTab,
      };
    })
    .filter((item) => Boolean(item.label) && Boolean(item.link));

  const ctaItems = props.cta.items ?? [];
  const topBarCtaItem = ctaItems[0];
  const drawerCtaItems = topBarCtaItem ? ctaItems.slice(1) : ctaItems;
  const mobileDrawerCtaItems = ctaItems;

  const renderUtilityIcon = ({
    iconImage,
    iconImageProps,
  }: {
    iconImage?: ImageType | ComplexImageType | TranslatableAssetImage;
    iconImageProps: SharedHeaderAction["iconImage"];
  }) => {
    if (!hasImageSource(iconImage)) {
      return (
        <EntityField
          displayName="Utility Icon"
          fieldId={iconImageProps.image.field}
          constantValueEnabled={iconImageProps.image.constantValueEnabled}
        >
          <SharedHeaderDefaultUtilityIcon />
        </EntityField>
      );
    }

    const resolvedIconImage = iconImage as
      ImageType | ComplexImageType | TranslatableAssetImage;
    const iconHeight = 32;
    const iconAspectRatio =
      iconImageProps.aspectRatio > 0 ? iconImageProps.aspectRatio : 1;
    const iconUrl =
      "image" in resolvedIconImage
        ? typeof resolvedIconImage.image?.url === "string"
          ? resolvedIconImage.image.url
          : undefined
        : typeof resolvedIconImage.url === "string"
          ? resolvedIconImage.url
          : undefined;
    if (!iconUrl) {
      return (
        <EntityField
          displayName="Utility Icon"
          fieldId={iconImageProps.image.field}
          constantValueEnabled={iconImageProps.image.constantValueEnabled}
        >
          <SharedHeaderDefaultUtilityIcon />
        </EntityField>
      );
    }
    const wrapperStyle: React.CSSProperties = {
      width: `${iconHeight * iconAspectRatio}px`,
      height: `${iconHeight}px`,
      borderRadius: resolveBorderRadius(iconImageProps.styles?.borderRadius),
      overflow: "hidden",
      flexShrink: 0,
    };

    const imageStyle: React.CSSProperties = {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };

    return (
      <EntityField
        displayName="Utility Icon"
        fieldId={iconImageProps.image.field}
        constantValueEnabled={iconImageProps.image.constantValueEnabled}
      >
        <div style={wrapperStyle}>
          <img
            alt=""
            src={iconUrl}
            className="h-full w-full"
            style={imageStyle}
          />
        </div>
      </EntityField>
    );
  };

  const desktopSharedRightSide = (
    <div className="flex items-center justify-end gap-3">
      {showUtilities && utilityLinks.length > 0 ? (
        <div className="flex items-center gap-2">
          {utilityLinks.map((item) => (
            <Link
              key={`${item.eventName}-${item.link}`}
              cta={{
                link: item.link,
                linkType: item.linkType,
              }}
              eventName={item.eventName}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{
                color: resolveThemeColorCssValue(navigationColor),
              }}
            >
              <span className="flex h-full items-center justify-center">
                {renderUtilityIcon({
                  iconImage: item.iconImage,
                  iconImageProps: item.iconImageProps,
                })}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
      {showCta ? (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {ctaItems.map((item, index) => (
            <EntityField
              key={`desktop-cta-${index}`}
              displayName={`Header Call to Action ${index + 1}`}
              fieldId={item.cta.data.cta.field}
              constantValueEnabled={item.cta.data.cta.constantValueEnabled}
            >
              <ComprehensiveCTA
                value={item.cta as Partial<ComprehensiveCTAValue>}
                eventName={`headerCta${index}`}
                className="inline-flex h-10 items-center justify-center px-5 transition-opacity hover:opacity-90"
              />
            </EntityField>
          ))}
        </div>
      ) : null}
    </div>
  );

  const renderNavigationLinks = (orientation: "row" | "column") => (
    <nav aria-label="Primary navigation">
      <ul
        className={
          orientation === "row"
            ? "flex flex-wrap items-center gap-6"
            : "flex flex-col gap-5"
        }
      >
        {showNavigation
          ? navigationLinks.map((item) => (
              <li key={`${item.eventName}-${item.link}`}>
                <Link
                  cta={{
                    link: item.link,
                    linkType: item.linkType,
                  }}
                  eventName={item.eventName}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={navigationTextStyles}
                >
                  <span>{item.label}</span>
                </Link>
              </li>
            ))
          : null}
      </ul>
    </nav>
  );

  const renderLogo = () => {
    if (!showLogo || !hasImageSource(resolvedLogoImage)) {
      return null;
    }

    const logoImage = resolvedLogoImage as
      ImageType | ComplexImageType | TranslatableAssetImage;

    const logoImageContent = (
      <div style={logoWrapperStyle}>
        <Image image={logoImage} className="h-full w-full" style={logoStyle} />
      </div>
    );
    const logoContent = (
      <EntityField
        displayName="Logo Image"
        fieldId={props.logoImage.image.field}
        constantValueEnabled={props.logoImage.image.constantValueEnabled}
      >
        {logoImageContent}
      </EntityField>
    );

    return logoUrl ? (
      <Link
        cta={{
          link: logoUrl,
          linkType: "URL",
        }}
        eventName="headerLogo"
        className="inline-flex transition-opacity hover:opacity-80"
        aria-label="Logo"
      >
        {logoContent}
      </Link>
    ) : (
      logoContent
    );
  };

  const desktopVariantContent = (() => {
    if (props.variant === "centerLogoSplitNav") {
      return (
        <div className="grid min-h-[82px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-8 px-12 py-4">
          <div className="flex items-center justify-start">
            {renderNavigationLinks("row")}
          </div>
          <div className="flex items-center justify-center">{renderLogo()}</div>
          <div>{desktopSharedRightSide}</div>
        </div>
      );
    }

    if (props.variant === "logoLeftInlineNav") {
      return (
        <div className="flex min-h-[82px] items-center gap-8 px-12 py-4">
          <div className="shrink-0">{renderLogo()}</div>
          <div className="min-w-0 flex-1">{renderNavigationLinks("row")}</div>
          <div className="min-w-0 w-full max-w-[calc((100%-theme(spacing.32))/2)]">
            {desktopSharedRightSide}
          </div>
        </div>
      );
    }

    if (props.variant === "stackedNavBelow") {
      return (
        <div className="py-4">
          <div className="flex items-center justify-between gap-8 pb-4">
            <div className="shrink-0 px-12">{renderLogo()}</div>
            <div className="min-w-0 w-full max-w-[calc((100%-theme(spacing.16))/2)] px-12">
              {desktopSharedRightSide}
            </div>
          </div>
          <div className="border-t border-current/10 pt-4" style={dividerStyle}>
            <div className="px-12">{renderNavigationLinks("row")}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-5">
        <div className="flex items-center justify-end pb-4">
          <div className="ml-auto min-w-0 w-full max-w-[calc((100%-theme(spacing.16))/2)] px-12">
            {desktopSharedRightSide}
          </div>
        </div>
        <div
          className="flex min-h-[82px] items-center gap-8 border-t border-current/10 px-12"
          style={dividerStyle}
        >
          <div className="shrink-0">{renderLogo()}</div>
          <div className="min-w-0 flex-1">{renderNavigationLinks("row")}</div>
          {showCta ? null : <div className="w-10" />}
        </div>
      </div>
    );
  })();

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <header
        className="relative"
        style={{
          backgroundColor: resolveThemeColorCssValue(
            props.section.backgroundColor,
          ),
          color: resolveThemeColorCssValue(navigationColor),
        }}
      >
        <div className="hidden lg:block">{desktopVariantContent}</div>

        <div className="flex min-h-[82px] items-center gap-4 px-6 md:px-8 lg:hidden">
          <div className="min-w-0 flex-1">{renderLogo()}</div>
          {showCta && topBarCtaItem ? (
            <div className="hidden items-center gap-3 md:flex">
              <EntityField
                displayName="Header Call to Action 1"
                fieldId={topBarCtaItem.cta.data.cta.field}
                constantValueEnabled={
                  topBarCtaItem.cta.data.cta.constantValueEnabled
                }
              >
                <ComprehensiveCTA
                  value={topBarCtaItem.cta as Partial<ComprehensiveCTAValue>}
                  eventName="responsiveTopBarCta"
                  className="inline-flex h-10 items-center justify-center px-5 transition-opacity hover:opacity-90"
                />
              </EntityField>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => {
              analytics?.track({
                action: menuOpen ? "COLLAPSE" : "EXPAND",
                eventName: "mobileMenuToggle",
              });
              setMenuOpen((currentValue) => !currentValue);
            }}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              color: resolveThemeColorCssValue(navigationColor),
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path d="M6 6 18 18M18 6 6 18" />
              ) : (
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <div
            className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-82px)] overflow-y-auto px-6 py-6 md:px-8 lg:hidden"
            style={{
              backgroundColor: resolveThemeColorCssValue(
                props.section.backgroundColor,
              ),
            }}
          >
            <div className="space-y-6">
              {navigationLinks.length > 0
                ? renderNavigationLinks("column")
                : null}
              {((showUtilities && utilityLinks.length > 0) ||
                drawerCtaItems.length > 0 ||
                mobileDrawerCtaItems.length > 0) && (
                <div
                  className="border-t border-current/10 pt-6"
                  style={dividerStyle}
                >
                  {drawerCtaItems.length > 0 ? (
                    <div className="hidden flex-col gap-3 md:flex">
                      {drawerCtaItems.map((item, index) => (
                        <EntityField
                          key={`tablet-cta-${index}`}
                          displayName={`Header Call to Action ${index + 2}`}
                          fieldId={item.cta.data.cta.field}
                          constantValueEnabled={
                            item.cta.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={item.cta as Partial<ComprehensiveCTAValue>}
                            eventName={`tabletOverlayCta${index}`}
                            className="inline-flex h-10 w-full items-center justify-center px-5 transition-opacity hover:opacity-90"
                          />
                        </EntityField>
                      ))}
                    </div>
                  ) : null}
                  {mobileDrawerCtaItems.length > 0 ? (
                    <div className="flex flex-col gap-3 md:hidden">
                      {mobileDrawerCtaItems.map((item, index) => (
                        <EntityField
                          key={`mobile-cta-${index}`}
                          displayName={`Header Call to Action ${index + 1}`}
                          fieldId={item.cta.data.cta.field}
                          constantValueEnabled={
                            item.cta.data.cta.constantValueEnabled
                          }
                        >
                          <ComprehensiveCTA
                            value={item.cta as Partial<ComprehensiveCTAValue>}
                            eventName={`mobileOverlayCta${index}`}
                            className="inline-flex h-10 w-full items-center justify-center px-5 transition-opacity hover:opacity-90"
                          />
                        </EntityField>
                      ))}
                    </div>
                  ) : null}
                  {showUtilities && utilityLinks.length > 0 ? (
                    <div
                      className={`flex flex-wrap items-center gap-3${
                        drawerCtaItems.length > 0 ||
                        mobileDrawerCtaItems.length > 0
                          ? " mt-6"
                          : ""
                      }`}
                    >
                      {utilityLinks.map((item) => (
                        <Link
                          key={`${item.eventName}-mobile-${item.link}`}
                          cta={{
                            link: item.link,
                            linkType: item.linkType,
                          }}
                          eventName={`${item.eventName}Mobile`}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={
                            item.openInNewTab
                              ? "noopener noreferrer"
                              : undefined
                          }
                          aria-label={item.label}
                          className="inline-flex h-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                          style={{
                            color: resolveThemeColorCssValue(navigationColor),
                          }}
                        >
                          <span className="flex h-full items-center justify-center">
                            {renderUtilityIcon({
                              iconImage: item.iconImage,
                              iconImageProps: item.iconImageProps,
                            })}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </header>
    </VisibilityWrapper>
  );
};

export const YextCafeAndCoffeeShopHeader: YextComponentConfig<YextCafeAndCoffeeShopHeaderProps> =
  {
    label: "Shared Header",
    fields: YextCafeAndCoffeeShopHeaderFields,
    defaultProps: {
      variant: "centerLogoSplitNav",
      section: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        dividerColor: undefined,
        visibleOnLivePage: true,
      },
      navigation: {
        show: true,
        links: [
          {
            label: "Link 1",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
          {
            label: "Link 2",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
          {
            label: "Link 3",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
        ],
        fontColor: {
          selectedColor: "white",
          contrastingColor: "palette-primary",
        },
        styles: defaultLinkStyles,
      },
      utilities: {
        show: true,
        items: [
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 1",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 2",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
          {
            iconImage: defaultUtilityIconImage,
            label: "Item 3",
            link: "#",
            linkType: "URL",
            normalizeLink: true,
            openInNewTab: false,
          },
        ],
      },
      cta: {
        show: true,
        items: [
          {
            cta: {
              data: {
                actionType: "link",
                cta: {
                  field: "",
                  constantValueEnabled: true,
                  constantValue: {
                    ctaType: "textAndLink",
                    label: { defaultValue: "CTA Label" },
                    link: { defaultValue: "#" },
                    linkType: "URL",
                  },
                  selectedType: "textAndLink",
                },
                openInNewTab: false,
                buttonText: { defaultValue: "Button" },
                customId: "",
                customClass: "",
                dataAttributes: [],
                ariaLabel: { defaultValue: "CTA Label" },
              },
              styles: {
                variant: "primary",
                color: {
                  selectedColor: "white",
                  contrastingColor: "palette-primary",
                },
                button: defaultButtonStyles,
                link: defaultLinkStyles,
              },
            },
          },
        ],
      },
      logoImage: {
        show: true,
        image: {
          field: "",
          constantValueEnabled: true,
          constantValue: {
            url: "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
            width: 450,
            height: 450,
            alternateText: {
              defaultValue: "Brand logo",
              hasLocalizedValue: "true",
            },
          },
        },
        url: {
          field: "",
          constantValue: {
            defaultValue: "",
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "fixed",
        styles: defaultImageStyles,
      },
    },
    render: (props) => (
      <AnalyticsScopeProvider
        name={`YextCafeAndCoffeeShopHeader${getAnalyticsScopeHash(props.id)}`}
      >
        <YextCafeAndCoffeeShopHeaderComponent {...props} />
      </AnalyticsScopeProvider>
    ),
  };
