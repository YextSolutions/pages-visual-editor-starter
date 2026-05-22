import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import {
  getAnalyticsScopeHash,
  MapboxStaticMapComponent,
  VisibilityWrapper,
  YextComponentConfig,
  YextFields,
  mapboxStaticMapStyleOptions,
  useDocument,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import {
  resolveComponentData as resolveComponentDataFromVisualEditor,
  resolveLocalizedAssetImage as resolveLocalizedAssetImageFromVisualEditor,
  type EnhancedTranslatableCTA as EnhancedTranslatableCTAFromVisualEditor,
  type StyledButtonValue as StyledButtonValueFromVisualEditor,
  type StyledImageValue as StyledImageValueFromVisualEditor,
  type StyledLinkValue as StyledLinkValueFromVisualEditor,
  type StyledTextValue as StyledTextValueFromVisualEditor,
  type ThemeColor as ThemeColorFromVisualEditor,
  type TranslatableAssetImage as TranslatableAssetImageFromVisualEditor,
  type TranslatableString as TranslatableStringFromVisualEditor,
  type YextCTAField as YextCTAFieldFromVisualEditor,
  type YextEntityField as YextEntityFieldFromVisualEditor,
} from "@yext/visual-editor";

type ThemeColorValue = ThemeColorFromVisualEditor;
type EditableMappedText = {
  constantValue: TranslatableStringFromVisualEditor;
  mappedField?: YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor>;
};
type EditableText =
  | EditableMappedText
  | TranslatableStringFromVisualEditor
  | YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor>;
type EditableLink = {
  label: EditableText;
  href: EditableText;
  ariaLabel?: EditableText;
  openInNewTab?: boolean;
};
type EditableCta = EditableLink | YextCTAFieldFromVisualEditor;
type EditableImage = TranslatableAssetImageFromVisualEditor | undefined;
type SectionTheme = {
  backgroundColor: ThemeColorValue;
  backgroundImage?: EditableImage;
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  accentTextColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
  buttonTextColor?: ThemeColorValue;
  visibleOnLivePage: boolean;
};
type ButtonTheme = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  hoverBorderColor: string;
  activeBackgroundColor: string;
  activeTextColor: string;
  activeBorderColor: string;
};

const defaultTextStyle: StyledTextValueFromVisualEditor = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

const defaultLinkStyle: StyledLinkValueFromVisualEditor = {
  ...defaultTextStyle,
  includeCaret: "default",
  letterSpacing: "default",
};

const defaultButtonStyle: StyledButtonValueFromVisualEditor = {
  ...defaultTextStyle,
  borderRadius: "default",
  letterSpacing: "default",
};

const defaultImageStyle: StyledImageValueFromVisualEditor = {
  borderRadius: "default",
};

const defaultPrimaryButtonTheme: ButtonTheme = {
  backgroundColor: "#000000",
  textColor: "#ffffff",
  borderColor: "#000000",
  hoverBackgroundColor: "#111827",
  hoverTextColor: "#ffffff",
  hoverBorderColor: "#111827",
  activeBackgroundColor: "#374151",
  activeTextColor: "#ffffff",
  activeBorderColor: "#374151",
};

const defaultSecondaryButtonTheme: ButtonTheme = {
  backgroundColor: "#ffffff",
  textColor: "#202020",
  borderColor: "#ffffff",
  hoverBackgroundColor: "#f3f4f6",
  hoverTextColor: "#111827",
  hoverBorderColor: "#f3f4f6",
  activeBackgroundColor: "#e5e7eb",
  activeTextColor: "#111827",
  activeBorderColor: "#e5e7eb",
};

const createDefaultImage = (
  url: string,
  alternateText?: EditableText,
): EditableImage => {
  return {
    url,
    width: 0,
    height: 0,
    alternateText,
  } as unknown as EditableImage;
};

const createCapturedAssetUrl = (filename: string) => {
  return `/src/registry/yext-deep-current/.captured-artifact/assets/${filename}`;
};

const createEditableText = (
  constantValue: string,
  field = "",
): YextEntityFieldFromVisualEditor<TranslatableStringFromVisualEditor> => {
  return {
    field,
    constantValue,
    constantValueEnabled: true,
  };
};

const createEditableLink = (
  label: string,
  href = "#",
  ariaLabel?: string,
): YextCTAFieldFromVisualEditor => {
  return {
    field: "",
    constantValue: {
      label,
      link: href,
      linkType: "URL",
      ...(ariaLabel ? { ariaLabel } : {}),
    },
    constantValueEnabled: true,
  };
};

const createEditableTextField = (label: string) => {
  return {
    type: "entityField" as const,
    label,
    filter: { types: ["type.string"] as any },
  };
};

const createEditableLinkField = (
  label: string,
  _includeAriaLabel = false,
) => {
  return {
    type: "ctaSelector" as const,
    label,
  };
};

const createButtonThemeFields = (label: string) => {
  return {
    type: "object" as const,
    label,
    objectFields: {
      backgroundColor: { type: "text" as const, label: "Background Color" },
      textColor: { type: "text" as const, label: "Text Color" },
      borderColor: { type: "text" as const, label: "Border Color" },
      hoverBackgroundColor: {
        type: "text" as const,
        label: "Hover Background Color",
      },
      hoverTextColor: { type: "text" as const, label: "Hover Text Color" },
      hoverBorderColor: { type: "text" as const, label: "Hover Border Color" },
      activeBackgroundColor: {
        type: "text" as const,
        label: "Active Background Color",
      },
      activeTextColor: { type: "text" as const, label: "Active Text Color" },
      activeBorderColor: {
        type: "text" as const,
        label: "Active Border Color",
      },
    },
  };
};

const createSectionThemeFields = () => {
  return {
    backgroundColor: {
      label: "Background Color",
      type: "basicSelector" as const,
      options: "BACKGROUND_COLOR" as const,
    },
    backgroundImage: {
      type: "image" as const,
      label: "Background Image",
    },
    visibleOnLivePage: {
      label: "Visible on Live Page",
      type: "radio" as const,
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  };
};

const isDefaultToken = (value?: string) => {
  return !value || value === "default";
};

const resolveThemeColor = (
  color?: ThemeColorValue,
  fallback = "#ffffff",
) => {
  const selected = color?.selectedColor;
  if (!selected) {
    return fallback;
  }

  if (selected === "white") {
    return "#ffffff";
  }

  if (selected === "black") {
    return "#000000";
  }

  if (selected.startsWith("[") && selected.endsWith("]")) {
    return selected.slice(1, -1);
  }

  return `var(--colors-${selected})`;
};

const resolveSectionStyles = (
  section: SectionTheme,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallbackColor = "#ffffff",
): CSSProperties => {
  const backgroundImage = resolveImageData(
    section.backgroundImage,
    locale,
    streamDocument,
  );

  return {
    backgroundColor: resolveThemeColor(section.backgroundColor, fallbackColor),
    backgroundImage: backgroundImage.src ? `url(${backgroundImage.src})` : undefined,
    backgroundPosition: backgroundImage.src ? "center" : undefined,
    backgroundRepeat: backgroundImage.src ? "no-repeat" : undefined,
    backgroundSize: backgroundImage.src ? "cover" : undefined,
  };
};

const resolveSectionTextColors = (
  section: SectionTheme,
  defaults: {
    headingTextColor: string;
    bodyTextColor: string;
    accentTextColor?: string;
    linkTextColor?: string;
    buttonTextColor?: string;
  },
) => {
  const headingTextColor = resolveThemeColor(
    section.headingTextColor,
    defaults.headingTextColor,
  );
  const bodyTextColor = resolveThemeColor(
    section.bodyTextColor,
    defaults.bodyTextColor,
  );
  const accentTextColor = resolveThemeColor(
    section.accentTextColor,
    defaults.accentTextColor ?? defaults.headingTextColor,
  );
  const linkTextColor = resolveThemeColor(
    section.linkTextColor,
    defaults.linkTextColor ?? accentTextColor,
  );
  const buttonTextColor = resolveThemeColor(
    section.buttonTextColor,
    defaults.buttonTextColor ?? linkTextColor,
  );

  return {
    headingTextColor,
    bodyTextColor,
    accentTextColor,
    linkTextColor,
    buttonTextColor,
  };
};

const resolveText = (
  value: EditableText | undefined,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallback = "",
): string => {
  if (!value) {
    return fallback;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "constantValue" in value &&
    "mappedField" in value
  ) {
    const mappedField = (value as EditableMappedText).mappedField;

    if (mappedField?.field) {
      const mappedValue = resolveComponentDataFromVisualEditor(
        {
          ...mappedField,
          constantValueEnabled: false,
        } as any,
        locale,
        streamDocument as any,
        { output: "plainText" },
      );

      if (typeof mappedValue === "string" && mappedValue.trim().length > 0) {
        return mappedValue;
      }

      if (
        mappedValue &&
        typeof mappedValue === "object" &&
        "defaultValue" in mappedValue
      ) {
        const defaultValue = (mappedValue as Record<string, unknown>).defaultValue;
        if (typeof defaultValue === "string" && defaultValue.trim().length > 0) {
          return defaultValue;
        }
      }
    }

    return resolveText(
      (value as EditableMappedText).constantValue,
      locale,
      streamDocument,
      fallback,
    );
  }

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
    { output: "plainText" },
  );

  if (typeof resolved === "string") {
    return resolved;
  }

  if (resolved && typeof resolved === "object" && "defaultValue" in resolved) {
    const defaultValue = (resolved as Record<string, unknown>).defaultValue;
    return typeof defaultValue === "string" ? defaultValue : fallback;
  }

  return fallback;
};

const resolveCta = (
  value: EditableCta | undefined,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "object" && value !== null && "href" in value) {
    return {
      ariaLabel: resolveText(
        (value as EditableLink).ariaLabel,
        locale,
        streamDocument,
      ),
      label: resolveText(
        (value as EditableLink).label,
        locale,
        streamDocument,
      ),
      link: resolveText(
        (value as EditableLink).href,
        locale,
        streamDocument,
      ),
      openInNewTab: Boolean((value as EditableLink).openInNewTab),
    };
  }

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
  ) as unknown as EnhancedTranslatableCTAFromVisualEditor | undefined;

  if (!resolved) {
    return undefined;
  }

  const label = resolveText(
    resolved.label as EditableText | undefined,
    locale,
    streamDocument,
  );
  const link = resolveText(
    resolved.link as EditableText | undefined,
    locale,
    streamDocument,
  );

  return {
    ...resolved,
    label,
    link,
  };
};

const buttonThemeToCss = (theme: ButtonTheme): CSSProperties => {
  return {
    backgroundColor: theme.backgroundColor,
    borderColor: theme.borderColor,
    color: theme.textColor,
  };
};

const buttonThemeToStylesheet = (
  className: string,
  theme: ButtonTheme,
) => {
  return `
.${className} {
  background-color: ${theme.backgroundColor};
  border-color: ${theme.borderColor};
  color: ${theme.textColor};
}
.${className}:hover {
  background-color: ${theme.hoverBackgroundColor};
  border-color: ${theme.hoverBorderColor};
  color: ${theme.hoverTextColor};
}
.${className}:active {
  background-color: ${theme.activeBackgroundColor};
  border-color: ${theme.activeBorderColor};
  color: ${theme.activeTextColor};
}
`;
};

const resolveImageData = (
  value: EditableImage,
  locale: string,
  streamDocument: Record<string, unknown> | undefined,
  fallbackUrl = "",
  fallbackAlt = "",
) => {
  const normalizeAssetUrl = (url?: string) => {
    if (!url) {
      return url;
    }

    if (!url.startsWith("file://")) {
      return url;
    }

    try {
      const fileUrl = new URL(url);
      const srcIndex = fileUrl.pathname.indexOf("/src/");
      if (srcIndex === -1) {
        return url;
      }

      return encodeURI(fileUrl.pathname.slice(srcIndex));
    } catch {
      return url;
    }
  };

  const resolved = resolveComponentDataFromVisualEditor(
    value as any,
    locale,
    streamDocument as any,
  ) as unknown as TranslatableAssetImageFromVisualEditor | undefined;
  const localizedImage = resolveLocalizedAssetImageFromVisualEditor(
    resolved ?? value,
    locale,
  );
  const alt = resolveText(
    localizedImage?.alternateText,
    locale,
    streamDocument,
    localizedImage?.assetImage?.altText || fallbackAlt,
  );

  return {
    alt,
    src: normalizeAssetUrl(
      localizedImage?.assetImage?.transformedImage?.url ||
        localizedImage?.assetImage?.originalImage?.url ||
        localizedImage?.assetImage?.sourceUrl ||
        localizedImage?.url ||
        fallbackUrl,
    ),
  };
};

const textStyleToCss = (
  styles?: Partial<StyledTextValueFromVisualEditor>,
): CSSProperties => {
  return {
    fontFamily: isDefaultToken(styles?.fontFamily)
      ? undefined
      : styles?.fontFamily,
    fontSize: isDefaultToken(styles?.fontSize) ? undefined : styles?.fontSize,
    fontWeight: isDefaultToken(styles?.fontWeight)
      ? undefined
      : styles?.fontWeight,
    fontStyle: isDefaultToken(styles?.fontStyle) ? undefined : styles?.fontStyle,
    textTransform: isDefaultToken(styles?.textTransform)
      ? undefined
      : styles?.textTransform,
  };
};

const linkStyleToCss = (
  styles?: Partial<StyledLinkValueFromVisualEditor>,
): CSSProperties => {
  return {
    ...textStyleToCss(styles),
    letterSpacing: isDefaultToken(styles?.letterSpacing)
      ? undefined
      : styles?.letterSpacing,
  };
};

const buttonStyleToCss = (
  styles?: Partial<StyledButtonValueFromVisualEditor>,
): CSSProperties => {
  return {
    ...textStyleToCss(styles),
    borderRadius: isDefaultToken(styles?.borderRadius)
      ? undefined
      : styles?.borderRadius,
    letterSpacing: isDefaultToken(styles?.letterSpacing)
      ? undefined
      : styles?.letterSpacing,
  };
};

const imageStyleToCss = (
  styles?: Partial<StyledImageValueFromVisualEditor>,
): CSSProperties => {
  return {
    borderRadius: isDefaultToken(styles?.borderRadius)
      ? undefined
      : styles?.borderRadius,
  };
};


type CoordinateField = {
  field: string;
  constantValue: {
    latitude: number;
    longitude: number;
  };
  constantValueEnabled?: boolean;
};

type NearbyCard = {
  name: EditableText;
  addressLineOne: EditableText;
  addressLineTwo: EditableText;
  phone: EditableText;
  distance: EditableText;
  cta: EditableCta;
};

type NearbyLocationsContent = {
  sectionHeading: EditableText;
  sectionDescription: EditableText;
  cards: NearbyCard[];
};

type NearbyLocationsMap = {
  mapboxApiKey: string;
  mapStyle: string;
  mapHeight: string;
  mapZoom: number;
  coordinate: CoordinateField;
};

type NearbyLocationsStyles = {
  headingTextColor?: ThemeColorValue;
  bodyTextColor?: ThemeColorValue;
  cardTitleColor?: ThemeColorValue;
  linkTextColor?: ThemeColorValue;
  headingStyle: typeof defaultTextStyle;
  bodyStyle: typeof defaultTextStyle;
  cardTitleStyle: typeof defaultTextStyle;
  linkStyle: typeof defaultLinkStyle;
};

type YextDeepCurrentNearbyLocationsProps = {
  section: SectionTheme;
  content?: NearbyLocationsContent;
  map?: NearbyLocationsMap;
  styles?: NearbyLocationsStyles;
  sectionHeading?: EditableText;
  sectionDescription?: EditableText;
  mapboxApiKey?: string;
  mapStyle?: string;
  mapHeight?: string;
  mapZoom?: number;
  coordinate?: CoordinateField;
  cards?: NearbyCard[];
  headingStyle?: typeof defaultTextStyle;
  bodyStyle?: typeof defaultTextStyle;
  cardTitleStyle?: typeof defaultTextStyle;
  linkStyle?: typeof defaultLinkStyle;
};

const SectionFields: YextFields<YextDeepCurrentNearbyLocationsProps> = {
  section: {
    label: "Section",
    type: "object",
    objectFields: createSectionThemeFields(),
  },
  content: {
    label: "Content",
    type: "object",
    objectFields: {
      sectionHeading: createEditableTextField("Heading"),
      sectionDescription: createEditableTextField("Description"),
      cards: {
        type: "array",
        label: "Nearby Location Cards",
        defaultItemProps: {
          name: createEditableText("Location name"),
          addressLineOne: createEditableText("Address line one"),
          addressLineTwo: createEditableText("Address line two"),
          phone: createEditableText("Phone number"),
          distance: createEditableText("Distance text"),
          cta: createEditableLink("Get directions", "#"),
        },
        arrayFields: {
          name: createEditableTextField("Name"),
          addressLineOne: createEditableTextField("Address Line One"),
          addressLineTwo: createEditableTextField("Address Line Two"),
          phone: createEditableTextField("Phone"),
          distance: createEditableTextField("Distance"),
          cta: createEditableLinkField("CTA"),
        },
      },
    },
  },
  map: {
    label: "Map",
    type: "object",
    objectFields: {
      mapboxApiKey: {
        type: "text",
        label: "Mapbox API Key",
      },
      mapStyle: {
        type: "select",
        label: "Map Style",
        options: mapboxStaticMapStyleOptions,
      },
      mapHeight: {
        type: "text",
        label: "Map Height",
      },
      mapZoom: {
        type: "number",
        label: "Map Zoom",
      },
      coordinate: {
        type: "entityField",
        label: "Map Coordinate",
        filter: { types: ["type.coordinate"] },
      },
    },
  },
  styles: {
    label: "Style",
    type: "object",
    objectFields: {
      headingTextColor: {
        type: "basicSelector",
        label: "Heading Text Color",
        options: "SITE_COLOR",
      },
      bodyTextColor: {
        type: "basicSelector",
        label: "Body Text Color",
        options: "SITE_COLOR",
      },
      cardTitleColor: {
        type: "basicSelector",
        label: "Card Title Color",
        options: "SITE_COLOR",
      },
      linkTextColor: {
        type: "basicSelector",
        label: "Link Text Color",
        options: "SITE_COLOR",
      },
      headingStyle: {
        type: "styledText",
        label: "Heading Style",
        visible: false,
      },
      bodyStyle: {
        type: "styledText",
        label: "Body Style",
        visible: false,
      },
      cardTitleStyle: {
        type: "styledText",
        label: "Card Title Style",
        visible: false,
      },
      linkStyle: {
        type: "styledLink",
        label: "Link Style",
        visible: false,
      },
    },
  },
};

export const YextDeepCurrentNearbyLocationsComponent: PuckComponent<YextDeepCurrentNearbyLocationsProps> =
  (props) => {
    const { i18n } = useTranslation();
    const streamDocument = useDocument() as Record<string, any> | undefined;
    const locale = i18n.language;
    const content = props.content;
    const styles = props.styles;
    const map = props.map;
    const sectionStyles = resolveSectionStyles(
      props.section,
      locale,
      streamDocument,
      "#ffffff",
    );
    const headingTextColor = resolveThemeColor(styles?.headingTextColor, "#1a1a1a");
    const bodyTextColor = resolveThemeColor(styles?.bodyTextColor, "#676767");
    const cardTitleColor = resolveThemeColor(
      styles?.cardTitleColor,
      headingTextColor,
    );
    const linkTextColor = resolveThemeColor(styles?.linkTextColor, "#202020");
    const fallbackApiKey =
      streamDocument?._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY ||
      streamDocument?._env?.YEXT_MAPBOX_API_KEY ||
      "";
    const mapboxApiKey = map?.mapboxApiKey ?? props.mapboxApiKey ?? fallbackApiKey;
    const mapStyle = map?.mapStyle ?? props.mapStyle ?? "mapbox://styles/mapbox/streets-v12";
    const mapHeight = map?.mapHeight ?? props.mapHeight ?? "420px";
    const mapZoom = map?.mapZoom ?? props.mapZoom ?? 12;
    const coordinate = map?.coordinate ?? props.coordinate;
    const cards = content?.cards ?? props.cards ?? [];
    const headingStyle = styles?.headingStyle ?? props.headingStyle ?? defaultTextStyle;
    const bodyStyle = styles?.bodyStyle ?? props.bodyStyle ?? defaultTextStyle;
    const cardTitleStyle =
      styles?.cardTitleStyle ?? props.cardTitleStyle ?? defaultTextStyle;
    const linkStyle = styles?.linkStyle ?? props.linkStyle ?? defaultLinkStyle;

    return (
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={props.puck.isEditing}
      >
        <AnalyticsScopeProvider
          name={`YextDeepCurrentNearbyLocations${getAnalyticsScopeHash(props.id)}`}
        >
          <section
            id="nearby-locations"
            className="overflow-x-clip py-11"
            style={sectionStyles}
          >
            <div className="mx-auto max-w-[1410px] px-6">
              <div className="mx-auto mb-8 max-w-[980px] text-center">
                <h2
                  className="text-[2.2rem] font-bold tracking-[-0.04em]"
                  style={{
                    color: headingTextColor,
                    ...textStyleToCss(headingStyle),
                  }}
                >
                  {resolveText(
                    content?.sectionHeading ?? props.sectionHeading,
                    locale,
                    streamDocument,
                    "Nearby Locations",
                  )}
                </h2>
                <p
                  className="mt-3 text-sm"
                  style={{
                    color: bodyTextColor,
                    ...textStyleToCss(bodyStyle),
                  }}
                >
                  {resolveText(
                    content?.sectionDescription ?? props.sectionDescription,
                    locale,
                    streamDocument,
                    "Explore nearby Charlotte-area offices for wealth management, retirement planning, and advisory conversations.",
                  )}
                </p>
              </div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.95fr)] lg:items-stretch">
                <div className="h-full min-h-[420px] overflow-hidden rounded-[16px] border border-black/5 bg-white shadow-[0_6px_22px_rgba(9,30,66,0.08)]">
                  {mapboxApiKey && coordinate ? (
                    <MapboxStaticMapComponent
                      apiKey={mapboxApiKey}
                      coordinate={coordinate as any}
                      height="100%"
                      id={`${props.id}-map`}
                      mapStyle={mapStyle}
                      puck={props.puck}
                      zoom={mapZoom}
                    />
                  ) : (
                    <div
                      className="flex h-full min-h-[420px] items-center justify-center px-6 text-center text-sm"
                      style={{ color: bodyTextColor }}
                    >
                      <span>
                        Add a Mapbox API key in this component or via{" "}
                        <code>YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY</code> to render the map.
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid gap-5">
                  {cards.map((card, index) => {
                    const resolvedCta = resolveCta(card.cta, locale, streamDocument);

                    return (
                      <article
                        key={`${resolveText(card.name, locale, streamDocument, `location-${index}`)}-${index}`}
                        className="flex min-w-0 flex-col gap-2 rounded-[14px] border border-black/5 bg-[#f2f2f4] p-6"
                      >
                        <h3
                          className="text-[1.05rem] font-semibold"
                          style={{
                            color: cardTitleColor,
                            ...textStyleToCss(cardTitleStyle),
                          }}
                        >
                          {resolveText(
                            card.name,
                            locale,
                            streamDocument,
                            "Location name",
                          )}
                        </h3>
                        <p
                          className="text-sm leading-6"
                          style={{
                            color: bodyTextColor,
                            ...textStyleToCss(bodyStyle),
                          }}
                        >
                          {resolveText(
                            card.addressLineOne,
                            locale,
                            streamDocument,
                            "Address line one",
                          )}
                          <br />
                          {resolveText(
                            card.addressLineTwo,
                            locale,
                            streamDocument,
                            "Address line two",
                          )}
                        </p>
                        <p
                          className="text-sm leading-6"
                          style={{
                            color: bodyTextColor,
                            ...textStyleToCss(bodyStyle),
                          }}
                        >
                          {resolveText(card.phone, locale, streamDocument, "Phone number")}
                        </p>
                        <p
                          className="text-sm leading-6"
                          style={{
                            color: bodyTextColor,
                            ...textStyleToCss(bodyStyle),
                          }}
                        >
                          {resolveText(
                            card.distance,
                            locale,
                            streamDocument,
                            "Distance text",
                          )}
                        </p>
                        {resolvedCta ? (
                          <a
                            href={resolvedCta.link || "#"}
                            rel={resolvedCta.openInNewTab ? "noreferrer" : undefined}
                            style={{
                              color: linkTextColor,
                              ...linkStyleToCss(linkStyle),
                            }}
                            target={resolvedCta.openInNewTab ? "_blank" : undefined}
                          >
                            <span
                              className="pt-1 text-sm font-medium"
                              style={{ color: linkTextColor }}
                            >
                              {resolvedCta.label || "Get directions"}
                            </span>
                          </a>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </AnalyticsScopeProvider>
      </VisibilityWrapper>
    );
  };

export const YextDeepCurrentNearbyLocations: YextComponentConfig<YextDeepCurrentNearbyLocationsProps> =
  {
    label: "Deep Current Nearby Locations",
    fields: SectionFields,
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      content: {
        sectionHeading: createEditableText("Nearby Locations"),
        sectionDescription: createEditableText(
          "Explore nearby Charlotte-area offices for wealth management, retirement planning, and advisory conversations.",
        ),
        cards: [
          {
            name: createEditableText("Northstar Wealth Partners - SouthPark"),
            addressLineOne: createEditableText("6000 Fairview Rd, Suite 900"),
            addressLineTwo: createEditableText("Charlotte, NC 28210"),
            phone: createEditableText("+1 (704) 555-0138"),
            distance: createEditableText("Located 5.8 miles from Uptown Charlotte"),
            cta: createEditableLink("Get directions", "#"),
          },
          {
            name: createEditableText("Northstar Wealth Partners - Dilworth"),
            addressLineOne: createEditableText("1420 East Blvd, Suite 210"),
            addressLineTwo: createEditableText("Charlotte, NC 28203"),
            phone: createEditableText("+1 (704) 555-0186"),
            distance: createEditableText("Located 2.4 miles from Uptown Charlotte"),
            cta: createEditableLink("Get directions", "#"),
          },
          {
            name: createEditableText("Northstar Wealth Partners - University City"),
            addressLineOne: createEditableText(
              "8701 University City Blvd, Suite 400",
            ),
            addressLineTwo: createEditableText("Charlotte, NC 28213"),
            phone: createEditableText("+1 (704) 555-0167"),
            distance: createEditableText("Located 10.9 miles from Uptown Charlotte"),
            cta: createEditableLink("Get directions", "#"),
          },
        ],
      },
      map: {
        mapboxApiKey: "",
        mapStyle: "mapbox://styles/mapbox/streets-v12",
        mapHeight: "420px",
        mapZoom: 12,
        coordinate: {
          field: "yextDisplayCoordinate",
          constantValue: {
            latitude: 35.2271,
            longitude: -80.8431,
          },
          constantValueEnabled: false,
        },
      },
      styles: {
        headingStyle: defaultTextStyle,
        bodyStyle: defaultTextStyle,
        cardTitleStyle: defaultTextStyle,
        linkStyle: defaultLinkStyle,
      },
    },
    render: YextDeepCurrentNearbyLocationsComponent,
  };
