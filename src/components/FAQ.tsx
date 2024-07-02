import {ComponentConfig, Fields} from "@measured/puck";
import { Heading, HeadingProps } from "./atoms/heading";
import {BodyProps} from "./atoms/body";
import {Section} from "./atoms/section";
import { C_faqSection, LocationStream } from "../types/autogen";
import { LexicalRichText } from "@yext/pages-components";
import {useDocument} from "../hooks/useDocument";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./atoms/accordion"

export type FAQProps = {
  sectionTitle: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  question: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  answer: {
    text: string;
    size: BodyProps['size'];
    weight: BodyProps['weight'];
  };
};

const FAQFields: Fields<FAQProps> = {
  sectionTitle: {
    type: "object",
    label: "Section Title",
    objectFields: {
      text: {
        label: "Text",
        type: "text"
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
  question: {
    type: "object",
    label: "Question",
    objectFields: {
      text: {
        label: "Text",
        type: "text"
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
  answer: {
    type: "object",
    label: "Answer",
    objectFields: {
      text: {
        label: "Text",
        type: "text"
      },
      size: {
        label: "Size",
        type: "radio",
        options: [
          {label: "Small", value: "small"},
          {label: "Base", value: "base"},
          {label: "Large", value: "large"},
        ],
      },
      weight: {
        label: "Weight",
        type: "radio",
        options: [
          {label: "Default", value: "default"},
          {label: "Bold", value: "bold"},
        ],
      },
    },
  },
};

const FAQCard = ({sectionTitle}: FAQProps) => {
  const faq: C_faqSection = useDocument<LocationStream>(
      (document) => document.c_faqSection
  );

  console.log(faq);

  return (
      <Section className="flex flex-col justify-center bg-white components">
        <Heading level={1} size={sectionTitle.size} color={sectionTitle.color}>
          {sectionTitle.text}
        </Heading>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{faq.linkedFAQs?.question}</AccordionTrigger>
            <AccordionContent>
              {/*{faq.linkedFAQs?.answerV2 && (<LexicalRichText serializedAST={faq.linkedFAQs?.answerV2} />)}*/}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
  );
};

export const FAQComponent: ComponentConfig<FAQProps> = {
  fields: FAQFields,
  defaultProps: {
    sectionTitle: {
      text: "sectionTitle",
      size: "section",
      color: "default",
    },
    question: {
      text: "question",
      size: "section",
      color: "default",
    },
    answer: {
      text: "answer",
      size: "base",
      weight: "default",
    },
  },
  render: ({ sectionTitle, question, answer}) => (
      <FAQCard
        sectionTitle={sectionTitle}
        question={question}
        answer={answer}
      />
  ),
};