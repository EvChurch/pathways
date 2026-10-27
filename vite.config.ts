import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/pathways/" : "/",
  build: {
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      input: {
        index: "index.html",
        test: "test.html",
      },
    },
  },
});
