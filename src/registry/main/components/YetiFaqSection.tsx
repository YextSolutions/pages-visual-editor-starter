import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { useState } from "react";
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

type FaqItem = {
  question: string;
  answer: string;
};

export type YetiFaqSectionProps = {
  heading: StyledTextProps;
  items: FaqItem[];
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

const YetiFaqSectionFields: Fields<YetiFaqSectionProps> = {
  heading: createStyledTextField("Heading"),
  items: {
    label: "Questions",
    type: "array",
    arrayFields: {
      question: { label: "Question", type: "text" },
      answer: { label: "Answer", type: "text" },
    },
    defaultItemProps: {
      question: "Question",
      answer: "Answer",
    },
    getItemSummary: (item: FaqItem) => item.question,
  } as any,
};

export const YetiFaqSectionComponent: PuckComponent<YetiFaqSectionProps> = (
  props,
) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#f1f1f1] px-6 py-[30px] md:px-[34px] md:py-[50px]">
      <div className="mx-auto max-w-[1540px]">
        <p
          className="mb-5 text-[32px] md:mb-6"
          style={{
            color: props.heading.fontColor,
            fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
            fontSize: `${props.heading.fontSize}px`,
            fontWeight: props.heading.fontWeight,
            letterSpacing: "1.6px",
            lineHeight: "1",
            textTransform: props.heading.textTransform,
          }}
        >
          {heading}
        </p>
        {props.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="mb-2" key={item.question}>
              <div
                role="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="relative cursor-pointer rounded-[16px] bg-[#f1f1f1] px-4 py-2"
              >
                <p
                  className="pr-12 text-[18px] leading-[20px] tracking-[0.9px] md:text-[26px] md:leading-none md:tracking-[1.3px]"
                  style={{
                    color: "#002b45",
                    fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  {item.question}
                </p>
                <span
                  className="absolute right-6 top-1/2 text-[22px] leading-none"
                  style={{ color: "#002b45", transform: "translateY(-50%)" }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </div>
              {isOpen && (
                <div className="px-0 pb-[35px] pt-2 md:px-4">
                  <p
                    className="whitespace-pre-line text-[14px] md:text-[16px]"
                    style={{
                      color: "#242424",
                      fontFamily: "'urw-din', 'Oswald', sans-serif",
                      lineHeight: "1.5",
                      letterSpacing: "0.08px",
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const YetiFaqSection: ComponentConfig<YetiFaqSectionProps> = {
  label: "Yeti FAQ",
  fields: YetiFaqSectionFields,
  defaultProps: {
    heading: {
      text: {
        field: "",
        constantValue: {
          en: "FAQ",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      fontSize: 36,
      fontColor: "#002b45",
      fontWeight: 900,
      textTransform: "uppercase",
    },
    items: [
      {
        question: "Are pets allowed in this store?",
        answer: "No, with the exception of service animals.",
      },
      {
        question: "Where can I park?",
        answer:
          "▪ Free parking for YETI can be found at any of Tysons Corner Center parking garages or surface lots.\n▪ The closest available parking is located in Parking Garage D at the Northwest corner of Tysons Corner Center, adjacent to Macy’s.",
      },
      {
        question: "Do you have any drinkware with city-specific designs?",
        answer:
          "You bet. Each of our store locations has a unique drinkware illustration inspired by the city.",
      },
      {
        question: "Is there curbside pickup?",
        answer:
          "Yes. Shop online and our Outfitters will help you load up your new YETI gear into your car.",
      },
      {
        question: "Can I throw a private event at this store?",
        answer:
          "If you’re looking for a place to throw a party, we got you covered. Just contact our store for more details.",
      },
    ],
  },
  render: YetiFaqSectionComponent,
};
