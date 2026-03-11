import { Box, Flex, Text } from "@chakra-ui/react";
import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { Address, HoursStatus, HoursTable, Link } from "@yext/pages-components";
import {
  resolveComponentData,
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

export type YetiHoursLocationSectionProps = {
  title: StyledTextProps;
  locationTitle: StyledTextProps;
  parkingTitle: StyledTextProps;
  parkingCopy: StyledTextProps;
  directionsCta: LinkProps;
  callCta: LinkProps;
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

const YetiHoursLocationSectionFields: Fields<YetiHoursLocationSectionProps> = {
  title: createStyledTextField("Heading"),
  locationTitle: createStyledTextField("Location Heading"),
  parkingTitle: createStyledTextField("Parking Heading"),
  parkingCopy: createStyledTextField("Parking Copy"),
  directionsCta: createLinkField("Directions Call To Action"),
  callCta: createLinkField("Call Call To Action"),
};

const titleStyles = {
  fontFamily: "'stratum-1-web', 'Barlow Condensed', sans-serif",
  lineHeight: 1,
  letterSpacing: { base: "1.3px", md: "1.8px" },
};

export const YetiHoursLocationSectionComponent: PuckComponent<
  YetiHoursLocationSectionProps
> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const title = resolveComponentData(props.title.text, locale, streamDocument) || "";
  const locationTitle =
    resolveComponentData(props.locationTitle.text, locale, streamDocument) || "";
  const parkingTitle =
    resolveComponentData(props.parkingTitle.text, locale, streamDocument) || "";
  const parkingCopy =
    resolveComponentData(props.parkingCopy.text, locale, streamDocument) || "";

  return (
    <Box as="section" bg="#ffffff" py={{ base: "60px", md: "60px" }}>
      <Box maxW="692px" mx="auto" px={{ base: "20px", md: "0" }}>
        <Text
          {...titleStyles}
          color={props.title.fontColor}
          fontSize={{ base: "26px", md: `${props.title.fontSize}px` }}
          fontWeight={props.title.fontWeight}
          textTransform={props.title.textTransform}
        >
          {title}
        </Text>

        <Box mt="25px">
          <Flex
            align="center"
            justify="space-between"
            position="relative"
            color="#002b45"
            fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
            fontSize={{ base: "22px", md: "26px" }}
            fontWeight={900}
            letterSpacing="1.3px"
            textTransform="uppercase"
          >
            <Flex align="center" gap="10px">
              <Text fontSize="18px">◉</Text>
              <HoursStatus
                hours={streamDocument.hours}
                timezone={streamDocument.timezone}
              />
            </Flex>
            <Text fontSize="16px">⌃</Text>
          </Flex>
          {streamDocument.hours && (
            <Box mt={{ base: "14px", md: "5px" }} color="#565656">
              <HoursTable
                hours={streamDocument.hours}
                startOfWeek="today"
                collapseDays={false}
              />
            </Box>
          )}
        </Box>

        <Box mt="70px">
          <Text
            {...titleStyles}
            color={props.locationTitle.fontColor}
            fontSize={{ base: "26px", md: `${props.locationTitle.fontSize}px` }}
            fontWeight={props.locationTitle.fontWeight}
            textTransform={props.locationTitle.textTransform}
          >
            {locationTitle}
          </Text>
          <Box
            mt="30px"
            color="#565656"
            fontSize={{ base: "16px", md: "18px" }}
            lineHeight="1.5"
            letterSpacing="0.09px"
            fontFamily="'urw-din', 'Oswald', sans-serif"
          >
            {streamDocument.address && <Address address={streamDocument.address} />}
          </Box>
          <Flex mt="30px" gap="30px" flexWrap="wrap">
            <Link
              cta={{
                link: props.directionsCta.link,
                linkType: "URL",
                label: props.directionsCta.label,
              }}
              style={{
                color: "#565656",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {props.directionsCta.label}
            </Link>
            <Link
              cta={{
                link: props.callCta.link,
                linkType: "PHONE",
                label: props.callCta.label,
              }}
              style={{
                color: "#565656",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {props.callCta.label}
            </Link>
          </Flex>
          <Box
            mt={{ base: "32px", md: "24px" }}
            h="272px"
            borderRadius="6px"
            bg="#ffffff"
          />
        </Box>

        <Box mt={{ base: "95px", md: "15px" }}>
          <Text
            {...titleStyles}
            color={props.parkingTitle.fontColor}
            fontSize={{ base: "26px", md: `${props.parkingTitle.fontSize}px` }}
            fontWeight={props.parkingTitle.fontWeight}
            textTransform={props.parkingTitle.textTransform}
          >
            {parkingTitle}
          </Text>
          <Text
            mt="15px"
            color={props.parkingCopy.fontColor}
            fontFamily="'urw-din', 'Oswald', sans-serif"
            fontSize={{ base: "16px", md: `${props.parkingCopy.fontSize}px` }}
            fontWeight={props.parkingCopy.fontWeight}
            lineHeight="1.5"
            letterSpacing="0.09px"
            textTransform={props.parkingCopy.textTransform}
          >
            {parkingCopy}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export const YetiHoursLocationSection: ComponentConfig<YetiHoursLocationSectionProps> =
  {
    label: "Yeti Hours & Location",
    fields: YetiHoursLocationSectionFields,
    defaultProps: {
      title: {
        text: {
          field: "",
          constantValue: {
            en: "Hours & Location",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#4b4f53",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      locationTitle: {
        text: {
          field: "",
          constantValue: {
            en: "Location",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#4b4f53",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      parkingTitle: {
        text: {
          field: "",
          constantValue: {
            en: "Parking",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 36,
        fontColor: "#002b45",
        fontWeight: 900,
        textTransform: "uppercase",
      },
      parkingCopy: {
        text: {
          field: "",
          constantValue: {
            en: "Free parking for YETI can be found at any of Tysons Corner Center parking garages or surface lots.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#565656",
        fontWeight: 400,
        textTransform: "normal",
      },
      directionsCta: {
        label: "Get Directions",
        link: "https://maps.google.com/maps/dir//1961+Chain+Bridge+Rd+Suite+#G7AU,+McLean,+VA+22102,+USA",
      },
      callCta: {
        label: "Call Us",
        link: "tel:(703) 310-7096",
      },
    },
    render: YetiHoursLocationSectionComponent,
  };
