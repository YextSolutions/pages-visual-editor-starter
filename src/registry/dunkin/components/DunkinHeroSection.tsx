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
import {
  Address,
  ComplexImageType,
  HoursStatus,
  HoursTable,
  ImageType,
  Link,
} from "@yext/pages-components";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BROWN = "#3e342f";
const PINK = "#c63663";
const ORANGE = "#ef6a00";
const BORDER = "#d5d5d5";
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

type FeatureItem = {
  value: string;
};

export type DunkinHeroSectionProps = {
  leftImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  rightImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  heading: StyledTextProps;
  storeLabel: StyledTextProps;
  hoursLabel: StyledTextProps;
  featuresLabel: StyledTextProps;
  directionsCta: LinkItem;
  appCta: LinkItem;
  features: FeatureItem[];
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

const textStyles = (value: StyledTextProps) => ({
  fontSize: `${value.fontSize}px`,
  color: value.fontColor,
  fontWeight: value.fontWeight,
  textTransform: value.textTransform,
});

const buttonStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "32px",
  padding: "0 20px",
  borderRadius: "999px",
  fontFamily: PRIMARY_FONT,
  fontSize: "11px",
  fontWeight: 800,
  lineHeight: "11px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

export const DunkinHeroSectionFields: Fields<DunkinHeroSectionProps> = {
  leftImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Left Image",
    filter: { types: ["type.image"] },
  }),
  rightImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Right Image",
    filter: { types: ["type.image"] },
  }),
  heading: createStyledTextFields("Heading"),
  storeLabel: createStyledTextFields("Store Label"),
  hoursLabel: createStyledTextFields("Hours Label"),
  featuresLabel: createStyledTextFields("Features Label"),
  directionsCta: {
    label: "Directions Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  appCta: {
    label: "App Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  features: {
    label: "Features",
    type: "array",
    arrayFields: {
      value: { label: "Value", type: "text" },
    },
    defaultItemProps: {
      value: "Feature",
    },
    getItemSummary: (item: FeatureItem) => item.value,
  },
};

export const DunkinHeroSectionComponent: PuckComponent<
  DunkinHeroSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, any>;
  const locale = streamDocument.locale ?? "en";
  const leftImage = resolveComponentData(
    props.leftImage,
    locale,
    streamDocument,
  );
  const rightImage = resolveComponentData(
    props.rightImage,
    locale,
    streamDocument,
  );
  const heading = resolveText(props.heading, locale, streamDocument);
  const storeLabel = resolveText(props.storeLabel, locale, streamDocument);
  const hoursLabel = resolveText(props.hoursLabel, locale, streamDocument);
  const featuresLabel = resolveText(
    props.featuresLabel,
    locale,
    streamDocument,
  );

  return (
    <Box bg={OFF_WHITE} borderBottom={`1px solid ${BORDER}`} overflow="hidden">
      <style>{`
        .dunkin-hero .HoursStatus-current { font-weight: 700; margin-right: 8px; }
        .dunkin-hero .HoursTable-row { padding-left: 12px; font-family: ${SECONDARY_FONT}; font-size: 12px; line-height: 16px; color: ${BROWN}; }
        .dunkin-hero .HoursTable-row.is-today { font-weight: 700; padding-left: 0; }
        .dunkin-hero .HoursTable-row.is-today:before { content: ""; display: inline-flex; width: 4px; height: 18px; margin-right: 8px; border-radius: 999px; background: ${PINK}; vertical-align: text-top; }
        .dunkin-hero-side-image { overflow: hidden; }
        .dunkin-hero-side-image img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
      `}</style>
      <Box className="dunkin-hero" position="relative">
        <Box
          position="relative"
          overflow="hidden"
          px={{ base: 5, md: 8, xl: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 8, md: 10 }}
          minH={{ base: "auto", md: "190px" }}
        >
          <Box
            className="dunkin-hero-side-image"
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            width={{ base: "120px", md: "210px", xl: "250px" }}
            display={{ base: "none", md: "block" }}
          >
            {leftImage ? <Image image={leftImage} /> : null}
          </Box>
          <Box
            className="dunkin-hero-side-image"
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            width={{ base: "170px", md: "250px", xl: "320px" }}
            display={{ base: "none", md: "block" }}
          >
            {rightImage ? <Image image={rightImage} /> : null}
          </Box>
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            minH={{ base: "auto", md: "160px" }}
          >
            <Text
              fontFamily={PRIMARY_FONT}
              letterSpacing="0.01em"
              {...textStyles(props.heading)}
            >
              {heading ||
                (streamDocument.address?.line1 as string)?.toUpperCase()}
            </Text>
            <Box
              mt={3}
              fontFamily={SECONDARY_FONT}
              fontSize="12px"
              lineHeight="16px"
              color={BROWN}
            >
              {streamDocument.hours ? (
                <HoursStatus
                  hours={streamDocument.hours}
                  timezone={streamDocument.timezone}
                />
              ) : null}
            </Box>
            <Flex mt={5} gap={3} wrap="wrap" justify="center">
              <Link
                cta={{
                  link: props.directionsCta.link,
                  label: props.directionsCta.label,
                  linkType: "URL",
                }}
                style={{
                  ...buttonStyles,
                  background: PINK,
                  border: `2px solid ${PINK}`,
                  color: "#ffffff",
                }}
              >
                {props.directionsCta.label}
              </Link>
              <Link
                cta={{
                  link: props.appCta.link,
                  label: props.appCta.label,
                  linkType: "URL",
                }}
                style={{
                  ...buttonStyles,
                  background: "#ffffff",
                  border: `2px solid ${BROWN}`,
                  color: BROWN,
                }}
              >
                {props.appCta.label}
              </Link>
            </Flex>
          </Flex>
        </Box>
        <Flex
          mt={{ base: 8, md: 10 }}
          borderTop={`1px solid ${BORDER}`}
          direction={{ base: "column", lg: "row" }}
        >
          <Box
            flex="1"
            borderBottom={{ base: `1px solid ${BORDER}`, lg: "none" }}
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 5 }}
          >
            <Text
              fontFamily={PRIMARY_FONT}
              mb={2}
              {...textStyles(props.storeLabel)}
            >
              {storeLabel}
            </Text>
            <Box
              color={BROWN}
              fontFamily={SECONDARY_FONT}
              fontSize="12px"
              lineHeight="18px"
            >
              {streamDocument.address ? (
                <Address address={streamDocument.address} />
              ) : null}
              {streamDocument.mainPhone ? (
                <Text mt={2}>{streamDocument.mainPhone}</Text>
              ) : null}
            </Box>
          </Box>
          <Box
            flex="1"
            borderBottom={{ base: `1px solid ${BORDER}`, lg: "none" }}
            borderLeft={{ base: "none", lg: `1px solid ${BORDER}` }}
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 5 }}
          >
            <Text
              fontFamily={PRIMARY_FONT}
              mb={2}
              {...textStyles(props.hoursLabel)}
            >
              {hoursLabel}
            </Text>
            {streamDocument.hours ? (
              <HoursTable
                hours={streamDocument.hours}
                startOfWeek="monday"
                collapseDays={false}
              />
            ) : null}
          </Box>
          <Box
            flex="1"
            borderLeft={{ base: "none", lg: `1px solid ${BORDER}` }}
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 5 }}
          >
            <Text
              fontFamily={PRIMARY_FONT}
              mb={2}
              {...textStyles(props.featuresLabel)}
            >
              {featuresLabel}
            </Text>
            <Flex direction="column" gap={2}>
              {props.features.map((feature, index) => (
                <Flex key={`${feature.value}-${index}`} align="center" gap={3}>
                  <Box
                    width="7px"
                    height="7px"
                    border={`1px solid ${ORANGE}`}
                    borderRadius="2px"
                    flexShrink={0}
                  />
                  <Text
                    color={BROWN}
                    fontFamily={SECONDARY_FONT}
                    fontSize="12px"
                    lineHeight="16px"
                  >
                    {feature.value}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export const DunkinHeroSection: ComponentConfig<DunkinHeroSectionProps> = {
  label: "Dunkin Hero",
  fields: DunkinHeroSectionFields,
  defaultProps: {
    leftImage: {
      field: "",
      constantValue: {
        url: "https://a.mktgcdn.com/p/Zh09XQZ2Tt8cjZPu-0Zf52eP9sWaPsz3wvvLBFwGP7Q/211x271.png",
        width: 211,
        height: 271,
      },
      constantValueEnabled: true,
    },
    rightImage: {
      field: "",
      constantValue: {
        url: "https://a.mktgcdn.com/p/93BJovAwqoGG7bS3ya3HNyyM6i3Zo4Wyf63yuCYyOtw/508x452.jpg",
        width: 508,
        height: 452,
      },
      constantValueEnabled: true,
    },
    heading: createTextDefault("406 8TH ST SE.", 48, BROWN, 800, "uppercase"),
    storeLabel: createTextDefault(
      "DUNKIN' NEAR YOU",
      18,
      BROWN,
      800,
      "uppercase",
    ),
    hoursLabel: createTextDefault("Hours", 18, BROWN, 800, "uppercase"),
    featuresLabel: createTextDefault("Features", 18, BROWN, 800, "uppercase"),
    directionsCta: {
      label: "Get Directions",
      link: "https://maps.google.com/?q=406%208th%20St%20SE%20Washington%20DC%2020003",
    },
    appCta: {
      label: "Download App",
      link: "https://www.dunkindonuts.com/en/dd-cards/mobile-app",
    },
    features: [
      { value: "On-the-Go Mobile Ordering" },
      { value: "Free WiFi" },
      { value: "Baskin-Robbins" },
      { value: "K-Cup Pods" },
      { value: "On Tap" },
    ],
  },
  render: DunkinHeroSectionComponent,
};
