import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Address, HoursStatus, HoursTable, Link } from "@yext/pages-components";
import {
  resolveComponentData,
  TranslatableString,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: FontWeight;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type LinkProps = {
  label: string;
  link: string;
};

export type YetiHoursLocationSectionProps = {
  title: StyledTextProps;
  locationTitle: StyledTextProps;
  parkingTitle: StyledTextProps;
  parkingCopy: StyledTextProps;
  directionsCta: LinkProps;
  callCta: LinkProps;
};

const fontWeightOptions = [
  { label: "Thin", value: 100 },
  { label: "Extra Light", value: 200 },
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semi Bold", value: 600 },
  { label: "Bold", value: 700 },
  { label: "Extra Bold", value: 800 },
  { label: "Black", value: 900 },
];

const textTransformOptions = [
  { label: "Normal", value: "normal" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

const createStyledTextField = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      text: YextEntityFieldSelector<any, TranslatableString>({
        label: "Text",
        filter: { types: ["type.string"] },
      }),
      fontSize: { label: "Font Size", type: "number" },
      fontColor: { label: "Font Color", type: "text" },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        options: fontWeightOptions,
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        options: textTransformOptions,
      },
    },
  }) as const;

const createLinkField = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  }) as const;

const YetiHoursLocationSectionFields: Fields<YetiHoursLocationSectionProps> = {
  title: createStyledTextField("Heading"),
  locationTitle: createStyledTextField("Location Heading"),
  parkingTitle: createStyledTextField("Parking Heading"),
  parkingCopy: createStyledTextField("Parking Copy"),
  directionsCta: createLinkField("Directions Call To Action"),
  callCta: createLinkField("Call Call To Action"),
};

const titleStyles = {
  fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
  lineHeight: 1,
  letterSpacing: { base: "1.3px", md: "1.8px" },
};

export const YetiHoursLocationSectionComponent: PuckComponent<
  YetiHoursLocationSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const title = resolveComponentData(props.title.text, locale, streamDocument) || "";
  const locationTitle =
    resolveComponentData(props.locationTitle.text, locale, streamDocument) || "";
  const parkingTitle =
    resolveComponentData(props.parkingTitle.text, locale, streamDocument) || "";
  const parkingCopy =
    resolveComponentData(props.parkingCopy.text, locale, streamDocument) || "";

  return (
    <section className="bg-white py-[60px]">
      <div className="mx-auto max-w-[692px] px-5 md:px-0">
        <p
          className="text-[26px]"
          style={{
            fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
            fontSize: `${props.title.fontSize}px`,
            lineHeight: 1,
            letterSpacing: "1.8px",
            color: props.title.fontColor,
            fontWeight: props.title.fontWeight,
            textTransform: props.title.textTransform,
          }}
        >
          {title}
        </p>

        <div className="mt-[25px]">
          <div
            className="relative flex items-center justify-between text-[22px] uppercase md:text-[26px]"
            style={{
              color: "#002b45",
              fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
              fontWeight: 900,
              letterSpacing: "1.3px",
            }}
          >
            <div className="flex items-center gap-[10px]">
              <span style={{ fontSize: "18px" }}>◉</span>
              <HoursStatus
                hours={streamDocument.hours}
                timezone={streamDocument.timezone}
              />
            </div>
            <span style={{ fontSize: "16px" }}>⌃</span>
          </div>
          {streamDocument.hours && (
            <div className="mt-[14px] text-[#565656] md:mt-[5px]">
              <HoursTable
                hours={streamDocument.hours}
                startOfWeek="today"
                collapseDays={false}
              />
            </div>
          )}
        </div>

        <div className="mt-[70px]">
        <p
          className="text-[26px]"
          style={{
            fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
            fontSize: `${props.locationTitle.fontSize}px`,
            lineHeight: 1,
            letterSpacing: "1.8px",
            color: props.locationTitle.fontColor,
              fontWeight: props.locationTitle.fontWeight,
              textTransform: props.locationTitle.textTransform,
            }}
          >
            {locationTitle}
          </p>
          <div
            className="mt-[30px] text-[16px] md:text-[18px]"
            style={{
              color: "#565656",
              lineHeight: "1.5",
              letterSpacing: "0.09px",
              fontFamily: "'urw-din', 'Oswald', sans-serif",
            }}
          >
            {streamDocument.address && <Address address={streamDocument.address} />}
          </div>
          <div className="mt-[30px] flex flex-wrap gap-[30px]">
            <Link
              cta={{
                link: props.directionsCta.link,
                linkType: "URL",
                label: props.directionsCta.label,
              }}
              style={{
                color: "#565656",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {props.directionsCta.label}
            </Link>
            <Link
              cta={{
                link: props.callCta.link,
                linkType: "PHONE",
                label: props.callCta.label,
              }}
              style={{
                color: "#565656",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {props.callCta.label}
            </Link>
          </div>
          <div className="mt-8 h-[272px] rounded-[6px] bg-white md:mt-6" />
        </div>

        <div className="mt-[95px] md:mt-[15px]">
          <p
            className="text-[26px]"
            style={{
              fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
              fontSize: `${props.parkingTitle.fontSize}px`,
              lineHeight: 1,
              letterSpacing: "1.8px",
              color: props.parkingTitle.fontColor,
              fontWeight: props.parkingTitle.fontWeight,
              textTransform: props.parkingTitle.textTransform,
            }}
          >
            {parkingTitle}
          </p>
          <p
            className="mt-[15px] text-[16px]"
            style={{
              color: props.parkingCopy.fontColor,
              fontFamily: "'urw-din', 'Oswald', sans-serif",
              fontSize: `${props.parkingCopy.fontSize}px`,
              fontWeight: props.parkingCopy.fontWeight,
              lineHeight: "1.5",
              letterSpacing: "0.09px",
              textTransform: props.parkingCopy.textTransform,
            }}
          >
            {parkingCopy}
          </p>
        </div>
      </div>
    </section>
  );
};

export const YetiHoursLocationSection: ComponentConfig<YetiHoursLocationSectionProps> =
  {
    label: "Yeti Hours & Location",
    fields: YetiHoursLocationSectionFields,
    defaultProps: {
      title: {
        text: {
          field: "",
          constantValue: {
            en: "Hours & Location",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#4b4f53",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      locationTitle: {
        text: {
          field: "",
          constantValue: {
            en: "Location",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#4b4f53",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      parkingTitle: {
        text: {
          field: "",
          constantValue: {
            en: "Parking",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#002b45",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      parkingCopy: {
        text: {
          field: "",
          constantValue: {
            en: "Free parking for YETI can be found at any of Tysons Corner Center parking garages or surface lots.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#565656",
        fontWeight: 400,
        textTransform: "normal",
      },
      directionsCta: {
        label: "Get Directions",
        link: "https://maps.google.com/maps/dir//1961+Chain+Bridge+Rd+Suite+#G7AU,+McLean,+VA+22102,+USA",
      },
      callCta: {
        label: "Call Us",
        link: "tel:(703) 310-7096",
      },
    },
    render: YetiHoursLocationSectionComponent,
  };
