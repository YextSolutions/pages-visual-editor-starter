import { defineConfig } from "i18next-cli";
import {
  locales,
  sharedExtractConfig,
} from "./i18next-cli.shared.config.ts";

export default defineConfig({
  locales,
  extract: {
    ...sharedExtractConfig,
    output: "src/library/i18n/page/{{language}}.json",
    functions: ["t", "*.t", "i18next.t"],
  },
});
