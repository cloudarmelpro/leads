import type { NextConfig } from "next";

/**
 * CSP en `Report-Only`. ⚠️ CONTRAINTE HOSTINGER : le CDN (hcdn) ÉCRASE tout
 * en-tête `Content-Security-Policy` (enforce) de l'origine par le sien
 * (`upgrade-insecure-requests`). Envoyer notre politique en enforce la fait donc
 * DISPARAÎTRE. En `Report-Only` (nom d'en-tête différent), Hostinger la laisse
 * passer : notre politique reste au moins présente/observable, aux côtés du header
 * minimal de Hostinger. Pour une vraie CSP appliquée, il faudrait désactiver
 * l'injection d'en-têtes côté hPanel ou le CDN Hostinger (à voir avec le support).
 * Choix STATIQUE volontaire (pas de nonce → garde le SSG) ; `'unsafe-inline'`
 * couvre les scripts/styles inline (thème, JSON-LD, next/font). L'embed Cal.com est
 * autorisé sur `*.cal.com`. Aucune origine d'image externe : toutes les images du
 * site sont servies depuis `public/` (celles de l'iframe Cal.com relèvent de la CSP
 * de cal.com, pas de la nôtre) — réintroduire une origine ici exigerait de l'ajouter
 * à `img-src`.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://cal.com https://*.cal.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://app.cal.com https://*.cal.com",
  "frame-src https://cal.com https://app.cal.com https://*.cal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Pas de `preload` : l'inscription à la liste HSTS des navigateurs est
  // irréversible à court terme et engage tous les sous-domaines du domaine.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // N'annonce pas la techno du serveur (`x-powered-by: Next.js`).
  poweredByHeader: false,
  // Requis par `src/app/global-not-found.tsx` : la racine des routes est le segment
  // dynamique `[lang]`, donc aucun layout unique ne peut composer le 404 global.
  experimental: { globalNotFound: true },
  // Images optimisées : AVIF d'abord (≈ 30 % plus léger que WebP), WebP en repli ;
  // les originaux de public/ ne changent pas → cache des variantes 31 jours.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    // Fichiers statiques de public/ (carte en points, décors SVG, photos) : non
    // « hashés » par Next, donc pas `immutable` — un jour de cache CDN/navigateur,
    // puis revalidation en arrière-plan (stale-while-revalidate) pendant une semaine.
    const staticCache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [staticCache] },
      { source: "/:file*.svg", headers: [staticCache] },
      { source: "/:file*.png", headers: [staticCache] },
    ];
  },
};

export default nextConfig;
