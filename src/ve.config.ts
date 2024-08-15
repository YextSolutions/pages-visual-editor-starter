import type { Config } from "@measured/puck";

// eslint-disable-next-line @typescript-eslint/ban-types
type ProductProps = {
};

export const productConfig: Config<ProductProps> = {
  components: { },
  root: { },
};


export const puckConfigs = new Map<string, Config<any>>([
  ["product",  productConfig],
]);
