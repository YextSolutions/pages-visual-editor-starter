import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "@yext/pages-components";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BROWN = "#3e342f";
const BORDER = "#d5d5d5";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type BreadcrumbItem = {
  label: string;
  link: string;
};

export type DunkinBreadcrumbSectionProps = {
  items: BreadcrumbItem[];
  currentLabel: StyledTextProps;
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

export const DunkinBreadcrumbSectionFields: Fields<DunkinBreadcrumbSectionProps> =
  {
    items: {
      label: "Items",
      type: "array",
      arrayFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
      defaultItemProps: {
        label: "Directory",
        link: "/",
      },
      getItemSummary: (item: BreadcrumbItem) => item.label,
    },
    currentLabel: createStyledTextFields("Current Label"),
  };

export const DunkinBreadcrumbSectionComponent: PuckComponent<
  DunkinBreadcrumbSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const currentLabel =
    resolveComponentData(props.currentLabel.text, locale, streamDocument) || "";

  return (
    <Box borderBottom={`1px solid ${BORDER}`} px={{ base: 4, lg: 6 }} py={3}>
      <Flex
        align="center"
        color={BROWN}
        fontFamily={SECONDARY_FONT}
        fontSize="12px"
        gap={2}
        wrap="wrap"
      >
        <Text aria-hidden="true" fontSize="15px" transform="translateY(-1px)">
          &lsaquo;
        </Text>
        {props.items.map((item, index) => (
          <Flex align="center" gap={2} key={`${item.label}-${index}`}>
            <Link
              cta={{ link: item.link, label: item.label, linkType: "URL" }}
              style={{
                color: BROWN,
                fontFamily: SECONDARY_FONT,
                fontSize: "12px",
                fontWeight: 400,
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
            <Text>/</Text>
          </Flex>
        ))}
        <Text
          color={props.currentLabel.fontColor}
          fontFamily={PRIMARY_FONT}
          fontSize={`${props.currentLabel.fontSize}px`}
          fontWeight={props.currentLabel.fontWeight}
          textTransform={props.currentLabel.textTransform}
        >
          {currentLabel}
        </Text>
      </Flex>
    </Box>
  );
};

export const DunkinBreadcrumbSection: ComponentConfig<DunkinBreadcrumbSectionProps> =
  {
    label: "Dunkin Breadcrumb",
    fields: DunkinBreadcrumbSectionFields,
    defaultProps: {
      items: [
        { label: "Directory", link: "en" },
        { label: "Washington DC", link: "en/dc" },
        { label: "Washington", link: "en/dc/washington" },
      ],
      currentLabel: createTextDefault(
        "406 8th St SE",
        12,
        BROWN,
        500,
        "normal",
      ),
    },
    render: DunkinBreadcrumbSectionComponent,
  };
