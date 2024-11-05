import type { ComponentConfig, Fields } from "@measured/puck";

export interface DEStaticComponentWrapperProps {
  label: string;
}
const configWrapperFields: Fields<DEStaticComponentWrapperProps> = {
  label: {
    type: "text",
    label: "Title",
  },
};

const DEStaticComponentWrapper: React.FC<DEStaticComponentWrapperProps> = ({
  label,
}) => {
  return (
    <div className="w-full border flex justify-start p-4">
      <h1 className="text-5xl">{label}</h1>
    </div>
  );
};

export const DEStaticComponentWrapperComponent: ComponentConfig<DEStaticComponentWrapperProps> =
  {
    fields: configWrapperFields,
    defaultProps: {
      label: "Click me",
    },
    render: (props) => <DEStaticComponentWrapper {...props} />,
  };

export { DEStaticComponentWrapper };
