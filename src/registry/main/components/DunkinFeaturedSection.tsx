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
import { ComplexImageType, ImageType, Link } from "@yext/pages-components";

const PRIMARY_FONT = "'Dunkin Sans', 'Open Sans', sans-serif";
const SECONDARY_FONT = "'Proxima Nova', 'Open Sans', sans-serif";
const BORDER = "#d5d5d5";
const PINK = "#c63663";
const ORANGE = "#ef6a00";
const BROWN = "#3e342f";
const OFF_WHITE = "#fbf7f4";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type ProductItem = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  label: string;
  link: string;
  mobileLink: string;
};

type DeliveryItem = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  label: string;
  link: string;
};

type LinkItem = {
  label: string;
  link: string;
};

export type DunkinFeaturedSectionProps = {
  heading: StyledTextProps;
  menuCta: LinkItem;
  products: ProductItem[];
  deliveryHeading: StyledTextProps;
  deliverySubheading: StyledTextProps;
  deliveries: DeliveryItem[];
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

export const DunkinFeaturedSectionFields: Fields<DunkinFeaturedSectionProps> = {
  heading: createStyledTextFields("Heading"),
  menuCta: {
    label: "Menu Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
  },
  products: {
    label: "Products",
    type: "array",
    arrayFields: {
      image: YextEntityFieldSelector<
        any,
        ImageType | ComplexImageType | TranslatableAssetImage
      >({
        label: "Image",
        filter: { types: ["type.image"] },
      }),
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
      mobileLink: { label: "Mobile Link", type: "text" },
    },
    defaultItemProps: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/XwZJNFDuQiConZr7TzjIefX5FXcWSwBeJvKsHjQuep4/400x400.png",
          width: 400,
          height: 400,
        },
        constantValueEnabled: true,
      },
      label: "Featured Item",
      link: "#",
      mobileLink: "#",
    },
    getItemSummary: (item: ProductItem) => item.label,
  },
  deliveryHeading: createStyledTextFields("Delivery Heading"),
  deliverySubheading: createStyledTextFields("Delivery Subheading"),
  deliveries: {
    label: "Deliveries",
    type: "array",
    arrayFields: {
      image: YextEntityFieldSelector<
        any,
        ImageType | ComplexImageType | TranslatableAssetImage
      >({
        label: "Image",
        filter: { types: ["type.image"] },
      }),
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/TBz75UhIx19JxSzGG43VjEJLGud5m3esLgkfuZ_Is70/827x233.png",
          width: 827,
          height: 233,
        },
        constantValueEnabled: true,
      },
      label: "Order Now",
      link: "#",
    },
    getItemSummary: (item: DeliveryItem) => item.label,
  },
};

export const DunkinFeaturedSectionComponent: PuckComponent<
  DunkinFeaturedSectionProps
> = (props) => {
  const streamDocument = useDocument() as Record<string, unknown>;
  const locale = (streamDocument.locale as string) ?? "en";
  const heading = resolveText(props.heading, locale, streamDocument);
  const deliveryHeading = resolveText(
    props.deliveryHeading,
    locale,
    streamDocument,
  );
  const deliverySubheading = resolveText(
    props.deliverySubheading,
    locale,
    streamDocument,
  );

  return (
    <div
      className="border-b"
      style={{ borderColor: BORDER, backgroundColor: OFF_WHITE }}
    >
      <div className="grid lg:grid-cols-[34%_repeat(3,minmax(0,1fr))]">
        <div
          className="flex flex-col items-center justify-center border-b px-8 py-8 text-center lg:border-r lg:py-20"
          style={{ borderColor: BORDER }}
        >
          <p
            className="max-w-[280px]"
            style={{
              color: props.heading.fontColor,
              fontFamily: PRIMARY_FONT,
              fontSize: `${props.heading.fontSize}px`,
              fontWeight: props.heading.fontWeight,
              lineHeight: "1",
              textTransform: props.heading.textTransform,
            }}
          >
            {heading}
          </p>
          <Link
            cta={{
              link: props.menuCta.link,
              label: props.menuCta.label,
              linkType: "URL",
            }}
            style={{
              marginTop: "18px",
              minHeight: "30px",
              padding: "0 26px",
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
            {props.menuCta.label}
          </Link>
        </div>
        {props.products.map((item, index) => {
          const image = resolveComponentData(
            item.image,
            locale,
            streamDocument,
          );
          return (
            <div
              key={`${item.label}-${index}`}
              className={`flex flex-col items-center justify-end border-b px-8 py-8 text-center ${
                index === props.products.length - 1 ? "" : "lg:border-r"
              }`}
              style={{ borderColor: BORDER }}
            >
              <div className="mb-3 w-[170px]">
                {image ? <Image image={image} /> : null}
              </div>
              <Link
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  color: BROWN,
                  fontFamily: SECONDARY_FONT,
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "underline",
                  textAlign: "center",
                }}
              >
                {item.label}
              </Link>
              <Link
                cta={{ link: item.link, label: "Order Now", linkType: "URL" }}
                style={{
                  marginTop: "16px",
                  minHeight: "30px",
                  padding: "0 22px",
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
                Order Now
              </Link>
            </div>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-[34%_repeat(3,minmax(0,1fr))]">
        <div
          className="flex flex-col items-center justify-center px-8 py-8 text-center lg:border-r lg:py-20"
          style={{ borderColor: BORDER }}
        >
          <p
            style={{
              color: props.deliveryHeading.fontColor,
              fontFamily: PRIMARY_FONT,
              fontSize: `${props.deliveryHeading.fontSize}px`,
              fontWeight: props.deliveryHeading.fontWeight,
              lineHeight: "1",
              textTransform: props.deliveryHeading.textTransform,
            }}
          >
            {deliveryHeading}
          </p>
          <p
            className="mt-2"
            style={{
              color: props.deliverySubheading.fontColor,
              fontFamily: SECONDARY_FONT,
              fontSize: `${props.deliverySubheading.fontSize}px`,
              fontWeight: props.deliverySubheading.fontWeight,
            }}
          >
            {deliverySubheading}
          </p>
        </div>
        {props.deliveries.map((item, index) => {
          const image = resolveComponentData(
            item.image,
            locale,
            streamDocument,
          );
          return (
            <div
              key={`${item.label}-${index}`}
              className={`flex flex-col items-center justify-center border-t px-8 py-8 lg:border-t-0 ${
                index === props.deliveries.length - 1 ? "" : "lg:border-r"
              }`}
              style={{ borderColor: BORDER }}
            >
              <div className="mb-3 w-[150px] lg:w-[200px]">
                {image ? <Image image={image} /> : null}
              </div>
              <Link
                cta={{ link: item.link, label: item.label, linkType: "URL" }}
                style={{
                  color: BROWN,
                  fontFamily: SECONDARY_FONT,
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "underline",
                  textAlign: "center",
                }}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DunkinFeaturedSection: ComponentConfig<DunkinFeaturedSectionProps> =
  {
    label: "Dunkin Featured",
    fields: DunkinFeaturedSectionFields,
    defaultProps: {
      heading: createTextDefault(
        "Featured Products",
        48,
        BROWN,
        800,
        "uppercase",
      ),
      menuCta: {
        label: "View Full Menu",
        link: "https://www.dunkindonuts.com/en/menu",
      },
      products: [
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/XwZJNFDuQiConZr7TzjIefX5FXcWSwBeJvKsHjQuep4/400x400.png",
              width: 400,
              height: 400,
            },
            constantValueEnabled: true,
          },
          label: "Blackberry Tangerine Dunkin' Zero",
          link: "https://www.dunkindonuts.com/en/mobile-app",
          mobileLink:
            "https://dunkin.app.link/web_locations_blacktangerinedunkinzero",
        },
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/w15GbJ1X9QeZ1DtT8qnoDWcvQXOlWM-pDDJKo3sPwj8/400x400.png",
              width: 400,
              height: 400,
            },
            constantValueEnabled: true,
          },
          label: "Wedding Cake MUNCHKINS® Donut Hole Treats",
          link: "https://www.dunkindonuts.com/en/mobile-app",
          mobileLink:
            "https://dunkin.app.link/web_locations_weddingcakemunchkins",
        },
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/9HRFZvXynlQfFtDOraDyDbKXcbYXKf6UJTDiYgvyLhg/400x400.png",
              width: 400,
              height: 400,
            },
            constantValueEnabled: true,
          },
          label: "Banana Puddin' Cloud Latte",
          link: "https://www.dunkindonuts.com/en/mobile-app",
          mobileLink:
            "https://dunkin.app.link/web_locations_bananapuddincloudlatte",
        },
      ],
      deliveryHeading: createTextDefault(
        "DUNKIN' DELIVERS",
        36,
        ORANGE,
        800,
        "uppercase",
      ),
      deliverySubheading: createTextDefault(
        "Washington, DC",
        18,
        BROWN,
        400,
        "normal",
      ),
      deliveries: [
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/TBz75UhIx19JxSzGG43VjEJLGud5m3esLgkfuZ_Is70/827x233.png",
              width: 827,
              height: 233,
            },
            constantValueEnabled: true,
          },
          label: "Order Now",
          link: "https://www.grubhub.com/food/dunkin",
        },
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/ryij_6LJCO_cF1f5VS-uJbx5_4wH297DfvmmR1ve7ao/650x144.png",
              width: 650,
              height: 144,
            },
            constantValueEnabled: true,
          },
          label: "Order Now",
          link: "https://www.ubereats.com/brand/dunkin-donuts",
        },
        {
          image: {
            field: "",
            constantValue: {
              url: "https://a.mktgcdn.com/p/ygUms21AxqQqPPW_gH4JKYpI8dCVy3LoDR51MYNyZCg/650x144.png",
              width: 650,
              height: 144,
            },
            constantValueEnabled: true,
          },
          label: "Order Now",
          link: "https://www.doordash.com/business/Dunkin--436529",
        },
      ],
    },
    render: DunkinFeaturedSectionComponent,
  };
