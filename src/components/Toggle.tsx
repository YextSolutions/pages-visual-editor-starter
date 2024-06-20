import { ComponentConfig } from "@measured/puck";

export type ToggleProps = {
  textAlign: "left" | "right";
};

export const Toggle: ComponentConfig<ToggleProps> = {
  fields: {
    textAlign: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    textAlign: "left",
  },
  render: ({ textAlign }) => {
    return (
      <p className="text-lg font-bold" style={{ textAlign }}>
        Toggle me
      </p>
    );
  },
};
