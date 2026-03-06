import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yextSSG from "@yext/pages/vite-plugin";
import { yextVisualEditorPlugin } from "@yext/visual-editor/plugin";
import { generateTemplateConfig } from "./scripts/generateTemplateConfig.mjs";

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
    yextVisualEditorPlugin(),
    applyGeneratedTemplateConfigPlugin(),
    yextSSG(),
  ],
});
