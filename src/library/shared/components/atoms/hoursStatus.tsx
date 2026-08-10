// @ts-nocheck
import {
  HoursStatus as HoursStatusJS,
  HoursType,
  StatusParams,
} from "@yext/pages-components";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import * as React from "react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export interface HoursStatusAtomProps {
  hours: HoursType;
  className?: string;
  comingSoon?: boolean;
  showCurrentStatus?: boolean;
  showDayNames?: boolean;
  timeFormat?: "12h" | "24h";
  dayOfWeekFormat?: "short" | "long";
  timezone?: string;
  boldCurrentStatus?: boolean;
  bodyVariant?: "lg" | "base" | "sm";
}

export const HoursStatusAtom = React.memo(
  ({
    hours,
    className,
    comingSoon,
    showCurrentStatus = true,
    showDayNames = true,
    timeFormat,
    dayOfWeekFormat = "long",
    timezone,
    boldCurrentStatus = true,
    bodyVariant = "lg",
  }: HoursStatusAtomProps): any => {
    const { t, i18n } = useTranslation();

    const classNameResolved = themeManagerCn(
      "components mb-2 font-body-fontFamily font-body-fontWeight",
      bodyVariant === "lg"
        ? "text-body-lg-fontSize"
        : bodyVariant === "sm"
          ? "text-body-sm-fontSize"
          : "text-body-fontSize",
      className
    );

    return (
      <HoursStatusJS
        hours={hours}
        comingSoon={comingSoon}
        className={classNameResolved}
        statusTemplate={(params: HoursStatusParams) => {
          const isComingSoon = !!params.comingSoon;
          const isFuture = !isOpen24h(params) && !isIndefinitelyClosed(params);
          let time = "";
          if (params.isOpen) {
            const interval = params.currentInterval;
            time += interval
              ? interval.getEndTime(i18n.language, params.timeOptions)
              : "";
          } else {
            const interval = params.futureInterval;
            time += interval
              ? interval.getStartTime(i18n.language, params.timeOptions)
              : "";
          }

          const showDayOfWeek = showDayNames && isFuture;
          let dayOfWeek = "";
          if (params.isOpen) {
            const interval = params.currentInterval;
            dayOfWeek +=
              interval?.end
                ?.setLocale(i18n.language)
                .toLocaleString(params.dayOptions) || "";
          } else {
            const interval = params.futureInterval;
            dayOfWeek +=
              interval?.start
                ?.setLocale(i18n.language)
                .toLocaleString(params.dayOptions) || "";
          }

          let statusText = "";
          if (isFuture && params.isOpen) {
            if (showDayOfWeek) {
              statusText = t(
                "closesAtTimeWeek",
                "Closes at {{time}} {{dayOfWeek}}",
                {
                  time,
                  dayOfWeek,
                }
              );
            } else {
              statusText = t("closesAtTime", "Closes at {{time}}", { time });
            }
          }

          if (isFuture && !params.isOpen) {
            if (showDayOfWeek) {
              statusText = t(
                "opensAtTimeWeek",
                "Opens at {{time}} {{dayOfWeek}}",
                {
                  time,
                  dayOfWeek,
                }
              );
            } else {
              statusText = t("opensAtTime", "Opens at {{time}}", { time });
            }
          }

          return (
            <div className={themeManagerCn("HoursStatus", classNameResolved)}>
              {(showCurrentStatus || isComingSoon) &&
                hoursCurrentTemplateOverride(params, t, boldCurrentStatus)}
              {!isComingSoon &&
                showCurrentStatus &&
                defaultSeparatorTemplate(params)}
              {!isComingSoon && statusText && (
                <span className="HoursStatus-future">{statusText}</span>
              )}
            </div>
          );
        }}
        dayOptions={{ weekday: dayOfWeekFormat }}
        timeOptions={timeFormat ? { hour12: timeFormat === "12h" } : undefined}
        timezone={timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
    );
  }
);

/**
 * Overrides the current status text to incorporate i18n
 * @param params used to determine the status
 * @param t translation function
 * @param boldCurrentStatus whether to bold the current status
 */
function hoursCurrentTemplateOverride(
  params: HoursStatusParams,
  t: TFunction,
  boldCurrentStatus: boolean
): React.ReactNode {
  const style = boldCurrentStatus ? { fontWeight: "bolder" } : undefined;

  if (params.comingSoon) {
    return (
      <span className="HoursStatus-current" style={style}>
        {t("comingSoon", "Coming Soon")}
      </span>
    );
  }

  if (isOpen24h(params)) {
    return (
      <span className="HoursStatus-current" style={style}>
        {t("open24Hours", "Open 24 Hours")}
      </span>
    );
  }
  if (isIndefinitelyClosed(params)) {
    return (
      <span className="HoursStatus-current" style={style}>
        {t("temporarilyClosed", "Temporarily Closed")}
      </span>
    );
  }
  return (
    <span className="HoursStatus-current" style={style}>
      {params.isOpen ? t("openNow", "Open Now") : t("closed", "Closed")}
    </span>
  );
}

function isOpen24h(params: StatusParams): boolean {
  return params?.currentInterval?.is24h?.() || false;
}

function isIndefinitelyClosed(params: StatusParams): boolean {
  return !params.futureInterval;
}

function defaultSeparatorTemplate(params: StatusParams): React.ReactNode {
  if (isOpen24h(params) || isIndefinitelyClosed(params)) {
    return null;
  }
  return <span className="HoursStatus-separator"> • </span>;
}
interface HoursStatusParams {
  isOpen: boolean;
  comingSoon?: boolean;
  currentInterval: any | null;
  futureInterval: any | null;
  timeOptions?: Intl.DateTimeFormatOptions;
  dayOptions?: Intl.DateTimeFormatOptions;
}
