import type { NextConfig } from "next";

// En-têtes de sécurité appliqués à toutes les routes. Note : PAS de CSP ici —
// une CSP stricte casserait les scripts inline (thème/pré-peinture, JSON-LD) et
// l'embed Cal.com ; elle demande des nonces + une allowlist `*.cal.com` et doit
// être introduite en `Report-Only` d'abord. À faire séparément.
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
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
