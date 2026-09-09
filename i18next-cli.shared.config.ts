import type { I18nextToolkitConfig } from "i18next-cli";

export const locales = [
  "cs",
  "da",
  "de",
  "en-GB",
  "en",
  "es",
  "et",
  "fi",
  "fr",
  "hr",
  "hu",
  "it",
  "ja",
  "lt",
  "lv",
  "nb",
  "nl",
  "pl",
  "pt",
  "ro",
  "sk",
  "sv",
  "tr",
  "zh",
  "zh-TW",
];

export const sharedExtractConfig: Omit<
  I18nextToolkitConfig["extract"],
  "functions" | "output"
> = {
  input: "src/library/**/*.{ts,tsx,js,jsx}",
  ignore: ["src/library/.generated/**", "**/__screenshots__/**"],
  defaultNS: false,
  contextSeparator: "_",
  pluralSeparator: "_",
  interpolationPrefix: "{{",
  interpolationSuffix: "}}",
  primaryLanguage: "en",
  defaultValue: "",
  sort: true,
  indentation: 2,
  removeUnusedKeys: true,
};
