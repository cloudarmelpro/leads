"use client";

import { Mail } from "lucide-react";

import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";

type Props = { user: string; domain: string; label: string; className: string; plateClassName: string; overClassName: string };

/**
 * Carte « Courriel » de la colonne de coordonnées. Composant client : la fonction de
 * rendu passée à `ObfuscatedEmail` ne peut pas traverser la frontière serveur → client.
 */
export function EmailCard({ user, domain, label, className, plateClassName, overClassName }: Props) {
  return (
    <ObfuscatedEmail user={user} domain={domain} className={className}>
      {(address) => (
        <>
          <span className={plateClassName}>
            <Mail size={19} strokeWidth={1.8} aria-hidden />
          </span>
          <span className="flex min-w-[0px] flex-col gap-[2px]">
            <span className={overClassName}>{label}</span>
            <span className="text-[16px] leading-[22px] font-normal text-encre [overflow-wrap:anywhere]">{address}</span>
          </span>
        </>
      )}
    </ObfuscatedEmail>
  );
}
