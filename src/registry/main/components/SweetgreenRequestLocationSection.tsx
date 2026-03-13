import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

export type SweetgreenRequestLocationSectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
  buttonLabel: string;
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
] as const;

const styledTextFields = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      text: YextEntityFieldSelector<any, TranslatableString>({
        label: "Text",
        filter: {
          types: ["type.string"],
        },
      }),
      fontSize: { label: "Font Size", type: "number" },
      fontColor: { label: "Font Color", type: "text" },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        options: [...fontWeightOptions],
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
  }) satisfies Fields<{ value: StyledTextProps }>["value"];

const SweetgreenRequestLocationSectionFields: Fields<SweetgreenRequestLocationSectionProps> =
  {
    heading: styledTextFields("Heading"),
    description: styledTextFields("Description"),
    buttonLabel: { label: "Button Label", type: "text" },
  };

const SweetgreenRequestLocationSectionComponent: PuckComponent<SweetgreenRequestLocationSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const description =
      resolveComponentData(props.description.text, locale, streamDocument) || "";

    return (
      <section className="bg-[#f4f3e7] px-4 py-10 md:px-8 md:py-20">
        <div className="mx-auto max-w-[780px] text-center">
          <h2
            style={{
              fontSize: `${props.heading.fontSize}px`,
              color: props.heading.fontColor,
              fontWeight: props.heading.fontWeight,
            }}
            className="mb-3 font-['SweetSans','Open_Sans',sans-serif] leading-tight"
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: `${props.description.fontSize}px`,
              color: props.description.fontColor,
              fontWeight: props.description.fontWeight,
            }}
            className="mb-8 leading-6"
          >
            {description}
          </p>
          <div className="mx-auto flex max-w-[620px] flex-col gap-4 rounded-[24px] border border-[#0e150e]/10 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)] md:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="h-14 flex-1 rounded-full border border-[#0e150e]/10 px-5 text-base outline-none"
            />
            <button
              type="button"
              className="h-14 rounded-full bg-[#00473c] px-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#f4f3e7]"
            >
              {props.buttonLabel}
            </button>
          </div>
        </div>
      </section>
    );
  };

export const SweetgreenRequestLocationSection: ComponentConfig<SweetgreenRequestLocationSectionProps> =
  {
    label: "Sweetgreen Request Location Section",
    fields: SweetgreenRequestLocationSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "Want a Sweetgreen near you?",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 40,
        fontColor: "#0E150E",
        fontWeight: 700,
        textTransform: "normal",
      },
      description: {
        text: {
          field: "",
          constantValue: {
            en: "Don’t have a Sweetgreen near you? Request a location below.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#0E150E",
        fontWeight: 400,
        textTransform: "normal",
      },
      buttonLabel: "Request location",
    },
    render: SweetgreenRequestLocationSectionComponent,
  };
