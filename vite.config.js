import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yextSSG from "@yext/pages/vite-plugin";
import { yextVisualEditorPlugin } from "@yext/visual-editor/plugin";

const execFileAsync = promisify(execFile);

const applyGeneratedTemplateConfigPlugin = () => {
  let hasRun = false;

  return {
    name: "apply-generated-template-config",
    async buildStart() {
      if (hasRun) {
        return;
      }
      hasRun = true;

      await execFileAsync(process.execPath, [
        "--import",
        "tsx",
        "scripts/generateTemplateConfig.ts",
      ]);
    },
  };
};

export default defineConfig({
  plugins: [
    react(),
    yextVisualEditorPlugin(),
    yextSSG(),
  ],
});
