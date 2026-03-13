import React from "react";
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

type FaqItem = {
  question: string;
  answer: string;
};

export type SweetgreenFaqSectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
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

const SweetgreenFaqSectionFields: Fields<SweetgreenFaqSectionProps> = {
  heading: styledTextFields("Heading"),
  description: styledTextFields("Description"),
  items: {
    label: "Items",
    type: "array",
    arrayFields: {
      question: { label: "Question", type: "text" },
      answer: { label: "Answer", type: "textarea" },
    },
    defaultItemProps: {
      question: "Question",
      answer: "Answer",
    },
    getItemSummary: (item: FaqItem) => item.question,
  },
};

const SweetgreenFaqSectionComponent: PuckComponent<SweetgreenFaqSectionProps> = (
  props,
) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const description =
    resolveComponentData(props.description.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="bg-[#d8e5d6] px-4 pb-20 pt-6 md:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2
            style={{
              fontSize: `${props.heading.fontSize}px`,
              color: props.heading.fontColor,
              fontWeight: props.heading.fontWeight,
            }}
            className="max-w-[320px] font-['SweetSans','Open_Sans',sans-serif] leading-tight"
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: `${props.description.fontSize}px`,
              color: props.description.fontColor,
              fontWeight: props.description.fontWeight,
            }}
            className="mt-3 max-w-[420px] leading-6"
          >
            {description}
          </p>
        </div>
        <div className="space-y-3">
          {props.items.map((item, index) => (
            <div key={item.question} className="rounded-[20px] border border-[#0e150e]/10 bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-medium text-[#0e150e]">{item.question}</span>
                <span className="text-2xl text-[#00473c]">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="pt-3 text-sm leading-6 text-[#484d48]">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SweetgreenFaqSection: ComponentConfig<SweetgreenFaqSectionProps> = {
  label: "Sweetgreen FAQ Section",
  fields: SweetgreenFaqSectionFields,
  defaultProps: {
    heading: {
      text: {
        field: "",
        constantValue: { en: "Frequently asked questions", hasLocalizedValue: "true" },
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
        constantValue: { en: "Everything you need to know about ordering and visiting", hasLocalizedValue: "true" },
        constantValueEnabled: true,
      },
      fontSize: 18,
      fontColor: "#484D48",
      fontWeight: 400,
      textTransform: "normal",
    },
    items: [
      {
        question: "Can I order Sweetgreen online for pickup or delivery?",
        answer: "Use the Sweetgreen app to order ahead for pickup or delivery. You can also order in-store.",
      },
      {
        question: "Does Sweetgreen offer vegetarian, vegan, or gluten-free options?",
        answer: "You can order from a variety of vegetarian, vegan and gluten-free options. You can customize a signature bowl or create your own to meet your dietary needs.",
      },
      {
        question: "Does Sweetgreen provide catering for offices and events?",
        answer: "Yes, you can order catering for offices and events. Visit www.sweetgreen.com/catering for more information.",
      },
      {
        question: "How do Sweetgreen Rewards work?",
        answer: "SG Rewards is a free, points-based loyalty program where members earn 10 points for every eligible $1 spent. Use accumulated points to redeem rewards.",
      },
    ],
  },
  render: SweetgreenFaqSectionComponent,
};
