import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  root: "src/",
  publicDir: path.resolve(__dirname, "public"),
  base: "/systems/hellpiercers/",
  server: {
    port: 30001,
    open: true,
    proxy: {
      "^(?!/systems/hellpiercers/)": "http://localhost:30000/",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: "hellpiercers",
      entry: "hellpiercers.mjs",
      formats: ["es"],
      fileName: "hellpiercers",
    },
  },
  plugins: [svelte({ preprocess: vitePreprocess() })],
});
