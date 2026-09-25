type Props = { label: string; aria: string };

/**
 * Invitation à défiler sous le hero À propos : une molette lumineuse dont le point
 * descend en boucle, « Défiler » et un chevron qui bat. Lien vers Notre histoire.
 */
export function ScrollCue({ label, aria }: Props) {
  return (
    <div className="flex justify-center pt-[clamp(128px,14vw,200px)] pb-[clamp(24px,3vw,40px)]">
      <a
        href="#histoire"
        aria-label={aria}
        className="flex flex-col items-center gap-[10px] text-[12px] font-medium tracking-[0.16em] text-texte2 no-underline uppercase transition-colors duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-vert"
      >
        <span className="relative flex h-[48px] w-[30px] justify-center rounded-full border-[1.5px] border-[rgba(48,217,140,0.55)] shadow-[0_0_22px_-4px_rgba(48,217,140,0.55),inset_0_0_12px_rgba(48,217,140,0.12)]">
          <span className="absolute top-[9px] h-[9px] w-[4px] rounded-full bg-[#30D98C] shadow-[0_0_10px_rgba(48,217,140,0.9)] [animation:tw-wheel_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] motion-reduce:[animation:none]" />
        </span>
        <span className="flex items-center gap-[6px]">
          {label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="[animation:tw-bob_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] motion-reduce:[animation:none]">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </a>
    </div>
  );
}
