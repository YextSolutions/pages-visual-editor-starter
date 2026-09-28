import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { YextFields } from "@yext/visual-editor";
import {
  Background,
  createStyledTextConfig,
  EntityField,
  Image,
  getSurfaceColorStyle,
  getAnalyticsScopeHash,
  resolveComponentData,
  StyledTextComponent,
  ThemeOptions,
  useDocument,
  VisibilityWrapper,
  type StyledImageValue,
  type StyledPlainTextProps,
  type StyledRichTextProps,
  type ThemeColor,
  type YextComponentConfig,
  type YextEntityField,
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

.wrapper--full {
width: min(100%, calc(100% - (var(--outer) * 2)));
  margin: 0 auto;
}

.text-left {
text-align: left;
}

.body-medium,
.hero__rte {
font-size: var(--font-body-medium);
}

.hero__subheading {
margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.block-padding + .block-padding {
margin-top: 16px;
}

.section-padding {
padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
}

.color-scheme-5 {
background: var(--COLOR-BG);
  color: var(--COLOR-TEXT);
}

.color-scheme-5 {
background: var(--COLOR-BG-ACCENT);
}

.theme__header .section-padding {
padding-top: 15px;
  padding-bottom: 15px;
}

.brick__block__image {
position: relative;
  width: 100%;
}

.section-image {
display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__content {
position: relative;
  z-index: 1;
  color: inherit;
}

.hero__content--compact {
max-width: 700px;
}

.hero__content p {
margin-top: 0;
  margin-bottom: 0;
}

.hero__subheading {
margin-bottom: 12px;
  color: inherit;
  opacity: 0.82;
}

.hero__title {
margin: 14px 0 0;
  font-family: var(--font-heading);
  font-size: var(--font-heading-hero);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.story__title {
margin: 14px 0 0;
  font-family: var(--font-heading);
  font-size: 32px;
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.hero__subheading :where(h1, h2, h3, h4, h5, h6, div, span, p),
.story__title :where(h1, h2, h3, h4, h5, h6, div, span, p) {
margin: 0;
  font: inherit;
  letter-spacing: inherit;
}

.index-hero .hero__title {
font-size: clamp(3rem, 6.3vw, 5.5rem);
}

.hero__rte {
margin-top: 16px;
  max-width: 56ch;
  color: inherit;
  opacity: 0.88;
}

.hero__content--no-padding {
color: inherit;
}

.hero__content--no-padding .hero__rte {
color: inherit;
}

.brick__section {
display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 720px;
  align-items: stretch;
}

.brick__section--text-only {
grid-template-columns: 1fr;
  min-height: auto;
}

.brick__section--reversed .brick__block--images {
order: 2;
  align-self: start;
}

.brick__section--reversed .brick__block--text {
order: 1;
}

.brick__block {
position: relative;
  min-height: 100%;
  min-width: 0;
}

.brick__block__image {
min-height: 0;
  height: auto;
  min-width: 0;
}

.brick__block--text {
display: flex;
  align-items: center;
  background: inherit;
}

.brick__block--text-only .brick__block__text {
width: min(100%, 720px);
}

.brick__block__text {
width: min(100%, 600px);
  margin: 0 auto;
  padding: 64px;
  min-width: 0;
}

@media (max-width: 1439px) {
:root {
--outer: 24px;
    --gutter: 20px;
    --section-padding: 44px;
    --section-padding-large: 64px;
}

.hero__content {
max-width: 680px;
}

.brick__block__text {
width: min(100%, 560px);
    padding: 48px;
}
}

@media (max-width: 768px) {
.index-hero .hero__title {
font-size: clamp(2.4rem, 14vw, 3rem);
}

.brick__section {
grid-template-columns: 1fr;
}

.brick__section {
min-height: auto;
}

.brick__section--reversed .brick__block--images,
.brick__section--reversed .brick__block--text {
order: initial;
}

.brick__block__text {
width: 100%;
    max-width: none;
    padding: 40px 24px;
}
}

@media (min-width: 481px) and (max-width: 768px) {
.hero__content {
max-width: 620px;
}
}`;

const RootStyle = ({ children }: { children: React.ReactNode }) => (
  <div style={themeVars}>
    <style>{capturedStyles}</style>
    {children}
  </div>
);

type CasualDiningStoryProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  eyebrow: StyledPlainTextProps;
  heading: StyledPlainTextProps;
  sectionImage: {
    image: YextEntityField<any>;
    aspectRatio: number;
    imageConstrain: "fixed" | "filled";
    styles?: StyledImageValue;
  };
  content: StyledRichTextProps;
};

const eyebrowConfig = createStyledTextConfig({
  kind: "plain",
  label: "Eyebrow",
  includeColor: true,
});

const headingConfig = createStyledTextConfig({
  kind: "plain",
  label: "Heading",
  includeColor: true,
});

const contentConfig = createStyledTextConfig({
  kind: "richText",
  label: "Story Content",
  includeColor: true,
});

const fields: YextFields<CasualDiningStoryProps> = {
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
  eyebrow: {
    label: "Eyebrow",
    type: "object",
    objectFields: eyebrowConfig.fields!,
  },
  heading: {
    label: "Heading",
    type: "object",
    objectFields: headingConfig.fields!,
  },
  sectionImage: {
    label: "Section Image",
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
        options: ThemeOptions.ASPECT_RATIO,
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
  content: {
    label: "Story Content",
    type: "object",
    objectFields: contentConfig.fields!,
  },
};

const defaultContent: StyledRichTextProps = {
  ...contentConfig.defaultProps,
  data: {
    text: {
      field: "",
      constantValue: {
        defaultValue:
          "At [[name]], we believe great burgers start with great ingredients and a sense of place. Nestled in the heart of [[geomodifier]], our [[address.city]] burger restaurant brings together wood-fired flavor, chef-driven comfort food, and the laid-back energy that makes [[address.region]] unforgettable.\n\nWhether you’re grabbing brunch, meeting friends for happy hour after work downtown, or ordering takeout for a night in [[address.city]], [[name]] delivers a distinctly [[address.city]] experience rooted in quality and comfort.",
        hasLocalizedValue: "true" as const,
      },
      constantValueEnabled: true,
    },
  },
};

const CasualDiningStoryComponent: PuckComponent<CasualDiningStoryProps> = (
  props,
) => {
  const streamDocument = useDocument();
  const locale = streamDocument?.locale ?? "en";
  const sectionImageStyles = props.sectionImage?.styles ?? {
    borderRadius: "default",
  };
  const resolvedImage = resolveComponentData(
    props.sectionImage?.image,
    locale,
    streamDocument,
  ) as { url?: string } | undefined;
  const hasImage = Boolean(
    resolvedImage &&
    typeof resolvedImage === "object" &&
    "url" in resolvedImage &&
    resolvedImage.url,
  );
  const sectionImageWrapperStyle: React.CSSProperties = {
    aspectRatio:
      props.sectionImage.aspectRatio > 0 ? props.sectionImage.aspectRatio : undefined,
    height: "auto",
    overflow:
      props.sectionImage.imageConstrain === "filled" ||
      sectionImageStyles.borderRadius !== "default"
        ? "hidden"
        : undefined,
    borderRadius:
      sectionImageStyles.borderRadius === "default"
        ? undefined
        : sectionImageStyles.borderRadius,
  };
  const sectionImageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: props.sectionImage.aspectRatio > 0 ? "100%" : "auto",
    objectFit:
      props.sectionImage.imageConstrain === "filled" ? "cover" : "contain",
  };
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
    {
      fallbackBackgroundColor: "var(--colors-palette-tertiary)",
    },
  );

  return (
    <AnalyticsScopeProvider
      name={`CasualDiningStory${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <RootStyle>
          <Background
            as="section"
            background={props.section.backgroundColor}
            className="index-image-text section-padding text-left color-scheme-5"
            id="visit"
            style={sectionSurfaceStyle}
          >
            <div
              className={`brick__section brick__section--reversed wrapper--full${hasImage ? "" : " brick__section--text-only"}`}
            >
              {hasImage ? (
                <div className="brick__block brick__block--images">
                  <div className="brick__block__image">
                    <EntityField
                      displayName="Section Image"
                      fieldId={props.sectionImage.image.field}
                      constantValueEnabled={
                        props.sectionImage.image.constantValueEnabled
                      }
                      fullHeight
                    >
                      <div style={sectionImageWrapperStyle}>
                        <Image
                          image={resolvedImage as any}
                          className="section-image"
                          style={sectionImageStyle}
                        />
                      </div>
                    </EntityField>
                  </div>
                </div>
              ) : null}
              <div
                className={`brick__block brick__block--text${hasImage ? "" : " brick__block--text-only"}`}
              >
                <div className="brick__block__text">
                    <div className="hero__content hero__content--compact hero__content--no-padding">
                      <div className="hero__subheading block-padding">
                        <EntityField
                          displayName="Eyebrow"
                          fieldId={props.eyebrow.data.text.field}
                          constantValueEnabled={
                            props.eyebrow.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="plain"
                            {...props.eyebrow}
                            tag="p"
                          />
                        </EntityField>
                      </div>
                      <div className="story__title block-padding">
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
                      <div className="hero__rte body-medium block-padding">
                        <EntityField
                          displayName="Story Content"
                          fieldId={props.content.data.text.field}
                          constantValueEnabled={
                            props.content.data.text.constantValueEnabled
                          }
                        >
                          <StyledTextComponent
                            kind="richText"
                            {...props.content}
                          />
                        </EntityField>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </Background>
        </RootStyle>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const YextCasualDiningStory: YextComponentConfig<CasualDiningStoryProps> =
  {
    label: "Story",
    fields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "palette-tertiary",
          contrastingColor: "palette-tertiary-contrast",
        },
        visibleOnLivePage: true,
      },
      eyebrow: {
        ...eyebrowConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue: "What is [[name]]?",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledPlainTextProps,
      heading: {
        ...headingConfig.defaultProps,
        data: {
          text: {
            field: "",
            constantValue: {
              defaultValue:
                "A laid-back [[address.city]] burger spot built on quality, hospitality, and bold flavor.",
              hasLocalizedValue: "true" as const,
            },
            constantValueEnabled: true,
          },
        },
      } as StyledPlainTextProps,
      sectionImage: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
            alternateText: "Story image",
          },
          constantValueEnabled: true,
        },
        aspectRatio: 0.75,
        imageConstrain: "filled",
        styles: {
          borderRadius: "default",
        },
      },
      content: defaultContent,
    },
    render: (props) => <CasualDiningStoryComponent {...props} />,
  };
