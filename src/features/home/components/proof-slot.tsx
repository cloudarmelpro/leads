import { MessageCircle } from "lucide-react";

import { CONTENEUR } from "@/components/shared/container";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Emplacement réservé à la preuve sociale, ÉTEINT par défaut.
 * Il ne s'allume que le jour où de vrais témoignages existent (autorisation écrite).
 * La page doit tenir debout sans lui — jamais de fausse preuve pour meubler.
 */
export function ProofSlot({ dict }: Props) {
  const t = dict.proof;

  return (
    <section className="py-[clamp(40px,6vw,80px)]">
      <div className={CONTENEUR}>
      <div
        className="mx-auto grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-center gap-6 rounded-[22px] border border-dashed border-ligne bg-surface p-[clamp(24px,4vw,40px)]"
      >
        <div>
          <span className="mb-4 inline-flex h-11 w-11 -rotate-[5deg] items-center justify-center rounded-xl bg-sapin text-white">
            <MessageCircle size={18} aria-hidden />
          </span>
          <h2 className="mb-2.5 font-display text-[clamp(19px,2.6vw,24px)]">{t.title}</h2>
          <p className="font-mono text-[13px] leading-[1.6] text-texte2">{t.note}</p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-ink">
          <span className="rounded-md bg-white/90 px-2.5 py-[5px] font-mono text-xs text-ink">
            {t.img}
          </span>
        </div>
      </div>
      </div>
    </section>
  );
}
