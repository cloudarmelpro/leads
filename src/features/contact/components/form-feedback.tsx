import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { ArrowRight } from "@/components/ui/arrows";
import { Button } from "@/components/ui/button";

export type FormStatus = "idle" | "success" | "error";

export function FormStatusBanner({
  status,
  successTitle,
  successDesc,
  errorTitle,
  errorDesc,
}: {
  status: FormStatus;
  successTitle: string;
  successDesc: string;
  errorTitle: string;
  errorDesc: string;
}) {
  if (status === "success") {
    return (
      <p
        role="status"
        className="flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-medium">{successTitle}.</strong> {successDesc}
        </span>
      </p>
    );
  }
  if (status === "error") {
    return (
      <p
        role="alert"
        className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
      >
        <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-medium">{errorTitle}.</strong> {errorDesc}
        </span>
      </p>
    );
  }
  return null;
}

export function FormSubmitButton({
  isPending,
  label,
  pendingLabel,
}: {
  isPending: boolean;
  label: string;
  pendingLabel: string;
}) {
  return (
    <Button type="submit" disabled={isPending} className="mt-2 h-11 self-start rounded-xl px-6 text-[15px]">
      {isPending ? (
        <>
          {pendingLabel}
          <Loader2 className="size-4 animate-spin" aria-hidden />
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4" />
        </>
      )}
    </Button>
  );
}
