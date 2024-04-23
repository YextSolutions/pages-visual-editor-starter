import { ComponentConfig } from "@measured/puck";
import { Button } from "@chakra-ui/react";

export type ColorProps = {
  buttonColor: string;
};

export const Color: ComponentConfig<ColorProps> = {
  fields: {
    buttonColor: {
      type: "radio",
      options: [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Yellow", value: "yellow" },
        { label: "Purple", value: "purple" },
        { label: "Orange", value: "orange" },
        { label: "Gray", value: "gray" },
        { label: "Teal", value: "teal" },
        { label: "Pink", value: "pink" },
        { label: "Cyan", value: "cyan" },
      ],
    },
  },
  defaultProps: {
    buttonColor: "blue",
  },
  render: ({ buttonColor }) => {
    return (
      <Button
        colorScheme={buttonColor}
        onClick={() => {
          console.log("Hello world!");
        }}
      >
        Color me!
      </Button>
    );
  },
};
