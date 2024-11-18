import { ComponentConfig, Fields } from "@measured/puck";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus } from "lucide-react";
import { toTitleCaseWithRules } from "../utils/reusableFunctions";

interface FAQsWithStaticFAQssProps {
  faqs: { question: string; answer: string }[];
  layoutType: "Layout 1" | "Layout 2" | "Layout 3";
  sectionTitle: string;
  sectionDescription: string;
}

export interface FAQsWithStaticFAQsProps {
  layout: "Layout 1" | "Layout 2" | "Layout 3";
  faqs: YextEntityField<any>;
  sectionTitle: string;
  sectionDescription: string;
}

const FAQsWithStaticFAQsFields: Fields<FAQsWithStaticFAQsProps> = {
  sectionTitle: {
    label: "Section Title",
    type: "text",
  },
  sectionDescription: {
    label: "Section Description",
    type: "textarea",
  },
  layout: {
    label: "Layout",
    type: "radio",
    options: [
      { label: "Layout 1", value: "Layout 1" },
      { label: "Layout 2", value: "Layout 2" },
      { label: "Layout 3", value: "Layout 3" },
    ],
  },
  //@ts-expect-error
  faqs: YextEntityFieldSelector<typeof config>({
    label: "FAQs",
    filter: {
      types: ["frequentlyAskedQuestions"],
      allowList: ["frequentlyAskedQuestions"],
    },
  }),
};

const FAQsWithStaticFAQsCard = ({
  layout,
  faqs: faqsField,
  sectionTitle,
  sectionDescription,
}: FAQsWithStaticFAQsProps) => {
  const document = useDocument<any>();
  const faqs = resolveYextEntityField<FAQsWithStaticFAQssProps["faqs"]>(
    document,
    faqsField
  );

  return (
    <>
      {faqs && (
        <EntityField
          fieldId="frequentlyAskedQuestions"
          constantValueEnabled={true}
        >
          <FAQsWithStaticFAQsLayout
            faqs={faqs}
            layoutType={layout}
            sectionTitle={sectionTitle}
            sectionDescription={sectionDescription}
          />
        </EntityField>
      )}
    </>
  );
};

export const FAQsWithStaticFAQsComponent: ComponentConfig<FAQsWithStaticFAQsProps> =
  {
    fields: FAQsWithStaticFAQsFields,
    defaultProps: {
      sectionTitle: "Sample title",
      sectionDescription: "Sample Description",
      layout: "Layout 1",
      faqs: {
        field: "frequentlyAskedQuestions",
        constantValueEnabled: true,
        constantValue: [
          {
            question: "Sample Question",
            answer: "Answer",
          },
          {
            question: "Sample Question",
            answer: "Answer",
          },
          {
            question: "Sample Question",
            answer: "Answer",
          },
        ],
      },
    },
    render: (props) => <FAQsWithStaticFAQsCard {...props} />,
  };
FAQsWithStaticFAQsComponent.label = "FAQs With Static Data";

const FAQsWithStaticFAQsLayout = ({
  faqs,
  layoutType,
  sectionTitle,
  sectionDescription,
}: FAQsWithStaticFAQssProps) => (
  <section aria-labelledby="faq-heading" className="bg-white py-24 sm:py-32">
    <header className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2
        id="faq-heading"
        className={`text-4xl font-semibold tracking-tight text-gray-900 ${
          layoutType === "Layout 1" || layoutType === "Layout 2"
            ? "sm:text-5xl"
            : ""
        }`}
      >
        {toTitleCaseWithRules(sectionTitle)}
      </h2>
      {layoutType === "Layout 1" && (
        <p className="mt-4 text-base text-gray-600">{sectionDescription}</p>
      )}
    </header>
    <dl
      aria-label="Frequently Asked Questions"
      className={`mx-auto mt-10 max-w-7xl ${
        layoutType === "Layout 1"
          ? "grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-2"
          : layoutType === "Layout 2"
            ? "max-w-4xl space-y-6 divide-y divide-gray-900/10"
            : "divide-y divide-gray-900/10 space-y-8"
      } px-6 lg:px-8`}
    >
      {faqs?.map((faq, index) =>
        layoutType === "Layout 2" ? (
          <Disclosure key={index} as="section" className="pt-6">
            <dt>
              <DisclosureButton
                aria-expanded="false"
                aria-controls={`answer-${index}`}
                className="group flex w-full items-start justify-between text-left text-gray-900"
              >
                <span className="text-base font-semibold">{faq.question}</span>
                <span className="ml-6 flex h-7 items-center">
                  <Plus
                    aria-hidden="true"
                    className="size-6 group-data-[open]:hidden"
                  />
                  <Minus
                    aria-hidden="true"
                    className="size-6 [.group:not([data-open])_&]:hidden"
                  />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel
              id={`answer-${index}`}
              aria-labelledby={`question-${index}`}
              as="dd"
              className="mt-2 pr-12"
            >
              <p className="text-base text-gray-600">{faq.answer}</p>
            </DisclosurePanel>
          </Disclosure>
        ) : (
          <section
            key={index}
            className={`${
              layoutType === "Layout 1"
                ? "space-y-4"
                : "pt-8 lg:grid lg:grid-cols-12 lg:gap-8"
            }`}
          >
            <dt
              id={`question-${index}`}
              className={`text-base font-semibold text-gray-900 ${
                layoutType === "Layout 3" ? "lg:col-span-5" : ""
              }`}
            >
              {faq.question}
            </dt>
            <dd
              id={`answer-${index}`}
              aria-labelledby={`question-${index}`}
              className={`${
                layoutType === "Layout 3" ? "lg:col-span-7 lg:mt-0" : "mt-2"
              } text-base text-gray-600`}
            >
              {faq.answer}
            </dd>
          </section>
        )
      )}
    </dl>
  </section>
);
