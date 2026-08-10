import { parsePhoneNumber } from "awesome-phonenumber";
import type { SectionConfig } from "@yext/visual-editor";
import * as React from "react";
import { type ReactNode } from "react";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  ComprehensiveCTA,
  EntityField,
  Image,
  MaybeRTF,
  getAnalyticsScopeHash,
  getDefaultRTF,
  resolveComponentData,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  toPuckFields,
} from "@yext/visual-editor";
import { FaFacebookF, FaInstagram, FaPhone, FaYelp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type FooterImageProps = {
  image: YextEntityField<TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type CTAItem = {
  cta: ComprehensiveCTAValue;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
  label?: string;
};

type PhoneFieldProps = {
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type EmailFieldProps = {
  list: YextEntityField<string[]>;
};

type YextBarSocialDiningFooterSectionProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  logoImage: FooterImageProps;
  followUsHeading: StyledTextProps;
  socialLinks: CTAItem[];
  contactHeading: StyledTextProps;
  contactBody: StyledRtfProps;
  phones: PhoneFieldProps;
  emails: EmailFieldProps;
  resourcesHeading: StyledTextProps;
  resourceLinks: CTAItem[];
  copyrightText: StyledRtfProps;
};

const themeColorToCss = (selectedColor?: string): string | undefined => {
  if (!selectedColor) {
    return undefined;
  }

  if (selectedColor.startsWith("[") && selectedColor.endsWith("]")) {
    return selectedColor.slice(1, -1);
  }

  const paletteMap: Record<string, string> = {
    white: "#ffffff",
    "palette-primary": "var(--colors-palette-primary)",
    "palette-secondary": "var(--colors-palette-secondary)",
    "palette-tertiary": "var(--colors-palette-tertiary)",
    "palette-quaternary": "var(--colors-palette-quaternary)",
    "palette-primary-contrast": "var(--colors-palette-primary-contrast)",
    "palette-secondary-contrast": "var(--colors-palette-secondary-contrast)",
    "palette-tertiary-contrast": "var(--colors-palette-tertiary-contrast)",
    "palette-quaternary-contrast": "var(--colors-palette-quaternary-contrast)",
    "palette-primary-light": "hsl(from var(--colors-palette-primary) h s 98)",
    "palette-secondary-light":
      "hsl(from var(--colors-palette-secondary) h s 98)",
    "palette-tertiary-light": "hsl(from var(--colors-palette-tertiary) h s 98)",
    "palette-quaternary-light":
      "hsl(from var(--colors-palette-quaternary) h s 98)",
    "palette-primary-dark": "hsl(from var(--colors-palette-primary) h s 20)",
    "palette-secondary-dark":
      "hsl(from var(--colors-palette-secondary) h s 20)",
  };

  return paletteMap[selectedColor] ?? selectedColor;
};

const hasExplicitThemeColor = (color?: ThemeColor): color is ThemeColor => {
  return Boolean(color?.selectedColor && color.selectedColor !== "default");
};

const getReadableForegroundColor = (surfaceColor: ThemeColor): ThemeColor => {
  switch (surfaceColor.selectedColor) {
    case "white":
    case "palette-primary-light":
    case "palette-secondary-light":
    case "palette-tertiary-light":
    case "palette-quaternary-light":
      return {
        selectedColor: "black",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "black":
    case "palette-primary-dark":
    case "palette-secondary-dark":
      return {
        selectedColor: "white",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-primary":
      return {
        selectedColor: "palette-primary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-secondary":
      return {
        selectedColor: "palette-secondary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-tertiary":
      return {
        selectedColor: "palette-tertiary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    case "palette-quaternary":
      return {
        selectedColor: "palette-quaternary-contrast",
        contrastingColor: surfaceColor.selectedColor,
      };
    default:
      return {
        selectedColor: surfaceColor.contrastingColor || "black",
        contrastingColor: surfaceColor.selectedColor,
      };
  }
};

const resolveTextColor = (
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): string | undefined => {
  return themeColorToCss(
    (hasExplicitThemeColor(fontColor)
      ? fontColor
      : getReadableForegroundColor(surfaceColor)
    ).selectedColor,
  );
};

const resolveRichTextValue = (
  value: unknown,
): RichText | string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null && "html" in value) {
    return value as RichText;
  }

  return undefined;
};

const renderRichText = (value: unknown): ReactNode => {
  if (React.isValidElement(value)) {
    return value;
  }

  return <MaybeRTF data={resolveRichTextValue(value)} />;
};

const textStyle = (
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
): React.CSSProperties => ({
  color: resolveTextColor(fontColor, surfaceColor),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

const getCtaLabel = (value: unknown): string => {
  const ctaValue = value as Partial<ComprehensiveCTAValue>;

  if (
    typeof ctaValue.data?.cta?.constantValue?.label === "object" &&
    ctaValue.data?.cta?.constantValue?.label !== null &&
    "defaultValue" in ctaValue.data.cta.constantValue.label
  ) {
    return ctaValue.data.cta.constantValue.label.defaultValue ?? "Link";
  }

  if (typeof ctaValue.data?.cta?.constantValue?.label === "string") {
    return ctaValue.data.cta.constantValue.label;
  }

  if (
    typeof ctaValue.data?.buttonText === "object" &&
    ctaValue.data?.buttonText !== null &&
    "defaultValue" in ctaValue.data.buttonText
  ) {
    return ctaValue.data.buttonText.defaultValue ?? "Button";
  }

  if (typeof ctaValue.data?.buttonText === "string") {
    return ctaValue.data.buttonText;
  }

  return "Link";
};

const renderSocialIcon = (index: number): ReactNode => {
  if (index === 0) {
    return <FaFacebookF />;
  }

  if (index === 1) {
    return <FaInstagram />;
  }

  return <FaYelp />;
};

const footerScopeClass = "bar-social-dining-footer";
const footerScopedTypographyCss = `
  .${footerScopeClass} p {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${footerScopeClass} li {
    font-family: var(--fontFamily-body-fontFamily);
    font-size: var(--fontSize-body-fontSize);
    line-height: 1.5;
    font-weight: var(--fontWeight-body-fontWeight);
    font-style: var(--fontStyle-body-fontStyle);
    text-transform: var(--textTransform-body-textTransform);
  }

  .${footerScopeClass} h1 {
    font-family: var(--fontFamily-h1-fontFamily);
    font-size: var(--fontSize-h1-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h1-fontWeight);
    font-style: var(--fontStyle-h1-fontStyle);
    text-transform: var(--textTransform-h1-textTransform);
  }

  .${footerScopeClass} h2 {
    font-family: var(--fontFamily-h2-fontFamily);
    font-size: var(--fontSize-h2-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h2-fontWeight);
    font-style: var(--fontStyle-h2-fontStyle);
    text-transform: var(--textTransform-h2-textTransform);
  }

  .${footerScopeClass} h3 {
    font-family: var(--fontFamily-h3-fontFamily);
    font-size: var(--fontSize-h3-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h3-fontWeight);
    font-style: var(--fontStyle-h3-fontStyle);
    text-transform: var(--textTransform-h3-textTransform);
  }

  .${footerScopeClass} h4 {
    font-family: var(--fontFamily-h4-fontFamily);
    font-size: var(--fontSize-h4-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h4-fontWeight);
    font-style: var(--fontStyle-h4-fontStyle);
    text-transform: var(--textTransform-h4-textTransform);
  }

  .${footerScopeClass} h5 {
    font-family: var(--fontFamily-h5-fontFamily);
    font-size: var(--fontSize-h5-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h5-fontWeight);
    font-style: var(--fontStyle-h5-fontStyle);
    text-transform: var(--textTransform-h5-textTransform);
  }

  .${footerScopeClass} h6 {
    font-family: var(--fontFamily-h6-fontFamily);
    font-size: var(--fontSize-h6-fontSize);
    line-height: 1.2;
    font-weight: var(--fontWeight-h6-fontWeight);
    font-style: var(--fontStyle-h6-fontStyle);
    text-transform: var(--textTransform-h6-textTransform);
  }

  .${footerScopeClass} .bar-social-dining-link-typography a {
    font-family: var(--fontFamily-link-fontFamily);
    font-size: var(--fontSize-link-fontSize);
    font-weight: var(--fontWeight-link-fontWeight);
    font-style: var(--fontStyle-link-fontStyle);
    line-height: 1.5;
    text-decoration: underline;
    text-transform: var(--textTransform-link-textTransform);
    letter-spacing: var(--letterSpacing-link-letterSpacing);
  }
`;

const formatPhoneNumber = (
  phoneNumberString: string,
  format: "international" | "domestic",
): string => {
  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumberString.replace(/[^\d+]/g, ""),
  );
  if (!parsedPhoneNumber.valid || !parsedPhoneNumber.number) {
    return phoneNumberString;
  }

  return format === "international"
    ? parsedPhoneNumber.number.international
    : parsedPhoneNumber.number.national;
};

const createTextLinkCta = (
  label: string,
  link: string,
  color: ThemeColor,
): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        ctaType: "textAndLink",
        label: {
          defaultValue: label,
          hasLocalizedValue: "true",
        },
        link: {
          defaultValue: link,
          hasLocalizedValue: "true",
        },
        linkType: "URL",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
    buttonText: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: {
      defaultValue: label,
      hasLocalizedValue: "true",
    },
  },
  styles: {
    variant: "link",
    color,
    button: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      borderRadius: "default",
    },
    link: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
      letterSpacing: "default",
      includeCaret: "default",
    },
  },
});

const footerLinkColor: ThemeColor = {
  selectedColor: "[#FFFFFF]",
  contrastingColor: "[#171219]",
};

const YextBarSocialDiningFooterSectionFields: YextFields<YextBarSocialDiningFooterSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
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
    logoImage: {
      label: "Logo Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "basicSelector",
          options: "ASPECT_RATIO",
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    followUsHeading: {
      label: "Follow Us Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    socialLinks: {
      label: "Social Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: createTextLinkCta("Social", "#", footerLinkColor),
      },
      getItemSummary: (item) => getCtaLabel(item.cta),
    },
    contactHeading: {
      label: "Contact Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    contactBody: {
      label: "Contact Body",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    phones: {
      label: "Phones",
      type: "object",
      objectFields: {
        items: {
          label: "Items",
          type: "array",
          arrayFields: {
            number: {
              type: "entityField",
              label: "Number",
              filter: {
                types: ["type.phone"],
              },
            },
            label: {
              label: "Label",
              type: "text",
            },
          },
          defaultItemProps: {
            number: {
              field: "",
              constantValue: "",
              constantValueEnabled: true,
            },
            label: "",
          },
          getItemSummary: (item) => item.label || item.number?.field || "Phone",
        },
        phoneFormat: {
          label: "Phone Format",
          type: "radio",
          options: [
            { label: "Domestic", value: "domestic" },
            { label: "International", value: "international" },
          ],
        },
        includeHyperlink: {
          label: "Include Hyperlink",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
    },
    emails: {
      label: "Emails",
      type: "object",
      objectFields: {
        list: {
          type: "entityField",
          label: "Emails",
          filter: {
            types: ["type.string"],
            includeListsOnly: true,
            allowList: ["emails"],
          },
          disallowTranslation: true,
        },
      },
    },
    resourcesHeading: {
      label: "Resources Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    resourceLinks: {
      label: "Resource Links",
      type: "array",
      arrayFields: {
        cta: {
          label: "Link",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: createTextLinkCta("Link", "#", footerLinkColor),
      },
      getItemSummary: (item) => getCtaLabel(item.cta),
    },
    copyrightText: {
      label: "Copyright Text",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
  };

const YextBarSocialDiningFooterSectionComponent: PuckComponent<
  YextBarSocialDiningFooterSectionProps
> = ({ id, ...props }) => {
  const streamDocument = useDocument<{ locale?: string }>();
  const locale = streamDocument.locale ?? "en";
  const sectionForeground = resolveTextColor(
    undefined,
    props.section.backgroundColor,
  );
  const resolvedLogoImage = resolveComponentData(
    props.logoImage.image,
    locale,
    streamDocument,
  );
  const resolvedLogoImageUrl =
    typeof resolvedLogoImage === "object" &&
    resolvedLogoImage !== null &&
    "url" in resolvedLogoImage &&
    typeof resolvedLogoImage.url === "string"
      ? resolvedLogoImage.url.trim()
      : typeof resolvedLogoImage === "object" &&
          resolvedLogoImage !== null &&
          "image" in resolvedLogoImage &&
          resolvedLogoImage.image &&
          typeof resolvedLogoImage.image === "object" &&
          "url" in resolvedLogoImage.image &&
          typeof resolvedLogoImage.image.url === "string"
        ? resolvedLogoImage.image.url.trim()
        : "";
  const hasLogoImage = Boolean(resolvedLogoImageUrl);
  const logoImage = hasLogoImage
    ? (resolvedLogoImage as TranslatableAssetImage)
    : undefined;
  const resolvedFollowUsHeading = resolveComponentData(
    props.followUsHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedContactHeading = resolveComponentData(
    props.contactHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedContactBody = resolveComponentData(
    props.contactBody.text,
    locale,
    streamDocument,
  );
  const resolvedResourcesHeading = resolveComponentData(
    props.resourcesHeading.text,
    locale,
    streamDocument,
    { output: "plainText" },
  );
  const resolvedCopyrightText = resolveComponentData(
    props.copyrightText.text,
    locale,
    streamDocument,
  );
  const resolvedPhoneItems = (props.phones.items ?? []).flatMap((item) => {
    const resolvedNumber = resolveComponentData(
      item.number,
      locale,
      streamDocument,
    );
    const normalizedNumber =
      typeof resolvedNumber === "string" ? resolvedNumber.trim() : "";

    if (!normalizedNumber) {
      return [];
    }

    return [
      {
        label: item.label?.trim() ?? "",
        formattedNumber: formatPhoneNumber(
          normalizedNumber,
          props.phones.phoneFormat,
        ),
        fieldId: item.number.field,
        constantValueEnabled: item.number.constantValueEnabled,
        linkValue: normalizedNumber.replace(/[^\d+]/g, ""),
      },
    ];
  });
  const resolvedEmails = resolveComponentData(
    props.emails.list,
    locale,
    streamDocument,
  ) as string[] | string | undefined;
  const emailList = Array.isArray(resolvedEmails)
    ? resolvedEmails
    : typeof resolvedEmails === "string" && resolvedEmails.length > 0
      ? [resolvedEmails]
      : [];

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck.isEditing}
    >
      <AnalyticsScopeProvider
        name={`YextBarSocialDiningFooterSection${getAnalyticsScopeHash(id)}`}
      >
        <style>{footerScopedTypographyCss}</style>
        <style>{`
          @media (max-width: 1024px) and (min-width: 769px) {
            .bar-social-dining-footer-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 768px) {
            .bar-social-dining-footer-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <footer
          className={footerScopeClass}
          style={{
            backgroundColor: themeColorToCss(
              props.section.backgroundColor.selectedColor,
            ),
            color: sectionForeground,
            padding: "40px 28px",
          }}
        >
          <div
            className="bar-social-dining-footer-grid"
            style={{
              display: "grid",
              gap: "28px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div>
              <EntityField
                displayName="Logo Image"
                fieldId={props.logoImage.image.field}
                constantValueEnabled={
                  props.logoImage.image.constantValueEnabled
                }
              >
                {hasLogoImage ? (
                  <div
                    style={{
                      aspectRatio:
                        props.logoImage.aspectRatio > 0
                          ? props.logoImage.aspectRatio
                          : undefined,
                      marginBottom: "20px",
                      overflow:
                        props.logoImage.imageConstrain === "filled"
                          ? "hidden"
                          : undefined,
                      width: "170px",
                    }}
                  >
                    <Image
                      image={logoImage!}
                      style={{
                        height:
                          props.logoImage.aspectRatio > 0 ? "100%" : "55px",
                        objectFit:
                          props.logoImage.imageConstrain === "filled"
                            ? "cover"
                            : "contain",
                        width: "100%",
                      }}
                    />
                  </div>
                ) : null}
              </EntityField>
              <EntityField
                displayName="Follow Us Heading"
                fieldId={props.followUsHeading.text.field}
                constantValueEnabled={
                  props.followUsHeading.text.constantValueEnabled
                }
              >
                <h3
                  style={{
                    ...textStyle(
                      props.followUsHeading.styles,
                      props.followUsHeading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: "0 0 12px",
                  }}
                >
                  {typeof resolvedFollowUsHeading === "string"
                    ? resolvedFollowUsHeading
                    : ""}
                </h3>
              </EntityField>
              <div style={{ display: "flex", gap: "8px" }}>
                {(props.socialLinks ?? []).map((item, index) => (
                  <EntityField
                    key={`${getCtaLabel(item.cta)}-${index}`}
                    displayName={`Social Link ${index + 1}`}
                    fieldId={item.cta.data.cta.field}
                    constantValueEnabled={
                      item.cta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={item.cta as Partial<ComprehensiveCTAValue>}
                      alwaysHideCaret
                      eventName={`footerSocial${index}`}
                      label={
                        <span
                          aria-label={getCtaLabel(item.cta)}
                          style={{
                            alignItems: "center",
                            display: "inline-flex",
                            height: "20px",
                            justifyContent: "center",
                            width: "20px",
                          }}
                        >
                          {renderSocialIcon(index)}
                        </span>
                      }
                      style={{ color: "inherit" }}
                    />
                  </EntityField>
                ))}
              </div>
            </div>
            <div>
              <EntityField
                displayName="Contact Heading"
                fieldId={props.contactHeading.text.field}
                constantValueEnabled={
                  props.contactHeading.text.constantValueEnabled
                }
              >
                <h3
                  style={{
                    ...textStyle(
                      props.contactHeading.styles,
                      props.contactHeading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: "0 0 16px",
                  }}
                >
                  {typeof resolvedContactHeading === "string"
                    ? resolvedContactHeading
                    : ""}
                </h3>
              </EntityField>
              <EntityField
                displayName="Contact Body"
                fieldId={props.contactBody.text.field}
                constantValueEnabled={
                  props.contactBody.text.constantValueEnabled
                }
              >
                <div
                  className="bar-social-dining-link-typography"
                  style={{
                    ...textStyle(
                      props.contactBody.styles,
                      props.contactBody.fontColor,
                      props.section.backgroundColor,
                    ),
                  }}
                >
                  {renderRichText(resolvedContactBody)}
                </div>
              </EntityField>
              {resolvedPhoneItems.map((item, index) => (
                <EntityField
                  key={`${item.fieldId}-${index}`}
                  displayName="Phone Number"
                  fieldId={item.fieldId}
                  constantValueEnabled={item.constantValueEnabled}
                >
                  <div
                    className="bar-social-dining-link-typography"
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <FaPhone />
                    {item.label ? <span>{item.label}</span> : null}
                    <ComprehensiveCTA
                      value={
                        createTextLinkCta(
                          item.formattedNumber,
                          item.linkValue,
                          footerLinkColor,
                        ) as Partial<ComprehensiveCTAValue>
                      }
                      alwaysHideCaret
                      eventName="phoneCta"
                      style={{ color: "inherit" }}
                    />
                  </div>
                </EntityField>
              ))}
              <EntityField
                displayName="Emails"
                fieldId={props.emails.list.field}
                constantValueEnabled={props.emails.list.constantValueEnabled}
              >
                {emailList.map((emailValue, index) => (
                  <div
                    className="bar-social-dining-link-typography"
                    key={`${emailValue}-${index}`}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    <MdEmail />
                    <ComprehensiveCTA
                      value={
                        createTextLinkCta(
                          emailValue.replace(/^mailto:/i, ""),
                          emailValue,
                          footerLinkColor,
                        ) as Partial<ComprehensiveCTAValue>
                      }
                      alwaysHideCaret
                      eventName="emailCta"
                      style={{ color: "inherit" }}
                    />
                  </div>
                ))}
              </EntityField>
            </div>
            <div>
              <EntityField
                displayName="Resources Heading"
                fieldId={props.resourcesHeading.text.field}
                constantValueEnabled={
                  props.resourcesHeading.text.constantValueEnabled
                }
              >
                <h3
                  style={{
                    ...textStyle(
                      props.resourcesHeading.styles,
                      props.resourcesHeading.fontColor,
                      props.section.backgroundColor,
                    ),
                    margin: "0 0 16px",
                  }}
                >
                  {typeof resolvedResourcesHeading === "string"
                    ? resolvedResourcesHeading
                    : ""}
                </h3>
              </EntityField>
              <div
                className="bar-social-dining-link-typography"
                style={{ display: "grid", gap: "12px" }}
              >
                {(props.resourceLinks ?? []).map((item, index) => (
                  <EntityField
                    key={`${getCtaLabel(item.cta)}-${index}`}
                    displayName={`Resource Link ${index + 1}`}
                    fieldId={item.cta.data.cta.field}
                    constantValueEnabled={
                      item.cta.data.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={item.cta as Partial<ComprehensiveCTAValue>}
                      alwaysHideCaret
                      eventName={`footerLink${index}`}
                      style={{ color: "inherit" }}
                    />
                  </EntityField>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "44px",
            }}
          >
            <EntityField
              displayName="Copyright Text"
              fieldId={props.copyrightText.text.field}
              constantValueEnabled={
                props.copyrightText.text.constantValueEnabled
              }
            >
              <div
                className="bar-social-dining-link-typography"
                style={{
                  ...textStyle(
                    props.copyrightText.styles,
                    props.copyrightText.fontColor,
                    props.section.backgroundColor,
                  ),
                  margin: 0,
                  opacity: 0.75,
                }}
              >
                {renderRichText(resolvedCopyrightText)}
              </div>
            </EntityField>
          </div>
        </footer>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const YextBarSocialDiningFooterSection: YextComponentConfig<YextBarSocialDiningFooterSectionProps> =
  {
    label: "Footer Section",
    fields: toPuckFields(YextBarSocialDiningFooterSectionFields),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        visibleOnLivePage: true,
      },
      logoImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/OLT2KExDEKhKlCmIobyRRHN6MFUS77fVs5gIt_FTnBI/450x450.jpg",
            width: 450,
            height: 450,
          },
          constantValueEnabled: true,
        },
        aspectRatio: 1,
        imageConstrain: "fixed",
        styles: {
          borderRadius: "default",
        },
      },
      followUsHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Follow us",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      socialLinks: [
        {
          cta: createTextLinkCta("Facebook", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Instagram", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Yelp", "#", footerLinkColor),
        },
      ],
      contactHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Contact us",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      contactBody: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "Questions? We’re here for you Monday - Friday 10am-6pm ET.",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      phones: {
        items: [
          {
            number: {
              field: "",
              constantValue: "+1 (416) 555-5555",
              constantValueEnabled: true,
            },
            label: "",
          },
        ],
        phoneFormat: "domestic",
        includeHyperlink: true,
      },
      emails: {
        list: {
          field: "emails",
          constantValue: ["support@redwood.co"],
          constantValueEnabled: false,
        },
      },
      resourcesHeading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Resources",
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
      resourceLinks: [
        {
          cta: createTextLinkCta("Menu", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Order online", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Reservations", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Group events", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Catering", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Careers", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Gift cards", "#", footerLinkColor),
        },
        {
          cta: createTextLinkCta("Contact", "#", footerLinkColor),
        },
      ],
      copyrightText: {
        text: {
          field: "",
          constantValue: {
            defaultValue: getDefaultRTF(
              "© 2026 [[name]] — All Rights Reserved",
            ),
            hasLocalizedValue: "true",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontFamily: "default",
          fontSize: "default",
          fontWeight: "default",
          fontStyle: "default",
          textTransform: "default",
        },
        fontColor: undefined,
      },
    },
    render: (props) => <YextBarSocialDiningFooterSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  displayName: "Footer",
  description: "Displays the restaurant site footer.",
  pageSetTypes: ["ENTITY"],
  category: "Site",
};
