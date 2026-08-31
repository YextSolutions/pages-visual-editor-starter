import { readFile, writeFile } from "node:fs/promises";

/**
 * @typedef {Record<string, string>} DependencyMap
 */

/**
 * @typedef {{
 *   dependencies?: DependencyMap,
 *   devDependencies?: DependencyMap,
 * }} PackageManifest
 */

const excludedPackageNames = new Set(["@yext/visual-editor"]);

/**
 * Updates starter dependencies in place using the shared package version map from visual-editor.
 *
 * The sync only touches starter packages that already exist so the dev-release PR:
 * 1. Preserves starter-only dependencies.
 * 2. Aligns shared runtime and tooling versions with visual-editor.
 * 3. Leaves the special pkg.pr.new visual-editor dependency flow untouched.
 *
 * @param {PackageManifest} packageManifest
 * @param {DependencyMap} sharedPackageVersions
 * @returns {boolean}
 */
function syncSharedPackageVersions(packageManifest, sharedPackageVersions) {
  let didUpdate = false;

  for (const sectionName of ["dependencies", "devDependencies"]) {
    const dependencies = packageManifest[sectionName];
    if (!dependencies) {
      continue;
    }

    for (const [packageName, currentVersion] of Object.entries(dependencies)) {
      if (excludedPackageNames.has(packageName)) {
        continue;
      }

      const nextVersion = sharedPackageVersions[packageName];
      if (!nextVersion || nextVersion === currentVersion) {
        continue;
      }

      dependencies[packageName] = nextVersion;
      didUpdate = true;
    }
  }

  return didUpdate;
}

/**
 * @param {string} filePath
 * @returns {Promise<PackageManifest>}
 */
async function readPackageManifest(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

/**
 * @param {string} filePath
 * @param {PackageManifest} packageManifest
 * @returns {Promise<void>}
 */
async function writePackageManifest(filePath, packageManifest) {
  await writeFile(filePath, `${JSON.stringify(packageManifest, null, 2)}\n`);
}

/**
 * Safely parses the incoming shared package version payload.
 *
 * The workflow treats the dispatch payload as the source of truth, but malformed,
 * missing, null, or non-object payloads should behave like an empty map so the
 * release branch flow can continue without failing.
 *
 * @param {string} sharedPackageVersionsJson
 * @returns {DependencyMap}
 */
function parseSharedPackageVersions(sharedPackageVersionsJson) {
  try {
    const parsedSharedPackageVersions = JSON.parse(sharedPackageVersionsJson);

    if (
      !parsedSharedPackageVersions ||
      typeof parsedSharedPackageVersions !== "object" ||
      Array.isArray(parsedSharedPackageVersions)
    ) {
      return {};
    }

    return parsedSharedPackageVersions;
  } catch {
    return {};
  }
}

/**
 * 1. Read the starter package manifest.
 * 2. Safely normalize the incoming shared version payload.
 * 3. Update only overlapping shared packages when versions actually differ.
 * 4. Rewrite package.json only when at least one dependency changed.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const [packageManifestPath, sharedPackageVersionsJson = "{}"] =
    process.argv.slice(2);

  if (!packageManifestPath) {
    throw new Error(
      "Expected a package.json path: node updateSharedPackageVersions.mjs <package.json> <sharedPackageVersionsJson>",
    );
  }

  const [packageManifest, sharedPackageVersions] = await Promise.all([
    readPackageManifest(packageManifestPath),
    Promise.resolve(parseSharedPackageVersions(sharedPackageVersionsJson)),
  ]);

  const didUpdate = syncSharedPackageVersions(
    packageManifest,
    sharedPackageVersions,
  );

  if (!didUpdate) {
    return;
  }

  await writePackageManifest(packageManifestPath, packageManifest);
}

await main();
