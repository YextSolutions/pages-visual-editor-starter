import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const BROWN = "#3e342f";
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

export type DunkinVideoSectionProps = {
  heading: StyledTextProps;
  brandText: StyledTextProps;
  videoUrl: string;
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

const getEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  } catch {
    return url;
  }
};

export const DunkinVideoSectionFields: Fields<DunkinVideoSectionProps> = {
  heading: createStyledTextFields("Heading"),
  brandText: createStyledTextFields("Brand Text"),
  videoUrl: { label: "Video Url", type: "text" },
};

export const DunkinVideoSectionComponent: PuckComponent<
  DunkinVideoSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const brandText =
    resolveComponentData(props.brandText.text, locale, streamDocument) || "";

  return (
    <div
      className="border-b px-4 py-8 md:px-8 md:py-14"
      style={{ borderColor: BORDER, backgroundColor: OFF_WHITE }}
    >
      <p
        className="text-center"
        style={{
          fontFamily: PRIMARY_FONT,
          fontSize: `${props.heading.fontSize}px`,
          fontWeight: props.heading.fontWeight,
          lineHeight: "1",
          textTransform: props.heading.textTransform,
        }}
      >
        <span style={{ color: ORANGE }}>
          {brandText}
        </span>{" "}
        <span style={{ color: BROWN }}>
          {heading}
        </span>
      </p>
      <div className="mx-auto mt-6 max-w-[1180px] bg-black">
        <iframe
          style={{
            width: "100%",
            minHeight: "640px",
            border: "0",
          }}
          src={getEmbedUrl(props.videoUrl)}
          title={`${brandText} ${heading}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export const DunkinVideoSection: ComponentConfig<DunkinVideoSectionProps> = {
  label: "Dunkin Video",
  fields: DunkinVideoSectionFields,
  defaultProps: {
    heading: createTextDefault("VIDEO CONTENT", 42, BROWN, 800, "uppercase"),
    brandText: createTextDefault("DUNKIN'", 42, ORANGE, 800, "uppercase"),
    videoUrl: "https://www.youtube.com/watch?v=Gr96AsZGFQc",
  },
  render: DunkinVideoSectionComponent,
};
