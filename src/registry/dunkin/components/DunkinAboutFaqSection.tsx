import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import * as React from "react";
import { FaChevronDown } from "react-icons/fa";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BORDER = "#d5d5d5";
const BROWN = "#3e342f";
const ORANGE = "#ef6a00";
const OFF_WHITE = "#fbf7f4";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type FaqItem = {
  question: string;
  answerHtml: string;
};

export type DunkinAboutFaqSectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
  faqs: FaqItem[];
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

export const DunkinAboutFaqSectionFields: Fields<DunkinAboutFaqSectionProps> = {
  heading: createStyledTextFields("Heading"),
  description: createStyledTextFields("Description"),
  faqs: {
    label: "Frequently Asked Questions",
    type: "array",
    arrayFields: {
      question: { label: "Question", type: "text" },
      answerHtml: { label: "Answer Html", type: "textarea" },
    },
    defaultItemProps: {
      question: "Question",
      answerHtml: "Answer",
    },
    getItemSummary: (item: FaqItem) => item.question,
  },
};

export const DunkinAboutFaqSectionComponent: PuckComponent<
  DunkinAboutFaqSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const description =
    resolveComponentData(props.description.text, locale, streamDocument) || "";
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <Box
      bg={OFF_WHITE}
      borderBottom={`1px solid ${BORDER}`}
      px={{ base: 6, md: 8, xl: 20 }}
      py={{ base: 8, md: 18 }}
    >
      <style>{`.dunkin-faq-answer a { text-decoration: underline; }`}</style>
      <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 16 }}>
        <Box flex="1">
          <Text
            color={props.heading.fontColor}
            fontFamily={PRIMARY_FONT}
            fontSize={`${props.heading.fontSize}px`}
            fontWeight={props.heading.fontWeight}
            lineHeight="1"
            textTransform={props.heading.textTransform}
          >
            {heading.split("Dunkin'")[0]}
            <Text as="span" color={ORANGE} ml={2}>
              {"DUNKIN'"}
            </Text>
          </Text>
          <Text
            mt={6}
            color={props.description.fontColor}
            fontFamily={SECONDARY_FONT}
            fontSize={`${props.description.fontSize}px`}
            fontWeight={props.description.fontWeight}
            lineHeight={{ base: "18px", md: "24px" }}
            whiteSpace="pre-line"
          >
            {description}
          </Text>
        </Box>
        <Box flex="1" maxW={{ base: "none", lg: "457px" }} ml="auto">
          {props.faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Box
                key={`${item.question}-${index}`}
                borderBottom={
                  index === props.faqs.length - 1
                    ? "none"
                    : `1px solid ${BORDER}`
                }
                py={4}
              >
                <Flex
                  as="button"
                  width="100%"
                  align="center"
                  justify="space-between"
                  textAlign="left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <Text
                    color={BROWN}
                    fontFamily={SECONDARY_FONT}
                    fontSize="16px"
                    fontWeight={500}
                  >
                    {item.question}
                  </Text>
                  <Box
                    color={BROWN}
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.3s ease"
                  >
                    <FaChevronDown />
                  </Box>
                </Flex>
                {isOpen ? (
                  <Box
                    className="dunkin-faq-answer"
                    mt={4}
                    color={BROWN}
                    fontFamily={SECONDARY_FONT}
                    fontSize={{ base: "12px", md: "14px" }}
                    lineHeight={{ base: "16px", md: "18px" }}
                    dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                  />
                ) : null}
              </Box>
            );
          })}
        </Box>
      </Flex>
    </Box>
  );
};

export const DunkinAboutFaqSection: ComponentConfig<DunkinAboutFaqSectionProps> =
  {
    label: "Dunkin About FAQ",
    fields: DunkinAboutFaqSectionFields,
    defaultProps: {
      heading: createTextDefault("About Dunkin'", 48, BROWN, 800, "uppercase"),
      description: createTextDefault(
        "Dunkin’ is America’s favorite all-day, everyday stop for coffee, espresso, breakfast sandwiches and donuts. The world’s leading baked goods and coffee chain, Dunkin’ serves more than 3 million customers each day. With 50+ varieties of donuts and dozens of premium beverages, there is always something to satisfy your craving.\n\nDunkin’ is proud to serve Washington, DC for all breakfast and snacking needs. Stop by today to try a classic favorite or a new featured product!",
        18,
        BROWN,
        400,
        "normal",
      ),
      faqs: [
        {
          question: "How do I activate my Dunkin' card?",
          answerHtml:
            "Rewards members can add a Dunkin' card to the app by expanding the main menu in the top left-hand corner, selecting 'Manage Payments,' and then tapping 'Add a Dunkin' Card.'",
        },
        {
          question: "How do I order Dunkin' online?",
          answerHtml:
            'Dunkin’ can be ordered using the <a href="https://www.dunkindonuts.com/en/mobile-app">Dunkin’ mobile app</a>. Store participation may vary.',
        },
        {
          question: "Why download the Dunkin' mobile app?",
          answerHtml:
            "<a href=\"https://dunkin.app.link/location-faq\">Download</a> the Dunkin' mobile app and skip the wait by ordering ahead, earn FREE food and drinks when you join Dunkin' Rewards, and receive access to member exclusive deals every week!",
        },
        {
          question: "How can I apply to work at Dunkin?",
          answerHtml:
            'We would love to have you join our team! You can find all available positions <a href="https://www.dunkindonuts.com/en/careers/career-opportunities">HERE</a>.',
        },
        {
          question: "Does Dunkin' deliver?",
          answerHtml:
            'Yes! Dunkin\' has teamed up with Grubhub®, Uber Eats® and DoorDash® to bring you coffee, donuts, bagels and sandwiches to your door. Please visit <a href="https://www.dunkindonuts.com/en/dunkin-delivers">dunkindelivers.com</a> for more information. Store participation may vary.',
        },
      ],
    },
    render: DunkinAboutFaqSectionComponent,
  };
