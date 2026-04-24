import * as React from "react";
import {
  ComponentConfig,
  FieldLabel,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
import { getAnalyticsScopeHash, VisibilityWrapper } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type ProductCard = { name: string; meta: string; price: string; link: string };
type FeatureCard = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  link?: string;
  ctaBackgroundColor?: string;
};

export type NikePilotTierProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; link: string; backgroundColor: string };
  launchCard: {
    headline: string;
    address: string;
    backgroundColor: string;
    markColor: string;
  };
  expectationCards: FeatureCard[];
  shopCards: FeatureCard[];
  trendingProducts: ProductCard[];
  media: {
    productBackgroundColor: string;
    shopCardBackgroundColor: string;
    shopCardOverlayColor: string;
  };
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

const featureFields = {
  title: { label: "Title", type: "text" as const },
  subtitle: { label: "Subtitle", type: "text" as const },
};

const NikePilotTierFields: Fields<NikePilotTierProps> = {
  eyebrow: { label: "Eyebrow", type: "text" },
  title: { label: "Title", type: "text" },
  description: { label: "Description", type: "textarea" },
  cta: {
    label: "Call To Action",
    type: "object",
    objectFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
      backgroundColor: colorField("Background Color", "#111111"),
    },
  },
  launchCard: {
    label: "Launch Card",
    type: "object",
    objectFields: {
      headline: { label: "Headline", type: "text" },
      address: { label: "Address", type: "text" },
      backgroundColor: colorField("Background Color", "#f53100"),
      markColor: colorField("Mark Color", "#111111"),
    },
  },
  expectationCards: {
    label: "Expectation Cards",
    type: "array",
    arrayFields: featureFields,
    defaultItemProps: {
      title: "Immersive Experiences",
      subtitle: "Try before you buy",
    },
    getItemSummary: (item) => item.title,
  },
  shopCards: {
    label: "Shop Cards",
    type: "array",
    arrayFields: {
      ...featureFields,
      ctaLabel: { label: "CTA Label", type: "text" },
      link: { label: "Link", type: "text" },
      ctaBackgroundColor: colorField("CTA Background Color", "#ffffff"),
    },
    defaultItemProps: {
      title: "Shop Men's",
      subtitle: "Men's",
      ctaLabel: "Shop",
      link: "#",
      ctaBackgroundColor: "#ffffff",
    },
    getItemSummary: (item) => item.title,
  },
  trendingProducts: {
    label: "Trending Products",
    type: "array",
    arrayFields: productFields,
    defaultItemProps: {
      name: "Nike Product",
      meta: "Shoe",
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
      shopCardBackgroundColor: colorField(
        "Shop Card Background Color",
        "#5d626a",
      ),
      shopCardOverlayColor: colorField("Shop Card Overlay Color", "#24272c"),
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
}: {
  products: ProductCard[];
  backgroundColor: string;
}) => (
  <div className="nike-pilot-product-grid">
    {products.map((product, index) => (
      <article
        className="nike-pilot-product-card"
        key={`${product.name}-${index}`}
      >
        <Link
          className="nike-pilot-product-media"
          cta={{ link: product.link, linkType: "URL" }}
          eventName={`trendingProduct${index}`}
          style={{ backgroundColor }}
        >
          <span className="nike-pilot-sr">{product.name}</span>
        </Link>
        <div className="nike-pilot-product-copy">
          <strong>{product.name}</strong>
          <span>{product.meta}</span>
          <span>{product.price}</span>
        </div>
      </article>
    ))}
  </div>
);

export const NikePilotTierComponent: PuckComponent<NikePilotTierProps> = (
  props,
) => {
  const expectationCards = props.expectationCards ?? [];
  const shopCards = props.shopCards ?? [];
  const trendingProducts = props.trendingProducts ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikePilotTier${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          className="nike-pilot-tier"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-pilot-tier {
              border-top: 1px solid #f5f5f5;
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              margin-top: 32px;
              padding-top: 32px;
            }
            .nike-pilot-content {
              margin: 0 auto;
              max-width: 1280px;
              padding: 0 16px;
            }
            .nike-pilot-breadcrumb {
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              padding: 16px 0 12px;
              text-decoration: underline;
            }
            .nike-pilot-intro {
              align-items: center;
              display: flex;
              gap: 48px;
              justify-content: space-between;
              min-height: 260px;
            }
            .nike-pilot-eyebrow {
              color: #ff5000;
              font-size: 12px;
              font-weight: 500;
              margin: 0 0 8px;
            }
            .nike-pilot-title {
              font-size: 24px;
              font-weight: 500;
              margin: 0 0 120px;
            }
            .nike-pilot-description {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.4;
              max-width: 420px;
              white-space: pre-line;
            }
            .nike-pilot-cta {
              border-radius: 999px;
              color: #fff;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              margin-top: 8px;
              padding: 8px 16px;
              text-decoration: none;
            }
            .nike-pilot-launch-card {
              color: #111;
              height: 180px;
              overflow: hidden;
              padding: 22px 32px;
              position: relative;
              width: 300px;
            }
            .nike-pilot-launch-card::after {
              background: var(--nike-launch-mark);
              bottom: 32px;
              content: "";
              height: 32px;
              position: absolute;
              right: 70px;
              transform: skewY(-32deg);
              width: 160px;
            }
            .nike-pilot-launch-card h2 {
              font-size: 32px;
              line-height: 1;
              margin: 0;
              position: relative;
              z-index: 1;
            }
            .nike-pilot-launch-card p {
              bottom: 18px;
              font-size: 11px;
              font-weight: 700;
              left: 32px;
              margin: 0;
              position: absolute;
              z-index: 1;
            }
            .nike-pilot-module {
              margin-top: 32px;
            }
            .nike-pilot-section-header {
              align-items: center;
              display: flex;
              justify-content: space-between;
              margin-bottom: 18px;
            }
            .nike-pilot-section-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .nike-pilot-shop-all {
              color: #111;
              font-size: 12px;
              font-weight: 700;
              text-decoration: underline;
            }
            .nike-pilot-feature-grid,
            .nike-pilot-product-grid,
            .nike-pilot-shop-grid {
              display: grid;
              gap: 8px;
            }
            .nike-pilot-feature-grid,
            .nike-pilot-product-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-pilot-feature-media {
              aspect-ratio: 3 / 4;
              display: block;
            }
            .nike-pilot-product-media {
              aspect-ratio: 1 / 1;
              display: block;
            }
            .nike-pilot-feature-copy,
            .nike-pilot-product-copy {
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 1.35;
            }
            .nike-pilot-feature-copy strong,
            .nike-pilot-product-copy strong {
              font-weight: 500;
            }
            .nike-pilot-shop-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .nike-pilot-shop-card {
              align-items: flex-end;
              aspect-ratio: 1.05;
              color: #fff;
              display: flex;
              padding: 24px;
              position: relative;
            }
            .nike-pilot-shop-card::after {
              background: linear-gradient(0deg, var(--nike-shop-overlay), transparent 45%);
              bottom: 0;
              content: "";
              left: 0;
              position: absolute;
              right: 0;
              top: 0;
            }
            .nike-pilot-shop-copy {
              position: relative;
              z-index: 1;
            }
            .nike-pilot-shop-copy p,
            .nike-pilot-shop-copy h3 {
              margin: 0;
            }
            .nike-pilot-shop-cta {
              border-radius: 999px;
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 700;
              margin-top: 12px;
              padding: 8px 18px;
              text-decoration: none;
            }
            .nike-pilot-sr {
              clip: rect(0, 0, 0, 0);
              height: 1px;
              overflow: hidden;
              position: absolute;
              width: 1px;
            }
            @media (max-width: 767px) {
              .nike-pilot-content {
                padding: 0 8px;
              }
              .nike-pilot-intro {
                align-items: flex-start;
                flex-direction: column;
                gap: 24px;
              }
              .nike-pilot-title {
                font-size: 20px;
                margin-bottom: 88px;
              }
              .nike-pilot-launch-card {
                box-sizing: border-box;
                width: 100%;
              }
              .nike-pilot-feature-grid,
              .nike-pilot-product-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .nike-pilot-shop-grid {
                grid-template-columns: 1fr;
              }
              .nike-pilot-shop-card {
                min-height: 360px;
              }
            }
          `}</style>
          <div className="nike-pilot-content">
            <Link
              className="nike-pilot-breadcrumb"
              cta={{ link: "#", linkType: "URL" }}
              eventName="breadcrumb"
            >
              &lt; Store Locator
            </Link>
            <div className="nike-pilot-intro">
              <div>
                <p className="nike-pilot-eyebrow">{props.eyebrow}</p>
                <h1 className="nike-pilot-title">{props.title}</h1>
                <p className="nike-pilot-description">{props.description}</p>
                <Link
                  className="nike-pilot-cta"
                  cta={{ link: props.cta.link, linkType: "URL" }}
                  eventName="notifyMe"
                  style={{ backgroundColor: props.cta.backgroundColor }}
                >
                  {props.cta.label}
                </Link>
              </div>
              <div
                className="nike-pilot-launch-card"
                style={
                  {
                    "--nike-launch-mark": props.launchCard.markColor,
                    backgroundColor: props.launchCard.backgroundColor,
                  } as React.CSSProperties
                }
              >
                <h2>{props.launchCard.headline}</h2>
                <p>{props.launchCard.address}</p>
              </div>
            </div>
            <div className="nike-pilot-module">
              <h2 className="nike-pilot-section-title">What to Expect</h2>
              <div
                className="nike-pilot-feature-grid"
                style={{ marginTop: 18 }}
              >
                {expectationCards.map((card, index) => (
                  <article key={`${card.title}-${index}`}>
                    <div
                      className="nike-pilot-feature-media"
                      style={{
                        backgroundColor: props.media.productBackgroundColor,
                      }}
                    />
                    <div className="nike-pilot-feature-copy">
                      <strong>{card.title}</strong>
                      <span>{card.subtitle}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="nike-pilot-module">
              <div className="nike-pilot-section-header">
                <h2 className="nike-pilot-section-title">Shop Nike</h2>
                <Link
                  className="nike-pilot-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="shopAll"
                >
                  Shop All
                </Link>
              </div>
              <div className="nike-pilot-shop-grid">
                {shopCards.map((card, index) => (
                  <article
                    className="nike-pilot-shop-card"
                    key={`${card.title}-${index}`}
                    style={
                      {
                        "--nike-shop-overlay": props.media.shopCardOverlayColor,
                        backgroundColor: props.media.shopCardBackgroundColor,
                      } as React.CSSProperties
                    }
                  >
                    <div className="nike-pilot-shop-copy">
                      <p>{card.subtitle}</p>
                      <h3>{card.title}</h3>
                      <Link
                        className="nike-pilot-shop-cta"
                        cta={{ link: card.link ?? "#", linkType: "URL" }}
                        eventName={`shopCard${index}`}
                        style={{
                          backgroundColor: card.ctaBackgroundColor ?? "#ffffff",
                        }}
                      >
                        {card.ctaLabel ?? "Shop"}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="nike-pilot-module">
              <div className="nike-pilot-section-header">
                <h2 className="nike-pilot-section-title">Trending Now</h2>
                <Link
                  className="nike-pilot-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="trendingShopAll"
                >
                  Shop All
                </Link>
              </div>
              <ProductGrid
                products={trendingProducts}
                backgroundColor={props.media.productBackgroundColor}
              />
            </div>
          </div>
        </section>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NikePilotTier: ComponentConfig<NikePilotTierProps> = {
  label: "Nike Pilot Tier",
  fields: NikePilotTierFields,
  defaultProps: {
    eyebrow: "Pilot",
    title: "The Grove — Coming Soon",
    description:
      "A new kind of Nike store. Personalized service,\ncurated local product, and community-first experiences.",
    cta: { label: "Notify Me", link: "#", backgroundColor: "#111111" },
    launchCard: {
      headline: "OPENS 11.1.26",
      address: "189 THE GROVE DRIVE - LOS ANGELES",
      backgroundColor: "#f53100",
      markColor: "#111111",
    },
    expectationCards: [
      { title: "Immersive Experiences", subtitle: "Try before you buy" },
      { title: "Local Curation", subtitle: "Products selected for LA" },
      { title: "Community Space", subtitle: "Events & workshops" },
    ],
    shopCards: [
      {
        title: "Shop Men's",
        subtitle: "Men's",
        ctaLabel: "Shop",
        link: "#",
        ctaBackgroundColor: "#ffffff",
      },
      {
        title: "Shop Women's",
        subtitle: "Women's",
        ctaLabel: "Shop Women's",
        link: "#",
        ctaBackgroundColor: "#ffffff",
      },
    ],
    trendingProducts: [
      { name: "Nike Vomero 18", meta: "Men's Shoe", price: "$160", link: "#" },
      {
        name: "Nike Free Metcon 6",
        meta: "Training Shoe",
        price: "$130",
        link: "#",
      },
      {
        name: "Nike SB Dunk Low Pro",
        meta: "Skateboarding",
        price: "$110",
        link: "#",
      },
    ],
    media: {
      productBackgroundColor: "#5d626a",
      shopCardBackgroundColor: "#5d626a",
      shopCardOverlayColor: "#24272c",
    },
    section: { backgroundColor: "#ffffff", visibleOnLivePage: true },
  },
  render: NikePilotTierComponent,
};
