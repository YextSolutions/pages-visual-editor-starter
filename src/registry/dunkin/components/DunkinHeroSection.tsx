import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  Image,
  TranslatableAssetImage,
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import {
  Address,
  ComplexImageType,
  HoursStatus,
  HoursTable,
  ImageType,
  Link,
} from "@yext/pages-components";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BROWN = "#3e342f";
const PINK = "#c63663";
const ORANGE = "#ef6a00";
const BORDER = "#d5d5d5";
const OFF_WHITE = "#fbf7f4";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type LinkItem = {
  label: string;
  link: string;
};

type FeatureItem = {
  value: string;
};

export type DunkinHeroSectionProps = {
  leftImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  rightImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  heading: StyledTextProps;
  storeLabel: StyledTextProps;
  hoursLabel: StyledTextProps;
  featuresLabel: StyledTextProps;
  directionsCta: LinkItem;
  appCta: LinkItem;
  features: FeatureItem[];
};

const createStyledTextFields = (label: string) =>
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
        options: [
          { label: "Thin", value: 100 },
          { label: "Extra Light", value: 200 },
          { label: "Light", value: 300 },
          { label: "Regular", value: 400 },
          { label: "Medium", value: 500 },
          { label: "Semi Bold", value: 600 },
          { label: "Bold", value: 700 },
          { label: "Extra Bold", value: 800 },
          { label: "Black", value: 900 },
        ],
      },
      textTransform: {
        label: "Text Transform",
        type: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Uppercase", value: "uppercase" },
          { label: "Lowercase", value: "lowercase" },
          { label: "Capitalize", value: "capitalize" },
        ],
      },
    },
  }) as const;

const createTextDefault = (
  value: string,
  fontSize: number,
  fontColor: string,
  fontWeight: StyledTextProps["fontWeight"],
  textTransform: StyledTextProps["textTransform"],
): StyledTextProps => ({
  text: {
    field: "",
    constantValue: { en: value, hasLocalizedValue: "true" },
    constantValueEnabled: true,
  },
  fontSize,
  fontColor,
  fontWeight,
  textTransform,
});

const resolveText = (
  value: StyledTextProps,
  locale: string,
  streamDocument: Record<string, unknown>,
) => resolveComponentData(value.text, locale, streamDocument) || "";

const textStyles = (value: StyledTextProps) => ({
  fontSize: `${value.fontSize}px`,
  color: value.fontColor,
  fontWeight: value.fontWeight,
  textTransform: value.textTransform,
});

const buttonStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "32px",
  padding: "0 20px",
  borderRadius: "999px",
  fontFamily: PRIMARY_FONT,
  fontSize: "11px",
  fontWeight: 800,
  lineHeight: "11px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

export const DunkinHeroSectionFields: Fields<DunkinHeroSectionProps> = {
  leftImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Left Image",
    filter: { types: ["type.image"] },
  }),
  rightImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Right Image",
    filter: { types: ["type.image"] },
  }),
  heading: createStyledTextFields("Heading"),
  storeLabel: createStyledTextFields("Store Label"),
  hoursLabel: createStyledTextFields("Hours Label"),
  featuresLabel: createStyledTextFields("Features Label"),
  directionsCta: {
    label: "Directions Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  appCta: {
    label: "App Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  features: {
    label: "Features",
    type: "array",
    arrayFields: {
      value: { label: "Value", type: "text" },
    },
    defaultItemProps: {
      value: "Feature",
    },
    getItemSummary: (item: FeatureItem) => item.value,
  },
};

export const DunkinHeroSectionComponent: PuckComponent<
  DunkinHeroSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, any>;
  const locale = streamDocument.locale ?? "en";
  const leftImage = resolveComponentData(
    props.leftImage,
    locale,
    streamDocument,
  );
  const rightImage = resolveComponentData(
    props.rightImage,
    locale,
    streamDocument,
  );
  const heading = resolveText(props.heading, locale, streamDocument);
  const storeLabel = resolveText(props.storeLabel, locale, streamDocument);
  const hoursLabel = resolveText(props.hoursLabel, locale, streamDocument);
  const featuresLabel = resolveText(
    props.featuresLabel,
    locale,
    streamDocument,
  );

  return (
    <div
      className="overflow-hidden border-b"
      style={{ borderColor: BORDER, backgroundColor: OFF_WHITE }}
    >
      <style>{`
        .dunkin-hero .HoursStatus-current { font-weight: 700; margin-right: 8px; }
        .dunkin-hero .HoursTable-row { padding-left: 12px; font-family: ${SECONDARY_FONT}; font-size: 12px; line-height: 16px; color: ${BROWN}; }
        .dunkin-hero .HoursTable-row.is-today { font-weight: 700; padding-left: 0; }
        .dunkin-hero .HoursTable-row.is-today:before { content: ""; display: inline-flex; width: 4px; height: 18px; margin-right: 8px; border-radius: 999px; background: ${PINK}; vertical-align: text-top; }
        .dunkin-hero-side-image { overflow: hidden; }
        .dunkin-hero-side-image img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
      `}</style>
      <div className="dunkin-hero relative">
        <div className="relative overflow-hidden px-5 pb-8 pt-10 md:min-h-[190px] md:px-8 md:pb-10 md:pt-14 xl:px-16">
          <div
            className="dunkin-hero-side-image absolute hidden md:block md:w-[210px] xl:w-[250px]"
            style={{ left: 0, top: 0, bottom: 0 }}
          >
            {leftImage ? <Image image={leftImage} /> : null}
          </div>
          <div
            className="dunkin-hero-side-image absolute hidden md:block md:w-[250px] xl:w-[320px]"
            style={{ right: 0, top: 0, bottom: 0 }}
          >
            {rightImage ? <Image image={rightImage} /> : null}
          </div>
          <div className="flex flex-col items-center text-center md:min-h-[160px]">
            <p
              style={{
                fontFamily: PRIMARY_FONT,
                letterSpacing: "0.01em",
                ...textStyles(props.heading),
              }}
            >
              {heading ||
                (streamDocument.address?.line1 as string)?.toUpperCase()}
            </p>
            <div
              className="mt-3"
              style={{
                fontFamily: SECONDARY_FONT,
                fontSize: "12px",
                lineHeight: "16px",
                color: BROWN,
              }}
            >
              {streamDocument.hours ? (
                <HoursStatus
                  hours={streamDocument.hours}
                  timezone={streamDocument.timezone}
                />
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                cta={{
                  link: props.directionsCta.link,
                  label: props.directionsCta.label,
                  linkType: "URL",
                }}
                style={{
                  ...buttonStyles,
                  background: PINK,
                  border: `2px solid ${PINK}`,
                  color: "#ffffff",
                }}
              >
                {props.directionsCta.label}
              </Link>
              <Link
                cta={{
                  link: props.appCta.link,
                  label: props.appCta.label,
                  linkType: "URL",
                }}
                style={{
                  ...buttonStyles,
                  background: "#ffffff",
                  border: `2px solid ${BROWN}`,
                  color: BROWN,
                }}
              >
                {props.appCta.label}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col border-t md:mt-10 lg:flex-row" style={{ borderColor: BORDER }}>
          <div
            className="flex-1 border-b px-5 py-6 md:px-8 md:py-5 lg:border-b-0"
            style={{ borderColor: BORDER }}
          >
            <p
              className="mb-2"
              style={{ fontFamily: PRIMARY_FONT, ...textStyles(props.storeLabel) }}
            >
              {storeLabel}
            </p>
            <div
              style={{
                color: BROWN,
                fontFamily: SECONDARY_FONT,
                fontSize: "12px",
                lineHeight: "18px",
              }}
            >
              {streamDocument.address ? (
                <Address address={streamDocument.address} />
              ) : null}
              {streamDocument.mainPhone ? (
                <p className="mt-2">{streamDocument.mainPhone}</p>
              ) : null}
            </div>
          </div>
          <div
            className="flex-1 border-b px-5 py-6 md:px-8 md:py-5 lg:border-b-0 lg:border-l"
            style={{ borderColor: BORDER }}
          >
            <p
              className="mb-2"
              style={{ fontFamily: PRIMARY_FONT, ...textStyles(props.hoursLabel) }}
            >
              {hoursLabel}
            </p>
            {streamDocument.hours ? (
              <HoursTable
                hours={streamDocument.hours}
                startOfWeek="monday"
                collapseDays={false}
              />
            ) : null}
          </div>
          <div
            className="flex-1 px-5 py-6 md:px-8 md:py-5 lg:border-l"
            style={{ borderColor: BORDER }}
          >
            <p
              className="mb-2"
              style={{
                fontFamily: PRIMARY_FONT,
                ...textStyles(props.featuresLabel),
              }}
            >
              {featuresLabel}
            </p>
            <div className="flex flex-col gap-2">
              {props.features.map((feature, index) => (
                <div className="flex items-center gap-3" key={`${feature.value}-${index}`}>
                  <div
                    className="h-[7px] w-[7px] shrink-0 rounded-[2px] border"
                    style={{ borderColor: ORANGE }}
                  />
                  <span
                    style={{
                      color: BROWN,
                      fontFamily: SECONDARY_FONT,
                      fontSize: "12px",
                      lineHeight: "16px",
                    }}
                  >
                    {feature.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DunkinHeroSection: ComponentConfig<DunkinHeroSectionProps> = {
  label: "Dunkin Hero",
  fields: DunkinHeroSectionFields,
  defaultProps: {
    leftImage: {
      field: "",
      constantValue: {
        url: "https://a.mktgcdn.com/p/Zh09XQZ2Tt8cjZPu-0Zf52eP9sWaPsz3wvvLBFwGP7Q/211x271.png",
        width: 211,
        height: 271,
      },
      constantValueEnabled: true,
    },
    rightImage: {
      field: "",
      constantValue: {
        url: "https://a.mktgcdn.com/p/93BJovAwqoGG7bS3ya3HNyyM6i3Zo4Wyf63yuCYyOtw/508x452.jpg",
        width: 508,
        height: 452,
      },
      constantValueEnabled: true,
    },
    heading: createTextDefault("406 8TH ST SE.", 48, BROWN, 800, "uppercase"),
    storeLabel: createTextDefault(
      "DUNKIN' NEAR YOU",
      18,
      BROWN,
      800,
      "uppercase",
    ),
    hoursLabel: createTextDefault("Hours", 18, BROWN, 800, "uppercase"),
    featuresLabel: createTextDefault("Features", 18, BROWN, 800, "uppercase"),
    directionsCta: {
      label: "Get Directions",
      link: "https://maps.google.com/?q=406%208th%20St%20SE%20Washington%20DC%2020003",
    },
    appCta: {
      label: "Download App",
      link: "https://www.dunkindonuts.com/en/dd-cards/mobile-app",
    },
    features: [
      { value: "On-the-Go Mobile Ordering" },
      { value: "Free WiFi" },
      { value: "Baskin-Robbins" },
      { value: "K-Cup Pods" },
      { value: "On Tap" },
    ],
  },
  render: DunkinHeroSectionComponent,
};
