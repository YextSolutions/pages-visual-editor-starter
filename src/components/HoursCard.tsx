import { ComponentConfig, Fields } from "@measured/puck";
import { useDocument } from "../hooks/useDocument";
import { LocationStream, Hours } from "../types/autogen";
import {
  DayOfWeekNames,
  HoursTable,
  HoursType,
} from "@yext/pages-components";
import { Section } from "./atoms/section";
import { Heading, HeadingProps } from "./atoms/heading";
import { EntityField } from "./EntityField";
import "@yext/pages-components/style.css";

export type HoursCardProps = {
  heading: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  startOfWeek: keyof DayOfWeekNames | "today";
  collapseDays: boolean;
  showAdditionalHoursText: boolean;
};

const hoursCardFields: Fields<HoursCardProps> = {
  heading: {
    type: "object",
    label: "Heading",
    objectFields: {
      text: {
        label: "Text",
        type: "text",
      },
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Section", value: "section" },
          { label: "Subheading", value: "subheading" },
        ],
      },
      color: {
        label: "Color",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
    },
  },
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
};

const HOURS_MISSING_TEXT = "The Hours field is missing on this entity"

const HoursCard = ({
  heading,
  startOfWeek,
  collapseDays,
  showAdditionalHoursText,
}: HoursCardProps) => {
  const hours: Hours = useDocument<LocationStream>((document) =>
      document?.hours
  );
  const additionalHoursText: string = useDocument<LocationStream>(
    (document) => document?.additionalHoursText ?? ""
  );

  const css = `
      .is-today {
        font-weight: 700;
      }
  `;

  return (
    <Section
      className="flex flex-col justify-center components items-center"
      padding="small"
    >
      <style>{css}</style>
      <div>
        <Heading
          level={2}
          size={heading.size}
          className={"mb-4"}
          color={heading.color}
        >
          {heading.text}
        </Heading>
        <EntityField displayName="Hours" fieldId="hours">
          {hours ? <HoursTable
              hours={hours as HoursType}
              startOfWeek={startOfWeek}
              collapseDays={collapseDays}
          /> : <div>{HOURS_MISSING_TEXT}</div>}
        </EntityField>
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
    heading: {
      text: "Hours",
      size: "subheading",
      color: "default",
    },
    startOfWeek: "today",
    collapseDays: false,
    showAdditionalHoursText: true,
  },
  label: "Hours Card",
  render: ({ heading, startOfWeek, collapseDays, showAdditionalHoursText }) => (
    <HoursCard
      heading={heading}
      startOfWeek={startOfWeek}
      collapseDays={collapseDays}
      showAdditionalHoursText={showAdditionalHoursText}
    />
  ),
};
