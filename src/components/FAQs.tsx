import { ComponentConfig, Fields } from "@measured/puck";
import { useDocument } from "@yext/visual-editor";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus } from "lucide-react";

interface FAQsProps {
  faqs: { question: string; answer: string }[];
  layoutType: "Layout 1" | "Layout 2" | "Layout 3";
}

interface FAQProps {
  layout: "Layout 1" | "Layout 2" | "Layout 3";
}

const FAQFields: Fields<FAQProps> = {
  layout: {
    label: "FAQs Layout",
    type: "radio",
    options: [
      { label: "Layout 1", value: "Layout 1" },
      { label: "Layout 2", value: "Layout 2" },
      { label: "Layout 3", value: "Layout 3" },
    ],
  },
};

const FAQCard = ({ layout }: FAQProps) => {
  const { frequentlyAskedQuestions } = useDocument<any>();

  return <FAQLayout faqs={frequentlyAskedQuestions} layoutType={layout} />;
};

export const FAQComponent: ComponentConfig<FAQProps> = {
  fields: FAQFields,
  defaultProps: {
    layout: "Layout 1",
  },
  render: (props) => <FAQCard {...props} />,
};

const FAQLayout = ({ faqs, layoutType }: FAQsProps) => (
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
        Frequently asked questions
      </h2>
      {layoutType === "Layout 1" && (
        <p className="mt-4 text-base text-gray-600">
          Can’t find the answer you’re looking for? Reach out to our{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            customer support
          </a>{" "}
          team.
        </p>
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
