// @ts-nocheck
import "./hours.css";
import { HoursTable, HoursTableProps } from "@yext/pages-components";
import { useTranslation } from "react-i18next";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";

export interface HoursTableAtomProps
  extends Omit<
    HoursTableProps,
    "dayOfWeekNames" | "intervalStringsBuilderFn" | "intervalTranslations"
  > {
  className?: string;
}

export const HoursTableAtom = (props: HoursTableAtomProps) => {
  const {
    hours,
    className,
    startOfWeek,
    collapseDays,
    timeOptions,
    comingSoon,
  } = props;

  const { t, i18n } = useTranslation();

  const dayOfWeekNames = {
    monday: t("monday", "Monday"),
    tuesday: t("tuesday", "Tuesday"),
    wednesday: t("wednesday", "Wednesday"),
    thursday: t("thursday", "Thursday"),
    friday: t("friday", "Friday"),
    saturday: t("saturday", "Saturday"),
    sunday: t("sunday", "Sunday"),
  };

  return (
    <HoursTable
      hours={hours}
      comingSoon={comingSoon}
      dayOfWeekNames={dayOfWeekNames}
      startOfWeek={startOfWeek}
      collapseDays={collapseDays}
      timeOptions={timeOptions}
      intervalTranslations={{
        isClosed: t("closed", "Closed"),
        open24Hours: t("open24Hours", "Open 24 Hours"),
        reopenDate: t("reopenDate", "Reopen Date"),
        timeFormatLocale: i18n.language,
      }}
      className={themeManagerCn(
        "text-body-fontSize font-body-fontWeight font-body-fontFamily",
        className ?? ""
      )}
    />
  );
};
