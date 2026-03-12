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

export type YetiReservationBannerSectionProps = {
  backgroundImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  heading: StyledTextProps;
  body: StyledTextProps;
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
};

const YetiReservationBannerSectionFields: Fields<YetiReservationBannerSectionProps> =
  {
    backgroundImage: YextEntityFieldSelector<
      any,
      ImageType | ComplexImageType | TranslatableAssetImage
    >({
      label: "Background Image",
      filter: { types: ["type.image"] },
    }),
    heading: createStyledTextField("Heading"),
    body: createStyledTextField("Body"),
    cta: createLinkField("Call To Action"),
  };

export const YetiReservationBannerSectionComponent: PuckComponent<
  YetiReservationBannerSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const backgroundImage = resolveComponentData(
    props.backgroundImage,
    locale,
    streamDocument,
  );
  const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const body = resolveComponentData(props.body.text, locale, streamDocument) || "";

  return (
    <Box as="section" position="relative" h={{ base: "420px", md: "500px" }} overflow="hidden">
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
        bg="linear-gradient(90deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.3) 28%, rgba(0, 0, 0, 0) 58%)"
      />
      <Flex
        position="relative"
        zIndex={1}
        h="100%"
        align="flex-end"
        px={{ base: "35px", md: "75px" }}
        pb="55px"
      >
        <Box maxW={{ base: "280px", md: "410px" }}>
          <Text
            color={props.heading.fontColor}
            fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
            fontSize={{ base: "42px", md: `${props.heading.fontSize}px` }}
            fontWeight={props.heading.fontWeight}
            letterSpacing="3px"
            lineHeight="1"
            textTransform={props.heading.textTransform}
          >
            {heading}
          </Text>
          <Text
            mt="10px"
            mb="24px"
            color={props.body.fontColor}
            fontFamily="'urw-din', 'Oswald', sans-serif"
            fontSize={{ base: "14px", md: `${props.body.fontSize}px` }}
            fontWeight={props.body.fontWeight}
            lineHeight="1.5"
            letterSpacing="0.08px"
            textTransform={props.body.textTransform}
            maxW={{ base: "290px", md: "360px" }}
          >
            {body}
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

export const YetiReservationBannerSection: ComponentConfig<YetiReservationBannerSectionProps> =
  {
    label: "Yeti Reservation Banner",
    fields: YetiReservationBannerSectionFields,
    defaultProps: {
      backgroundImage: {
        field: "",
        constantValue: {
          url: "https://yeti-webmedia.imgix.net/m/204eb0035a6bce05/original/240074_PLP_BMD_3-0_Paragraph_Lifestyle_Store_Page_Desktop.jpg?auto=format,compress",
          width: 1920,
          height: 500,
        },
        constantValueEnabled: true,
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "PUT IT ON ICE",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 45,
        fontColor: "#ffffff",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      body: {
        text: {
          field: "",
          constantValue: {
            en: "Reserve gear in your local YETI® store to pickup when you're ready.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 14,
        fontColor: "#ffffff",
        fontWeight: 400,
        textTransform: "normal",
      },
      cta: {
        label: "Shop the shop",
        link: "https://yeti.locally.com/search/search?embed_type=store&store=383985&uri=search&limit=6&host_domain=www.yeti.com",
      },
    },
    render: YetiReservationBannerSectionComponent,
  };
