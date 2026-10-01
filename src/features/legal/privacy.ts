import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * Contenu de la Politique de confidentialité (Loi 25), bilingue. Adapté du modèle
 * de paysagisteacadien.com aux flux RÉELS du site : formulaire de soumission → base
 * Neon (É.-U.), notifications par Resend, hébergement Hostinger (Cal.com retiré le
 * 2026-10-01 avec la page Contact). Le nom de l'entreprise et les coordonnées
 * viennent de `config/site` pour rester synchronisés. Aucun fait inventé : seul le
 * NOM du responsable désigné reste à confirmer (voir `RESPONSIBLE_NAME`).
 */

/** Paragraphes d'intro, puis liste à puces facultative, puis paragraphes de suite. */
type PrivacySection = { h: string; p: string[]; list?: string[]; after?: string[] };
export type PrivacyDoc = {
  title: string;
  /** Eyebrow de la section (« Loi 25 ») et intitulé du sommaire ancré. */
  kicker: string;
  tocLabel: string;
  updatedLabel: string;
  updated: string;
  /** Description SEO (120-160 caractères) : l'intro est trop longue pour un <meta>. */
  metaDescription: string;
  intro: string;
  /** Les quatre repères du hero (maquette du 2026-09-30), résumés fidèles des articles. */
  brief: { title: string; text: string }[];
  sections: PrivacySection[];
};

// Date de dernière mise à jour (à réviser à chaque changement de pratiques).
const UPDATED = "2026-10-01";

// ⚠️ À confirmer avec le client : nom de la personne responsable désignée (Loi 25).
// Tant qu'il n'est pas fourni, on désigne l'entreprise + les coordonnées ci-dessous.
const RESPONSIBLE_NAME: string | null = null;

const email = site.email ?? "—";
const phone = site.phone ?? "—";

function fr(): PrivacyDoc {
  const responsable = RESPONSIBLE_NAME
    ? `${RESPONSIBLE_NAME}, pour ${site.name}`
    : `${site.name}`;
  return {
    title: "Politique de confidentialité",
    kicker: "Loi 25",
    tocLabel: "Sommaire",
    updatedLabel: "Dernière mise à jour",
    updated: UPDATED,
    metaDescription: `Politique de confidentialité de ${site.name} : ce que le formulaire de soumission recueille, pourquoi, où c'est conservé et vos droits sous la Loi 25 (Québec).`,
    intro: `Chez ${site.name}, nous prenons la protection de vos renseignements personnels au sérieux. Cette politique explique ce que nous recueillons, pourquoi, et les droits dont vous disposez, conformément à la Loi 25 (Québec).`,
    brief: [
      { title: "Le strict nécessaire", text: "Seulement ce que vous nous écrivez dans le formulaire." },
      { title: "Jamais revendu", text: "Aucune publicité, aucune vente, aucun échange." },
      { title: "Aucun témoin publicitaire", text: "Seuls les témoins essentiels au site sont déposés." },
      { title: "Réponse en 30 jours", text: "Accès, correction ou suppression, sur simple demande." },
    ],
    sections: [
      // ⚠️ À tenir synchronisé avec `features/soumission/schemas/soumission.ts` (demande du
      // client, 2026-10-01) : tout champ ou formulaire ajouté doit figurer ici AVANT sa mise en ligne.
      {
        h: "Renseignements que nous recueillons",
        p: [
          "Nous recueillons uniquement ce que vous nous transmettez volontairement par le formulaire de soumission du site. Au fil des étapes du formulaire, il s'agit de :",
        ],
        list: [
          "votre projet : le type de projet recherché (site web, application web, commerce en ligne, application mobile, plateforme SaaS, intégration et automatisation, logo, identité visuelle ou hébergement) et votre confirmation que le prix de départ affiché convient à votre budget ;",
          "votre organisation : le type d'organisation (PME, startup, entreprise industrielle, grande entreprise, institution, OBNL ou organisme), le nom de votre entreprise et votre ville ou région ;",
          "l'état de votre projet : son avancement (une idée, des maquettes ou un cahier des charges, un existant à reprendre), le délai souhaité et, s'il y a lieu, l'adresse de votre site web actuel ;",
          "la description libre de votre projet, si vous en fournissez une ;",
          "vos coordonnées : votre nom, votre courriel et votre numéro de téléphone (au moins l'un des deux), pour pouvoir vous répondre.",
        ],
        after: [
          "La langue du site au moment de l'envoi et la date d'envoi sont également enregistrées. Ces renseignements sont transmis à notre équipe par courriel et enregistrés dans notre base de données (voir « Où vos renseignements sont conservés »).",
          "Votre adresse IP est traitée en mémoire du serveur, le temps de la requête, uniquement pour limiter le nombre d'envois et prévenir les abus du formulaire. Elle n'est ni journalisée ni conservée.",
        ],
      },
      {
        h: "Pourquoi nous les recueillons",
        p: [
          "Vos renseignements servent uniquement à répondre à votre demande : comprendre votre projet, vérifier qu'il correspond à nos services, préparer une soumission, planifier un appel, répondre à vos questions.",
          "Nous ne les utilisons pas à des fins publicitaires, et nous ne les vendons, ne les louons ni ne les échangeons.",
        ],
      },
      {
        h: "Votre consentement",
        p: [
          "En soumettant un formulaire, vous consentez à ce que nous utilisions vos renseignements pour répondre à votre demande.",
          "Le consentement est volontaire : les champs facultatifs peuvent rester vides, et vous pouvez retirer votre consentement en tout temps, sans avoir à vous justifier.",
        ],
      },
      {
        h: "Où vos renseignements sont conservés",
        p: [
          "Les demandes sont enregistrées dans une base de données hébergée par Neon, dont les serveurs sont situés aux États-Unis. Le site est hébergé par Hostinger.",
          "Les notifications par courriel transitent par Resend. Vos renseignements peuvent donc être traités à l'extérieur du Québec et être soumis aux lois applicables ailleurs. Aucun tiers n'y a accès à d'autres fins que celles décrites ici.",
        ],
      },
      {
        h: "Combien de temps nous les conservons",
        p: [
          "Nous conservons vos renseignements aussi longtemps que nécessaire pour répondre à votre demande et en assurer le suivi, puis nous les supprimons lorsqu'ils ne sont plus utiles.",
          "Vous pouvez demander leur suppression en tout temps, sauf lorsqu'une obligation légale nous impose de les conserver.",
        ],
      },
      {
        h: "Témoins (cookies) et suivi",
        p: [
          "Le site n'utilise que les témoins essentiels à son bon fonctionnement (par exemple pour mémoriser votre langue ou votre thème). Aucun témoin publicitaire n'est déposé.",
          "Si des outils de mesure d'audience étaient ajoutés, ils ne seraient activés qu'après votre consentement, via le bandeau des témoins. Vous pouvez modifier ou révoquer ce choix à tout moment avec l'option « Gérer mes témoins ».",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Vous avez le droit d'accéder à vos renseignements, de les faire corriger, de les faire supprimer, et d'en obtenir une copie dans un format structuré et couramment utilisé.",
          "Nous répondons à toute demande dans un délai de 30 jours.",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Les communications avec le site sont chiffrées (HTTPS) et l'accès à la base de données est restreint.",
          "En cas d'incident de confidentialité présentant un risque de préjudice sérieux, nous nous engageons à aviser les personnes concernées ainsi que les autorités compétentes.",
        ],
      },
      {
        h: "Modifications de cette politique",
        p: [
          "Cette politique peut être mise à jour si nos pratiques changent. La date de dernière mise à jour affichée en tête de page fait foi.",
        ],
      },
      {
        h: "Responsable de la protection des renseignements personnels",
        p: [
          `Pour exercer vos droits ou pour toute question sur cette politique, contactez le responsable de la protection des renseignements personnels (${responsable}) : ${email}, ${phone}.`,
          "Vous pouvez également adresser au responsable toute plainte relative à la protection de vos renseignements personnels. Nous en accusons réception, l'examinons et vous communiquons notre réponse dans un délai raisonnable.",
          "Si vous estimez que vos droits n'ont pas été respectés, vous pouvez aussi porter plainte auprès de la Commission d'accès à l'information du Québec.",
        ],
      },
    ],
  };
}

function en(): PrivacyDoc {
  const responsible = RESPONSIBLE_NAME
    ? `${RESPONSIBLE_NAME}, for ${site.name}`
    : `${site.name}`;
  return {
    title: "Privacy Policy",
    kicker: "Law 25",
    tocLabel: "Contents",
    updatedLabel: "Last updated",
    updated: UPDATED,
    metaDescription: `${site.name} privacy policy: what the quote form collects, why, where it is stored, and the rights you have under Quebec's Law 25.`,
    intro: `At ${site.name}, we take the protection of your personal information seriously. This policy explains what we collect, why, and the rights you have, in line with Quebec's Law 25.`,
    brief: [
      { title: "Only what is necessary", text: "Only what you write to us in the form." },
      { title: "Never sold", text: "No advertising, no sale, no exchange." },
      { title: "No advertising cookies", text: "Only the cookies essential to the site are set." },
      { title: "Answer within 30 days", text: "Access, correction or deletion, on request." },
    ],
    sections: [
      // ⚠️ Keep in sync with `features/soumission/schemas/soumission.ts` (see the French version).
      {
        h: "Information we collect",
        p: [
          "We only collect what you voluntarily provide through the site's quote form. Across the steps of the form, this includes:",
        ],
        list: [
          "your project: the type of project you are looking for (website, web application, online store, mobile application, SaaS platform, integration and automation, logo, visual identity or hosting) and your confirmation that the displayed starting price fits your budget;",
          "your organization: the type of organization (SMB, startup, industrial company, large company, institution, non-profit or organization), your company name and your city or region;",
          "the state of your project: its progress (an idea, mockups or a specification, an existing product to take over), the desired timeline and, where applicable, the address of your current website;",
          "a free-form description of your project, if you provide one;",
          "your contact details: your name, your email and your phone number (at least one of the two), so that we can respond.",
        ],
        after: [
          "The site language at the time of submission and the submission date are also recorded. This information is sent to our team by email and stored in our database (see “Where your information is stored”).",
          "Your IP address is processed in server memory, for the duration of the request only, solely to limit the number of submissions and prevent abuse of the form. It is neither logged nor retained.",
        ],
      },
      {
        h: "Why we collect it",
        p: [
          "Your information is used solely to respond to your request: understanding your project, checking that it matches our services, preparing a quote, scheduling a call, answering your questions.",
          "We do not use it for advertising, and we do not sell, rent, or trade it.",
        ],
      },
      {
        h: "Your consent",
        p: [
          "By submitting a form, you consent to us using your information to respond to your request.",
          "Consent is voluntary: optional fields may be left blank, and you may withdraw your consent at any time, without having to justify it.",
        ],
      },
      {
        h: "Where your information is stored",
        p: [
          "Requests are stored in a database hosted by Neon, whose servers are located in the United States. The website is hosted by Hostinger.",
          "Email notifications go through Resend. Your information may therefore be processed outside Quebec and be subject to the laws applicable elsewhere. No third party accesses it for purposes other than those described here.",
        ],
      },
      {
        h: "How long we keep it",
        p: [
          "We keep your information for as long as needed to respond to your request and follow up, then delete it once it is no longer useful.",
          "You may request its deletion at any time, except where a legal obligation requires us to retain it.",
        ],
      },
      {
        h: "Cookies and tracking",
        p: [
          "The site only uses cookies essential to its proper functioning (for example, to remember your language or theme). No advertising cookies are placed.",
          "If audience-measurement tools were added, they would only be activated after your consent, through the cookie banner. You can change or revoke this choice at any time via “Manage my cookies”.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You have the right to access your information, to have it corrected, to have it deleted, and to obtain a copy in a structured, commonly used format.",
          "We respond to any request within 30 days.",
        ],
      },
      {
        h: "Security",
        p: [
          "Communications with the site are encrypted (HTTPS) and database access is restricted.",
          "In the event of a privacy incident that poses a risk of serious harm, we commit to notifying the affected individuals and the competent authorities.",
        ],
      },
      {
        h: "Changes to this policy",
        p: [
          "This policy may be updated if our practices change. The last-updated date shown at the top of the page governs.",
        ],
      },
      {
        h: "Person responsible for the protection of personal information",
        p: [
          `To exercise your rights or for any question about this policy, contact the person responsible for the protection of personal information (${responsible}): ${email}, ${phone}.`,
          "You may also send the person responsible any complaint regarding the protection of your personal information. We acknowledge receipt, review it, and provide our response within a reasonable time.",
          "If you believe your rights have not been respected, you may also file a complaint with Quebec's Commission d'accès à l'information.",
        ],
      },
    ],
  };
}

export function getPrivacy(lang: Locale): PrivacyDoc {
  return lang === "en" ? en() : fr();
}
