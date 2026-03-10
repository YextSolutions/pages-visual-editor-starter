import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yextSSG from "@yext/pages/vite-plugin";
import { yextVisualEditorPlugin } from "@yext/visual-editor/plugin";
import { generateTemplateConfig } from "./scripts/generateTemplateConfig.mjs";

const DEV_CLEANUP_TARGETS = [
  path.resolve(process.cwd(), "src/templates/main.tsx"),
  path.resolve(process.cwd(), ".template-manifest.json"),
];

const createVisualEditorCleanupPlugin = () => {
  let cleaned = false;

  const cleanup = () => {
    if (cleaned) {
      return;
    }
    cleaned = true;

    for (const filePath of DEV_CLEANUP_TARGETS) {
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
      }
    }
  };

  return {
    name: "visual-editor-cleanup",
    configureServer(server) {
      server.httpServer?.once("close", cleanup);
      process.once("exit", cleanup);
      process.once("SIGINT", cleanup);
      process.once("SIGTERM", cleanup);
    },
    closeBundle() {
      cleanup();
    },
  };
};

const applyGeneratedTemplateConfigPlugin = () => {
  let hasRun = false;

  return {
    name: "apply-generated-template-config",
    async configResolved() {
      if (hasRun) {
        return;
      }
      hasRun = true;
      await generateTemplateConfig({ silent: true });
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    createVisualEditorCleanupPlugin(),
    yextVisualEditorPlugin(),
    applyGeneratedTemplateConfigPlugin(),
    yextSSG(),
  ],
});
