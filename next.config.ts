import type { NextConfig } from "next";

/**
 * CSP APPLIQUÉE (enforce). Choix STATIQUE volontaire (pas de nonce) : une CSP à
 * nonce forcerait le rendu dynamique et ferait perdre le SSG de tout le site.
 * `'unsafe-inline'` couvre donc les scripts/styles inline (thème, JSON-LD,
 * next/font) — protection XSS partielle assumée, mais on gagne le verrouillage des
 * sources (frame-ancestors, object-src none, base-uri, form-action) et la liste
 * blanche des ressources. L'embed Cal.com est autorisé sur tous ses sous-domaines
 * (`*.cal.com`). Les images externes d'aperçu passent via `https:` — à resserrer
 * sur `'self'` une fois les vraies photos client posées.
 * NB : Hostinger (hcdn) ajoute son propre `Content-Security-Policy:
 * upgrade-insecure-requests` — inoffensif et additif (le navigateur applique les
 * deux politiques ; celle de Hostinger ne restreint aucune ressource).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://cal.com https://*.cal.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
