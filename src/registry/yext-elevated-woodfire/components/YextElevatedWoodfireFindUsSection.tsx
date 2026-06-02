import * as React from "react";
import type { ComponentConfig, PuckComponent } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  Address,
  AnalyticsScopeProvider,
  HoursStatus,
  HoursTable,
  Link,
  useAnalytics,
  type AddressType,
  type ComplexImageType,
  type DayOfWeekNames,
  type HoursType,
  type ImageType,
  type StatusParams,
} from "@yext/pages-components";
import {
  Image,
  MapboxStaticMapComponent,
  MaybeRTF,
  VisibilityWrapper,
  getAggregateRating,
  getAnalyticsScopeHash,
  getDefaultRTF,
  mapboxStaticMapStyleOptions,
  mergeMeta,
  resolveComponentData,
  resolveUrlTemplate,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  type StyledButtonValue,
  type StyledImageValue,
  type StyledPageSectionValue,
  type StyledTextValue,
  type ThemeColor,
  type RichText,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor: ThemeColor;
};

type CtaProps = {
  label: string;
  link: string;
  backgroundColor: ThemeColor;
  fontColor: ThemeColor;
  styles: StyledButtonValue;
};

type LinkItemProps = {
  label: string;
  link: string;
};

type SocialLinkProps = LinkItemProps & {
  iconUrl: string;
};

type VisualImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type TextItemProps = {
  label: string;
};

type HoursStyles = {
  startOfWeek: keyof DayOfWeekNames | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: "items-start" | "items-center" | "items-end";
  showCurrentStatus: boolean;
  timeFormat: "12h" | "24h";
  dayOfWeekFormat: "short" | "long";
  showDayNames: boolean;
};

type DetailLinkProps = LinkItemProps;

type MenuItemProps = {
  label: string;
  unavailable?: boolean;
};

type FeatureItemProps = {
  title: string;
  description: StyledRtfProps;
  image: VisualImageProps;
  cta: LinkItemProps;
};

type ReviewItemProps = {
  authorName: string;
  rating?: number;
  content: string;
  reviewDate?: string;
  response?: string;
  responseDate?: string;
  avatarColor: ThemeColor;
};

type FaqItemProps = {
  question: string;
  answer: StyledRtfProps;
};

type NearbyLocationProps = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  distanceText: string;
  cta: LinkItemProps;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
  showIcon?: boolean;
  color?: ThemeColor;
};

type YextElevatedWoodfireSectionName =
  | "header"
  | "hero"
  | "details"
  | "offerings"
  | "about"
  | "featured"
  | "reviews"
  | "event"
  | "faqs"
  | "findUs"
  | "footer";

type YextElevatedWoodfireSharedProps = {
  visibleSection?: YextElevatedWoodfireSectionName | "all";
  section: {
    visibleOnLivePage: boolean;
    styles: StyledPageSectionValue;
    backgroundColor: ThemeColor;
    surfaceColor: ThemeColor;
    accentColor: ThemeColor;
    headerBackgroundColor: ThemeColor;
    footerBackgroundColor: ThemeColor;
  };
  brandName: string;
  headerLinks: LinkItemProps[];
  socialLinks: SocialLinkProps[];
  hero: {
    image: VisualImageProps;
    heading: StyledTextProps;
    description: StyledRtfProps;
    ctas: CtaProps[];
  };
  hours: YextEntityField<HoursType>;
  hoursStyles: HoursStyles;
  details: {
    heading: StyledTextProps;
    addressHeading: string;
    address: YextEntityField<AddressType>;
    showRegion: boolean;
    showCountry: boolean;
    phoneHeading: string;
    phones: PhoneFieldProps;
    otherHeading: string;
    otherDetails: TextItemProps[];
    links: DetailLinkProps[];
    hoursHeading: string;
    hoursNote: string;
  };
  offerings: {
    heading: StyledTextProps;
    image: VisualImageProps;
    items: MenuItemProps[];
  };
  about: {
    heading: StyledTextProps;
    paragraphs: StyledRtfProps[];
    image: VisualImageProps;
  };
  featuredItems: {
    heading: StyledTextProps;
    items: FeatureItemProps[];
  };
  reviews: {
    heading: StyledTextProps;
    recentHeading: string;
  };
  event: {
    image: VisualImageProps;
    heading: StyledTextProps;
    description: StyledRtfProps;
    bullets: TextItemProps[];
    cta: CtaProps;
  };
  faqs: {
    heading: StyledTextProps;
    items: FaqItemProps[];
  };
  findUs: {
    heading: StyledTextProps;
    map: {
      apiKey: string;
      coordinate: YextEntityField<{ latitude: number; longitude: number }>;
      mapStyle: string;
      zoom: number;
      height: string;
    };
    locations: NearbyLocationProps[];
  };
  footer: {
    description: StyledRtfProps;
    quickLinksHeading: string;
    quickLinks: LinkItemProps[];
    subscribeHeading: string;
    subscribeText: StyledRtfProps;
    emailPlaceholder: string;
    copyrightText: string;
    legalLinks: LinkItemProps[];
  };
};

type StreamDocumentWithReviews = {
  locale?: string;
  timezone?: string;
  additionalHoursText?: string;
  yextDisplayCoordinate?: { latitude?: number; longitude?: number };
  ref_reviewsAgg?: {
    publisher?: string;
    topReviews?: {
      authorName?: string;
      rating?: number;
      content?: string;
      reviewDate?: string;
      comments?: { content?: string; commentDate?: string }[];
    }[];
  }[];
};

const imageBaseUrl = "http://127.0.0.1:5173/YextElevatedWoodfire/assets/";

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const background1Color: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const background4Color: ThemeColor = {
  selectedColor: "palette-tertiary-light",
  contrastingColor: "black",
};

const darkBackgroundColor: ThemeColor = {
  selectedColor: "palette-primary-dark",
  contrastingColor: "white",
};

const primaryColor: ThemeColor = {
  selectedColor: "palette-primary",
  contrastingColor: "palette-primary-contrast",
};

const secondaryColor: ThemeColor = {
  selectedColor: "palette-secondary",
  contrastingColor: "palette-secondary-contrast",
};

const quaternaryColor: ThemeColor = {
  selectedColor: "palette-quaternary",
  contrastingColor: "palette-quaternary-contrast",
};

const lightTextColor: ThemeColor = {
  selectedColor: "white",
  contrastingColor: "black",
};

const starColor: ThemeColor = {
  selectedColor: "[#D89B28]",
  contrastingColor: "black",
};

const colorField = (
  label: string,
  options: "SITE_COLOR" | "BACKGROUND_COLOR",
) => ({
  label,
  type: "basicSelector" as const,
  options,
});

const themeColorTokenFallbacks: Record<string, string> = {
  "palette-primary-contrast": "#ffffff",
  "palette-secondary-contrast": "#000000",
  "palette-tertiary-contrast": "#000000",
  "palette-quaternary-contrast": "#ffffff",
};

const themeColorTokenToCss = (colorToken: string): string => {
  const derivedToken = colorToken.match(
    /^palette-(primary|secondary|tertiary|quaternary)-(light|dark)$/,
  );
  if (derivedToken) {
    return `var(--colors-${colorToken}, hsl(from var(--colors-palette-${derivedToken[1]}) h s ${derivedToken[2] === "light" ? "98%" : "20%"}))`;
  }

  return `var(--colors-${colorToken}${
    themeColorTokenFallbacks[colorToken]
      ? `, ${themeColorTokenFallbacks[colorToken]}`
      : ""
  })`;
};

const colorToCss = (color: ThemeColor | undefined): string | undefined => {
  const selectedColor = color?.selectedColor;
  if (!selectedColor) {
    return undefined;
  }

  const customColor = selectedColor.match(/^\[(.+)\]$/)?.[1];
  if (customColor) {
    return customColor;
  }

  if (selectedColor === "white" || selectedColor === "black") {
    return selectedColor;
  }

  return themeColorTokenToCss(selectedColor);
};

const contrastColorToCss = (color: ThemeColor | undefined): string =>
  colorToCss(
    color?.contrastingColor
      ? {
          selectedColor: color.contrastingColor,
          contrastingColor: color.selectedColor,
        }
      : undefined,
  ) ?? "currentColor";

const textField = (label: string) => ({
  label,
  type: "object" as const,
  objectFields: {
    text: {
      type: "entityField" as const,
      label: "Text",
      filter: {
        types: ["type.string"],
      },
    },
    styles: {
      label: "Text Styles",
      type: "styledText" as const,
    },
    fontColor: colorField("Font Color", "SITE_COLOR"),
  },
});

const rtfField = (label: string) => ({
  label,
  type: "object" as const,
  objectFields: {
    text: {
      type: "entityField" as const,
      label: "Text",
      filter: {
        types: ["type.rich_text_v2"],
      },
    },
    styles: {
      label: "Text Styles",
      type: "styledText" as const,
    },
    fontColor: colorField("Font Color", "SITE_COLOR"),
  },
});

const ctaFields = {
  label: { label: "Label", type: "text" as const },
  link: { label: "Link", type: "text" as const },
  backgroundColor: colorField("Background Color", "BACKGROUND_COLOR"),
  fontColor: colorField("Font Color", "SITE_COLOR"),
  styles: { label: "Button Styles", type: "styledButton" as const },
};

const linkArrayFields = {
  label: { label: "Label", type: "text" as const },
  link: { label: "Link", type: "text" as const },
};

const imageFields = {
  image: {
    type: "entityField" as const,
    label: "Image",
    filter: {
      types: ["type.image"],
    },
  },
  aspectRatio: { label: "Aspect Ratio", type: "number" as const },
  imageConstrain: {
    label: "Image Constrain",
    type: "select" as const,
    options: [
      { label: "Fixed", value: "fixed" },
      { label: "Filled", value: "filled" },
    ],
  },
  styles: { label: "Image Styles", type: "styledImage" as const },
};

const defaultImage = (
  url: string,
  aspectRatio: number,
  imageConstrain: VisualImageProps["imageConstrain"] = "filled",
  width = 1,
  height = 1,
): VisualImageProps => ({
  image: {
    field: "",
    constantValue: { url, width, height },
    constantValueEnabled: true,
  },
  aspectRatio,
  imageConstrain,
  styles: { borderRadius: "default" },
});

const defaultRtf = (
  defaultValue: string,
  fontColor: ThemeColor,
): StyledRtfProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue: getDefaultRTF(defaultValue),
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  styles: defaultTextStyles,
  fontColor,
});

const textStyle = (
  value: { styles: StyledTextValue; fontColor: ThemeColor },
  fallback: React.CSSProperties = {},
): React.CSSProperties => ({
  ...fallback,
  color: colorToCss(value.fontColor),
  fontFamily:
    value.styles.fontFamily === "default"
      ? fallback.fontFamily
      : value.styles.fontFamily,
  fontSize:
    value.styles.fontSize === "default"
      ? fallback.fontSize
      : value.styles.fontSize,
  fontStyle:
    value.styles.fontStyle === "default"
      ? fallback.fontStyle
      : value.styles.fontStyle,
  fontWeight:
    value.styles.fontWeight === "default"
      ? fallback.fontWeight
      : value.styles.fontWeight,
  textTransform:
    value.styles.textTransform === "default"
      ? fallback.textTransform
      : value.styles.textTransform,
});

const buttonStyle = (cta: CtaProps): React.CSSProperties => ({
  backgroundColor: colorToCss(cta.backgroundColor),
  color: colorToCss(cta.fontColor),
  borderRadius:
    cta.styles.borderRadius === "default" ? "999px" : cta.styles.borderRadius,
  fontFamily:
    cta.styles.fontFamily === "default"
      ? "var(--fontFamily-button-fontFamily)"
      : cta.styles.fontFamily,
  fontSize:
    cta.styles.fontSize === "default"
      ? "var(--fontSize-button-fontSize)"
      : cta.styles.fontSize,
  fontStyle:
    cta.styles.fontStyle === "default" ? undefined : cta.styles.fontStyle,
  fontWeight:
    cta.styles.fontWeight === "default"
      ? "var(--fontWeight-button-fontWeight)"
      : cta.styles.fontWeight,
  letterSpacing:
    cta.styles.letterSpacing === "default"
      ? "var(--letterSpacing-button-letterSpacing)"
      : cta.styles.letterSpacing,
  textTransform:
    cta.styles.textTransform === "default"
      ? "var(--textTransform-button-textTransform)"
      : cta.styles.textTransform,
});

const resolveText = (
  text: StyledTextProps,
  locale: string,
  streamDocument: StreamDocumentWithReviews,
): string => {
  const resolved = resolveComponentData(text.text, locale, streamDocument);
  if (typeof resolved === "string") {
    return resolved;
  }

  return "";
};

const isRichText = (value: unknown): value is RichText =>
  typeof value === "object" && value !== null && "html" in value;

const renderResolvedRichText = (resolvedValue: unknown): React.ReactNode => {
  if (React.isValidElement(resolvedValue)) {
    return resolvedValue;
  }

  const normalizedValue: RichText | string | undefined =
    typeof resolvedValue === "string"
      ? resolvedValue
      : isRichText(resolvedValue)
        ? resolvedValue
        : undefined;

  return <MaybeRTF data={normalizedValue} />;
};

const renderRtf = (
  text: StyledRtfProps,
  locale: string,
  streamDocument: StreamDocumentWithReviews,
  className?: string,
): React.ReactNode => (
  <div className={className} style={textStyle(text)}>
    {renderResolvedRichText(
      resolveComponentData(text.text, locale, streamDocument),
    )}
  </div>
);

const renderImage = (
  image: VisualImageProps,
  locale: string,
  streamDocument: StreamDocumentWithReviews,
  wrapperClassName: string,
  imageClassName: string,
): React.ReactNode => {
  const resolvedImage = resolveComponentData(
    image.image,
    locale,
    streamDocument,
  );
  if (!resolvedImage) {
    return null;
  }

  const borderRadius =
    image.styles?.borderRadius === "default"
      ? undefined
      : image.styles?.borderRadius;
  const wrapperStyle: React.CSSProperties = {
    aspectRatio: image.aspectRatio > 0 ? image.aspectRatio : undefined,
    borderRadius,
    overflow:
      image.imageConstrain === "filled" || borderRadius ? "hidden" : undefined,
  };
  const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: image.aspectRatio > 0 ? "100%" : "auto",
    objectFit: image.imageConstrain === "filled" ? "cover" : "contain",
  };

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      <Image
        image={resolvedImage}
        className={imageClassName}
        style={imageStyle}
      />
    </div>
  );
};

const formatPhone = (phoneNumber: string): string => {
  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumber.replace(/(?!^\+)\+|[^\d+]/g, ""),
  );
  if (!parsedPhoneNumber.valid || !parsedPhoneNumber.number) {
    return phoneNumber;
  }

  return parsedPhoneNumber.number.national || phoneNumber;
};

const formatPhoneForDisplay = (
  phoneNumber: string,
  format: PhoneFieldProps["phoneFormat"],
): string => {
  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumber.replace(/(?!^\+)\+|[^\d+]/g, ""),
  );
  if (!parsedPhoneNumber.valid || !parsedPhoneNumber.number) {
    return phoneNumber;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international || phoneNumber
    : parsedPhoneNumber.number.national || phoneNumber;
};

const isOpen24h = (params: StatusParams): boolean =>
  params.currentInterval?.is24h?.() || false;

const isIndefinitelyClosed = (params: StatusParams): boolean =>
  !params.futureInterval;

const renderCurrentStatus = (params: StatusParams): React.ReactNode => {
  if (isOpen24h(params)) {
    return <span className="fb-open-now">Open 24 Hours</span>;
  }

  if (isIndefinitelyClosed(params)) {
    return <span className="fb-open-now">Temporarily Closed</span>;
  }

  return (
    <span className="fb-open-now">{params.isOpen ? "Open Now" : "Closed"}</span>
  );
};

const formatReviewDate = (
  value: string | undefined,
  locale: string,
): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const YextElevatedWoodfireSharedFields = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      styles: { label: "Section Styles", type: "styledPageSection" },
      backgroundColor: colorField("Background Color", "BACKGROUND_COLOR"),
      surfaceColor: colorField("Surface Color", "BACKGROUND_COLOR"),
      accentColor: colorField("Accent Color", "SITE_COLOR"),
      headerBackgroundColor: colorField(
        "Header Background Color",
        "BACKGROUND_COLOR",
      ),
      footerBackgroundColor: colorField(
        "Footer Background Color",
        "BACKGROUND_COLOR",
      ),
    },
  },
  brandName: { label: "Brand Name", type: "text" },
  headerLinks: {
    label: "Header Links",
    type: "array",
    arrayFields: linkArrayFields,
    defaultItemProps: { label: "Link", link: "#" },
    getItemSummary: (item: LinkItemProps) => item.label,
  },
  socialLinks: {
    label: "Social Links",
    type: "array",
    arrayFields: {
      ...linkArrayFields,
      iconUrl: { label: "Icon URL", type: "text" },
    },
    defaultItemProps: { label: "Social", link: "#", iconUrl: "" },
    getItemSummary: (item: SocialLinkProps) => item.label,
  },
  hero: {
    label: "Hero",
    type: "object",
    objectFields: {
      image: { label: "Image", type: "object", objectFields: imageFields },
      heading: textField("Heading"),
      description: rtfField("Description"),
      ctas: {
        label: "Calls To Action",
        type: "array",
        arrayFields: ctaFields,
        defaultItemProps: {
          label: "Call To Action",
          link: "#",
          backgroundColor: primaryColor,
          fontColor: lightTextColor,
          styles: {
            fontFamily: "default",
            fontSize: "default",
            fontWeight: "default",
            fontStyle: "default",
            textTransform: "default",
            borderRadius: "default",
            letterSpacing: "default",
          },
        },
        getItemSummary: (item: CtaProps) => item.label,
      },
    },
  },
  hours: {
    type: "entityField",
    label: "Hours",
    filter: {
      types: ["type.hours"],
    },
    disableConstantValueToggle: true,
  },
  hoursStyles: {
    label: "Hours Styles",
    type: "object",
    objectFields: {
      startOfWeek: {
        label: "Start Of Week",
        type: "select",
        options: [
          { label: "Monday", value: "monday" },
          { label: "Tuesday", value: "tuesday" },
          { label: "Wednesday", value: "wednesday" },
          { label: "Thursday", value: "thursday" },
          { label: "Friday", value: "friday" },
          { label: "Saturday", value: "saturday" },
          { label: "Sunday", value: "sunday" },
          { label: "Today", value: "today" },
        ],
      },
      collapseDays: {
        label: "Collapse Days",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showAdditionalHoursText: {
        label: "Show Additional Hours Text",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      alignment: {
        label: "Alignment",
        type: "select",
        options: [
          { label: "Start", value: "items-start" },
          { label: "Center", value: "items-center" },
          { label: "End", value: "items-end" },
        ],
      },
      showCurrentStatus: {
        label: "Show Current Status",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      timeFormat: {
        label: "Time Format",
        type: "select",
        options: [
          { label: "12 Hour", value: "12h" },
          { label: "24 Hour", value: "24h" },
        ],
      },
      dayOfWeekFormat: {
        label: "Day Of Week Format",
        type: "select",
        options: [
          { label: "Short", value: "short" },
          { label: "Long", value: "long" },
        ],
      },
      showDayNames: {
        label: "Show Day Names",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  details: {
    label: "Restaurant Details",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      addressHeading: { label: "Address Heading", type: "text" },
      address: {
        type: "entityField",
        label: "Address",
        filter: {
          types: ["type.address"],
        },
      },
      showRegion: {
        label: "Show Region",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showCountry: {
        label: "Show Country",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      phoneHeading: { label: "Phone Heading", type: "text" },
      phones: {
        label: "Phones",
        type: "object",
        objectFields: {
          items: {
            label: "Items",
            type: "array",
            arrayFields: {
              number: {
                type: "entityField",
                label: "Number",
                filter: {
                  types: ["type.phone"],
                },
              },
              label: { label: "Label", type: "text" },
            },
            defaultItemProps: {
              number: {
                field: "",
                constantValue: "",
                constantValueEnabled: true,
              },
              label: "",
            },
            getItemSummary: (item: PhoneItemProps) =>
              item.label ||
              item.number.field ||
              item.number.constantValue ||
              "Phone",
          },
          phoneFormat: {
            label: "Phone Format",
            type: "radio",
            options: [
              { label: "Domestic", value: "domestic" },
              { label: "International", value: "international" },
            ],
          },
          includeHyperlink: {
            label: "Include Hyperlink",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          showIcon: {
            label: "Show Icon",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          color: colorField("Color", "SITE_COLOR"),
        },
      },
      otherHeading: { label: "Other Heading", type: "text" },
      otherDetails: {
        label: "Other Details",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
        },
        defaultItemProps: { label: "Detail" },
        getItemSummary: (item: TextItemProps) => item.label,
      },
      links: {
        label: "Links",
        type: "array",
        arrayFields: linkArrayFields,
        defaultItemProps: { label: "Link", link: "#" },
        getItemSummary: (item: DetailLinkProps) => item.label,
      },
      hoursHeading: { label: "Hours Heading", type: "text" },
      hoursNote: { label: "Hours Note", type: "text" },
    },
  },
  offerings: {
    label: "Offerings",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      image: { label: "Image", type: "object", objectFields: imageFields },
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
          unavailable: {
            label: "Unavailable",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
        },
        defaultItemProps: { label: "Offering", unavailable: false },
        getItemSummary: (item: MenuItemProps) => item.label,
      },
    },
  },
  about: {
    label: "About",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      paragraphs: {
        label: "Paragraphs",
        type: "array",
        arrayFields: rtfField("Paragraph").objectFields,
        defaultItemProps: defaultRtf("Paragraph", quaternaryColor),
        getItemSummary: () => "Paragraph",
      },
      image: { label: "Image", type: "object", objectFields: imageFields },
    },
  },
  featuredItems: {
    label: "Featured Items",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          title: { label: "Title", type: "text" },
          description: rtfField("Description"),
          image: { label: "Image", type: "object", objectFields: imageFields },
          cta: {
            label: "Call To Action",
            type: "object",
            objectFields: linkArrayFields,
          },
        },
        defaultItemProps: {
          title: "Featured Item",
          description: defaultRtf("", quaternaryColor),
          image: defaultImage("", 0),
          cta: { label: "Learn More", link: "#" },
        },
        getItemSummary: (item: FeatureItemProps) => item.title,
      },
    },
  },
  reviews: {
    label: "Reviews",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      recentHeading: { label: "Subheading", type: "text" },
    },
  },
  event: {
    label: "Event Banner",
    type: "object",
    objectFields: {
      image: { label: "Image", type: "object", objectFields: imageFields },
      heading: textField("Heading"),
      description: rtfField("Description"),
      bullets: {
        label: "Bullets",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
        },
        defaultItemProps: { label: "Bullet" },
        getItemSummary: (item: TextItemProps) => item.label,
      },
      cta: { label: "Call To Action", type: "object", objectFields: ctaFields },
    },
  },
  faqs: {
    label: "FAQs",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          question: { label: "Question", type: "text" },
          answer: rtfField("Answer"),
        },
        defaultItemProps: {
          question: "Question",
          answer: defaultRtf("Answer", quaternaryColor),
        },
        getItemSummary: (item: FaqItemProps) => item.question,
      },
    },
  },
  findUs: {
    label: "Find Us",
    type: "object",
    objectFields: {
      heading: textField("Heading"),
      map: {
        label: "Map",
        type: "object",
        objectFields: {
          apiKey: { type: "text", label: "Mapbox API Key" },
          coordinate: {
            type: "entityField",
            label: "Coordinates",
            filter: { types: ["type.coordinate"] },
          },
          mapStyle: {
            label: "Mapbox Map Style",
            type: "select",
            options: mapboxStaticMapStyleOptions,
          },
          zoom: { label: "Zoom", type: "number", min: 0, max: 22 },
          height: { label: "Height", type: "text" },
        },
      },
      locations: {
        label: "Locations",
        type: "array",
        arrayFields: {
          name: { label: "Name", type: "text" },
          addressLine1: { label: "Address Line 1", type: "text" },
          addressLine2: { label: "Address Line 2", type: "text" },
          phone: { label: "Phone", type: "text" },
          distanceText: { label: "Distance Text", type: "text" },
          cta: {
            label: "Call To Action",
            type: "object",
            objectFields: linkArrayFields,
          },
        },
        defaultItemProps: {
          name: "Nearby Location",
          addressLine1: "",
          addressLine2: "",
          phone: "",
          distanceText: "",
          cta: { label: "Get directions", link: "#" },
        },
        getItemSummary: (item: NearbyLocationProps) => item.name,
      },
    },
  },
  footer: {
    label: "Footer",
    type: "object",
    objectFields: {
      description: rtfField("Description"),
      quickLinksHeading: { label: "Quick Links Heading", type: "text" },
      quickLinks: {
        label: "Quick Links",
        type: "array",
        arrayFields: linkArrayFields,
        defaultItemProps: { label: "Link", link: "#" },
        getItemSummary: (item: LinkItemProps) => item.label,
      },
      subscribeHeading: { label: "Subscribe Heading", type: "text" },
      subscribeText: rtfField("Subscribe Text"),
      emailPlaceholder: { label: "Email Placeholder", type: "text" },
      copyrightText: { label: "Copyright Text", type: "text" },
      legalLinks: {
        label: "Legal Links",
        type: "array",
        arrayFields: linkArrayFields,
        defaultItemProps: { label: "Link", link: "#" },
        getItemSummary: (item: LinkItemProps) => item.label,
      },
    },
  },
} as const;

const sectionColorFieldsBySection: Record<
  YextElevatedWoodfireSectionName,
  Array<keyof YextElevatedWoodfireSharedProps["section"]>
> = {
  header: ["headerBackgroundColor"],
  hero: ["surfaceColor", "accentColor"],
  details: ["backgroundColor", "surfaceColor", "accentColor"],
  offerings: ["backgroundColor", "surfaceColor", "accentColor"],
  about: ["backgroundColor", "accentColor"],
  featured: ["backgroundColor", "surfaceColor", "accentColor"],
  reviews: ["backgroundColor", "surfaceColor", "accentColor"],
  event: ["accentColor"],
  faqs: ["backgroundColor", "surfaceColor", "accentColor"],
  findUs: ["backgroundColor", "accentColor"],
  footer: ["footerBackgroundColor", "accentColor"],
};

const createYextElevatedWoodfireSectionField = (
  visibleSection: YextElevatedWoodfireSectionName,
) => {
  const sectionFields = YextElevatedWoodfireSharedFields.section.objectFields;
  const fieldKeys: Array<keyof typeof sectionFields> = [
    "visibleOnLivePage",
    "styles",
    ...sectionColorFieldsBySection[visibleSection],
  ];

  return {
    ...YextElevatedWoodfireSharedFields.section,
    objectFields: Object.fromEntries(
      fieldKeys.map((key) => [key, sectionFields[key]]),
    ),
  };
};

const createYextElevatedWoodfireSectionDefaultProps = (
  visibleSection: YextElevatedWoodfireSectionName,
): YextElevatedWoodfireSharedProps["section"] => {
  const sectionDefaults = yextElevatedWoodfireDefaultProps.section;
  const keys: Array<keyof YextElevatedWoodfireSharedProps["section"]> = [
    "visibleOnLivePage",
    "styles",
    ...sectionColorFieldsBySection[visibleSection],
  ];

  return Object.fromEntries(
    keys.map((key) => [
      key,
      cloneYextElevatedWoodfireConfigValue(sectionDefaults[key]),
    ]),
  ) as YextElevatedWoodfireSharedProps["section"];
};

const YextElevatedWoodfireSharedComponent: PuckComponent<
  YextElevatedWoodfireSharedProps
> = (props) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument<StreamDocumentWithReviews>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const resolvedAddress = resolveComponentData(
    props.details.address,
    locale,
    streamDocument,
  );
  const resolvedPhoneItems = (props.details.phones.items ?? [])
    .map((item) => {
      const resolvedNumber = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const normalizedNumber =
        typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";
      if (!normalizedNumber) {
        return null;
      }

      return {
        formattedNumber: formatPhoneForDisplay(
          normalizedNumber,
          props.details.phones.phoneFormat,
        ),
        label: item.label?.trim() ?? "",
        telDigits: normalizedNumber.replace(/\D/g, ""),
      };
    })
    .filter(
      (
        item,
      ): item is {
        formattedNumber: string;
        label: string;
        telDigits: string;
      } => item !== null,
    );
  const { averageRating, reviewCount } = getAggregateRating(streamDocument);
  const firstPartyReviews =
    streamDocument.ref_reviewsAgg?.find(
      (aggregate) => aggregate.publisher === "FIRSTPARTY",
    )?.topReviews ?? [];
  const reviewItems = firstPartyReviews.length
    ? firstPartyReviews.map(
        (review, index): ReviewItemProps => ({
          authorName: review.authorName || `Reviewer ${index + 1}`,
          rating: review.rating,
          content: review.content || "",
          reviewDate: review.reviewDate,
          response: review.comments?.[0]?.content,
          responseDate: review.comments?.[0]?.commentDate,
          avatarColor: props.section.accentColor,
        }),
      )
    : [];
  const coordinate = streamDocument.yextDisplayCoordinate;
  const enableNearbyLocations =
    coordinate?.latitude !== undefined && coordinate?.longitude !== undefined;
  const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
    useNearbyLocations({
      streamDocument,
      latitude: coordinate?.latitude,
      longitude: coordinate?.longitude,
      radiusMi: 25,
      limit: 3,
      enabled: enableNearbyLocations,
    });
  const nearbyLocationCards =
    nearbyLocationsData?.response?.docs.map((locationData) => ({
      locationData,
      resolvedUrl: resolveUrlTemplate(
        mergeMeta(locationData, streamDocument),
        relativePrefixToRoot ?? "",
      ),
    })) ?? [];

  const statusTemplate = (params: StatusParams) => {
    const interval = params.isOpen
      ? params.currentInterval
      : params.futureInterval;
    const time = params.isOpen
      ? interval?.getEndTime(locale, params.timeOptions)
      : interval?.getStartTime(locale, params.timeOptions);

    return (
      <span>
        {props.hoursStyles.showCurrentStatus
          ? renderCurrentStatus(params)
          : null}
        {time ? (
          <span>
            {" "}
            • {params.isOpen ? "Closes" : "Opens"} {time}
          </span>
        ) : null}
      </span>
    );
  };

  const footerLinkColumns = [
    props.footer.quickLinks.slice(0, 4),
    props.footer.quickLinks.slice(4),
  ];
  const pageBackgroundColor =
    props.visibleSection === "hero"
      ? "transparent"
      : colorToCss(props.section.backgroundColor);

  const sectionPadding =
    props.section.styles.verticalPadding === "default"
      ? undefined
      : props.section.styles.verticalPadding;
  const contentWidth =
    props.section.styles.contentWidth === "default"
      ? undefined
      : props.section.styles.contentWidth;
  const shouldRenderSection = (sectionName: YextElevatedWoodfireSectionName) =>
    !props.visibleSection ||
    props.visibleSection === "all" ||
    props.visibleSection === sectionName;

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextElevatedWoodfire${getAnalyticsScopeHash(props.id)}`}
      >
        <div
          className="fb-page"
          style={
            {
              "--fb-page-bg": pageBackgroundColor,
              "--fb-hero-card-bg": colorToCss(props.section.surfaceColor),
              "--fb-white-bg": colorToCss(props.section.backgroundColor),
              "--fb-tint-bg": colorToCss(props.section.surfaceColor),
              "--fb-card-bg": colorToCss(props.section.surfaceColor),
              "--fb-card-text": contrastColorToCss(props.section.surfaceColor),
              "--fb-overlay-bg": "rgba(12, 18, 28, 0.6)",
              "--fb-header-bg": colorToCss(props.section.headerBackgroundColor),
              "--fb-header-text": contrastColorToCss(
                props.section.headerBackgroundColor,
              ),
              "--fb-footer-bg": colorToCss(props.section.footerBackgroundColor),
              "--fb-footer-border": "rgba(255, 255, 255, 0.14)",
              "--fb-primary": colorToCss(props.section.accentColor),
              "--fb-secondary": colorToCss(secondaryColor),
              "--fb-text": colorToCss(quaternaryColor),
              "--fb-muted": colorToCss(secondaryColor),
              "--fb-light": contrastColorToCss(
                props.section.footerBackgroundColor,
              ),
              "--fb-stars": colorToCss(starColor),
              "--fb-section-padding": sectionPadding,
              "--fb-content-width": contentWidth,
            } as React.CSSProperties
          }
        >
          <style>{yextElevatedWoodfireCss}</style>
          {shouldRenderSection("header") ? (
            <header className="fb-site-header">
              <nav className="fb-top-nav" aria-label="Primary navigation">
                <button
                  aria-controls="fb-mobile-nav"
                  aria-expanded={isMobileMenuOpen}
                  className={`fb-menu-toggle${isMobileMenuOpen ? " is-open" : ""}`}
                  type="button"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span />
                  <span />
                  <span />
                </button>
                <div className="fb-nav-left">
                  {props.headerLinks.map((link, index) => (
                    <Link
                      key={`${link.label}-${index}`}
                      cta={{ link: link.link, linkType: "URL" }}
                      eventName={`headerLink${index}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <p className="fb-brand">{props.brandName}</p>
                <div className="fb-nav-right" aria-label="Header actions">
                  {props.socialLinks.map((link, index) => (
                    <Link
                      key={`${link.label}-${index}`}
                      cta={{ link: link.link, linkType: "URL" }}
                      eventName={`headerSocial${index}`}
                      aria-label={link.label}
                    >
                      <img src={link.iconUrl} alt="" />
                    </Link>
                  ))}
                </div>
              </nav>
              <div
                className="fb-mobile-nav"
                hidden={!isMobileMenuOpen}
                id="fb-mobile-nav"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <div className="fb-mobile-nav-inner">
                  <div className="fb-mobile-nav-header">
                    <p>{props.brandName}</p>
                    <button
                      type="button"
                      aria-label="Close menu"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      x
                    </button>
                  </div>
                  {props.headerLinks.map((link, index) => (
                    <Link
                      key={`${link.label}-${index}`}
                      cta={{ link: link.link, linkType: "URL" }}
                      eventName={`headerLink${index}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="fb-mobile-nav-divider" aria-hidden="true" />
                  <div
                    className="fb-mobile-nav-socials"
                    aria-label="Social media links"
                  >
                    {props.socialLinks.map((link, index) => (
                      <Link
                        key={`${link.label}-${index}`}
                        cta={{ link: link.link, linkType: "URL" }}
                        eventName={`headerSocial${index}`}
                        aria-label={link.label}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <img src={link.iconUrl} alt="" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </header>
          ) : null}
          {shouldRenderSection("hero") ? (
            <section className="fb-hero">
              {renderImage(
                props.hero.image,
                locale,
                streamDocument,
                "fb-hero-image-frame",
                "fb-hero-image",
              )}
              <section className="fb-hero-card">
                <h1 style={textStyle(props.hero.heading)}>
                  {resolveText(props.hero.heading, locale, streamDocument)}
                </h1>
                {renderRtf(
                  props.hero.description,
                  locale,
                  streamDocument,
                  "fb-hero-description",
                )}
                <p className="fb-hero-meta">
                  {resolvedHours ? (
                    <HoursStatus
                      hours={resolvedHours}
                      timezone={streamDocument.timezone ?? "UTC"}
                      dayOptions={{
                        weekday: props.hoursStyles.dayOfWeekFormat,
                      }}
                      timeOptions={{
                        hour12: props.hoursStyles.timeFormat === "12h",
                      }}
                      statusTemplate={statusTemplate}
                    />
                  ) : (
                    <span className="fb-hours-placeholder">
                      Hours unavailable
                    </span>
                  )}
                </p>
                <div className="fb-hero-actions">
                  {props.hero.ctas.map((cta, index) => (
                    <Link
                      key={`${cta.label}-${index}`}
                      cta={{ link: cta.link, linkType: "URL" }}
                      eventName={`heroCta${index}`}
                      className="fb-pill"
                      style={buttonStyle(cta)}
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          <main>
            {shouldRenderSection("details") ? (
              <section className="fb-section fb-details-section">
                <div className="fb-container">
                  <h2 style={textStyle(props.details.heading)}>
                    {resolveText(props.details.heading, locale, streamDocument)}
                  </h2>
                  <div className="fb-details-grid">
                    <article className="fb-panel">
                      <h3>{props.details.addressHeading}</h3>
                      {resolvedAddress ? (
                        <Address
                          address={resolvedAddress}
                          showRegion={props.details.showRegion}
                          showCountry={props.details.showCountry}
                        />
                      ) : props.puck.isEditing ? (
                        <p>Address unavailable</p>
                      ) : null}
                      <h3>{props.details.phoneHeading}</h3>
                      {resolvedPhoneItems.map((phone, index) => {
                        const phoneText = phone.label
                          ? `${phone.label} ${phone.formattedNumber}`
                          : phone.formattedNumber;
                        if (
                          !props.details.phones.includeHyperlink ||
                          !phone.telDigits
                        ) {
                          return (
                            <p
                              key={`${phoneText}-${index}`}
                              style={{
                                color: colorToCss(props.details.phones.color),
                              }}
                            >
                              {phoneText}
                            </p>
                          );
                        }

                        return (
                          <Link
                            key={`${phoneText}-${index}`}
                            cta={{ link: phone.telDigits, linkType: "PHONE" }}
                            eventName={`phone${index}`}
                            style={{
                              color: colorToCss(props.details.phones.color),
                            }}
                          >
                            {phoneText}
                          </Link>
                        );
                      })}
                      <div className="fb-detail-links">
                        {props.details.links.map((link, index) => (
                          <Link
                            key={`${link.label}-${index}`}
                            cta={{ link: link.link, linkType: "URL" }}
                            eventName={`detailsLink${index}`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <h3>{props.details.otherHeading}</h3>
                      {props.details.otherDetails.map((detail) => (
                        <p key={detail.label}>{detail.label}</p>
                      ))}
                    </article>
                    <article className="fb-panel">
                      <h3>{props.details.hoursHeading}</h3>
                      {resolvedHours ? (
                        <div
                          className={`fb-hours ${props.hoursStyles.alignment}`}
                        >
                          <HoursTable
                            hours={resolvedHours}
                            startOfWeek={props.hoursStyles.startOfWeek}
                            collapseDays={props.hoursStyles.collapseDays}
                          />
                          {props.hoursStyles.showAdditionalHoursText &&
                          streamDocument.additionalHoursText ? (
                            <p className="fb-hours-note">
                              {streamDocument.additionalHoursText}
                            </p>
                          ) : null}
                        </div>
                      ) : props.puck.isEditing ? (
                        <p>Hours unavailable</p>
                      ) : null}
                      <p className="fb-hours-note">{props.details.hoursNote}</p>
                    </article>
                  </div>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("offerings") ? (
              <section className="fb-section fb-tint-section">
                <div className="fb-container fb-offerings-grid">
                  <div className="fb-offerings-image">
                    {renderImage(
                      props.offerings.image,
                      locale,
                      streamDocument,
                      "fb-offerings-image-frame",
                      "fb-offerings-image-content",
                    )}
                  </div>
                  <article>
                    <h2 style={textStyle(props.offerings.heading)}>
                      {resolveText(
                        props.offerings.heading,
                        locale,
                        streamDocument,
                      )}
                    </h2>
                    <ul className="fb-offerings-list">
                      {props.offerings.items.map((item) => (
                        <li
                          key={item.label}
                          className={
                            item.unavailable ? "fb-unavailable" : undefined
                          }
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("about") ? (
              <section className="fb-section fb-about-section">
                <div className="fb-container fb-about-grid">
                  <article className="fb-about-text">
                    <h2 style={textStyle(props.about.heading)}>
                      {resolveText(props.about.heading, locale, streamDocument)}
                    </h2>
                    {props.about.paragraphs.map((paragraph, index) => (
                      <React.Fragment key={`about-paragraph-${index}`}>
                        {renderRtf(paragraph, locale, streamDocument)}
                      </React.Fragment>
                    ))}
                  </article>
                  <div className="fb-about-art">
                    {renderImage(
                      props.about.image,
                      locale,
                      streamDocument,
                      "fb-about-image-frame",
                      "fb-about-image",
                    )}
                  </div>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("featured") ? (
              <section className="fb-section fb-featured-section">
                <div className="fb-wide-container">
                  <h2 style={textStyle(props.featuredItems.heading)}>
                    {resolveText(
                      props.featuredItems.heading,
                      locale,
                      streamDocument,
                    )}
                  </h2>
                  <div className="fb-featured-grid">
                    {props.featuredItems.items.map((item, index) => (
                      <article className="fb-feature-card" key={item.title}>
                        {renderImage(
                          item.image,
                          locale,
                          streamDocument,
                          "fb-feature-image-frame",
                          "fb-feature-image",
                        )}
                        <div className="fb-feature-overlay">
                          <h3>{item.title}</h3>
                          {renderRtf(item.description, locale, streamDocument)}
                          <Link
                            cta={{ link: item.cta.link, linkType: "URL" }}
                            eventName={`itemLink${index}`}
                          >
                            {item.cta.label}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("reviews") && reviewItems.length ? (
              <section className="fb-section fb-tint-section">
                <div className="fb-wide-container">
                  <h2
                    style={{
                      ...textStyle(props.reviews.heading),
                      textAlign: "center",
                    }}
                  >
                    {resolveText(props.reviews.heading, locale, streamDocument)}
                  </h2>
                  <p className="fb-review-summary">
                    {typeof averageRating === "number" ? (
                      <>
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="fb-stars">★★★★★</span>
                      </>
                    ) : null}
                    {typeof averageRating === "number" && reviewCount ? (
                      <span>|</span>
                    ) : null}
                    {reviewCount ? (
                      <span>{`${reviewCount} Reviews`}</span>
                    ) : null}
                  </p>
                  <p className="fb-recent-heading">
                    {props.reviews.recentHeading}
                  </p>
                  <div className="fb-review-grid">
                    {reviewItems.map((review, index) => {
                      const reviewDate = formatReviewDate(
                        review.reviewDate,
                        locale,
                      );
                      const responseDate = formatReviewDate(
                        review.responseDate,
                        locale,
                      );

                      return (
                        <article
                          className="fb-review-card"
                          key={`${review.authorName}-${index}`}
                        >
                          <div className="fb-review-head">
                            <div className="fb-review-author">
                              <span
                                className="fb-review-avatar"
                                style={{
                                  backgroundColor: colorToCss(
                                    review.avatarColor,
                                  ),
                                  color: contrastColorToCss(review.avatarColor),
                                }}
                              >
                                {review.authorName.charAt(0)}
                              </span>
                              <div>
                                <h3>{review.authorName}</h3>
                                {reviewDate ? (
                                  <time dateTime={review.reviewDate}>
                                    {reviewDate}
                                  </time>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {typeof review.rating === "number" ? (
                            <p className="fb-review-stars-line">
                              <span>{review.rating.toFixed(1)}</span>
                              <span className="fb-stars">★★★★★</span>
                            </p>
                          ) : null}
                          {review.content ? <p>{review.content}</p> : null}
                          {review.response ? (
                            <div className="fb-review-response">
                              <strong>Response from the owner</strong>
                              {responseDate ? (
                                <time dateTime={review.responseDate}>
                                  {responseDate}
                                </time>
                              ) : null}
                              <p>{review.response}</p>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("event") ? (
              <section className="fb-event-banner">
                {renderImage(
                  props.event.image,
                  locale,
                  streamDocument,
                  "fb-event-image-frame",
                  "fb-event-image",
                )}
                <div className="fb-event-overlay">
                  <h2 style={textStyle(props.event.heading)}>
                    {resolveText(props.event.heading, locale, streamDocument)}
                  </h2>
                  {renderRtf(props.event.description, locale, streamDocument)}
                  <ul>
                    {props.event.bullets.map((bullet) => (
                      <li key={bullet.label}>{bullet.label}</li>
                    ))}
                  </ul>
                  <Link
                    cta={{ link: props.event.cta.link, linkType: "URL" }}
                    eventName="eventCta"
                    className="fb-pill"
                    style={buttonStyle(props.event.cta)}
                  >
                    {props.event.cta.label}
                  </Link>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("faqs") ? (
              <section className="fb-section fb-faq-section">
                <div className="fb-container">
                  <h2 style={textStyle(props.faqs.heading)}>
                    {resolveText(props.faqs.heading, locale, streamDocument)}
                  </h2>
                  <div className="fb-faq-list">
                    {props.faqs.items.map((item, index) => (
                      <details
                        className="fb-faq-item"
                        key={item.question}
                        onToggle={(event) => {
                          analytics?.track({
                            action: event.currentTarget.open
                              ? "EXPAND"
                              : "COLLAPSE",
                            eventName: `faqToggle${index}`,
                          });
                        }}
                      >
                        <summary>{item.question}</summary>
                        {renderRtf(item.answer, locale, streamDocument)}
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {shouldRenderSection("findUs") ? (
              <section className="fb-section fb-find-section">
                <div className="fb-container">
                  <h2 style={textStyle(props.findUs.heading)}>
                    {resolveText(props.findUs.heading, locale, streamDocument)}
                  </h2>
                  <div className="fb-map-frame">
                    <MapboxStaticMapComponent
                      {...props.findUs.map}
                      id={`${props.id}-map`}
                      puck={props.puck}
                    />
                  </div>
                  {nearbyLocationsStatus === "pending" ? (
                    <p>Loading nearby locations</p>
                  ) : nearbyLocationCards.length ? (
                    <div className="fb-location-grid">
                      {nearbyLocationCards.map(
                        ({ locationData, resolvedUrl }, index) => (
                          <article
                            key={locationData.id ?? locationData.name ?? index}
                          >
                            <h3>{locationData.name}</h3>
                            <p>
                              {locationData.address?.line1 ?? ""}
                              <br />
                              {[
                                locationData.address?.city,
                                locationData.address?.region,
                                locationData.address?.postalCode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            {locationData.mainPhone ? (
                              <p>{formatPhone(locationData.mainPhone)}</p>
                            ) : null}
                            <Link
                              cta={{ link: resolvedUrl, linkType: "URL" }}
                              eventName={`locationLink${index}`}
                            >
                              Get directions
                            </Link>
                          </article>
                        ),
                      )}
                    </div>
                  ) : props.puck.isEditing ? (
                    <div className="fb-location-grid">
                      {props.findUs.locations.map((location, index) => (
                        <article key={location.name}>
                          <h3>{location.name}</h3>
                          <p>
                            {location.addressLine1}
                            <br />
                            {location.addressLine2}
                          </p>
                          <p>{location.phone}</p>
                          <p>{location.distanceText}</p>
                          <Link
                            cta={{ link: location.cta.link, linkType: "URL" }}
                            eventName={`locationLink${index}`}
                          >
                            {location.cta.label}
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </main>

          {shouldRenderSection("footer") ? (
            <footer className="fb-footer">
              <div className="fb-container fb-footer-grid">
                <section>
                  <p className="fb-footer-brand">{props.brandName}</p>
                  {renderRtf(props.footer.description, locale, streamDocument)}
                  <div className="fb-footer-socials">
                    {props.socialLinks.map((link, index) => (
                      <Link
                        key={`${link.label}-${index}`}
                        cta={{ link: link.link, linkType: "URL" }}
                        eventName={`footerLink${index}`}
                        aria-label={link.label}
                      >
                        <img src={link.iconUrl} alt="" />
                      </Link>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>{props.footer.quickLinksHeading}</h3>
                  <div className="fb-footer-links-grid">
                    {footerLinkColumns.map((column, columnIndex) => (
                      <div key={`footer-column-${columnIndex}`}>
                        {column.map((link, index) => (
                          <Link
                            key={`${link.label}-${index}`}
                            cta={{ link: link.link, linkType: "URL" }}
                            eventName={`footerLink${
                              columnIndex * 4 + index + props.socialLinks.length
                            }`}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3>{props.footer.subscribeHeading}</h3>
                  {renderRtf(
                    props.footer.subscribeText,
                    locale,
                    streamDocument,
                  )}
                  <form className="fb-subscribe-form">
                    <label htmlFor="fb-footer-email">Email address</label>
                    <input
                      id="fb-footer-email"
                      type="email"
                      placeholder={props.footer.emailPlaceholder}
                    />
                    <button type="submit" aria-label="Submit email">
                      <span aria-hidden="true">✉</span>
                    </button>
                  </form>
                </section>
              </div>
              <div className="fb-container fb-footer-bottom">
                <p>{props.footer.copyrightText}</p>
                <div>
                  {props.footer.legalLinks.map((link, index) => (
                    <Link
                      key={`${link.label}-${index}`}
                      cta={{ link: link.link, linkType: "URL" }}
                      eventName={`footerLegal${index}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </footer>
          ) : null}
        </div>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

const defaultButtonStyles: StyledButtonValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
  borderRadius: "default",
  letterSpacing: "default",
};

const defaultText = (
  defaultValue: string,
  fontColor: ThemeColor,
): StyledTextProps => ({
  text: {
    field: "",
    constantValue: {
      defaultValue,
      hasLocalizedValue: "true",
    },
    constantValueEnabled: true,
  },
  styles: defaultTextStyles,
  fontColor,
});

const yextElevatedWoodfireDefaultProps: YextElevatedWoodfireSharedProps = {
  section: {
    visibleOnLivePage: true,
    styles: {
      verticalPadding: "default",
      contentWidth: "default",
    },
    backgroundColor: background1Color,
    surfaceColor: background4Color,
    accentColor: quaternaryColor,
    headerBackgroundColor: background1Color,
    footerBackgroundColor: darkBackgroundColor,
  },
  brandName: "REDWOOD BURGER CO.",
  headerLinks: [
    { label: "Menu", link: "#" },
    { label: "Catering", link: "#" },
    { label: "Contact", link: "#" },
  ],
  socialLinks: [
    { label: "Facebook", link: "#", iconUrl: `${imageBaseUrl}facebook.png` },
    {
      label: "Instagram",
      link: "#",
      iconUrl: `${imageBaseUrl}instagram.png`,
    },
    { label: "Yelp", link: "#", iconUrl: `${imageBaseUrl}yelp.png` },
  ],
  hero: {
    image: defaultImage(`${imageBaseUrl}hero.jpg`, 0, "filled", 5184, 3456),
    heading: defaultText(
      "Redwood Burger Co. Restaurant - South Lamar",
      quaternaryColor,
    ),
    description: defaultRtf(
      "Redwood Burger Co. is an upscale burger restaurant located in Austin, Texas. They offer dine-in, takeout, delivery, and curbside pickup options. The location serves lunch, dinner, and brunch, with happy hour available on weekdays.",
      quaternaryColor,
    ),
    ctas: [
      {
        label: "Call Ahead",
        link: "#",
        backgroundColor: primaryColor,
        fontColor: lightTextColor,
        styles: defaultButtonStyles,
      },
      {
        label: "Order Takeout",
        link: "#",
        backgroundColor: secondaryColor,
        fontColor: lightTextColor,
        styles: defaultButtonStyles,
      },
      {
        label: "View Menu",
        link: "tel:+15125550148",
        backgroundColor: {
          selectedColor: "[transparent]",
          contrastingColor: "black",
        },
        fontColor: quaternaryColor,
        styles: defaultButtonStyles,
      },
    ],
  },
  hours: {
    field: "hours",
    constantValue: {},
    constantValueEnabled: false,
  },
  hoursStyles: {
    startOfWeek: "monday",
    collapseDays: false,
    showAdditionalHoursText: false,
    alignment: "items-start",
    showCurrentStatus: true,
    timeFormat: "12h",
    dayOfWeekFormat: "long",
    showDayNames: false,
  },
  details: {
    heading: defaultText("Restaurant Details", quaternaryColor),
    addressHeading: "Address",
    address: {
      field: "address",
      constantValue: {
        line1: "1201 S Lamar Blvd",
        city: "Austin",
        region: "TX",
        postalCode: "78704",
        countryCode: "US",
      },
      constantValueEnabled: false,
    },
    showRegion: true,
    showCountry: false,
    phoneHeading: "Phone",
    phones: {
      items: [
        {
          number: {
            field: "mainPhone",
            constantValue: "",
            constantValueEnabled: false,
          },
          label: "",
        },
      ],
      phoneFormat: "domestic",
      includeHyperlink: false,
      showIcon: false,
      color: quaternaryColor,
    },
    otherHeading: "Other Details",
    otherDetails: [
      { label: "Price range: $$" },
      { label: "Cuisine: Burgers, American" },
      { label: "Meals served: Lunch, Dinner, Brunch" },
    ],
    links: [
      {
        label: "Website",
        link: "https://www.redwoodburgerco.com/locations/south-lamar",
      },
      { label: "Get Directions", link: "#" },
    ],
    hoursHeading: "Dining Hours",
    hoursNote: "Note: Kitchen closes 30 minutes before restaurant closing.",
  },
  offerings: {
    heading: defaultText("Offerings", quaternaryColor),
    image: defaultImage(
      `${imageBaseUrl}offerings.jpg`,
      0,
      "filled",
      3002,
      4503,
    ),
    items: [
      {
        label:
          "Menu: Appetizers, Salads, Soups, Entree's, Dessert, Draft Beer, Cocktails",
      },
      { label: "Dine-in" },
      { label: "Takeout" },
      { label: "Delivery" },
      { label: "Curbside pickup" },
      { label: "Call-Ahead" },
      { label: "Reservations via Opentable" },
      { label: "Handicap Access" },
      { label: "Wi-Fi", unavailable: true },
      { label: "Safe handling" },
    ],
  },
  about: {
    heading: defaultText("What is Redwood Burger Co.?", quaternaryColor),
    paragraphs: [
      defaultRtf(
        "At Redwood Burger Co., we believe great burgers start with great ingredients and a sense of place. Nestled in the heart of South Lamar, our Austin burger restaurant brings together wood-fired flavor, chef-driven comfort food, and the laid-back energy that makes Central Texas unforgettable. From locally sourced beef and scratch-made sauces to craft cocktails and rotating Texas drafts, every detail is designed for guests who appreciate elevated casual dining without the pretension.",
        quaternaryColor,
      ),
      defaultRtf(
        "Whether you're grabbing brunch before exploring Barton Springs, meeting friends for happy hour after work downtown, or ordering takeout for a night in South Austin, Redwood Burger Co. delivers a distinctly Austin experience rooted in quality, hospitality, and bold flavor. Our menu blends classic American favorites with modern Texas influences, making us a favorite for burgers, weekend brunch, date nights, and group dining alike.",
        quaternaryColor,
      ),
      defaultRtf(
        "Conveniently located on South Lamar Boulevard near Zilker Park and downtown Austin, Redwood Burger Co. offers dine-in, curbside pickup, delivery, and private group accommodations for locals and visitors looking for one of the best upscale burger restaurants in Austin, TX.",
        quaternaryColor,
      ),
    ],
    image: defaultImage(`${imageBaseUrl}about.png`, 0, "filled", 1218, 1041),
  },
  featuredItems: {
    heading: defaultText("Featured Items", quaternaryColor),
    items: [
      {
        title: "Redwood Smokehouse Burger",
        description: defaultRtf(
          "A wood-fired double smash burger topped with smoked cheddar, crispy onions, bourbon bacon jam, arugula, and house redwood sauce on a toasted brioche bun. Served with hand-cut fries.",
          quaternaryColor,
        ),
        image: defaultImage(
          `${imageBaseUrl}beefburger.jpg`,
          0,
          "filled",
          6000,
          3376,
        ),
        cta: { label: "Learn More", link: "#" },
      },
      {
        title: "South Lamar Chicken Sandwich",
        description: defaultRtf(
          "Crispy buttermilk fried chicken layered with hot honey glaze, dill pickles, shredded lettuce, and chipotle aioli on a buttered potato bun. A local favorite during happy hour and weekend brunch.",
          quaternaryColor,
        ),
        image: defaultImage(
          `${imageBaseUrl}sandwich.jpg`,
          0,
          "filled",
          4478,
          3359,
        ),
        cta: { label: "Learn More", link: "#" },
      },
      {
        title: "Hill Country Steak Salad",
        description: defaultRtf(
          "Grilled skirt steak served over mixed greens with roasted corn, avocado, pickled red onions, cotija cheese, tortilla strips, and cilantro-lime vinaigrette. Fresh, hearty, and distinctly Texas-inspired.",
          quaternaryColor,
        ),
        image: defaultImage(
          `${imageBaseUrl}salad.jpg`,
          0,
          "filled",
          5184,
          3456,
        ),
        cta: { label: "Learn More", link: "#" },
      },
    ],
  },
  reviews: {
    heading: defaultText("Reviews", quaternaryColor),
    recentHeading: "Recent Reviews:",
  },
  event: {
    image: defaultImage(`${imageBaseUrl}promo.jpg`, 0, "filled", 4096, 2731),
    heading: defaultText(
      "Host Your Next Group Event at Redwood Burger Co.",
      lightTextColor,
    ),
    description: defaultRtf(
      "Planning a birthday dinner, team happy hour, or weekend gathering in South Austin? Redwood Burger Co. makes group dining easy.",
      lightTextColor,
    ),
    bullets: [
      { label: "Indoor + patio seating available" },
      { label: "Customizable food & cocktail packages" },
      { label: "Convenient onsite parking in downtown Austin" },
      { label: "Flexible group size accommodations from 10-150 guests" },
    ],
    cta: {
      label: "Plan your event ->",
      link: "/group-events",
      backgroundColor: primaryColor,
      fontColor: lightTextColor,
      styles: defaultButtonStyles,
    },
  },
  faqs: {
    heading: defaultText("FAQs", quaternaryColor),
    items: [
      {
        question: "Are your dining hours the same as your take-out hours?",
        answer: defaultRtf(
          "Not always. Our takeout and delivery service may remain available slightly later than dine-in seating, especially on weekends. For the most accurate hours, we recommend checking our online ordering page or giving our South Lamar location a quick call before placing your order.",
          quaternaryColor,
        ),
      },
      {
        question: "Can I order online?",
        answer: defaultRtf(
          "Yes. Redwood Burger Co. offers online ordering for takeout, curbside pickup, and delivery throughout South Austin and surrounding neighborhoods. Delivery is available through select third-party partners including DoorDash, Uber Eats, and Postmates.",
          quaternaryColor,
        ),
      },
      {
        question: "Does this location take reservations?",
        answer: defaultRtf(
          "Yes. We accept reservations for parties of up to 6 guests based on availability. Larger groups, birthday dinners, and private dining inquiries can be arranged by contacting our group events coordinator directly. Weekend brunch reservations are highly recommended.",
          quaternaryColor,
        ),
      },
      {
        question: "Do you have a kids menu?",
        answer: defaultRtf(
          "Absolutely. Our kids menu includes favorites like cheeseburgers, grilled chicken tenders, mac & cheese, and buttered pasta, all served with your choice of fries or fresh fruit and a fountain drink. We also offer kid-friendly dessert options during brunch and dinner service.",
          quaternaryColor,
        ),
      },
      {
        question: "Do you offer vegetarian or gluten-free options?",
        answer: defaultRtf(
          "Yes. Redwood Burger Co. offers several vegetarian-friendly menu items, including plant-based burgers, salads, and shareable appetizers. Gluten-free buns are available upon request, and our team is happy to help accommodate dietary preferences whenever possible.",
          quaternaryColor,
        ),
      },
      {
        question: "Is there parking available?",
        answer: defaultRtf(
          "Yes. Complimentary parking is available onsite, with additional street parking nearby along South Lamar Boulevard. Ride-share drop-off is also convenient for guests visiting from downtown Austin, Zilker, or Barton Hills.",
          quaternaryColor,
        ),
      },
      {
        question: "Do you serve brunch?",
        answer: defaultRtf(
          "We do. Our Austin brunch menu is available every Saturday and Sunday and includes brunch burgers, chicken & waffles, brisket hash, breakfast tacos, craft cocktails, and locally roasted coffee.",
          quaternaryColor,
        ),
      },
      {
        question: "Do you have outdoor seating?",
        answer: defaultRtf(
          "Yes. Our dog-friendly patio is one of the most popular dining spots at Redwood Burger Co., especially during cooler Austin evenings and weekend brunch hours.",
          quaternaryColor,
        ),
      },
      {
        question: "Do you offer happy hour specials?",
        answer: defaultRtf(
          "Yes. Happy hour is available Monday through Friday with rotating specials on cocktails, local draft beer, appetizers, and select burgers. Visit us after work or before downtown events for seasonal offerings and limited-time menu items.",
          quaternaryColor,
        ),
      },
    ],
  },
  findUs: {
    heading: defaultText("Where To Find Us", quaternaryColor),
    map: {
      apiKey: "",
      coordinate: {
        field: "yextDisplayCoordinate",
        constantValue: {
          latitude: 0,
          longitude: 0,
        },
        constantValueEnabled: false,
      },
      mapStyle: "streets-v12",
      zoom: 15,
      height: "100%",
    },
    locations: [
      {
        name: "Redwood Burger Co. - Downtown Austin",
        addressLine1: "301 Colorado St",
        addressLine2: "Austin, TX 78701",
        phone: "(512) 555-0112",
        distanceText: "Located 3.8 miles from our South Lamar location",
        cta: { label: "Get directions", link: "#" },
      },
      {
        name: "Redwood Burger Co. - The Domain",
        addressLine1: "11501 Rock Rose Ave",
        addressLine2: "Austin, TX 78758",
        phone: "(512) 555-0184",
        distanceText: "Located 12.6 miles from our South Lamar location",
        cta: { label: "Get directions", link: "#" },
      },
      {
        name: "Redwood Burger Co. - Round Rock",
        addressLine1: "2201 S Interstate 35 Frontage Rd",
        addressLine2: "Round Rock, TX 78664",
        phone: "(512) 555-0227",
        distanceText: "Located 22.4 miles from our South Lamar location",
        cta: { label: "Get directions", link: "#" },
      },
    ],
  },
  footer: {
    description: defaultRtf(
      "Neighborhood burgers, cocktails, and brunch in South Lamar.",
      lightTextColor,
    ),
    quickLinksHeading: "Quick links",
    quickLinks: [
      { label: "Menu", link: "#" },
      { label: "Order Online", link: "#" },
      { label: "Reservations", link: "#" },
      { label: "Group Events", link: "#" },
      { label: "Catering", link: "#" },
      { label: "Careers", link: "#" },
      { label: "Gift Cards", link: "#" },
      { label: "Contact", link: "#" },
    ],
    subscribeHeading: "Subscribe to emails",
    subscribeText: defaultRtf(
      "Get updates on happy hour, new menu drops, and local events.",
      lightTextColor,
    ),
    emailPlaceholder: "Enter email",
    copyrightText: "(c) 2026 Redwood Burger Co. All rights reserved.",
    legalLinks: [
      { label: "Privacy", link: "#" },
      { label: "Terms", link: "#" },
      { label: "Accessibility", link: "#" },
    ],
  },
};

type YextElevatedWoodfireEditableKey = Exclude<
  keyof YextElevatedWoodfireSharedProps,
  "visibleSection"
>;

const cloneYextElevatedWoodfireConfigValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneYextElevatedWoodfireConfigValue(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        cloneYextElevatedWoodfireConfigValue(nestedValue),
      ]),
    ) as T;
  }

  return value;
};

const pickYextElevatedWoodfireFields = <K extends YextElevatedWoodfireEditableKey>(
  keys: readonly K[],
): Pick<typeof YextElevatedWoodfireSharedFields, K> =>
  Object.fromEntries(
    keys.map((key) => [
      key,
      cloneYextElevatedWoodfireConfigValue(YextElevatedWoodfireSharedFields[key]),
    ]),
  ) as Pick<typeof YextElevatedWoodfireSharedFields, K>;

const pickYextElevatedWoodfireDefaultProps = <K extends YextElevatedWoodfireEditableKey>(
  keys: readonly K[],
): Pick<YextElevatedWoodfireSharedProps, K> =>
  Object.fromEntries(
    keys.map((key) => [
      key,
      cloneYextElevatedWoodfireConfigValue(yextElevatedWoodfireDefaultProps[key]),
    ]),
  ) as Pick<YextElevatedWoodfireSharedProps, K>;

const renderYextElevatedWoodfireSection = (
  props: unknown,
  visibleSection: YextElevatedWoodfireSectionName,
): React.ReactElement => {
  const partialProps = props as Partial<YextElevatedWoodfireSharedProps>;
  const mergedProps = {
    ...yextElevatedWoodfireDefaultProps,
    ...partialProps,
    section: {
      ...yextElevatedWoodfireDefaultProps.section,
      ...partialProps.section,
    },
    visibleSection,
  } as Parameters<typeof YextElevatedWoodfireSharedComponent>[0];

  return <YextElevatedWoodfireSharedComponent {...mergedProps} />;
};

const createYextElevatedWoodfireSection = <K extends YextElevatedWoodfireEditableKey>(
  label: string,
  visibleSection: YextElevatedWoodfireSectionName,
  keys: readonly K[],
): ComponentConfig => {
  const fields = pickYextElevatedWoodfireFields(keys);
  if ("section" in fields) {
    fields.section = createYextElevatedWoodfireSectionField(visibleSection) as any;
  }

  const defaultProps = pickYextElevatedWoodfireDefaultProps(keys);
  if ("section" in defaultProps) {
    defaultProps.section =
      createYextElevatedWoodfireSectionDefaultProps(visibleSection);
  }

  return {
    label,
    fields,
    defaultProps,
    render: ((props) =>
      renderYextElevatedWoodfireSection(props, visibleSection)) as PuckComponent<
      Pick<YextElevatedWoodfireSharedProps, K>
    >,
  } as unknown as ComponentConfig;
};

const yextElevatedWoodfireCss = `
.fb-page {
  background: var(--fb-page-bg);
  color: var(--fb-text);
  font-family: var(--fontFamily-body-fontFamily), Montserrat, sans-serif;
  font-size: var(--fontSize-body-fontSize);
  font-weight: var(--fontWeight-body-fontWeight);
  line-height: 1.5;
}
.fb-page * { box-sizing: border-box; }
.fb-page a { color: inherit; text-decoration: none; }
.fb-page h1,
.fb-page h2,
.fb-page h3 {
  font-family: var(--fontFamily-h2-fontFamily), Lora, serif;
  font-weight: var(--fontWeight-h2-fontWeight);
  margin: 0;
}
.fb-site-header {
  background: var(--fb-header-bg);
  color: var(--fb-header-text);
  padding: 10px 0;
}
.fb-container {
  width: min(var(--fb-content-width, var(--maxWidth-pageSection-contentWidth)), calc(100% - 48px));
  max-width: 1200px;
  margin: 0 auto;
}
.fb-wide-container {
  width: min(1540px, calc(100% - 48px));
  margin: 0 auto;
}
.fb-section {
  padding-block: var(--fb-section-padding, var(--padding-pageSection-verticalPadding));
}
.fb-hero {
  min-height: 660px;
  position: relative;
}
.fb-hero-image-frame,
.fb-hero-image {
  width: 100%;
  height: 660px;
}
.fb-hero-image {
  object-fit: cover;
  object-position: center 40%;
  display: block;
}
.fb-top-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: min(1540px, calc(100% - 28px));
  height: 56px;
  padding: 0 12px;
  margin: 0 auto;
}
.fb-nav-left,
.fb-nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.fb-nav-left { justify-self: start; }
.fb-nav-right { justify-self: end; }
.fb-nav-left a {
  color: rgba(255, 255, 255, 0.96);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}
.fb-nav-right a,
.fb-footer-socials a {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.fb-nav-right img,
.fb-footer-socials img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.fb-brand,
.fb-footer-brand {
  color: rgba(248, 248, 248, 0.96);
  font-family: var(--fontFamily-h3-fontFamily), Lora, serif;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.07em;
  line-height: 1;
  margin: 0;
  text-align: center;
}
.fb-menu-toggle {
  display: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-direction: column;
}
.fb-menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
}
.fb-menu-toggle.is-open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.fb-menu-toggle.is-open span:nth-child(2) {
  opacity: 0;
}
.fb-menu-toggle.is-open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}
.fb-mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 35;
  background: rgba(13, 16, 20, 0.96);
  backdrop-filter: blur(2px);
}
.fb-mobile-nav-inner {
  width: 100%;
  min-height: 100%;
  display: grid;
  align-content: start;
  gap: 14px;
  padding: 22px 24px 32px;
}
.fb-mobile-nav-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 6px;
}
.fb-mobile-nav-header p {
  color: rgba(248, 248, 248, 0.96);
  font-family: var(--fontFamily-h3-fontFamily), Lora, serif;
  font-size: 22px;
  letter-spacing: 0.07em;
  line-height: 1;
  margin: 0;
}
.fb-mobile-nav-header button {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 38px;
  line-height: 1;
  padding: 0;
}
.fb-mobile-nav a {
  color: #eef2f6;
  font-size: 20px;
  font-weight: 500;
  padding: 8px 0;
}
.fb-mobile-nav-divider {
  height: 1px;
  margin: 4px 0 2px;
  background: rgba(255, 255, 255, 0.2);
}
.fb-mobile-nav-socials {
  display: flex;
  gap: 20px;
  margin-top: 16px;
}
.fb-mobile-nav-socials a {
  width: 34px;
  height: 34px;
  display: inline-flex;
}
.fb-mobile-nav-socials img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.fb-hero-card {
  position: absolute;
  left: 0;
  bottom: 50px;
  z-index: 5;
  width: min(720px, calc(100% - 56px));
  padding: 24px 26px;
  border-radius: 0 8px 8px 0;
  background: var(--fb-hero-card-bg);
}
.fb-hero-card h1 {
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.18;
}
.fb-hero-card p {
  margin: 6px 0 0;
}
.fb-hero-meta {
  padding-top: 8px;
}
.fb-open-now {
  color: #2f7d32;
  font-weight: 700;
}
.fb-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
.fb-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border: 1px solid currentColor;
  text-transform: uppercase;
  font-weight: 700;
  line-height: 1.2;
}
.fb-details-section,
.fb-featured-section,
.fb-find-section {
  background: var(--fb-white-bg);
}
.fb-details-section h2,
.fb-featured-section h2,
.fb-review-grid + h2,
.fb-faq-section h2,
.fb-find-section h2 {
  text-align: center;
}
.fb-details-section h2,
.fb-featured-section h2,
.fb-tint-section h2,
.fb-faq-section h2,
.fb-find-section h2 {
  margin-bottom: 28px;
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.25;
}
.fb-details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}
.fb-panel {
  background: var(--fb-card-bg);
  border-radius: var(--borderRadius-image-borderRadius);
  color: var(--fb-card-text);
  padding: 26px 24px;
}
.fb-panel h3 {
  margin: 24px 0 6px;
  font-size: var(--fontSize-h3-fontSize);
}
.fb-panel h3:first-child { margin-top: 0; }
.fb-panel p {
  margin: 3px 0 0;
  color: var(--fb-card-text);
  opacity: 0.82;
}
.fb-detail-links {
  display: flex;
  gap: 16px;
  margin: 24px 0;
}
.fb-detail-links a,
.fb-feature-overlay a,
.fb-location-grid a {
  color: var(--fb-text);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.fb-hours-list p {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0;
  padding: 8px 0;
  color: var(--fb-text);
}
.fb-hours table {
  width: 100%;
}
.fb-hours td,
.fb-hours th {
  padding: 8px 0;
}
.fb-hours tr[aria-current="date"],
.fb-hours .current-day,
.fb-hours .is-today {
  font-weight: 700;
}
.fb-current-day span {
  font-weight: 700;
}
.fb-hours-note {
  margin-top: 22px !important;
  text-align: right;
}
.fb-tint-section {
  background: var(--fb-tint-bg);
}
.fb-offerings-grid,
.fb-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 72px;
}
.fb-offerings-image-frame,
.fb-offerings-image-content {
  width: 100%;
  height: 360px;
}
.fb-offerings-image-content {
  object-fit: cover;
}
.fb-offerings-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.fb-offerings-list li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 24px;
}
.fb-offerings-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--fb-text);
}
.fb-offerings-list .fb-unavailable::before {
  content: "×";
  color: #c53030;
}
.fb-about-section {
  background: var(--fb-page-bg);
}
.fb-about-text {
  max-width: 520px;
}
.fb-about-text h2 {
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.08;
}
.fb-about-text p {
  color: var(--fb-muted);
  font-size: 16px;
  line-height: 1.5;
  margin: 14px 0 16px;
}
.fb-about-art {
  overflow: visible;
}
.fb-about-image-frame,
.fb-about-image {
  width: 125%;
  max-width: none;
  min-height: 360px;
}
.fb-about-image {
  object-fit: cover;
  object-position: left center;
}
.fb-featured-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.fb-feature-card {
  position: relative;
  padding-bottom: 84px;
}
.fb-feature-image-frame,
.fb-feature-image {
  width: 100%;
  height: 210px;
}
.fb-feature-image {
  object-fit: cover;
}
.fb-feature-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 90%;
  padding: 14px 14px 12px;
  border-top-right-radius: 64px;
  background: var(--fb-white-bg);
}
.fb-feature-overlay h3 {
  font-size: 18px;
  line-height: 1.25;
}
.fb-feature-overlay p {
  color: var(--fb-text);
  margin: 8px 0 10px;
}
.fb-review-summary,
.fb-recent-heading {
  text-align: center;
}
.fb-review-summary {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 0 0 28px;
  font-size: 16px;
}
.fb-stars {
  color: var(--fb-stars);
  letter-spacing: 0.04em;
}
.fb-recent-heading {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
}
.fb-review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.fb-review-card {
  background: var(--fb-white-bg);
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  padding: 14px 16px 16px;
}
.fb-review-head,
.fb-review-author {
  display: flex;
  align-items: center;
}
.fb-review-head {
  justify-content: space-between;
  gap: 12px;
}
.fb-review-author {
  gap: 10px;
}
.fb-review-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.fb-review-card img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.fb-review-card h3 {
  font-family: var(--fontFamily-body-fontFamily), Montserrat, sans-serif;
  font-size: 15px;
  font-weight: 700;
}
.fb-review-card time {
  color: var(--fb-muted);
  font-size: 12px;
}
.fb-review-card p {
  margin: 0;
}
.fb-review-author p {
  color: var(--fb-muted);
  font-size: 12px;
}
.fb-review-stars-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 8px !important;
  font-weight: 700;
}
.fb-review-response {
  border-left: 3px solid var(--fb-primary);
  margin-top: 14px;
  padding-left: 12px;
}
.fb-review-response strong {
  display: block;
  font-size: 13px;
}
.fb-event-banner {
  position: relative;
  height: 560px;
  overflow: hidden;
}
.fb-event-image-frame,
.fb-event-image {
  width: 100%;
  height: 100%;
}
.fb-event-image {
  object-fit: cover;
}
.fb-event-banner::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--fb-overlay-bg);
}
.fb-event-overlay {
  position: absolute;
  inset: auto 0 64px;
  z-index: 1;
  width: min(760px, calc(100% - 48px));
  margin: 0 auto;
  color: var(--fb-light);
  text-align: center;
}
.fb-event-overlay h2 {
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
}
.fb-event-overlay p {
  margin: 10px 0 18px;
  font-size: 16px;
}
.fb-event-overlay ul {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
}
.fb-event-overlay li {
  margin-bottom: 6px;
}
.fb-faq-section {
  background: var(--fb-page-bg);
}
.fb-faq-list {
  display: grid;
  gap: 12px;
  max-width: 980px;
  margin: 0 auto;
}
.fb-faq-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: var(--fb-card-bg);
  color: var(--fb-card-text);
  overflow: hidden;
}
.fb-faq-item summary {
  cursor: pointer;
  list-style: none;
  padding: 18px 48px 18px 20px;
  font-family: var(--fontFamily-h3-fontFamily), Lora, serif;
  font-size: 19px;
  position: relative;
}
.fb-faq-item summary::-webkit-details-marker { display: none; }
.fb-faq-item summary::after {
  content: "+";
  position: absolute;
  right: 20px;
}
.fb-faq-item[open] summary::after { content: "-"; }
.fb-faq-item p {
  margin: 0;
  padding: 0 20px 18px;
}
.fb-map-frame {
  width: 100%;
  height: 360px;
  overflow: hidden;
  border-radius: var(--borderRadius-image-borderRadius);
}
.fb-map-frame .mapbox-static-map-shell,
.fb-map-frame .mapbox-static-map-picture,
.fb-map-frame .mapbox-static-map-image {
  width: 100%;
  height: 100%;
}
.fb-map-frame .mapbox-static-map-image {
  object-fit: cover;
  object-position: center;
}
.fb-location-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-top: 24px;
}
.fb-location-grid h3 {
  margin-bottom: 10px;
  font-size: 24px;
  line-height: 1.2;
}
.fb-location-grid p {
  margin: 0 0 6px;
}
.fb-footer {
  background: var(--fb-footer-bg);
  color: var(--fb-light);
  padding: 64px 0 22px;
}
.fb-footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1.2fr;
  gap: 40px;
}
.fb-footer p {
  color: rgba(255, 255, 255, 0.76);
  margin: 0 0 14px;
}
.fb-footer h3 {
  color: var(--fb-light);
  font-size: 21px;
  margin-bottom: 14px;
}
.fb-footer-socials {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}
.fb-footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}
.fb-footer-links-grid div {
  display: flex;
  flex-direction: column;
}
.fb-footer-links-grid a,
.fb-footer-bottom a {
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  margin-bottom: 10px;
}
.fb-subscribe-form {
  display: flex;
  align-items: center;
  width: 420px;
  max-width: 100%;
  border: 1px solid var(--fb-footer-border);
  border-radius: 8px;
  overflow: hidden;
}
.fb-subscribe-form label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.fb-subscribe-form input {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--fb-light);
  padding: 11px 12px;
}
.fb-subscribe-form button {
  width: 48px;
  height: 40px;
  border: 0;
  border-left: 1px solid var(--fb-footer-border);
  background: rgba(255,255,255,0.06);
  color: var(--fb-light);
}
.fb-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 34px;
  padding-top: 14px;
  border-top: 1px solid var(--fb-footer-border);
}
.fb-footer-bottom div {
  display: flex;
  gap: 16px;
}
@media (max-width: 1100px) {
  .fb-offerings-grid {
    gap: 24px;
  }
  .fb-about-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .fb-about-text {
    max-width: none;
  }
  .fb-about-image-frame,
  .fb-about-image {
    width: 100%;
    height: auto;
    min-height: 0;
  }
  .fb-about-image {
    object-position: center;
  }
  .fb-featured-grid,
  .fb-location-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .fb-footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .fb-footer-grid section:last-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 760px) {
  .fb-site-header {
    padding-block: 8px;
  }
  .fb-hero,
  .fb-hero-image {
    height: 560px;
    min-height: 560px;
  }
  .fb-top-nav {
    display: flex;
    justify-content: center;
    width: calc(100% - 16px);
    height: 48px;
    padding: 0 14px;
  }
  .fb-menu-toggle {
    display: inline-flex;
    position: absolute;
    right: 14px;
    top: 50%;
    margin-top: -14px;
  }
  .fb-nav-left,
  .fb-nav-right {
    display: none;
  }
  .fb-brand {
    font-size: 20px;
  }
  .fb-hero-card {
    left: 12px;
    bottom: 14px;
    width: calc(100% - 24px);
    padding: 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.75);
  }
  .fb-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.14);
  }
  .fb-hero-card h1 {
    font-size: 28px;
  }
  .fb-hero-actions .fb-pill {
    width: 100%;
  }
  .fb-section {
    padding-block: 72px;
  }
  .fb-details-grid,
  .fb-offerings-grid,
  .fb-about-grid,
  .fb-featured-grid,
  .fb-review-grid,
  .fb-location-grid,
  .fb-footer-grid {
    grid-template-columns: 1fr;
  }
  .fb-offerings-image {
    order: 2;
  }
  .fb-about-text {
    max-width: none;
  }
  .fb-about-image-frame,
  .fb-about-image {
    width: 100%;
    min-height: 0;
  }
  .fb-feature-image-frame,
  .fb-feature-image {
    height: 230px;
  }
  .fb-feature-overlay {
    width: 94%;
    padding: 18px 16px 16px;
  }
  .fb-event-banner {
    height: 470px;
  }
  .fb-event-overlay {
    bottom: 30px;
  }
  .fb-footer-links-grid {
    grid-template-columns: 1fr;
  }
  .fb-footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;
export const YextElevatedWoodfireFindUsSection = createYextElevatedWoodfireSection(
  "Yext Elevated Woodfire Find Us Section",
  "findUs",
  ["section", "findUs"],
);
