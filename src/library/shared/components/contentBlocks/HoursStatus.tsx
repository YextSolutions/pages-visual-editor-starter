import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import { HoursType } from "@yext/pages-components";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { HoursStatusAtom } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface HoursStatusProps {
  data: {
    /** The hours field to display the status for */
    hours: YextEntityField<HoursType>;
  };

  styles: {
    /** Whether to show the open status ("Open Now" or "Closed") */
    showCurrentStatus?: boolean;
    /** The time format to use */
    timeFormat?: "12h" | "24h";
    /** The day of week format ("Mon" vs. "Monday") */
    dayOfWeekFormat?: "short" | "long";
    /** Whether to show day names ("Monday", "Tuesday") */
    showDayNames?: boolean;
    /** Additional class names to apply to the underlying component */
    className?: string;
    /** The body size variant */
    bodyVariant?: "lg" | "base" | "sm";
  };

  /** @internal */
  parentData?: {
    field: string;
    hours?: HoursType;
    comingSoon?: boolean;
    timezone?: string;
  };
}

export const hoursStatusWrapperFields: YextFields<HoursStatusProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      hours: {
        type: "entityField",
        label: msg("fields.hours", "Hours"),
        filter: {
          types: ["type.hours"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      showCurrentStatus: {
        label: msg("fields.showCurrentStatus", "Show Current Status"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      timeFormat: {
        label: msg("fields.timeFormat", "Time Format"),
        type: "radio",
        options: [
          { label: msg("fields.options.hour12", "12-hour"), value: "12h" },
          { label: msg("fields.options.hour24", "24-hour"), value: "24h" },
        ],
      },
      showDayNames: {
        label: msg("fields.showDayNames", "Show Day Names"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      dayOfWeekFormat: {
        label: msg("fields.dayOfWeekFormat", "Day of Week Format"),
        type: "radio",
        options: [
          { label: msg("fields.options.short", "Short"), value: "short" },
          { label: msg("fields.options.long", "Long"), value: "long" },
        ],
      },
    },
  },
};

const HoursStatusWrapper: PuckComponent<HoursStatusProps> = ({
  data,
  styles,
  puck,
  parentData,
}) => {
  const streamDocument = useDocument();
  const { i18n } = useTranslation();
  const comingSoon = parentData?.comingSoon ?? !!streamDocument.comingSoon;
  const hours =
    parentData?.hours ??
    resolveComponentData(data.hours, i18n.language, streamDocument);
  const timezone = parentData?.timezone ?? streamDocument.timezone;

  return hours || comingSoon ? (
    <EntityField
      displayName={parentData ? parentData.field : pt("hours", "Hours")}
      fieldId={data.hours.field}
      constantValueEnabled={!parentData && data.hours.constantValueEnabled}
    >
      <HoursStatusAtom
        hours={hours ?? {}}
        comingSoon={comingSoon}
        timezone={timezone}
        className={styles.className}
        showCurrentStatus={styles.showCurrentStatus}
        showDayNames={styles.showDayNames}
        timeFormat={styles.timeFormat}
        dayOfWeekFormat={styles.dayOfWeekFormat}
        bodyVariant={styles.bodyVariant}
      />
    </EntityField>
  ) : puck.isEditing ? (
    <div className="h-10" />
  ) : (
    <></>
  );
};

export const HoursStatus: YextComponentConfig<HoursStatusProps> = {
  label: msg("components.hoursStatus", "Hours Status"),
  fields: hoursStatusWrapperFields,
  defaultProps: {
    data: {
      hours: {
        field: "hours",
        constantValue: {},
      },
    },
    styles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      showDayNames: true,
      dayOfWeekFormat: "long",
      className: "",
    },
  },
  resolveFields: (data) =>
    resolveDataFromParent(hoursStatusWrapperFields, data),
  render: (props) => <HoursStatusWrapper {...props} />,
};
