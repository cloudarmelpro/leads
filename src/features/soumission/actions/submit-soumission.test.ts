import { beforeEach, describe, expect, it, vi } from "vitest";

import fr from "@/lib/i18n/dictionaries/fr.json";

import { submitSoumission } from "./submit-soumission";

const { createLead, headerStore } = vi.hoisted(() => ({
  createLead: vi.fn(),
  headerStore: new Map<string, string>(),
}));
vi.mock("@/features/soumission/services/create-lead", () => ({ createLead }));
vi.mock("@/lib/i18n/dictionaries", () => ({ getDictionary: async () => fr }));
vi.mock("next/headers", () => ({ headers: async () => ({ get: (k: string) => headerStore.get(k) ?? null }) }));

let ipCounter = 0;
/** Une IP neuve par test : le limiteur de débit est un état de module. */
const freshIp = () => headerStore.set("x-forwarded-for", `203.0.113.${++ipCounter}`);

const valid = {
  type: "web",
  sector: "pme",
  stage: "idea",
  when: "month",
  site: "https://exemple.ca",
  details: "Refonte complète.",
  name: "Marie Tremblay",
  company: "Paysages Tremblay",
  email: "marie@example.com",
  phone: "",
  city: "Québec",
  consent: true,
  website: "",
};

describe("submitSoumission", () => {
  beforeEach(() => {
    freshIp();
    createLead.mockResolvedValue({ ok: true });
  });

  it("enregistre le lead avec un résumé lisible des réponses, dans la langue du visiteur", async () => {
    await expect(submitSoumission(valid, "fr")).resolves.toEqual({ status: "success" });
    expect(createLead).toHaveBeenCalledTimes(1);
    const input = createLead.mock.calls[0]?.[0] as { name: string; email: string; phone: string; message: string; locale: string };
    expect(input.name).toBe("Marie Tremblay");
    expect(input.email).toBe("marie@example.com");
    expect(input.locale).toBe("fr");
    expect(input.message).toContain(`${fr.soumission.summary.type} : Site web`);
    expect(input.message).toContain(`${fr.soumission.summary.sector} : PME`);
    expect(input.message).toContain(`${fr.soumission.summary.site} : https://exemple.ca`);
    expect(input.message).toContain("Refonte complète.");
  });

  it("retombe sur le français quand la langue est inconnue", async () => {
    await submitSoumission(valid, "xx");
    expect(createLead.mock.calls[0]?.[0]).toMatchObject({ locale: "fr" });
  });

  it("feint le succès et n'enregistre rien quand le champ leurre est rempli (bot)", async () => {
    await expect(submitSoumission({ ...valid, website: "http://spam.example" }, "fr")).resolves.toEqual({ status: "success" });
    expect(createLead).not.toHaveBeenCalled();
  });

  it("renvoie la clé d'erreur de validation sans enregistrer", async () => {
    await expect(submitSoumission({ ...valid, consent: false }, "fr")).resolves.toEqual({ status: "error", error: "consent" });
    await expect(submitSoumission({ ...valid, name: "" }, "fr")).resolves.toEqual({ status: "error", error: "name" });
    expect(createLead).not.toHaveBeenCalled();
  });

  it("supporte une entrée forgée qui n'est pas un objet", async () => {
    await expect(submitSoumission(null, "fr")).resolves.toMatchObject({ status: "error" });
    await expect(submitSoumission("texte", "fr")).resolves.toMatchObject({ status: "error" });
    expect(createLead).not.toHaveBeenCalled();
  });

  it("ne dit jamais « succès » si l'enregistrement a échoué (règle 9)", async () => {
    createLead.mockResolvedValue({ ok: false });
    await expect(submitSoumission(valid, "fr")).resolves.toEqual({ status: "error", error: "generic" });
  });

  it("limite à 5 envois par heure et par IP, avec une réponse indiscernable d'une erreur", async () => {
    for (let i = 0; i < 5; i++) await expect(submitSoumission(valid, "fr")).resolves.toEqual({ status: "success" });
    await expect(submitSoumission(valid, "fr")).resolves.toEqual({ status: "error", error: "generic" });
    expect(createLead).toHaveBeenCalledTimes(5);
  });

  it("prend la DERNIÈRE IP de x-forwarded-for (celle écrite par le proxy de confiance)", async () => {
    headerStore.set("x-forwarded-for", "1.1.1.1, 203.0.113.250");
    for (let i = 0; i < 5; i++) await submitSoumission(valid, "fr");
    // Même IP de proxy, autre IP client forgée en tête : toujours bloqué.
    headerStore.set("x-forwarded-for", "9.9.9.9, 203.0.113.250");
    await expect(submitSoumission(valid, "fr")).resolves.toEqual({ status: "error", error: "generic" });
  });
});
