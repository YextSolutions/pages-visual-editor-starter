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
 *    - Render that template by inserting the matching
 *      `src/registry/<template>/config.tsx` import.
 *    - Replace `TEMPLATE_CONFIG` and rename the exported template component to
 *      match the template name.
 *
 * 4) Update `.template-manifest.json`.
 *    - Read `src/registry/<template>/defaultLayout.json` when present.
 *    - Write that JSON into the matching template's `defaultLayoutData`.
 *    - Create a manifest entry when a registry template is missing.
 *
 * 5) Update editor wiring.
 *    - Patch `src/templates/edit.tsx`.
 *    - Import each generated config into `componentRegistry`.
 *    - Ensure `componentRegistry` points each template name to its config while
 *      preserving existing `directory` and `locator` entries when present.
 *
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import prettier from "prettier";
import { Project, QuoteKind, SyntaxKind, type SourceFile } from "ts-morph";

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

type TemplatePaths = {
  templateName: string;
  registryDirectory: string;
  componentsDirectory: string;
  defaultLayoutPath: string;
  configPath: string;
  templatePath: string;
};

type CollectedItem = {
  importName: string;
  exportName: string;
  componentName: string;
  fileRelativeToRoot: string;
};

type TemplateManifestEntry = {
  name: string;
  description: string;
  exampleSiteUrl: string;
  layoutRequired: boolean;
  defaultLayoutData: string;
};

type GeneratedConfigResult = {
  templateName: string;
  configPath: string;
  totalCount: number;
};

type GenerateTemplateConfigResult = {
  templateNames: string[];
  updatedTemplateManifest: boolean;
  updatedEditTemplate: boolean;
  generatedConfigs: GeneratedConfigResult[];
};

type ImportDefinition = string | { name: string; alias?: string };

type InsertNamedImportOptions = {
  moduleSpecifier: string;
  namedImports: ImportDefinition[];
};

type ManifestFile = {
  templates?: TemplateManifestEntry[];
};

const log = (...messages: unknown[]): void => {
  console.log("[generateTemplateConfig]", ...messages);
};

const warn = (...messages: unknown[]): void => {
  console.warn("[generateTemplateConfig]", ...messages);
};

const error = (...messages: unknown[]): void => {
  console.error("[generateTemplateConfig]", ...messages);
};

/**
 * Converts a file or path-like string to PascalCase.
 * @param {string} value
 * @returns {string}
 */
const toPascalCase = (value: string): string => {
  return value
    .replace(/\.[^/.]+$/, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1);
    })
    .join("");
};

/**
 * Converts a file or path-like string to camelCase.
 * @param {string} value
 * @returns {string}
 */
const toCamelCase = (value: string): string => {
  const pascalValue = toPascalCase(value);
  if (!pascalValue) {
    return "";
  }

  return pascalValue[0].toLowerCase() + pascalValue.slice(1);
};

/**
 * Throws when a derived identifier is empty.
 * @param {string} value
 * @param {string} errorMessage
 * @returns {string}
 */
const requireNonEmpty = (value: string, errorMessage: string): string => {
  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
};

/**
 * Normalizes a path to POSIX separators.
 * @param {string} value
 * @returns {string}
 */
const toPosixPath = (value: string): string => {
  return value.split(path.sep).join(path.posix.sep);
};

/**
 * Checks whether a path exists.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
const fileExists = async (filePath: string): Promise<boolean> => {
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
const walkDirectory = async (directory: string): Promise<string[]> => {
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
const getTemplateNames = async (): Promise<string[]> => {
  if (!(await fileExists(REGISTRY_DIR))) {
    warn(`Registry directory not found at ${REGISTRY_DIR}`);
    return [];
  }

  const entries = await fs.readdir(REGISTRY_DIR, { withFileTypes: true });
  const templateNames = entries
    .filter((entry) => {
      return entry.isDirectory();
    })
    .map((entry) => {
      return entry.name;
    })
    .sort((a, b) => {
      return a.localeCompare(b);
    });

  log("Discovered templates:", templateNames);
  return templateNames;
};

/**
 * Builds the filesystem paths for a template registry.
 * @param {string} templateName
 * @returns {TemplatePaths}
 */
const getTemplatePaths = (templateName: string): TemplatePaths => {
  const registryDirectory = path.join(REGISTRY_DIR, templateName);
  return {
    templateName,
    registryDirectory,
    componentsDirectory: path.join(registryDirectory, "components"),
    defaultLayoutPath: path.join(registryDirectory, "defaultLayout.json"),
    configPath: path.join(registryDirectory, "config.tsx"),
    templatePath: path.join(ROOT_DIR, "src", "templates", `${templateName}.tsx`)
  };
};

/**
 * Collects template components while keeping names unique within one config file.
 * @param {{
 *   directory: string,
 *   importPrefix: string
 * }} group
 * @param {Set<string>} usedImportNames
 * @param {Set<string>} usedComponentNames
 * @returns {Promise<CollectedItem[]>}
 */
const collectGroupItems = async (
  group: { directory: string; importPrefix: string },
  usedImportNames: Set<string>,
  usedComponentNames: Set<string>
): Promise<CollectedItem[]> => {
  const files = await walkDirectory(group.directory);
  const sortedFiles = files.sort((a, b) => {
    return a.localeCompare(b);
  });
  const items = [];

  for (const absolutePath of sortedFiles) {
    const fileRelativeToRoot = toPosixPath(path.relative(ROOT_DIR, absolutePath));
    const fileRelativeToGroup = toPosixPath(path.relative(group.directory, absolutePath));

    const baseName = requireNonEmpty(
      toPascalCase(fileRelativeToGroup),
      `Could not derive a component name from ${fileRelativeToRoot}`
    );
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
 * Collects template-specific components for a template config.
 * @param {string} templateName
 * @returns {Promise<CollectedItem[]>}
 */
const collectTemplateComponents = async (
  templateName: string
): Promise<CollectedItem[]> => {
  const templatePaths = getTemplatePaths(templateName);
  const templateKey = requireNonEmpty(toPascalCase(templateName), `Could not derive a template key from ${templateName}`);
  const usedImportNames = new Set<string>();
  const usedComponentNames = new Set<string>();

  const items = await collectGroupItems({
    directory: templatePaths.componentsDirectory,
    importPrefix: `${templateKey}Component`
  }, usedImportNames, usedComponentNames);
  log(`Collected ${items.length} components for ${templateName}`);
  return items;
};

/**
 * Builds the exported config symbol name for a template config file.
 * @param {string} templateName
 * @returns {string}
 */
const getTemplateConfigExportName = (templateName: string): string => {
  return `${requireNonEmpty(toPascalCase(templateName), `Could not derive a config export name from ${templateName}`)}Config`;
};

/**
 * Renders a string-keyed object of identifier references into TypeScript source.
 * @param {Record<string, string>} value
 * @returns {string}
 */
const renderIdentifierMap = (value: Record<string, string>): string => {
  return [
    "{",
    ...Object.entries(value).map(([key, identifier]) => {
      return `${JSON.stringify(key)}: ${identifier},`;
    }),
    "}",
  ].join("\n");
};

/**
 * Creates the TypeScript source for a generated Puck config.
 * @param {CollectedItem[]} items
 * @param {string} outputFilePath
 * @param {string} templateName
 * @returns {string}
 */
const buildConfigSource = (
  items: CollectedItem[],
  outputFilePath: string,
  templateName: string
): string => {
  const configExportName = getTemplateConfigExportName(templateName);
  const importLines = items.map((item) => {
    const importPath = toPosixPath(path.relative(path.dirname(outputFilePath), path.join(ROOT_DIR, item.fileRelativeToRoot)).replace(/\.[^/.]+$/, ""));
    const normalizedImportPath = importPath.startsWith(".") ? importPath : `./${importPath}`;
    return `import { ${item.exportName} as ${item.importName} } from "${normalizedImportPath}";`;
  });
  const componentNames = items.map((item) => {
    return item.componentName;
  });
  const components = Object.fromEntries(items.map((item) => {
    return [item.componentName, item.importName];
  })) as Record<string, string>;
  const configObject = {
    categories: {
      ...(items.length > 0 ? {
        components: {
          title: "Components",
          components: componentNames,
        },
      } : {}),
      other: {
        title: "Other",
        visible: false,
        components: [],
      },
    },
  };
  const configLines = [`export const ${configExportName}: Config = {`];

  if (Object.keys(components).length > 0) {
    configLines.push(`components: ${renderIdentifierMap(components)},`);
  } else {
    configLines.push("components: {},", "// No components found in this template registry");
  }

  configLines.push(`categories: ${JSON.stringify(configObject.categories)},`);

  configLines.push("};");

  return [
    "/** THIS FILE IS AUTOGENERATED BY scripts/generateTemplateConfig.ts */",
    'import type { Config } from "@puckeditor/core";',
    ...(importLines.length > 0 ? ["", ...importLines] : []),
    "",
    ...configLines,
    "",
  ].join("\n");
};

/**
 * Renders a template file from `temp/base.tsx` by inserting the registry config
 * import, replacing `TEMPLATE_CONFIG`, and renaming the exported component.
 * @param {string} baseSource
 * @param {string} templateName
 * @param {string} configImportPath
 * @param {string} configExportName
 * @returns {string}
 */
const buildTemplateSource = (
  baseSource: string,
  templateName: string,
  configImportPath: string,
  configExportName: string
): string => {
  log(`Rendering template source for ${templateName}`);
  const templateComponentName = requireNonEmpty(toPascalCase(templateName), `Could not derive a template component name from ${templateName}`);
  if (!baseSource.includes("TEMPLATE_CONFIG")) {
    throw new Error(`Could not find TEMPLATE_CONFIG placeholder in ${TEMP_BASE_TEMPLATE_PATH}`);
  }

  const renderedBaseSource = baseSource.replace(/\bTEMPLATE_CONFIG\b/g, configExportName);
  const sourceFilePath = path.join(ROOT_DIR, "__generated_template_source__.tsx");
  const existing = AST_PROJECT.getSourceFile(sourceFilePath);
  if (existing) {
    existing.deleteImmediatelySync();
  }

  const sourceFile = AST_PROJECT.createSourceFile(sourceFilePath, renderedBaseSource, {
    overwrite: true,
  });
  const pagesComponentsImport = sourceFile.getImportDeclarations().find((item) => {
    return item.getModuleSpecifierValue() === "@yext/pages-components";
  });
  if (!pagesComponentsImport) {
    sourceFile.forget();
    throw new Error(`Could not find config import anchor in ${TEMP_BASE_TEMPLATE_PATH}`);
  }

  sourceFile.insertImportDeclaration(pagesComponentsImport.getChildIndex() + 1, {
    namedImports: [configExportName],
    moduleSpecifier: configImportPath,
  });

  const locationDeclaration = sourceFile.getVariableDeclaration("Location");
  if (!locationDeclaration) {
    sourceFile.forget();
    throw new Error(`Could not find Location component placeholder in ${TEMP_BASE_TEMPLATE_PATH}`);
  }
  locationDeclaration.rename(templateComponentName);

  const exportAssignment = sourceFile.getExportAssignment((assignment) => {
    return !assignment.isExportEquals();
  });
  if (!exportAssignment) {
    sourceFile.forget();
    throw new Error(`Could not find default export placeholder in ${TEMP_BASE_TEMPLATE_PATH}`);
  }
  exportAssignment.setExpression(templateComponentName);

  const renderedTemplateSource = sourceFile.getFullText();
  sourceFile.forget();
  return renderedTemplateSource;
};

/**
 * Gets a fresh source file for manipulation.
 * @param {string} filePath
 * @returns {Promise<import("ts-morph").SourceFile>}
 */
const getAstSourceFile = async (filePath: string): Promise<SourceFile> => {
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
const removeNamedImports = (
  sourceFile: SourceFile,
  moduleSpecifier: string,
  namesToRemove: string[]
): void => {
  const declaration = sourceFile.getImportDeclarations().find((item) => {
    return item.getModuleSpecifierValue() === moduleSpecifier;
  });
  if (!declaration) {
    return;
  }

  for (const namedImport of declaration.getNamedImports()) {
    if (namesToRemove.includes(namedImport.getName())) {
      namedImport.remove();
    }
  }

  if (declaration.getNamedImports().length === 0 && !declaration.getDefaultImport() && !declaration.getNamespaceImport()) {
    declaration.remove();
  }
};

/**
 * Removes prior generated config imports from a source file.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @returns {void}
 */
const removeGeneratedConfigImports = (sourceFile: SourceFile): void => {
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
const insertNamedImport = (
  sourceFile: SourceFile,
  options: InsertNamedImportOptions
): void => {
  const pagesComponentsImport = sourceFile.getImportDeclarations().find((item) => {
    return item.getModuleSpecifierValue() === "@yext/pages-components";
  });

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
 * Ensures a side-effect import is present.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string} moduleSpecifier
 * @returns {void}
 */
const ensureSideEffectImport = (
  sourceFile: SourceFile,
  moduleSpecifier: string
): void => {
  const exists = sourceFile.getImportDeclarations().some((item) => {
    return item.getModuleSpecifierValue() === moduleSpecifier;
  });
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
const ensureNamedImport = (
  sourceFile: SourceFile,
  moduleSpecifier: string,
  importNames: string[]
): void => {
  const declaration = sourceFile.getImportDeclarations().find((item) => {
    return item.getModuleSpecifierValue() === moduleSpecifier;
  });

  if (!declaration) {
    sourceFile.insertImportDeclaration(0, {
      moduleSpecifier,
      namedImports: importNames,
    });
    return;
  }

  for (const importName of importNames) {
    const hasImport = declaration.getNamedImports().some((item) => {
      return item.getName() === importName;
    });

    if (!hasImport) {
      declaration.addNamedImport(importName);
    }
  }
};

/**
 * Builds the local config identifier used in `edit.tsx`.
 * @param {string} templateName
 * @returns {string}
 */
const getEditConfigIdentifier = (templateName: string): string => {
  return `${requireNonEmpty(toCamelCase(templateName), `Could not derive an edit config identifier from ${templateName}`)}Config`;
};

/**
 * Rewrites `componentRegistry` to preserve existing `directory` and `locator`
 * entries while adding registry template entries.
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {string[]} templateNames
 * @returns {void}
 */
const setEditComponentRegistry = (
  sourceFile: SourceFile,
  templateNames: string[]
): void => {
  const declaration = sourceFile.getVariableDeclaration("componentRegistry");
  if (!declaration) {
    return;
  }

  const initializer = declaration.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!initializer) {
    const registryEntries = templateNames.map((templateName: string) => {
      return `  "${templateName}": ${getEditConfigIdentifier(templateName)},`;
    }).join("\n");
    declaration.setInitializer(`{
${registryEntries}
}`);
    return;
  }

  for (const property of initializer.getProperties()) {
    const propertyAssignment = property.asKind(SyntaxKind.PropertyAssignment);
    if (!propertyAssignment) {
      continue;
    }

    const propertyName = propertyAssignment.getName();
    if (PRESERVED_EDIT_REGISTRY_KEYS.has(propertyName)) {
      continue;
    }

    propertyAssignment.remove();
  }

  for (const templateName of templateNames) {
    initializer.addPropertyAssignment({
      name: `"${templateName}"`,
      initializer: getEditConfigIdentifier(templateName),
    });
  }
};

/**
 * Updates `src/templates/edit.tsx` to import each generated config and register it.
 * @param {string[]} templateNames
 * @returns {Promise<boolean>}
 */
const updateEditTemplateConfig = async (
  templateNames: string[]
): Promise<boolean> => {
  if (!(await fileExists(EDIT_TEMPLATE_PATH))) {
    warn(`Skipping edit template update because ${EDIT_TEMPLATE_PATH} does not exist`);
    return false;
  }

  log("Updating edit template registry imports");
  const originalSource = await fs.readFile(EDIT_TEMPLATE_PATH, "utf8");
  const sourceFile = await getAstSourceFile(EDIT_TEMPLATE_PATH);

  removeNamedImports(sourceFile, "@yext/visual-editor", ["mainConfig"]);
  removeGeneratedConfigImports(sourceFile);
  ensureSideEffectImport(sourceFile, "@yext/visual-editor/editor.css");
  ensureSideEffectImport(sourceFile, "../index.css");

  for (const templateName of templateNames) {
    const templatePaths = getTemplatePaths(templateName);
    const importTarget = toPosixPath(path.relative(path.dirname(EDIT_TEMPLATE_PATH), templatePaths.configPath).replace(/\.[^/.]+$/, ""));
    const normalizedImportTarget = importTarget.startsWith(".") ? importTarget : `./${importTarget}`;

    insertNamedImport(sourceFile, {
      namedImports: [
        {
          name: getTemplateConfigExportName(templateName),
          alias: getEditConfigIdentifier(templateName),
        },
      ],
      moduleSpecifier: normalizedImportTarget,
    });
  }

  setEditComponentRegistry(sourceFile, templateNames);

  sourceFile.formatText();
  const updatedSource = sourceFile.getFullText();
  sourceFile.forget();

  if (updatedSource === originalSource) {
    log("Edit template did not change");
    return false;
  }

  await fs.writeFile(EDIT_TEMPLATE_PATH, updatedSource, "utf8");
  log(`Wrote updated edit template to ${EDIT_TEMPLATE_PATH}`);
  return true;
};

/**
 * Generates a config file for one template.
 * @param {string} templateName
 * @returns {Promise<GeneratedConfigResult>}
 */
const generateTemplateRegistryConfig = async (
  templateName: string
): Promise<GeneratedConfigResult> => {
  log(`Generating config for ${templateName}`);
  const templatePaths = getTemplatePaths(templateName);
  const items = await collectTemplateComponents(templateName);
  const source = buildConfigSource(items, templatePaths.configPath, templateName);
  const formattedSource = await prettier.format(source, {
    filepath: templatePaths.configPath,
  });

  await fs.mkdir(path.dirname(templatePaths.configPath), { recursive: true });
  await fs.writeFile(templatePaths.configPath, formattedSource, "utf8");
  log(`Wrote config for ${templateName} to ${templatePaths.configPath}`);

  return {
    templateName,
    configPath: templatePaths.configPath,
    totalCount: items.length,
  };
};

/**
 * Builds a manifest entry for a registry template that is missing from the manifest.
 * @param {string} templateName
 * @param {string} defaultLayoutData
 * @returns {TemplateManifestEntry}
 */
const buildTemplateManifestEntry = (
  templateName: string,
  defaultLayoutData: string
): TemplateManifestEntry => {
  return {
    name: templateName,
    description: `Autogenerated template entry for ${templateName}.`,
    exampleSiteUrl: "",
    layoutRequired: true,
    defaultLayoutData,
  };
};

/**
 * Updates `.template-manifest.json` so matching template entries use
 * `src/registry/<template>/defaultLayout.json` as `defaultLayoutData`,
 * creating manifest entries when they are missing.
 * @param {string[]} templateNames
 * @returns {Promise<boolean>}
 */
const updateTemplateManifest = async (
  templateNames: string[]
): Promise<boolean> => {
  if (!(await fileExists(TEMPLATE_MANIFEST_PATH))) {
    warn(`Skipping manifest update because ${TEMPLATE_MANIFEST_PATH} does not exist`);
    return false;
  }

  log("Updating template manifest");
  const manifestSource = await fs.readFile(TEMPLATE_MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(manifestSource) as ManifestFile;
  if (!Array.isArray(manifest.templates)) {
    warn("Skipping manifest update because templates is not an array");
    return false;
  }

  let updated = false;

  for (const templateName of templateNames) {
    const templatePaths = getTemplatePaths(templateName);
    if (!(await fileExists(templatePaths.defaultLayoutPath))) {
      warn(`Skipping default layout for ${templateName} because ${templatePaths.defaultLayoutPath} does not exist`);
      continue;
    }

    let templateEntry = manifest.templates.find((template) => {
      return template?.name === templateName;
    });
    const defaultLayoutSource = await fs.readFile(templatePaths.defaultLayoutPath, "utf8");
    const defaultLayoutData = JSON.stringify(JSON.parse(defaultLayoutSource));

    if (!templateEntry) {
      templateEntry = buildTemplateManifestEntry(templateName, defaultLayoutData);
      manifest.templates.push(templateEntry);
      updated = true;
      log(`Added manifest entry for ${templateName}`);
      continue;
    }

    if (templateEntry.defaultLayoutData !== defaultLayoutData) {
      templateEntry.defaultLayoutData = defaultLayoutData;
      updated = true;
      log(`Updated defaultLayoutData for ${templateName}`);
    }
  }

  if (!updated) {
    log("Template manifest did not change");
    return false;
  }

  await fs.writeFile(TEMPLATE_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  log(`Wrote updated manifest to ${TEMPLATE_MANIFEST_PATH}`);
  return true;
};

/**
 * Copies `temp/base.tsx` to a template file and renders the template-specific
 * component name and config import.
 * @param {string} templateName
 * @returns {Promise<boolean>}
 */
const generateTemplateFile = async (templateName: string): Promise<boolean> => {
  if (!(await fileExists(TEMP_BASE_TEMPLATE_PATH))) {
    warn(`Skipping template generation because ${TEMP_BASE_TEMPLATE_PATH} does not exist`);
    return false;
  }

  log(`Generating template file for ${templateName}`);
  const templatePaths = getTemplatePaths(templateName);
  const configExportName = getTemplateConfigExportName(templateName);
  const configImportPath = toPosixPath(path.relative(path.dirname(templatePaths.templatePath), templatePaths.configPath).replace(/\.[^/.]+$/, ""));
  const normalizedConfigImportPath = configImportPath.startsWith(".") ? configImportPath : `./${configImportPath}`;

  await fs.mkdir(path.dirname(templatePaths.templatePath), { recursive: true });
  const baseSource = await fs.readFile(TEMP_BASE_TEMPLATE_PATH, "utf8");
  const renderedTemplateSource = buildTemplateSource(baseSource, templateName, normalizedConfigImportPath, configExportName);

  let previousSource = "";
  if (await fileExists(templatePaths.templatePath)) {
    previousSource = await fs.readFile(templatePaths.templatePath, "utf8");
  }

  if (previousSource === renderedTemplateSource) {
    log(`Template file for ${templateName} did not change`);
    return false;
  }

  await fs.writeFile(templatePaths.templatePath, renderedTemplateSource, "utf8");
  log(`Wrote template file for ${templateName} to ${templatePaths.templatePath}`);
  return true;
};

/**
 * Generates all template configs, copies `temp/base.tsx` to per-template template files,
 * updates or creates matching `.template-manifest.json` entries, and patches `edit.tsx`.
 * @returns {Promise<GenerateTemplateConfigResult>}
 */
export const generateTemplateConfig = async (): Promise<GenerateTemplateConfigResult> => {
  log("Starting generation");
  const templateNames = await getTemplateNames();
  const generatedConfigs: GeneratedConfigResult[] = [];

  for (const templateName of templateNames) {
    const generatedConfig = await generateTemplateRegistryConfig(templateName);
    generatedConfigs.push(generatedConfig);
  }

  for (const templateName of templateNames) {
    await generateTemplateFile(templateName);
  }

  const updatedTemplateManifest = await updateTemplateManifest(templateNames);
  const updatedEditTemplate = await updateEditTemplateConfig(templateNames);

  log("Finished generation", {
    templateNames,
    updatedTemplateManifest,
    updatedEditTemplate,
    generatedConfigCount: generatedConfigs.length,
  });

  return {
    templateNames,
    updatedTemplateManifest,
    updatedEditTemplate,
    generatedConfigs,
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateTemplateConfig().catch((cause) => {
    error("Failed to generate template config:", cause);
    process.exitCode = 1;
  });
}
