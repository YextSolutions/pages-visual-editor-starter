import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";

type Props = {
  Toggle: ToggleProps;
};

export const config: Config<Props> = {
  components: {
    Toggle,
  },
};

export default config;
