import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yextSSG from "@yext/pages/vite-plugin";
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@yext/pages/util': path.resolve('./node_modules/@yext/pages/dist/util')
    }
  },
  plugins: [react(), yextSSG()],
});
