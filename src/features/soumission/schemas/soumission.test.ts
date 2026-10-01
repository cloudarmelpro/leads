import { describe, expect, it } from "vitest";

import { soumissionSchema, type SoumissionInput } from "./soumission";

const valid: SoumissionInput = {
  type: "web",
  sector: "pme",
  stage: "idea",
  when: "month",
  site: "",
  details: "Un site pour mon entreprise de paysagement.",
  name: "Marie Tremblay",
  company: "Paysages Tremblay",
  email: "marie@example.com",
  phone: "",
  city: "Québec",
  consent: true,
};

const firstError = (input: unknown) => {
  const result = soumissionSchema.safeParse(input);
  return result.success ? null : result.error.issues[0]?.message;
};

describe("soumissionSchema", () => {
  it("accepte une demande complète", () => {
    const result = soumissionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("exige le nom", () => {
    expect(firstError({ ...valid, name: "   " })).toBe("name");
  });

  it("exige le courriel OU le téléphone, pas les deux", () => {
    expect(firstError({ ...valid, email: "", phone: "" })).toBe("contactRequired");
    expect(firstError({ ...valid, email: "", phone: "438-808-6594" })).toBeNull();
    expect(firstError({ ...valid, email: "marie@example.com", phone: "" })).toBeNull();
  });

  it("rejette un courriel ou un téléphone manifestement invalides", () => {
    expect(firstError({ ...valid, email: "pas-un-courriel" })).toBe("email");
    expect(firstError({ ...valid, phone: "appelez-moi" })).toBe("phone");
  });

  it("exige la case de consentement (Loi 25)", () => {
    expect(firstError({ ...valid, consent: false })).toBe("consent");
    expect(firstError({ ...valid, consent: "true" })).toBe("consent");
  });

  it("n'accepte que les réponses connues du parcours", () => {
    expect(soumissionSchema.safeParse({ ...valid, type: "autre" }).success).toBe(false);
    expect(soumissionSchema.safeParse({ ...valid, sector: "" }).success).toBe(false);
  });

  it("aplatit les sauts de ligne des champs d'en-tête (anti-injection) et normalise en NFC", () => {
    const result = soumissionSchema.safeParse({ ...valid, name: "Marie\r\nBcc: x@y.z", company: "A\tB" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("Marie Bcc: x@y.z");
    expect(result.data.company).toBe("A B");
    expect(result.data.name).toBe(result.data.name.normalize("NFC"));
  });

  it("borne les longueurs", () => {
    expect(firstError({ ...valid, name: "a".repeat(121) })).toBe("nameMax");
    expect(firstError({ ...valid, details: "a".repeat(4001) })).toBe("tooLong");
    expect(firstError({ ...valid, email: `${"a".repeat(200)}@x.com` })).toBe("emailMax");
  });

  it("tolère le champ leurre vide ou absent", () => {
    expect(soumissionSchema.safeParse({ ...valid, website: "" }).success).toBe(true);
    expect(soumissionSchema.safeParse(valid).success).toBe(true);
  });
});
