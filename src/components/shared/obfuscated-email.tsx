"use client";

import { useEffect, useState } from "react";

type Props = { user: string; domain: string; className?: string };

/**
 * Email anti-scraping : l'adresse complète (avec `@`) n'apparaît JAMAIS telle
 * quelle dans le HTML servi — on ne reçoit que `user` et `domain` séparés. Le
 * navigateur reconstruit le lien `mailto:` au montage → cliquable pour un humain,
 * invisible pour les robots de collecte (qui n'exécutent pas le JS et cherchent
 * `x@y.z`). Repli lisible « user (at) domain » avant hydratation / sans JS.
 */
export function ObfuscatedEmail({ user, domain, className }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Révélation au montage uniquement (pas de mismatch d'hydratation : le premier
    // rendu client, comme le SSR, affiche le repli).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) {
    return <span className={className}>{`${user} (at) ${domain}`}</span>;
  }

  const addr = `${user}@${domain}`;
  return (
    <a href={`mailto:${addr}`} className={className}>
      {addr}
    </a>
  );
}
