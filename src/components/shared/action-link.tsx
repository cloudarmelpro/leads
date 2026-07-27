import type { ReactNode } from "react";

type Props = {
  href: string | null;
  className?: string;
  children: ReactNode;
  /** Décrit pourquoi l'action est indisponible — lu par les lecteurs d'écran. */
  unavailableLabel: string;
};

/**
 * Rend un vrai lien quand la donnée existe, un bouton inerte sinon.
 * Tant que le téléphone / WhatsApp / Calendly ne sont pas confirmés, un
 * `href="#"` ferait croire à une action possible : on refuse ce mensonge.
 */
export function ActionLink({ href, className, children, unavailableLabel }: Props) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" disabled aria-label={unavailableLabel} className={className}>
      {children}
    </button>
  );
}
