import { ComponentConfig } from "@measured/puck";

export type BasicComponentProps = {};

export const BasicComponent = () => {
  return <p>Hello</p>;
};

export const Basic: ComponentConfig<BasicComponentProps> = {
  render: () => <BasicComponent />,
};
