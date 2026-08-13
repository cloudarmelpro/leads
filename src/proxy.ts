import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n/config";

/**
 * Le fichier s'appelle `proxy.ts` : depuis Next.js 16, le middleware a été renommé.
 * Ne jamais créer `middleware.ts` — il serait ignoré.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  // Français par défaut (marché québécois) : on ignore volontairement
  // `Accept-Language` pour ne pas rediriger un visiteur anglophone vers /en
  // d'entrée. L'utilisateur peut ensuite basculer via le sélecteur de langue.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  // 308 (permanent) : le mapping « chemin sans locale → /fr » est stable (français
  // par défaut, marché québécois) → cacheable navigateur/CDN + signal crawler plus net.
  return NextResponse.redirect(url, 308);
}

export const config = {
  // On écarte les fichiers internes et tout chemin portant une extension (assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
