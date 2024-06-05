import { ComponentConfig } from "@measured/puck";

export const spacingOptions = [
  { label: "8px", value: "8px" },
  { label: "16px", value: "16px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "40px", value: "40px" },
  { label: "48px", value: "48px" },
  { label: "56px", value: "56px" },
  { label: "64px", value: "64px" },
  { label: "72px", value: "72px" },
  { label: "80px", value: "80px" },
  { label: "88px", value: "88px" },
  { label: "96px", value: "96px" },
  { label: "104px", value: "104px" },
  { label: "112px", value: "112px" },
  { label: "120px", value: "120px" },
  { label: "128px", value: "128px" },
  { label: "136px", value: "136px" },
  { label: "144px", value: "144px" },
  { label: "152px", value: "152px" },
  { label: "160px", value: "160px" },
];

export type DividerProps = {
  size: string;
  showDividerLine?: boolean;
};

export const Divider: ComponentConfig<DividerProps> = {
  label: "Divider",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
    },
    showDividerLine: {
      type: "radio",
      label: "Divider Line",
      options: [
        { label: "Hide", value: false },
        { label: "Show", value: true },
      ],
    },
  },
  defaultProps: {
    size: "24px",
    showDividerLine: true,
  },
  render: ({ size, showDividerLine }) => {
    return (
      <div className="w-full flex items-center" style={{ height: size }}>
        {showDividerLine && <div className="w-full h-px bg-gray-200"></div>}
      </div>
    );
  },
};
