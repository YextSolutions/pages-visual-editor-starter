import { parsePhoneNumber } from "awesome-phonenumber";
import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { Link } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type {
  AddressType,
  DayOfWeekNames,
  HoursType,
  IntervalType,
  WeekType,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
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

type TextListProps = {
  text: YextEntityField<TranslatableString[]>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type YextBarSocialDiningDetailsSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledTextProps;
  findUsHeading: StyledTextProps;
  hoursHeading: StyledTextProps;
  offeringsHeading: StyledTextProps;
  address: YextEntityField<AddressType>;
  showRegion: boolean;
  showCountry: boolean;
  phones: PhoneFieldProps;
  directionsCta: ComprehensiveCTAValue;
  websiteCta: ComprehensiveCTAValue;
  hours: YextEntityField<HoursType>;
  hoursStyles: {
    startOfWeek: keyof DayOfWeekNames | "today";
    collapseDays: boolean;
    showAdditionalHoursText: boolean;
    alignment: "items-start" | "items-center" | "items-end";
  };
  offerings: TextListProps;
};

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
    "palette-primary-dark": "hsl(from var(--colors-palette-primary) h s 20)",
    "palette-secondary-dark":
      "hsl(from var(--colors-palette-secondary) h s 20)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (surfaceColor: ThemeColor): ThemeColor => {
  switch (surfaceColor.selectedColor) {
    case "white":
    case "palette-primary-light":
    case "palette-secondary-light":
    case "palette-tertiary-light":
    case "palette-quaternary-light":
      return {
        selectedColor: "black",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "black":
    case "palette-primary-dark":
    case "palette-secondary-dark":
      return {
        selectedColor: "white",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-primary":
      return {
        selectedColor: "palette-primary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-secondary":
      return {
        selectedColor: "palette-secondary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-tertiary":
      return {
        selectedColor: "palette-tertiary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-quaternary":
      return {
        selectedColor: "palette-quaternary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    default:
      return {
        selectedColor: surfaceColor.contrastingColor || "black",
        contrastingColor: surfaceColor.selectedColor,
      };
  }
};

const resolveTextColor = (
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(fontColor)
      ? fontColor
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
): string => {
  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumberString.replace(/[^\d+]/g, ""),
  );
  if (!parsedPhoneNumber.valid || !parsedPhoneNumber.number) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international
    : parsedPhoneNumber.number.national;
};

const createOutlineCta = (label: string): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        ctaType: "textAndLink",
        label: {
          defaultValue: label,
          hasLocalizedValue: "true",
        },
        link: {
          defaultValue: "#",
          hasLocalizedValue: "true",
        },
        linkType: "URL",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
  },
  styles: {
    variant: "secondary",
    color: {
      selectedColor: "[#171219]",
      contrastingColor: "white",
    },
    button: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      borderRadius: "default",
    },
    link: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      includeCaret: "default",
    },
  },
});

const textStyle = (
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): React.CSSProperties => ({
  color: resolveTextColor(fontColor, surfaceColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const paragraphTextStyle = (
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): React.CSSProperties => ({
  ...textStyle(styles, fontColor, surfaceColor),
  lineHeight: 1.5,
  margin: 0,
});

const detailsScopeClass = "bar-social-dining-details";
const detailsScopedTypographyCss = `
  .${detailsScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${detailsScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${detailsScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${detailsScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${detailsScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${detailsScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${detailsScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${detailsScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${detailsScopeClass} .bar-social-dining-link-typography a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const orderedWeekDays: (keyof WeekType)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayLabels: Record<keyof WeekType, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const formatAddressLines = (
  address: AddressType,
  locale: string,
  showRegion: boolean,
  showCountry: boolean,
): string[] => {
  const line1 = address.line1?.trim() ?? "";
  const line2 = address.line2?.trim() ?? "";
  const city = address.city?.trim() ?? "";
  const region = showRegion ? (address.region?.trim() ?? "") : "";
  const postalCode = address.postalCode?.trim() ?? "";
  const localityLine = city
    ? [city, region].filter(Boolean).join(", ")
    : region;
  const cityRegionPostalLine = [localityLine, postalCode]
    .filter(Boolean)
    .join(localityLine && postalCode ? " " : "");
  const countryCode = showCountry ? (address.countryCode?.trim() ?? "") : "";
  const countryLine =
    countryCode && typeof Intl.DisplayNames === "function"
      ? (new Intl.DisplayNames([locale], { type: "region" }).of(
          countryCode.toUpperCase(),
        ) ?? countryCode)
      : countryCode;

  return [line1, line2, cityRegionPostalLine, countryLine].filter(Boolean);
};

const formatHoursTime = (value: string, locale: string): string => {
  const [hourString, minuteString] = value.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
};

const formatHoursIntervals = (
  intervals: IntervalType[] | undefined,
  locale: string,
): string => {
  if (!intervals?.length) {
    return "Closed";
  }

  if (
    intervals.length === 1 &&
    intervals[0]?.start === "00:00" &&
    (intervals[0]?.end === "23:59" || intervals[0]?.end === "24:00")
  ) {
    return "Open 24 Hours";
  }

  return intervals
    .map((interval) => {
      return `${formatHoursTime(interval.start, locale)} - ${formatHoursTime(
        interval.end,
        locale,
      )}`;
    })
    .join(", ");
};

const buildHoursRows = (
  hours: HoursType,
  locale: string,
  startOfWeek: keyof DayOfWeekNames | "today",
  collapseDays: boolean,
): { dayLabel: string; intervalsLabel: string }[] => {
  const startIndex =
    startOfWeek === "today"
      ? (() => {
          const today = new Date().getDay();
          return today === 0 ? 6 : today - 1;
        })()
      : Math.max(orderedWeekDays.indexOf(startOfWeek), 0);
  const orderedDays = [
    ...orderedWeekDays.slice(startIndex),
    ...orderedWeekDays.slice(0, startIndex),
  ];
  const rows = orderedDays.map((dayKey) => {
    const day = hours[dayKey];
    const intervalsLabel = day?.isClosed
      ? "Closed"
      : formatHoursIntervals(day?.openIntervals, locale);

    return {
      dayKey,
      dayLabel: dayLabels[dayKey],
      intervalsLabel,
    };
  });

  if (!collapseDays || rows.length === 0) {
    return rows.map(({ dayLabel, intervalsLabel }) => ({
      dayLabel,
      intervalsLabel,
    }));
  }

  return rows.reduce<{ dayLabel: string; intervalsLabel: string }[]>(
    (collapsedRows, row) => {
      const previousRow = collapsedRows[collapsedRows.length - 1];

      if (!previousRow || previousRow.intervalsLabel !== row.intervalsLabel) {
        collapsedRows.push({
          dayLabel: row.dayLabel,
          intervalsLabel: row.intervalsLabel,
        });
        return collapsedRows;
      }

      previousRow.dayLabel = `${previousRow.dayLabel} - ${row.dayLabel}`;
      return collapsedRows;
    },
    [],
  );
};

const normalizeTextList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (typeof item === "object" && item !== null && "defaultValue" in item) {
        const localizedItem = item as { defaultValue?: string };
        return localizedItem.defaultValue ?? "";
      }

      return "";
    })
    .filter((item) => item.length > 0);
};

const YextBarSocialDiningDetailsSectionFields: YextFields<YextBarSocialDiningDetailsSectionProps> =
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
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
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
    findUsHeading: {
      label: "Find Us Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
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
    hoursHeading: {
      label: "Hours Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
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
    offeringsHeading: {
      label: "Offerings Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
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
            label: {
              label: "Label",
              type: "text",
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            },
            label: "",
          },
          getItemSummary: (item) => item.label || item.number?.field || "Phone",
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
    directionsCta: {
      label: "Directions CTA",
      type: "comprehensiveCTA",
    },
    websiteCta: {
      label: "Website CTA",
      type: "comprehensiveCTA",
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
      },
    },
    offerings: {
      label: "Offerings",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text List",
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
          },
        },
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
  };

const YextBarSocialDiningDetailsSectionComponent: PuckComponent<
  YextBarSocialDiningDetailsSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument<{
    locale?: string;
    comingSoon?: boolean;
    additionalHoursText?: string;
  }>();
  const locale = streamDocument.locale ?? "en";
  const sectionForeground = resolveTextColor(
    undefined,
    props.section.backgroundColor,
  );
  const resolvedHeading = resolveComponentData(
    props.heading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedFindUsHeading = resolveComponentData(
    props.findUsHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedHoursHeading = resolveComponentData(
    props.hoursHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedOfferingsHeading = resolveComponentData(
    props.offeringsHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedAddress = resolveComponentData(
    props.address,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const resolvedOfferings = normalizeTextList(
    resolveComponentData(props.offerings.text, locale, streamDocument),
  );
  const resolvedAddressLines = resolvedAddress
    ? formatAddressLines(
        resolvedAddress,
        locale,
        props.showRegion,
        props.showCountry,
      )
    : [];
  const resolvedHoursRows = resolvedHours
    ? buildHoursRows(
        resolvedHours,
        locale,
        props.hoursStyles.startOfWeek,
        props.hoursStyles.collapseDays,
      )
    : [];
  const hasOfferings = resolvedOfferings.length > 0;
  const additionalHoursText =
    typeof streamDocument.additionalHoursText === "string"
      ? streamDocument.additionalHoursText.trim()
      : "";
  const resolvedPhoneItems = (props.phones.items ?? []).flatMap((item) => {
    const resolvedNumber = resolveComponentData(
      item.number,
      locale,
      streamDocument,
    );
    const normalizedNumber =
      typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";

    if (!normalizedNumber) {
      return [];
    }

    return [
      {
        label: item.label?.trim() ?? "",
        formattedNumber: formatPhoneNumber(
          normalizedNumber,
          props.phones.phoneFormat,
        ),
        linkValue: normalizedNumber.replace(/[^\d+]/g, ""),
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
      },
    ];
  });
  const hoursAlignment =
    props.hoursStyles.alignment === "items-center"
      ? "center"
      : props.hoursStyles.alignment === "items-end"
        ? "flex-end"
        : "flex-start";

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningDetailsSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{detailsScopedTypographyCss}</style>
        <section
          className={detailsScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
            color: sectionForeground,
            padding: "72px 24px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: "var(--maxWidth-pageSection-contentWidth, 1200px)",
            }}
          >
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  style={{
                    ...textStyle(
                      props.heading.styles,
                      props.heading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: 0,
                  }}
                >
                  {typeof resolvedHeading === "string" ? resolvedHeading : ""}
                </h2>
              </EntityField>
            </div>
            <div
              style={{
                display: "grid",
                gap: "28px",
                gridTemplateColumns: hasOfferings
                  ? "repeat(auto-fit, minmax(260px, 1fr))"
                  : "repeat(auto-fit, minmax(320px, 1fr))",
              }}
            >
              <article>
                <EntityField
                  displayName="Find Us Heading"
                  fieldId={props.findUsHeading.text.field}
                  constantValueEnabled={
                    props.findUsHeading.text.constantValueEnabled
                  }
                >
                  <h3
                    style={{
                      ...textStyle(
                        props.findUsHeading.styles,
                        props.findUsHeading.fontColor,
                        props.section.backgroundColor,
                      ),
                      margin: "0 0 8px",
                    }}
                  >
                    {typeof resolvedFindUsHeading === "string"
                      ? resolvedFindUsHeading
                      : ""}
                  </h3>
                </EntityField>
                {resolvedAddress ? (
                  <EntityField
                    displayName="Address"
                    fieldId={props.address.field}
                    constantValueEnabled={props.address.constantValueEnabled}
                  >
                    <div
                      style={{
                        ...paragraphTextStyle(
                          {
                            fontFamily: "default",
                            fontSize: "default",
                            fontWeight: "default",
                            fontStyle: "default",
                            textTransform: "default",
                          },
                          undefined,
                          props.section.backgroundColor,
                        ),
                        color: sectionForeground,
                      }}
                    >
                      {resolvedAddressLines.map((line, index) => (
                        <p
                          key={`${line}-${index}`}
                          style={{ color: "inherit", margin: 0 }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </EntityField>
                ) : null}
                <div
                  className="bar-social-dining-link-typography"
                  style={{
                    ...paragraphTextStyle(
                      {
                        fontFamily: "default",
                        fontSize: "default",
                        fontWeight: "default",
                        fontStyle: "default",
                        textTransform: "default",
                      },
                      undefined,
                      props.section.backgroundColor,
                    ),
                    color: sectionForeground,
                    marginTop: "8px",
                  }}
                >
                  {resolvedPhoneItems.map((item, index) => (
                    <EntityField
                      key={`${item.fieldId}-${index}`}
                      displayName="Phone Number"
                      fieldId={item.fieldId}
                      constantValueEnabled={item.constantValueEnabled}
                    >
                      {props.phones.includeHyperlink ? (
                        <p style={{ margin: 0 }}>
                          {item.label ? `${item.label} ` : null}
                          <Link
                            cta={{
                              link: item.linkValue,
                              linkType: "PHONE",
                            }}
                            eventName="phoneCta"
                            style={{ color: "inherit" }}
                          >
                            {item.formattedNumber}
                          </Link>
                        </p>
                      ) : (
                        <p style={{ margin: 0 }}>
                          {item.label
                            ? `${item.label} ${item.formattedNumber}`
                            : item.formattedNumber}
                        </p>
                      )}
                    </EntityField>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  <EntityField
                    displayName="Directions CTA"
                    fieldId={props.directionsCta.data.cta.field}
                    constantValueEnabled={
                      props.directionsCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={
                        props.directionsCta as Partial<ComprehensiveCTAValue>
                      }
                      eventName="getDirections"
                    />
                  </EntityField>
                  <EntityField
                    displayName="Website CTA"
                    fieldId={props.websiteCta.data.cta.field}
                    constantValueEnabled={
                      props.websiteCta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={props.websiteCta as Partial<ComprehensiveCTAValue>}
                      eventName="websiteCta"
                    />
                  </EntityField>
                </div>
              </article>
              <article>
                <EntityField
                  displayName="Hours Heading"
                  fieldId={props.hoursHeading.text.field}
                  constantValueEnabled={
                    props.hoursHeading.text.constantValueEnabled
                  }
                >
                  <h3
                    style={{
                      ...textStyle(
                        props.hoursHeading.styles,
                        props.hoursHeading.fontColor,
                        props.section.backgroundColor,
                      ),
                      margin: "0 0 8px",
                    }}
                  >
                    {typeof resolvedHoursHeading === "string"
                      ? resolvedHoursHeading
                      : ""}
                  </h3>
                </EntityField>
                {resolvedHours ? (
                  <EntityField
                    displayName="Hours"
                    fieldId={props.hours.field}
                    constantValueEnabled={props.hours.constantValueEnabled}
                  >
                    <div
                      style={{
                        alignItems: hoursAlignment,
                        ...paragraphTextStyle(
                          {
                            fontFamily: "default",
                            fontSize: "default",
                            fontWeight: "default",
                            fontStyle: "default",
                            textTransform: "default",
                          },
                          undefined,
                          props.section.backgroundColor,
                        ),
                        color: sectionForeground,
                        display: "flex",
                        flexDirection: "column",
                        textAlign:
                          hoursAlignment === "center"
                            ? "center"
                            : hoursAlignment === "flex-end"
                              ? "right"
                              : "left",
                      }}
                    >
                      {streamDocument.comingSoon ? (
                        <p style={{ color: "inherit", margin: 0 }}>
                          Coming Soon
                        </p>
                      ) : (
                        resolvedHoursRows.map((row) => (
                          <p
                            key={`${row.dayLabel}-${row.intervalsLabel}`}
                            style={{ color: "inherit", margin: 0 }}
                          >
                            {`${row.dayLabel}: ${row.intervalsLabel}`}
                          </p>
                        ))
                      )}
                      {props.hoursStyles.showAdditionalHoursText &&
                      additionalHoursText ? (
                        <p style={{ color: "inherit", margin: "12px 0 0" }}>
                          {additionalHoursText}
                        </p>
                      ) : null}
                    </div>
                  </EntityField>
                ) : null}
              </article>
              {hasOfferings ? (
                <article>
                  <EntityField
                    displayName="Offerings Heading"
                    fieldId={props.offeringsHeading.text.field}
                    constantValueEnabled={
                      props.offeringsHeading.text.constantValueEnabled
                    }
                  >
                    <h3
                      style={{
                        ...textStyle(
                          props.offeringsHeading.styles,
                          props.offeringsHeading.fontColor,
                          props.section.backgroundColor,
                        ),
                        margin: "0 0 8px",
                      }}
                    >
                      {typeof resolvedOfferingsHeading === "string"
                        ? resolvedOfferingsHeading
                        : ""}
                    </h3>
                  </EntityField>
                  <EntityField
                    displayName="Text List"
                    fieldId={props.offerings.text.field}
                    constantValueEnabled={
                      props.offerings.text.constantValueEnabled
                    }
                  >
                    <ul
                      style={{
                        ...textStyle(
                          props.offerings.styles,
                          props.offerings.fontColor,
                          props.section.backgroundColor,
                        ),
                        margin: 0,
                        paddingLeft: "1rem",
                      }}
                    >
                      {resolvedOfferings.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </EntityField>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningDetailsSection: YextComponentConfig<YextBarSocialDiningDetailsSectionProps> =
  {
    label: "Details Section",
    fields: toPuckFields(YextBarSocialDiningDetailsSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Restaurant Details",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      findUsHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Find Us",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      hoursHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Hours",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      offeringsHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Offerings",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
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
      },
      showRegion: true,
      showCountry: false,
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
        includeHyperlink: true,
      },
      directionsCta: createOutlineCta("Get Directions"),
      websiteCta: createOutlineCta("Visit Us Online"),
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
      },
      offerings: {
        text: {
          field: "services",
          constantValue: [
            { defaultValue: "Dine-in", hasLocalizedValue: "true" },
            { defaultValue: "Takeout", hasLocalizedValue: "true" },
            { defaultValue: "Delivery", hasLocalizedValue: "true" },
            { defaultValue: "Curbside pickup", hasLocalizedValue: "true" },
            { defaultValue: "Call-Ahead", hasLocalizedValue: "true" },
            {
              defaultValue: "Reservations available through OpenTable",
              hasLocalizedValue: "true",
            },
            { defaultValue: "Handicap access", hasLocalizedValue: "true" },
            {
              defaultValue: "No Wi-Fi available to guests",
              hasLocalizedValue: "true",
            },
            {
              defaultValue: "Safe handling is supported",
              hasLocalizedValue: "true",
            },
          ],
          constantValueEnabled: false,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
    },
    render: (props) => (
      <YextBarSocialDiningDetailsSectionComponent {...props} />
    ),
  };
