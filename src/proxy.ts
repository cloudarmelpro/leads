import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n/config";

/**
 * Le fichier s'appelle `proxy.ts` : depuis Next.js 16, le middleware a été renommé.
 * Ne jamais créer `middleware.ts` — il serait ignoré.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Canonicalisation de l'hôte : www → apex (avec Location absolue). Évite le
  //    contenu dupliqué www/apex servi sans redirection.
  const host = request.nextUrl.hostname;
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.hostname = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  // 2. Locale déjà présente (comparaison insensible à la casse). Une URL en
  //    majuscules (`/FR`) est ainsi reconnue et laissée à Next, plutôt que
  //    préfixée en `/fr/FR` → 404.
  const first = pathname.split("/")[1]?.toLowerCase();
  const hasLocale = first !== undefined && (locales as readonly string[]).includes(first);
  if (hasLocale) return;

  // 3. Français par défaut (marché québécois) : on ignore volontairement
  //    `Accept-Language` pour ne pas rediriger un visiteur anglophone vers /en
  //    d'entrée. L'utilisateur peut ensuite basculer via le sélecteur de langue.
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
