/**
 * High-level overview:
 *
 * 1) Scan source component folders:
 *    - Recursively read `src/components` and `src/atoms`.
 *    - Collect supported source files (`.tsx`, `.ts`, `.jsx`, `.js`).
 *    - Build stable component keys and import aliases from file paths.
 *
 * 2) Generate Puck config source:
 *    - Emit `src/Config.tsx` with:
 *      - imports for discovered components/atoms
 *      - `mainConfig.components` map
 *      - `mainConfig.categories` grouped as Components and Atoms
 *    - Write only when file content changes to avoid dev-server reload loops.
 *
 * 3) Patch template wiring (`main.tsx`):
 *    - Update imports to use generated `mainConfig` from `src/Config`.
 *    - Remove migration/filtering dependencies from imports where applicable.
 *    - Ensure `transformProps` is the simplified translation-injection variant.
 *    - Remove filtered-config usage and render directly with `mainConfig`.
 *    - Ensure a valid `Location` component/default export exists.
 *    - Preserve required side-effect CSS imports.
 *
 * 4) Patch editor wiring (`edit.tsx`):
 *    - Ensure `mainConfig` import points to generated `src/Config`.
 *    - Keep `directory`/`locator` registry entries intact.
 *    - Ensure `componentRegistry.main` uses generated `mainConfig`.
 *    - Preserve required side-effect CSS imports.
 *
 * 5) Runtime behavior:
 *    - Exposes `generateTemplateConfig(options)` for Vite/plugin usage.
 *    - Supports direct CLI execution (`node scripts/generateTemplateConfig.mjs`).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";

const ROOT_DIR = process.cwd();
const OUTPUT_CONFIG_PATH = path.join(ROOT_DIR, "src", "Config.tsx");
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

const AST_PROJECT = new Project({
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
  },
});

/**
 * Writes a file only when content changes.
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<boolean>} true when file was written, otherwise false.
 */
const writeFileIfChanged = async (filePath, content) => {
  let current = null;
  if (await fileExists(filePath)) {
    current = await fs.readFile(filePath, "utf8");
  }
  if (current === content) {
    return false;
  }
  await fs.writeFile(filePath, content, "utf8");
  return true;
};

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
  if (!(await fileExists(directory))) {
    return [];
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walkDirectory(absolutePath);
      }
      if (!entry.isFile()) {
        return [];
      }

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
 * Gets a source file for manipulation.
 * @param {string} filePath
 * @returns {import("ts-morph").SourceFile}
 */
const getAstSourceFile = (filePath) => {
  const existing = AST_PROJECT.getSourceFile(filePath);
  if (existing) {
    return existing;
  }
  return AST_PROJECT.addSourceFileAtPath(filePath);
};

/**
 * Removes named imports from a specific module import declaration.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @param {string[]} namesToRemove
 */
const removeNamedImports = (sourceFile, moduleSpecifier, namesToRemove) => {
  const declaration = sourceFile
    .getImportDeclarations()
    .find((item) => item.getModuleSpecifierValue() === moduleSpecifier);
  if (!declaration) {
    return;
  }
  for (const namedImport of declaration.getNamedImports()) {
    if (namesToRemove.includes(namedImport.getName())) {
      namedImport.remove();
    }
  }
  if (
    declaration.getNamedImports().length === 0 &&
    !declaration.getDefaultImport() &&
    !declaration.getNamespaceImport()
  ) {
    declaration.remove();
  }
};

/**
 * Ensures `mainConfig` import points to generated config path and removes other `mainConfig` imports.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 */
const upsertMainConfigImport = (sourceFile, moduleSpecifier) => {
  for (const declaration of sourceFile.getImportDeclarations()) {
    const hadNamedImports = declaration.getNamedImports().length > 0;
    const namedImports = declaration.getNamedImports();
    for (const namedImport of namedImports) {
      if (namedImport.getName() === "mainConfig") {
        namedImport.remove();
      }
    }
    if (
      hadNamedImports &&
      declaration.getNamedImports().length === 0 &&
      !declaration.getDefaultImport() &&
      !declaration.getNamespaceImport()
    ) {
      declaration.remove();
    }
  }

  const pagesComponentsImport = sourceFile
    .getImportDeclarations()
    .find(
      (item) => item.getModuleSpecifierValue() === "@yext/pages-components"
    );

  if (pagesComponentsImport) {
    sourceFile.insertImportDeclaration(
      pagesComponentsImport.getChildIndex() + 1,
      {
        namedImports: ["mainConfig"],
        moduleSpecifier,
      }
    );
  } else {
    sourceFile.addImportDeclaration({
      namedImports: ["mainConfig"],
      moduleSpecifier,
    });
  }
};

/**
 * Ensures a side-effect import is present.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 */
const ensureSideEffectImport = (sourceFile, moduleSpecifier) => {
  const exists = sourceFile
    .getImportDeclarations()
    .some((item) => item.getModuleSpecifierValue() === moduleSpecifier);
  if (!exists) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier,
    });
  }
};

/**
 * Replaces transformProps implementation with a minimal version.
 * @param {import("ts-morph").SourceFile} sourceFile
 */
const setMinimalTransformProps = (sourceFile) => {
  const declaration = sourceFile.getVariableDeclaration("transformProps");
  if (!declaration) {
    return;
  }
  declaration.setInitializer(`async (props) => {
  const { document } = props;

  const translations = await injectTranslations(document);

  return { ...props, document, translations };
}`);
};

/**
 * Removes filtered config declaration and rewrites usage to mainConfig.
 * @param {import("ts-morph").SourceFile} sourceFile
 */
const removeFilteredConfigUsage = (sourceFile) => {
  const declarations = sourceFile.getVariableDeclarations();
  for (const declaration of declarations) {
    const initializerText = declaration.getInitializer()?.getText() ?? "";
    if (initializerText.includes("filterComponentsFromConfig(")) {
      const statement = declaration.getFirstAncestorByKind(
        SyntaxKind.VariableStatement
      );
      if (statement) {
        statement.remove();
      }
    }
  }

  for (const identifier of sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (identifier.getText() === "filteredConfig") {
      identifier.replaceWithText("mainConfig");
    }
  }
};

/**
 * Ensures the main template has a Location component and default export points to it.
 * @param {import("ts-morph").SourceFile} sourceFile
 */
const ensureMainLocationComponent = (sourceFile) => {
  const locationDeclaration = sourceFile.getVariableDeclaration("Location");
  if (!locationDeclaration) {
    sourceFile.addStatements(`
const Location: Template<TemplateRenderProps> = (props) => {
  const { document } = props;

  const layoutString = document.__.layout;
  let data: any = {};
  try {
    data = JSON.parse(layoutString);
  } catch (e) {
    console.error("Failed to parse layout JSON:", e);
  }

  let requireAnalyticsOptIn = false;
  if (document.__?.visualEditorConfig) {
    try {
      requireAnalyticsOptIn =
        JSON.parse(document.__.visualEditorConfig)?.requireAnalyticsOptIn ??
        false;
    } catch (e) {
      console.error("Failed to parse visualEditorConfig JSON:", e);
    }
  }

  return (
    <AnalyticsProvider
      apiKey={document?._env?.YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY}
      templateData={props}
      currency="USD"
      requireOptIn={requireAnalyticsOptIn}
    >
      <VisualEditorProvider templateProps={props}>
        <Render
          config={mainConfig}
          data={data}
          metadata={{ streamDocument: document }}
        />
      </VisualEditorProvider>
    </AnalyticsProvider>
  );
};
`);
  }

  const exportAssignments = sourceFile.getExportAssignments();
  for (const assignment of exportAssignments) {
    assignment.remove();
  }
  sourceFile.addExportAssignment({
    isExportEquals: false,
    expression: "Location",
  });
};

/**
 * Updates src/templates/main.tsx to import the generated config and remove migration/filtering.
 * @param {string} outputFilePath
 * @returns {Promise<boolean>} true when main.tsx was updated, otherwise false.
 */
const updateMainTemplateConfig = async (outputFilePath) => {
  if (!(await fileExists(MAIN_TEMPLATE_PATH))) {
    return false;
  }

  const importTarget = toPosixPath(
    path
      .relative(path.dirname(MAIN_TEMPLATE_PATH), outputFilePath)
      .replace(/\.[^/.]+$/, "")
  );
  const normalizedImportTarget = importTarget.startsWith(".")
    ? importTarget
    : `./${importTarget}`;

  const originalSource = await fs.readFile(MAIN_TEMPLATE_PATH, "utf8");
  const sourceFile = getAstSourceFile(MAIN_TEMPLATE_PATH);

  removeNamedImports(sourceFile, "@puckeditor/core", ["resolveAllData"]);
  removeNamedImports(sourceFile, "@yext/visual-editor", [
    "mainConfig",
    "migrate",
    "migrationRegistry",
    "filterComponentsFromConfig",
  ]);
  ensureSideEffectImport(sourceFile, "@yext/visual-editor/style.css");
  ensureSideEffectImport(sourceFile, "../index.css");
  upsertMainConfigImport(sourceFile, normalizedImportTarget);
  setMinimalTransformProps(sourceFile);
  removeFilteredConfigUsage(sourceFile);
  ensureMainLocationComponent(sourceFile);

  sourceFile.formatText();
  const updatedSource = sourceFile.getFullText();
  sourceFile.forget();

  if (updatedSource === originalSource) {
    return false;
  }

  await fs.writeFile(MAIN_TEMPLATE_PATH, updatedSource, "utf8");
  return true;
};

/**
 * Ensures componentRegistry has `main: mainConfig` while preserving other registry entries.
 * @param {import("ts-morph").SourceFile} sourceFile
 */
const setEditComponentRegistry = (sourceFile) => {
  const declaration = sourceFile.getVariableDeclaration("componentRegistry");
  if (!declaration) {
    return;
  }

  const initializer = declaration.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!initializer) {
    declaration.setInitializer(`{
  main: mainConfig,
}`);
    return;
  }

  const mainProperty = initializer
    .getProperties()
    .find(
      (property) =>
        property.getKind() === SyntaxKind.PropertyAssignment &&
        property.getName() === "main"
    );

  if (mainProperty && mainProperty.getKind() === SyntaxKind.PropertyAssignment) {
    mainProperty.setInitializer("mainConfig");
  } else {
    initializer.addPropertyAssignment({
      name: "main",
      initializer: "mainConfig",
    });
  }
};

/**
 * Updates src/templates/edit.tsx to import the generated config and pin registry entries.
 * @param {string} outputFilePath
 * @returns {Promise<boolean>} true when edit.tsx was updated, otherwise false.
 */
const updateEditTemplateConfig = async (outputFilePath) => {
  if (!(await fileExists(EDIT_TEMPLATE_PATH))) {
    return false;
  }

  const importTarget = toPosixPath(
    path
      .relative(path.dirname(EDIT_TEMPLATE_PATH), outputFilePath)
      .replace(/\.[^/.]+$/, "")
  );
  const normalizedImportTarget = importTarget.startsWith(".")
    ? importTarget
    : `./${importTarget}`;

  const originalSource = await fs.readFile(EDIT_TEMPLATE_PATH, "utf8");
  const sourceFile = getAstSourceFile(EDIT_TEMPLATE_PATH);

  removeNamedImports(sourceFile, "@yext/visual-editor", [
    "mainConfig",
  ]);
  ensureSideEffectImport(sourceFile, "@yext/visual-editor/editor.css");
  ensureSideEffectImport(sourceFile, "../index.css");
  upsertMainConfigImport(sourceFile, normalizedImportTarget);
  setEditComponentRegistry(sourceFile);

  sourceFile.formatText();
  const updatedSource = sourceFile.getFullText();
  sourceFile.forget();

  if (updatedSource === originalSource) {
    return false;
  }

  await fs.writeFile(EDIT_TEMPLATE_PATH, updatedSource, "utf8");
  return true;
};

/**
 * Generates a new config file and prints a summary to stdout.
 * @returns {Promise<void>}
 */
export const generateTemplateConfig = async (options = {}) => {
  const { silent = false } = options;
  const log = (...args) => {
    if (!silent) {
      console.log(...args);
    }
  };

  const outputFilePath = OUTPUT_CONFIG_PATH;
  const groups = await collectItems();
  const source = buildConfigSource(groups, outputFilePath);

  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  const wroteOutputConfig = await writeFileIfChanged(outputFilePath, source);
  const updatedTemplate = await updateMainTemplateConfig(outputFilePath);
  const updatedEditTemplate = await updateEditTemplateConfig(outputFilePath);

  const totalsByGroup = groups.map(
    (group) => `${group.title}: ${group.items.length}`
  );
  const totalCount = groups.reduce((count, group) => count + group.items.length, 0);

  if (wroteOutputConfig) {
    log(`Wrote ${path.relative(ROOT_DIR, outputFilePath)}`);
  }
  if (updatedTemplate) {
    log(
      `Updated ${path.relative(ROOT_DIR, MAIN_TEMPLATE_PATH)} config import`
    );
  }
  if (updatedEditTemplate) {
    log(
      `Updated ${path.relative(ROOT_DIR, EDIT_TEMPLATE_PATH)} config import`
    );
  }
  log(`Total items: ${totalCount} (${totalsByGroup.join(", ")})`);

  return {
    wroteOutputConfig,
    updatedTemplate,
    updatedEditTemplate,
    totalCount,
    totalsByGroup,
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateTemplateConfig().catch((error) => {
    console.error("Failed to generate template config:", error);
    process.exitCode = 1;
  });
}
