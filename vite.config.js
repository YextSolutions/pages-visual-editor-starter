import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yextSSG from "@yext/pages/vite-plugin";
import { yextVisualEditorPlugin } from "@yext/visual-editor/plugin"

export default defineConfig({
  plugins: [react(), yextVisualEditorPlugin(), yextSSG()],
});
