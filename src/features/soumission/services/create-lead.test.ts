import { beforeEach, describe, expect, it, vi } from "vitest";

import { createLead, type LeadInput } from "./create-lead";

const { getSql, sendLeadNotification } = vi.hoisted(() => ({
  getSql: vi.fn(),
  sendLeadNotification: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ getSql }));
vi.mock("@/lib/email/send-lead-notification", () => ({ sendLeadNotification }));

const lead: LeadInput = { name: "Marie Tremblay", email: "marie@example.com", phone: "", message: "Projet : Site web", locale: "fr" };

/** Faux client SQL : enregistre les valeurs interpolées du gabarit, puis réussit ou échoue. */
function fakeSql(fail?: Error) {
  const calls: unknown[][] = [];
  const sql = async (_strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push(values);
    if (fail) throw fail;
    return [];
  };
  return { sql, calls };
}

describe("createLead — règle 9 : un lead ne se perd jamais en silence", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("refuse (ok: false) quand la base n'est pas configurée, sans tenter de notifier", async () => {
    getSql.mockReturnValue(null);
    await expect(createLead(lead)).resolves.toEqual({ ok: false });
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("refuse (ok: false) quand l'écriture échoue, sans notifier", async () => {
    const { sql } = fakeSql(new Error("connection refused"));
    getSql.mockReturnValue(sql);
    await expect(createLead(lead)).resolves.toEqual({ ok: false });
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("réussit et notifie une fois le lead écrit", async () => {
    const { sql, calls } = fakeSql();
    getSql.mockReturnValue(sql);
    sendLeadNotification.mockResolvedValue(undefined);
    await expect(createLead(lead)).resolves.toEqual({ ok: true });
    expect(calls).toHaveLength(1);
    expect(sendLeadNotification).toHaveBeenCalledWith(lead);
  });

  it("réussit même si la notification courriel échoue (best-effort)", async () => {
    const { sql } = fakeSql();
    getSql.mockReturnValue(sql);
    sendLeadNotification.mockRejectedValue(new Error("resend down"));
    await expect(createLead(lead)).resolves.toEqual({ ok: true });
  });

  it("écrit NULL (et non une chaîne vide) pour un courriel ou un téléphone absent", async () => {
    const { sql, calls } = fakeSql();
    getSql.mockReturnValue(sql);
    sendLeadNotification.mockResolvedValue(undefined);
    await createLead({ ...lead, email: "", phone: "" });
    const [name, email, phone, message, locale] = calls[0] ?? [];
    expect(name).toBe("Marie Tremblay");
    expect(email).toBeNull();
    expect(phone).toBeNull();
    expect(message).toBe("Projet : Site web");
    expect(locale).toBe("fr");
  });

  it("ne logue jamais les données du lead", async () => {
    const { sql } = fakeSql(new Error("boom"));
    getSql.mockReturnValue(sql);
    await createLead(lead);
    const logged = vi.mocked(console.error).mock.calls.flat().map(String).join(" ");
    expect(logged).not.toContain("Marie");
    expect(logged).not.toContain("marie@example.com");
  });
});
