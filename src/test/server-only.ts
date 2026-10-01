// Remplace le paquet `server-only` sous Vitest (voir vitest.config.ts) : hors du bundler de
// Next, le vrai module jette à l'import, ce qui rendrait les services intestables.
export {};
