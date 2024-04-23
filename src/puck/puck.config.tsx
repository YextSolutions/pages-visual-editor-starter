import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { Hero, HeroProps } from "../components/Hero";
import { Color, ColorProps } from "../components/Color";

type LocationProps = {
  Toggle: ToggleProps;
  Hero: HeroProps;
};

type OfficeProps = {
  Toggle: ToggleProps;
  Color: ColorProps;
}

// All the available components for locations
export const locationConfig: Config<LocationProps> = {
  components: {
    Toggle,
    Hero,
  },
  root: {
    fields: {}
  }
};

// All the available components for offices
export const officeConfig: Config<OfficeProps> = {
  components: {
    Toggle,
    Color,
  },
  root: {
    fields: {}
  }
};