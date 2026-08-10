// @ts-nocheck
const format1: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

const format2: Intl.DateTimeFormatOptions = {
  timeZoneName: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export enum TimestampOption {
  DATE = "DATE",
  DATE_TIME = "DATE_TIME",
  DATE_RANGE = "DATE_RANGE",
  DATE_TIME_RANGE = "DATE_TIME_RANGE",
}

export type TimestampAtomProps = {
  date: string; // ISO 8601 from KG like "YYYY-MM-DDTHH:MM"
  option?: TimestampOption;
  endDate?: string; // ISO 8601 from KG like "YYYY-MM-DDTHH:MM"
  timeZone?: string;
  hideTimeZone?: boolean;
  locale?: string;
  dateFormatOverride?: Omit<Intl.DateTimeFormatOptions, "timeZone">;
  dateTimeFormatOverride?: Omit<Intl.DateTimeFormatOptions, "timeZone">;
};

type TimestampFormatterPropsType = {
  date: Date;
  option?: TimestampOption;
  endDate?: Date;
  timeZone?: string;
  hideTimeZone?: boolean;
  locale?: string;
  dateFormatOverride?: Omit<Intl.DateTimeFormatOptions, "timeZone">;
  dateTimeFormatOverride?: Omit<Intl.DateTimeFormatOptions, "timeZone">;
};

export function timestampFormatter({
  date,
  option = TimestampOption.DATE,
  endDate,
  timeZone,
  hideTimeZone,
  locale,
  dateFormatOverride,
  dateTimeFormatOverride,
}: TimestampFormatterPropsType): string {
  let dateFormat = dateFormatOverride ? { ...dateFormatOverride } : format1;
  let dateTimeFormat = dateTimeFormatOverride
    ? { ...dateTimeFormatOverride }
    : format2;

  if (timeZone) {
    dateFormat = { ...dateFormat, timeZone };
    dateTimeFormat = { ...dateTimeFormat, timeZone };
  }

  if (hideTimeZone) {
    dateTimeFormat = { ...dateTimeFormat, timeZoneName: undefined };
  }

  const localesArgument = locale ? [locale, "en-US"] : "en-US";
  const dateFormatter = new Intl.DateTimeFormat(localesArgument, dateFormat);
  const timeFormatter = new Intl.DateTimeFormat(localesArgument, {
    hour: "numeric",
    minute: "numeric",
    ...(timeZone && { timeZone }),
    ...(hideTimeZone && { timeZoneName: undefined }),
  });

  switch (option) {
    case TimestampOption.DATE:
      return dateFormatter.format(date);
    case TimestampOption.DATE_TIME:
      return new Intl.DateTimeFormat(localesArgument, dateTimeFormat).format(
        date
      );
    case TimestampOption.DATE_RANGE:
      return new Intl.DateTimeFormat(localesArgument, dateFormat).formatRange(
        date,
        endDate!
      );
    case TimestampOption.DATE_TIME_RANGE: {
      const isSameDay = date.toDateString() === endDate!.toDateString();

      const dateStr = isSameDay
        ? dateFormatter.format(date)
        : `${dateFormatter.format(date)} - ${dateFormatter.format(endDate!)}`;

      const timeStr = `${timeFormatter.format(date)} - ${timeFormatter.format(endDate!)}`;

      return `${dateStr} | ${timeStr}`;
    }
    default:
      return dateFormatter.format(date);
  }
}

export const TimestampAtom = ({
  date,
  option = TimestampOption.DATE,
  endDate = "",
  timeZone,
  hideTimeZone = false,
  locale,
  dateFormatOverride,
  dateTimeFormatOverride,
}: TimestampAtomProps): JSX.Element => {
  let timestamp;
  try {
    // For date-only strings (YYYY-MM-DD), create the date in UTC
    const startDate =
      date.length === 10 ? new Date(date + "T12:00:00.000Z") : new Date(date);
    const formattedEndDate = endDate
      ? endDate.length === 10
        ? new Date(endDate + "T12:00:00.000Z")
        : new Date(endDate)
      : undefined;

    timestamp = timestampFormatter({
      date: startDate,
      option,
      endDate: formattedEndDate,
      timeZone,
      hideTimeZone,
      locale,
      dateFormatOverride,
      dateTimeFormatOverride,
    });
  } catch (e) {
    console.warn("error formatting timestamp:", e);
    return <></>;
  }

  // standardize spacing between server and client Intl output
  const formattedTimestamp = timestamp.replaceAll("\u202F", " ");

  return (
    <div className="components font-body-fontFamily font-body-fontWeight text-body-fontSize inline-block">
      {formattedTimestamp}
    </div>
  );
};
