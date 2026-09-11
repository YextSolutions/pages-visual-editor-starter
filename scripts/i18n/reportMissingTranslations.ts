import path from "node:path";
import { locales as configuredLocales } from "../../i18next-cli.shared.config.ts";
import { flatten, loadJson, type FlatTranslations } from "./jsonUtils.ts";

const primaryLocale = "en";
const pluralForms = new Set(["zero", "one", "two", "few", "many", "other"]);

const pluralBase = (key: string): string | null => {
  const separatorIndex = key.lastIndexOf("_");
  return separatorIndex >= 0 && pluralForms.has(key.slice(separatorIndex + 1))
    ? key.slice(0, separatorIndex)
    : null;
};

const requiredKeysForLocale = (
  english: FlatTranslations,
  localized: FlatTranslations,
  locale: string,
): Set<string> => {
  const keys = new Set(Object.keys(localized));
  const pluralFamilies = new Set<string>();
  const explicitZeroFamilies = new Set<string>();

  for (const key of Object.keys(english)) {
    const base = pluralBase(key);
    if (base === null) {
      keys.add(key);
      continue;
    }
    pluralFamilies.add(base);
    if (key === `${base}_zero`) explicitZeroFamilies.add(base);
  }

  for (const base of pluralFamilies) {
    const type = base.endsWith("_ordinal") ? "ordinal" : "cardinal";
    const pluralCategories = new Intl.PluralRules(locale, {
      type,
    }).resolvedOptions().pluralCategories;
    for (const category of pluralCategories) {
      keys.add(`${base}_${category}`);
    }
    if (explicitZeroFamilies.has(base)) keys.add(`${base}_zero`);
  }

  return keys;
};

export const resolveEnglishSource = (
  key: string,
  english: FlatTranslations,
): string | undefined => {
  if (english[key] !== undefined) {
    return english[key];
  }
  const base = pluralBase(key);
  if (base === null) {
    return undefined;
  }
  return english[`${base}_other`] ?? english[`${base}_one`] ?? english[base];
};

export interface MissingTranslation {
  locale: string;
  key: string;
  english: string;
}

export const findMissingTranslations = async (
  platformDirectory: string,
  locales: readonly string[] = configuredLocales,
): Promise<MissingTranslation[]> => {
  const englishPath = path.join(platformDirectory, `${primaryLocale}.json`);
  const english = flatten(await loadJson(englishPath, { required: true }));
  if (!Object.values(english).some((value) => value.trim())) {
    throw new Error(`English platform input has no values: ${englishPath}`);
  }

  const missing: MissingTranslation[] = [];
  for (const locale of locales) {
    if (locale === primaryLocale) continue;
    const localePath = path.join(platformDirectory, `${locale}.json`);
    const localized = flatten(await loadJson(localePath));
    const keys = requiredKeysForLocale(english, localized, locale);
    for (const key of [...keys].sort()) {
      const source = resolveEnglishSource(key, english);
      if (source !== undefined && source.trim() && !localized[key]?.trim()) {
        missing.push({ locale, key, english: source });
      }
    }
  }
  return missing;
};

export const reportMissingTranslations = async (
  platformDirectory = path.resolve("src/library/i18n/platform"),
  locales: readonly string[] = configuredLocales,
): Promise<void> => {
  const missing = await findMissingTranslations(platformDirectory, locales);
  if (missing.length === 0) {
    console.log("All platform translations are complete.");
    return;
  }
  for (const item of missing) {
    console.log(
      `[${item.locale}] ${item.key} = ${JSON.stringify(item.english)}`,
    );
  }
  console.log(`Missing ${missing.length} platform translation value(s).`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  reportMissingTranslations().catch((error: unknown) => {
    console.error((error as Error).message);
    process.exitCode = 1;
  });
}
