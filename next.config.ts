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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
