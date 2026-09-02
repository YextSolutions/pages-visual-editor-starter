import { useTranslation } from "react-i18next";
import {
  ComponentData,
  DefaultComponentProps,
  PuckComponent,
  setDeep,
} from "@puckeditor/core";
import {
  AddressType,
  getDirections,
  Address as RenderAddress,
} from "@yext/pages-components";
import { useDocument } from "@yext/visual-editor/section-library-support";
import { EntityField } from "@yext/visual-editor/section-library-support";
import { YextEntityField } from "@yext/visual-editor/section-library-support";
import { CTA, CTAVariant, isCtaVariantWithColor } from "@yext/visual-editor/section-library-support";
import { pt, msg } from "@yext/visual-editor/section-library-support";
import { resolveComponentData } from "@yext/visual-editor/section-library-support";
import {
  ThemeColor,
  ThemeOptions,
  backgroundColors,
} from "@yext/visual-editor/section-library-support";
import { resolveDataFromParent } from "@yext/visual-editor/section-library-support";
import { YextComponentConfig, YextFields } from "@yext/visual-editor/section-library-support";

/** Props for the Address component */
export interface AddressProps {
  data: {
    /** The address data to display. */
    address: YextEntityField<AddressType>;
  };

  styles: {
    /**
     * Whether to include the region in the Address
     * @defaultValue true
     */
    showRegion?: boolean;

    /**
     * Whether to include the country in the Address
     * @defaultValue false
     */
    showCountry?: boolean;

    /** Whether to include a "Get Directions" CTA to Google Maps */
    showGetDirectionsLink: boolean;

    /** The variant of the get directions button */
    ctaVariant: CTAVariant;

    color?: ThemeColor;
  };

  /** @internal */
  parentData?: {
    field: string;
    address?: AddressType;
  };
}

// Address field definition used in Address and CoreInfoSection
export const AddressDataField: YextFields<AddressProps["data"]> = {
  address: {
    type: "entityField",
    label: msg("fields.address", "Address"),
    filter: { types: ["type.address"] },
  },
};

// Address style fields used in Address and CoreInfoSection
export const AddressStyleFields: YextFields<AddressProps["styles"]> = {
  showRegion: {
    label: msg("fields.showRegion", "Show Region"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  showCountry: {
    label: msg("fields.showCountry", "Show Country"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  showGetDirectionsLink: {
    label: msg("fields.showGetDirectionsLink", "Show Get Directions Link"),
    type: "radio",
    options: [
      { label: msg("fields.options.yes", "Yes"), value: true },
      { label: msg("fields.options.no", "No"), value: false },
    ],
  },
  ctaVariant: {
    label: msg("fields.ctaVariant", "CTA Variant"),
    type: "radio",
    options: ThemeOptions.CTA_VARIANT,
  },
  color: {
    type: "basicSelector",
    label: msg("fields.linkColor", "Link Color"),
    options: "SITE_COLOR",
  },
};

export const addressFields: YextFields<AddressProps> = {
  data: {
    type: "object",
    label: msg("fields.data", "Data"),
    objectFields: AddressDataField,
  },
  styles: {
    type: "object",
    label: msg("fields.styles", "Styles"),
    objectFields: AddressStyleFields,
  },
};

const AddressComponent: PuckComponent<AddressProps> = (props) => {
  const { data, styles, puck, parentData } = props;
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument();

  const resolvedColor = styles.color;
  const address =
    parentData?.address ??
    (resolveComponentData(
      data.address,
      i18n.language,
      streamDocument
    ) as unknown as AddressType | undefined);

  const listings = streamDocument.ref_listings ?? [];
  const listingsLink = getDirections(
    undefined,
    listings,
    undefined,
    { provider: "google" },
    undefined
  );
  const addressLink = getDirections(
    address as AddressType,
    undefined,
    undefined,
    { provider: "google" }
  );

  // If ref_listings doesn't exist or the address field selected isn't just address, use the address link.
  const useAddressLink: boolean =
    data.address.field !== "address" || !streamDocument.ref_listings?.length;

  // Only show the address component if there's at least one line of the address
  const showAddress = !!(
    address?.line1 ||
    address?.line2 ||
    address?.city ||
    address?.region ||
    address?.postalCode
  );

  return showAddress ? (
    <div className="flex flex-col gap-2 text-body-fontSize font-body-fontWeight font-body-fontFamily">
      <EntityField
        displayName={parentData ? parentData.field : pt("address", "Address")}
        fieldId={data.address.field}
        constantValueEnabled={!parentData && data.address.constantValueEnabled}
      >
        <RenderAddress
          address={address}
          showRegion={styles.showRegion}
          showCountry={styles.showCountry}
        />
      </EntityField>
      {(useAddressLink ? !!addressLink : !!listingsLink) &&
        styles.showGetDirectionsLink && (
          <CTA
            setPadding={true}
            ctaType="getDirections"
            eventName={`getDirections`}
            link={useAddressLink ? addressLink : listingsLink}
            label={t("getDirections", "Get Directions")}
            linkType="DRIVING_DIRECTIONS"
            normalizeLink={false}
            target="_blank"
            variant={styles.ctaVariant}
            color={resolvedColor}
          />
        )}
    </div>
  ) : puck.isEditing ? (
    <div className="min-h-[40px]"></div>
  ) : (
    <></>
  );
};

export const resolveAddressFields = (
  data: Omit<
    ComponentData<AddressProps, string, Record<string, DefaultComponentProps>>,
    "type"
  >
) => {
  let updatedFields = resolveDataFromParent(addressFields, data);
  const showGetDirectionsLink = data.props.styles.showGetDirectionsLink;
  updatedFields = setDeep(
    updatedFields,
    "styles.objectFields.ctaVariant.visible",
    showGetDirectionsLink
  );
  const ctaVariant = data.props.styles.ctaVariant;
  const showColor = isCtaVariantWithColor(ctaVariant);
  updatedFields = setDeep(
    updatedFields,
    "styles.objectFields.color.visible",
    showGetDirectionsLink && showColor
  );

  return updatedFields;
};

export const Address: YextComponentConfig<AddressProps> = {
  label: msg("components.address", "Address"),
  fields: addressFields,
  defaultProps: {
    data: {
      address: {
        field: "address",
        constantValue: {
          line1: "",
          city: "",
          region: "",
          postalCode: "",
          countryCode: "",
        },
      },
    },
    styles: {
      showRegion: true,
      showCountry: false,
      showGetDirectionsLink: true,
      ctaVariant: "link",
      color: backgroundColors.color1.value,
    },
  },
  resolveFields: resolveAddressFields,
  render: (props) => <AddressComponent {...props} />,
};
