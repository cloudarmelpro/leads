import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CONTENEUR } from "@/components/shared/container";
import { Globe3D } from "@/features/home/components/globe-3d";
import { isLocale } from "@/lib/i18n/config";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Aperçu du globe 3D, réservé au développement : validation du rendu à part avant
 * intégration dans le hero. Introuvable en production.
 */
export default async function GlobePreviewPage({ params }: PageProps<"/[lang]/labo/globe">) {
  const { lang } = await params;
  if (!isLocale(lang) || process.env.NODE_ENV === "production") notFound();

  return (
    <section className="py-[clamp(48px,7vw,96px)]">
      <div className={`${CONTENEUR} grid grid-cols-1 items-center gap-12 lg:grid-cols-2`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[0.8125rem] text-emeraude dark:text-accent-strong">labo / globe 3D</p>
          <p className="text-body-fluid text-texte2">Glisser pour faire tourner. Basculer le thème pour vérifier les couleurs.</p>
        </div>
        <div className="mx-auto w-full max-w-[600px]">
          <Globe3D size={600} />
        </div>
      </div>
    </section>
  );
}
