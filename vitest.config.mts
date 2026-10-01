import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Tests unitaires des services, schémas et actions (ARCHITECTURE.md, « Tests »). Node pur :
// `server-only` est remplacé par un module vide (hors Next, le vrai jette à l'import).
const src = fileURLToPath(new URL("./src/", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": src,
      "server-only": `${src}test/server-only.ts`,
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
  },
});
