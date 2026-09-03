"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/features/contact/actions/submit-contact";
import { FloatingField, FloatingTextarea } from "@/features/contact/components/form-field";
import {
  FormStatusBanner,
  FormSubmitButton,
  type FormStatus,
} from "@/features/contact/components/form-feedback";
import { contactSchema, type ContactInput } from "@/features/contact/schemas/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function ContactForm({ lang, dict }: Props) {
  const t = dict.contactPage.form;
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", consent: false, website: "" },
  });

  // Traduit une clé d'erreur (ex. "email") en message ; repli sur la clé brute.
  const err = (key?: string) =>
    key ? (t.errors[key as keyof typeof t.errors] ?? key) : undefined;
  const describedBy = (field: keyof ContactInput) =>
    errors[field] ? `contact-${field}-error` : undefined;

  function onSubmit(values: ContactInput) {
    setStatus("idle");
    startTransition(async () => {
      const result = await submitContact(values, lang);
      if (result.status === "success") {
        setStatus("success");
        reset();
        return;
      }
      if (result.fieldErrors) {
        for (const [f, key] of Object.entries(result.fieldErrors)) {
          setError(f as keyof ContactInput, { message: key });
        }
      }
      setStatus("error");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {/* Honeypot anti-bot : hors flux, masqué aux humains et aux lecteurs d'écran,
          hors tabulation. Un envoi où il est rempli est ignoré côté serveur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">{t.honeypot}</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <FloatingField
        id="contact-name"
        label={t.name}
        error={err(errors.name?.message)}
        autoComplete="name"
        aria-invalid={!!errors.name}
        aria-describedby={describedBy("name")}
        {...register("name")}
      />

      <div className="flex flex-col gap-1.5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingField
            id="contact-email"
            label={t.email}
            error={err(errors.email?.message)}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            {...register("email")}
          />
          <FloatingField
            id="contact-phone"
            label={t.phone}
            error={err(errors.phone?.message)}
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            {...register("phone")}
          />
        </div>
      </div>

      <FloatingTextarea
        id="contact-message"
        label={t.message}
        hint={t.messageHint}
        error={err(errors.message?.message)}
        rows={5}
        aria-invalid={!!errors.message}
        aria-describedby={describedBy("message")}
        {...register("message")}
      />

      {/* Consentement — Loi 25 (Québec). */}
      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end gap-2.5">
              <Checkbox
                id="contact-consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.consent}
                aria-describedby={describedBy("consent")}
                className="mt-0.5"
              />
              <Label htmlFor="contact-consent" className="font-normal text-texte2">
                {t.consent}{" "}
                <Link
                  href={`/${lang}/confidentialite`}
                  className="font-medium text-sapin dark:text-accent-strong underline underline-offset-2"
                >
                  {t.consentLink}
                </Link>
              </Label>
            </div>
            {errors.consent && (
              <p id="contact-consent-error" className="text-sm text-destructive">
                {err(errors.consent.message)}
              </p>
            )}
          </div>
        )}
      />

      <FormStatusBanner
        status={status}
        successTitle={t.successTitle}
        successDesc={t.successBody}
        errorTitle={t.errorTitle}
        errorDesc={t.errorBody}
      />

      <FormSubmitButton isPending={isPending} label={t.send} pendingLabel={t.sending} />
    </form>
  );
}
