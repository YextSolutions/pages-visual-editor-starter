import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { DayOfWeekNames, HoursTable, HoursType } from "@yext/pages-components";
import { Section, sectionVariants } from "./atoms/section";
import { EntityField, useDocument } from "@yext/visual-editor";
import "./index.css";
import "@yext/pages-components/style.css";
import { CardProps } from "./Card";
import { VariantProps } from "class-variance-authority";

export type HoursCardProps = {
  startOfWeek: keyof DayOfWeekNames | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
  alignment: CardProps["alignment"];
  padding: VariantProps<typeof sectionVariants>["padding"];
};

const hoursCardFields: Fields<HoursCardProps> = {
  startOfWeek: {
    label: "Start of the week",
    type: "radio",
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
    label: "Collapse days",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  showAdditionalHoursText: {
    label: "Show additional hours text",
    type: "radio",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  alignment: {
    label: "Align card",
    type: "radio",
    options: [
      { label: "Left", value: "items-start" },
      { label: "Center", value: "items-center" },
    ],
  },
  padding: {
    label: "Padding",
    type: "radio",
    options: [
      { label: "None", value: "none" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "default" },
      { label: "Large", value: "large" },
    ],
  },
};

const HoursCard = ({
  startOfWeek,
  collapseDays,
  showAdditionalHoursText,
  alignment,
  padding,
}: HoursCardProps) => {
  const { hours, additionalHoursText } = useDocument<LocationStream>();

  return (
    <Section
      className={`flex flex-col justify-center components ${alignment}`}
      padding={padding}
    >
      <div>
        {hours && (
          <EntityField displayName="Hours" fieldId="hours">
            <HoursTable
              hours={hours as HoursType}
              startOfWeek={startOfWeek}
              collapseDays={collapseDays}
            />
          </EntityField>
        )}
        {additionalHoursText && showAdditionalHoursText && (
          <EntityField displayName="Hours Text" fieldId="additionalHoursText">
            <div className="mt-4">{additionalHoursText}</div>
          </EntityField>
        )}
      </div>
    </Section>
  );
};

export const HoursCardComponent: ComponentConfig<HoursCardProps> = {
  fields: hoursCardFields,
  defaultProps: {
    startOfWeek: "today",
    collapseDays: false,
    showAdditionalHoursText: true,
    alignment: "items-center",
    padding: "none",
  },
  label: "Hours Card",
  render: (props) => <HoursCard {...props} />,
};
