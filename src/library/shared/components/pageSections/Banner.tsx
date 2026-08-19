import { useTranslation } from "react-i18next";
import * as React from "react";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { PageSection } from "@yext/visual-editor/section-library-support";
import { VisibilityWrapper } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { TranslatableRichText } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { Body } from "@yext/visual-editor/section-library-support";
import { getDefaultRTF } from "@yext/visual-editor/section-library-support";
import { PuckComponent } from "@puckeditor/core";
import {
  backgroundColors,
  ThemeColor,
  ThemeOptions,
} from "@yext/visual-editor/section-library-support";
import { CircleSlash2 } from "lucide-react";
import { useTemplateMetadata } from "@yext/visual-editor/section-library-support";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { ComponentErrorBoundary } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface BannerData {
  /**
   * The rich text to display. It can be linked to a Yext entity field or set as a constant value.
   * @defaultValue "Banner Text" (constant)
   */
  text: YextEntityField<TranslatableRichText>;
}

export interface BannerStyles {
  /**
   * The background color of the section.
   * @defaultValue Background Color 6
   */
  backgroundColor?: ThemeColor;

  /**
   * Optional text color for the banner text.
   * If not set, it will default to a color that contrasts with the background color.
   */
  textColor?: ThemeColor;

  /**
   * The horizontal alignment of the text.
   * @defaultValue center
   */
  textAlignment: "left" | "right" | "center";
}

export interface BannerSectionProps {
  /**
   * This object contains the content to be displayed by the component.
   * @propCategory Data Props
   */
  data: BannerData;

  /**
   * This object contains properties for customizing the component's appearance.
   * @propCategory Style Props
   */
  styles: BannerStyles;

  /**
   * If 'true', the component is visible on the live page; if 'false', it's hidden.
   * @defaultValue true
   */
  liveVisibility: boolean;

  /**
   * Indicates which props should not be checked for missing translations.
   * @internal
   */
  ignoreLocaleWarning?: string[];
}

const bannerSectionFields: YextFields<BannerSectionProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: {
          types: ["type.rich_text_v2"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      backgroundColor: {
        type: "basicSelector",
        label: msg("fields.backgroundColor", "Background Color"),
        options: "BACKGROUND_COLOR",
      },
      textColor: {
        type: "basicSelector",
        label: msg("fields.textColor", "Text Color"),
        options: "SITE_COLOR",
      },
      textAlignment: {
        label: msg("fields.textAlignment", "Text Alignment"),
        type: "radio",
        options: ThemeOptions.ALIGNMENT,
      },
    },
  },
  liveVisibility: {
    label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
    type: "radio",
    options: [
      { label: msg("fields.options.show", "Show"), value: true },
      { label: msg("fields.options.hide", "Hide"), value: false },
    ],
  },
};

function isRichTextEmpty(value: any): boolean {
  if (!value) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (typeof value === "object") {
    if ("html" in value) {
      return !value.html || value.html.trim() === "";
    }
  }
  return false;
}

const BannerComponent: PuckComponent<BannerSectionProps> = ({
  data,
  styles,
  puck,
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const streamDocument = useDocument();
  const templateMetadata = useTemplateMetadata();

  const isMappedField = !data.text.constantValueEnabled && !!data.text.field;
  const rawValue = isMappedField
    ? resolveYextEntityField(streamDocument, data.text, locale)
    : undefined;
  const isEmpty = isMappedField && isRichTextEmpty(rawValue);

  const resolvedText = resolveComponentData(data.text, locale, streamDocument, {
    color: styles.textColor,
  });

  const justifyClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[styles.textAlignment];

  const textAlignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-end",
  }[styles.textAlignment];

  // Show empty state in editor mode when mapped field is empty
  if (isMappedField && isEmpty) {
    if (puck.isEditing) {
      const entityTypeDisplayName = templateMetadata?.entityTypeDisplayName;

      return (
        <PageSection
          background={backgroundColors.background1.value}
          verticalPadding="sm"
          className="flex items-center justify-center"
        >
          <div className="relative h-20 w-full bg-gray-100 rounded-lg border border-gray-200 flex flex-row items-center justify-center gap-3 px-4">
            <CircleSlash2 className="w-10 h-10 text-gray-400 flex-shrink-0" />
            <div className="flex flex-col items-start gap-0">
              <Body variant="sm" className="text-gray-500 font-medium">
                {pt(
                  "emptyStateSectionHidden",
                  "Section hidden for this {{entityType}}",
                  {
                    entityType: entityTypeDisplayName
                      ? entityTypeDisplayName.toLowerCase()
                      : "page",
                  }
                )}
              </Body>
              <Body variant="sm" className="text-gray-500 font-normal">
                {pt(
                  "emptyStateFieldEmpty",
                  "{{entityType}}'s mapped field is empty",
                  {
                    entityType: entityTypeDisplayName
                      ? entityTypeDisplayName.charAt(0).toUpperCase() +
                        entityTypeDisplayName.slice(1)
                      : "Entity",
                  }
                )}
              </Body>
            </div>
          </div>
        </PageSection>
      );
    }
    return <></>;
  }

  if (!resolvedText) {
    return <></>;
  }

  return (
    <PageSection
      background={styles.backgroundColor}
      verticalPadding="sm"
      className={`flex ${justifyClass} ${textAlignClass} items-center`}
    >
      <EntityField
        displayName={pt("fields.bannerText", "Banner Text")}
        fieldId={data.text.field}
        constantValueEnabled={data.text.constantValueEnabled}
      >
        {resolvedText}
      </EntityField>
    </PageSection>
  );
};

export const defaultBannerProps: BannerSectionProps = {
  data: {
    text: {
      field: "",
      constantValue: { defaultValue: getDefaultRTF("Banner Text") },
      constantValueEnabled: true,
    },
  },
  styles: {
    backgroundColor: backgroundColors.background6.value,
    textAlignment: "center",
  },
  liveVisibility: true,
  ignoreLocaleWarning: ["data.text"],
};

/**
 * The Banner Section component displays a single, translatable line of rich text. It's designed to be used as a simple, full-width banner on a page.
 * Available on Location templates.
 */
export const BannerSection: YextComponentConfig<BannerSectionProps> = {
  label: msg("components.bannerSection", "Banner Section"),
  fields: bannerSectionFields,
  defaultProps: defaultBannerProps,
  render: (props) => (
    <ComponentErrorBoundary
      isEditing={props.puck.isEditing}
      resetKeys={[props]}
    >
      <VisibilityWrapper
        liveVisibility={props.liveVisibility}
        isEditing={props.puck.isEditing}
        iconSize="md"
      >
        <BannerComponent {...props} />
      </VisibilityWrapper>
    </ComponentErrorBoundary>
  ),
};
