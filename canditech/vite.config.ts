import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      pages: resolve(__dirname, "src", "pages"),
      components: resolve(__dirname, "src", "components"),
      app: resolve(__dirname, "src", "app"),
      state: resolve(__dirname, "src", "state"),
    },
  },
  plugins: [vue()],
});
