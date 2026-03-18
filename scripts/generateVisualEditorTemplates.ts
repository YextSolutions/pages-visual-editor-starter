import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { yextVisualEditorPlugin } from "@yext/visual-editor/plugin";
import type { ConfigEnv, Plugin } from "vite";

/**
 * High-level overview:
 *
 * 1) Instantiate the Visual Editor Vite plugin directly from Node.
 * 2) Run the plugin's setup hooks so it creates the temporary template files,
 *    including `temp/base.tsx`.
 * 3) Execute `scripts/generateTemplateConfig.ts`, which reads `src/registry`
 *    and generates the template/config outputs in the starter.
 * 4) Always run the plugin cleanup hook afterward so temporary Visual Editor
 *    files are removed, even if generation fails.
 * 5) Remove the `temp/` directory too when it is left empty after cleanup.
 */
const log = (...messages: unknown[]): void => {
  console.log("[generateVisualEditorTemplates]", ...messages);
};

// Runs the existing template generator in a child process and streams its
// output so this wrapper behaves like a normal package script.
const runScript = (scriptPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--import", "tsx", scriptPath],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      }
    );

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${scriptPath} exited from signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${scriptPath} exited with code ${code ?? "unknown"}`));
        return;
      }

      resolve();
    });
  });
};

// Calls the Vite plugin lifecycle hook directly. This lets us reuse the plugin's
// file generation and cleanup behavior without starting the Vite dev server.
const runPluginHook = async (
  plugin: Plugin,
  hookName: "buildStart" | "buildEnd"
): Promise<void> => {
  const hook = plugin[hookName];
  if (!hook) {
    return;
  }

  if (typeof hook === "function") {
    await hook.call(plugin);
    return;
  }

  await hook.handler.call(plugin);
};

// The plugin removes generated files, but it does not remove the now-empty
// `temp/` directory, so this keeps the workspace tidy after the run.
const removeDirectoryIfEmpty = async (directoryPath: string): Promise<void> => {
  try {
    const entries = await fs.readdir(directoryPath);
    if (entries.length === 0) {
      await fs.rmdir(directoryPath);
    }
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
};

const run = async (): Promise<void> => {
  const plugin = yextVisualEditorPlugin();
  const configEnv: ConfigEnv = {
    command: "build",
    mode: "production",
    isSsrBuild: false,
    isPreview: false,
  };

  // Mark this as a build-mode run so the plugin performs its build-time cleanup
  // logic when we invoke `buildEnd`.
  plugin.config?.call(plugin, {}, configEnv);

  log("Generating Visual Editor temp files");
  await runPluginHook(plugin, "buildStart");

  try {
    log("Generating template configs from src/registry");
    await runScript("scripts/generateTemplateConfig.ts");
  } finally {
    log("Cleaning up Visual Editor temp files");
    await runPluginHook(plugin, "buildEnd");
    await removeDirectoryIfEmpty(path.join(process.cwd(), "temp"));
  }
};

run().catch((err: unknown) => {
  console.error("[generateVisualEditorTemplates]", err);
  process.exitCode = 1;
});
