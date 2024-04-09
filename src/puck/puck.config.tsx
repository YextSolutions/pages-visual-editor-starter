import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";

type Props = {
  Toggle: ToggleProps;
};

// All the avaliable components
export const config: Config<Props> = {
  components: {
    Toggle,
  },
};

export default config;
