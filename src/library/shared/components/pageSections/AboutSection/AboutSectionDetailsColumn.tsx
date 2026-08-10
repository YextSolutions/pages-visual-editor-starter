// @ts-nocheck
import React from "react";
import { FieldLabel, PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import { Body } from "../../atoms/body";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { FooterSocialLinksSlotProps } from "../../footer/FooterSocialLinksSlot";
import { Heading } from "../../atoms/heading";
import { HeadingLevel } from "@yext/visual-editor/section-library-support";
import { i18nComponentsInstance } from "@yext/visual-editor/section-library-support";
import { msg, pt } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import { resolveYextEntityField } from "@yext/visual-editor/section-library-support";
import { StreamDocument } from "@yext/visual-editor/section-library-support";
import { TranslatableString } from "@yext/visual-editor/section-library-support";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { YextAutoField } from "@yext/visual-editor/section-library-support";
import {
  HoursStatus,
  HoursStatusProps,
  hoursStatusWrapperFields,
} from "../../contentBlocks/HoursStatus";
import { Phone, PhoneProps, PhoneFields } from "../../contentBlocks/Phone";
import {
  Emails,
  EmailsProps,
  EmailsFields,
} from "../../contentBlocks/Emails";
import {
  TextList,
  TextListProps,
  textListFields,
} from "../../contentBlocks/TextList";
import {
  FooterSocialLinksSlot,
  FooterSocialLinksSlotFields,
} from "../../footer/FooterSocialLinksSlot";
import {
  addressFields,
  Address,
  AddressProps,
  resolveAddressFields,
} from "../../contentBlocks/Address";
import {
  HoursTableProps,
  hoursTableFields,
  HoursTable,
} from "../../contentBlocks/HoursTable";
import {
  YextComponentConfig,
  YextCustomFieldRenderProps,
  YextFieldDefinition,
  YextFields,
} from "@yext/visual-editor/section-library-support";

export type AboutSectionDetailsColumnProps = {
  sections: DetailSection[];
  headingLevelOverride?: HeadingLevel | "span";
};

type DetailSection = {
  header: YextEntityField<TranslatableString>;
  content: {
    type:
      | "hoursStatus"
      | "hoursTable"
      | "address"
      | "phone"
      | "emails"
      | "textList"
      | "socialMedia";
    hoursStatus?: {
      data: HoursStatusProps["data"];
      styles: Omit<HoursStatusProps["styles"], "className">;
    };
    hoursTable?: HoursTableProps;
    address?: AddressProps;
    phone?: {
      data: PhoneProps["data"];
      styles: PhoneProps["styles"];
    };
    emails?: EmailsProps;
    textList?: TextListProps;
    socialMedia?: FooterSocialLinksSlotProps;
  };
};

type DetailSectionContentValue = NonNullable<
  Omit<DetailSection["content"], "type">[DetailSection["content"]["type"]]
>;

export const defaultAboutSectionProps: Omit<DetailSection["content"], "type"> =
  {
    hoursStatus: {
      data: {
        hours: {
          field: "hours",
          constantValue: {},
          constantValueEnabled: false,
        },
      },
      styles: {
        showCurrentStatus: true,
        showDayNames: false,
        timeFormat: "12h" as const,
        dayOfWeekFormat: "short" as const,
      },
    },
    hoursTable: {
      data: {
        hours: {
          field: "hours",
          constantValue: {},
          constantValueEnabled: false,
        },
      },
      styles: {
        startOfWeek: "today",
        collapseDays: false,
        showAdditionalHoursText: true,
        alignment: "items-start",
      },
    },
    address: {
      data: {
        address: {
          field: "address",
          constantValue: {} as AddressProps["data"]["address"]["constantValue"],
          constantValueEnabled: false,
        },
      },
      styles: {
        showGetDirectionsLink: false,
        ctaVariant: "link",
      },
    },
    phone: {
      data: {
        number: {
          field: "mainPhone",
          constantValue: "",
          constantValueEnabled: false,
        },
        label: { defaultValue: "Phone" },
      },
      styles: {
        phoneFormat: "domestic",
        includePhoneHyperlink: false,
        includeIcon: true,
      },
    },
    emails: {
      data: {
        list: {
          field: "emails",
          constantValue: [],
          constantValueEnabled: true,
        },
      },
      styles: {
        listLength: 1,
        showIcon: true,
      },
    },
    textList: {
      list: {
        field: "",
        constantValue: [],
        constantValueEnabled: true,
      },
      commaSeparated: false,
    },
    socialMedia: {
      data: {
        xLink: "",
        facebookLink: "",
        instagramLink: "",
        linkedInLink: "",
        pinterestLink: "",
        tiktokLink: "",
        youtubeLink: "",
      },
      styles: {
        filledBackground: true,
        mobileAlignment: "left",
      },
    },
  };

const typeToFields = (
  type: DetailSection["content"]["type"],
  data: DetailSection["content"]
) => {
  const fields: Record<DetailSection["content"]["type"], YextFields> = {
    hoursStatus: hoursStatusWrapperFields,
    hoursTable: hoursTableFields,
    address:
      "address" in data && data.address
        ? resolveAddressFields({ props: { id: "", ...data.address } })
        : addressFields,
    phone: PhoneFields,
    emails: EmailsFields,
    textList: textListFields,
    socialMedia: FooterSocialLinksSlotFields,
  };
  return fields[type];
};

const aboutSectionDetailsColumnFields: YextFields<AboutSectionDetailsColumnProps> =
  {
    sections: {
      type: "array",
      label: msg("fields.sections", "Sections"),
      arrayFields: {
        header: {
          type: "entityField",
          label: msg("fields.header", "Header"),
          filter: {
            types: ["type.string"],
          },
        },
        content: {
          type: "custom",
          label: msg("fields.content", "Content"),
          render: ({
            value,
            onChange,
          }: YextCustomFieldRenderProps<DetailSection["content"]>) => {
            const content = value ?? {
              type: "hoursStatus",
              hoursStatus: defaultAboutSectionProps.hoursStatus,
            };

            return (
              <div>
                <FieldLabel
                  label={pt("fields.contentType", "Content Type")}
                  el="div"
                  className="mb-3"
                >
                  <YextAutoField
                    value={content.type}
                    onChange={(v: DetailSection["content"]["type"]) => {
                      onChange({
                        type: v,
                        [v]: defaultAboutSectionProps[v],
                      } as DetailSection["content"]);
                    }}
                    field={{
                      type: "basicSelector",
                      label: msg("fields.contentType", "Content Type"),
                      options: [
                        {
                          label: msg(
                            "fields.options.hoursStatus",
                            "Hours Status"
                          ),
                          value: "hoursStatus",
                        },
                        {
                          label: msg(
                            "fields.options.hoursTable",
                            "Hours Table"
                          ),
                          value: "hoursTable",
                        },
                        {
                          label: msg("fields.options.address", "Address"),
                          value: "address",
                        },
                        {
                          label: msg("fields.options.phone", "Phone"),
                          value: "phone",
                        },
                        {
                          label: msg("fields.options.emails", "Emails"),
                          value: "emails",
                        },
                        {
                          label: msg("fields.options.textList", "Text List"),
                          value: "textList",
                        },
                        {
                          label: msg(
                            "fields.options.socialMedia",
                            "Social Media"
                          ),
                          value: "socialMedia",
                        },
                      ],
                    }}
                  />
                </FieldLabel>
                <YextAutoField
                  value={
                    (content[content.type] ??
                      defaultAboutSectionProps[
                        content.type
                      ]) as DetailSectionContentValue
                  }
                  onChange={(v) =>
                    onChange({
                      type: content.type,
                      [content.type]: v,
                    } as DetailSection["content"])
                  }
                  field={
                    {
                      type: "object",
                      objectFields: typeToFields(content.type, content),
                    } as YextFieldDefinition<DetailSectionContentValue>
                  }
                />
              </div>
            );
          },
        },
      },
      defaultItemProps: {
        header: {
          field: "",
          constantValue: { defaultValue: "Header" },
          constantValueEnabled: true,
        },
        content: {
          type: "hoursStatus",
          hoursStatus: defaultAboutSectionProps.hoursStatus,
        },
      },
      getItemSummary: (item: DetailSection, i?: number) => {
        const locale = i18nComponentsInstance.language;
        return (
          resolveComponentData(item.header, locale) ||
          pt("section", "Section") + " " + ((i ?? 0) + 1)
        );
      },
    },
  };

const typeToRenderFunctions: Record<
  DetailSection["content"]["type"],
  PuckComponent<any>
> = {
  hoursStatus: HoursStatus.render,
  hoursTable: HoursTable.render,
  address: Address.render,
  phone: Phone.render,
  emails: Emails.render,
  textList: TextList.render,
  socialMedia: FooterSocialLinksSlot.render,
};

/** Resolves the data for each section type and returns whether the section should be displayed. */
const filterEmptySections = (
  section: DetailSection,
  streamDocument: StreamDocument,
  locale: string
): boolean => {
  switch (section.content.type) {
    case "hoursStatus": {
      if (!section?.content?.hoursStatus?.data?.hours) {
        return false;
      }

      return !!resolveYextEntityField(
        streamDocument,
        section.content.hoursStatus.data.hours,
        locale
      );
    }
    case "hoursTable": {
      if (!section?.content?.hoursTable?.data?.hours) {
        return false;
      }

      return !!resolveYextEntityField(
        streamDocument,
        section.content.hoursTable.data.hours,
        locale
      );
    }
    case "address": {
      if (!section?.content?.address?.data?.address) {
        return false;
      }

      const address = resolveYextEntityField(
        streamDocument,
        section.content.address.data.address,
        locale
      );

      return !!(
        address?.line1 ||
        address?.line2 ||
        address?.city ||
        address?.region ||
        address?.postalCode
      );
    }
    case "phone": {
      if (!section?.content?.phone?.data?.number) {
        return false;
      }

      return !!resolveYextEntityField(
        streamDocument,
        section.content.phone.data.number,
        locale
      );
    }
    case "emails": {
      if (!section?.content?.emails?.data?.list) {
        return false;
      }

      const emails = resolveYextEntityField(
        streamDocument,
        section.content.emails.data.list,
        locale
      );

      return Array.isArray(emails) && emails.length > 0;
    }
    case "textList": {
      if (!section?.content?.textList?.list) {
        return false;
      }

      const textList = resolveComponentData(
        section.content.textList.list,
        locale,
        streamDocument
      ) as string[];

      return (
        Array.isArray(textList) && textList.filter((t) => t.trim()).length > 0
      );
    }
    case "socialMedia": {
      const socialMediaData = section?.content?.socialMedia?.data;

      if (!socialMediaData) {
        return false;
      }

      return Object.values(socialMediaData).some((link) => Boolean(link));
    }
  }
};

const AboutSectionDetailsColumnComponent: PuckComponent<
  AboutSectionDetailsColumnProps
> = (props) => {
  const { sections, headingLevelOverride, puck, id } = props;
  const { i18n } = useTranslation();
  const streamDocument = useDocument();

  const filteredSections = React.useMemo(
    () =>
      sections.filter((section) =>
        filterEmptySections(section, streamDocument, i18n.language)
      ),
    [sections, streamDocument, i18n.language]
  );

  return (
    <div className="flex flex-col gap-8">
      {filteredSections.map((section, i) => {
        const Component = typeToRenderFunctions[section.content.type];

        return (
          <div
            key={`${section.content.type}-${i}`}
            className={`border-t pt-8 ${i === 0 ? "lg:border-t-0 lg:pt-0" : ""} border-[#BABABA] flex flex-col gap-4`}
          >
            <EntityField
              fieldId={section.header.field}
              displayName={pt("fields.sectionHeader", "Section Header")}
              constantValueEnabled={section.header.constantValueEnabled}
            >
              <Heading level={5} semanticLevelOverride={headingLevelOverride}>
                {resolveComponentData(
                  section.header,
                  i18n.language,
                  streamDocument
                )}
              </Heading>
            </EntityField>
            <div>
              {section?.content?.[section?.content?.type] && (
                <Component
                  {...section.content[section.content.type]}
                  puck={puck}
                  id={`${id}-${section.content.type}-${i}`}
                  // Override bodyVariant to "base" for HoursStatus
                  {...(section.content.type === "hoursStatus" && {
                    styles: {
                      ...section.content.hoursStatus?.styles,
                      bodyVariant: "base",
                    },
                  })}
                />
              )}
              {section.content.type === "hoursStatus" &&
                section.content.hoursStatus &&
                streamDocument.additionalHoursText && (
                  <EntityField
                    displayName={pt("hoursText", "Hours Text")}
                    fieldId="additionalHoursText"
                  >
                    <Body variant="sm" className="mt-4">
                      {streamDocument.additionalHoursText}
                    </Body>
                  </EntityField>
                )}
            </div>
          </div>
        );
      })}
      {filteredSections.length === 0 && puck.isEditing && (
        <div style={{ minHeight: "500px" }}></div>
      )}
    </div>
  );
};

export const AboutSectionDetailsColumn: YextComponentConfig<AboutSectionDetailsColumnProps> =
  {
    label: msg("components.aboutSectionDetailsColumn", "Details Column"),
    fields: aboutSectionDetailsColumnFields,
    defaultProps: {
      sections: [],
    },
    render: (props) => <AboutSectionDetailsColumnComponent {...props} />,
  };
