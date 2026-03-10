import { Box, Flex, Text } from "@chakra-ui/react";
import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Link, ImageType, ComplexImageType } from "@yext/pages-components";
import {
  Image,
  resolveComponentData,
  TranslatableAssetImage,
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

type LinkProps = {
  label: string;
  link: string;
};

export type YetiHeroSectionProps = {
  backgroundImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  heading: StyledTextProps;
  cta: LinkProps;
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

const createLinkField = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  }) as const;

const buttonStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "15px 40px",
  border: "2px solid #ffffff",
  borderRadius: "6px",
  bg: "transparent",
  color: "#ffffff",
  fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
  fontSize: "16px",
  fontWeight: 900,
  letterSpacing: "0.8px",
  lineHeight: "16px",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  transition: "all 0.2s ease",
};

const YetiHeroSectionFields: Fields<YetiHeroSectionProps> = {
  backgroundImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Background Image",
    filter: { types: ["type.image"] },
  }),
  heading: createStyledTextField("Heading"),
  cta: createLinkField("Call To Action"),
};

export const YetiHeroSectionComponent: PuckComponent<YetiHeroSectionProps> = (
  props,
) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const backgroundImage = resolveComponentData(
    props.backgroundImage,
    locale,
    streamDocument,
  );
  const headingText =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";

  return (
    <Box
      as="section"
      position="relative"
      h={{ base: "420px", md: "500px" }}
      overflow="hidden"
      bg="#23262a"
    >
      {backgroundImage && (
        <Box position="absolute" inset={0} overflow="hidden">
          <Image
            image={backgroundImage}
            className="h-full"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              minWidth: "100%",
              minHeight: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      )}
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(90deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.28) 28%, rgba(0, 0, 0, 0) 60%)"
      />
      <Flex
        position="relative"
        zIndex={1}
        h="100%"
        align="flex-end"
        px={{ base: "35px", md: "75px" }}
        pb="55px"
      >
        <Box maxW={{ base: "250px", md: "340px" }}>
          <Text
            mb="24px"
            color={props.heading.fontColor}
            fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
            fontSize={{ base: "42px", md: `${props.heading.fontSize}px` }}
            fontWeight={props.heading.fontWeight}
            letterSpacing={{ base: "2.8px", md: "4.6px" }}
            lineHeight="0.92"
            textTransform={props.heading.textTransform}
          >
            {headingText}
          </Text>
          <Link
            cta={{
              link: props.cta.link,
              linkType: "URL",
              label: props.cta.label,
            }}
            style={buttonStyles}
          >
            {props.cta.label}
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export const YetiHeroSection: ComponentConfig<YetiHeroSectionProps> = {
  label: "Yeti Hero",
  fields: YetiHeroSectionFields,
  defaultProps: {
    backgroundImage: {
      field: "",
      constantValue: {
        url: "https://yeti-webmedia.imgix.net/m/3cb9859ceabd08a7/original/240039_PLP_BMD_3-0_Paragraph_NSo_Tyson_Desktop.jpg?auto=format,compress",
        width: 1920,
        height: 500,
      },
      constantValueEnabled: true,
    },
    heading: {
      text: {
        field: "",
        constantValue: {
          en: "TYSONS CORNER CENTER",
          hasLocalizedValue: "true",
        },
        constantValueEnabled: true,
      },
      fontSize: 68,
      fontColor: "#ffffff",
      fontWeight: 900,
      textTransform: "uppercase",
    },
    cta: {
      label: "Shop the shop",
      link: "https://yeti.locally.com/search/search?embed_type=store&store=383985&uri=search&limit=6&host_domain=www.yeti.com",
    },
  },
  render: YetiHeroSectionComponent,
};
