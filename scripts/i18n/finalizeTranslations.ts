import path from "node:path";
import { locales as configuredLocales } from "../../i18next-cli.shared.config.ts";
import {
  fileExists,
  flatten,
  loadJson,
  readFileIfPresent,
  saveJson,
  sortObject,
  type FlatTranslations,
  unflatten,
} from "./jsonUtils.ts";
import {
  findMissingTranslations,
  resolveEnglishSource,
} from "./reportMissingTranslations.ts";

const primaryLocale = "en";
const instances = ["platform", "page"] as const;
const pluralForms = new Set(["zero", "one", "two", "few", "many", "other"]);
const interpolationPattern = /\{\{\s*([^{}]+?)\s*\}\}/g;

const pluralBase = (key: string): string | null => {
  const separatorIndex = key.lastIndexOf("_");
  return separatorIndex >= 0 && pluralForms.has(key.slice(separatorIndex + 1))
    ? key.slice(0, separatorIndex)
    : null;
};

const expressions = (value: string): Array<{ raw: string; name: string }> =>
  [...value.matchAll(interpolationPattern)].map((match) => ({
    raw: match[0],
    name: (match[1]?.split(",")[0] ?? "").trim(),
  }));

const counts = (values: string[]): Map<string, number> => {
  const result = new Map<string, number>();
  for (const value of values) result.set(value, (result.get(value) ?? 0) + 1);
  return result;
};

const difference = (expected: string[], actual: string[]): string[][] => {
  const left = counts(expected);
  const right = counts(actual);
  const expand = (source: Map<string, number>, other: Map<string, number>) =>
    [...source].flatMap(([value, count]) =>
      Array.from({ length: Math.max(0, count - (other.get(value) ?? 0)) }, () => value)
    );
  return [expand(left, right), expand(right, left)];
};

const repairInterpolation = (
  englishValue: string,
  localizedValue: string
): string | null => {
  const expected = expressions(englishValue);
  const actual = expressions(localizedValue);
  if (expected.length !== actual.length) return null;
  const [missing, unexpected] = difference(
    expected.map(({ name }) => name),
    actual.map(({ name }) => name)
  );
  if (missing.length !== 1 || unexpected.length !== 1) return null;

  const expectedMatch = expected.find(({ name }) => name === missing[0]);
  let replaced = false;
  return localizedValue.replace(interpolationPattern, (raw, expression: string) => {
    const name = (expression.split(",")[0] ?? "").trim();
    if (!replaced && name === unexpected[0] && expectedMatch) {
      replaced = true;
      return expectedMatch.raw;
    }
    return raw;
  });
};

const lineForKey = (raw: string, key: string): number => {
  const leaf = key.split(".").at(-1) ?? key;
  const escaped = leaf.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`"${escaped}"\\s*:`).exec(raw);
  return match ? raw.slice(0, match.index).split("\n").length : 1;
};

const repairInterpolations = async (
  root: string,
  locales: readonly string[],
  instance: (typeof instances)[number]
): Promise<number> => {
  const ambiguous: string[] = [];
  let repairedCount = 0;
  const directory = path.join(root, instance);
  const englishPath = path.join(directory, `${primaryLocale}.json`);
  const english = flatten(await loadJson(englishPath, { required: true }));
  if (Object.keys(english).length === 0) {
    throw new Error(`English translation input contains no keys: ${englishPath}`);
  }
  for (const locale of locales) {
    if (locale === primaryLocale) continue;
    const localePath = path.join(directory, `${locale}.json`);
    if (!(await fileExists(localePath))) continue;
    const raw = await readFileIfPresent(localePath);
    const localized = flatten(await loadJson(localePath, { required: true }));
    let changed = false;
    for (const [key, localizedValue] of Object.entries(localized)) {
      if (!localizedValue) continue;
      const englishValue = resolveEnglishSource(key, english);
      if (englishValue === undefined) continue;
      const expected = expressions(englishValue).map(({ name }) => name);
      const actual = expressions(localizedValue).map(({ name }) => name);
      const [missing, unexpected] = difference(expected, actual);
      if (missing.length === 0 && unexpected.length === 0) continue;
      const repaired = repairInterpolation(englishValue, localizedValue);
      if (repaired !== null) {
        localized[key] = repaired;
        changed = true;
        repairedCount += 1;
      } else {
        ambiguous.push(
          `${localePath}:${lineForKey(raw, key)} key="${key}" expected [${expected.join(", ")}] but found [${actual.join(", ")}]`
        );
      }
    }
    if (changed) await saveJson(localePath, sortObject(unflatten(localized)));
  }
  if (ambiguous.length) {
    throw new Error(
      `Found ${ambiguous.length} ambiguous interpolation mismatch(es) requiring manual repair:\n${ambiguous.join("\n")}`
    );
  }
  return repairedCount;
};

const pageMembership = (
  pageEnglish: FlatTranslations,
  extractedPage: FlatTranslations,
  platform: FlatTranslations,
  hasExtractedPage: boolean
): Set<string> => {
  const englishKeys = new Set(Object.keys(pageEnglish));
  const families = new Set([...englishKeys].map((key) => pluralBase(key) ?? key));
  const sourceKeys = hasExtractedPage
    ? Object.keys(extractedPage).filter((key) => {
        const base = pluralBase(key);
        return englishKeys.has(key) || (base !== null && families.has(base));
      })
    : [...englishKeys];
  const allowed = new Set(sourceKeys);
  for (const key of Object.keys(platform)) {
    const base = pluralBase(key);
    if (base !== null && families.has(base)) allowed.add(key);
  }
  return allowed;
};

const propagatePlatformToPage = async (
  root: string,
  locales: readonly string[]
): Promise<void> => {
  const platformDirectory = path.join(root, "platform");
  const pageDirectory = path.join(root, "page");
  const pageEnglish = flatten(
    await loadJson(path.join(pageDirectory, "en.json"), { required: true })
  );
  if (Object.keys(pageEnglish).length === 0) {
    throw new Error("English page extraction contains no keys. Run i18n:prepare first.");
  }
  for (const locale of locales) {
    const platform = flatten(
      await loadJson(path.join(platformDirectory, `${locale}.json`), {
        required: true,
      })
    );
    const pagePath = path.join(pageDirectory, `${locale}.json`);
    const hasPage = await fileExists(pagePath);
    const existingPage = flatten(await loadJson(pagePath));
    const next: FlatTranslations = {};
    for (const key of pageMembership(pageEnglish, existingPage, platform, hasPage)) {
      next[key] = platform[key] ?? existingPage[key] ?? "";
    }
    await saveJson(pagePath, sortObject(unflatten(next)));
  }
};

export const finalizeTranslations = async (
  root = path.resolve("src/library/i18n"),
  locales: readonly string[] = configuredLocales
): Promise<void> => {
  const missing = await findMissingTranslations(
    path.join(root, "platform"),
    locales
  );
  if (missing.length) {
    throw new Error(
      `Platform translations are incomplete (${missing.length} missing value(s)):\n${missing
        .map(
          ({ locale, key, english }) =>
            `[${locale}] ${key} = ${JSON.stringify(english)}`
        )
        .join("\n")}`
    );
  }
  const platformRepairs = await repairInterpolations(root, locales, "platform");
  await propagatePlatformToPage(root, locales);
  const pageRepairs = await repairInterpolations(root, locales, "page");
  const repaired = platformRepairs + pageRepairs;
  console.log(
    `Finalized platform and page translations${repaired ? ` after ${repaired} safe interpolation repair(s)` : ""}.`
  );
};

if (import.meta.url === `file://${process.argv[1]}`) {
  finalizeTranslations().catch((error: unknown) => {
    console.error((error as Error).message);
    process.exitCode = 1;
  });
}
