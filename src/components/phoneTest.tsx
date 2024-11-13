import { ComponentConfig, Fields } from "@measured/puck";
import {
  EntityField,
  resolveYextEntityField,
  useDocument,
  YextEntityField,
  YextEntityFieldSelector,
} from "@yext/visual-editor";
import { Phone } from "lucide-react";
import { config } from "process";
import { format_phone } from "../utils/reusableFunctions";

interface PhoneTestProps {
  //@ts-ignore
  mainPhone: YextEntityField;
}

const defaults: Fields<PhoneTestProps> = {
  //@ts-ignore
  mainPhone: YextEntityFieldSelector<typeof config>({
    label: "Main phone",
    filter: { types: ["type.phone"] },
  }),
};

const PhoneTestCard = ({ mainPhone: phoneField }: PhoneTestProps) => {
  const document = useDocument();
  const mainPhone = resolveYextEntityField<string>(document, phoneField);
  return (
    <>
      {mainPhone && (
        <EntityField
          displayName="Body"
          fieldId={
            phoneField.constantValueEnabled
              ? "constant value"
              : phoneField.field
          }
        >
          <a
            href={`tel:${mainPhone}`}
            className="flex gap-1 text-center items-center"
          >
            <Phone className="md:h-5 md:w-5 h-4 w-4" aria-hidden="true" />
            {format_phone(mainPhone)}
          </a>
        </EntityField>
      )}
    </>
  );
};

const PhoneTest: ComponentConfig<PhoneTestProps> = {
  fields: defaults,
  defaultProps: {
    mainPhone: {
      label: "Phone number",
      constantValue: "123456789",
      constantValueEnabled: true,
    },
  },
  render: (props) => <PhoneTestCard {...props} />,
};

export { PhoneTest, PhoneTestProps };
