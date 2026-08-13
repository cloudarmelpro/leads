import type { MetadataRoute } from "next";

import { site } from "@/config/site";

const BASE = `https://${site.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
