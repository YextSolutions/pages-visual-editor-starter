import { ComponentConfig, Fields } from "@measured/puck";
import { Heading, HeadingProps } from "./atoms/heading";
import { BodyProps } from "./atoms/body";
import { Section } from "./atoms/section";
import { C_faqSection, LocationStream } from "../types/autogen";
import { LexicalRichText } from "@yext/pages-components";
import { useDocument } from "@yext/pages/util";
import { Body } from "./atoms/body";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./atoms/accordion";
import { EntityField } from "@yext/visual-editor";

export type FAQProps = {
  sectionTitle: {
    text: string;
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  question: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  answer: {
    size: BodyProps["size"];
    weight: BodyProps["weight"];
  };
};

const FAQFields: Fields<FAQProps> = {
  sectionTitle: {
    type: "object",
    label: "Section Title",
    objectFields: {
      text: {
        label: "Text",
        type: "text",
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
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Small", value: "small" },
          { label: "Base", value: "base" },
          { label: "Large", value: "large" },
        ],
      },
      weight: {
        label: "Weight",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Bold", value: "bold" },
        ],
      },
    },
  },
};

const FAQCard = ({ sectionTitle, question, answer }: FAQProps) => {
  const {c_faqSection: faq} = useDocument<LocationStream>();

  return (
    <Section className="flex flex-col justify-center bg-white components">
      {sectionTitle && <Heading
          level={1}
          size={sectionTitle.size}
          color={sectionTitle.color}
          className="text-center"
      >
        {sectionTitle.text}
      </Heading>}
      <Accordion type="single" collapsible>
        {faq?.linkedFAQs && (
          <EntityField
            displayName="Linked FAQs"
            fieldId="c_faqSection.linkedFAQs"
          >
            <div>
              {faq?.linkedFAQs.map((faqItem, index) => (
                <AccordionItem value={index + 1} key={index + 1}>
                  <AccordionTrigger>
                    <Heading
                      level={1}
                      size={question.size}
                      color={question.color}
                    >
                      {faqItem.question}
                    </Heading>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Body size={answer.size} weight={answer.weight}>
                      <LexicalRichText
                        nodeClassNames={{
                          text: { bold: answer.weight!, base: answer.size! },
                        }}
                        serializedAST={JSON.stringify(faqItem.answerV2.json)}
                      />
                    </Body>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </EntityField>
        )}
      </Accordion>
    </Section>
  );
};

export const FAQComponent: ComponentConfig<FAQProps> = {
  fields: FAQFields,
  defaultProps: {
    sectionTitle: {
      text: "Frequently Asked Questions",
      size: "section",
      color: "default",
    },
    question: {
      size: "subheading",
      color: "default",
    },
    answer: {
      size: "base",
      weight: "default",
    },
  },
  render: ({ sectionTitle, question, answer }) => (
    <FAQCard sectionTitle={sectionTitle} question={question} answer={answer} />
  ),
};
