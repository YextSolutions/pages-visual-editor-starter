// @ts-nocheck
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { Body, BodyProps } from "../atoms/body";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { TranslatableRichText, TranslatableString } from "@yext/visual-editor/section-library-support";
import { useTranslation } from "react-i18next";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { ThemeColor, ThemeOptions } from "@yext/visual-editor/section-library-support";
import { themeManagerCn } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export type TextProps = {
  data: {
    /** The text to display. */
    text: YextEntityField<TranslatableString | TranslatableRichText>;
  };

  styles: {
    /** The size of the text. */
    variant: BodyProps["variant"];
    /** Optional text color override. */
    color?: ThemeColor;
    /** Optional font style override. */
    fontStyle: "regular" | "bold" | "italic";
  };

  /** @internal Controlled data from the parent section. */
  parentData?: {
    field: string;
    text: TranslatableString | TranslatableRichText | undefined;
  };

  /** @internal Controlled style from the parent section */
  parentStyles?: {
    className: string;
  };
};

const textFields: YextFields<TextProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      text: {
        type: "entityField",
        label: msg("fields.text", "Text"),
        filter: {
          types: ["type.string", "type.rich_text_v2"],
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      variant: {
        label: msg("fields.textSize", "Text Size"),
        type: "radio",
        options: ThemeOptions.BODY_VARIANT,
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
      fontStyle: {
        label: msg("fields.fontStyle", "Font Style"),
        type: "radio",
        options: [
          { label: msg("fields.options.regular", "Regular"), value: "regular" },
          { label: msg("fields.options.bold", "Bold"), value: "bold" },
          { label: msg("fields.options.italic", "Italic"), value: "italic" },
        ],
      },
    },
  },
};

const fontStyleToClassName: Record<
  NonNullable<TextProps["styles"]["fontStyle"]>,
  string
> = {
  regular: "",
  bold: "font-bold",
  italic: "italic",
};

const TextComponent: PuckComponent<TextProps> = (props) => {
  const { data, styles, puck, parentData, parentStyles } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();

  const sourceData = parentData ? parentData.text : data.text;
  const resolvedData = sourceData
    ? resolveComponentData(sourceData, i18n.language, streamDocument, {
        output: "plainText",
      })
    : "";

  return resolvedData ? (
    <EntityField
      displayName={pt("text", "Text")}
      fieldId={parentData ? parentData.field : data.text.field}
      constantValueEnabled={!parentData && data.text.constantValueEnabled}
    >
      <Body
        variant={styles.variant}
        color={styles.color}
        className={themeManagerCn(
          fontStyleToClassName[styles.fontStyle],
          parentStyles?.className
        )}
      >
        {resolvedData}
      </Body>
    </EntityField>
  ) : puck.isEditing ? (
    <div className="h-[30px] min-w-[100px]" />
  ) : (
    <></>
  );
};

export const Text: YextComponentConfig<TextProps> = {
  label: msg("components.text", "Text"),
  fields: textFields,
  resolveFields: (data) => resolveDataFromParent(textFields, data),
  defaultProps: {
    data: {
      text: {
        field: "",
        constantValue: { defaultValue: "Text" },
        constantValueEnabled: true,
      },
    },
    styles: {
      variant: "base",
      fontStyle: "regular",
    },
  },
  render: (props) => <TextComponent {...props} />,
};
