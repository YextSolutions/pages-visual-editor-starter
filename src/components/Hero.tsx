import {
  AutoField,
  ComponentConfig,
  CustomField,
  FieldLabel,
  Fields,
  ObjectField,
} from "@measured/puck";
import { LocationStream } from "../types/autogen";
import { useDocument } from "@yext/pages/util";
import { Section } from "./atoms/section";
import {
  HoursStatus,
  Image,
  ImageType,
  ComplexImageType,
  HoursType,
} from "@yext/pages-components";
import { Heading, HeadingProps } from "./atoms/heading";
import { CTA } from "./atoms/cta";
import { ButtonProps } from "./atoms/button";
import { cn } from "../utils/cn";
import {
  EntityField,
  useEntityFields,
  YextEntityField,
  YextEntityFields,
  YextFieldDefinition,
  YextSchemaField,
} from "@yext/visual-editor";
import "./index.css";

export type HeroProps = {
  imageMode: "left" | "right";
  title: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
    entityField: string;
  };
  hours: {
    entityField: string;
  };
  image: {
    entityField: string;
  };
  location: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
  };
  cta1: {
    variant: ButtonProps["variant"];
  };
  cta2: {
    variant: ButtonProps["variant"];
  };
};

type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};
type Either<T, U> = Only<T, U> | Only<U, T>;

// type RenderEntityFieldProps<T> = Parameters<CustomField<T>["render"]>[0];
type AllowList = {
  allowList: string[];
};
type DisallowList = {
  disallowList: string[];
};
type EntityFieldTypesFilter = { types: EntityFieldTypes[] };
type RenderEntityFieldFilter = Either<
  EntityFieldTypesFilter,
  Either<AllowList, DisallowList>
>;

type EntityFieldTypes = "type.string" | "type.image" | `c_${string}`;

const DEFAULT_DISALLOWED_ENTITY_FIELDS = [
  "uid",
  "meta",
  "slug",
  "c_visualConfigurations",
  "c_pages_layouts",
];
const TOP_LEVEL_ONLY_FIELD_TYPES = ["type.image", "type.hours", "type.address"];
// const TOP_LEVEL_ONLY_FIELD_TYPES = ["type.image", "type.hours"];

type EntityFieldNameAndSchema = {
  name: string;
  schemaField: YextSchemaField;
};

/**
 * Returns a list of {@link EntityFieldNameAndSchema} given a {@link YextSchemaField}.
 * @param schemaField Returns a
 * @returns
 */
const getEntityFieldNames = (
  schemaField: YextSchemaField
): EntityFieldNameAndSchema[] => {
  const entityFieldNames: EntityFieldNameAndSchema[] = [];
  if (DEFAULT_DISALLOWED_ENTITY_FIELDS.includes(schemaField.name)) {
    return entityFieldNames;
  }

  return walkSubfields(schemaField, "");
};

const walkSubfields = (
  schemaField: YextSchemaField,
  fieldName: string
): EntityFieldNameAndSchema[] => {
  const fieldNameInternal = fieldName
    ? `${fieldName}.${schemaField.name}`
    : schemaField.name;

  if (
    TOP_LEVEL_ONLY_FIELD_TYPES.includes(schemaField.definition.typeName) ||
    TOP_LEVEL_ONLY_FIELD_TYPES.includes(schemaField.definition.typeRegistryId)
  ) {
    return [{ name: fieldNameInternal, schemaField: schemaField }];
  }

  if (
    schemaField.children?.fields &&
    schemaField.children?.fields?.length > 0
  ) {
    const fieldNames: EntityFieldNameAndSchema[] = [];
    for (const child of schemaField.children.fields) {
      fieldNames.push(...walkSubfields(child, fieldNameInternal));
    }
    return fieldNames;
  }

  return [{ name: fieldNameInternal, schemaField: schemaField }];
};

const getTypeFromSchemaField = (schemaField: YextSchemaField) => {
  return (
    schemaField.definition.typeName ||
    schemaField.definition.typeRegistryId ||
    Object.entries(schemaField.definition.type)[0][1]
  );
};

// TODO: Do this on the Go side
const getEntityTypeToFieldNames = (
  schemaFields: YextSchemaField[],
  filter: {
    includeSubfields: boolean;
  }
): Map<string, string[]> => {
  return schemaFields.reduce((prev: Map<string, string[]>, field) => {
    if (field.definition.isList) {
      return prev;
    }

    if (filter.includeSubfields) {
      const fieldNameToSchemas = getEntityFieldNames(field); // already recursed
      if (fieldNameToSchemas.length === 0) {
        return prev;
      }
      for (const fieldNameToSchema of fieldNameToSchemas) {
        const typeName = getTypeFromSchemaField(fieldNameToSchema.schemaField);
        if (!typeName) {
          continue;
        }

        if (!prev.has(typeName)) {
          prev = prev.set(typeName, [fieldNameToSchema.name]);
        } else {
          prev.get(typeName)?.push(fieldNameToSchema.name);
        }
      }
    } else {
      const typeName = getTypeFromSchemaField(field);
      if (!typeName) {
        return prev;
      }

      if (!prev.has(typeName)) {
        prev = prev.set(typeName, [field.definition.name]);
      } else {
        prev.get(typeName)?.push(field.definition.name);
      }
    }

    return prev;
  }, new Map<string, string[]>());
};

const getFilteredEntityFields = (filter?: RenderEntityFieldFilter) => {
  const entityFields = useEntityFields();
  console.log("entityFields", entityFields);
  console.log(
    "entityFieldNames",
    entityFields.stream.schema.fields.flatMap(getEntityFieldNames)
  );
  console.log(
    "entityTypeToNames",
    getEntityTypeToFieldNames(entityFields.stream.schema.fields, {
      includeSubfields: true,
    })
  );

  let filteredEntityFields = entityFields.stream.expression.fields
    // filter to top level fields for now, though this is only based on the dot in the stream field, not the true schema
    .filter((field) => field.children === undefined)
    .filter((field) => !DEFAULT_DISALLOWED_ENTITY_FIELDS.includes(field.name));

  if (filter?.allowList) {
    filteredEntityFields = filteredEntityFields.filter((field) =>
      filter.allowList.includes(field.name)
    );
  }

  if (filter?.disallowList) {
    filteredEntityFields = filteredEntityFields.filter(
      (field) => !filter.disallowList.includes(field.name)
    );
  }

  if (filter?.types) {
    // TODO: Do this on the Go side
    const typeToFieldNames = entityFields.stream.schema.fields.reduce(
      (prev: Map<string, string[]>, field) => {
        if (field.definition.isList) {
          return prev;
        }
        const typeName =
          field.definition.typeName || field.definition.typeRegistryId;
        if (!prev.has(typeName)) {
          return prev.set(typeName, [field.definition.name]);
        }

        prev.get(typeName)?.push(field.definition.name);

        return prev;
      },
      new Map<string, string[]>()
    );
    console.log("typeToFieldNames", typeToFieldNames);

    filter.types.forEach((type) => {
      filteredEntityFields = filteredEntityFields.filter((field) =>
        typeToFieldNames.get(type)?.includes(field.name)
      );
    });
  }

  return filteredEntityFields;
};

type RenderProps = Parameters<CustomField<any>["render"]>[0];

type RenderEntityFields<T extends RenderProps> = {
  renderProps: RenderProps;
  fieldName: keyof T["value"];
  objectFields?: ObjectField<any>["objectFields"];
  filter?: RenderEntityFieldFilter;
};

const renderEntityFields = <T extends RenderProps>(
  props: RenderEntityFields<T>
) => {
  console.log("renderProps", props.renderProps);
  const filteredEntityFields = getFilteredEntityFields(props.filter);

  const objectFields = {} as any;
  objectFields[props.fieldName] = {
    label: "Entity Field",
    type: "select",
    options: filteredEntityFields.map((field) => {
      return { label: field.name, value: field.name };
    }),
  };

  return (
    <>
      <FieldLabel label={props.renderProps.field.label!}>
        <AutoField
          field={{
            type: "object",
            objectFields: {
              ...objectFields,
              ...props.objectFields,
            },
          }}
          onChange={(value) => props.renderProps.onChange(value)}
          value={props.renderProps.value}
        />
      </FieldLabel>
    </>
  );
};

const heroFields: Fields<HeroProps> = {
  imageMode: {
    label: "Image Mode",
    type: "radio",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  title: {
    type: "custom",
    label: "Location Name",
    render: (props) =>
      renderEntityFields<typeof props>({
        renderProps: props,
        fieldName: "entityField",
        objectFields: {
          size: {
            label: "Size",
            type: "radio",
            options: [
              { label: "Page", value: "page" },
              { label: "Section", value: "section" },
              { label: "Subheading", value: "subheading" },
            ],
          },
          color: {
            label: "Color",
            type: "radio",
            options: [
              { label: "Default", value: "default" },
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
            ],
          },
        },
        filter: {
          types: ["type.string"],
        },
      }),
  },
  // hours: {
  //   type: "custom",
  //   label: "Hours",
  //   render: (props) =>
  //     renderEntityFields<typeof props>({
  //       renderProps: props,
  //       fieldName: "entityField",
  //     }),
  // },
  // image: {
  //   type: "custom",
  //   label: "Image",
  //   render: (props) =>
  //     renderEntityFields<typeof props>({
  //       renderProps: props,
  //       fieldName: "entityField",
  //       filter: { types: ["type.image"] },
  //     }),
  // },
  location: {
    type: "object",
    label: "Location",
    objectFields: {
      size: {
        label: "Size",
        type: "radio",
        options: [
          { label: "Page", value: "page" },
          { label: "Section", value: "section" },
          { label: "Subheading", value: "subheading" },
        ],
      },
      color: {
        label: "Color",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
    },
  },
  cta1: {
    type: "object",
    label: "CTA 1",
    objectFields: {
      variant: {
        label: "Variant",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Secondary", value: "secondary" },
          { label: "Link", value: "link" },
        ],
      },
    },
  },
  cta2: {
    type: "object",
    label: "CTA 2",
    objectFields: {
      variant: {
        label: "Variant",
        type: "radio",
        options: [
          { label: "Default", value: "default" },
          { label: "Secondary", value: "secondary" },
          { label: "Link", value: "link" },
        ],
      },
    },
  },
};

// type HeroFoo = {
//   image: ComplexImageType | ImageType;
//   cta1: Cta;
//   cta2: Cta;
// }

const resolveProp = <T,>(entityField: string): T => {
  const document = useDocument() as any;
  // return constant value first if it exists
  return document[entityField] || (entityField as T);
};

const Hero = ({
  imageMode,
  title,
  hours,
  image,
  location,
  cta1,
  cta2,
}: HeroProps) => {
  const {
    address,
    // name: locationName,
    c_hero: hero,
  } = useDocument<LocationStream>();

  const imageData = resolveProp<ComplexImageType | ImageType>(
    image?.entityField
  );

  return (
    <Section className="components">
      <div
        className={cn(
          "flex flex-col gap-x-10 md:flex-row",
          imageMode === "right" && "md:flex-row-reverse"
        )}
      >
        {hero?.image && (
          <EntityField displayName="Hero Image" fieldId="c_hero.image">
            <Image
              className="rounded-[30px] max-w-3xl max-h-96"
              image={hero.image}
            />
          </EntityField>
        )}
        <div className="flex flex-col justify-center gap-y-3 pt-8">
          <EntityField displayName="Location Name" fieldId="name">
            {/* <Heading level={2} size={name.size} color={name.color}>
              {locationName}
            </Heading> */}
            <Heading level={2} size={title.size} color={title.color}>
              {/* <EntityFieldRenderer field={name.entityField} type="STRING" /> */}
              {resolveProp<string>(title.entityField)}
            </Heading>
          </EntityField>
          <EntityField displayName="City" fieldId="address">
            <Heading level={1} size={location.size} color={location.color}>
              {address?.city}
            </Heading>
          </EntityField>
          {hours && (
            <EntityField displayName="Hours" fieldId="hours">
              <HoursStatus
                className="font-semibold"
                hours={resolveProp<HoursType>(hours.entityField)}
              />
            </EntityField>
          )}
          {/* {imageData && (
            <EntityField displayName="Image" fieldId="image">
              <Image className="font-semibold" image={imageData} />
            </EntityField>
          )} */}
          <div className="flex">
            {hero?.cta1 && (
              <EntityField displayName="CTA" fieldId="hero.cta1">
                <CTA
                  className="mr-3"
                  variant={cta1.variant}
                  label={hero.cta1.name}
                  url={hero.cta1.link ? hero.cta1.link : "#"}
                />
              </EntityField>
            )}
            {hero?.cta2 && (
              <EntityField displayName="CTA" fieldId="hero.cta2">
                <CTA
                  variant={cta2.variant}
                  label={hero.cta2.name}
                  url={hero.cta2.link ? hero.cta2.link : "#"}
                />
              </EntityField>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

type EntityFieldRenderer = {
  field: any;
  type: "STRING";
};

// TODO: what do we render when the field doesn't exist?
// 1. render nothing
// 2. somehow show an error? not sure this is possible
// 3. should this even be a component or should users implement this themselves? It's only good for simple string fields atm
// 4. how to render complete fields?
const EntityFieldRenderer = ({ field, type }: EntityFieldRenderer) => {
  const document = useDocument() as any;
  // return constant value first if it exists
  return document[field] || field;

  // if (fieldValue) {
  //   switch (type) {
  //     case "STRING": {
  //       if (typeof fieldValue !== "string") {
  //         return (
  //           <div>
  //             CANNOT RENDER {field} as {type}
  //           </div>
  //         );
  //       }
  //       return fieldValue;
  //     }
  //   }
  // }
  // return <></>;
};

export const HeroComponent: ComponentConfig<HeroProps> = {
  fields: heroFields,
  defaultProps: {
    imageMode: "left",
    title: {
      size: "section",
      color: "default",
      entityField: "name", // TODO: check what happens when the field doesn't exist
    },
    hours: {
      entityField: "hours",
    },
    image: {
      entityField: "c_hero.image",
    },
    location: {
      size: "section",
      color: "default",
    },
    cta1: {
      variant: "default",
    },
    cta2: {
      variant: "default",
    },
  },
  // resolveData: async ({ props }) => {
  //   const data = {
  //     props: { ...props },
  //     readOnly: {},
  //   };

  //   console.log("data in resolveData", data);

  //   if (props.name) {
  //     // this is where fetchentitydocument is called
  //     // const document = useDocument() as any;
  //     // const name = document[props.name];
  //     // const fields = await getEntityFieldsList("address");
  //     // const field = fields.find(
  //     //   (field) => field.fieldId === props.addressField
  //     // );
  //     // const value = field?.value as AddressType;
  //     // if (field) {
  //     //   data.props = {
  //     //     ...value,
  //     //     addressField: props.addressField,
  //     //     id: props.id,
  //     //   };
  //     //   data.readOnly = {
  //     //     line1: true,
  //     //     city: true,
  //     //     region: true,
  //     //     postalCode: true,
  //     //     countryCode: true,
  //     //   };
  //     // }
  //   }

  //   return data;
  // },
  render: ({ imageMode, title, hours, image, location, cta1, cta2 }) => (
    <Hero
      imageMode={imageMode}
      title={title}
      hours={hours}
      image={image}
      location={location}
      cta1={cta1}
      cta2={cta2}
    />
  ),
};
