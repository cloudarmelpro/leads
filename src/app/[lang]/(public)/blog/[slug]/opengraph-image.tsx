import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/config/site";
import { getAllSlugs, getPost } from "@/features/blog";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

// Image de partage d'un article (1200 × 630, prérendue) : la catégorie, le titre de l'article
// et la marque, sur le dégradé de l'image du site. Plus parlante en partage que la couverture
// (souvent carrée, et commune à plusieurs articles).
export function generateStaticParams() {
  return locales.flatMap((lang) => getAllSlugs().map((slug) => ({ lang, slug })));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default async function ArticleOgImage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l: Locale = isLocale(lang) ? lang : "fr";
  const post = getPost(l, slug);

  const logo = await readFile(join(process.cwd(), "public/talgasy-logo-dark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const title = post?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0c1712 0%, #10412a 58%, #177e4f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "9999px", background: "#35c489" }} />
          <span style={{ fontSize: "28px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#a7e0c0" }}>
            {post?.category ?? site.name}
          </span>
        </div>

        <span style={{ fontSize: title.length > 48 ? "64px" : "74px", lineHeight: 1.08, fontWeight: 700, maxWidth: "1000px" }}>{title}</span>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={300} height={79} alt={site.name} />
          <span style={{ fontSize: "30px", color: "#a7e0c0" }}>{site.domain}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
