import { useTranslation } from "react-i18next";
import { PuckComponent } from "@puckeditor/core";
import { DayOfWeekNames, HoursType } from "@yext/pages-components";
import "@yext/pages-components/style.css";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { HoursTableAtom } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

/** Props for the HoursTable component. */
export interface HoursTableProps {
  data: {
    /** The hours data to display in the table. */
    hours: YextEntityField<HoursType>;
  };
  styles: {
    /**
     * The day of week to display at the top of the table.
     * If set to "today", the current day will dynamically be at the top.
     */
    startOfWeek: keyof DayOfWeekNames | "today";
    /** If true, consecutive days that have the same hours will be collapsed into one row. */
    collapseDays: boolean;
    /** Shows the showAdditionalHoursText subfield from the hours field, if present */
    showAdditionalHoursText: boolean;
    /** Alignment of the text in the hours table */
    alignment: "items-start" | "items-center";
  };
}

// HoursTable data field used in HoursTable and CoreInfoSection
export const HoursTableDataField: YextFields<HoursTableProps["data"]>["hours"] =
  {
    type: "entityField",
    label: msg("fields.hours", "Hours"),
    filter: {
      types: ["type.hours"],
    },
  };

type HoursTableStyleFieldProps = Omit<HoursTableProps["styles"], "alignment">;

// HoursTable style fields used in HoursTable and CoreInfoSection
export const HoursTableStyleFields: YextFields<HoursTableStyleFieldProps> = {
  startOfWeek: {
    type: "basicSelector",
    label: msg("fields.startOfTheWeek", "Start of the Week"),
    options: "HOURS_OPTIONS",
  },
  collapseDays: {
    label: msg("fields.collapseDays", "Collapse Days"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  showAdditionalHoursText: {
    label: msg(
      "fields.options.showAdditionalHoursText",
      "Show Additional Hours Text"
    ),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
};

export const hoursTableFields: YextFields<HoursTableProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      hours: HoursTableDataField,
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      ...HoursTableStyleFields,
      alignment: {
        label: msg("fields.contentAlignment", "Content Alignment"),
        type: "radio",
        options: [
          { label: msg("fields.options.left", "Left"), value: "items-start" },
          {
            label: msg("fields.options.center", "Center"),
            value: "items-center",
          },
        ],
      },
    },
  },
};

const VisualEditorHoursTable: PuckComponent<HoursTableProps> = (props) => {
  const { data, styles, puck } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const comingSoon = !!streamDocument.comingSoon;
  const hours = resolveComponentData(data.hours, i18n.language, streamDocument);

  const { additionalHoursText } = streamDocument as {
    additionalHoursText: string;
  };

  return hours || comingSoon ? (
    <div className={`flex flex-col ${styles.alignment}`}>
      <EntityField
        displayName={pt("hours", "Hours")}
        fieldId="hours"
        constantValueEnabled={data.hours.constantValueEnabled}
      >
        <HoursTableAtom
          hours={hours ?? {}}
          comingSoon={comingSoon}
          startOfWeek={styles.startOfWeek}
          collapseDays={styles.collapseDays}
        />
      </EntityField>
      {additionalHoursText && styles.showAdditionalHoursText && (
        <EntityField
          displayName={pt("hoursText", "Hours Text")}
          fieldId="additionalHoursText"
        >
          <Body variant="sm" className="mt-4">
            {additionalHoursText}
          </Body>
        </EntityField>
      )}
    </div>
  ) : puck.isEditing ? (
    <div className="h-24" />
  ) : (
    <></>
  );
};

export const HoursTable: YextComponentConfig<HoursTableProps> = {
  fields: hoursTableFields,
  defaultProps: {
    data: {
      hours: {
        field: "hours",
        constantValue: {},
      },
    },
    styles: {
      startOfWeek: "today",
      collapseDays: false,
      showAdditionalHoursText: true,
      alignment: "items-center",
    },
  },
  label: msg("components.hoursTable", "Hours Table"),
  render: (props) => <VisualEditorHoursTable {...props} />,
};
