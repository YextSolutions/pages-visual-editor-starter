// @ts-nocheck
import { useTranslation } from "react-i18next";
import * as React from "react";
import {
  AnalyticsScopeProvider,
  CTA as CTAType,
  ComplexImageType,
  useAnalytics,
} from "@yext/pages-components";
import { CTA } from "../atoms/cta";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { MaybeLink } from "../atoms/maybeLink";
import { PageSection } from "../atoms/pageSection";
import { backgroundColors } from "@yext/visual-editor/section-library-support";
import { Background } from "../atoms/background";
import { Image } from "../atoms/image";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { FaTimes, FaBars } from "react-icons/fa";
import {
  LanguageDropdown,
  LanguageDropdownProps,
  parseDocumentForLanguageDropdown,
} from "./languageDropdown";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

const PLACEHOLDER_IMAGE: ComplexImageType = {
  image: {
    url: "https://placehold.co/50",
    height: 50,
    width: 50,
    alternateText: "Placeholder Logo",
  },
};

export interface HeaderProps {
  /**
   * The display width of the site logo in pixels.
   * @defaultValue 80
   */
  logoWidth?: number;

  /**
   * If 'true', displays the language selector dropdown in the header.
   * @defaultValue false
   */
  enableLanguageSelector: boolean;

  /** @internal */
  analytics: {
    scope?: string;
  };
}

const headerFields: YextFields<HeaderProps> = {
  logoWidth: {
    type: "number",
    label: msg("fields.logoWidth", "Logo Width"),
    min: 0,
  },
  enableLanguageSelector: {
    label: msg("fields.enableLanguageSelector", "Enable Language Selector"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  analytics: {
    type: "object",
    label: msg("fields.analytics", "Analytics"),
    visible: false,
    objectFields: {
      scope: {
        label: msg("fields.scope", "Scope"),
        type: "text",
      },
    },
  },
};

/**
 * The Header component appears at the top of pages. It serves as the primary navigation and branding element, containing the site logo and optionally a language selector. See [Expanded Header](#expanded-header) for the newest header component.
 * Available on Directory and Locator templates.
 */
export const Header: YextComponentConfig<HeaderProps> = {
  label: msg("components.header", "Header"),
  fields: headerFields,
  defaultProps: {
    logoWidth: 80,
    enableLanguageSelector: false,
    analytics: {
      scope: "header",
    },
  },
  render: (props) => (
    <AnalyticsScopeProvider name={props.analytics?.scope ?? "header"}>
      <HeaderComponent {...props} />
    </AnalyticsScopeProvider>
  ),
};

const HeaderComponent: React.FC<HeaderProps> = ({
  logoWidth,
  enableLanguageSelector,
}) => {
  const streamDocument: any = useDocument();
  const links = streamDocument._site?.header?.links ?? [];
  const logo = streamDocument._site?.logo ?? PLACEHOLDER_IMAGE;

  return (
    <HeaderLayout
      links={links}
      logo={logo}
      logoWidth={logoWidth}
      enableLanguageSelector={enableLanguageSelector}
      languageDropDownProps={parseDocumentForLanguageDropdown(streamDocument)}
    />
  );
};

interface HeaderLayoutProps {
  languageDropDownProps?: LanguageDropdownProps;
  enableLanguageSelector: boolean;
  links: CTAType[];
  logoLink?: string;
  logo?: ComplexImageType;
  logoWidth?: number;
}

const HeaderLayout = (props: HeaderLayoutProps) => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const analytics = useAnalytics();
  const {
    logo,
    logoWidth,
    logoLink,
    links,
    languageDropDownProps,
    enableLanguageSelector,
  } = props;
  const showLanguageSelector =
    languageDropDownProps &&
    enableLanguageSelector &&
    languageDropDownProps.locales?.length > 1;

  return (
    <PageSection
      as="header"
      verticalPadding="header"
      background={backgroundColors.background1.value}
    >
      <div className="flex justify-start md:justify-between items-center">
        {logo && (
          <EntityField
            displayName={pt("fields.businessLogo", "Business Logo")}
            fieldId={"site.businessLogo"}
          >
            <HeaderLogo logo={logo} logoLink={logoLink} logoWidth={logoWidth} />
          </EntityField>
        )}

        {(links?.length > 0 || showLanguageSelector) && (
          <>
            <EntityField
              displayName={pt("fields.headerLinks", "Header Links")}
              fieldId={"site.header.links"}
            >
              <HeaderLinks links={links} />
            </EntityField>
            <button
              className="flex md:hidden ml-auto my-auto"
              onClick={() => {
                analytics?.track({
                  action: menuOpen ? "COLLAPSE" : "EXPAND",
                  eventName: "toggleMobileMenu",
                });
                setMenuOpen(!menuOpen);
              }}
              data-ya-action={
                analytics?.getDebugEnabled() ? "EXPAND/COLLAPSE" : undefined
              }
              data-ya-eventname={
                analytics?.getDebugEnabled() ? `toggleMobileMenu` : undefined
              }
              aria-label={
                menuOpen
                  ? t("closeHeaderMenu", "Close header menu")
                  : t("openHeaderMenu", "Open header menu")
              }
            >
              {menuOpen ? (
                <FaTimes size={"1.5rem"} />
              ) : (
                <FaBars size={"1.5rem"} />
              )}
            </button>
          </>
        )}
        {showLanguageSelector && (
          <LanguageDropdown
            {...languageDropDownProps}
            className="hidden md:flex"
          />
        )}
      </div>
      {(links?.length > 0 || showLanguageSelector) && (
        <HeaderMobileMenu
          isOpen={menuOpen}
          links={links}
          languageDropdownProps={
            showLanguageSelector ? languageDropDownProps : undefined
          }
        />
      )}
    </PageSection>
  );
};

const HeaderLogo = (props: {
  logo: ComplexImageType;
  logoLink?: string;
  logoWidth?: number;
}) => {
  return (
    <MaybeLink href={props.logoLink}>
      <div className="flex mr-2" style={{ width: `${props.logoWidth}px` }}>
        <Image
          image={props.logo.image}
          aspectRatio={props.logo.image.width / props.logo.image.height}
        />
      </div>
    </MaybeLink>
  );
};

const HeaderLinks = (props: { links: CTAType[] }) => {
  return (
    <div className="hidden md:flex items-center">
      <ul className="flex gap-4 lg:gap-10">
        {props.links
          .filter((item) => !!item?.link)
          .map((item, idx) => (
            <li key={item.link + idx}>
              <CTA
                label={item.label}
                link={item.link}
                linkType={item.linkType}
                normalizeLink={false}
                variant="link"
                eventName={`link${idx}`}
                alwaysHideCaret={true}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

type HeaderMobileMenuProps = {
  isOpen?: boolean;
  links: CTAType[];
  languageDropdownProps?: LanguageDropdownProps;
};

const HeaderMobileMenu = (props: HeaderMobileMenuProps) => {
  const { isOpen, links, languageDropdownProps } = props;
  return (
    <div
      className={
        `${isOpen ? "visible" : "hidden"} bg-white text-black` +
        "components absolute left-0 right-0 h-screen z-50"
      }
    >
      <Background
        background={backgroundColors.background1.value}
        className="container"
      >
        {links.length > 0 && (
          <ul className="flex flex-col p-4 gap-4">
            {links.map((item: CTAType, idx) => (
              <li key={item.link}>
                <CTA
                  link={item.link}
                  label={item.label}
                  linkType={item.linkType}
                  normalizeLink={false}
                  variant="link"
                  eventName={`mobilelink${idx}`}
                />
              </li>
            ))}
          </ul>
        )}
        {languageDropdownProps && (
          <LanguageDropdown
            {...languageDropdownProps}
            className="p-4 gap-4 w-full"
          />
        )}
      </Background>
    </div>
  );
};
