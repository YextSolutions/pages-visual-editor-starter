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
type CategoryCard = {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  link: string;
  ctaBackgroundColor: string;
};
type SocialPost = { handle: string };

export type NikeDirectTierProps = {
  store: {
    eyebrow: string;
    name: string;
    schedule: TextLine[];
    address: TextLine[];
    status: string;
    mediaAlt: string;
  };
  cta: { label: string; link: string; backgroundColor: string };
  whatsNewProducts: ProductCard[];
  shopCards: CategoryCard[];
  trendingProducts: ProductCard[];
  socialPosts: SocialPost[];
  media: {
    heroBackgroundColor: string;
    productBackgroundColor: string;
    shopCardBackgroundColor: string;
    shopCardOverlayColor: string;
    socialBackgroundColor: string;
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

const productArrayFields = {
  name: { label: "Name", type: "text" as const },
  meta: { label: "Meta", type: "text" as const },
  price: { label: "Price", type: "text" as const },
  link: { label: "Link", type: "text" as const },
};

const NikeDirectTierFields: Fields<NikeDirectTierProps> = {
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
        defaultItemProps: { line: "Mon–Sat: 10am – 9pm" },
        getItemSummary: (item) => item.line,
      },
      address: {
        label: "Address",
        type: "array",
        arrayFields: { line: { label: "Line", type: "text" } },
        defaultItemProps: { line: "Address line" },
        getItemSummary: (item) => item.line,
      },
      status: { label: "Status", type: "text" },
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
    arrayFields: productArrayFields,
    defaultItemProps: {
      name: "Nike Product Name",
      meta: "Category",
      price: "$120",
      link: "#",
    },
    getItemSummary: (item) => item.name,
  },
  shopCards: {
    label: "Shop Cards",
    type: "array",
    arrayFields: {
      eyebrow: { label: "Eyebrow", type: "text" },
      title: { label: "Title", type: "text" },
      ctaLabel: { label: "CTA Label", type: "text" },
      link: { label: "Link", type: "text" },
      ctaBackgroundColor: colorField("CTA Background Color", "#ffffff"),
    },
    defaultItemProps: {
      eyebrow: "Men's",
      title: "Shop Men's",
      ctaLabel: "Shop",
      link: "#",
      ctaBackgroundColor: "#ffffff",
    },
    getItemSummary: (item) => item.title,
  },
  trendingProducts: {
    label: "Trending Products",
    type: "array",
    arrayFields: productArrayFields,
    defaultItemProps: {
      name: "Nike Product",
      meta: "Men's Shoe",
      price: "$120",
      link: "#",
    },
    getItemSummary: (item) => item.name,
  },
  socialPosts: {
    label: "Social Posts",
    type: "array",
    arrayFields: { handle: { label: "Handle", type: "text" } },
    defaultItemProps: { handle: "@dorionpentard" },
    getItemSummary: (item) => item.handle,
  },
  media: {
    label: "Media",
    type: "object",
    objectFields: {
      heroBackgroundColor: colorField("Hero Background Color", "#f5f5f5"),
      productBackgroundColor: colorField("Product Background Color", "#5d626a"),
      shopCardBackgroundColor: colorField(
        "Shop Card Background Color",
        "#5d626a",
      ),
      shopCardOverlayColor: colorField("Shop Card Overlay Color", "#24272c"),
      socialBackgroundColor: colorField("Social Background Color", "#f5f5f5"),
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
  <div className="nike-direct-product-grid">
    {products.map((product, index) => (
      <article
        className="nike-direct-product-card"
        key={`${product.name}-${index}`}
      >
        <Link
          className="nike-direct-product-media"
          cta={{ link: product.link, linkType: "URL" }}
          eventName={`${eventPrefix}${index}`}
          style={{ backgroundColor }}
        >
          <span className="nike-direct-sr">{product.name}</span>
        </Link>
        <div className="nike-direct-product-copy">
          <strong>{product.name}</strong>
          <span>{product.meta}</span>
          <span>{product.price}</span>
        </div>
      </article>
    ))}
  </div>
);

export const NikeDirectTierComponent: PuckComponent<NikeDirectTierProps> = (
  props,
) => {
  const schedule = props.store.schedule ?? [];
  const address = props.store.address ?? [];
  const whatsNewProducts = props.whatsNewProducts ?? [];
  const shopCards = props.shopCards ?? [];
  const trendingProducts = props.trendingProducts ?? [];
  const socialPosts = props.socialPosts ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikeDirectTier${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          className="nike-direct-tier"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-direct-tier {
              border-top: 1px solid #f5f5f5;
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              margin-top: 32px;
              padding-top: 32px;
            }
            .nike-direct-content {
              margin: 0 auto;
              max-width: 1280px;
              padding: 0 16px;
            }
            .nike-direct-breadcrumb {
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              padding: 16px 0 12px;
              text-decoration: underline;
            }
            .nike-direct-eyebrow {
              color: #ff5000;
              font-size: 12px;
              font-weight: 500;
              margin: 0 0 4px;
            }
            .nike-direct-title {
              font-size: 24px;
              font-weight: 500;
              margin: 0 0 24px;
            }
            .nike-direct-info-row {
              align-items: flex-end;
              display: flex;
              flex-wrap: wrap;
              gap: 24px;
              justify-content: space-between;
              padding: 16px 0;
            }
            .nike-direct-info-text {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.6;
              min-width: 220px;
            }
            .nike-direct-info-text p {
              margin: 0 0 16px;
            }
            .nike-direct-cta {
              border-radius: 999px;
              color: #fff;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              margin: 8px 0 12px;
              padding: 8px 16px;
              text-decoration: none;
            }
            .nike-direct-hero {
              height: 212px;
              width: 320px;
            }
            .nike-direct-module {
              margin-top: 32px;
            }
            .nike-direct-section-header {
              align-items: center;
              display: flex;
              justify-content: space-between;
              margin-bottom: 18px;
            }
            .nike-direct-section-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .nike-direct-shop-all {
              color: #111;
              font-size: 12px;
              font-weight: 700;
              text-decoration: underline;
            }
            .nike-direct-product-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-direct-wide .nike-direct-product-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }
            .nike-direct-product-card {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .nike-direct-product-media {
              aspect-ratio: 1 / 1;
              display: block;
            }
            .nike-direct-product-copy {
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 1.35;
              white-space: pre-line;
            }
            .nike-direct-product-copy strong {
              font-weight: 500;
            }
            .nike-direct-shop-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .nike-direct-shop-card {
              align-items: flex-end;
              aspect-ratio: 1.05;
              color: #fff;
              display: flex;
              padding: 24px;
              position: relative;
            }
            .nike-direct-shop-card::after {
              background: linear-gradient(0deg, var(--nike-shop-overlay), transparent 45%);
              bottom: 0;
              content: "";
              left: 0;
              position: absolute;
              right: 0;
              top: 0;
            }
            .nike-direct-shop-copy {
              position: relative;
              z-index: 1;
            }
            .nike-direct-shop-copy p,
            .nike-direct-shop-copy h3 {
              margin: 0;
            }
            .nike-direct-shop-copy h3 {
              font-size: 18px;
              line-height: 1.2;
              margin-bottom: 12px;
            }
            .nike-direct-shop-cta {
              border-radius: 999px;
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 700;
              padding: 8px 18px;
              text-decoration: none;
            }
            .nike-direct-social-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(6, minmax(0, 1fr));
            }
            .nike-direct-social-media {
              aspect-ratio: 1;
            }
            .nike-direct-social-card span {
              color: #555;
              font-size: 11px;
            }
            .nike-direct-sr {
              clip: rect(0, 0, 0, 0);
              height: 1px;
              overflow: hidden;
              position: absolute;
              width: 1px;
            }
            @media (max-width: 767px) {
              .nike-direct-content {
                padding: 0 8px;
              }
              .nike-direct-title {
                font-size: 20px;
              }
              .nike-direct-info-row {
                align-items: flex-start;
                flex-direction: column;
              }
              .nike-direct-info-text {
              }
              .nike-direct-hero {
                height: 212px;
                width: 100%;
              }
              .nike-direct-product-grid,
              .nike-direct-wide .nike-direct-product-grid,
              .nike-direct-social-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .nike-direct-shop-grid {
                grid-template-columns: 1fr;
              }
              .nike-direct-shop-card {
                min-height: 360px;
              }
            }
          `}</style>
          <div className="nike-direct-content">
            <Link
              className="nike-direct-breadcrumb"
              cta={{ link: "#", linkType: "URL" }}
              eventName="breadcrumb"
            >
              &lt; Store Locator
            </Link>
            <p className="nike-direct-eyebrow">{props.store.eyebrow}</p>
            <h1 className="nike-direct-title">{props.store.name}</h1>
            <div className="nike-direct-info-row">
              <div className="nike-direct-info-text">
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
                  className="nike-direct-cta"
                  cta={{ link: props.cta.link, linkType: "URL" }}
                  eventName="getDirections"
                  style={{ backgroundColor: props.cta.backgroundColor }}
                >
                  {props.cta.label}
                </Link>
                <div>{props.store.status}</div>
              </div>
              <div
                aria-label={props.store.mediaAlt}
                className="nike-direct-hero"
                role="img"
                style={{ backgroundColor: props.media.heroBackgroundColor }}
              />
            </div>
            <div className="nike-direct-module nike-direct-wide">
              <div className="nike-direct-section-header">
                <h2 className="nike-direct-section-title">What's New</h2>
              </div>
              <ProductGrid
                products={whatsNewProducts}
                backgroundColor={props.media.productBackgroundColor}
                eventPrefix="whatsNewProduct"
              />
            </div>
            <div className="nike-direct-module">
              <div className="nike-direct-section-header">
                <h2 className="nike-direct-section-title">Shop Nike</h2>
                <Link
                  className="nike-direct-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="shopAll"
                >
                  Shop All
                </Link>
              </div>
              <div className="nike-direct-shop-grid">
                {shopCards.map((card, index) => (
                  <article
                    className="nike-direct-shop-card"
                    key={`${card.title}-${index}`}
                    style={
                      {
                        "--nike-shop-overlay": props.media.shopCardOverlayColor,
                        backgroundColor: props.media.shopCardBackgroundColor,
                      } as React.CSSProperties
                    }
                  >
                    <div className="nike-direct-shop-copy">
                      <p>{card.eyebrow}</p>
                      <h3>{card.title}</h3>
                      <Link
                        className="nike-direct-shop-cta"
                        cta={{ link: card.link, linkType: "URL" }}
                        eventName={`shopCard${index}`}
                        style={{ backgroundColor: card.ctaBackgroundColor }}
                      >
                        {card.ctaLabel}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="nike-direct-module">
              <div className="nike-direct-section-header">
                <h2 className="nike-direct-section-title">Trending Now</h2>
                <Link
                  className="nike-direct-shop-all"
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
            <div className="nike-direct-module">
              <div className="nike-direct-section-header">
                <h2 className="nike-direct-section-title">@NikeSantaMonica</h2>
                <Link
                  className="nike-direct-shop-all"
                  cta={{ link: "#", linkType: "URL" }}
                  eventName="socialSeeAll"
                >
                  See All
                </Link>
              </div>
              <div className="nike-direct-social-grid">
                {socialPosts.map((post, index) => (
                  <article
                    className="nike-direct-social-card"
                    key={`${post.handle}-${index}`}
                  >
                    <div
                      className="nike-direct-social-media"
                      style={{
                        backgroundColor: props.media.socialBackgroundColor,
                      }}
                    />
                    <span>{post.handle}</span>
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

export const NikeDirectTier: ComponentConfig<NikeDirectTierProps> = {
  label: "Nike Direct Tier",
  fields: NikeDirectTierFields,
  defaultProps: {
    store: {
      eyebrow: "Nike Direct",
      name: "Nike Santa Monica",
      schedule: [{ line: "Mon–Sat: 10am – 9pm" }, { line: "Sun: 11am – 7pm" }],
      address: [
        { line: "1231 3rd Street Promenade" },
        { line: "Santa Monica, CA 90401" },
      ],
      status: "Open • Closes at 9pm",
      mediaAlt: "Nike Santa Monica",
    },
    cta: { label: "Get Directions", link: "#", backgroundColor: "#111111" },
    whatsNewProducts: Array.from({ length: 4 }, () => ({
      name: "Nike Product Name",
      meta: "Category",
      price: "$120",
      link: "#",
    })),
    shopCards: [
      {
        eyebrow: "Men's",
        title: "Shop Men's",
        ctaLabel: "Shop",
        link: "#",
        ctaBackgroundColor: "#ffffff",
      },
      {
        eyebrow: "Women's",
        title: "Shop Women's",
        ctaLabel: "Shop Women's",
        link: "#",
        ctaBackgroundColor: "#ffffff",
      },
    ],
    trendingProducts: [
      {
        name: "Nike Air Max 270",
        meta: "Men's Shoe\n1 Colour",
        price: "$150",
        link: "#",
      },
      {
        name: "Nike React Infinity",
        meta: "Women's Road Running Shoes",
        price: "$160",
        link: "#",
      },
      {
        name: "Jordan 1 Retro High",
        meta: "Men's Shoe\n3 Colours",
        price: "From $180",
        link: "#",
      },
    ],
    socialPosts: Array.from({ length: 6 }, () => ({
      handle: "@dorionpentard",
    })),
    media: {
      heroBackgroundColor: "#f5f5f5",
      productBackgroundColor: "#5d626a",
      shopCardBackgroundColor: "#5d626a",
      shopCardOverlayColor: "#24272c",
      socialBackgroundColor: "#f5f5f5",
    },
    section: { backgroundColor: "#ffffff", visibleOnLivePage: true },
  },
  render: NikeDirectTierComponent,
};
