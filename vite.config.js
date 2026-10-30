/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Contact endpoint during development: `npm run dev:api` (scripts/dev-api.mjs)
    proxy: {
      "/api/contact": {
        target: "http://127.0.0.1:8787",
        rewrite: () => "/api/contact.php",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    css: false,
  },
});
