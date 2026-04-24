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

export type NikePartnerTierProps = {
  store: {
    eyebrow: string;
    name: string;
    schedule: TextLine[];
    address: TextLine[];
  };
  cta: { label: string; link: string; backgroundColor: string };
  trendingProducts: ProductCard[];
  media: { productBackgroundColor: string };
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

const NikePartnerTierFields: Fields<NikePartnerTierProps> = {
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
        defaultItemProps: { line: "Mon–Fri: 10am – 7pm" },
        getItemSummary: (item) => item.line,
      },
      address: {
        label: "Address",
        type: "array",
        arrayFields: { line: { label: "Line", type: "text" } },
        defaultItemProps: { line: "Partner location address" },
        getItemSummary: (item) => item.line,
      },
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

export const NikePartnerTierComponent: PuckComponent<NikePartnerTierProps> = (
  props,
) => {
  const schedule = props.store.schedule ?? [];
  const address = props.store.address ?? [];
  const trendingProducts = props.trendingProducts ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikePartnerTier${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          className="nike-partner-tier"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-partner-tier {
              border-top: 1px solid #f5f5f5;
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              margin-top: 32px;
              padding-top: 32px;
            }
            .nike-partner-content {
              margin: 0 auto;
              max-width: 1280px;
              padding: 0 16px;
            }
            .nike-partner-breadcrumb {
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              padding: 16px 0 12px;
              text-decoration: underline;
            }
            .nike-partner-eyebrow {
              color: #ff5000;
              font-size: 12px;
              font-weight: 500;
              margin: 0 0 4px;
            }
            .nike-partner-title {
              font-size: 24px;
              font-weight: 500;
              margin: 0 0 70px;
            }
            .nike-partner-info {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.6;
              max-width: 300px;
              padding: 16px 0;
            }
            .nike-partner-info p {
              margin: 0 0 16px;
            }
            .nike-partner-cta {
              border-radius: 999px;
              color: #fff;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              margin-top: 8px;
              padding: 8px 16px;
              text-decoration: none;
            }
            .nike-partner-module {
              margin-top: 32px;
            }
            .nike-partner-section-header {
              align-items: center;
              display: flex;
              justify-content: space-between;
              margin-bottom: 18px;
            }
            .nike-partner-section-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .nike-partner-shop-all {
              color: #111;
              font-size: 12px;
              font-weight: 700;
              text-decoration: underline;
            }
            .nike-partner-product-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-partner-product-card {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .nike-partner-product-media {
              aspect-ratio: 1 / 1;
              display: block;
            }
            .nike-partner-product-copy {
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 1.35;
            }
            .nike-partner-product-copy strong {
              font-weight: 500;
            }
            .nike-partner-sr {
              clip: rect(0, 0, 0, 0);
              height: 1px;
              overflow: hidden;
              position: absolute;
              width: 1px;
            }
            @media (max-width: 767px) {
              .nike-partner-content {
                padding: 0 8px;
              }
              .nike-partner-title {
                font-size: 20px;
                margin-bottom: 48px;
              }
              .nike-partner-info {
              }
              .nike-partner-product-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
          `}</style>
          <div className="nike-partner-content">
            <Link
              className="nike-partner-breadcrumb"
              cta={{ link: "#", linkType: "URL" }}
              eventName="breadcrumb"
            >
              &lt; Store Locator
            </Link>
            <p className="nike-partner-eyebrow">{props.store.eyebrow}</p>
            <h1 className="nike-partner-title">{props.store.name}</h1>
            <div className="nike-partner-info">
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
                className="nike-partner-cta"
                cta={{ link: props.cta.link, linkType: "URL" }}
                eventName="getDirections"
                style={{ backgroundColor: props.cta.backgroundColor }}
              >
                {props.cta.label}
              </Link>
            </div>
            <div className="nike-partner-module">
              <div className="nike-partner-section-header">
                <h2 className="nike-partner-section-title">Trending Now</h2>
                <Link
                  className="nike-partner-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="trendingShopAll"
                >
                  Shop All
                </Link>
              </div>
              <div className="nike-partner-product-grid">
                {trendingProducts.map((product, index) => (
                  <article
                    className="nike-partner-product-card"
                    key={`${product.name}-${index}`}
                  >
                    <Link
                      className="nike-partner-product-media"
                      cta={{ link: product.link, linkType: "URL" }}
                      eventName={`trendingProduct${index}`}
                      style={{
                        backgroundColor: props.media.productBackgroundColor,
                      }}
                    >
                      <span className="nike-partner-sr">{product.name}</span>
                    </Link>
                    <div className="nike-partner-product-copy">
                      <strong>{product.name}</strong>
                      <span>{product.meta}</span>
                      <span>{product.price}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NikePartnerTier: ComponentConfig<NikePartnerTierProps> = {
  label: "Nike Partner Tier",
  fields: NikePartnerTierFields,
  defaultProps: {
    store: {
      eyebrow: "Nike Unite",
      name: "Nike Unite - Partner Store",
      schedule: [
        { line: "Mon–Fri: 10am – 7pm" },
        { line: "Sat–Sun: 10am – 6pm" },
      ],
      address: [{ line: "Partner location address" }],
    },
    cta: { label: "Get Directions", link: "#", backgroundColor: "#111111" },
    trendingProducts: [
      { name: "Nike Air Max 90", meta: "Men's Shoe", price: "$130", link: "#" },
      {
        name: "Nike Blazer Mid",
        meta: "Lifestyle Shoe",
        price: "$100",
        link: "#",
      },
      {
        name: "Nike Court Vision",
        meta: "Lifestyle Shoe",
        price: "$85",
        link: "#",
      },
    ],
    media: { productBackgroundColor: "#5d626a" },
    section: { backgroundColor: "#ffffff", visibleOnLivePage: true },
  },
  render: NikePartnerTierComponent,
};
