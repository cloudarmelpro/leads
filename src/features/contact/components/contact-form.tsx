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

// Champ de la maquette : 56px, rayon 8px, contour 1px, halo vert au focus ; le contour
// passe en rouge doux sur `aria-invalid`. `max(15px,16px)` : sous 16px, iOS zoome au focus.
const INPUT =
  "h-[56px] w-full rounded-[8px] border border-contour bg-fond/85 px-[18px] text-[max(15px,16px)] leading-[24px] font-normal text-encre outline-none transition-[border-color,box-shadow] duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] placeholder:text-texte2/70 focus:border-vert focus:shadow-[0_0_0_4px_rgba(48,217,140,0.14)] aria-invalid:border-erreur focus:aria-invalid:border-erreur";
const ERROR = "text-[13px] leading-[18px] font-normal text-erreur";

/**
 * Formulaire de contact (maquette Contact) : champs sans libellé visible (le texte
 * d'invite fait office, le libellé reste pour les lecteurs d'écran), consentement à case
 * dessinée, bouton plein avec un reflet qui passe. La validation (zod), la Server Action,
 * le honeypot et les clés d'erreur traduites sont inchangés. Le succès remplace le
 * formulaire par une confirmation au prénom, avec « Envoyer un autre message ».
 */
export function ContactForm({ lang, dict }: Props) {
  const t = dict.contactPage.form;
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [sentName, setSentName] = useState("");
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
        setSentName(values.name.trim().split(/\s+/)[0] ?? "");
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
      <div role="status" className="flex min-h-[420px] flex-col items-center justify-center gap-[18px] text-center">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-vert text-sur-vert shadow-[0_0_0_10px_rgba(48,217,140,0.12),0_0_40px_rgba(48,217,140,0.5)]">
          <Check size={32} strokeWidth={2.6} aria-hidden />
        </span>
        <h3 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre">{t.successTitle}</h3>
        <p className="m-[0px] max-w-[360px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.successBody.replace("{name}", sentName)}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="tap-44 mt-[6px] cursor-pointer text-[15px] leading-[26px] font-medium text-vert transition-colors hover:text-vert-clair"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col gap-[10px]">
      {/* Honeypot anti-bot : hors flux, masqué aux humains et aux lecteurs d'écran,
          hors tabulation. Un envoi où il est rempli est ignoré côté serveur. */}
      <div aria-hidden className="pointer-events-none absolute left-[-9999px] h-[0px] w-[0px] overflow-hidden">
        <label htmlFor="contact-website">{t.honeypot}</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label htmlFor="contact-name" className="sr-only">
          {t.name}
        </label>
        <input id="contact-name" type="text" autoComplete="name" placeholder={t.name} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={INPUT} {...register("name")} />
        {errors.name && (
          <span id="contact-name-error" className={ERROR}>
            {err(errors.name.message)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-[10px] min-[620px]:grid-cols-[repeat(2,minmax(0,1fr))]">
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="contact-email" className="sr-only">
            {t.email}
          </label>
          <input id="contact-email" type="email" autoComplete="email" placeholder={t.email} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={INPUT} {...register("email")} />
          {errors.email && (
            <span id="contact-email-error" className={ERROR}>
              {err(errors.email.message)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[6px]">
          <label htmlFor="contact-phone" className="sr-only">
            {t.phone}
          </label>
          <input id="contact-phone" type="tel" autoComplete="tel" placeholder={t.phone} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={INPUT} {...register("phone")} />
          {errors.phone && (
            <span id="contact-phone-error" className={ERROR}>
              {err(errors.phone.message)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[6px]">
        <label htmlFor="contact-message" className="sr-only">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          rows={7}
          placeholder={t.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={`${INPUT} h-auto min-h-[200px] flex-1 resize-y px-[18px] py-[16px] leading-[1.55]`}
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
          <div className="flex flex-col gap-[6px] px-[4px] py-[6px]">
            <label htmlFor="contact-consent" className="flex min-h-[44px] cursor-pointer items-start gap-[12px] py-[6px]">
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
                className={`mt-[2px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] border text-sur-vert transition-[background-color,border-color] duration-200 peer-focus-visible:shadow-[0_0_0_4px_rgba(48,217,140,0.14)] ${
                  field.value ? "border-vert bg-vert" : errors.consent ? "border-erreur bg-fond/85" : "border-contour bg-fond/85"
                }`}
              >
                {field.value && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="text-[15px] leading-[26px] font-normal text-texte2">
                {t.consent}{" "}
                <Link href={`/${lang}/confidentialite`} className="font-normal text-vert underline underline-offset-[3px] hover:text-vert-clair">
                  {t.consentLink}
                </Link>
              </span>
            </label>
            {errors.consent && (
              <span id="contact-consent-error" className={`${ERROR} pl-[34px]`}>
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
        className="relative flex min-h-[48px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[8px] bg-vert text-[15px] leading-[20px] font-medium text-sur-vert shadow-[0_14px_40px_-14px_rgba(48,217,140,0.8)] transition-[background-color,transform] duration-[250ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair active:scale-[0.98] disabled:cursor-progress disabled:opacity-80"
      >
        <span aria-hidden className="absolute inset-y-[0px] left-[0px] w-[40%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] [animation:tw-sheen_3.6s_cubic-bezier(0.22,1,0.36,1)_1s_infinite] motion-reduce:[animation:none]" />
        <span className="relative">{isPending ? t.sending : t.send}</span>
      </button>
      <p className="m-[0px] px-[6px] pt-[2px] pb-[4px] text-[13px] leading-[20px] font-normal text-texte-note">{t.note}</p>
    </form>
  );
}
