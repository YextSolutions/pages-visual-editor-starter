import { ComponentConfig, Fields } from "@measured/puck";
import { HoursStatus } from "@yext/pages-components";
import {
  EntityField,
  resolveYextEntityField,
  YextEntityField,
  YextEntityFieldSelector,
  useDocument,
} from "@yext/visual-editor";
import { cn } from "../utils/cn";
import { config } from "../templates/location";
import { LocationStream } from "../types/autogen";

export interface HoursStatusWrapperProps {
  hours: YextEntityField;
  className?: string;
  showDayNames?: boolean;
  showCurrentStatus?: boolean;
  dayOfWeekFormat?: "short" | "long";
  timeFormat?: "12h" | "24h";
}

const hoursStatusWrapperFields: Fields<HoursStatusWrapperProps> = {
  hours: YextEntityFieldSelector<typeof config>({
    label: "Hours",
    filter: {
      types: ["type.hours"],
    },
  }),

  showDayNames: {
    type: "radio",
    label: "Show Day Names",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  showCurrentStatus: {
    type: "radio",
    label: "Show Current Status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  dayOfWeekFormat: {
    type: "select",
    label: "Day of Week Format",
    options: [
      { label: "Short", value: "short" },
      { label: "Long", value: "long" },
    ],
  },
  timeFormat: {
    type: "select",
    label: "Time Format",
    options: [
      { label: "12-hour", value: "12h" },
      { label: "24-hour", value: "24h" },
    ],
  },
};

const HoursStatusWrapper: React.FC<HoursStatusWrapperProps> = ({
  hours: hoursField,
  className,
  showDayNames,
  showCurrentStatus,
  dayOfWeekFormat,
  timeFormat,
}) => {
  const document = useDocument<LocationStream>();
  const hours = resolveYextEntityField(document, hoursField);

  if (!hours) {
    return null;
  }

  return (
    <EntityField displayName="Hours" fieldId={hoursField.field}>
      <HoursStatus
        hours={hours}
        className={cn("font-semibold mb-2", className)}
        showDayNames={showDayNames}
        showCurrentStatus={showCurrentStatus}
        dayOfWeekFormat={dayOfWeekFormat}
        timeFormat={timeFormat}
      />
    </EntityField>
  );
};

export const HoursStatusWrapperComponent: ComponentConfig<HoursStatusWrapperProps> =
  {
    label: "Hours Status",
    fields: hoursStatusWrapperFields,
    defaultProps: {
      hours: {
        field: "hours",
        constantValue: "",
      },
      className: "",
      showDayNames: true,
      showCurrentStatus: true,
      dayOfWeekFormat: "short",
      timeFormat: "12h",
    },
    render: (props) => <HoursStatusWrapper {...props} />,
  };

export { HoursStatusWrapper };
