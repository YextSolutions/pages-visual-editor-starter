import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { ImageType, ComplexImageType } from "@yext/pages-components";
import {
  Image,
  resolveComponentData,
  TranslatableAssetImage,
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

export type YetiCustomizeBannerSectionProps = {
  backgroundImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  heading: StyledTextProps;
  body: StyledTextProps;
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

const YetiCustomizeBannerSectionFields: Fields<YetiCustomizeBannerSectionProps> =
  {
    backgroundImage: YextEntityFieldSelector<
      any,
      ImageType | ComplexImageType | TranslatableAssetImage
    >({
      label: "Background Image",
      filter: { types: ["type.image"] },
    }),
    heading: createStyledTextField("Heading"),
    body: createStyledTextField("Body"),
  };

export const YetiCustomizeBannerSectionComponent: PuckComponent<
  YetiCustomizeBannerSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const backgroundImage = resolveComponentData(
    props.backgroundImage,
    locale,
    streamDocument,
  );
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const body =
    resolveComponentData(props.body.text, locale, streamDocument) || "";

  return (
    <section className="relative h-[600px] overflow-hidden md:h-[700px]">
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            image={backgroundImage}
            className="h-full"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.32) 28%, rgba(0, 0, 0, 0) 60%)",
        }}
      />
      <div className="relative z-[1] flex h-full items-center px-8 md:px-[75px]">
        <div className="max-w-[280px] md:max-w-[430px]">
          <p
            className="text-[45px] leading-[47px] tracking-[3px] md:leading-[53px] md:tracking-[5px]"
            style={{
              color: props.heading.fontColor,
              fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
              fontSize: `${props.heading.fontSize}px`,
              fontWeight: props.heading.fontWeight,
              textTransform: props.heading.textTransform,
            }}
          >
            {heading}
          </p>
          <p
            className="mt-[18px] max-w-[270px] text-[16px] md:max-w-[360px]"
            style={{
              color: props.body.fontColor,
              fontFamily: "'urw-din', 'Oswald', sans-serif",
              fontSize: `${props.body.fontSize}px`,
              fontWeight: props.body.fontWeight,
              lineHeight: "1.5",
              letterSpacing: "0.08px",
              textTransform: props.body.textTransform,
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </section>
  );
};

export const YetiCustomizeBannerSection: ComponentConfig<YetiCustomizeBannerSectionProps> =
  {
    label: "Yeti Customize Banner",
    fields: YetiCustomizeBannerSectionFields,
    defaultProps: {
      backgroundImage: {
        field: "",
        constantValue: {
          url: "https://yeti-webmedia.imgix.net/m/35d6810f223f9fc3/original/240074_PLP_BMD_3-0_Paragraph_Lifestyle_Store_Page_Customize_Desktop.jpg?auto=format,compress",
          width: 1920,
          height: 700,
        },
        constantValueEnabled: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "CUSTOMIZE IT IN-STORE",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 50,
        fontColor: "#ffffff",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      body: {
        text: {
          field: "",
          constantValue: {
            en: "Choose from 9 different fonts and 12 design galleries to make your drinkware all your own.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 16,
        fontColor: "#ffffff",
        fontWeight: 400,
        textTransform: "normal",
      },
    },
    render: YetiCustomizeBannerSectionComponent,
  };
