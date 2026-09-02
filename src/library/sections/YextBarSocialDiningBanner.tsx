import type { SectionConfig } from "@yext/visual-editor";

import { isValidElement } from "react";
import { PuckComponent } from "@puckeditor/core";
import { CircleSlash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Body,
  EntityField,
  MaybeRTF,
  PageSection,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  backgroundColors,
  getDefaultRTF,
  resolveComponentData,
  resolveYextEntityField,
  toPuckFields,
  useDocument,
} from "@yext/visual-editor";

type YextBarSocialDiningBannerProps = {
  data: {
    text: YextEntityField<TranslatableRichText>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  styles: {
    textAlignment: "left" | "center" | "right";
  };
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};

const YextBarSocialDiningBannerFields: YextFields<YextBarSocialDiningBannerProps> = {
  data: {
    label: "Banner Text",
    type: "object",
    objectFields: {
      text: {
        label: "Text",
        type: "entityField",
        filter: {
          types: ["type.rich_text_v2"],
        },
      },
      styles: {
        label: "Text Styles",
        type: "styledText",
      },
      fontColor: {
        label: "Text Color",
        type: "basicSelector",
        options: "SITE_COLOR",
      },
    },
  },
  styles: {
    label: "Styles",
    type: "object",
    objectFields: {
      textAlignment: {
        label: "Text Alignment",
        type: "radio",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    },
  },
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
};

const YextBarSocialDiningBannerComponent: PuckComponent<YextBarSocialDiningBannerProps> = ({
  data,
  styles,
  section,
  puck,
}) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const isMappedField =
    !data.text.constantValueEnabled && Boolean(data.text.field);

  if (
    isMappedField &&
    isRichTextEmpty(
      resolveYextEntityField(streamDocument, data.text, i18n.language),
    )
  ) {
    if (!puck.isEditing) {
      return <></>;
    }

    return (
      <PageSection
        background={section.backgroundColor}
        className="flex items-center justify-center"
        verticalPadding="sm"
      >
        <div className="relative flex h-20 w-full flex-row items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4">
          <CircleSlash2 className="h-10 w-10 flex-shrink-0 text-gray-400" />
          <div className="flex flex-col items-start">
            <Body className="font-medium text-gray-500" variant="sm">
              Section hidden for this page
            </Body>
            <Body className="font-normal text-gray-500" variant="sm">
              The mapped banner field is empty
            </Body>
          </div>
        </div>
      </PageSection>
    );
  }

  const richTextStyleOverrides = {
    ...data.styles,
    color: data.fontColor ?? section.backgroundColor.contrastingColor,
  };
  const resolvedText = resolveComponentData(
    data.text,
    i18n.language,
    streamDocument,
    { richTextStyleOverrides },
  );

  if (!resolvedText) {
    return <></>;
  }

  return (
    <PageSection
      background={section.backgroundColor}
      className={`flex items-center ${
        {
          left: "justify-start text-left",
          center: "justify-center text-center",
          right: "justify-end text-right",
        }[styles.textAlignment]
      }`}
      verticalPadding="sm"
    >
      <EntityField
        constantValueEnabled={data.text.constantValueEnabled}
        displayName="Banner Text"
        fieldId={data.text.field}
      >
        {isValidElement(resolvedText) ? (
          resolvedText
        ) : typeof resolvedText === "string" ? (
          <MaybeRTF
            data={resolvedText}
            richTextStyleOverrides={richTextStyleOverrides}
          />
        ) : null}
      </EntityField>
    </PageSection>
  );
};

/**
 * Displays a full-width, editor-configurable rich-text banner.
 */
export const YextBarSocialDiningBanner: YextComponentConfig<YextBarSocialDiningBannerProps> = {
  label: "Banner",
  fields: toPuckFields(YextBarSocialDiningBannerFields),
  defaultProps: {
    data: {
      text: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF("Banner Text"),
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
    },
    styles: {
      textAlignment: "center",
    },
    section: {
      backgroundColor: backgroundColors.color1.value,
      visibleOnLivePage: true,
    },
  },
  render: (props) => (
    <VisibilityWrapper
      isEditing={props.puck.isEditing}
      liveVisibility={props.section.visibleOnLivePage}
    >
      <YextBarSocialDiningBannerComponent {...props} />
    </VisibilityWrapper>
  ),
};

export const config: SectionConfig = {
  id: "YextBarSocialDiningBanner",
  displayName: "Banner",
  description: "Banner",
  pageSetTypes: ["ENTITY"],
};
