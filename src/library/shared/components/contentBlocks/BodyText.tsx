// @ts-nocheck
import { useTranslation } from "react-i18next";
import * as React from "react";
import { PuckComponent } from "@puckeditor/core";
import { BodyProps, Body } from "../atoms/body";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { pt, msg } from "@yext/visual-editor/section-library-support";
import { TranslatableRichText } from "@yext/visual-editor/section-library-support";
import { useBackground } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { ThemeColor, ThemeOptions } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export type BodyTextProps = {
  data: {
    /** The body text to display. */
    text: YextEntityField<TranslatableRichText>;
  };

  styles: {
    /** The size of the body text. */
    variant: BodyProps["variant"];

    /** The color of the body text. */
    color?: ThemeColor;
  };

  /**
   * @internal Controlled data from the parent section.
   */
  parentData?: {
    field: string;
    richText: TranslatableRichText | undefined;
  };

  /** @internal Controlled style from the parent section */
  parentStyles?: {
    className: string;
  };
};

const bodyTextFields: YextFields<BodyTextProps> = {
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
      variant: {
        label: msg("fields.variant", "Variant"),
        type: "radio",
        options: ThemeOptions.BODY_VARIANT,
      },
      color: {
        type: "basicSelector",
        label: msg("fields.color", "Color"),
        options: "SITE_COLOR",
      },
    },
  },
};

const BodyTextComponent: PuckComponent<BodyTextProps> = (props) => {
  const { data, styles, puck, parentData } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const background = useBackground();

  const sourceData = parentData ? parentData?.richText : data.text;

  const resolvedData = sourceData
    ? resolveComponentData(sourceData, i18n.language, streamDocument, {
        variant: styles.variant,
        isDarkBackground: background?.isDarkColor,
        className: props.parentStyles?.className,
        color: styles.color,
      })
    : undefined;

  return React.isValidElement(resolvedData) ||
    typeof resolvedData === "string" ? (
    <EntityField
      displayName={pt("body", "Body")}
      fieldId={parentData ? parentData.field : data.text.field}
      constantValueEnabled={data.text.constantValueEnabled}
    >
      {typeof resolvedData === "string" ? (
        <Body variant={styles.variant} color={styles.color}>
          {resolvedData}
        </Body>
      ) : (
        resolvedData
      )}
    </EntityField>
  ) : puck.isEditing ? (
    <div className="h-[60px] min-w-[100px]" />
  ) : (
    <></>
  );
};

export const BodyText: YextComponentConfig<BodyTextProps> = {
  label: msg("components.richText", "Rich Text"),
  fields: bodyTextFields,
  resolveFields: (data) => resolveDataFromParent(bodyTextFields, data),
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
    },
  },
  render: (props) => <BodyTextComponent {...props} />,
};
