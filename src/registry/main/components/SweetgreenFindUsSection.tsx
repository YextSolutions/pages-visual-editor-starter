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
import {
  Address,
  ComplexImageType,
  HoursStatus,
  HoursTable,
  ImageType,
  Link,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  fontSize: number;
  fontColor: string;
  fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textTransform: "normal" | "uppercase" | "lowercase" | "capitalize";
};

type DetailItem = {
  title: string;
  body: string;
  linkLabel?: string;
  link?: string;
};

export type SweetgreenFindUsSectionProps = {
  heading: StyledTextProps;
  description: StyledTextProps;
  detailImage: YextEntityField<
    ImageType | ComplexImageType | TranslatableAssetImage
  >;
  details: DetailItem[];
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

const SweetgreenFindUsSectionFields: Fields<SweetgreenFindUsSectionProps> = {
  heading: styledTextFields("Heading"),
  description: styledTextFields("Description"),
  detailImage: YextEntityFieldSelector<
    any,
    ImageType | ComplexImageType | TranslatableAssetImage
  >({
    label: "Detail Image",
    filter: {
      types: ["type.image"],
    },
  }),
  details: {
    label: "Details",
    type: "array",
    arrayFields: {
      title: { label: "Title", type: "text" },
      body: { label: "Body", type: "textarea" },
      linkLabel: { label: "Link Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      title: "Detail",
      body: "Body copy",
      linkLabel: "",
      link: "",
    },
    getItemSummary: (item: DetailItem) => item.title,
  },
};

const SweetgreenFindUsSectionComponent: PuckComponent<SweetgreenFindUsSectionProps> =
  (props) => {
    const streamDocument = useDocument();
    const locale = streamDocument.locale ?? "en";
    const detailImage = resolveComponentData(
      props.detailImage,
      locale,
      streamDocument,
    );
    const heading = resolveComponentData(props.heading.text, locale, streamDocument) || "";
    const description =
      resolveComponentData(props.description.text, locale, streamDocument) || "";

    return (
      <section className="bg-white px-4 py-10 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mx-auto mb-8 flex max-w-[670px] flex-col items-center gap-4 text-center md:mb-12">
            <h2
              style={{
                fontSize: `${props.heading.fontSize}px`,
                color: props.heading.fontColor,
                fontWeight: props.heading.fontWeight,
              }}
              className="font-['SweetSans','Open_Sans',sans-serif] leading-tight"
            >
              {heading}
            </h2>
            <p
              style={{
                fontSize: `${props.description.fontSize}px`,
                color: props.description.fontColor,
                fontWeight: props.description.fontWeight,
              }}
              className="leading-6"
            >
              {description}
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
            <div className="overflow-hidden rounded-2xl border border-[#0e150e]/10 bg-[#f4f3e7] p-6">
              <div className="mb-4 rounded-2xl bg-[linear-gradient(135deg,#d8e5d6,#f4f3e7)] p-8 text-left text-[#00473c]">
                <p className="mb-2 text-sm uppercase tracking-[0.14em]">Map</p>
                <p className="text-3xl font-semibold">Rosslyn</p>
                <p className="mt-3 text-base text-[#484d48]">
                  38.896399, -77.071965
                </p>
                <Link
                  cta={{
                    link: "https://www.google.com/maps/dir/?api=1&destination=38.896399,-77.071965",
                    linkType: "URL",
                  }}
                  className="mt-5 inline-flex rounded-full bg-[#00473c] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f4f3e7]"
                >
                  Open directions
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {detailImage && (
                <div className="overflow-hidden rounded-2xl">
                  <Image image={detailImage} className="h-[264px] w-full object-cover" />
                </div>
              )}
              <div className="grid gap-6">
                <div className="rounded-2xl border border-[#0e150e]/10 p-5">
                  <h3 className="mb-3 font-['SweetSans','Open_Sans',sans-serif] text-lg font-bold">
                    Location
                  </h3>
                  {streamDocument.address && (
                    <div className="mb-3 text-[#484d48]">
                      <Address address={streamDocument.address} />
                    </div>
                  )}
                  <Link
                    cta={{
                      link: "https://www.google.com/maps/dir/?api=1&destination=38.896399,-77.071965",
                      linkType: "URL",
                    }}
                    className="font-semibold text-[#00473c] underline underline-offset-4"
                  >
                    Get directions
                  </Link>
                </div>
                <div className="rounded-2xl border border-[#0e150e]/10 p-5">
                  <h3 className="mb-3 font-['SweetSans','Open_Sans',sans-serif] text-lg font-bold">
                    Store hours
                  </h3>
                  {streamDocument.hours && (
                    <div className="space-y-3 text-[#484d48]">
                      <HoursStatus
                        hours={streamDocument.hours}
                        timezone={streamDocument.timezone}
                      />
                      <HoursTable
                        hours={streamDocument.hours}
                        startOfWeek="today"
                        collapseDays={false}
                      />
                    </div>
                  )}
                </div>
                {props.details.map((detail) => (
                  <div
                    key={`${detail.title}-${detail.body}`}
                    className="rounded-2xl border border-[#0e150e]/10 p-5"
                  >
                    <h3 className="mb-3 font-['SweetSans','Open_Sans',sans-serif] text-lg font-bold">
                      {detail.title}
                    </h3>
                    <p className="whitespace-pre-line text-[#484d48]">{detail.body}</p>
                    {detail.link && detail.linkLabel && (
                      <Link
                        cta={{ link: detail.link, linkType: "URL" }}
                        className="mt-3 inline-flex font-semibold text-[#00473c] underline underline-offset-4"
                      >
                        {detail.linkLabel}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export const SweetgreenFindUsSection: ComponentConfig<SweetgreenFindUsSectionProps> =
  {
    label: "Sweetgreen Find Us Section",
    fields: SweetgreenFindUsSectionFields,
    defaultProps: {
      heading: {
        text: {
          field: "",
          constantValue: {
            en: "Find us: Hours & Address",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 40,
        fontColor: "#0E150E",
        fontWeight: 700,
        textTransform: "normal",
      },
      description: {
        text: {
          field: "",
          constantValue: {
            en: "Sweetgreen Rosslyn serves fresh salads and seasonal bowls in the heart of Arlington’s skyline. Located on N. Lynn Street near Central Place Plaza, we are steps from the metro and offers views of the Potomac; perfect for a city lunch with a view.",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        fontSize: 18,
        fontColor: "#6B6B6B",
        fontWeight: 400,
        textTransform: "normal",
      },
      detailImage: {
        field: "",
        constantValue: {
          url: "https://images.ctfassets.net/eum7w7yri3zr/1hw10ZxR4AxPvoeRJkTP48/30465889e805156a44957cc83bd27f8d/New_Rosslyn_Treehouse-5.jpg?w=1000&q=75",
          width: 1000,
        },
        constantValueEnabled: true,
      } as any,
      details: [
        { title: "Contact", body: "703-372-9009", linkLabel: "Call now", link: "tel:+17033729009" },
        { title: "Parking", body: "Parking Garage" },
        { title: "Catering?", body: "This location offers catering", linkLabel: "More info", link: "https://www.sweetgreen.com/catering" },
      ],
    },
    render: SweetgreenFindUsSectionComponent,
  };
