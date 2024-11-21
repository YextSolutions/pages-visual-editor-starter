import { ComponentConfig, Fields } from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { LexicalRichText } from "@yext/pages-components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./atoms/accordion";
import {
  EntityField,
  Body,
  BodyProps,
  Heading,
  HeadingProps,
  Section,
  useDocument,
  FontSizeSelector,
} from "@yext/visual-editor";

export type FAQProps = {
  sectionTitle: {
    text: string;
    fontSize: HeadingProps["fontSize"];
    color: HeadingProps["color"];
  };
  question: {
    fontSize: HeadingProps["fontSize"];
    color: HeadingProps["color"];
  };
  answer: {
    fontSize: BodyProps["fontSize"];
    weight: BodyProps["fontWeight"];
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
      fontSize: FontSizeSelector(),
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
      fontSize: FontSizeSelector(),
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
      fontSize: FontSizeSelector(),
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
  const { c_faqSection: faq } = useDocument<LocationStream>();

  return (
    <Section className="flex flex-col justify-center bg-white components">
      {sectionTitle && (
        <Heading
          level={1}
          color={sectionTitle.color}
          className="text-center"
          fontSize={sectionTitle.fontSize}
        >
          {sectionTitle.text}
        </Heading>
      )}
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
                      color={question.color}
                      fontSize={question.fontSize}
                    >
                      {faqItem.question}
                    </Heading>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Body
                      fontWeight={answer.weight}
                      fontSize={answer.fontSize}
                    >
                      <LexicalRichText
                        nodeClassNames={{
                          text: { bold: answer.weight! },
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
      fontSize: "default",
      color: "default",
    },
    question: {
      fontSize: "default",
      color: "default",
    },
    answer: {
      fontSize: "default",
      weight: "default",
    },
  },
  render: (props) => <FAQCard {...props} />,
};
