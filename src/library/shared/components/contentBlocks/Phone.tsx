import { useTranslation } from "react-i18next";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { PhoneAtom } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import {
  ThemeColor,
  ThemeOptions,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

/** The props for the Phone component */
export interface PhoneProps {
  data: {
    /** The phone number data to display */
    number: YextEntityField<string>;
    /** The text to display before the phone number */
    label: TranslatableString;
  };

  styles: {
    /** Whether to format the phone number like a domestic or international number */
    phoneFormat: "domestic" | "international";
    /** Whether to make the phone number a clickable link */
    includePhoneHyperlink: boolean;
    /** Whether to include the phone icon, defaults to true */
    includeIcon?: boolean;
    /** The color applied to both the phone icon background and the phone link. */
    color?: ThemeColor;
  };

  /** @internal */
  parentData?: {
    field: string;
    phoneNumber?: string;
  };
}

// Phone field definitions used in Phone and CoreInfoSection
export const PhoneDataFields: YextFields<PhoneProps["data"]> = {
  number: {
    type: "entityField",
    label: msg("fields.phoneNumber", "Phone Number"),
    filter: {
      types: ["type.phone"],
    },
  },
  label: {
    type: "translatableString",
    label: msg("fields.label", "Label"),
    filter: { types: ["type.string"] },
  },
};

// Phone style definitions used in Phone and CoreInfoSection
export const PhoneStyleFields: YextFields<PhoneProps["styles"]> = {
  phoneFormat: {
    label: msg("fields.phoneFormat", "Phone Format"),
    type: "radio",
    options: ThemeOptions.PHONE_OPTIONS,
  },
  // By adding `<boolean>`, we make the type explicit.
  includePhoneHyperlink: {
    label: msg("fields.includePhoneHyperlink", "Include Phone Hyperlink"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  includeIcon: {
    label: msg("fields.showIcon", "Show Icon"),
    type: "radio",
    options: ThemeOptions.SHOW_HIDE,
  },
  color: {
    type: "basicSelector",
    label: msg("fields.color", "Color"),
    options: "SITE_COLOR",
  },
};

export const defaultPhoneDataProps: PhoneProps["data"] = {
  number: {
    field: "mainPhone",
    constantValue: "",
  },
  label: { defaultValue: "Phone" },
};

export const PhoneFields: YextFields<PhoneProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: PhoneDataFields,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: PhoneStyleFields,
  },
};

const PhoneComponent = ({ data, styles, parentData }: PhoneProps) => {
  const { i18n } = useTranslation();
  const streamDocument = useDocument();
  const resolvedPhone =
    parentData?.phoneNumber ??
    resolveComponentData(data.number, i18n.language, streamDocument);

  if (!resolvedPhone) {
    return;
  }

  return (
    <EntityField
      displayName={
        parentData ? parentData.field : pt("fields.phoneNumber", "Phone Number")
      }
      fieldId={data.number.field}
      constantValueEnabled={!parentData && data.number.constantValueEnabled}
    >
      <PhoneAtom
        backgroundColor={styles.color ?? backgroundColors.background2.value}
        eventName={`phone`}
        format={styles.phoneFormat}
        label={resolveComponentData(data.label, i18n.language, streamDocument)}
        phoneNumber={resolvedPhone}
        includeHyperlink={styles.includePhoneHyperlink}
        includeIcon={styles.includeIcon ?? true}
        linkColor={styles.color}
      />
    </EntityField>
  );
};

export const Phone: YextComponentConfig<PhoneProps> = {
  label: msg("components.phone", "Phone"),
  fields: PhoneFields,
  defaultProps: {
    data: defaultPhoneDataProps,
    styles: {
      phoneFormat: "domestic",
      includePhoneHyperlink: true,
      includeIcon: true,
    },
  },
  resolveFields: (data) => resolveDataFromParent(PhoneFields, data),
  render: (props) => <PhoneComponent {...props} />,
};
