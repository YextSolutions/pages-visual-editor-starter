import {
  AutoField,
  ComponentConfig,
  CustomField,
  FieldLabel,
  Fields,
  ObjectField,
  SelectField,
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
  YextSchemaField,
} from "@yext/visual-editor";
import "./index.css";
import { config } from "../templates/location";
import { Unlock } from "lucide-react";

import "./entityField.css";

export type EntityField = {
  name: string;
  value: string;
};

export type HeroProps = {
  imageMode: "left" | "right";
  custom: {
    entityField: EntityField;
    value: string;
  };
  title: {
    size: HeadingProps["size"];
    color: HeadingProps["color"];
    entityField: string;
    titleValue: string;
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

type ConfigFields<T extends Record<string, any>> = T["stream"]["fields"];

type AllowList<T extends Record<string, any>> = {
  allowList: ConfigFields<T>[number][];
};

type DisallowList<T extends Record<string, any>> = {
  disallowList: ConfigFields<T>[number][];
};

type EntityFieldTypesFilter = {
  types?: EntityFieldTypes[];
  includeSubfields?: boolean;
};
type RenderEntityFieldFilter<T extends Record<string, any>> =
  EntityFieldTypesFilter & Either<AllowList<T>, DisallowList<T>>;

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

export const getFilteredEntityFields = <T extends Record<string, any>>(
  filter?: RenderEntityFieldFilter<T>
) => {
  const entityFields = useEntityFields();

  console.log("entityFields", entityFields);

  let filteredEntityFields = entityFields.stream.schema.fields
    // filter to top level fields for now, though this is only based on the dot in the stream field, not the true schema
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
    const typeToFieldNames = getEntityTypeToFieldNames(filteredEntityFields, {
      includeSubfields: true,
    });

    filter.types.forEach((type) => {
      filteredEntityFields = filteredEntityFields.filter((field) =>
        typeToFieldNames.get(type)?.includes(field.name)
      );
    });
  }

  if (filter?.includeSubfields) {
    const filterEntitySubFields: YextSchemaField[] = [];
    for (const yextSchemaField of filteredEntityFields) {
      const entityFieldNames = getEntityFieldNames(yextSchemaField);
      for (const entityFieldName of entityFieldNames) {
        filterEntitySubFields.push({
          ...entityFieldName.schemaField,
          name: entityFieldName.name,
        });
      }
    }
    filteredEntityFields = filterEntitySubFields;
  }

  return filteredEntityFields;
};

type RenderProps = Parameters<CustomField<any>["render"]>[0];

type RenderEntityFields<
  T extends RenderProps,
  U extends Record<string, any>,
> = {
  renderProps: RenderProps;
  fieldName: keyof T["value"];
  objectFields?: ObjectField<any>["objectFields"];
  filter?: RenderEntityFieldFilter<U>;
};

const renderEntityFields = <
  T extends RenderProps,
  U extends Record<string, any>,
>(
  props: RenderEntityFields<T, U>
) => {
  // console.log("renderProps", props);
  // const entityFields = useEntityFields();
  // const entityFieldNames =
  //   entityFields.stream.schema.fields.flatMap(getEntityFieldNames);
  // console.log("entityFieldNames", entityFieldNames);
  // console.log(
  //   "entityTypeToNames",
  //   getEntityTypeToFieldNames(
  //     entityFieldNames.flatMap((x) => x.schemaField),
  //     { includeSubfields: true }
  //   )
  // );
  const filteredEntityFields = getFilteredEntityFields<U>(props.filter);
  // console.log("filteredEntityFields", filteredEntityFields);

  // const objectFields = {} as any;
  // objectFields[props.fieldName] = {
  //   // props.fieldName is "entityField"
  //   label: "Entity Field",
  //   type: "select",
  //   options: filteredEntityFields.map((entityFieldNameToSchema) => {
  //     return {
  //       label: entityFieldNameToSchema.name,
  //       value: entityFieldNameToSchema.name,
  //     };
  //   }),
  // };
  // objectFields["titleValue"] = {
  //   label: "Title",
  //   type: "text",
  // };

  return (
    <>
      <FieldLabel label={props.renderProps.field.label!}>
        <AutoField
          // readOnly={true}
          field={{
            type: "select",
            label: "Entity Field",
            options: filteredEntityFields.map((entityFieldNameToSchema) => {
              return {
                label: entityFieldNameToSchema.name,
                value: entityFieldNameToSchema.name,
              };
            }),
          }}
          onChange={(value) => props.renderProps.onChange(value)}
          value={props.renderProps.value}
        />
        <AutoField
          readOnly={props.renderProps.readOnly}
          field={{
            label: "Title",
            type: "text",
          }}
          onChange={(value) => props.renderProps.onChange(value)}
          value={props.renderProps.value}
        />
        <AutoField
          field={{
            type: "object",
            objectFields: {
              // ...objectFields,
              ...props.objectFields,
            },
          }}
          // readOnly={true}
          onChange={(value) => props.renderProps.onChange(value)}
          value={props.renderProps.value}
        />
      </FieldLabel>
    </>
  );
};

type RenderYextEntityFieldSelectorProps<T extends Record<string, any>> = {
  // renderProps: RenderProps;
  // fieldName: keyof T["value"];
  // objectFields?: ObjectField<any>["objectFields"];
  label?: string;
  filter?: RenderEntityFieldFilter<T>;
};

// export const YextEntityFieldSelector = <T extends RenderProps>(
//   props: RenderYextEntityFieldSelectorProps<T>
// ) => {
//   return {
//     type: "object",
//     // label: "foo",
//     objectFields: {
//       name: {
//         type: "custom",
//         label: props.label,
//         render: ({
//           field,
//           value,
//           onChange,
//           readOnly,
//           id,
//           name,
//         }: RenderProps) => {
//           console.log("field", field);
//           console.log("value", value);
//           console.log("readOnly", readOnly);
//           console.log("id", id);
//           console.log("name", name);

//           const filteredEntityFields = getFilteredEntityFields(props.filter);

//           const document = useDocument();
//           console.log(document);

//           return (
//             <>
//               <FieldLabel
//                 label={field.label || "Label is undefined"}
//                 readOnly={readOnly}
//               >
//                 <AutoField
//                   field={{
//                     type: "select",
//                     label: "foo",
//                     options: [
//                       { value: "", label: "Select a Content field" },
//                       ...filteredEntityFields.map((entityFieldNameToSchema) => {
//                         return {
//                           label: entityFieldNameToSchema.name,
//                           value: entityFieldNameToSchema.name,
//                         };
//                       }),
//                     ],
//                   }}
//                   onChange={(value) => {
//                     console.log("onchange value", value);
//                     onChange({
//                       name: value as unknown as string, // hack because the option value is a string so it comes back as a string even though TS thinks it's an object
//                       value: resolveProp(document, value as unknown as string),
//                     });
//                     // onChange(value);
//                   }}
//                   // value={value.name}
//                   value={value}
//                   readOnly={readOnly}
//                 />
//                 {value && (
//                   <button
//                     type="button"
//                     className={"entityField"}
//                     onClick={() => {
//                       // onChange({ name: "", value: value.value });
//                       onChange("");
//                     }}
//                     disabled={readOnly}
//                   >
//                     <span className="entityField-unlock-icon">
//                       <Unlock size={16} />
//                     </span>
//                     <span>Use a constant value</span>
//                   </button>
//                 )}
//               </FieldLabel>
//               {/* <FieldLabel
//                 label={"Constant Value"}
//                 icon={"hi"}
//                 readOnly={readOnly}
//               >
//                 <AutoField
//                   readOnly={readOnly}
//                   onChange={(value) =>
//                     onChange({
//                       name: "",
//                       value: value,
//                     })
//                   }
//                   value={value.value}
//                   field={{
//                     type: "text",
//                     label: "foo",
//                   }}
//                 />
//               </FieldLabel> */}
//             </>
//           );
//         },
//       },
//       // resolveProp(document, value as unknown as string)
//       value: {
//         label: "Constant Value",
//         type: "custom",
//         render: ({
//           field,
//           value,
//           onChange,
//           readOnly,
//           id,
//           name,
//         }: RenderProps) => {
//           const document = useDocument();
//           console.log(document);

//           console.log("value field", field);
//           console.log("value value", value);
//           console.log("value readOnly", readOnly);
//           console.log("value id", id);
//           console.log("value name", name);

//           return (
//             <FieldLabel
//               label={"Constant Value"}
//               icon={"hi"}
//               readOnly={readOnly}
//             >
//               <AutoField
//                 readOnly={readOnly}
//                 onChange={(value) => onChange(value)}
//                 value={resolveProp(document, value)}
//                 field={{
//                   type: "text",
//                   label: "foo",
//                 }}
//               />
//             </FieldLabel>
//           );
//         },
//       },
//     },
//   };
// };

export const YextEntityFieldSelector = <T extends RenderProps>(
  props: RenderYextEntityFieldSelectorProps<T>
) => {
  return {
    type: "custom",
    label: props.label,
    render: ({ field, value, onChange, readOnly, id, name }: RenderProps) => {
      const filteredEntityFields = getFilteredEntityFields(props.filter);
      const document = useDocument();

      return (
        <>
          <FieldLabel
            label={field.label || "Label is undefined"}
            readOnly={readOnly === "name"}
          >
            <AutoField
              field={{
                type: "select",
                options: [
                  { value: "", label: "Select a Content field" },
                  ...filteredEntityFields.map((entityFieldNameToSchema) => {
                    return {
                      label: entityFieldNameToSchema.name,
                      value: entityFieldNameToSchema.name,
                    };
                  }),
                ],
              }}
              onChange={(value) => {
                onChange({
                  name: value as unknown as string, // hack because the option value is a string so it comes back as a string even though TS thinks it's an object
                  value: resolveProp(document, value as unknown as string),
                });
              }}
              value={value.name}
              readOnly={readOnly === "name"}
            />
            {value.name && (
              <button
                type="button"
                className={"entityField"}
                onClick={() => {
                  onChange({ name: "", value: value.value });
                }}
                disabled={readOnly === "name"}
              >
                <span className="entityField-unlock-icon">
                  <Unlock size={16} />
                </span>
                <span>Use a constant value</span>
              </button>
            )}
          </FieldLabel>
          <FieldLabel
            label={readOnly === "value" ? "Value" : "Constant Value"}
            readOnly={readOnly === "value"}
            className="entityField-value"
          >
            <AutoField
              readOnly={readOnly === "value"}
              onChange={(value) =>
                onChange({
                  name: "",
                  value: value,
                })
              }
              value={value.value}
              field={{
                type: "text",
              }}
            />
          </FieldLabel>
        </>
      );
    },
  };
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
  custom: {
    type: "object",
    label: "Location Name",
    objectFields: {
      entityField: YextEntityFieldSelector<typeof config>({
        label: "Entity Field",
        filter: {
          types: ["type.string"],
          includeSubfields: true,
        },
      }),
    },
    //   {
    //     type: "custom",
    //     label: "Entity Field",
    //     render: ({ field, value, onChange, readOnly, id, name }) => {
    //       console.log("field", field);
    //       console.log("value", value);
    //       console.log("readOnly", readOnly);
    //       console.log("id", id);
    //       console.log("name", name);

    //       const filteredEntityFields = getFilteredEntityFields({
    //         types: ["type.string"],
    //         includeSubfields: true,
    //       });

    //       const document = useDocument();
    //       console.log(document);

    //       return (
    //         <FieldLabel
    //           label={field.label || "Label is undefined"}
    //           readOnly={readOnly}
    //         >
    //           <AutoField
    //             field={{
    //               type: "select",
    //               label: "foo",
    //               options: [
    //                 { value: "", label: "Select a Content field" },
    //                 ...filteredEntityFields.map((entityFieldNameToSchema) => {
    //                   return {
    //                     label: entityFieldNameToSchema.name,
    //                     value: entityFieldNameToSchema.name,
    //                   };
    //                 }),
    //               ],
    //             }}
    //             onChange={(value) => {
    //               console.log("onchange value", value);
    //               onChange({
    //                 name: value as unknown as string, // hack because the option value is a string so it comes back as a string even though TS thinks it's an object
    //                 value: resolveProp(document, value as unknown as string),
    //               });
    //             }}
    //             value={value.name}
    //             readOnly={readOnly}
    //           />
    //           {value.name && (
    //             <button
    //               type="button"
    //               className={"entityField"}
    //               onClick={() => {
    //                 onChange({ name: "", value: "" });
    //               }}
    //               disabled={readOnly}
    //             >
    //               <span className="entityField-unlock-icon">
    //                 <Unlock size={16} />
    //               </span>
    //               <span>Use a constant value</span>
    //             </button>
    //           )}
    //         </FieldLabel>
    //       );
    //     },
    //   },
    //   value: {
    //     type: "text",
    //     label: "Value",
    //   },
    // },

    // render: ({ field, value, onChange }) => {
    //   console.log("field", field);
    //   return (
    //     <AutoField
    //       field={{ type: "text", label: "foo" }}
    //       onChange={(value) => onChange(value)}
    //       value={value}
    //     />
    //   );
    // },
  },
  title: {
    //   type: "object",
    //   label: "Location Name",
    //   objectFields: {
    //     entityField: {
    //       label: "Entity Field",
    //       type: "text",
    //     },
    //     titleValue: {
    //       label: "Title Value",
    //       type: "text",
    //     },
    //     size: {
    //       label: "Size",
    //       type: "radio",
    //       options: [
    //         { label: "Page", value: "page" },
    //         { label: "Section", value: "section" },
    //         { label: "Subheading", value: "subheading" },
    //       ],
    //     },
    //     color: {
    //       label: "Color",
    //       type: "radio",
    //       options: [
    //         { label: "Default", value: "default" },
    //         { label: "Primary", value: "primary" },
    //         { label: "Secondary", value: "secondary" },
    //       ],
    //     },
    //   },
    type: "custom",
    label: "Location Name",
    render: (props) =>
      renderEntityFields<typeof props, typeof config>({
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
          // types: ["type.image"],
          allowList: ["c_productSection"],
          includeSubfields: true,
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

const resolveProp = <T,>(document: any, entityField: string): T => {
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
  custom,
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
              {/* {resolveProp<string>(document, title.entityField)} */}
              {custom.entityField.value}
            </Heading>
          </EntityField>
          <EntityField displayName="City" fieldId="address">
            <Heading level={1} size={location.size} color={location.color}>
              {address?.city}
            </Heading>
          </EntityField>
          {/* {hours && (
            <EntityField displayName="Hours" fieldId="hours">
              <HoursStatus
                className="font-semibold"
                hours={resolveProp<HoursType>(hours.entityField)}
              />
            </EntityField>
          )} */}
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
    custom: {
      entityField: {
        name: "",
        value: "",
      },
      value: "default value",
    },
  },
  resolveData: ({ props }, { changed }) => {
    if (!props.custom?.entityField?.name) {
      return {
        props,
        readOnly: {
          "custom.entityField": false,
        },
      };
    }

    if (!changed.custom) {
      return { props };
    }

    console.log("!!!!", props.custom?.entityField);

    return {
      props,
      readOnly: {
        "custom.entityField": "value",
      },
    };
  },
  render: ({
    imageMode,
    title,
    hours,
    image,
    location,
    cta1,
    cta2,
    custom,
  }) => (
    <Hero
      imageMode={imageMode}
      title={title}
      hours={hours}
      image={image}
      location={location}
      cta1={cta1}
      cta2={cta2}
      custom={custom}
    />
  ),
};
