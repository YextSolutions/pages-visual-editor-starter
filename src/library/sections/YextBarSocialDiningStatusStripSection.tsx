import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import { HoursStatus } from "@yext/pages-components";
import {
  EntityField,
  type StyledTextValue,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  resolveComponentData,
  toPuckFields,
  useDocument,
} from "@yext/visual-editor";
import type { HoursType, StatusParams } from "@yext/pages-components";

type YextBarSocialDiningStatusStripSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  hours: YextEntityField<HoursType>;
  hoursStyles: {
    showCurrentStatus: boolean;
    timeFormat: "12h" | "24h";
    dayOfWeekFormat: "short" | "long";
    showDayNames: boolean;
  };
  statusText: {
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
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

/**
 * Formats the HoursStatus params into the captured single-line "Open until"
 * treatment while keeping the runtime hours primitive as the source of truth.
 */
const renderStatusLabel = (
  params: StatusParams,
  locale: string,
  timeFormat: "12h" | "24h",
  dayOfWeekFormat: "short" | "long",
  showCurrentStatus: boolean,
  showDayNames: boolean,
): string => {
  const timeOptions: Intl.DateTimeFormatOptions =
    timeFormat === "24h"
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : { hour: "numeric", minute: "2-digit", hour12: true };

  if (params.comingSoon) {
    return showCurrentStatus ? "Coming soon" : "";
  }

  if (params.isOpen && params.currentInterval) {
    return `${showCurrentStatus ? "Open until " : ""}${params.currentInterval
      .getEndTime(locale, timeOptions)
      .toLowerCase()}`;
  }

  if (params.futureInterval) {
    const formattedDay = showDayNames
      ? ` ${params.futureInterval.start.setLocale(locale).toLocaleString({
          weekday: dayOfWeekFormat === "short" ? "short" : "long",
        })}`
      : "";

    return `${showCurrentStatus ? "Closed until " : "Until "}${params.futureInterval
      .getStartTime(locale, timeOptions)
      .toLowerCase()}${formattedDay}`;
  }

  return showCurrentStatus ? "Closed today" : "";
};

const statusStripScopeClass = "bar-social-dining-status-strip";
const statusStripScopedTypographyCss = `
  .${statusStripScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${statusStripScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${statusStripScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${statusStripScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${statusStripScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${statusStripScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${statusStripScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${statusStripScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${statusStripScopeClass} .bar-social-dining-link-typography a {
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

const YextBarSocialDiningStatusStripSectionFields: YextFields<YextBarSocialDiningStatusStripSectionProps> =
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
    statusText: {
      label: "Status Text",
      type: "object",
      objectFields: {
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

const YextBarSocialDiningStatusStripSectionComponent: PuckComponent<
  YextBarSocialDiningStatusStripSectionProps
> = (props) => {
  const streamDocument = useDocument<{
    locale?: string;
    timezone?: string;
    comingSoon?: boolean;
  }>();
  const locale = streamDocument.locale ?? "en";
  const timezone =
    streamDocument.timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";
  const resolvedHours = resolveComponentData(
    props.hours,
    locale,
    streamDocument,
  );
  const backgroundColor = themeColorToCss(
    props.section.backgroundColor?.selectedColor,
  );
  const foregroundColor = resolveTextColor(
    props.statusText.fontColor,
    props.section.backgroundColor,
  );

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <style>{statusStripScopedTypographyCss}</style>
      <section
        className={statusStripScopeClass}
        style={{
          backgroundColor,
          color: foregroundColor,
          padding: "20px 16px",
          textAlign: "center",
        }}
      >
        <EntityField
          displayName="Hours"
          fieldId={props.hours.field}
          constantValueEnabled={props.hours.constantValueEnabled}
        >
          {resolvedHours ? (
            <HoursStatus
              hours={resolvedHours}
              timezone={timezone}
              comingSoon={streamDocument.comingSoon}
              timeOptions={
                props.hoursStyles.timeFormat === "24h"
                  ? { hour: "2-digit", minute: "2-digit", hour12: false }
                  : { hour: "numeric", minute: "2-digit", hour12: true }
              }
              dayOptions={{
                weekday:
                  props.hoursStyles.dayOfWeekFormat === "short"
                    ? "short"
                    : "long",
              }}
              statusTemplate={(params) => (
                <h2
                  style={{
                    margin: 0,
                    ...textStyle(
                      props.statusText.styles,
                      props.statusText.fontColor,
                      props.section.backgroundColor,
                    ),
                  }}
                >
                  {renderStatusLabel(
                    params,
                    locale,
                    props.hoursStyles.timeFormat,
                    props.hoursStyles.dayOfWeekFormat,
                    props.hoursStyles.showCurrentStatus,
                    props.hoursStyles.showDayNames,
                  )}
                </h2>
              )}
            />
          ) : props.puck.isEditing ? (
            <h2
              style={{
                margin: 0,
                ...textStyle(
                  props.statusText.styles,
                  props.statusText.fontColor,
                  props.section.backgroundColor,
                ),
              }}
            >
              Open until 9pm
            </h2>
          ) : null}
        </EntityField>
      </section>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningStatusStripSection: YextComponentConfig<YextBarSocialDiningStatusStripSectionProps> =
  {
    label: "Status Strip Section",
    fields: toPuckFields(YextBarSocialDiningStatusStripSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
        visibleOnLivePage: true,
      },
      hours: {
        field: "hours",
        constantValue: {},
        constantValueEnabled: false,
      },
      hoursStyles: {
        showCurrentStatus: true,
        timeFormat: "12h",
        dayOfWeekFormat: "short",
        showDayNames: false,
      },
      statusText: {
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
      <YextBarSocialDiningStatusStripSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "YextBarSocialDiningStatusStripSection",
  displayName: "Status Strip Section",
  description: "Status Strip Section",
  pageSetTypes: ["ENTITY"],
};
