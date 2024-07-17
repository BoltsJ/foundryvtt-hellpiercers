import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: path.resolve(__dirname, "public"),
  base: "/systems/hellpiercers/",
  server: {
    port: 30001,
    open: "/",
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
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "hellpiercers",
      entry: "src/hellpiercers.mjs",
      formats: ["es"],
      fileName: "hellpiercers",
    },
  },
  plugins: [
    svelte({ preprocess: vitePreprocess() }),
    {
      name: "foundry-hmr",
      handleHotUpdate({ file }) {
        if (file.endsWith(".hbs")) {
          const file_path = file.slice(file.indexOf("templates/"));
          const dest = path.resolve(__dirname, "dist/" + file_path);
          console.log(`Hot updating template '${file_path}'`);
          fs.copyFileSync(file, dest);
        }
        if (file.endsWith("en.json")) {
          const file_path = file.slice(file.indexOf("lang/"));
          const dest = path.resolve(__dirname, "dist/" + file_path);
          console.log(`Hot updating localization '${file_path}'`);
          fs.copyFileSync(file, dest);
        }
      },
    },
  ],
});
