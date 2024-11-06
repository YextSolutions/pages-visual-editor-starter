import type { ComponentConfig, Fields } from "@measured/puck";
import { useDocument } from "@yext/visual-editor";
import {
  EntityField,
  resolveYextEntityField,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import { LocationStream } from "../types/autogen";

export interface DEComponentProps {
  //@ts-expect-error ts(2322)
  name?: YextEntityField;
  content?: string;
  level: string;
  fontWeight: string;
  label: string;
}

const configWrapperFields: Fields<DEComponentProps> = {
  name: YextEntityFieldSelector({
    label: "Entity Field",
    filter: {
      types: ["type.string"],
    },
  }),
  level: {
    type: "select",
    label: "Heading Level",
    options: [
      { label: "xs", value: "xs" },
      { label: "sm", value: "sm" },
      { label: "base", value: "base" },
      { label: "lg", value: "lg" },
      { label: "xl", value: "xl" },
      { label: "2xl", value: "2xl" },
      { label: "3xl", value: "3xl" },
      { label: "4xl", value: "4xl" },
      { label: "5xl", value: "5xl" },
    ],
  },
  label: { type: "text", label: "Sample Text" },
  fontWeight: {
    type: "select",
    label: "Font Weight",
    options: [
      { label: "Thin", value: "thin" },
      { label: "Extra Light", value: "extralight" },
      { label: "Light", value: "light" },
      { label: "Normal", value: "normal" },
      { label: "Medium", value: "medium" },
      { label: "Semi Bold", value: "semibold" },
      { label: "Bold", value: "bold" },
      { label: "Extra Bold", value: "extrabold" },
      { label: "Black", value: "black" },
    ],
  },
};

// Component definition
const DEEntityComponentWrapper: React.FC<DEComponentProps> = ({
  name,
  level,
  label,
  fontWeight,
}) => {
  const document = useDocument<LocationStream>();
  return (
    <div className="w-full border flex justify-start p-4">
      {label}{" "}
      <h1 className={`text-${level} font-${fontWeight}`}>
        : {resolveYextEntityField(document, name)}
      </h1>
    </div>
  );
};

// Component configuration for Puck
export const DEEntityComponentWrapperComponent: ComponentConfig<DEComponentProps> =
  {
    fields: configWrapperFields,
    defaultProps: {
      name: {
        field: "",
        constantValue: "Sample Heading",
        constantValueEnabled: true,
      },
      content: "Heading",
      level: "base",
      label: "Label",
      fontWeight: "normal",
    },
    render: (props) => <DEEntityComponentWrapper {...props} />,
  };

export { DEEntityComponentWrapper };
