import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Address,
  AnalyticsScopeProvider,
  Link,
  HoursTable,
  type AddressType,
  type HoursType,
} from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  ComprehensiveCTA,
  getAnalyticsScopeHash,
  isDarkColor,
  resolveComponentData,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  type StyledTextValue,
  type YextEntityField,
  type YextComponentConfig,
  type YextFields,
  useDocument,
  VisibilityWrapper,
  ComprehensiveCTAValue,
  Background,
  EntityField,
} from "@yext/visual-editor";

type TextWithColor = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
};

type DetailRow = {
  item: TextWithColor;
};

type CtaColorState = {
  styles?: {
    variant?: string | null;
    color?: ThemeColor;
  };
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

export type YextCafeAndCoffeeShopDetailsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: TextWithColor;
  address: {
    subheading: TextWithColor;
    address: YextEntityField<AddressType>;
    showRegion: boolean;
    showCountry: boolean;
  };
  phone: PhoneFieldProps & {
    subheading: TextWithColor;
  };
  websiteLink: ComprehensiveCTAValue;
  directionsLink: ComprehensiveCTAValue;
  otherDetails: {
    subheading: TextWithColor;
    items: DetailRow[];
  };
  hours: {
    subheading: TextWithColor;
    hours: YextEntityField<HoursType>;
    hoursStyles: {
      startOfWeek:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
        | "today";
      collapseDays: boolean;
      showAdditionalHoursText: boolean;
      alignment: "items-start" | "items-center" | "items-end";
    };
  };
};

const createTranslatableString = (value: string): TranslatableString => ({
  defaultValue: value,
  hasLocalizedValue: "true",
});

const resolveTranslatableStringValue = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback = "",
) =>
  value
    ? resolveComponentData(value, locale, streamDocument)?.trim() || fallback
    : fallback;

const createTextField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableString> => ({
  field,
  constantValue: createTranslatableString(value),
  constantValueEnabled,
});

const createStringField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<string> => ({
  field,
  constantValue: value,
  constantValueEnabled,
});

const defaultDarkTextColor: ThemeColor = {
  selectedColor: "black",
  contrastingColor: "white",
};

const defaultCTAStyles: ComprehensiveCTAValue["styles"] = {
  variant: "link",
  color: undefined,
  link: {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    letterSpacing: "default",
    includeCaret: "default",
  },
};

const textFieldFields = (label: string) => ({
  label,
  type: "entityField" as const,
  filter: {
    includeListsOnly: false,
    types: ["type.string" as const],
  },
  disableConstantValueToggle: false,
});

const textWithColorFields = (label: string) => ({
  label,
  type: "object" as const,
  objectFields: {
    text: textFieldFields(label),
    styles: {
      label: "Text Styles",
      type: "styledText" as const,
    },
    fontColor: {
      label: "Font Color",
      type: "basicSelector" as const,
      options: "SITE_COLOR" as const,
    },
  },
});

const createStyledTextValue = (): StyledTextValue => ({
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
});

const createTextWithColor = (value: string): TextWithColor => ({
  text: createTextField(value),
  styles: createStyledTextValue(),
  fontColor: undefined,
});

const defaultDetailsItem: TextWithColor = {
  text: createTextField("Lorem Ipsum detail"),
  styles: createStyledTextValue(),
  fontColor: defaultDarkTextColor,
};

const defaultDetailRow: DetailRow = {
  item: defaultDetailsItem,
};

const defaultPhoneItem: PhoneItemProps = {
  number: createStringField(""),
  label: "",
};

const defaultCTA = (label: string, link: string): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label: createTranslatableString(label),
        link,
        normalizeLink: true,
        openInNewTab: false,
        ctaType: "textAndLink",
      },
      constantValueEnabled: true,
    },
    openInNewTab: false,
  },
  styles: defaultCTAStyles,
});

export const YextCafeAndCoffeeShopDetailsFields: YextFields<YextCafeAndCoffeeShopDetailsProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
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
    heading: {
      ...textWithColorFields("Heading"),
    },
    address: {
      label: "Address",
      type: "object",
      objectFields: {
        subheading: textWithColorFields("Subheading"),
        address: {
          label: "Address",
          type: "entityField",
          filter: {
            types: ["type.address"],
          },
          disableConstantValueToggle: false,
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
      },
    },
    phone: {
      label: "Phone",
      type: "object",
      objectFields: {
        subheading: textWithColorFields("Subheading"),
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
            label: {
              label: "Label",
              type: "text",
            },
          },
          defaultItemProps: defaultPhoneItem,
          getItemSummary: (item) =>
            item.label ||
            item.number?.constantValue ||
            item.number?.field ||
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
      },
    },
    websiteLink: {
      label: "CTA 1",
      type: "comprehensiveCTA",
    },
    directionsLink: {
      label: "CTA 2",
      type: "comprehensiveCTA",
    },
    otherDetails: {
      label: "Other Details",
      type: "object",
      objectFields: {
        subheading: textWithColorFields("Subheading"),
        items: {
          label: "Content",
          type: "array",
          arrayFields: {
            item: {
              label: "Detail",
              type: "object",
              objectFields: {
                text: textFieldFields("Detail"),
                styles: {
                  label: "Text Styles",
                  type: "styledText",
                },
                fontColor: {
                  label: "Font Color",
                  type: "basicSelector",
                  options: "SITE_COLOR",
                },
              },
            },
          },
          defaultItemProps: defaultDetailRow,
          getItemSummary: (row, index) =>
            resolveTranslatableStringValue(
              row.item.text.constantValue,
              "en",
              undefined,
              `Detail ${(index ?? 0) + 1}`,
            ) || `Detail ${(index ?? 0) + 1}`,
        },
      },
    },
    hours: {
      label: "Hours",
      type: "object",
      objectFields: {
        subheading: textWithColorFields("Subheading"),
        hours: {
          label: "Hours",
          type: "entityField",
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
          },
        },
      },
    },
  };

const YextCafeAndCoffeeShopDetailsDefaultProps: YextCafeAndCoffeeShopDetailsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: createTextWithColor("Restaurant Details"),
    address: {
      subheading: createTextWithColor("Address"),
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          postalCode: "",
          countryCode: "",
          region: "",
        },
        constantValueEnabled: false,
      } as YextEntityField<AddressType>,
      showRegion: true,
      showCountry: false,
    },
    phone: {
      subheading: createTextWithColor("Phone"),
      items: [defaultPhoneItem],
      phoneFormat: "domestic",
      includeHyperlink: true,
    },
    websiteLink: {
      ...defaultCTA("CTA 1", "#"),
    },
    directionsLink: {
      ...defaultCTA("CTA 2", "#"),
    },
    otherDetails: {
      subheading: createTextWithColor("Location Services"),
      items: [
        {
          item: {
            text: createTextField("Lorem: $ $"),
            styles: createStyledTextValue(),
            fontColor: undefined,
          },
        },
        {
          item: {
            text: createTextField("Cuisine: Lorem ipsum, dolor sit amet"),
            styles: createStyledTextValue(),
            fontColor: undefined,
          },
        },
        {
          item: {
            text: createTextField("Meals served: Lorem brunch, lunch, dinner"),
            styles: createStyledTextValue(),
            fontColor: undefined,
          },
        },
      ],
    },
    hours: {
      subheading: createTextWithColor("Dining Hours"),
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      } as YextEntityField<HoursType>,
      hoursStyles: {
        startOfWeek: "monday",
        collapseDays: false,
        showAdditionalHoursText: false,
        alignment: "items-start",
      },
    },
  };

const yextCafeAndCoffeeShopStyles = String.raw`
p {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
li {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
h1 {
  font-family: var(--fontFamily-h1-fontFamily);
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h1-fontWeight);
  font-style: var(--fontStyle-h1-fontStyle);
  text-transform: var(--textTransform-h1-textTransform);
}
h2 {
  font-family: var(--fontFamily-h2-fontFamily);
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h2-fontWeight);
  font-style: var(--fontStyle-h2-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h3 {
  font-family: var(--fontFamily-h3-fontFamily);
  font-size: var(--fontSize-h3-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h3-fontWeight);
  font-style: var(--fontStyle-h3-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h4 {
  font-family: var(--fontFamily-h4-fontFamily);
  font-size: var(--fontSize-h4-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h4-fontWeight);
  font-style: var(--fontStyle-h4-fontStyle);
  text-transform: var(--textTransform-h4-textTransform);
}
h5 {
  font-family: var(--fontFamily-h5-fontFamily);
  font-size: var(--fontSize-h5-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h5-fontWeight);
  font-style: var(--fontStyle-h5-fontStyle);
  text-transform: var(--textTransform-h5-textTransform);
}
h6 {
  font-family: var(--fontFamily-h6-fontFamily);
  font-size: var(--fontSize-h6-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h6-fontWeight);
  font-style: var(--fontStyle-h6-fontStyle);
  text-transform: var(--textTransform-h6-textTransform);
}
a, button {
  font-family: var(--fontFamily-link-fontFamily);
  font-size: var(--fontSize-link-fontSize);
  font-weight: var(--fontWeight-link-fontWeight);
  font-style: var(--fontStyle-link-fontStyle);
  line-height: 1.5;
  text-decoration: underline;
  text-transform: var(--textTransform-link-textTransform);
  letter-spacing: var(--letterSpacing-link-letterSpacing);
}
#local-section-template--23715283763541__flex_grid_jfAa6Y,
#local-section-template--23715283763541__flex_grid_jfAa6Y * {
  box-sizing: border-box;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1px solid;
  text-decoration: none;
  font-size: 16px;
  line-height: 1;
  font-weight: 400;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, opacity 0.18s ease;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .button--small {
  padding: 0.5rem 1rem;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .button.button--outline {
  background-color: transparent !important;
}

.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_grid_jfAa6Y .button.button--has-fill:hover,
.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_grid_jfAa6Y .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .button:focus-visible {
  outline: 2px solid rgba(0,0,0,0.45);
  outline-offset: 2px;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__inner {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__title {
  margin: 0 0 2rem;
  text-align: center;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__grid::before {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: 50%;
  width: 1px;
  transform: translateX(-0.5px);
  background: color-mix(
    in srgb,
    var(--details-divider-color, #2a2a2a) 18%,
    transparent
  );
  pointer-events: none;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__card {
  border-radius: 16px;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__card h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 600;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__card h3:not(:first-child) {
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__card h3:first-child {
  margin-bottom: 0.42rem;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__card p,
#local-section-template--23715283763541__flex_grid_jfAa6Y .cantina-detail-value,
#local-section-template--23715283763541__flex_grid_jfAa6Y .hours,
#local-section-template--23715283763541__flex_grid_jfAa6Y .hours__note {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.2rem 0 0.1rem !important;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__links a:not(.button) {
  text-decoration: underline;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 400;
  padding-bottom: 3px;
  transition: color 0.16s ease;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__links a:not(.button):hover,
#local-section-template--23715283763541__flex_grid_jfAa6Y .details__links a:not(.button):focus-visible {
  outline: none;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours,
#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable {
  width: 100%;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-row {
  width: 100%;
  justify-content: space-between;
  gap: 1.5rem;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-day {
  flex: 1 1 0;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-intervals {
  flex: 1 1 0;
  align-items: flex-end;
  text-align: right;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours.items-start .HoursTable-intervals {
  align-items: flex-start;
  text-align: left;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours.items-center .HoursTable-intervals {
  align-items: center;
  text-align: center;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours.items-end .HoursTable-intervals {
  align-items: flex-end;
  text-align: right;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .hours__note {
  margin: 1.1rem 0 0 !important;
  font-size: 16px !important;
  line-height: 1.5;
}

#local-section-template--23715283763541__flex_grid_jfAa6Y .hours__note strong {
  font-weight: 700;
}

@media (max-width: 1023px) {
  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__inner {
    padding-inline: 30px;
  }

  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__title {
    text-align: left;
  }

  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__grid {
    grid-template-columns: 1fr;
  }

  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__grid::before {
    display: none;
  }
}

@media (max-width: 700px) {
  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__inner {
    padding-inline: 14px;
  }

  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-row {
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
  }

  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-day,
  #local-section-template--23715283763541__flex_grid_jfAa6Y .details__hours .HoursTable-intervals {
    flex: 1 1 9rem;
  }
}
`;

const toThemeCss = (token?: string) => {
  if (!token) {
    return undefined;
  }

  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }

  if (token === "white") {
    return "#ffffff";
  }

  if (token === "black") {
    return "#000000";
  }

  if (token.endsWith("-light")) {
    return `hsl(from var(--colors-${token.replace("-light", "")}) h s 98)`;
  }

  if (token.endsWith("-dark")) {
    return `hsl(from var(--colors-${token.replace("-dark", "")}) h s 20)`;
  }

  if (token.startsWith("palette-")) {
    return `var(--colors-${token})`;
  }

  return token;
};

const hasExplicitCtaColor = (cta: CtaColorState) => {
  const selectedColor = cta.styles?.color?.selectedColor;
  return Boolean(selectedColor && selectedColor !== "default");
};

const getStyledTextCss = (
  styles: StyledTextValue,
  color?: ThemeColor,
): React.CSSProperties => ({
  color: toThemeCss(color?.selectedColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const getPhoneRegionCode = (address: AddressType | null) => {
  const countryCode = address?.countryCode?.trim().toUpperCase();
  return countryCode?.length === 2 ? countryCode : "US";
};

const resolveTextFieldValue = (
  field: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallback = "",
) =>
  resolveComponentData(field, locale, streamDocument)?.trim() ||
  resolveTranslatableStringValue(
    field.constantValue,
    locale,
    streamDocument,
    fallback,
  ).trim();

const YextCafeAndCoffeeShopDetailsComponent: PuckComponent<
  YextCafeAndCoffeeShopDetailsProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const isEditing = Boolean(props.puck?.isEditing);
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
    "Restaurant Details",
  );
  const resolvedAddress = resolveComponentData(
    props.address.address,
    locale,
    streamDocument,
  );
  const normalizedAddress =
    resolvedAddress ?? props.address.address.constantValue ?? null;
  const phoneRegionCode = getPhoneRegionCode(
    normalizedAddress as AddressType | null,
  );
  const resolvedPhoneItems = (props.phone.items ?? [])
    .map((item) => {
      const resolvedNumber = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const normalizedNumber =
        typeof resolvedNumber === "string"
          ? resolvedNumber.trim()
          : (item.number.constantValue?.trim?.() ?? "");

      if (!normalizedNumber) {
        return null;
      }

      const parsedPhoneNumber = parsePhoneNumber(normalizedNumber, {
        regionCode: phoneRegionCode,
      });
      const formattedNumber =
        parsedPhoneNumber.valid && parsedPhoneNumber.number
          ? props.phone.phoneFormat === "international"
            ? parsedPhoneNumber.number.international
            : parsedPhoneNumber.number.national
          : normalizedNumber;

      return {
        label: item.label?.trim() ?? "",
        originalNumber: normalizedNumber,
        formattedNumber,
        telDigits: normalizedNumber.replace(/\D/g, ""),
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
      };
    })
    .filter(
      (
        item,
      ): item is {
        label: string;
        originalNumber: string;
        formattedNumber: string;
        telDigits: string;
        fieldId: string;
        constantValueEnabled: boolean | undefined;
      } => item !== null,
    );
  const hoursValue = resolveComponentData(
    props.hours.hours,
    locale,
    streamDocument,
  );
  const additionalHoursText =
    typeof (streamDocument as Record<string, unknown>).additionalHoursText ===
    "string"
      ? (streamDocument as Record<string, string>).additionalHoursText.trim()
      : "";
  const dividerColor =
    toThemeCss(props.section.backgroundColor.contrastingColor) ?? "#2a2a2a";
  const addressSubheading = resolveTextFieldValue(
    props.address.subheading.text,
    locale,
    streamDocument,
  );
  const phoneSubheading = resolveTextFieldValue(
    props.phone.subheading.text,
    locale,
    streamDocument,
  );
  const otherDetailsSubheading = resolveTextFieldValue(
    props.otherDetails.subheading.text,
    locale,
    streamDocument,
  );
  const hoursSubheading = resolveTextFieldValue(
    props.hours.subheading.text,
    locale,
    streamDocument,
  );
  const getDetailsCtaClassName = (cta: unknown) => {
    const variant = (cta as { styles?: { variant?: string } }).styles?.variant;

    if (variant === "link") {
      return undefined;
    }

    return variant === "outline" || variant === "secondary"
      ? "button button--small button--outline"
      : "button button--small button--has-fill";
  };
  const getDetailsCtaStyle = (
    cta: CtaColorState,
  ): React.CSSProperties | undefined => {
    const variant = cta.styles?.variant as string | undefined;

    if (
      (variant !== "outline" && variant !== "secondary") ||
      hasExplicitCtaColor(cta)
    ) {
      return undefined;
    }

    const fallbackOutlineColor = isDarkColor(
      props.section.backgroundColor,
      streamDocument,
    )
      ? "white"
      : "black";

    return {
      color: fallbackOutlineColor,
      borderColor: fallbackOutlineColor,
    };
  };

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopDetails${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <Background
          className="cafe-scope no-touchevents page-caffeine"
          background={props.section.backgroundColor}
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <section
            id="local-section-template--23715283763541__flex_grid_jfAa6Y"
            className="local-section details-section section-details"
          >
            <div className="details__inner">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="details__title"
                  style={getStyledTextCss(
                    props.heading.styles,
                    props.heading.fontColor,
                  )}
                >
                  {headingText}
                </h2>
              </EntityField>
              <div
                className="details__grid"
                style={
                  {
                    "--details-divider-color": dividerColor,
                  } as React.CSSProperties
                }
              >
                <article className="details__card">
                  {addressSubheading ? (
                    <EntityField
                      displayName="Address Subheading"
                      fieldId={props.address.subheading.text.field}
                      constantValueEnabled={
                        props.address.subheading.text.constantValueEnabled
                      }
                    >
                      <h3
                        style={getStyledTextCss(
                          props.address.subheading.styles,
                          props.address.subheading.fontColor,
                        )}
                      >
                        {addressSubheading}
                      </h3>
                    </EntityField>
                  ) : null}
                  {normalizedAddress ? (
                    <EntityField
                      displayName="Address"
                      fieldId={props.address.address.field}
                      constantValueEnabled={
                        props.address.address.constantValueEnabled
                      }
                    >
                      <Address
                        address={normalizedAddress as AddressType}
                        showRegion={props.address.showRegion}
                        showCountry={props.address.showCountry}
                      />
                    </EntityField>
                  ) : null}
                  {phoneSubheading ? (
                    <EntityField
                      displayName="Phone Subheading"
                      fieldId={props.phone.subheading.text.field}
                      constantValueEnabled={
                        props.phone.subheading.text.constantValueEnabled
                      }
                    >
                      <h3
                        style={getStyledTextCss(
                          props.phone.subheading.styles,
                          props.phone.subheading.fontColor,
                        )}
                      >
                        {phoneSubheading}
                      </h3>
                    </EntityField>
                  ) : null}
                  <div>
                    {resolvedPhoneItems.map((item) => {
                      const content = item.label
                        ? `${item.label} ${item.formattedNumber}`
                        : item.formattedNumber;

                      return (
                        <EntityField
                          key={`${item.label}-${item.originalNumber}`}
                          displayName={
                            item.label ? `${item.label} Phone` : "Phone Number"
                          }
                          fieldId={item.fieldId}
                          constantValueEnabled={item.constantValueEnabled}
                        >
                          <div>
                            {props.phone.includeHyperlink && item.telDigits ? (
                              <Link
                                cta={{
                                  link: item.telDigits,
                                  linkType: "PHONE",
                                }}
                              >
                                {content}
                              </Link>
                            ) : (
                              <span>{content}</span>
                            )}
                          </div>
                        </EntityField>
                      );
                    })}
                  </div>
                  <p className="details__links">
                    <EntityField
                      displayName="Website Link"
                      fieldId={props.websiteLink.data.cta.field}
                      constantValueEnabled={
                        props.websiteLink.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={
                          props.websiteLink as Partial<ComprehensiveCTAValue>
                        }
                        className={getDetailsCtaClassName(props.websiteLink)}
                        style={getDetailsCtaStyle(props.websiteLink)}
                      />
                    </EntityField>
                    <EntityField
                      displayName="Directions Link"
                      fieldId={props.directionsLink.data.cta.field}
                      constantValueEnabled={
                        props.directionsLink.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        value={
                          props.directionsLink as Partial<ComprehensiveCTAValue>
                        }
                        className={getDetailsCtaClassName(props.directionsLink)}
                        style={getDetailsCtaStyle(props.directionsLink)}
                      />
                    </EntityField>
                  </p>
                  {otherDetailsSubheading ? (
                    <EntityField
                      displayName="Other Details Subheading"
                      fieldId={props.otherDetails.subheading.text.field}
                      constantValueEnabled={
                        props.otherDetails.subheading.text.constantValueEnabled
                      }
                    >
                      <h3
                        style={getStyledTextCss(
                          props.otherDetails.subheading.styles,
                          props.otherDetails.subheading.fontColor,
                        )}
                      >
                        {otherDetailsSubheading}
                      </h3>
                    </EntityField>
                  ) : null}
                  {props.otherDetails.items.map(({ item }, index) => (
                    <EntityField
                      key={`${index}-${item.text.field || resolveTranslatableStringValue(item.text.constantValue, locale, streamDocument, "detail")}`}
                      displayName={`Other Detail ${index + 1}`}
                      fieldId={item.text.field}
                      constantValueEnabled={item.text.constantValueEnabled}
                    >
                      <p
                        style={{
                          color: toThemeCss(item.fontColor?.selectedColor),
                        }}
                      >
                        {resolveTextFieldValue(
                          item.text,
                          locale,
                          streamDocument,
                        )}
                      </p>
                    </EntityField>
                  ))}
                </article>
                <article className="details__card">
                  {hoursSubheading ? (
                    <EntityField
                      displayName="Hours Subheading"
                      fieldId={props.hours.subheading.text.field}
                      constantValueEnabled={
                        props.hours.subheading.text.constantValueEnabled
                      }
                    >
                      <h3
                        style={getStyledTextCss(
                          props.hours.subheading.styles,
                          props.hours.subheading.fontColor,
                        )}
                      >
                        {hoursSubheading}
                      </h3>
                    </EntityField>
                  ) : null}
                  {hoursValue ? (
                    <div
                      className={`details__hours flex flex-col ${props.hours.hoursStyles.alignment}`}
                    >
                      <EntityField
                        displayName="Hours"
                        fieldId={props.hours.hours.field}
                        constantValueEnabled={
                          props.hours.hours.constantValueEnabled
                        }
                      >
                        <HoursTable
                          hours={hoursValue}
                          comingSoon={streamDocument.comingSoon}
                          startOfWeek={props.hours.hoursStyles.startOfWeek}
                          collapseDays={props.hours.hoursStyles.collapseDays}
                        />
                      </EntityField>
                      {props.hours.hoursStyles.showAdditionalHoursText &&
                      additionalHoursText ? (
                        <p className="hours__note">{additionalHoursText}</p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              </div>
            </div>
          </section>
        </Background>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopDetails: YextComponentConfig<YextCafeAndCoffeeShopDetailsProps> =
  {
    label: "Details",
    fields: YextCafeAndCoffeeShopDetailsFields,
    defaultProps: YextCafeAndCoffeeShopDetailsDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopDetailsComponent {...props} />,
  };
