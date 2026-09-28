import * as React from "react";
import {
  Address,
  AnalyticsScopeProvider,
  HoursTable,
  Link,
  type AddressType,
  type DayOfWeekNames,
  type HoursType,
} from "@yext/pages-components";
import { parsePhoneNumber } from "awesome-phonenumber";
import {
  Background,
  ComprehensiveCTA,
  createStyledTextConfig,
  EntityField,
  getThemeColorCssValue,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  resolveComponentData,
  StyledTextComponent,
  useDocument,
  VisibilityWrapper,
  type ComprehensiveCTAValue,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  type TranslatableString,
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";

type AddressFieldProps = {
  subheading: YextEntityField<TranslatableString>;
  address: YextEntityField<AddressType>;
  directionsLink: Partial<ComprehensiveCTAValue>;
  showRegion: boolean;
  showCountry: boolean;
};

type PhoneItemProps = {
  number: YextEntityField<string>;
};

type PhoneFieldProps = {
  subheading: YextEntityField<TranslatableString>;
  items: PhoneItemProps[];
  phoneFormat: "international" | "domestic";
  includeHyperlink?: boolean;
};

type HoursTableFieldProps = {
  subheading: YextEntityField<TranslatableString>;
  data: {
    hours: YextEntityField<HoursType>;
  };
  settings: {
    startOfWeek: keyof DayOfWeekNames | "today";
    collapseDays: boolean;
    showAdditionalHoursText: boolean;
    alignment: "items-start" | "items-center" | "items-end";
  };
};

type StyledTextListProps = {
  subheading: YextEntityField<TranslatableString>;
  text: YextEntityField<TranslatableString[]>;
};

const themeVars: React.CSSProperties = {
  ["--COLOR-BG" as string]: "var(--palette-tertiary)",
  ["--COLOR-BG-ACCENT" as string]: "var(--palette-tertiary)",
  ["--COLOR-TEXT" as string]: "var(--palette-quaternary)",
  ["--COLOR-BORDER" as string]: "var(--palette-tertiary)",
  ["--COLOR-ACCENT" as string]: "var(--palette-secondary)",
  ["--COLOR-ACCENT-HOVER" as string]: "var(--palette-primary)",
  ["--BTN-PRIMARY-BG" as string]: "var(--palette-primary)",
  ["--BTN-SECONDARY-TEXT" as string]: "var(--palette-quaternary)",
  ["--footer-bg" as string]: "var(--palette-quaternary)",
};

const capturedStyles = String.raw`:root {
--content-max: 1440px;
  --outer: 32px;
  --outer-mobile: 16px;
  --gutter: 24px;
  --inner: 20px;
  --radius: 14px;
  --radius-small: 10px;
  --font-heading: "Bricolage Grotesque", sans-serif;
  --font-body: "DM Sans", sans-serif;
  --font-body-small: 0.9rem;
  --font-body-medium: 1.02rem;
  --font-body-large: 1.12rem;
  --font-heading-x-small: clamp(1.6rem, 2.1vw, 2.15rem);
  --font-heading-small: clamp(2rem, 2.8vw, 2.95rem);
  --font-heading-large: clamp(2.7rem, 4.9vw, 5rem);
  --font-heading-hero: clamp(3.4rem, 8vw, 7.4rem);
  --section-padding: 50px;
  --section-padding-large: 80px;
  --line: 1.45;
}

*,
*::before,
*::after {
box-sizing: border-box;
}

html {
scroll-behavior: smooth;
}

body {
margin: 0;
  min-width: 320px;
  color: var(--COLOR-TEXT);
  background: var(--COLOR-BG);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: var(--line);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img {
display: block;
  max-width: 100%;
}

a {
color: inherit;
  text-decoration: none;
  transition:
    color 180ms ease,
    opacity 180ms ease,
    text-decoration-color 180ms ease;
}

a:hover {
color: var(--COLOR-ACCENT-HOVER);
}

a:focus-visible,
button:focus-visible,
input:focus-visible {
outline: 2px solid var(--COLOR-ACCENT);
  outline-offset: 3px;
}

button,
input {
font: inherit;
}

button {
cursor: pointer;
}

summary {
list-style: none;
  cursor: pointer;
}

summary::-webkit-details-marker {
display: none;
}

.svg-sprite {
position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.visually-hidden {
position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.wrapper {
width: min(var(--content-max), calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.body-medium {
font-size: var(--font-body-medium);
}

.section-padding {
padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
}

.color-scheme-1 {
background: var(--COLOR-BG);
  color: var(--COLOR-TEXT);
}

.heading-small {
margin: 0;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.heading-small {
font-size: clamp(1.4rem, 1.8vw, 1.8rem);
}

.heading-small :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.core-info {
border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.core-info__intro {
max-width: 980px;
  margin-bottom: 28px;
}

.core-info__intro p {
margin: 14px 0 0;
  color: inherit;
  opacity: 0.76;
}

.core-info__grid {
display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px 28px;
}

.core-info__item {
padding: 0 0 18px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}

.core-info__item--contact {
display: grid;
  align-content: start;
  gap: 14px;
}

.core-info__item--contact strong {
margin-bottom: 4px;
}

.core-info__item--contact .core-info__link + .core-info__stack {
margin-top: 28px;
}

.core-info__item--contact .core-info__link,
.core-info__item--contact .core-info__stack {
margin-top: 0;
}

.core-info__item:nth-last-child(-n + 3) {
border-bottom: 0;
}

.core-info__item strong {
display: block;
  margin-bottom: 8px;
  font-size: 0.83rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.core-info__item p {
margin: 0;
  color: inherit;
}

.core-info__stack + .core-info__stack {
margin-top: 18px;
}

.core-info__link {
display: inline-flex;
  align-items: center;
  margin-top: 16px;
  font-weight: 700;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.16em;
}

.core-info__link:hover {
color: var(--COLOR-ACCENT-HOVER);
}

.hours-table {
display: grid;
  gap: 10px;
  width: 100%;
  max-width: 100%;
}

.hours-table__row {
display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 16px;
  align-items: baseline;
  width: 100%;
  max-width: 100%;
}

.hours-table__day,
.hours-table__time {
color: inherit;
  opacity: 0.76;
}

.hours-table__time {
text-align: right;
  justify-self: end;
}

.core-info__list {
margin: 0;
  padding-left: 1.2rem;
  color: inherit;
  opacity: 0.76;
}

.core-info__list li + li {
margin-top: 8px;
}

.faq-shell .wrapper {
width: min(980px, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}
}

@media (min-width: 481px) and (max-width: 768px) {
.core-info__grid {
grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
}
}

@media (max-width: 480px) {
.core-info__grid {
grid-template-columns: minmax(0, 1fr);
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

const headingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Heading",
  includeColor: true,
});

const subheadingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Subheading",
  includeColor: true,
});

const bodyConfig = createStyledTextConfig({
  kind: "plain",
  label: "Body",
  includeColor: true,
});

const introTextConfig = createStyledTextConfig({
  kind: "richText",
  label: "Intro Text",
  includeColor: true,
});

const defaultLinkStyles: Partial<ComprehensiveCTAValue>["styles"] = {
  variant: "link",
  link: {
    includeCaret: "none",
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
    letterSpacing: "default",
  },
};

const phoneFormatValue = (
  number: string,
  format: PhoneFieldProps["phoneFormat"],
) => {
  const parsed = parsePhoneNumber(number, { regionCode: "US" });
  if (!parsed.valid) {
    return number.trim();
  }

  return format === "international"
    ? parsed.number.international
    : parsed.number.national;
};

const phoneHrefValue = (number: string) => {
  const parsed = parsePhoneNumber(number, { regionCode: "US" });
  const sanitizedNumber = number.trim().replace(/[^\d+]/g, "");
  return parsed.valid ? `tel:${parsed.number.e164}` : `tel:${sanitizedNumber}`;
};

const hasAddressContent = (address?: AddressType): address is AddressType =>
  Boolean(
    address &&
    Object.values(address).some(
      (value) => typeof value === "string" && value.trim().length > 0,
    ),
  );

const hasHoursContent = (hours?: HoursType): hours is HoursType =>
  Boolean(hours && Object.keys(hours).length > 0);

type CasualDiningDetailsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: StyledPlainTextProps;
  subheading: StyledPlainTextProps;
  body: StyledPlainTextProps;
  introText: StyledRichTextProps;
  address: AddressFieldProps;
  phone: PhoneFieldProps;
  websiteLink: Partial<ComprehensiveCTAValue>;
  hours: HoursTableFieldProps;
  dining: StyledTextListProps;
};

const fields: YextFields<CasualDiningDetailsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: "Visible on Live Page",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      backgroundColor: {
        label: "Background Color",
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: headingConfig.fields!,
  },
  subheading: {
    label: "Subheading",
    type: "object",
    objectFields: {
      fontOptions: subheadingConfig.fields!.fontOptions,
    },
  },
  body: {
    label: "Body",
    type: "object",
    objectFields: {
      fontOptions: bodyConfig.fields!.fontOptions,
    },
  },
  introText: {
    label: "Intro Text",
    type: "object",
    objectFields: introTextConfig.fields!,
  },
  address: {
    label: "Address",
    type: "object",
    objectFields: {
      subheading: {
        label: "Address Subheading",
        type: "entityField",
        filter: {
          types: ["type.string"],
        },
      },
      address: {
        label: "Address",
        type: "entityField",
        filter: {
          types: ["type.address"],
        },
        disableConstantValueToggle: true,
      },
      directionsLink: {
        label: "Directions Link",
        type: "comprehensiveCTA",
      },
      showRegion: {
        label: "Show Region",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      showCountry: {
        label: "Show Country",
        type: "radio",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
  },
  phone: {
    label: "Phone",
    type: "object",
    objectFields: {
      subheading: {
        label: "Phone Subheading",
        type: "entityField",
        filter: {
          types: ["type.string"],
        },
      },
      items: {
        label: "Items",
        type: "array",
        arrayFields: {
          number: {
            label: "Number",
            type: "entityField",
            filter: {
              types: ["type.phone"],
            },
          },
        },
        defaultItemProps: {
          number: {
            field: "",
            constantValue: "",
            constantValueEnabled: true,
          },
        },
        getItemSummary: (_item: PhoneItemProps, index?: number) =>
          `Phone ${(index ?? 0) + 1}`,
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
  websiteLink: {
    label: "Website Link",
    type: "comprehensiveCTA",
  },
  hours: {
    label: "Hours",
    type: "object",
    objectFields: {
      subheading: {
        label: "Hours Subheading",
        type: "entityField",
        filter: {
          types: ["type.string"],
        },
      },
      data: {
        label: "Data",
        type: "object",
        objectFields: {
          hours: {
            label: "Hours",
            type: "entityField",
            filter: {
              types: ["type.hours"],
            },
            disableConstantValueToggle: true,
          },
        },
      },
      settings: {
        label: "Settings",
        type: "object",
        objectFields: {
          startOfWeek: {
            label: "Start Of Week",
            type: "select",
            options: [
              { label: "Monday", value: "monday" },
              { label: "Tuesday", value: "tuesday" },
              { label: "Wednesday", value: "wednesday" },
              { label: "Thursday", value: "thursday" },
              { label: "Friday", value: "friday" },
              { label: "Saturday", value: "saturday" },
              { label: "Sunday", value: "sunday" },
              { label: "Today", value: "today" },
            ],
          },
          collapseDays: {
            label: "Collapse Days",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          showAdditionalHoursText: {
            label: "Show Additional Hours Text",
            type: "radio",
            options: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
          },
          alignment: {
            label: "Alignment",
            type: "select",
            options: [
              { label: "Start", value: "items-start" },
              { label: "Center", value: "items-center" },
              { label: "End", value: "items-end" },
            ],
          },
        },
      },
    },
  },
  dining: {
    label: "Dining Details",
    type: "object",
    objectFields: {
      subheading: {
        label: "Services Subheading",
        type: "entityField",
        filter: {
          types: ["type.string"],
        },
      },
      text: {
        label: "Text List",
        type: "entityField",
        filter: {
          types: ["type.string"],
          includeListsOnly: true,
        },
      },
    },
  },
};

const CasualDiningDetailsComponent: PuckComponent<CasualDiningDetailsProps> = (
  props,
) => {
  const streamDocument = useDocument<{
    locale?: string;
    comingSoon?: boolean;
    additionalHoursText?: string;
  }>();
  const locale = streamDocument?.locale ?? "en";
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const sectionTextColor = sectionSurfaceStyle?.color;
  const resolvedAddress = resolveComponentData(
    props.address.address,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.hours.data.hours,
    locale,
    streamDocument,
  );
  const resolvedDining = resolveComponentData(
    props.dining.text,
    locale,
    streamDocument,
  );
  const additionalHoursText = streamDocument?.additionalHoursText?.trim();
  const bodyTextStyle = {
    color: getThemeColorCssValue(props.body.fontOptions.color) ?? sectionTextColor,
    fontFamily:
      props.body.fontOptions.fontFamily === "default"
        ? undefined
        : props.body.fontOptions.fontFamily,
    fontSize:
      props.body.fontOptions.fontSize === "default"
        ? undefined
        : props.body.fontOptions.fontSize,
    fontWeight:
      props.body.fontOptions.fontWeight === "default"
        ? undefined
        : props.body.fontOptions.fontWeight,
    fontStyle:
      props.body.fontOptions.fontStyle === "default"
        ? undefined
        : props.body.fontOptions.fontStyle,
    textTransform:
      props.body.fontOptions.textTransform === "default"
        ? undefined
        : props.body.fontOptions.textTransform,
  } satisfies React.CSSProperties;
  const hoursAlignmentStyle =
    props.hours.settings.alignment === "items-center"
      ? { marginInline: "auto", textAlign: "center" as const }
      : props.hours.settings.alignment === "items-end"
        ? { marginLeft: "auto", textAlign: "right" as const }
        : {};
  const phoneItems = props.phone.items
    .map((item) => {
      const resolvedValue = resolveComponentData(
        item.number,
        locale,
        streamDocument,
      );
      const resolvedNumber =
        typeof resolvedValue === "string"
          ? resolvedValue.trim()
          : typeof item.number.constantValue === "string"
            ? item.number.constantValue.trim()
            : "";

      if (!resolvedNumber) {
        return null;
      }

      const formattedNumber = phoneFormatValue(
        resolvedNumber,
        props.phone.phoneFormat,
      );

      return {
        content: formattedNumber,
        entityField: item.number,
        href: phoneHrefValue(resolvedNumber),
      };
    })
    .filter(
      (
        item,
      ): item is {
        content: string;
        entityField: YextEntityField<string>;
        href: string;
      } => item !== null,
    );

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningDetails${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="core-info section-padding color-scheme-1"
            id="core-info"
            style={sectionSurfaceStyle}
          >
            <div className="wrapper">
              <div className="core-info__intro">
                <div className="heading-small">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.data.text.field}
                    constantValueEnabled={
                      props.heading.data.text.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="plain"
                      {...props.heading}
                      tag="h2"
                      puck={
                        props.puck?.isEditing ? { isEditing: true } : undefined
                      }
                    />
                  </EntityField>
                </div>
                <div className="body-medium">
                  <EntityField
                    displayName="Intro Text"
                    fieldId={props.introText.data.text.field}
                    constantValueEnabled={
                      props.introText.data.text.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="richText"
                      {...props.introText}
                      puck={
                        props.puck?.isEditing ? { isEditing: true } : undefined
                      }
                    />
                  </EntityField>
                </div>
              </div>

              <div className="core-info__grid">
                <div
                  className="core-info__item core-info__item--contact"
                  style={{ color: sectionTextColor }}
                >
                  {hasAddressContent(resolvedAddress) ? (
                    <div className="core-info__stack">
                      <EntityField
                        displayName="Address Subheading"
                        fieldId={props.address.subheading.field}
                        constantValueEnabled={
                          props.address.subheading.constantValueEnabled
                        }
                      >
                        <StyledTextComponent
                          kind="plain"
                          {...props.subheading}
                          data={{ text: props.address.subheading as any }}
                          tag="strong"
                          puck={
                            props.puck?.isEditing
                              ? { isEditing: true }
                              : undefined
                          }
                        />
                      </EntityField>
                      <div className="body-medium" style={bodyTextStyle}>
                        <EntityField
                          displayName="Address"
                          fieldId={props.address.address.field}
                          constantValueEnabled={
                            props.address.address.constantValueEnabled
                          }
                        >
                          <Address
                            address={resolvedAddress}
                            showRegion={props.address.showRegion}
                            showCountry={props.address.showCountry}
                          />
                        </EntityField>
                      </div>
                    </div>
                  ) : null}
                  <EntityField
                    displayName="Directions Link"
                    fieldId={props.address.directionsLink.data?.cta.field}
                    constantValueEnabled={
                      props.address.directionsLink.data?.cta
                        .constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.address.directionsLink.data,
                        styles: props.address.directionsLink.styles,
                      }}
                      className="core-info__link"
                    />
                  </EntityField>
                  {phoneItems.length > 0 ? (
                    <div className="core-info__stack">
                      <EntityField
                        displayName="Phone Subheading"
                        fieldId={props.phone.subheading.field}
                        constantValueEnabled={
                          props.phone.subheading.constantValueEnabled
                        }
                      >
                        <StyledTextComponent
                          kind="plain"
                          {...props.subheading}
                          data={{ text: props.phone.subheading as any }}
                          tag="strong"
                          puck={
                            props.puck?.isEditing
                              ? { isEditing: true }
                              : undefined
                          }
                        />
                      </EntityField>
                      <div className="body-medium">
                        {phoneItems.map((item) =>
                          props.phone.includeHyperlink ? (
                            <EntityField
                              key={item.content}
                              displayName="Phone Number"
                              fieldId={item.entityField.field}
                              constantValueEnabled={
                                item.entityField.constantValueEnabled
                              }
                            >
                              <Link
                                href={item.href}
                                className="core-info__link"
                              >
                                <StyledTextComponent
                                  kind="plain"
                                  {...props.body}
                                  data={{
                                    text: {
                                      field: "",
                                      constantValue: {
                                        defaultValue: item.content,
                                      },
                                      constantValueEnabled: true,
                                    },
                                  }}
                                  tag="span"
                                  puck={
                                    props.puck?.isEditing
                                      ? { isEditing: true }
                                      : undefined
                                  }
                                />
                              </Link>
                            </EntityField>
                          ) : (
                            <EntityField
                              key={item.content}
                              displayName="Phone Number"
                              fieldId={item.entityField.field}
                              constantValueEnabled={
                                item.entityField.constantValueEnabled
                              }
                            >
                              <StyledTextComponent
                                kind="plain"
                                {...props.body}
                                data={{
                                  text: {
                                    field: "",
                                    constantValue: {
                                      defaultValue: item.content,
                                    },
                                    constantValueEnabled: true,
                                  },
                                }}
                                tag="p"
                                puck={
                                  props.puck?.isEditing
                                    ? { isEditing: true }
                                    : undefined
                                }
                              />
                            </EntityField>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}
                  <EntityField
                    displayName="Website Link"
                    fieldId={props.websiteLink.data?.cta.field}
                    constantValueEnabled={
                      props.websiteLink.data?.cta.constantValueEnabled
                    }
                  >
                    <ComprehensiveCTA
                      value={{
                        data: props.websiteLink.data,
                        styles: props.websiteLink.styles,
                      }}
                      className="core-info__link"
                    />
                  </EntityField>
                </div>
                {hasHoursContent(resolvedHours) ? (
                  <div
                    className="core-info__item"
                    style={{ color: sectionTextColor }}
                  >
                    <EntityField
                      displayName="Hours Subheading"
                      fieldId={props.hours.subheading.field}
                      constantValueEnabled={
                        props.hours.subheading.constantValueEnabled
                      }
                    >
                      <StyledTextComponent
                        kind="plain"
                        {...props.subheading}
                        data={{ text: props.hours.subheading as any }}
                        tag="strong"
                        puck={
                          props.puck?.isEditing
                            ? { isEditing: true }
                            : undefined
                        }
                      />
                    </EntityField>
                    <div
                      className="body-medium"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "fit-content",
                        maxWidth: "100%",
                        ...bodyTextStyle,
                        ...hoursAlignmentStyle,
                      }}
                    >
                      <EntityField
                        displayName="Hours"
                        fieldId={props.hours.data.hours.field}
                        constantValueEnabled={
                          props.hours.data.hours.constantValueEnabled
                        }
                      >
                        <HoursTable
                          className="hours-table"
                          hours={resolvedHours}
                          comingSoon={streamDocument?.comingSoon}
                          startOfWeek={props.hours.settings.startOfWeek}
                          collapseDays={props.hours.settings.collapseDays}
                          timeOptions={{ hour12: true }}
                        />
                      </EntityField>
                      {additionalHoursText &&
                      props.hours.settings.showAdditionalHoursText ? (
                        <p className="body-small" style={{ marginTop: 16 }}>
                          {additionalHoursText}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <div
                  className="core-info__item"
                  style={{ color: sectionTextColor }}
                >
                  <EntityField
                    displayName="Services Subheading"
                    fieldId={props.dining.subheading.field}
                    constantValueEnabled={
                      props.dining.subheading.constantValueEnabled
                    }
                  >
                    <StyledTextComponent
                      kind="plain"
                      {...props.subheading}
                      data={{ text: props.dining.subheading as any }}
                      tag="strong"
                      puck={
                        props.puck?.isEditing ? { isEditing: true } : undefined
                      }
                    />
                  </EntityField>
                  <EntityField
                    displayName="Services"
                    fieldId={props.dining.text.field}
                    constantValueEnabled={props.dining.text.constantValueEnabled}
                  >
                    <ul className="core-info__list">
                      {(Array.isArray(resolvedDining) ? resolvedDining : [])
                        .map((item) => {
                          if (typeof item === "string") {
                            return item.trim();
                          }

                          if (
                            item &&
                            typeof item === "object" &&
                          typeof (item as { defaultValue?: string }).defaultValue === "string"
                          ) {
                          return (item as { defaultValue: string }).defaultValue.trim();
                          }

                          return "";
                        })
                        .filter(Boolean)
                        .map((item, index) => (
                        <li key={`${item}-${index}`} style={{ listStyleType: "disc" }}>
                            <StyledTextComponent
                              kind="plain"
                              {...props.body}
                              data={{
                                text: {
                                  field: "",
                                  constantValue: { defaultValue: item },
                                  constantValueEnabled: true,
                                },
                              }}
                              tag="span"
                              puck={
                                props.puck?.isEditing
                                  ? { isEditing: true }
                                  : undefined
                              }
                            />
                          </li>
                        ))}
                    </ul>
                  </EntityField>
                </div>
              </div>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningDetails: YextComponentConfig<CasualDiningDetailsProps> =
  {
    label: "Details",
    fields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
        visibleOnLivePage: true,
      },
      heading: {
        ...headingConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "All about this location",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledPlainTextProps,
      subheading: subheadingConfig.defaultProps as StyledPlainTextProps,
      body: bodyConfig.defaultProps as StyledPlainTextProps,
      introText: {
        ...introTextConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue:
                "Everything you need before you head to [[name]] - [[geomodifier]].",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledRichTextProps,
      address: {
        subheading: {
          field: "",
          constantValue: {
            defaultValue: "Address",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        address: {
          field: "address",
          constantValue: {
            line1: "",
            city: "",
            postalCode: "",
            countryCode: "",
            region: "",
          },
          constantValueEnabled: false,
        } satisfies YextEntityField<AddressType>,
        directionsLink: {
          data: {
            actionType: "link",
            cta: {
              field: "",
              selectedType: "getDirections",
              constantValue: {
                label: {
                  defaultValue: "Get Directions",
                  hasLocalizedValue: "true" as const,
                },
                link: {
                  defaultValue: "#",
                  hasLocalizedValue: "true" as const,
                },
                openInNewTab: false,
                ctaType: "getDirections",
              },
              constantValueEnabled: true,
            },
            openInNewTab: false,
          },
          styles: defaultLinkStyles,
        },
        showRegion: true,
        showCountry: false,
      },
      phone: {
        subheading: {
          field: "",
          constantValue: {
            defaultValue: "Phone",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        items: [
          {
            number: {
              field: "mainPhone",
              constantValue: "+1 (512) 555-0148",
              constantValueEnabled: false,
            },
          },
        ],
        phoneFormat: "international",
        includeHyperlink: false,
      },
      websiteLink: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              label: {
                defaultValue: "Website",
                hasLocalizedValue: "true" as const,
              },
              link: {
                defaultValue: "#",
                hasLocalizedValue: "true" as const,
              },
              openInNewTab: false,
              ctaType: "textAndLink",
            },
            constantValueEnabled: true,
          },
          openInNewTab: false,
        },
        styles: defaultLinkStyles,
      },
      hours: {
        subheading: {
          field: "",
          constantValue: {
            defaultValue: "Hours",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        data: {
          hours: {
            field: "hours",
            constantValue: {},
            constantValueEnabled: false,
          } satisfies YextEntityField<HoursType>,
        },
        settings: {
          startOfWeek: "monday",
          collapseDays: false,
          showAdditionalHoursText: false,
          alignment: "items-start",
        },
      },
      dining: {
        subheading: {
          field: "",
          constantValue: {
            defaultValue: "Dining",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
        text: {
          field: "",
          constantValue: [
            "Dine-in",
            "Takeout",
            "Delivery",
            "Curbside pickup",
            "Call-ahead ordering",
            "Patio seating",
            "Reservations through OpenTable",
          ],
          constantValueEnabled: true,
        },
      },
    },
    render: (props) => <CasualDiningDetailsComponent {...props} />,
  };
