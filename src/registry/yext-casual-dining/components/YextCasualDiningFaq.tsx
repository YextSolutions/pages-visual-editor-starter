import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  createItemSource,
  createStyledTextConfig,
  EntityField,
  getDefaultRTF,
  getSurfaceColorStyle,
  getAnalyticsScopeHash,
  StyledTextComponent,
  useDocument,
  VisibilityWrapper,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";

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

.accordion__content {
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

.heading-large {
margin: 0;
  font-family: var(--font-heading);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.heading-large {
font-size: var(--font-heading-large);
  line-height: 0.96;
}

.heading-large :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.faq-shell {
border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.faq-shell .wrapper {
width: min(980px, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.faq-shell__intro {
max-width: 980px;
  margin-bottom: 28px;
}

.accordion-group__items {
display: grid;
  gap: 0;
}

.accordion {
border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}

.accordion:last-child {
border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}

.accordion__title {
display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0;
  padding: 20px 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
}

.accordion__title:hover {
color: var(--COLOR-ACCENT-HOVER);
}

.accordion__icon {
position: relative;
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: currentColor;
}

.accordion__icon::before,
.accordion__icon::after {
content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 1.5px;
  background: currentColor;
  transform: translate(-50%, -50%);
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}

.accordion__icon::after {
transform: translate(-50%, -50%) rotate(90deg);
}

.accordion[open] .accordion__icon::after {
opacity: 0;
}

.accordion__content {
padding: 0 0 20px;
  color: inherit;
  opacity: 0.78;
}

.accordion__content p {
margin: 0;
  max-width: 72ch;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

type FaqItemFields = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

const faqItems = [
  {
    question: "Are your dining hours the same as your takeout hours?",
    answer:
      "Not always. Takeout and delivery may remain available slightly later than dine-in seating, especially on weekends. Check our ordering page or call ahead for the latest hours.",
  },
  {
    question: "Can I order online?",
    answer:
      "Yes. [[name]] offers online ordering for takeout, curbside pickup, and delivery throughout [[address.city]] and nearby neighborhoods.",
  },
  {
    question: "Do you take reservations?",
    answer:
      "We accept reservations for parties up to 6 guests based on availability. Larger group and private dining requests can be arranged directly with our events team.",
  },
  {
    question: "Do you offer vegetarian or gluten-free options?",
    answer:
      "Yes. We offer vegetarian-friendly dishes, salads, shareables, and gluten-free bun options on request.",
  },
  {
    question: "Do you have a kids menu?",
    answer:
      "Yes. Our kids menu includes cheeseburgers, grilled chicken tenders, mac and cheese, and buttered pasta served with fries or fruit and a fountain drink.",
  },
  {
    question: "Is parking available?",
    answer:
      "Complimentary onsite parking is available, with additional street parking nearby and convenient ride-share drop-off access.",
  },
  {
    question: "Do you serve brunch and happy hour?",
    answer:
      "We do. Weekend brunch is available on Saturdays and Sundays, and weekday happy hour features rotating cocktails, draft beer, appetizers, and burger specials.",
  },
  {
    question: "Do you have outdoor seating?",
    answer:
      "Yes. Our dog-friendly patio is a favorite for sunset dinners, cooler [[address.city]] evenings, and weekend brunch gatherings.",
  },
];

const faqItemsSource = createItemSource<FaqItemFields>({
  label: "FAQ Items",
  mappingFields: {
    question: {
      label: "Question",
      type: "entityField",
      filter: {
        types: ["type.string"],
      },
    },
    answer: {
      label: "Answer",
      type: "entityField",
      filter: {
        types: ["type.rich_text_v2"],
      },
    },
  },
  defaultValues: faqItems.map((item) => ({
    question: {
      field: "",
      constantValue: {
        defaultValue: item.question,
        hasLocalizedValue: "true" as const,
      },
      constantValueEnabled: true,
    },
    answer: {
      field: "",
      constantValue: {
        defaultValue: getDefaultRTF(item.answer),
        hasLocalizedValue: "true" as const,
      },
      constantValueEnabled: true,
    },
  })),
});

type FaqCollection = {
  data: typeof faqItemsSource.value;
  styles: {
    question: Pick<StyledPlainTextProps, "fontOptions">;
    answer: Pick<StyledRichTextProps, "fontOptions">;
  };
};

type CasualDiningFaqProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledPlainTextProps;
  faqs: FaqCollection;
};

const headingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Heading",
  includeColor: true,
});

const questionConfig = createStyledTextConfig({
  kind: "plain",
  label: "Question",
  includeColor: true,
});

const answerConfig = createStyledTextConfig({
  kind: "richText",
  label: "Answer",
  includeColor: true,
});

const fields: YextFields<CasualDiningFaqProps> = {
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
  faqs: {
    label: "FAQ Items",
    type: "object",
    objectFields: {
      data: faqItemsSource.field,
      styles: {
        label: "Shared Styles",
        type: "object",
        objectFields: {
          question: {
            label: "Question",
            type: "object",
            objectFields: {
              fontOptions: questionConfig.fields!.fontOptions,
            },
          },
          answer: {
            label: "Answer",
            type: "object",
            objectFields: {
              fontOptions: answerConfig.fields!.fontOptions,
            },
          },
        },
      },
    },
  },
};

const CasualDiningFaqComponent: PuckComponent<CasualDiningFaqProps> = (
  props,
) => {
  const streamDocument = useDocument<any>();
  const [openIndex, setOpenIndex] = React.useState(0);
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const resolvedFaqItems = faqItemsSource.resolveItems(
    props.faqs.data,
    streamDocument,
  );

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningFaq${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="faq-shell section-padding color-scheme-1"
            id="faq"
            style={sectionSurfaceStyle}
          >
            <div className="wrapper">
              <div className="faq-shell__intro">
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
                    />
                  </EntityField>
                </div>
              </div>
              <EntityField
                displayName="FAQ Items"
                fieldId={props.faqs.data.field}
                constantValueEnabled={props.faqs.data.constantValueEnabled}
              >
                <div className="accordion-group__items">
                  {resolvedFaqItems.map((item, index) => {
                    return (
                      <details
                        key={index}
                        className="accordion"
                        open={index === openIndex}
                        onToggle={(event) => {
                          if (
                            (event.currentTarget as HTMLDetailsElement).open
                          ) {
                            setOpenIndex(index);
                          }
                        }}
                      >
                        <summary className="accordion__title h4">
                          <StyledTextComponent
                            kind="plain"
                            {...props.faqs.styles.question}
                            data={{
                              text: {
                                field: "",
                                constantValue: item.question ?? "",
                                constantValueEnabled: true,
                              },
                            }}
                            tag="span"
                          />
                          <span
                            className="accordion__icon"
                            aria-hidden="true"
                          />
                        </summary>
                        <div className="accordion__content">
                          <StyledTextComponent
                            kind="richText"
                            {...props.faqs.styles.answer}
                            data={{
                              text: {
                                field: "",
                                constantValue: item.answer ?? getDefaultRTF(""),
                                constantValueEnabled: true,
                              },
                            }}
                          />
                        </div>
                      </details>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningFaq: YextComponentConfig<CasualDiningFaqProps> = {
  label: "FAQ",
  fields,
  defaultProps: {
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
    },
    heading: {
      ...headingConfig.defaultProps,
      data: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "FAQs about [[geomodifier]] [[name]]",
            hasLocalizedValue: "true" as const,
          },
          constantValueEnabled: true,
        },
      },
    } as StyledPlainTextProps,
    faqs: {
      data: faqItemsSource.defaultValue,
      styles: {
        question: {
          fontOptions: questionConfig.defaultProps!.fontOptions,
        },
        answer: {
          fontOptions: answerConfig.defaultProps!.fontOptions,
        },
      },
    },
  },
  render: (props) => <CasualDiningFaqComponent {...props} />,
};
