import fs from "node:fs/promises";
import path from "node:path";

export type FlatTranslations = Record<string, string>;
export type JsonObject = Record<string, unknown>;

const assertTranslationObject = (value: unknown): JsonObject => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("the top-level value must be an object");
  }

  const visit = (object: JsonObject, keyPath = ""): void => {
    for (const [key, child] of Object.entries(object)) {
      const fullKey = keyPath ? `${keyPath}.${key}` : key;
      if (typeof child === "string") {
        continue;
      }
      if (child && typeof child === "object" && !Array.isArray(child)) {
        visit(child as JsonObject, fullKey);
        continue;
      }
      throw new Error(`value at "${fullKey}" must be a string or object`);
    }
  };

  visit(value as JsonObject);
  return value as JsonObject;
};

/** Loads strict translation JSON. Missing optional locale files are empty. */
export const loadJson = async (
  filePath: string,
  options: { required?: boolean } = {}
): Promise<JsonObject> => {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    if (fileError.code === "ENOENT" && !options.required) {
      return {};
    }
    if (fileError.code === "ENOENT") {
      throw new Error(`Required translation file is missing: ${filePath}`);
    }
    throw new Error(
      `Unable to read translation file ${filePath}: ${fileError.message}`
    );
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return assertTranslationObject(parsed);
  } catch (error) {
    throw new Error(
      `Invalid translation JSON in ${filePath}: ${(error as Error).message}`
    );
  }
};

export const readFileIfPresent = async (filePath: string): Promise<string> => {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "";
    }
    throw error;
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const saveJson = async (
  filePath: string,
  value: JsonObject
): Promise<void> => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

export const flatten = (
  value: JsonObject,
  prefix = ""
): FlatTranslations => {
  const result: FlatTranslations = {};
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      Object.assign(result, flatten(child as JsonObject, fullKey));
    } else if (typeof child === "string") {
      result[fullKey] = child;
    } else {
      throw new Error(`Translation value at "${fullKey}" must be a string.`);
    }
  }
  return result;
};

export const unflatten = (flat: FlatTranslations): JsonObject => {
  const result: JsonObject = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cursor = result;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value;
        return;
      }
      const next = cursor[part];
      if (!next || typeof next !== "object" || Array.isArray(next)) {
        cursor[part] = {};
      }
      cursor = cursor[part] as JsonObject;
    });
  }
  return result;
};

export const sortObject = (value: JsonObject): JsonObject =>
  Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [
        key,
        child && typeof child === "object" && !Array.isArray(child)
          ? sortObject(child as JsonObject)
          : child,
      ])
  );
