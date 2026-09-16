"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { submitContact } from "@/features/contact/actions/submit-contact";
import { FormStatusBanner, type FormStatus } from "@/features/contact/components/form-feedback";
import { contactSchema, type ContactInput } from "@/features/contact/schemas/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: { contactPage: Pick<Dictionary["contactPage"], "form"> } };

const LABEL = "text-[13px] leading-[18px] font-normal tracking-[0.02em] text-texte2";
// Champ de la maquette : 48px, rayon 12px, contour 1px, texte 15/24 ; le contour passe
// en rouge doux sur `aria-invalid`. `max(15px,16px)` : sous 16px, iOS zoome au focus.
const INPUT =
  "h-[48px] w-full rounded-[12px] border border-contour bg-surface px-[16px] text-[max(15px,16px)] leading-[24px] font-normal text-encre outline-none transition-[border-color] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] placeholder:text-texte2/60 focus:border-vert aria-invalid:border-erreur focus:aria-invalid:border-erreur";
const ERROR = "text-[13px] leading-[18px] font-normal text-erreur";

/**
 * Formulaire de contact (maquette Contact) : libellés au-dessus, champs à contour,
 * consentement à case personnalisée, bouton plein. La validation (zod), la Server
 * Action, le honeypot et les clés d'erreur traduites sont inchangés. Le succès remplace
 * la carte par un bloc de confirmation avec « Écrire un autre message ».
 */
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
  const err = (key?: string) => (key ? (t.errors[key as keyof typeof t.errors] ?? key) : undefined);
  const describedBy = (field: keyof ContactInput) => (errors[field] ? `contact-${field}-error` : undefined);

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

  if (status === "success") {
    return (
      <div role="status" className="flex min-h-[320px] flex-col items-start justify-center gap-[14px]">
        <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-vert/14 text-vert">
          <Check size={22} strokeWidth={2.2} aria-hidden />
        </span>
        <span className="text-[20px] leading-[28px] font-medium tracking-[-0.3px] text-encre">{t.successTitle}</span>
        <p className="m-[0px] max-w-[400px] text-[15px] leading-[26px] font-normal text-texte2">{t.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-[6px] flex min-h-[40px] cursor-pointer items-center rounded-[9px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre transition-colors duration-200 hover:bg-surface-3"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-[16px]">
      {/* Honeypot anti-bot : hors flux, masqué aux humains et aux lecteurs d'écran,
          hors tabulation. Un envoi où il est rempli est ignoré côté serveur. */}
      <div aria-hidden className="pointer-events-none absolute left-[-9999px] h-[0px] w-[0px] overflow-hidden">
        <label htmlFor="contact-website">{t.honeypot}</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="contact-name" className={LABEL}>
          {t.name}
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder={t.namePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
          className={INPUT}
          {...register("name")}
        />
        {errors.name && (
          <span id="contact-name-error" className={ERROR}>
            {err(errors.name.message)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-[16px] min-[560px]:grid-cols-[repeat(2,minmax(0,1fr))]">
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="contact-email" className={LABEL}>
            {t.email}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder={t.emailPlaceholder}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={INPUT}
            {...register("email")}
          />
          {errors.email && (
            <span id="contact-email-error" className={ERROR}>
              {err(errors.email.message)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="contact-phone" className={LABEL}>
            {t.phone}
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t.phonePlaceholder}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={INPUT}
            {...register("phone")}
          />
          {errors.phone && (
            <span id="contact-phone-error" className={ERROR}>
              {err(errors.phone.message)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="contact-message" className={LABEL}>
          {t.message}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={`${INPUT} h-auto min-h-[132px] resize-y bg-fond px-[16px] py-[14px]`}
          {...register("message")}
        />
        {errors.message && (
          <span id="contact-message-error" className={ERROR}>
            {err(errors.message.message)}
          </span>
        )}
      </div>

      {/* Consentement — Loi 25 (Québec). Case native masquée, boîte dessinée à côté. */}
      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="contact-consent" className="flex min-h-[44px] cursor-pointer items-start gap-[11px] py-[8px]">
              <input
                id="contact-consent"
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                aria-invalid={!!errors.consent}
                aria-describedby={describedBy("consent")}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border bg-fond text-sur-vert transition-[background-color,border-color] duration-200 peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring ${
                  field.value ? "border-vert bg-vert" : errors.consent ? "border-erreur" : "border-contour"
                }`}
              >
                {field.value && <Check size={13} strokeWidth={3} />}
              </span>
              <span className="text-[14px] leading-[23px] font-normal text-texte2">
                {t.consent}{" "}
                <Link
                  href={`/${lang}/confidentialite`}
                  className="font-medium text-vert underline underline-offset-2 hover:text-vert-clair"
                >
                  {t.consentLink}
                </Link>
              </span>
            </label>
            {errors.consent && (
              <span id="contact-consent-error" className={ERROR}>
                {err(errors.consent.message)}
              </span>
            )}
          </div>
        )}
      />

      <FormStatusBanner status={status} errorTitle={t.errorTitle} errorDesc={t.errorBody} />

      <button
        type="submit"
        disabled={isPending}
        className="mt-[4px] flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[12px] bg-vert text-[15px] leading-[20px] font-medium text-sur-vert transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-px hover:bg-vert-clair active:scale-[0.99] disabled:cursor-progress disabled:opacity-80"
      >
        {isPending ? t.sending : t.send}
      </button>
    </form>
  );
}
