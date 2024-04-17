import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";

type Props = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

// All the avaliable components
export const config: Config<Props> = {
  components: {
    Toggle,
    Hero,
  },
  root: {
    fields: {}
  }
};

export default config;
