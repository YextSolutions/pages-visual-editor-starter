// @ts-nocheck
import { backgroundColors } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { PhoneAtom } from "../atoms/phone";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import {
  defaultPhoneDataProps,
  PhoneDataFields,
  PhoneStyleFields,
  PhoneProps,
} from "./Phone";
import { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

export interface PhoneListProps {
  data: {
    phoneNumbers: Array<PhoneProps["data"]>;
  };
  styles: PhoneProps["styles"];

  /** @internal Event name to be used for click analytics */
  eventName?: string;

  /** @internal */
  parentData?: {
    field: string;
    phoneNumbers: {
      label: string;
      number: string;
    }[];
  };
}

export const phoneListFields: YextFields<PhoneListProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: {
      phoneNumbers: {
        type: "array",
        label: msg("fields.phoneNumbers", "Phone Numbers"),
        arrayFields: PhoneDataFields,
        defaultItemProps: defaultPhoneDataProps,
        getItemSummary: (item: PhoneProps["data"]) => {
          const locale = i18nComponentsInstance.language;
          const resolvedValue = resolveComponentData(item.label, locale);

          if (resolvedValue) {
            return resolvedValue;
          }
          return pt("phone", "Phone");
        },
      },
    },
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: {
      ...PhoneStyleFields,
    },
  },
};

type ResolvedPhoneNumber = {
  number: string;
  label?: string;
};

export const resolvePhoneNumbers = (
  phoneNumbers: Array<PhoneProps["data"]>,
  locale: string,
  streamDocument: any
): ResolvedPhoneNumber[] => {
  return (
    phoneNumbers
      ?.map((item): ResolvedPhoneNumber | null => {
        const number = resolveComponentData(
          item.number,
          locale,
          streamDocument
        );
        const label = resolveComponentData(item.label, locale, streamDocument);

        if (!number) {
          return null;
        }

        return { number, label };
      })
      ?.filter((item): item is ResolvedPhoneNumber => item !== null) ?? []
  );
};

export const PhoneListComponent: PuckComponent<PhoneListProps> = (props) => {
  const { data, styles, parentData, puck } = props;
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const streamDocument = useDocument();
  const resolvedPhoneNumbers = parentData
    ? parentData.phoneNumbers
    : resolvePhoneNumbers(data.phoneNumbers, locale, streamDocument);

  return resolvedPhoneNumbers.length > 0 ? (
    <ul className="flex flex-col gap-4">
      {resolvedPhoneNumbers.map((phone, idx) => {
        return (
          <li
            key={`${phone.number}-${idx}`}
            className="flex gap-2 items-center"
          >
            <EntityField
              displayName={pt("fields.phoneNumber", "Phone Number")}
              fieldId={
                parentData
                  ? parentData.field
                  : data.phoneNumbers[idx]?.number?.field
              }
              constantValueEnabled={
                data.phoneNumbers[idx]?.number?.constantValueEnabled
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center">
                  <PhoneAtom
                    eventName={`${props.eventName || "phone"}${idx}`}
                    backgroundColor={
                      styles.color ?? backgroundColors.background2.value
                    }
                    label={phone.label}
                    phoneNumber={phone.number}
                    format={styles.phoneFormat}
                    includeHyperlink={styles.includePhoneHyperlink}
                    includeIcon={styles.includeIcon ?? true}
                    linkColor={styles.color}
                  />
                </div>
              </div>
            </EntityField>
          </li>
        );
      })}
    </ul>
  ) : puck.isEditing ? (
    <div className="h-20" />
  ) : (
    <></>
  );
};

export const PhoneList: YextComponentConfig<PhoneListProps> = {
  label: msg("components.phoneList", "Phone List"),
  fields: phoneListFields,
  resolveFields: (data) => resolveDataFromParent(phoneListFields, data),
  defaultProps: {
    data: {
      phoneNumbers: [],
    },
    styles: {
      phoneFormat: "domestic",
      includePhoneHyperlink: true,
      includeIcon: true,
    },
  },
  render: (props) => <PhoneListComponent {...props} />,
};
