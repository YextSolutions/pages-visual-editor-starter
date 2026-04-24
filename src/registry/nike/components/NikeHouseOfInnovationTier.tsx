import * as React from "react";
import {
  ComponentConfig,
  FieldLabel,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
import { getAnalyticsScopeHash, VisibilityWrapper } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type LinkCta = {
  label: string;
  link: string;
  backgroundColor: string;
};

type ProductCard = {
  name: string;
  meta: string;
  price: string;
  link: string;
};

type FeatureCard = {
  title: string;
  subtitle: string;
};

type CategoryCard = {
  eyebrow: string;
  title: string;
  ctaLabel: string;
  link: string;
  ctaBackgroundColor: string;
};

type SocialPost = {
  handle: string;
};

type TextLine = {
  line: string;
};

export type NikeHouseOfInnovationTierProps = {
  breadcrumb: {
    label: string;
    link: string;
  };
  store: {
    eyebrow: string;
    name: string;
    schedule: TextLine[];
    address: TextLine[];
    mediaAlt: string;
  };
  cta: LinkCta;
  whatsNewTitle: string;
  whatsNewProducts: ProductCard[];
  experienceCaption: string;
  floorTitle: string;
  floorCards: FeatureCard[];
  shopTitle: string;
  shopAllLabel: string;
  shopAllLink: string;
  shopCards: CategoryCard[];
  trendingTitle: string;
  trendingProducts: ProductCard[];
  socialTitle: string;
  socialAllLabel: string;
  socialAllLink: string;
  socialPosts: SocialPost[];
  media: {
    heroBackgroundColor: string;
    productBackgroundColor: string;
    shopCardBackgroundColor: string;
    shopCardOverlayColor: string;
    socialBackgroundColor: string;
  };
  section: {
    backgroundColor: string;
    visibleOnLivePage: boolean;
  };
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

const ctaFields = {
  label: { label: "Label", type: "text" as const },
  link: { label: "Link", type: "text" as const },
  backgroundColor: colorField("Background Color", "#111111"),
};

const productArrayFields = {
  name: { label: "Name", type: "text" as const },
  meta: { label: "Meta", type: "text" as const },
  price: { label: "Price", type: "text" as const },
  link: { label: "Link", type: "text" as const },
};

const NikeHouseOfInnovationTierFields: Fields<NikeHouseOfInnovationTierProps> =
  {
    breadcrumb: {
      label: "Breadcrumb",
      type: "object",
      objectFields: {
        label: { label: "Label", type: "text" },
        link: { label: "Link", type: "text" },
      },
    },
    store: {
      label: "Store",
      type: "object",
      objectFields: {
        eyebrow: { label: "Eyebrow", type: "text" },
        name: { label: "Name", type: "text" },
        schedule: {
          label: "Schedule",
          type: "array",
          arrayFields: {
            line: { label: "Line", type: "text" },
          },
          defaultItemProps: { line: "Mon–Fri: 10am – 8pm" },
          getItemSummary: (item) => item.line,
        },
        address: {
          label: "Address",
          type: "array",
          arrayFields: {
            line: { label: "Line", type: "text" },
          },
          defaultItemProps: { line: "Address line" },
          getItemSummary: (item) => item.line,
        },
        mediaAlt: { label: "Media Alt", type: "text" },
      },
    },
    cta: {
      label: "Call To Action",
      type: "object",
      objectFields: ctaFields,
    },
    whatsNewTitle: { label: "What's New Title", type: "text" },
    whatsNewProducts: {
      label: "What's New Products",
      type: "array",
      arrayFields: productArrayFields,
      defaultItemProps: {
        name: "Nike Product Name",
        meta: "Category / Colorway",
        price: "$120",
        link: "#",
      },
      getItemSummary: (item) => item.name,
    },
    experienceCaption: { label: "Experience Caption", type: "text" },
    floorTitle: { label: "Floor Title", type: "text" },
    floorCards: {
      label: "Floor Cards",
      type: "array",
      arrayFields: {
        title: { label: "Title", type: "text" },
        subtitle: { label: "Subtitle", type: "text" },
      },
      defaultItemProps: {
        title: "Floor",
        subtitle: "Category",
      },
      getItemSummary: (item) => item.title,
    },
    shopTitle: { label: "Shop Title", type: "text" },
    shopAllLabel: { label: "Shop All Label", type: "text" },
    shopAllLink: { label: "Shop All Link", type: "text" },
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
    trendingTitle: { label: "Trending Title", type: "text" },
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
    socialTitle: { label: "Social Title", type: "text" },
    socialAllLabel: { label: "Social All Label", type: "text" },
    socialAllLink: { label: "Social All Link", type: "text" },
    socialPosts: {
      label: "Social Posts",
      type: "array",
      arrayFields: {
        handle: { label: "Handle", type: "text" },
      },
      defaultItemProps: {
        handle: "@dorionpentard",
      },
      getItemSummary: (item) => item.handle,
    },
    media: {
      label: "Media",
      type: "object",
      objectFields: {
        heroBackgroundColor: colorField("Hero Background Color", "#f5f5f5"),
        productBackgroundColor: colorField(
          "Product Background Color",
          "#5d626a",
        ),
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

const BreadcrumbIcon = () => (
  <svg
    className="nike-tier-breadcrumb-icon"
    viewBox="0 0 14 14"
    aria-hidden="true"
  >
    <path
      d="M9 12 4 7l5-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

const ProductGrid = ({
  products,
  backgroundColor,
  eventPrefix,
}: {
  products: ProductCard[];
  backgroundColor: string;
  eventPrefix: string;
}) => (
  <div className="nike-tier-product-grid">
    {products.map((product, index) => (
      <article
        className="nike-tier-product-card"
        key={`${product.name}-${index}`}
      >
        <Link
          className="nike-tier-product-media"
          cta={{ link: product.link, linkType: "URL" }}
          eventName={`${eventPrefix}${index}`}
          style={{ backgroundColor }}
        >
          <span className="sr-only">{product.name}</span>
        </Link>
        <div className="nike-tier-product-copy">
          <strong>{product.name}</strong>
          <span>{product.meta}</span>
          <span>{product.price}</span>
        </div>
      </article>
    ))}
  </div>
);

export const NikeHouseOfInnovationTierComponent: PuckComponent<
  NikeHouseOfInnovationTierProps
> = (props) => {
  const schedule = props.store.schedule ?? [];
  const address = props.store.address ?? [];
  const whatsNewProducts = props.whatsNewProducts ?? [];
  const floorCards = props.floorCards ?? [];
  const shopCards = props.shopCards ?? [];
  const trendingProducts = props.trendingProducts ?? [];
  const socialPosts = props.socialPosts ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikeHouseOfInnovationTier${getAnalyticsScopeHash(props.id)}`}
      >
        <section
          className="nike-tier nike-tier-first"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-tier {
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              padding: 0;
            }
            .nike-tier:not(.nike-tier-first) {
              border-top: 1px solid #f5f5f5;
              margin-top: 32px;
              padding-top: 32px;
            }
            .nike-tier-content {
              margin: 0 auto;
              max-width: 1280px;
              padding: 0 16px;
            }
            .nike-tier-breadcrumb {
              align-items: center;
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              gap: 6px;
              padding: 16px 0 12px;
              text-decoration: underline;
            }
            .nike-tier-breadcrumb-icon {
              height: 14px;
              width: 14px;
            }
            .nike-tier-store-header {
              padding: 8px 0 16px;
            }
            .nike-tier-eyebrow {
              color: #ff5000;
              font-size: 12px;
              font-weight: 500;
              margin: 0 0 4px;
            }
            .nike-tier-title {
              font-size: 24px;
              font-weight: 500;
              line-height: 1.2;
              margin: 0 0 8px;
            }
            .nike-tier-info-row {
              align-items: flex-end;
              display: flex;
              flex-wrap: wrap;
              gap: 24px;
              justify-content: space-between;
              padding: 16px 0;
            }
            .nike-tier-info-text {
              font-size: 12px;
              font-weight: 500;
              line-height: 1.6;
              min-width: 220px;
            }
            .nike-tier-info-text p {
              margin: 0 0 16px;
            }
            .nike-tier-cta {
              align-items: center;
              border-radius: 999px;
              color: #fff;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              justify-content: center;
              line-height: 1;
              margin-top: 8px;
              padding: 8px 16px;
              text-decoration: none;
            }
            .nike-tier-hero-media {
              align-items: flex-start;
              display: flex;
              font-size: 12px;
              height: 212px;
              justify-content: flex-start;
              min-width: 280px;
              width: 320px;
            }
            .nike-tier-module {
              margin-top: 32px;
            }
            .nike-tier-section-header {
              align-items: center;
              display: flex;
              justify-content: space-between;
              margin-bottom: 18px;
            }
            .nike-tier-section-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0;
            }
            .nike-tier-shop-all {
              color: #111;
              font-size: 12px;
              font-weight: 700;
              text-decoration: underline;
            }
            .nike-tier-product-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-tier-product-card {
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin: 0;
            }
            .nike-tier-product-media {
              aspect-ratio: 1 / 1;
              display: block;
              overflow: hidden;
              text-decoration: none;
            }
            .nike-tier-product-copy {
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 1.35;
              padding: 0 2px;
            }
            .nike-tier-product-copy strong {
              font-weight: 500;
            }
            .nike-tier-wide-rail .nike-tier-product-grid {
              grid-template-columns: repeat(6, minmax(180px, 1fr));
              min-width: calc(6 * 180px + 5 * 8px);
            }
            .nike-tier-wide-rail {
              overflow-x: auto;
            }
            .nike-tier-experience {
              aspect-ratio: 16 / 9;
              margin-top: 24px;
            }
            .nike-tier-experience-caption {
              font-size: 12px;
              margin: 32px 0 0;
              text-align: center;
            }
            .nike-tier-floor-grid,
            .nike-tier-social-grid {
              display: grid;
              gap: 8px;
            }
            .nike-tier-floor-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            .nike-tier-floor-media {
              aspect-ratio: 3 / 4;
              margin-bottom: 8px;
            }
            .nike-tier-feature-title {
              font-size: 13px;
              font-weight: 500;
            }
            .nike-tier-shop-grid {
              display: grid;
              gap: 8px;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .nike-tier-shop-card {
              align-items: flex-end;
              aspect-ratio: 1.05;
              color: #fff;
              display: flex;
              padding: 24px;
              position: relative;
            }
            .nike-tier-shop-card::after {
              background: linear-gradient(0deg, var(--nike-shop-overlay), transparent 45%);
              bottom: 0;
              content: "";
              left: 0;
              position: absolute;
              right: 0;
              top: 0;
            }
            .nike-tier-shop-copy {
              position: relative;
              z-index: 1;
            }
            .nike-tier-shop-copy p,
            .nike-tier-shop-copy h3 {
              margin: 0;
            }
            .nike-tier-shop-copy h3 {
              font-size: 18px;
              font-weight: 700;
              line-height: 1.2;
              margin-bottom: 12px;
            }
            .nike-tier-shop-cta {
              border-radius: 999px;
              color: #111;
              display: inline-flex;
              font-size: 12px;
              font-weight: 700;
              padding: 8px 18px;
              text-decoration: none;
            }
            .nike-tier-social-grid {
              grid-template-columns: repeat(6, minmax(0, 1fr));
            }
            .nike-tier-social-card {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .nike-tier-social-media {
              aspect-ratio: 1;
            }
            .nike-tier-social-card span {
              color: #555;
              font-size: 11px;
            }
            .sr-only {
              clip: rect(0, 0, 0, 0);
              border: 0;
              height: 1px;
              margin: -1px;
              overflow: hidden;
              padding: 0;
              position: absolute;
              white-space: nowrap;
              width: 1px;
            }
            @media (max-width: 767px) {
              .nike-tier-content {
                padding: 0 8px;
              }
              .nike-tier-title {
                font-size: 20px;
              }
              .nike-tier-info-row {
                align-items: flex-start;
                flex-direction: column;
              }
              .nike-tier-info-text {
              }
              .nike-tier-hero-media,
              .nike-tier-experience {
                min-width: 0;
                width: 100%;
              }
              .nike-tier-hero-media {
                height: 212px;
              }
              .nike-tier-wide-rail .nike-tier-product-grid,
              .nike-tier-product-grid,
              .nike-tier-floor-grid,
              .nike-tier-social-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                min-width: 0;
              }
              .nike-tier-shop-grid {
                grid-template-columns: 1fr;
              }
              .nike-tier-shop-card {
                min-height: 360px;
              }
            }
          `}</style>
          <div className="nike-tier-content">
            <Link
              className="nike-tier-breadcrumb"
              cta={{ link: props.breadcrumb.link, linkType: "URL" }}
              eventName="breadcrumb"
            >
              <BreadcrumbIcon />
              {props.breadcrumb.label}
            </Link>
            <div className="nike-tier-store-header">
              <p className="nike-tier-eyebrow">{props.store.eyebrow}</p>
              <h1 className="nike-tier-title">{props.store.name}</h1>
            </div>
            <div className="nike-tier-info-row">
              <div className="nike-tier-info-text">
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
                  className="nike-tier-cta"
                  cta={{ link: props.cta.link, linkType: "URL" }}
                  eventName="getDirections"
                  style={{ backgroundColor: props.cta.backgroundColor }}
                >
                  {props.cta.label}
                </Link>
              </div>
              <div
                className="nike-tier-hero-media"
                role="img"
                aria-label={props.store.mediaAlt}
                style={{ backgroundColor: props.media.heroBackgroundColor }}
              />
            </div>
            <div className="nike-tier-module nike-tier-wide-rail">
              <div className="nike-tier-section-header">
                <h2 className="nike-tier-section-title">
                  {props.whatsNewTitle}
                </h2>
              </div>
              <ProductGrid
                products={whatsNewProducts}
                backgroundColor={props.media.productBackgroundColor}
                eventPrefix="whatsNewProduct"
              />
            </div>
            <div
              className="nike-tier-experience"
              role="img"
              aria-label="Store experience"
              style={{ backgroundColor: props.media.heroBackgroundColor }}
            />
            <p className="nike-tier-experience-caption">
              {props.experienceCaption}
            </p>
            <div className="nike-tier-module">
              <h2 className="nike-tier-section-title">{props.floorTitle}</h2>
              <div className="nike-tier-floor-grid" style={{ marginTop: 18 }}>
                {floorCards.map((card, index) => (
                  <article key={`${card.title}-${index}`}>
                    <div
                      className="nike-tier-floor-media"
                      style={{
                        backgroundColor: props.media.productBackgroundColor,
                      }}
                    />
                    <div className="nike-tier-feature-title">{card.title}</div>
                  </article>
                ))}
              </div>
            </div>
            <div className="nike-tier-module">
              <div className="nike-tier-section-header">
                <h2 className="nike-tier-section-title">{props.shopTitle}</h2>
                <Link
                  className="nike-tier-shop-all"
                  cta={{ link: props.shopAllLink, linkType: "URL" }}
                  eventName="shopAll"
                >
                  {props.shopAllLabel}
                </Link>
              </div>
              <div className="nike-tier-shop-grid">
                {shopCards.map((card, index) => (
                  <article
                    className="nike-tier-shop-card"
                    key={`${card.title}-${index}`}
                    style={
                      {
                        "--nike-shop-overlay": props.media.shopCardOverlayColor,
                        backgroundColor: props.media.shopCardBackgroundColor,
                      } as React.CSSProperties
                    }
                  >
                    <div className="nike-tier-shop-copy">
                      <p>{card.eyebrow}</p>
                      <h3>{card.title}</h3>
                      <Link
                        className="nike-tier-shop-cta"
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
            <div className="nike-tier-module">
              <div className="nike-tier-section-header">
                <h2 className="nike-tier-section-title">
                  {props.trendingTitle}
                </h2>
                <Link
                  className="nike-tier-shop-all"
                  cta={{ link: props.shopAllLink, linkType: "URL" }}
                  eventName="trendingShopAll"
                >
                  {props.shopAllLabel}
                </Link>
              </div>
              <ProductGrid
                products={trendingProducts}
                backgroundColor={props.media.productBackgroundColor}
                eventPrefix="trendingProduct"
              />
            </div>
            <div className="nike-tier-module">
              <div className="nike-tier-section-header">
                <h2 className="nike-tier-section-title">{props.socialTitle}</h2>
                <Link
                  className="nike-tier-shop-all"
                  cta={{ link: props.socialAllLink, linkType: "URL" }}
                  eventName="socialSeeAll"
                >
                  {props.socialAllLabel}
                </Link>
              </div>
              <div className="nike-tier-social-grid">
                {socialPosts.map((post, index) => (
                  <article
                    className="nike-tier-social-card"
                    key={`${post.handle}-${index}`}
                  >
                    <div
                      className="nike-tier-social-media"
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

export const NikeHouseOfInnovationTier: ComponentConfig<NikeHouseOfInnovationTierProps> =
  {
    label: "Nike House Of Innovation Tier",
    fields: NikeHouseOfInnovationTierFields,
    defaultProps: {
      breadcrumb: { label: "Store Locator", link: "#" },
      store: {
        eyebrow: "Nike House of Innovation",
        name: "House of Innovation Paris",
        schedule: [
          { line: "Mon–Fri: 10am – 8pm" },
          { line: "Sat: 10am – 9pm" },
          { line: "Sun: 11am – 7pm" },
        ],
        address: [{ line: "4 Rue de Rivoli" }, { line: "75001 Paris, France" }],
        mediaAlt: "House of Innovation Paris exterior",
      },
      cta: {
        label: "Get Directions",
        link: "#",
        backgroundColor: "#111111",
      },
      whatsNewTitle: "What's New",
      whatsNewProducts: Array.from({ length: 6 }, () => ({
        name: "Nike Product Name",
        meta: "Category / Colorway",
        price: "$120",
        link: "#",
      })),
      experienceCaption: "Experience the innovation floor - visit us in store.",
      floorTitle: "Explore the Store",
      floorCards: [
        { title: "Floor 1 - Running", subtitle: "" },
        { title: "Floor 2 - Training", subtitle: "" },
        { title: "Floor 3 - Jordan", subtitle: "" },
      ],
      shopTitle: "Shop Nike",
      shopAllLabel: "Shop All",
      shopAllLink: "#",
      shopCards: [
        {
          eyebrow: "Men's",
          title: "Best of Men's Running",
          ctaLabel: "Shop Men's Running",
          ctaBackgroundColor: "#ffffff",
          link: "#",
        },
        {
          eyebrow: "Women's",
          title: "New Arrivals",
          ctaLabel: "Shop",
          ctaBackgroundColor: "#ffffff",
          link: "#",
        },
      ],
      trendingTitle: "Trending Now",
      trendingProducts: [
        {
          name: "Nike Air Max 90",
          meta: "Men's Shoe\n1 Colour",
          price: "From $110",
          link: "#",
        },
        {
          name: "Nike Pegasus 41",
          meta: "Men's Road Running Shoes\n2 Colours",
          price: "$130",
          link: "#",
        },
        {
          name: "Nike Dunk Low",
          meta: "Men's Shoe\n1 Colour",
          price: "From $110",
          link: "#",
        },
      ],
      socialTitle: "@NikeParis",
      socialAllLabel: "See All",
      socialAllLink: "#",
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
      section: {
        backgroundColor: "#ffffff",
        visibleOnLivePage: true,
      },
    },
    render: NikeHouseOfInnovationTierComponent,
  };
