import { describe, expect, it } from "vitest";

import { getAllSlugs, getPost, getPosts, resolveSlug } from "./mock-posts";

// Les adresses des articles sont dans les liens, le sitemap et les hreflang : une collision ou un
// slug mal formé casserait une page ou une redirection (slugs anglais traduits le 2026-10-02).
describe("slugs du blogue", () => {
  it("chaque langue a des slugs uniques, en minuscules ASCII avec tirets", () => {
    for (const lang of ["fr", "en"] as const) {
      const slugs = getAllSlugs(lang);
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("aucun slug n'appartient à deux articles différents d'une langue à l'autre", () => {
    const owners = new Map<string, string>();
    for (const post of getPosts("fr")) {
      for (const slug of Object.values(post.slugs)) {
        expect(owners.get(slug) ?? post.slugs.fr).toBe(post.slugs.fr);
        owners.set(slug, post.slugs.fr);
      }
    }
  });

  it("getPost trouve l'article par le slug de sa langue seulement", () => {
    const post = getPost("en", "how-much-does-a-website-cost-in-quebec");
    expect(post?.slug).toBe("how-much-does-a-website-cost-in-quebec");
    expect(post?.slugs.fr).toBe("combien-coute-un-site-web-au-quebec");
    expect(getPost("en", "combien-coute-un-site-web-au-quebec")).toBeNull();
  });

  it("resolveSlug redirige l'ancienne adresse anglaise et le slug de l'autre langue", () => {
    expect(resolveSlug("en", "combien-coute-un-site-web-au-quebec")).toBe("how-much-does-a-website-cost-in-quebec");
    expect(resolveSlug("fr", "how-much-does-a-website-cost-in-quebec")).toBe("combien-coute-un-site-web-au-quebec");
    expect(resolveSlug("en", "how-much-does-a-website-cost-in-quebec")).toBeNull();
    expect(resolveSlug("fr", "inconnu")).toBeNull();
  });
});
