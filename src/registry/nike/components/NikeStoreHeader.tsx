import * as React from "react";
import {
  ComponentConfig,
  FieldLabel,
  Fields,
  PuckComponent,
} from "@puckeditor/core";
import { getAnalyticsScopeHash, VisibilityWrapper } from "@yext/visual-editor";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";

type HeaderLink = {
  label: string;
  link: string;
};

export type NikeStoreHeaderProps = {
  greeting: string;
  links: HeaderLink[];
  section: {
    backgroundColor: string;
    visibleOnLivePage: boolean;
  };
  accountBar: {
    backgroundColor: string;
    brandMarkColor: string;
    avatarBackgroundColor: string;
  };
  nav: {
    logoColor: string;
    searchBackgroundColor: string;
    activeUnderlineColor: string;
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

const NikeStoreHeaderFields: Fields<NikeStoreHeaderProps> = {
  greeting: {
    label: "Greeting",
    type: "text",
  },
  links: {
    label: "Navigation Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      link: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Link",
      link: "#",
    },
    getItemSummary: (item) => item.label,
  },
  accountBar: {
    label: "Account Bar",
    type: "object",
    objectFields: {
      backgroundColor: colorField("Background Color", "#f5f5f5"),
      brandMarkColor: colorField("Brand Mark Color", "#111111"),
      avatarBackgroundColor: colorField("Avatar Background Color", "#cccccc"),
    },
  },
  nav: {
    label: "Navigation",
    type: "object",
    objectFields: {
      logoColor: colorField("Logo Color", "#111111"),
      searchBackgroundColor: colorField("Search Background Color", "#f5f5f5"),
      activeUnderlineColor: colorField("Active Underline Color", "#111111"),
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

const SearchIcon = () => (
  <svg className="nike-header-icon" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" />
    <path d="M13.5 13.5 17 17" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const HeartIcon = () => (
  <svg className="nike-header-icon" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M10 17s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 17 8c0 4.5-7 9-7 9z"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

const BagIcon = () => (
  <svg className="nike-header-icon" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M6 8V6a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" />
    <rect
      x="3"
      y="8"
      width="14"
      height="11"
      rx="1"
      fill="none"
      stroke="currentColor"
    />
  </svg>
);

export const NikeStoreHeaderComponent: PuckComponent<NikeStoreHeaderProps> = (
  props,
) => {
  const links = props.links ?? [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`NikeStoreHeader${getAnalyticsScopeHash(props.id)}`}
      >
        <header
          className="nike-store-header"
          style={{ backgroundColor: props.section.backgroundColor }}
        >
          <style>{`
            .nike-store-header {
              color: #111;
              font-family: "Helvetica Neue", Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .nike-account-bar {
              align-items: center;
              display: flex;
              font-size: 12px;
              font-weight: 500;
              height: 36px;
              justify-content: space-between;
              padding: 0 16px;
            }
            .nike-brand-group,
            .nike-user-group,
            .nike-nav-right {
              align-items: center;
              display: flex;
              gap: 8px;
            }
            .nike-brand-mark,
            .nike-avatar {
              display: block;
              height: 20px;
              width: 20px;
            }
            .nike-avatar {
            }
            .nike-main-nav {
              align-items: center;
              display: flex;
              gap: 16px;
              height: 64px;
              padding: 0 16px;
              position: sticky;
              top: 0;
              z-index: 100;
            }
            .nike-swoosh {
              clip-path: polygon(0 100%, 100% 0, 100% 40%, 10% 100%);
              display: block;
              height: 18px;
              width: 48px;
            }
            .nike-nav-links {
              align-items: center;
              display: flex;
              flex: 1;
              gap: 24px;
              justify-content: center;
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .nike-nav-link {
              border-bottom: 2px solid transparent;
              color: #111;
              display: inline-flex;
              font-size: 13px;
              font-weight: 500;
              padding: 0 0 4px;
              text-decoration: none;
            }
            .nike-nav-link-active {
              border-bottom-color: var(--nike-active-underline);
            }
            .nike-search {
              align-items: center;
              border-radius: 999px;
              display: flex;
              gap: 8px;
              padding: 6px 14px;
              width: 200px;
            }
            .nike-search input {
              background: transparent;
              border: 0;
              color: #777;
              font: inherit;
              min-width: 0;
              outline: 0;
              width: 100%;
            }
            .nike-search .nike-header-icon {
              height: 16px;
              width: 16px;
            }
            .nike-icon-button {
              align-items: center;
              background: transparent;
              border: 0;
              color: #111;
              display: inline-flex;
              height: 36px;
              justify-content: center;
              padding: 0;
              width: 36px;
            }
            .nike-header-icon {
              height: 20px;
              stroke-width: 1.5;
              width: 20px;
            }
            @media (max-width: 768px) {
              .nike-nav-links {
                display: none;
              }
              .nike-search {
                width: 140px;
              }
            }
          `}</style>
          <div
            className="nike-account-bar"
            style={{ backgroundColor: props.accountBar.backgroundColor }}
          >
            <div className="nike-brand-group" aria-label="Brands">
              <span
                className="nike-brand-mark"
                style={{ backgroundColor: props.accountBar.brandMarkColor }}
                aria-label="Jordan"
              />
              <span
                className="nike-brand-mark"
                style={{ backgroundColor: props.accountBar.brandMarkColor }}
                aria-label="Converse"
              />
            </div>
            <div className="nike-user-group">
              <span>{props.greeting}</span>
              <span
                className="nike-avatar"
                style={{
                  backgroundColor: props.accountBar.avatarBackgroundColor,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
          <nav
            className="nike-main-nav"
            aria-label="Main navigation"
            style={
              {
                "--nike-active-underline": props.nav.activeUnderlineColor,
                backgroundColor: props.section.backgroundColor,
              } as React.CSSProperties
            }
          >
            <Link cta={{ link: "/", linkType: "URL" }} eventName="home">
              <span
                className="nike-swoosh"
                style={{ backgroundColor: props.nav.logoColor }}
                aria-label="Nike home"
              />
            </Link>
            <ul className="nike-nav-links">
              {links.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <Link
                    className={`nike-nav-link ${
                      link.label === "Store" ? "nike-nav-link-active" : ""
                    }`}
                    cta={{ link: link.link, linkType: "URL" }}
                    eventName={`headerLink${index}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nike-nav-right">
              <div
                className="nike-search"
                role="search"
                style={{ backgroundColor: props.nav.searchBackgroundColor }}
              >
                <SearchIcon />
                <input aria-label="Search" placeholder="Search" type="search" />
              </div>
              <button
                className="nike-icon-button"
                type="button"
                aria-label="Favorites"
              >
                <HeartIcon />
              </button>
              <button
                className="nike-icon-button"
                type="button"
                aria-label="Shopping bag"
              >
                <BagIcon />
              </button>
            </div>
          </nav>
        </header>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NikeStoreHeader: ComponentConfig<NikeStoreHeaderProps> = {
  label: "Nike Store Header",
  fields: NikeStoreHeaderFields,
  defaultProps: {
    greeting: "Hi, Jamie",
    links: [
      { label: "New & Featured", link: "#" },
      { label: "Men", link: "#" },
      { label: "Store", link: "#" },
      { label: "Kids", link: "#" },
      { label: "Sale", link: "#" },
    ],
    section: {
      backgroundColor: "#ffffff",
      visibleOnLivePage: true,
    },
    accountBar: {
      backgroundColor: "#f5f5f5",
      brandMarkColor: "#111111",
      avatarBackgroundColor: "#cccccc",
    },
    nav: {
      logoColor: "#111111",
      searchBackgroundColor: "#f5f5f5",
      activeUnderlineColor: "#111111",
    },
  },
  render: NikeStoreHeaderComponent,
};
