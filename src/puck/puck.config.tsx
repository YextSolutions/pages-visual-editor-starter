import type { Config } from "@measured/puck";
import { Toggle, ToggleProps } from "../components/Toggle";
import { BannerProps, PuckBanner as Banner } from "../components/Banner";
import { CardProps, PuckCard as Card } from "../components/Card";
import { CtaProps, PuckCta as Cta } from "../components/Cta";

type Props = {
  Banner: BannerProps;
  Toggle: ToggleProps;
  Card: CardProps;
  Cta: CtaProps;
};

export const config: Config<Props> = {
  components: {
    Banner,
    Toggle,
    Card,
    Cta,
  },
};

export default config;
