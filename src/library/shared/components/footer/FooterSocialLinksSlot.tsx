// @ts-nocheck
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { msg } from "@yext/visual-editor/section-library-support";
import { CTA } from "../atoms/cta";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { ThemeColor } from "@yext/visual-editor/section-library-support";
import { getThemeColorCssValue } from "@yext/visual-editor/section-library-support";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { validPatterns } from "./ExpandedFooter";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface FooterSocialLinksSlotProps {
  data: {
    xLink: string;
    facebookLink: string;
    instagramLink: string;
    linkedInLink: string;
    pinterestLink: string;
    tiktokLink: string;
    youtubeLink: string;
  };
  styles?: {
    filledBackground?: boolean;
    mobileAlignment?: "left" | "center";
    iconColor?: ThemeColor;
  };
}

type socialLink = {
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  pattern: RegExp;
  label: string;
  ariaLabel: string;
};

export const FooterSocialLinksSlotFields: YextFields<FooterSocialLinksSlotProps> =
  {
    data: {
      type: "object",
      label: msg("fields.data", "Data"),
      objectFields: {
        xLink: {
          label: msg("fields.xLink", "X Link"),
          type: "text",
        },
        facebookLink: {
          label: msg("fields.facebookLink", "Facebook Link"),
          type: "text",
        },
        instagramLink: {
          label: msg("fields.instagramLink", "Instagram Link"),
          type: "text",
        },
        linkedInLink: {
          label: msg("fields.linkedInLink", "LinkedIn Link"),
          type: "text",
        },
        pinterestLink: {
          label: msg("fields.pinterestLink", "Pinterest Link"),
          type: "text",
        },
        tiktokLink: {
          label: msg("fields.tiktokLink", "TikTok Link"),
          type: "text",
        },
        youtubeLink: {
          label: msg("fields.youtubeLink", "YouTube Link"),
          type: "text",
        },
      },
    },
    styles: {
      type: "object",
      label: msg("fields.styles", "Styles"),
      objectFields: {
        iconColor: {
          type: "basicSelector",
          label: msg("fields.iconColor", "Icon Color"),
          options: "SITE_COLOR",
        },
      },
    },
  };

const FooterSocialLinksSlotInternal: PuckComponent<
  FooterSocialLinksSlotProps
> = (props) => {
  const { data, styles, puck } = props;
  const { t } = useTranslation();
  const background = useBackground();

  const links: socialLink[] = [
    {
      url: data.xLink,
      icon: FaXTwitter,
      pattern: validPatterns.xLink,
      label: "X (Twitter)",
      ariaLabel: t("socialLinks.xLink", "Follow us on X (Twitter)"),
    },
    {
      url: data.facebookLink,
      icon: FaFacebook,
      pattern: validPatterns.facebookLink,
      label: "Facebook",
      ariaLabel: t("socialLinks.facebook", "Follow us on Facebook"),
    },
    {
      url: data.instagramLink,
      icon: FaInstagram,
      pattern: validPatterns.instagramLink,
      label: "Instagram",
      ariaLabel: t("socialLinks.instagram", "Follow us on Instagram"),
    },
    {
      url: data.pinterestLink,
      icon: FaPinterest,
      pattern: validPatterns.pinterestLink,
      label: "Pinterest",
      ariaLabel: t("socialLinks.pinterest", "Follow us on Pinterest"),
    },
    {
      url: data.linkedInLink,
      icon: FaLinkedinIn,
      pattern: validPatterns.linkedInLink,
      label: "LinkedIn",
      ariaLabel: t("socialLinks.linkedIn", "Follow us on LinkedIn"),
    },
    {
      url: data.youtubeLink,
      icon: FaYoutube,
      pattern: validPatterns.youtubeLink,
      label: "YouTube",
      ariaLabel: t("socialLinks.youtube", "Subscribe to our YouTube channel"),
    },
    {
      url: data.tiktokLink,
      icon: FaTiktok,
      pattern: validPatterns.tiktokLink,
      label: "TikTok",
      ariaLabel: t("socialLinks.tiktok", "Follow us on TikTok"),
    },
  ];

  const validLinks = links.filter(
    (link) => link.url && link.pattern.test(link.url)
  );

  // Always show placeholder in editing mode, hide on live if empty
  if (validLinks.length === 0) {
    return puck.isEditing ? <div className="h-10 min-w-[100px]" /> : <></>;
  }

  return (
    <div
      className={`flex flex-wrap gap-6 items-center ${styles?.mobileAlignment === "left" ? "justify-start" : "justify-center"} md:justify-start`}
    >
      {validLinks.map((link, index) => {
        const Icon = link.icon;
        const filledIconColor = getThemeColorCssValue(
          styles?.iconColor?.selectedColor
        );
        const iconElement = styles?.filledBackground ? (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${background?.isDarkColor ? "bg-white text-palette-primary-dark" : "bg-palette-primary-dark text-white"}`}
            style={filledIconColor ? { color: filledIconColor } : undefined}
          >
            <Icon className="h-6 w-6" />
          </div>
        ) : (
          <Icon className="h-6 w-6 md:h-5 md:w-5" />
        );
        return (
          <CTA
            key={index}
            label={iconElement}
            link={link.url}
            linkType="URL"
            normalizeLink={false}
            variant="link"
            eventName={`socialLink.${link.label.toLowerCase()}`}
            ariaLabel={link.ariaLabel}
            alwaysHideCaret
            className="block break-words whitespace-normal"
            color={styles?.iconColor}
          />
        );
      })}
    </div>
  );
};

export const FooterSocialLinksSlot: YextComponentConfig<FooterSocialLinksSlotProps> =
  {
    label: msg("components.footerSocialLinksSlot", "Social Links"),
    fields: FooterSocialLinksSlotFields,
    defaultProps: {
      data: {
        xLink: "",
        facebookLink: "",
        instagramLink: "",
        linkedInLink: "",
        pinterestLink: "",
        tiktokLink: "",
        youtubeLink: "",
      },
    },
    render: (props) => <FooterSocialLinksSlotInternal {...props} />,
  };
