// @ts-nocheck
import { useTranslation } from "react-i18next";
import * as React from "react";
import { AnalyticsScopeProvider, CTA as CTAType } from "@yext/pages-components";
import { WithId, WithPuckProps } from "@puckeditor/core";
import { Body } from "../atoms/body";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { CTA } from "../atoms/cta";
import {
  type ThemeColor,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { PageSection } from "../atoms/pageSection";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

type socialLink = {
  name: string;
  link: string;
  label: any;
  ariaLabel: string;
  prefix?: string;
};

export interface FooterProps {
  /**
   * The background color for the entire footer section.
   * @defaultValue Background Color 1
   */
  backgroundColor?: ThemeColor;

  /** @internal */
  analytics: {
    scope?: string;
  };
}

const footerFields: YextFields<FooterProps> = {
  backgroundColor: {
    type: "basicSelector",
    label: msg("fields.backgroundColor", "Background Color"),
    options: "BACKGROUND_COLOR",
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
 * The Footer appears at the bottom of the page. It serves as a container for secondary navigation, social media links, legal disclaimers, and copyright information. See [Expanded Footer](#expanded-footer) for the newest footer component.
 * Available on Directory and Locator templates.
 */
export const Footer: YextComponentConfig<FooterProps> = {
  label: msg("components.footer", "Footer"),
  fields: footerFields,
  defaultProps: {
    backgroundColor: backgroundColors.background1.value,
    analytics: {
      scope: "footer",
    },
  },
  inline: true,
  render: (props) => (
    <AnalyticsScopeProvider name={props.analytics?.scope ?? "footer"}>
      <FooterComponent {...props} />
    </AnalyticsScopeProvider>
  ),
};

const FooterComponent: React.FC<WithId<WithPuckProps<FooterProps>>> = (
  props
) => {
  const streamDocument = useDocument<any>();
  const { backgroundColor = backgroundColors.background1.value, puck } = props;

  const links = streamDocument?._site?.footer?.links ?? [];
  const copyrightMessage = streamDocument?._site?.copyrightMessage;

  const { t } = useTranslation();

  const socialLinks: socialLink[] = [
    {
      name: "facebook",
      link: streamDocument?._site?.facebookPageUrl,
      label: <FaFacebook className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.facebook", "Follow us on Facebook"),
    },
    {
      name: "instagram",
      prefix: "//www.instagram.com/",
      link: streamDocument?._site?.instagramHandle,
      label: <FaInstagram className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.instagram", "Follow us on Instagram"),
    },
    {
      name: "youtube",
      link: streamDocument?._site?.youTubeChannelUrl,
      label: <FaYoutube className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.youtube", "Subscribe to our YouTube channel"),
    },
    {
      name: "linkedIn",
      link: streamDocument?._site?.linkedInUrl,
      label: <FaLinkedinIn className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.linkedIn", "Follow us on LinkedIn"),
    },
    {
      name: "twitter",
      prefix: "//www.twitter.com/",
      link: streamDocument?._site?.twitterHandle,
      label: <FaTwitter className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.xLink", "Follow us on X (Twitter)"),
    },
    {
      name: "pinterest",
      link: streamDocument?._site?.pinterestUrl,
      label: <FaPinterest className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.pinterest", "Follow us on Pinterest"),
    },
    {
      name: "tiktok",
      link: streamDocument?._site?.tikTokUrl,
      label: <FaTiktok className="w-5 h-5 mr-4" />,
      ariaLabel: t("socialLinks.tiktok", "Follow us on TikTok"),
    },
  ].filter((link) => link.link);

  return (
    <PageSection
      background={backgroundColor}
      className="flex flex-col"
      outerClassName="mt-auto"
      as="footer"
      ref={puck.dragRef}
    >
      <div className="flex flex-col sm:flex-row justify-between w-full items-center text-body-fontSize font-body-fontFamily">
        {links && (
          <EntityField
            displayName={pt("fields.footerLinks", "Footer Links")}
            fieldId={"site.footer.links"}
          >
            <FooterLinks links={links} />
          </EntityField>
        )}
        {socialLinks && (
          <EntityField
            displayName={pt("fields.footerSocialIcons", "Footer Social Icons")}
            fieldId={"site.footer"}
          >
            <FooterSocialIcons socialLinks={socialLinks} />
          </EntityField>
        )}
      </div>
      {copyrightMessage && (
        <div className={`text-body-sm-fontSize text-center sm:text-left `}>
          <EntityField
            displayName={pt("fields.copyrightText", "Copyright Text")}
            fieldId="site.copyrightMessage"
          >
            <Body>{copyrightMessage}</Body>
          </EntityField>
        </div>
      )}
    </PageSection>
  );
};

const FooterLinks = (props: { links: CTAType[] }) => {
  return (
    <ul className="flex flex-col sm:flex-row items-center pb-4">
      {props.links
        .filter((item) => !!item?.link)
        .map((item, idx) => (
          <li key={item.link}>
            <CTA
              link={item.link}
              label={item.label}
              linkType={item.linkType}
              normalizeLink={false}
              eventName={`link${idx}`}
              variant="link"
              alwaysHideCaret={true}
              className="sm:pr-8"
            />
          </li>
        ))}
    </ul>
  );
};

const FooterSocialIcons = ({ socialLinks }: { socialLinks: socialLink[] }) => {
  return (
    <div className="flex flex-row items-center justify-center sm:justify-end pb-4">
      {socialLinks.map((socialLink: socialLink, idx: number) =>
        socialLink.link ? (
          <CTA
            key={idx}
            label={socialLink.label}
            link={`${socialLink.prefix ?? ""}${socialLink.link}`}
            normalizeLink={false}
            variant={"link"}
            eventName={`socialLink${idx}`}
            alwaysHideCaret={true}
            ariaLabel={socialLink.ariaLabel}
          />
        ) : null
      )}
    </div>
  );
};
