import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@reader": path.resolve(__dirname, "./src/reader"),
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./index.html",
        reader: "./reader.html",
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
});
