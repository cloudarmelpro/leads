import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n/config";

/**
 * Le fichier s'appelle `proxy.ts` : depuis Next.js 16, le middleware a été renommé.
 * Ne jamais créer `middleware.ts` — il serait ignoré.
 */

function resolveLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  // "fr-CA,fr;q=0.9,en;q=0.8" → on garde la première locale supportée, par qualité.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const hit = locales.find((locale) => locale === base);
    if (hit) return hit;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // On écarte les fichiers internes et tout chemin portant une extension (assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
