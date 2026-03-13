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

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type Cta = {
  label: string;
  link: string;
};

export type SweetgreenLocationHeroSectionProps = {
  eyebrow: StyledTextProps;
  title: StyledTextProps;
  description: StyledTextProps;
  primaryCta: Cta;
  secondaryCta: Cta;
  heroImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
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
] as const;

const styledTextFields = (label: string) =>
  ({
    label,
    type: "object",
    objectFields: {
      text: YextEntityFieldSelector<any, TranslatableString>({
        label: "Text",
        filter: {
          types: ["type.string"],
        },
      }),
      fontSize: { label: "Font Size", type: "number" },
      fontColor: { label: "Font Color", type: "text" },
      fontWeight: {
        label: "Font Weight",
        type: "select",
        options: [...fontWeightOptions],
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
  }) satisfies Fields<{ value: StyledTextProps }>["value"];

const SweetgreenLocationHeroSectionFields: Fields<SweetgreenLocationHeroSectionProps> =
  {
    eyebrow: styledTextFields("Eyebrow"),
    title: styledTextFields("Title"),
    description: styledTextFields("Description"),
    primaryCta: {
      label: "Primary Call To Action",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
    secondaryCta: {
      label: "Secondary Call To Action",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
    heroImage: YextEntityFieldSelector<
      any,
      ImageType | ComplexImageType | TranslatableAssetImage
    >({
      label: "Hero Image",
      filter: {
        types: ["type.image"],
      },
    }),
  };

const resolveText = (
  value: StyledTextProps,
  locale: string,
  streamDocument: Record<string, unknown>,
) => resolveComponentData(value.text, locale, streamDocument) || "";

const SweetgreenLocationHeroSectionComponent: PuckComponent<SweetgreenLocationHeroSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const heroImage = resolveComponentData(props.heroImage, locale, streamDocument);

    return (
      <section className="bg-[#d8e5d6] px-4 py-10 text-[#484d48] md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-4 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col justify-center">
            <p
              style={{
                fontSize: `${props.eyebrow.fontSize}px`,
                color: props.eyebrow.fontColor,
                fontWeight: props.eyebrow.fontWeight,
              }}
              className="mb-2 font-['SweetSans','Open_Sans',sans-serif] leading-7 tracking-[0.05em]"
            >
              {resolveText(props.eyebrow, locale, streamDocument)}
            </p>
            <h1
              style={{
                fontSize: `${props.title.fontSize}px`,
                color: props.title.fontColor,
                fontWeight: props.title.fontWeight,
              }}
              className="mb-4 font-['SweetSans','Open_Sans',sans-serif] leading-none tracking-[0.02em] text-black md:mb-6"
            >
              {resolveText(props.title, locale, streamDocument)}
            </h1>
            <p
              style={{
                fontSize: `${props.description.fontSize}px`,
                color: props.description.fontColor,
                fontWeight: props.description.fontWeight,
              }}
              className="mb-4 max-w-[460px] leading-6 md:mb-6"
            >
              {resolveText(props.description, locale, streamDocument)}
            </p>
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
              <Link
                cta={{ link: props.primaryCta.link, linkType: "URL" }}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#00473c] px-6 text-base font-semibold text-[#f4f3e7] md:h-16"
              >
                {props.primaryCta.label}
              </Link>
              <Link
                cta={{ link: props.secondaryCta.link, linkType: "URL" }}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#0e150e]/10 bg-[#f4f3e7] px-6 text-base font-semibold text-[#00473c] md:h-16"
              >
                {props.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div>
            {heroImage && (
              <div className="overflow-hidden rounded-2xl">
                <Image image={heroImage} className="h-[230px] w-full object-cover md:h-[324px]" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

export const SweetgreenLocationHeroSection: ComponentConfig<SweetgreenLocationHeroSectionProps> =
  {
    label: "Sweetgreen Location Hero Section",
    fields: SweetgreenLocationHeroSectionFields,
    defaultProps: {
      eyebrow: {
        text: {
          field: "",
          constantValue: { en: "Arlington, VA", hasLocalizedValue: "true" },
          constantValueEnabled: true,
        },
        fontSize: 24,
        fontColor: "#00473C",
        fontWeight: 400,
        textTransform: "normal",
      },
      title: {
        text: {
          field: "",
          constantValue: {
            en: "Sweetgreen – Rosslyn",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 48,
        fontColor: "#000000",
        fontWeight: 700,
        textTransform: "normal",
      },
      description: {
        text: {
          field: "",
          constantValue: {
            en: "Whether you're looking for a quick lunch on the go, a satisfying dinner, or a healthy meal option while shopping, Sweetgreen: Rosslyn offers a delicious array of choices that cater to various dietary preferences.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#484D48",
        fontWeight: 400,
        textTransform: "normal",
      },
      primaryCta: {
        label: "Order pickup",
        link: "https://order.sweetgreen.com/rosslyn/menu",
      },
      secondaryCta: {
        label: "Get directions",
        link: "https://www.google.com/maps/dir/?api=1&destination=38.896399,-77.071965",
      },
      heroImage: {
        field: "",
        constantValue: {
          url: "https://www.sweetgreen.com/static/img/pages/location/page-location-header-image.jpg",
        },
        constantValueEnabled: true,
      } as any,
    },
    render: SweetgreenLocationHeroSectionComponent,
  };
