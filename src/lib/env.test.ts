import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** `env` est figé à l'import : on recharge le module après chaque `vi.stubEnv`. */
async function load() {
  vi.resetModules();
  return (await import("./env")).env;
}

describe("env — lecture des variables d'environnement", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retire les guillemets de bord laissés par le panneau d'hébergement (incident Resend 422)", async () => {
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", '"cedric@talgasyweb.ca""');
    vi.stubEnv("LEAD_FROM_EMAIL", "'no-reply@talgasyweb.ca'");
    vi.stubEnv("DATABASE_URL", '"postgresql://user:pw@host/db"');
    const env = await load();
    expect(env.LEAD_NOTIFICATION_EMAIL).toBe("cedric@talgasyweb.ca");
    expect(env.LEAD_FROM_EMAIL).toBe("no-reply@talgasyweb.ca");
    expect(env.DATABASE_URL).toBe("postgresql://user:pw@host/db");
  });

  it("ignore une adresse mal formée et retombe sur l'expéditeur par défaut", async () => {
    vi.stubEnv("LEAD_NOTIFICATION_EMAIL", "pas une adresse");
    vi.stubEnv("LEAD_FROM_EMAIL", "a@b");
    const env = await load();
    expect(env.LEAD_NOTIFICATION_EMAIL).toBeUndefined();
    expect(env.LEAD_FROM_EMAIL).toBe("onboarding@resend.dev");
  });

  it("ignore une URL de base qui n'est pas Postgres", async () => {
    vi.stubEnv("DATABASE_URL", "mysql://x");
    const env = await load();
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it("traite une valeur vide comme absente", async () => {
    vi.stubEnv("RESEND_API_KEY", "   ");
    const env = await load();
    expect(env.RESEND_API_KEY).toBeUndefined();
  });
});
