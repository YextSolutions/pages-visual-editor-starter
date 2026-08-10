import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  Background,
  createItemSource,
  getAnalyticsScopeHash,
  getDefaultRTF,
  MaybeRTF,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  EntityField,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";

const yextCafeAndCoffeeShopStyles = String.raw`
p {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
li {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
h1 {
  font-family: var(--fontFamily-h1-fontFamily);
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h1-fontWeight);
  font-style: var(--fontStyle-h1-fontStyle);
  text-transform: var(--textTransform-h1-textTransform);
}
h2 {
  font-family: var(--fontFamily-h2-fontFamily);
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h2-fontWeight);
  font-style: var(--fontStyle-h2-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h3 {
  font-family: var(--fontFamily-h3-fontFamily);
  font-size: var(--fontSize-h3-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h3-fontWeight);
  font-style: var(--fontStyle-h3-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h4 {
  font-family: var(--fontFamily-h4-fontFamily);
  font-size: var(--fontSize-h4-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h4-fontWeight);
  font-style: var(--fontStyle-h4-fontStyle);
  text-transform: var(--textTransform-h4-textTransform);
}
h5 {
  font-family: var(--fontFamily-h5-fontFamily);
  font-size: var(--fontSize-h5-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h5-fontWeight);
  font-style: var(--fontStyle-h5-fontStyle);
  text-transform: var(--textTransform-h5-textTransform);
}
h6 {
  font-family: var(--fontFamily-h6-fontFamily);
  font-size: var(--fontSize-h6-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h6-fontWeight);
  font-style: var(--fontStyle-h6-fontStyle);
  text-transform: var(--textTransform-h6-textTransform);
}
a, button {
  font-family: var(--fontFamily-link-fontFamily);
  font-size: var(--fontSize-link-fontSize);
  font-weight: var(--fontWeight-link-fontWeight);
  font-style: var(--fontStyle-link-fontStyle);
  line-height: 1.5;
  text-decoration: underline;
  text-transform: var(--textTransform-link-textTransform);
  letter-spacing: var(--letterSpacing-link-letterSpacing);
}
#faqs-section,
#faqs-section * {
  box-sizing: border-box;
}

#faqs-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  min-height: 0 !important;
  height: auto !important;
  margin-bottom: 0 !important;
  background: var(--cr-faq-bg, #be865c);
}

#faqs-section .faqs__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#faqs-section .faqs__heading {
  margin: 0 0 2rem;
  text-align: center;
  color: var(--cr-faq-heading);
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.08;
  font-weight: 700;
}

#faqs-section .faqs__list {
  border: 2px solid rgba(88, 61, 40, 0.42);
  border-radius: 32px;
  overflow: hidden;
  background: transparent;
}

#faqs-section .faqs__item {
  border-top: 1px solid rgba(88, 61, 40, 0.42);
  transition:
    background-color 0.28s ease,
    border-color 0.28s ease;
  overflow: hidden;
}

#faqs-section .faqs__item:first-child {
  border-top: 0;
}

#faqs-section .faqs__trigger {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  padding: clamp(1.15rem, 1.8vw, 1.5rem) clamp(1.15rem, 2.2vw, 2rem) clamp(1.15rem, 1.8vw, 1.5rem) clamp(2.65rem, 3.4vw, 3rem);
  position: relative;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.2;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.28s ease;
}

#faqs-section .faqs__label {
  display: block;
}

#faqs-section .faqs__icon {
  position: absolute;
  left: clamp(1rem, 1.3vw, 1.15rem);
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
}

#faqs-section .faqs__icon::before,
#faqs-section .faqs__icon::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  opacity: 0.7;
  transform: translateY(-50%);
}

#faqs-section .faqs__icon::after {
  transform: translateY(-50%) rotate(90deg);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__icon::after {
  transform: translateY(-50%) rotate(0);
}

#faqs-section .faqs__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__panel {
  grid-template-rows: 1fr;
}

#faqs-section .faqs__panel-inner {
  min-height: 0;
  overflow: hidden;
}

#faqs-section .faqs__answer {
  padding: 0 clamp(1.15rem, 2.2vw, 2rem) 0 clamp(2.65rem, 3.4vw, 3rem);
  opacity: 0;
  transform: translateY(-6px);
  transition:
    padding 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__answer {
  padding: 0 clamp(1.15rem, 2.2vw, 2rem) clamp(1.15rem, 1.8vw, 1.5rem) clamp(2.65rem, 3.4vw, 3rem);
  opacity: 1;
  transform: translateY(0);
}

#faqs-section .faqs__answer > :first-child {
  margin-top: 0;
}

#faqs-section .faqs__answer > :last-child {
  margin-bottom: 0;
}

#faqs-section .faqs__answer p,
#faqs-section .faqs__answer li {
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
}

#faqs-section + .local-section-group-footer-group {
  margin-top: 0 !important;
}

@media (max-width: 1023px) {
  #faqs-section .faqs__wrap {
    padding-inline: 30px;
  }

  #faqs-section .faqs__heading {
    text-align: left;
  }
}

@media (max-width: 700px) {
  #faqs-section .faqs__wrap {
    padding-inline: 14px;
  }
}`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

const createTranslatableString = (text: string): TranslatableString => ({
  defaultValue: text,
  hasLocalizedValue: "true",
});

const createTextField = (
  text: string,
  field = "",
): YextEntityField<TranslatableString> => ({
  field,
  constantValue: createTranslatableString(text),
  constantValueEnabled: field.length === 0,
});

const createRtfField = (
  text: string,
  field = "",
): YextEntityField<TranslatableRichText> => ({
  field,
  constantValue: {
    defaultValue: getDefaultRTF(text),
    hasLocalizedValue: "true",
  },
  constantValueEnabled: field.length === 0,
});

type FaqItemProps = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

type TextAppearance = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

const faqSource = createItemSource<FaqItemProps>({
  label: "FAQs",
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
  defaultValues: [
    {
      question: createTextField(
        "Are your dining hours the same as takeout hours?",
      ),
      answer: createRtfField(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat interdum ante, eu convallis nibh feugiat a. Suspendisse potenti.",
      ),
    },
    {
      question: createTextField("Can I order online?"),
      answer: createRtfField(
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nulla facilisi.",
      ),
    },
    {
      question: createTextField("Do you take reservations?"),
      answer: createRtfField(
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
      ),
    },
    {
      question: createTextField("Do you offer vegetarian options?"),
      answer: createRtfField(
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Mauris porta lorem ut felis fermentum.",
      ),
    },
  ],
});

type FaqStyles = {
  backgroundColor: ThemeColor;
  question: TextAppearance;
  answer: TextAppearance;
};

export type YextCafeAndCoffeeShopFaqProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  content: {
    faqs: typeof faqSource.value;
    styles: FaqStyles;
  };
};

const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const createStyledText = (
  text: string,
  fontColor: ThemeColor | undefined = undefined,
): StyledTextProps => ({
  text: createTextField(text),
  styles: defaultTextStyles,
  fontColor,
});

const createTextAppearance = (): TextAppearance => ({
  styles: defaultTextStyles,
  fontColor: undefined,
});

const resolveTranslatableStringValue = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallback = "",
) =>
  value
    ? resolveComponentData(value, locale, streamDocument)?.trim() || fallback
    : fallback;

const resolveTextFieldValue = (
  field: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallback = "",
) => {
  const resolved = resolveComponentData(field, locale, streamDocument)?.trim();
  return (
    resolved ||
    resolveTranslatableStringValue(
      field.constantValue,
      locale,
      streamDocument,
      fallback,
    )
  );
};

const toThemeCss = (token?: string) => {
  if (!token) {
    return undefined;
  }

  if (token.startsWith("[") && token.endsWith("]")) {
    return token.slice(1, -1);
  }

  if (token === "white") {
    return "#ffffff";
  }

  if (token === "black") {
    return "#000000";
  }

  if (token.endsWith("-light")) {
    return `hsl(from var(--colors-${token.replace("-light", "")}) h s 98)`;
  }

  if (token.endsWith("-dark")) {
    return `hsl(from var(--colors-${token.replace("-dark", "")}) h s 20)`;
  }

  if (token.startsWith("palette-")) {
    return `var(--colors-${token})`;
  }

  return token;
};

const getStyleValue = (value: string) =>
  value === "default" || value.length === 0 ? undefined : value;

const getTextStyles = (
  value: TextAppearance,
  fallbackColor?: string,
): React.CSSProperties => ({
  color: toThemeCss(value.fontColor?.selectedColor) ?? fallbackColor,
  fontFamily: getStyleValue(value.styles.fontFamily),
  fontSize: getStyleValue(value.styles.fontSize),
  fontWeight: getStyleValue(value.styles.fontWeight),
  fontStyle: getStyleValue(value.styles.fontStyle),
  textTransform: getStyleValue(value.styles.textTransform),
});

const createStyledTextFields = (): YextFields<StyledTextProps> => ({
  text: {
    label: "Text",
    type: "entityField",
    filter: {
      types: ["type.string"],
    },
    disableConstantValueToggle: false,
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
});

const createTextAppearanceFields = (): YextFields<TextAppearance> => ({
  styles: {
    label: "Text Styles",
    type: "styledText",
  },
  fontColor: {
    label: "Font Color",
    type: "basicSelector",
    options: "SITE_COLOR",
  },
});

const headingFields = createStyledTextFields();
const faqTextFields = createTextAppearanceFields();

export const YextCafeAndCoffeeShopFaqFields: YextFields<YextCafeAndCoffeeShopFaqProps> =
  {
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
      objectFields: headingFields,
    },
    content: {
      label: "Content",
      type: "object",
      objectFields: {
        faqs: {
          label: "FAQs",
          ...faqSource.field,
        },
        styles: {
          label: "Styles",
          type: "object",
          objectFields: {
            backgroundColor: {
              label: "Background Color",
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            question: {
              label: "Question",
              type: "object",
              objectFields: faqTextFields,
            },
            answer: {
              label: "Answer",
              type: "object",
              objectFields: faqTextFields,
            },
          },
        },
      },
    },
  };

export const YextCafeAndCoffeeShopFaqDefaultProps: YextCafeAndCoffeeShopFaqProps =
  {
    section: {
      visibleOnLivePage: true,
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
    },
    heading: createStyledText("FAQs", undefined),
    content: {
      faqs: faqSource.defaultValue,
      styles: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        question: createTextAppearance(),
        answer: createTextAppearance(),
      },
    },
  };

const YextCafeAndCoffeeShopFaqComponent: PuckComponent<
  YextCafeAndCoffeeShopFaqProps
> = (props) => {
  const [openIndex, setOpenIndex] = React.useState(0);
  const streamDocument = useDocument<StreamDocument>();
  const locale = streamDocument?.locale ?? "en";
  const resolvedFaqs = faqSource.resolveItems(
    props.content.faqs,
    streamDocument,
  );
  const sectionForeground = toThemeCss(
    props.section.backgroundColor.contrastingColor,
  );

  const wrapperStyle: React.CSSProperties &
    Record<"--cr-faq-bg" | "--cr-faq-heading", string | undefined> = {
    "--cr-faq-bg": toThemeCss(props.section.backgroundColor.selectedColor),
    "--cr-faq-heading":
      toThemeCss(props.heading.fontColor?.selectedColor) ?? sectionForeground,
  };

  const accordionBackgroundColor = toThemeCss(
    props.content.styles.backgroundColor.selectedColor,
  );
  const accordionForeground =
    toThemeCss(props.content.styles.backgroundColor.contrastingColor) ??
    sectionForeground;

  const questionStyle = getTextStyles(
    props.content.styles.question,
    accordionForeground,
  );
  const answerStyle = getTextStyles(
    props.content.styles.answer,
    accordionForeground,
  );

  return (
    <AnalyticsScopeProvider
      name={`YextCafeAndCoffeeShopFaq${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={wrapperStyle}
        >
          <style>{yextCafeAndCoffeeShopStyles}</style>
          <Background
            id="faqs-section"
            className="local-section section-faqs"
            aria-label="FAQs"
            background={props.section.backgroundColor}
          >
            <div className="faqs__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="faqs__heading"
                  style={getTextStyles(props.heading, sectionForeground)}
                >
                  {resolveTextFieldValue(
                    props.heading.text,
                    locale,
                    streamDocument,
                  )}
                </h2>
              </EntityField>
              <EntityField
                displayName="FAQs"
                fieldId={props.content.faqs.field}
                constantValueEnabled={props.content.faqs.constantValueEnabled}
              >
                <div
                  className="faqs__list"
                  style={{
                    borderColor: accordionForeground,
                  }}
                >
                  {resolvedFaqs.map((item, index) => {
                    const isOpen = openIndex === index;
                    const questionText = resolveTranslatableStringValue(
                      item.question,
                      locale,
                      streamDocument,
                    );
                    const answerRichTextStyleOverrides = {
                      ...props.content.styles.answer.styles,
                      color: answerStyle.color,
                    };
                    const resolvedAnswer = item.answer
                      ? resolveComponentData(
                          item.answer,
                          locale,
                          streamDocument,
                          {
                            richTextStyleOverrides:
                              answerRichTextStyleOverrides,
                          },
                        )
                      : undefined;

                    return (
                      <article
                        key={`${questionText || "faq"}-${index}`}
                        className={`faqs__item${isOpen ? " is-open" : ""}`}
                        style={{
                          backgroundColor: accordionBackgroundColor,
                          borderColor: accordionForeground,
                          color: accordionForeground,
                        }}
                      >
                        <button
                          className="faqs__trigger"
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenIndex(isOpen ? -1 : index)}
                          style={questionStyle}
                        >
                          <span className="faqs__label">{questionText}</span>
                          <span
                            className="faqs__icon"
                            aria-hidden="true"
                            style={{ color: accordionForeground }}
                          />
                        </button>
                        <div className="faqs__panel">
                          <div className="faqs__panel-inner">
                            <div className="faqs__answer" style={answerStyle}>
                              {React.isValidElement(resolvedAnswer) ? (
                                resolvedAnswer
                              ) : typeof resolvedAnswer === "string" ? (
                                <MaybeRTF
                                  data={resolvedAnswer}
                                  richTextStyleOverrides={
                                    answerRichTextStyleOverrides
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCafeAndCoffeeShopFaq: YextComponentConfig<YextCafeAndCoffeeShopFaqProps> =
  {
    label: "FAQ",
    fields: YextCafeAndCoffeeShopFaqFields,
    defaultProps: YextCafeAndCoffeeShopFaqDefaultProps,
    render: (props) => <YextCafeAndCoffeeShopFaqComponent {...props} />,
  };
