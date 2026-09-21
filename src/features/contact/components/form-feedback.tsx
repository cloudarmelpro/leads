import { XCircle } from "lucide-react";

export type FormStatus = "idle" | "success" | "error";

/**
 * Bandeau d'erreur globale du formulaire (échec de la Server Action). Le succès
 * remplace la carte entière (voir `ContactForm`) : ce bandeau ne rend rien alors.
 */
export function FormStatusBanner({
  status,
  errorTitle,
  errorDesc,
}: {
  status: FormStatus;
  errorTitle: string;
  errorDesc: string;
}) {
  if (status !== "error") return null;
  return (
    <p
      role="alert"
      className="flex items-start gap-[10px] rounded-[12px] bg-erreur/10 px-[14px] py-[12px] text-[13px] leading-[18px] text-erreur"
    >
      <XCircle size={16} strokeWidth={2.2} className="mt-px shrink-0" aria-hidden />
      <span>
        <strong className="font-normal">{errorTitle}.</strong> {errorDesc}
      </span>
    </p>
  );
}
