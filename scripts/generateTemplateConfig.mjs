/**
 * High-level overview:
 *
 * 1) Discover templates from `src/registry/*`.
 *    - Each subdirectory under `src/registry` is treated as a template name.
 *    - Example: `src/registry/main` -> template name `main`.
 *
 * 2) Generate one config per template.
 *    - Scan template-specific components from `src/registry/<template>/components`.
 *    - Emit `src/registry/<template>/config.tsx`.
 *
 * 3) Materialize one template file per registry template.
 *    - Copy `temp/base.tsx` to `src/templates/<template>.tsx`.
 *    - Patch that copied template to import the matching
 *      `src/registry/<template>/config.tsx`.
 *    - Rename the exported template component to match the template name.
 *
 * 4) Update `.template-manifest.json`.
 *    - Read `src/registry/<template>/defaultLayout.json` when present.
 *    - Write that JSON into the matching template's `defaultLayoutData`.
 *
 * 5) Update editor wiring.
 *    - Patch `src/templates/edit.tsx`.
 *    - Import each generated config into `componentRegistry`.
 *    - Ensure `componentRegistry` points each template name to its config while
 *      preserving `directory` and `locator` entries.
 *
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";

const ROOT_DIR = process.cwd();
const REGISTRY_DIR = path.join(ROOT_DIR, "src", "registry");
const TEMPLATE_MANIFEST_PATH = path.join(ROOT_DIR, ".template-manifest.json");
const EDIT_TEMPLATE_PATH = path.join(ROOT_DIR, "src", "templates", "edit.tsx");
const TEMP_BASE_TEMPLATE_PATH = path.join(ROOT_DIR, "temp", "base.tsx");
const VALID_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);
const PRESERVED_EDIT_REGISTRY_KEYS = new Set(["directory", "locator"]);

const AST_PROJECT = new Project({
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
  },
});

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
      if (!VALID_EXTENSIONS.has(extension)) {
        return [];
      }

      return [absolutePath];
    })
  );

  return nested.flat();
};

/**
 * Lists template names from `src/registry`.
 * @returns {Promise<string[]>}
 */
const getTemplateNames = async () => {
  if (!(await fileExists(REGISTRY_DIR))) {
    return [];
  }

  const entries = await fs.readdir(REGISTRY_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};

/**
 * Builds the filesystem paths for a template registry.
 * @param {string} templateName
 * @returns {{
 *   templateName: string,
 *   registryDirectory: string,
 *   componentsDirectory: string,
 *   defaultLayoutPath: string,
 *   configPath: string,
 *   templatePath: string
 * }}
 */
const getTemplatePaths = (templateName) => {
  const registryDirectory = path.join(REGISTRY_DIR, templateName);
  return {
    templateName,
    registryDirectory,
    componentsDirectory: path.join(registryDirectory, "components"),
    defaultLayoutPath: path.join(registryDirectory, "defaultLayout.json"),
    configPath: path.join(registryDirectory, "config.tsx"),
    templatePath: path.join(ROOT_DIR, "src", "templates", `${templateName}.tsx`),
  };
};

/**
 * Collects items for a single config group while keeping names unique within one config file.
 * @param {{
 *   directory: string,
 *   importPrefix: string,
 *   fallbackName: string
 * }} group
 * @param {Set<string>} usedImportNames
 * @param {Set<string>} usedComponentNames
 * @returns {Promise<Array<{importName: string, exportName: string, componentName: string, fileRelativeToRoot: string}>>}
 */
const collectGroupItems = async (group, usedImportNames, usedComponentNames) => {
  const files = await walkDirectory(group.directory);
  const sortedFiles = files.sort((a, b) => a.localeCompare(b));
  const items = [];

  for (const absolutePath of sortedFiles) {
    const fileRelativeToRoot = toPosixPath(path.relative(ROOT_DIR, absolutePath));
    const fileRelativeToGroup = toPosixPath(path.relative(group.directory, absolutePath));

    const rawName = toPascalCase(fileRelativeToGroup);
    const baseName = rawName || group.fallbackName;
    const exportName = baseName;

    let componentName = baseName;
    let componentNameSuffix = 2;
    while (usedComponentNames.has(componentName)) {
      componentName = `${baseName}${componentNameSuffix}`;
      componentNameSuffix += 1;
    }
    usedComponentNames.add(componentName);

    const importBase = `${group.importPrefix}${baseName}`;
    let importName = importBase;
    let importNameSuffix = 2;
    while (usedImportNames.has(importName)) {
      importName = `${importBase}${importNameSuffix}`;
      importNameSuffix += 1;
    }
    usedImportNames.add(importName);

    items.push({
      importName,
      exportName,
      componentName,
      fileRelativeToRoot,
    });
  }

  return items;
};

/**
 * Collects template-specific component groups for a template config.
 * @param {string} templateName
 * @returns {Promise<Array<{key: string, title: string, items: Array<{importName: string, exportName: string, componentName: string, fileRelativeToRoot: string}>}>>}
 */
const collectTemplateGroups = async (templateName) => {
  const templatePaths = getTemplatePaths(templateName);
  const templateKey = toPascalCase(templateName) || "Template";
  const usedImportNames = new Set();
  const usedComponentNames = new Set();

  const componentItems = await collectGroupItems(
    {
      directory: templatePaths.componentsDirectory,
      importPrefix: `${templateKey}Component`,
      fallbackName: "Component",
    },
    usedImportNames,
    usedComponentNames
  );

  return [
    {
      key: "components",
      title: "Components",
      items: componentItems,
    },
  ];
};

/**
 * Creates the TypeScript source for a generated Puck config.
 * @param {Array<{key: string, title: string, items: Array<{importName: string, exportName: string, componentName: string, fileRelativeToRoot: string}>}>} groups
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
    return `import { ${item.exportName} as ${item.importName} } from "${normalizedImportPath}";`;
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
    ...(importLines.length > 0 ? ["", ...importLines] : []),
    "",
    "export const mainConfig: Config = {",
    "  components: {",
    ...(componentEntries.length > 0
      ? componentEntries
      : ["    // No components found in this template registry"]),
    "  },",
    ...(categoryEntries.length > 0 ? ["  categories: {", ...categoryEntries, "  },"] : []),
    "};",
    "",
    "export default mainConfig;",
    "",
  ].join("\n");
};

/**
 * Gets a fresh source file for manipulation.
 * @param {string} filePath
 * @returns {Promise<import("ts-morph").SourceFile>}
 */
const getAstSourceFile = async (filePath) => {
  const existing = AST_PROJECT.getSourceFile(filePath);
  if (existing) {
    await existing.refreshFromFileSystem();
    return existing;
  }
  return AST_PROJECT.addSourceFileAtPath(filePath);
};

/**
 * Removes named imports from a specific module import declaration.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @param {string[]} namesToRemove
 * @returns {void}
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
 * Removes prior generated config imports from a source file.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @returns {void}
 */
const removeGeneratedConfigImports = (sourceFile) => {
  for (const declaration of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = declaration.getModuleSpecifierValue();
    if (
      moduleSpecifier === "../config" ||
      moduleSpecifier === "./config" ||
      moduleSpecifier.endsWith("/config")
    ) {
      declaration.remove();
    }
  }
};

/**
 * Inserts a named import after `@yext/pages-components` when present, otherwise appends it.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {{
 *   moduleSpecifier: string,
 *   namedImports: Array<string | { name: string, alias?: string }>
 * }} options
 * @returns {void}
 */
const insertNamedImport = (sourceFile, options) => {
  const pagesComponentsImport = sourceFile
    .getImportDeclarations()
    .find(
      (item) => item.getModuleSpecifierValue() === "@yext/pages-components"
    );

  if (pagesComponentsImport) {
    sourceFile.insertImportDeclaration(pagesComponentsImport.getChildIndex() + 1, {
      namedImports: options.namedImports,
      moduleSpecifier: options.moduleSpecifier,
    });
    return;
  }

  sourceFile.addImportDeclaration({
    namedImports: options.namedImports,
    moduleSpecifier: options.moduleSpecifier,
  });
};

/**
 * Ensures `mainConfig` import points to the provided config path.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @returns {void}
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

  insertNamedImport(sourceFile, {
    namedImports: ["mainConfig"],
    moduleSpecifier,
  });
};

/**
 * Ensures a side-effect import is present.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @returns {void}
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
 * Ensures named imports are present for a module specifier.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @param {string[]} importNames
 * @returns {void}
 */
const ensureNamedImport = (sourceFile, moduleSpecifier, importNames) => {
  const declaration = sourceFile
    .getImportDeclarations()
    .find((item) => item.getModuleSpecifierValue() === moduleSpecifier);

  if (!declaration) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier,
      namedImports: importNames,
    });
    return;
  }

  for (const importName of importNames) {
    const hasImport = declaration
      .getNamedImports()
      .some((item) => item.getName() === importName);

    if (!hasImport) {
      declaration.addNamedImport(importName);
    }
  }
};

/**
 * Wraps the `Edit` component body in `ChakraProvider`.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @returns {void}
 */
const wrapEditWithChakraProvider = (sourceFile) => {
  const declaration = sourceFile.getVariableDeclaration("Edit");
  if (!declaration) {
    return;
  }

  const statement = declaration.getFirstAncestorByKind(SyntaxKind.VariableStatement);
  if (!statement) {
    return;
  }

  statement.replaceWithText(`const Edit: () => JSX.Element = () => {
  const entityDocument = usePlatformBridgeDocument();
  const entityFields = usePlatformBridgeEntityFields();

  return (
      <ChakraProvider value={defaultSystem}>
        <VisualEditorProvider
          templateProps={{
            document: entityDocument,
        }}
        entityFields={entityFields}
        tailwindConfig={tailwindConfig}
      >
        <Editor
          document={entityDocument}
          componentRegistry={componentRegistry}
          themeConfig={defaultThemeConfig}
        />
      </VisualEditorProvider>
    </ChakraProvider>
  );
};`);
};

/**
 * Wraps the main template render tree in `ChakraProvider` with Chakra 3's default system.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} templateName
 * @returns {void}
 */
const wrapMainWithChakraProvider = (sourceFile, templateName) => {
  const templateComponentName = toPascalCase(templateName) || "Template";
  const declaration = sourceFile.getVariableDeclaration(templateComponentName);
  if (!declaration) {
    return;
  }

  const statement = declaration.getFirstAncestorByKind(SyntaxKind.VariableStatement);
  if (!statement) {
    return;
  }

  statement.replaceWithText(`const ${templateComponentName}: Template<TemplateRenderProps> = (props) => {
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
      <ChakraProvider value={defaultSystem}>
        <VisualEditorProvider templateProps={props}>
          <Render
            config={mainConfig}
            data={data}
            metadata={{ streamDocument: document }}
          />
        </VisualEditorProvider>
      </ChakraProvider>
    </AnalyticsProvider>
  );
};`);
};

/**
 * Renames the default-exported template component to match the template name.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} templateName
 * @returns {void}
 */
const renameDefaultExportedTemplate = (sourceFile, templateName) => {
  const exportAssignment = sourceFile.getExportAssignments()[0];
  if (!exportAssignment) {
    return;
  }

  const expression = exportAssignment.getExpression();
  if (!expression || !expression.asKind(SyntaxKind.Identifier)) {
    return;
  }

  const currentName = expression.getText();
  const nextName = toPascalCase(templateName) || "Template";
  if (currentName === nextName) {
    return;
  }

  const variableDeclaration = sourceFile.getVariableDeclaration(currentName);
  if (variableDeclaration) {
    variableDeclaration.rename(nextName);
  }

  const functionDeclaration = sourceFile.getFunction(currentName);
  if (functionDeclaration) {
    functionDeclaration.rename(nextName);
  }

  exportAssignment.setExpression(nextName);
};

/**
 * Updates a generated template copy to import the matching config and rename the default export.
 * @param {string} templateFilePath
 * @param {string} outputFilePath
 * @param {string} templateName
 * @returns {Promise<boolean>}
 */
const updateGeneratedTemplateConfig = async (
  templateFilePath,
  outputFilePath,
  templateName
) => {
  if (!(await fileExists(templateFilePath))) {
    return false;
  }

  const importTarget = toPosixPath(
    path
      .relative(path.dirname(templateFilePath), outputFilePath)
      .replace(/\.[^/.]+$/, "")
  );
  const normalizedImportTarget = importTarget.startsWith(".")
    ? importTarget
    : `./${importTarget}`;

  const originalSource = await fs.readFile(templateFilePath, "utf8");
  const sourceFile = await getAstSourceFile(templateFilePath);

  removeNamedImports(sourceFile, "@yext/visual-editor", ["mainConfig"]);
  removeGeneratedConfigImports(sourceFile);
  ensureNamedImport(sourceFile, "@chakra-ui/react", [
    "ChakraProvider",
    "defaultSystem",
  ]);
  upsertMainConfigImport(sourceFile, normalizedImportTarget);
  renameDefaultExportedTemplate(sourceFile, templateName);
  wrapMainWithChakraProvider(sourceFile, templateName);

  sourceFile.formatText();
  const updatedSource = sourceFile.getFullText();
  sourceFile.forget();

  if (updatedSource === originalSource) {
    return false;
  }

  await fs.writeFile(templateFilePath, updatedSource, "utf8");
  return true;
};

/**
 * Builds the local config identifier used in `edit.tsx`.
 * @param {string} templateName
 * @returns {string}
 */
const getEditConfigIdentifier = (templateName) => {
  if (templateName === "main") {
    return "mainConfig";
  }

  return `${templateName}Config`;
};

/**
 * Rewrites `componentRegistry` to preserve `directory` and `locator` while adding template entries.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string[]} templateNames
 * @returns {void}
 */
const setEditComponentRegistry = (sourceFile, templateNames) => {
  const declaration = sourceFile.getVariableDeclaration("componentRegistry");
  if (!declaration) {
    return;
  }

  const initializer = declaration.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!initializer) {
    const registryEntries = templateNames
      .map(
        (templateName) =>
          `  ${templateName}: ${getEditConfigIdentifier(templateName)},`
      )
      .join("\n");
    declaration.setInitializer(`{
${registryEntries}
}`);
    return;
  }

  for (const property of initializer.getProperties()) {
    if (property.getKind() !== SyntaxKind.PropertyAssignment) {
      continue;
    }

    const propertyName = property.getName();
    if (PRESERVED_EDIT_REGISTRY_KEYS.has(propertyName)) {
      continue;
    }

    property.remove();
  }

  for (const templateName of templateNames) {
    initializer.addPropertyAssignment({
      name: templateName,
      initializer: getEditConfigIdentifier(templateName),
    });
  }
};

/**
 * Updates `src/templates/edit.tsx` to import each generated config and register it.
 * @param {string[]} templateNames
 * @returns {Promise<boolean>}
 */
const updateEditTemplateConfig = async (templateNames) => {
  if (!(await fileExists(EDIT_TEMPLATE_PATH))) {
    return false;
  }

  const originalSource = await fs.readFile(EDIT_TEMPLATE_PATH, "utf8");
  const sourceFile = await getAstSourceFile(EDIT_TEMPLATE_PATH);

  removeNamedImports(sourceFile, "@yext/visual-editor", ["mainConfig"]);
  removeGeneratedConfigImports(sourceFile);
  ensureNamedImport(sourceFile, "@chakra-ui/react", [
    "ChakraProvider",
    "defaultSystem",
  ]);
  ensureSideEffectImport(sourceFile, "@yext/visual-editor/editor.css");
  ensureSideEffectImport(sourceFile, "../index.css");

  for (const templateName of templateNames) {
    const templatePaths = getTemplatePaths(templateName);
    const importTarget = toPosixPath(
      path
        .relative(path.dirname(EDIT_TEMPLATE_PATH), templatePaths.configPath)
        .replace(/\.[^/.]+$/, "")
    );
    const normalizedImportTarget = importTarget.startsWith(".")
      ? importTarget
      : `./${importTarget}`;

    if (templateName === "main") {
      insertNamedImport(sourceFile, {
        moduleSpecifier: normalizedImportTarget,
        namedImports: ["mainConfig"],
      });
    } else {
      insertNamedImport(sourceFile, {
        moduleSpecifier: normalizedImportTarget,
        namedImports: [
          {
            name: "mainConfig",
            alias: getEditConfigIdentifier(templateName),
          },
        ],
      });
    }
  }

  setEditComponentRegistry(sourceFile, templateNames);
  wrapEditWithChakraProvider(sourceFile);

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
 * Generates a config file for one template.
 * @param {string} templateName
 * @returns {Promise<{templateName: string, configPath: string, totalCount: number, totalsByGroup: string[]}>}
 */
const generateTemplateRegistryConfig = async (templateName) => {
  const templatePaths = getTemplatePaths(templateName);
  const groups = await collectTemplateGroups(templateName);
  const source = buildConfigSource(groups, templatePaths.configPath);

  await fs.mkdir(path.dirname(templatePaths.configPath), { recursive: true });
  await fs.writeFile(templatePaths.configPath, source, "utf8");

  const totalsByGroup = groups.map(
    (group) => `${group.title}: ${group.items.length}`
  );
  const totalCount = groups.reduce((count, group) => count + group.items.length, 0);

  return {
    templateName,
    configPath: templatePaths.configPath,
    totalCount,
    totalsByGroup,
  };
};

/**
 * Updates `.template-manifest.json` so matching template entries use
 * `src/registry/<template>/defaultLayout.json` as `defaultLayoutData`.
 * @param {string[]} templateNames
 * @returns {Promise<boolean>}
 */
const updateTemplateManifest = async (templateNames) => {
  if (!(await fileExists(TEMPLATE_MANIFEST_PATH))) {
    return false;
  }

  const manifestSource = await fs.readFile(TEMPLATE_MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestSource);
  if (!Array.isArray(manifest.templates)) {
    return false;
  }

  let updated = false;

  for (const templateName of templateNames) {
    const templatePaths = getTemplatePaths(templateName);
    if (!(await fileExists(templatePaths.defaultLayoutPath))) {
      continue;
    }

    const templateEntry = manifest.templates.find(
      (template) => template?.name === templateName
    );
    if (!templateEntry) {
      continue;
    }

    const defaultLayoutSource = await fs.readFile(
      templatePaths.defaultLayoutPath,
      "utf8"
    );
    const defaultLayoutData = JSON.stringify(JSON.parse(defaultLayoutSource));

    if (templateEntry.defaultLayoutData !== defaultLayoutData) {
      templateEntry.defaultLayoutData = defaultLayoutData;
      updated = true;
    }
  }

  if (!updated) {
    return false;
  }

  await fs.writeFile(
    TEMPLATE_MANIFEST_PATH,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  return true;
};

/**
 * Copies `temp/base.tsx` to a template file and patches it to use the template config.
 * @param {string} templateName
 * @returns {Promise<boolean>}
 */
const generateTemplateFile = async (templateName) => {
  if (!(await fileExists(TEMP_BASE_TEMPLATE_PATH))) {
    return false;
  }

  const templatePaths = getTemplatePaths(templateName);
  await fs.mkdir(path.dirname(templatePaths.templatePath), { recursive: true });
  const baseSource = await fs.readFile(TEMP_BASE_TEMPLATE_PATH, "utf8");
  await fs.writeFile(templatePaths.templatePath, baseSource, "utf8");
  return updateGeneratedTemplateConfig(
    templatePaths.templatePath,
    templatePaths.configPath,
    templateName
  );
};

/**
 * Generates all template configs, copies `temp/base.tsx` to per-template template files,
 * updates `.template-manifest.json`, and patches `edit.tsx`.
 * @param {{ silent?: boolean }} [options={}]
 * @returns {Promise<{
 *   templateNames: string[],
 *   updatedTemplateManifest: boolean,
 *   updatedEditTemplate: boolean,
 *   generatedConfigs: Array<{templateName: string, configPath: string, totalCount: number, totalsByGroup: string[]}>
 * }>}
 */
export const generateTemplateConfig = async (options = {}) => {
  const { silent = false } = options;
  const log = (...args) => {
    if (!silent) {
      console.log(...args);
    }
  };

  const templateNames = await getTemplateNames();
  const generatedConfigs = [];

  for (const templateName of templateNames) {
    const generatedConfig = await generateTemplateRegistryConfig(templateName);
    generatedConfigs.push(generatedConfig);
    log(`Wrote ${path.relative(ROOT_DIR, generatedConfig.configPath)}`);
    log(
      `Template ${templateName}: ${generatedConfig.totalCount} (${generatedConfig.totalsByGroup.join(", ")})`
    );
  }

  for (const templateName of templateNames) {
    const templatePaths = getTemplatePaths(templateName);
    const updatedTemplate = await generateTemplateFile(templateName);
    if (updatedTemplate) {
      log(`Updated ${path.relative(ROOT_DIR, templatePaths.templatePath)}`);
    } else if (await fileExists(templatePaths.templatePath)) {
      log(`Wrote ${path.relative(ROOT_DIR, templatePaths.templatePath)}`);
    }
  }

  const updatedTemplateManifest = await updateTemplateManifest(templateNames);
  if (updatedTemplateManifest) {
    log(`Updated ${path.relative(ROOT_DIR, TEMPLATE_MANIFEST_PATH)}`);
  }

  const updatedEditTemplate = await updateEditTemplateConfig(templateNames);
  if (updatedEditTemplate) {
    log(`Updated ${path.relative(ROOT_DIR, EDIT_TEMPLATE_PATH)}`);
  }

  return {
    templateNames,
    updatedTemplateManifest,
    updatedEditTemplate,
    generatedConfigs,
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateTemplateConfig().catch((error) => {
    console.error("Failed to generate template config:", error);
    process.exitCode = 1;
  });
}
