"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { submitBooking } from "@/features/contact/actions/submit-booking";
import { CalcomEmbed } from "@/features/contact/components/calcom-embed";
import {
  FloatingField,
  FloatingTextarea,
  LabeledSelect,
} from "@/features/contact/components/form-field";
import {
  FormStatusBanner,
  FormSubmitButton,
  type FormStatus,
} from "@/features/contact/components/form-feedback";
import { bookingSchema, type BookingInput } from "@/features/contact/schemas/booking";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { calLink: string; lang: Locale; dict: Dictionary };

/**
 * Préqualification avant le calendrier : le visiteur remplit un court formulaire
 * (capté comme un lead) AVANT de voir le calendrier Cal.com. Une fois la demande
 * enregistrée avec succès, le calendrier s'affiche à la place du formulaire.
 */
export function BookingGate({ calLink, lang, dict }: Props) {
  const t = dict.contactPage.booking.prequalify;
  const [unlocked, setUnlocked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      company: "",
      service: "",
      budget: "",
      description: "",
      email: "",
      phone: "",
      consent: false,
      website: "",
    },
  });

  const err = (key?: string) =>
    key ? (t.errors[key as keyof typeof t.errors] ?? key) : undefined;

  function onSubmit(values: BookingInput) {
    setStatus("idle");
    startTransition(async () => {
      const result = await submitBooking(values, lang);
      if (result.status === "success") {
        setUnlocked(true);
        return;
      }
      if (result.fieldErrors) {
        for (const [field, key] of Object.entries(result.fieldErrors)) {
          setError(field as keyof BookingInput, { message: key });
        }
      }
      setStatus("error");
    });
  }

  if (unlocked) {
    return (
      <div>
        <p className="mb-5 text-sm font-medium text-encre">{t.unlockedTitle}</p>
        {/* Carte Cal.com à largeur fixe, alignée à gauche (comme la page). */}
        <div className="max-w-260">
          <CalcomEmbed calLink={calLink} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-160 rounded-2xl bg-surface p-6 shadow-soft sm:p-8">
      <p className="text-sm leading-[1.6] text-texte2 text-pretty">{t.intro}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        {/* Honeypot anti-bot : hors flux, masqué, hors tabulation. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="bk-website">Laissez ce champ vide</label>
          <input id="bk-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <FloatingField
          id="bk-name"
          label={t.name}
          error={err(errors.name?.message)}
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />

        <FloatingField
          id="bk-company"
          label={t.company}
          error={err(errors.company?.message)}
          autoComplete="organization"
          aria-invalid={!!errors.company}
          {...register("company")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledSelect
            id="bk-service"
            label={t.service}
            placeholder={t.choose}
            options={t.serviceOptions}
            error={err(errors.service?.message)}
            {...register("service")}
          />
          <LabeledSelect
            id="bk-budget"
            label={t.budget}
            placeholder={t.choose}
            options={t.budgetOptions}
            error={err(errors.budget?.message)}
            {...register("budget")}
          />
        </div>

        <FloatingTextarea
          id="bk-description"
          label={t.description}
          hint={t.descriptionHint}
          error={err(errors.description?.message)}
          rows={4}
          aria-invalid={!!errors.description}
          {...register("description")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            id="bk-email"
            label={t.email}
            type="email"
            autoComplete="email"
            error={err(errors.email?.message)}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FloatingField
            id="bk-phone"
            label={t.phone}
            type="tel"
            autoComplete="tel"
            error={err(errors.phone?.message)}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </div>

        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-end gap-2.5">
                <Checkbox
                  id="bk-consent"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={!!errors.consent}
                  className="mt-0.5"
                />
                <Label htmlFor="bk-consent" className="font-normal text-texte2">
                  {t.consent}{" "}
                  <Link
                    href={`/${lang}#`}
                    className="font-medium text-sapin dark:text-accent-strong underline underline-offset-2"
                  >
                    {t.consentLink}
                  </Link>
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-destructive">{err(errors.consent.message)}</p>
              )}
            </div>
          )}
        />

        <FormStatusBanner
          status={status}
          successTitle=""
          successDesc=""
          errorTitle={t.errorTitle}
          errorDesc={t.errorBody}
        />

        <FormSubmitButton isPending={isPending} label={t.submit} pendingLabel={t.submitting} />
      </form>
    </div>
  );
}
