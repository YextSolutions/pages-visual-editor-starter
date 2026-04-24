import * as React from "react";
import {
  ComponentConfig,
  FieldLabel,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
import { getAnalyticsScopeHash, VisibilityWrapper } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type TextLine = { line: string };
type ProductCard = { name: string; meta: string; price: string; link: string };

export type NikeUniteTierProps = {
  store: {
    eyebrow: string;
    name: string;
    schedule: TextLine[];
    address: TextLine[];
    mediaAlt: string;
  };
  cta: { label: string; link: string; backgroundColor: string };
  whatsNewProducts: ProductCard[];
  trendingProducts: ProductCard[];
  media: { heroBackgroundColor: string; productBackgroundColor: string };
  section: { backgroundColor: string; visibleOnLivePage: boolean };
};

const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);

const colorField = (label: string, fallback: string) => ({
  label,
  type: "custom" as const,
  render: ({
    value,
    onChange,
    readOnly,
  }: {
    value: unknown;
    onChange: (value: string) => void;
    readOnly?: boolean;
  }) => (
    <FieldLabel label={label}>
      <input
        type="color"
        value={isHexColor(value) ? value : fallback}
        onChange={(event) => onChange(event.currentTarget.value)}
        disabled={readOnly}
      />
    </FieldLabel>
  ),
});

const productFields = {
  name: { label: "Name", type: "text" as const },
  meta: { label: "Meta", type: "text" as const },
  price: { label: "Price", type: "text" as const },
  link: { label: "Link", type: "text" as const },
};

const NikeUniteTierFields: Fields<NikeUniteTierProps> = {
  store: {
    label: "Store",
    type: "object",
    objectFields: {
      eyebrow: { label: "Eyebrow", type: "text" },
      name: { label: "Name", type: "text" },
      schedule: {
        label: "Schedule",
        type: "array",
        arrayFields: { line: { label: "Line", type: "text" } },
        defaultItemProps: { line: "Mon–Sat: 10am – 8pm" },
        getItemSummary: (item) => item.line,
      },
      address: {
        label: "Address",
        type: "array",
        arrayFields: { line: { label: "Line", type: "text" } },
        defaultItemProps: { line: "Address line" },
        getItemSummary: (item) => item.line,
      },
      mediaAlt: { label: "Media Alt", type: "text" },
    },
  },
  cta: {
    label: "Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
      backgroundColor: colorField("Background Color", "#111111"),
    },
  },
  whatsNewProducts: {
    label: "What's New Products",
    type: "array",
    arrayFields: productFields,
    defaultItemProps: {
      name: "Nike Product Name",
      meta: "Category",
      price: "$120",
      link: "#",
    },
    getItemSummary: (item) => item.name,
  },
  trendingProducts: {
    label: "Trending Products",
    type: "array",
    arrayFields: productFields,
    defaultItemProps: {
      name: "Nike Product",
      meta: "Men's Shoe",
      price: "$120",
      link: "#",
    },
    getItemSummary: (item) => item.name,
  },
  media: {
    label: "Media",
    type: "object",
    objectFields: {
      heroBackgroundColor: colorField("Hero Background Color", "#f5f5f5"),
      productBackgroundColor: colorField("Product Background Color", "#5d626a"),
    },
  },
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      backgroundColor: colorField("Background Color", "#ffffff"),
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
};

const ProductGrid = ({
  products,
  backgroundColor,
  eventPrefix,
}: {
  products: ProductCard[];
  backgroundColor: string;
  eventPrefix: string;
}) => (
  <div className="nike-unite-product-grid">
    {products.map((product, index) => (
      <article
        className="nike-unite-product-card"
        key={`${product.name}-${index}`}
      >
        <Link
          className="nike-unite-product-media"
          cta={{ link: product.link, linkType: "URL" }}
          eventName={`${eventPrefix}${index}`}
          style={{ backgroundColor }}
        >
          <span className="nike-unite-sr">{product.name}</span>
        </Link>
        <div className="nike-unite-product-copy">
          <strong>{product.name}</strong>
          <span>{product.meta}</span>
          <span>{product.price}</span>
        </div>
      </article>
    ))}
  </div>
);

export const NikeUniteTierComponent: PuckComponent<NikeUniteTierProps> = (
  props,
) => {
  const schedule = props.store.schedule ?? [];
  const address = props.store.address ?? [];
  const whatsNewProducts = props.whatsNewProducts ?? [];
  const trendingProducts = props.trendingProducts ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikeUniteTier${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          className="nike-unite-tier"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-unite-tier {
              border-top: 1px solid #f5f5f5;
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              margin-top: 32px;
              padding-top: 32px;
            }
            .nike-unite-content {
              margin: 0 auto;
              max-width: 1280px;
              padding: 0 16px;
            }
            .nike-unite-breadcrumb {
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              padding: 16px 0 12px;
              text-decoration: underline;
            }
            .nike-unite-eyebrow {
              color: #ff5000;
              font-size: 12px;
              font-weight: 500;
              margin: 0 0 4px;
            }
            .nike-unite-title {
              font-size: 24px;
              font-weight: 500;
              margin: 0 0 24px;
            }
            .nike-unite-info-row {
              align-items: flex-end;
              display: flex;
              flex-wrap: wrap;
              gap: 24px;
              justify-content: space-between;
              padding: 16px 0;
            }
            .nike-unite-info-text {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.6;
              min-width: 220px;
            }
            .nike-unite-info-text p {
              margin: 0 0 16px;
            }
            .nike-unite-cta {
              border-radius: 999px;
              color: #fff;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              margin-top: 8px;
              padding: 8px 16px;
              text-decoration: none;
            }
            .nike-unite-hero {
              height: 212px;
              width: 320px;
            }
            .nike-unite-module {
              margin-top: 32px;
            }
            .nike-unite-section-header {
              align-items: center;
              display: flex;
              justify-content: space-between;
              margin-bottom: 18px;
            }
            .nike-unite-section-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .nike-unite-shop-all {
              color: #111;
              font-size: 12px;
              font-weight: 700;
              text-decoration: underline;
            }
            .nike-unite-product-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-unite-wide .nike-unite-product-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            .nike-unite-product-card {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .nike-unite-product-media {
              aspect-ratio: 1 / 1;
              display: block;
            }
            .nike-unite-product-copy {
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 1.35;
            }
            .nike-unite-product-copy strong {
              font-weight: 500;
            }
            .nike-unite-sr {
              clip: rect(0, 0, 0, 0);
              height: 1px;
              overflow: hidden;
              position: absolute;
              width: 1px;
            }
            @media (max-width: 767px) {
              .nike-unite-content {
                padding: 0 8px;
              }
              .nike-unite-title {
                font-size: 20px;
              }
              .nike-unite-info-row {
                align-items: flex-start;
                flex-direction: column;
              }
              .nike-unite-info-text {
              }
              .nike-unite-hero {
                height: 212px;
                width: 100%;
              }
              .nike-unite-product-grid,
              .nike-unite-wide .nike-unite-product-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
          `}</style>
          <div className="nike-unite-content">
            <Link
              className="nike-unite-breadcrumb"
              cta={{ link: "#", linkType: "URL" }}
              eventName="breadcrumb"
            >
              &lt; Store Locator
            </Link>
            <p className="nike-unite-eyebrow">{props.store.eyebrow}</p>
            <h1 className="nike-unite-title">{props.store.name}</h1>
            <div className="nike-unite-info-row">
              <div className="nike-unite-info-text">
                <p>
                  {schedule.map((item) => (
                    <React.Fragment key={item.line}>
                      {item.line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <p>
                  {address.map((item) => (
                    <React.Fragment key={item.line}>
                      {item.line}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
                <Link
                  className="nike-unite-cta"
                  cta={{ link: props.cta.link, linkType: "URL" }}
                  eventName="getDirections"
                  style={{ backgroundColor: props.cta.backgroundColor }}
                >
                  {props.cta.label}
                </Link>
              </div>
              <div
                aria-label={props.store.mediaAlt}
                className="nike-unite-hero"
                role="img"
                style={{ backgroundColor: props.media.heroBackgroundColor }}
              />
            </div>
            <div className="nike-unite-module nike-unite-wide">
              <h2 className="nike-unite-section-title">What's New</h2>
              <div style={{ marginTop: 18 }}>
                <ProductGrid
                  products={whatsNewProducts}
                  backgroundColor={props.media.productBackgroundColor}
                  eventPrefix="whatsNewProduct"
                />
              </div>
            </div>
            <div className="nike-unite-module">
              <div className="nike-unite-section-header">
                <h2 className="nike-unite-section-title">Trending Now</h2>
                <Link
                  className="nike-unite-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="trendingShopAll"
                >
                  Shop All
                </Link>
              </div>
              <ProductGrid
                products={trendingProducts}
                backgroundColor={props.media.productBackgroundColor}
                eventPrefix="trendingProduct"
              />
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NikeUniteTier: ComponentConfig<NikeUniteTierProps> = {
  label: "Nike Unite Tier",
  fields: NikeUniteTierFields,
  defaultProps: {
    store: {
      eyebrow: "Nike Unite",
      name: "Nike Unite Salem",
      schedule: [{ line: "Mon–Sat: 10am – 8pm" }, { line: "Sun: 11am – 6pm" }],
      address: [{ line: "1250 Commercial St SE" }, { line: "Salem, OR 97302" }],
      mediaAlt: "Nike Unite Salem",
    },
    cta: { label: "Get Directions", link: "#", backgroundColor: "#111111" },
    whatsNewProducts: Array.from({ length: 4 }, () => ({
      name: "Nike Product Name",
      meta: "Category",
      price: "$120",
      link: "#",
    })),
    trendingProducts: [
      {
        name: "Nike Air Force 1",
        meta: "Men's Shoe",
        price: "$110",
        link: "#",
      },
      {
        name: "Nike Revolution 7",
        meta: "Running Shoe",
        price: "$70",
        link: "#",
      },
      {
        name: "Nike Flex Experience",
        meta: "Training Shoe",
        price: "$65",
        link: "#",
      },
    ],
    media: {
      heroBackgroundColor: "#f5f5f5",
      productBackgroundColor: "#5d626a",
    },
    section: { backgroundColor: "#ffffff", visibleOnLivePage: true },
  },
  render: NikeUniteTierComponent,
};
