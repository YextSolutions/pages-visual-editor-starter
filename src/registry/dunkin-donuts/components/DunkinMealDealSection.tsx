import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  Image,
  TranslatableAssetImage,
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ComplexImageType, ImageType, Link } from "@yext/pages-components";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BORDER = "#d5d5d5";
const PINK = "#c63663";
const BROWN = "#3e342f";
const OFF_WHITE = "#fbf7f4";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type LinkItem = {
  label: string;
  link: string;
};

export type DunkinMealDealSectionProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: StyledTextProps;
  description: StyledTextProps;
  cta: LinkItem;
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

const resolveText = (
  value: StyledTextProps,
  locale: string,
  streamDocument: Record<string, unknown>,
) => resolveComponentData(value.text, locale, streamDocument) || "";

export const DunkinMealDealSectionFields: Fields<DunkinMealDealSectionProps> = {
  image: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Image",
    filter: { types: ["type.image"] },
  }),
  title: createStyledTextFields("Title"),
  description: createStyledTextFields("Description"),
  cta: {
    label: "Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
};

export const DunkinMealDealSectionComponent: PuckComponent<
  DunkinMealDealSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const image = resolveComponentData(props.image, locale, streamDocument);
  const title = resolveText(props.title, locale, streamDocument);
  const description = resolveText(props.description, locale, streamDocument);

  return (
    <Box bg={OFF_WHITE} borderBottom={`1px solid ${BORDER}`}>
      <Flex direction={{ base: "column", md: "row" }} align="center">
        <Box width={{ base: "100%", md: "170px" }} flexShrink={0}>
          {image ? <Image image={image} /> : null}
        </Box>
        <Flex
          flex="1"
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
        >
          <Text
            color={props.title.fontColor}
            fontFamily={PRIMARY_FONT}
            fontSize={`${props.title.fontSize}px`}
            fontWeight={props.title.fontWeight}
            lineHeight="1"
            textTransform={props.title.textTransform}
          >
            {title}
          </Text>
          <Text
            mt={3}
            color={props.description.fontColor}
            fontFamily={SECONDARY_FONT}
            fontSize={`${props.description.fontSize}px`}
            fontWeight={props.description.fontWeight}
            lineHeight="18px"
            maxW="640px"
          >
            {description}
          </Text>
          <Link
            cta={{
              link: props.cta.link,
              label: props.cta.label,
              linkType: "URL",
            }}
            style={{
              marginTop: "18px",
              minHeight: "28px",
              padding: "0 24px",
              borderRadius: "999px",
              background: PINK,
              border: `2px solid ${PINK}`,
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: PRIMARY_FONT,
              fontSize: "11px",
              fontWeight: 800,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            {props.cta.label}
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export const DunkinMealDealSection: ComponentConfig<DunkinMealDealSectionProps> =
  {
    label: "Dunkin Meal Deal",
    fields: DunkinMealDealSectionFields,
    defaultProps: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/111ihr-6aAx2GkEp3qFfuDz4aWFhLnZe4NuPX0yeLDY/812x676.png",
          width: 812,
          height: 676,
        },
        constantValueEnabled: true,
      },
      title: createTextDefault("$6 Meal Deal", 44, PINK, 800, "uppercase"),
      description: createTextDefault(
        "It's the biggest deal in breakfast! For a limited time, enjoy a medium Hot or Iced Coffee, Bacon, Egg & Cheese, and Hash Browns for $6. Terms & excl. apply.",
        12,
        BROWN,
        400,
        "normal",
      ),
      cta: {
        label: "Order Now",
        link: "https://www.dunkindonuts.com/en/mobile-app",
      },
    },
    render: DunkinMealDealSectionComponent,
  };
