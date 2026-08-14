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
 * autorisé sur `*.cal.com`. Images d'aperçu externes via `https:`.
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
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
