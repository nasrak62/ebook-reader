import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    // This is the key part to tell Vite to build this as a standalone script
    lib: {
      entry: resolve(__dirname, "src/background/index.ts"), // Path to your background script
      name: "background", // An arbitrary name for the library
      formats: ["es"], // Output as an ES module, which is what service workers expect
      fileName: () => "background.js", // Ensure the output file is named exactly what manifest.json needs
    },
    outDir: "build", // The output directory, should match the other build
    emptyOutDir: false, // Don't clear the dist folder, as the main build will also use it
  },
});
