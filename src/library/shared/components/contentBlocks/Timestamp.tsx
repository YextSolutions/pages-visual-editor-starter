// @ts-nocheck
import { useTranslation } from "react-i18next";
import { PuckComponent, setDeep } from "@puckeditor/core";
import { msg } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { TimestampAtom, TimestampOption } from "../atoms/timestamp";
import {
  toPuckFields,
  YextComponentConfig,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export type TimestampProps = {
  /** The start and end date to display */
  data: {
    /** An ISO formatted start date  */
    date: YextEntityField<string>;
    /** An ISO formatted end date  */
    endDate: YextEntityField<string>;
  };

  styles: {
    /** Whether to display just the date or the date and time */
    includeTime: boolean;
    /** Whether to display an end date */
    includeRange: boolean;
  };

  /**
   * @internal Controlled data from the parent section.
   */
  parentData?: {
    field: string;
    date: string | undefined;
  };
};

const timestampFields: YextFields<TimestampProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      date: {
        type: "entityField",
        label: msg("fields.date", "Date"),
        filter: {
          types: ["type.datetime"],
        },
      },
      endDate: {
        type: "entityField",
        label: msg("fields.endDate", "End Date"),
        filter: {
          types: ["type.datetime"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      includeTime: {
        type: "radio",
        label: msg("fields.includeTime", "Include Time"),
        options: [
          { label: msg("fields.options.no", "No"), value: false },
          { label: msg("fields.options.yes", "Yes"), value: true },
        ],
      },
      includeRange: {
        type: "radio",
        label: msg("fields.includeRange", "Include Range"),
        options: [
          { label: msg("fields.options.no", "No"), value: false },
          { label: msg("fields.options.yes", "Yes"), value: true },
        ],
      },
    },
  },
};

const TimestampComponent: PuckComponent<TimestampProps> = (props) => {
  const { data, styles, parentData, puck } = props;
  const streamDocument = useDocument();
  const { i18n } = useTranslation();

  const resolvedDate = parentData
    ? parentData.date
    : resolveYextEntityField(streamDocument, data.date);

  const resolvedEndDate = parentData
    ? ""
    : resolveYextEntityField(streamDocument, data.endDate);

  if (!resolvedDate) {
    return puck.isEditing ? <div className="h-8 w-32" /> : <></>;
  }

  let option = (styles.includeTime ? "DATE_TIME" : "DATE") as TimestampOption;
  if (!parentData && styles.includeRange) {
    option = (option + "_RANGE") as TimestampOption;
  }

  return (
    <TimestampAtom
      date={resolvedDate}
      endDate={resolvedEndDate}
      option={option}
      locale={i18n.language}
      hideTimeZone
    />
  );
};

export const Timestamp: YextComponentConfig<TimestampProps> = {
  label: msg("components.timestamp", "Timestamp"),
  fields: timestampFields,
  defaultProps: {
    data: {
      date: {
        field: "",
        constantValue: "2022-12-12T14:00:00",
        constantValueEnabled: true,
      },
      endDate: {
        field: "",
        constantValue: "2022-12-12T15:00:00",
        constantValueEnabled: true,
      },
    },
    styles: {
      includeRange: false,
      includeTime: false,
    },
  },
  resolveFields: (data) => {
    if (data.props.parentData) {
      let fields = resolveDataFromParent(timestampFields, data);
      return toPuckFields(
        setDeep(fields, "styles.objectFields.includeRange.visible", false)
      );
    }

    setDeep(timestampFields, "styles.objectFields.includeRange.visible", true);

    if (data.props.styles.includeRange) {
      return toPuckFields(
        setDeep(timestampFields, "data.objectFields.endDate.visible", true)
      );
    }
    return toPuckFields(
      setDeep(timestampFields, "data.objectFields.endDate.visible", false)
    );
  },
  render: (props) => <TimestampComponent {...props} />,
};
