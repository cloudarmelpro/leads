import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Champ « outlined » à label flottant. Une seule bordure 1px, nette :
   gris (repos) → encre (focus) → rouge (erreur). Le compound focus:aria-invalid
   garantit que l'erreur l'emporte sur le focus (spécificité supérieure). Pas
   d'ombre interne ni de hover séparé : ça évitait un double trait clair/foncé. */
// `max(1rem,16px)` : la racine fluide descend à 14px sur mobile, mais un champ sous
// 16px déclenche le zoom automatique d'iOS au focus — on garde le plancher.
const fieldText = "text-[max(1rem,16px)]";
const controlBase =
  `peer w-full rounded-lg border border-input bg-transparent ${fieldText} text-encre outline-none ` +
  "transition-colors duration-200 motion-reduce:transition-none " +
  "focus:border-encre " +
  "aria-invalid:border-destructive aria-invalid:text-destructive " +
  "focus:aria-invalid:border-destructive " +
  "disabled:cursor-not-allowed disabled:border-input/50 disabled:bg-encre/4 disabled:text-texte2/60";

/* Fond du label une fois flotté = `fond` (le fond de page), pas blanc : le label
   déborde au-dessus du champ sur la page, un fond blanc y ferait un rectangle
   visible. Ce fond n'est posé qu'une fois flotté (au repos il est dans le champ).
   « focus » et « rempli » posent les mêmes valeurs — l'ordre CSS n'importe pas. */
const labelBase =
  "pointer-events-none absolute left-3 px-1 text-texte2 transition-all duration-200 motion-reduce:transition-none " +
  "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-fond peer-focus:text-xs peer-focus:font-medium peer-focus:text-encre " +
  "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-fond " +
  "peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-encre " +
  "peer-aria-invalid:text-destructive peer-focus:peer-aria-invalid:text-destructive " +
  "peer-[:not(:placeholder-shown)]:peer-aria-invalid:text-destructive " +
  "peer-disabled:text-texte2/50";

type FieldOwnProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

function FieldShell({
  id,
  hint,
  error,
  children,
}: Pick<FieldOwnProps, "id" | "hint" | "error"> & { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">{children}</div>
      {hint && !error && <p className="text-[0.8125rem] text-texte2">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-[0.8125rem] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/* `placeholder=" "` (une espace) rend :placeholder-shown exploitable : le label
   flotte dès que le champ est focus OU non vide. Le label EST le placeholder. */
export function FloatingField({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: FieldOwnProps & Omit<ComponentProps<"input">, "id" | "placeholder">) {
  return (
    <FieldShell id={id} hint={hint} error={error}>
      <input
        id={id}
        placeholder=" "
        className={cn(controlBase, "h-12 px-4", className)}
        {...props}
      />
      <label htmlFor={id} className={cn(labelBase, "top-1/2 -translate-y-1/2 text-base")}>
        {label}
      </label>
    </FieldShell>
  );
}

export function FloatingTextarea({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: FieldOwnProps & Omit<ComponentProps<"textarea">, "id" | "placeholder">) {
  return (
    <FieldShell id={id} hint={hint} error={error}>
      <textarea
        id={id}
        placeholder=" "
        className={cn(controlBase, "min-h-40 px-4 py-3.5", className)}
        {...props}
      />
      {/* Un textarea est haut : le label reste ancré en haut à gauche au repos,
          aligné sur la première ligne de texte, puis remonte sur la bordure. */}
      <label htmlFor={id} className={cn(labelBase, "top-3.5 text-base")}>
        {label}
      </label>
    </FieldShell>
  );
}
