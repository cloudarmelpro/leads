import type { NextConfig } from "next";

/**
 * CSP en `Report-Only` (n'impose rien, remonte seulement les violations).
 * Choix STATIQUE volontaire (pas de nonce) : une CSP à nonce forcerait le rendu
 * dynamique et ferait perdre le SSG de tout le site. `'unsafe-inline'` couvre donc
 * les scripts/styles inline (thème, JSON-LD, next/font) ; l'anti-clickjacking réel
 * est déjà assuré par `X-Frame-Options`. Autorise l'embed Cal.com et, pour
 * l'instant, les images externes d'aperçu (picsum/pravatar via `https:`) — à
 * resserrer sur `'self'` une fois les vraies photos posées, puis passer la CSP en
 * `Content-Security-Policy` (enforce) après observation des rapports.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://app.cal.com https://cal.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://app.cal.com https://*.cal.com",
  "frame-src https://app.cal.com https://cal.com",
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
