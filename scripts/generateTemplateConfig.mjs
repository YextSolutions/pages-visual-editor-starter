#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "output", "configs");
const OUTPUT_CONFIG_PATH = path.join(OUTPUT_DIR, "Config.tsx");
const MAIN_TEMPLATE_PATH = path.join(ROOT_DIR, "src", "templates", "main.tsx");
const EDIT_TEMPLATE_PATH = path.join(ROOT_DIR, "src", "templates", "edit.tsx");
const VALID_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

const SOURCE_GROUPS = [
  {
    key: "components",
    title: "Components",
    directory: path.join(ROOT_DIR, "src", "components"),
    importPrefix: "Component",
  },
  {
    key: "atoms",
    title: "Atoms",
    directory: path.join(ROOT_DIR, "src", "atoms"),
    importPrefix: "Atom",
  },
];

/**
 * Converts a file or path-like string to PascalCase.
 * @param {string} value
 * @returns {string}
 */
const toPascalCase = (value) =>
  value
    .replace(/\.[^/.]+$/, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join("");

/**
 * Normalizes a path to POSIX separators.
 * @param {string} value
 * @returns {string}
 */
const toPosixPath = (value) => value.split(path.sep).join(path.posix.sep);

/**
 * Checks whether a path exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Recursively walks a directory and returns source files that match supported extensions.
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
const walkDirectory = async (directory) => {
  if (!(await fileExists(directory))) return [];

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return walkDirectory(absolutePath);
      if (!entry.isFile()) return [];

      const extension = path.extname(entry.name);
      return VALID_EXTENSIONS.has(extension) ? [absolutePath] : [];
    })
  );

  return nested.flat();
};

/**
 * Collects component and atom entries with unique import/component names.
 * @returns {Promise<Array<{key: string, title: string, directory: string, importPrefix: string, items: Array<{importName: string, componentName: string, fileRelativeToRoot: string}>}>>}
 */
const collectItems = async () => {
  const usedImportNames = new Set();
  const usedComponentNames = new Set();
  const groups = [];

  for (const group of SOURCE_GROUPS) {
    const files = await walkDirectory(group.directory);
    const sortedFiles = files.sort((a, b) => a.localeCompare(b));
    const items = [];

    for (const absolutePath of sortedFiles) {
      const fileRelativeToRoot = toPosixPath(path.relative(ROOT_DIR, absolutePath));
      const fileRelativeToGroup = toPosixPath(
        path.relative(group.directory, absolutePath)
      );

      const rawName = toPascalCase(fileRelativeToGroup);
      let componentName = rawName || `${group.importPrefix}Item`;
      let componentNameSuffix = 2;
      while (usedComponentNames.has(componentName)) {
        componentName = `${rawName}${componentNameSuffix}`;
        componentNameSuffix += 1;
      }
      usedComponentNames.add(componentName);

      const importBase = `${group.importPrefix}${rawName || "Item"}`;
      let importName = importBase;
      let importNameSuffix = 2;
      while (usedImportNames.has(importName)) {
        importName = `${importBase}${importNameSuffix}`;
        importNameSuffix += 1;
      }
      usedImportNames.add(importName);

      items.push({
        importName,
        componentName,
        fileRelativeToRoot,
      });
    }

    groups.push({
      ...group,
      items,
    });
  }

  return groups;
};

/**
 * Creates the TypeScript source for the generated Puck config.
 * @param {Array<{key: string, title: string, items: Array<{importName: string, componentName: string, fileRelativeToRoot: string}>}>} groups
 * @param {string} outputFilePath
 * @returns {string}
 */
const buildConfigSource = (groups, outputFilePath) => {
  const allItems = groups.flatMap((group) => group.items);
  const importLines = allItems.map((item) => {
    const importPath = toPosixPath(
      path
        .relative(path.dirname(outputFilePath), path.join(ROOT_DIR, item.fileRelativeToRoot))
        .replace(/\.[^/.]+$/, "")
    );
    const normalizedImportPath = importPath.startsWith(".")
      ? importPath
      : `./${importPath}`;
    return `import ${item.importName} from "${normalizedImportPath}";`;
  });

  const componentEntries = allItems.map(
    (item) => `    ${item.componentName}: ${item.importName},`
  );

  const categoryEntries = groups
    .filter((group) => group.items.length > 0)
    .map((group) => {
      const componentList = group.items
        .map((item) => `        "${item.componentName}",`)
        .join("\n");
      return `    ${group.key}: {\n      title: "${group.title}",\n      components: [\n${componentList}\n      ],\n    },`;
    });

  return [
    "/** THIS FILE IS AUTOGENERATED BY scripts/generateTemplateConfig.mjs */",
    'import type { Config } from "@puckeditor/core";',
    ...(importLines.length ? ["", ...importLines] : []),
    "",
    "export const mainConfig: Config = {",
    "  components: {",
    ...(componentEntries.length ? componentEntries : ["    // No components found in src/components or src/atoms"]),
    "  },",
    ...(categoryEntries.length
      ? ["  categories: {", ...categoryEntries, "  },"]
      : []),
    "};",
    "",
    "export default mainConfig;",
    "",
  ].join("\n");
};

/**
 * Updates src/templates/main.tsx to import the most recently generated config.
 * If main.tsx does not exist, this is a no-op.
 * @param {string} outputFilePath
 * @returns {Promise<boolean>} true when main.tsx was updated, otherwise false.
 */
const updateMainTemplateConfig = async (outputFilePath) => {
  if (!(await fileExists(MAIN_TEMPLATE_PATH))) return false;

  const importTarget = toPosixPath(
    path
      .relative(path.dirname(MAIN_TEMPLATE_PATH), outputFilePath)
      .replace(/\.[^/.]+$/, "")
  );
  const normalizedImportTarget = importTarget.startsWith(".")
    ? importTarget
    : `./${importTarget}`;

  const templateSource = await fs.readFile(MAIN_TEMPLATE_PATH, "utf8");

  const stripNamedImport = (importList, namesToRemove) =>
    importList
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .filter((name) => !namesToRemove.includes(name));

  let updatedSource = templateSource
    .replace(
      /^\s*import\s*\{\s*mainConfig\s*\}\s*from\s*["'][^"']+["'];\n?/gm,
      ""
    )
    .replace(
      /import\s*\{([^;]*?)\}\s*from\s*["']@puckeditor\/core["'];/,
      (fullImport, importList) => {
        const names = stripNamedImport(importList, ["resolveAllData"]);
        const formattedImports = names.map((name) => `  ${name},`).join("\n");
        return `import {\n${formattedImports}\n} from "@puckeditor/core";`;
      }
    )
    .replace(
      /import\s*\{([^;]*?)\}\s*from\s*["']@yext\/visual-editor["'];/,
      (fullImport, importList) => {
        const names = stripNamedImport(importList, [
          "mainConfig",
          "migrate",
          "migrationRegistry",
          "filterComponentsFromConfig",
        ]);

        const formattedImports = names.map((name) => `  ${name},`).join("\n");
        return `import {\n${formattedImports}\n} from "@yext/visual-editor";`;
      }
    )
    .replace(
      /import\s+\{\s*AnalyticsProvider,\s*SchemaWrapper\s*\}\s+from\s+["']@yext\/pages-components["'];/,
      `import { AnalyticsProvider, SchemaWrapper } from "@yext/pages-components";\nimport { mainConfig } from "${normalizedImportTarget}";`
    )
    .replace(
      /export const transformProps: TransformProps<TemplateProps> = async \(props\) => \{[\s\S]*?\n\};/,
      [
        "export const transformProps: TransformProps<TemplateProps> = async (props) => {",
        "  const { document } = props;",
        "",
        "  const translations = await injectTranslations(document);",
        "",
        "  return { ...props, document, translations };",
        "};",
      ].join("\n")
    )
    .replace(
      /const filteredConfig = filterComponentsFromConfig\([\s\S]*?\);\n\n/,
      ""
    )
    .replace(
      /config=\{filteredConfig\}/g,
      "config={mainConfig}"
    )
    .replace(
      /,\s*document\?\._additionalLayoutComponents,\s*\n\s*document\?\._additionalLayoutCategories\s*/g,
      ""
    )
    .replace(
      /^\s{4}let requireAnalyticsOptIn = false;/m,
      "  let requireAnalyticsOptIn = false;"
    );

  updatedSource = updatedSource.replace(
    /\n{3,}/g,
    "\n\n"
  );

  if (updatedSource === templateSource) return false;

  await fs.writeFile(MAIN_TEMPLATE_PATH, updatedSource, "utf8");
  return true;
};

/**
 * Updates src/templates/edit.tsx to import the generated config file.
 * If edit.tsx does not exist, this is a no-op.
 * @param {string} outputFilePath
 * @returns {Promise<boolean>} true when edit.tsx was updated, otherwise false.
 */
const updateEditTemplateConfig = async (outputFilePath) => {
  if (!(await fileExists(EDIT_TEMPLATE_PATH))) return false;

  const importTarget = toPosixPath(
    path
      .relative(path.dirname(EDIT_TEMPLATE_PATH), outputFilePath)
      .replace(/\.[^/.]+$/, "")
  );
  const normalizedImportTarget = importTarget.startsWith(".")
    ? importTarget
    : `./${importTarget}`;

  const templateSource = await fs.readFile(EDIT_TEMPLATE_PATH, "utf8");

  const stripNamedImport = (importList, namesToRemove) =>
    importList
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .filter((name) => !namesToRemove.includes(name));

  let updatedSource = templateSource
    .replace(
      /^\s*import\s*\{\s*mainConfig\s*\}\s*from\s*["'][^"']+["'];\n?/gm,
      ""
    )
    .replace(
      /import\s*\{([^;]*?)\}\s*from\s*["']@yext\/visual-editor["'];/,
      (fullImport, importList) => {
        const names = stripNamedImport(importList, [
          "mainConfig",
          "directoryConfig",
          "locatorConfig",
        ]);
        const formattedImports = names.map((name) => `  ${name},`).join("\n");
        return `import {\n${formattedImports}\n} from "@yext/visual-editor";`;
      }
    )
    .replace(
      /import\s+\{\s*type\s+Config\s*\}\s+from\s+["']@puckeditor\/core["'];/,
      `import { type Config } from "@puckeditor/core";\nimport { mainConfig } from "${normalizedImportTarget}";`
    )
    .replace(
      /const componentRegistry: Record<string, Config<any>> = \{[\s\S]*?\};/,
      [
        "const componentRegistry: Record<string, Config<any>> = {",
        "  main: mainConfig,",
        "  directory: mainConfig,",
        "  locator: mainConfig,",
        "};",
      ].join("\n")
    );

  updatedSource = updatedSource.replace(/\n{3,}/g, "\n\n");

  if (updatedSource === templateSource) return false;

  await fs.writeFile(EDIT_TEMPLATE_PATH, updatedSource, "utf8");
  return true;
};

/**
 * Removes legacy numbered config files (Config_<n>.tsx) from output/configs.
 * @returns {Promise<number>} number of deleted files.
 */
const removeLegacyNumberedConfigs = async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const outputFiles = await fs.readdir(OUTPUT_DIR);
  const legacyFiles = outputFiles.filter((fileName) =>
    /^Config_\d+\.tsx$/.test(fileName)
  );

  await Promise.all(
    legacyFiles.map((fileName) => fs.rm(path.join(OUTPUT_DIR, fileName)))
  );

  return legacyFiles.length;
};

/**
 * Generates a new config file and prints a summary to stdout.
 * @returns {Promise<void>}
 */
const main = async () => {
  const outputFilePath = OUTPUT_CONFIG_PATH;
  const groups = await collectItems();
  const source = buildConfigSource(groups, outputFilePath);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(outputFilePath, source, "utf8");
  const removedLegacyCount = await removeLegacyNumberedConfigs();
  const updatedTemplate = await updateMainTemplateConfig(outputFilePath);
  const updatedEditTemplate = await updateEditTemplateConfig(outputFilePath);

  const totalsByGroup = groups.map(
    (group) => `${group.title}: ${group.items.length}`
  );
  const totalCount = groups.reduce((count, group) => count + group.items.length, 0);

  console.log(`Wrote ${path.relative(ROOT_DIR, outputFilePath)}`);
  if (updatedTemplate) {
    console.log(
      `Updated ${path.relative(ROOT_DIR, MAIN_TEMPLATE_PATH)} config import`
    );
  }
  if (updatedEditTemplate) {
    console.log(
      `Updated ${path.relative(ROOT_DIR, EDIT_TEMPLATE_PATH)} config import`
    );
  }
  if (removedLegacyCount > 0) {
    console.log(`Removed ${removedLegacyCount} legacy Config_<n>.tsx files`);
  }
  console.log(`Total items: ${totalCount} (${totalsByGroup.join(", ")})`);
};

main().catch((error) => {
  console.error("Failed to generate template config:", error);
  process.exitCode = 1;
});
