import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import {
  TranslatableString,
  YextEntityField,
  YextEntityFieldSelector,
  resolveComponentData,
  useDocument,
} from "@yext/visual-editor";
import { Link } from "@yext/pages-components";

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

type StoreCard = {
  title: string;
  status: string;
  addressLine1: string;
  addressLine2: string;
};

type LinkItem = {
  label: string;
  link: string;
};

export type DunkinNearbyStoresSectionProps = {
  heading: StyledTextProps;
  brandText: StyledTextProps;
  cta: LinkItem;
  stores: StoreCard[];
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

export const DunkinNearbyStoresSectionFields: Fields<DunkinNearbyStoresSectionProps> =
  {
    heading: createStyledTextFields("Heading"),
    brandText: createStyledTextFields("Brand Text"),
    cta: {
      label: "Call To Action",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
    stores: {
      label: "Stores",
      type: "array",
      arrayFields: {
        title: { label: "Title", type: "text" },
        status: { label: "Status", type: "text" },
        addressLine1: { label: "Address Line 1", type: "text" },
        addressLine2: { label: "Address Line 2", type: "text" },
      },
      defaultItemProps: {
        title: "Store Name",
        status: "Open Now",
        addressLine1: "Address",
        addressLine2: "City, State Zip",
      },
      getItemSummary: (item: StoreCard) => item.title,
    },
  };

export const DunkinNearbyStoresSectionComponent: PuckComponent<
  DunkinNearbyStoresSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const heading =
    resolveComponentData(props.heading.text, locale, streamDocument) || "";
  const brandText =
    resolveComponentData(props.brandText.text, locale, streamDocument) || "";

  return (
    <div
      className="border-b px-4 py-8 md:px-6 md:py-14"
      style={{ borderColor: BORDER, backgroundColor: OFF_WHITE }}
    >
      <div className="text-center">
        <p
          style={{
            fontFamily: PRIMARY_FONT,
            fontSize: `${props.heading.fontSize}px`,
            fontWeight: props.heading.fontWeight,
            textTransform: props.heading.textTransform,
          }}
        >
          <span style={{ color: ORANGE }}>
            {brandText}
          </span>{" "}
          <span style={{ color: BROWN }}>
            {heading}
          </span>
        </p>
        <Link
          cta={{
            link: props.cta.link,
            label: props.cta.label,
            linkType: "URL",
          }}
          style={{
            marginTop: "18px",
            minHeight: "30px",
            padding: "0 22px",
            borderRadius: "999px",
            background: "#ffffff",
            border: `2px solid ${BROWN}`,
            color: BROWN,
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
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {props.stores.map((store, index) => (
          <div
            key={`${store.title}-${index}`}
            className="rounded-[12px] border bg-white px-6 py-5"
            style={{ borderColor: BORDER }}
          >
            <p
              style={{
                color: BROWN,
                fontFamily: PRIMARY_FONT,
                fontSize: "22px",
                fontWeight: 800,
                lineHeight: "1",
              }}
            >
              {store.title}
            </p>
            <p
              className="mt-2"
              style={{
                color: BROWN,
                fontFamily: SECONDARY_FONT,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {store.status}
            </p>
            <p
              className="mt-4"
              style={{
                color: BROWN,
                fontFamily: SECONDARY_FONT,
                fontSize: "11px",
                lineHeight: "16px",
              }}
            >
              {store.addressLine1}
              <br />
              {store.addressLine2}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DunkinNearbyStoresSection: ComponentConfig<DunkinNearbyStoresSectionProps> =
  {
    label: "Dunkin Nearby Stores",
    fields: DunkinNearbyStoresSectionFields,
    defaultProps: {
      heading: createTextDefault(
        "STORES NEAR YOU",
        42,
        BROWN,
        800,
        "uppercase",
      ),
      brandText: createTextDefault("DUNKIN'", 42, ORANGE, 800, "uppercase"),
      cta: {
        label: "Find A Store",
        link: "https://www.dunkindonuts.com/en/locations",
      },
      stores: [
        {
          title: "101 INDEPENDENCE AVE SE",
          status: "Open Now  Closes at 2:00 PM",
          addressLine1: "101 Independence Ave SE",
          addressLine2: "Washington, DC 20004",
        },
        {
          title: "50 MASSACHUSETTS AVE",
          status: "Open Now  Closes at 4:00 PM",
          addressLine1: "50 Massachusetts Ave",
          addressLine2: "Washington, DC 20002",
        },
        {
          title: "175 N STREET NE",
          status: "Open Now  Closes at 4:30 PM",
          addressLine1: "175 N Street NE",
          addressLine2: "Washington, DC 20002",
        },
      ],
    },
    render: DunkinNearbyStoresSectionComponent,
  };
