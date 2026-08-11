"use client";

import { OPEN_COOKIE_PREFS } from "@/components/shared/cookie-consent";

/** Lien « Gérer mes témoins » (footer) : rouvre le bandeau de consentement. */
export function ManageCookiesButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFS))}
      className={className}
    >
      {label}
    </button>
  );
}
