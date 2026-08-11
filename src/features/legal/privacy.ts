import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * Contenu de la Politique de confidentialité (Loi 25), bilingue. Adapté du modèle
 * de paysagisteacadien.com aux flux RÉELS de Talgasy Web : formulaires (contact +
 * réservation) → base Neon (É.-U.), notifications par Resend, prise de rendez-vous
 * par Cal.com, hébergement Hostinger. Le nom de l'entreprise et les coordonnées
 * viennent de `config/site` pour rester synchronisés. Aucun fait inventé : seul le
 * NOM du responsable désigné reste à confirmer (voir `RESPONSIBLE_NAME`).
 */

export type PrivacySection = { h: string; p: string[] };
export type PrivacyDoc = {
  title: string;
  updatedLabel: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
};

// Date de dernière mise à jour (à réviser à chaque changement de pratiques).
const UPDATED = "2026-08-11";

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
    updatedLabel: "Dernière mise à jour",
    updated: UPDATED,
    intro:
      "Chez Talgasy Web, nous prenons la protection de vos renseignements personnels au sérieux. Cette politique explique ce que nous recueillons, pourquoi, et les droits dont vous disposez, conformément à la Loi 25 (Québec).",
    sections: [
      {
        h: "Renseignements que nous recueillons",
        p: [
          "Nous recueillons uniquement ce que vous nous transmettez volontairement par nos formulaires (contact et réservation d'appel) : votre nom, votre courriel et/ou votre téléphone.",
          "Selon le formulaire, nous pouvons aussi recueillir : le nom de votre entreprise, le service recherché, un budget approximatif, une description de votre besoin et votre message. La langue du site et la date d'envoi sont également enregistrées.",
        ],
      },
      {
        h: "Pourquoi nous les recueillons",
        p: [
          "Vos renseignements servent uniquement à répondre à votre demande : préparer une soumission, planifier un appel, répondre à vos questions.",
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
          "Les notifications par courriel transitent par Resend, et la prise de rendez-vous par Cal.com. Vos renseignements peuvent donc être traités à l'extérieur du Québec et être soumis aux lois applicables ailleurs. Aucun tiers n'y a accès à d'autres fins que celles décrites ici.",
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
          "Si vous estimez que vos droits n'ont pas été respectés, vous pouvez porter plainte auprès de la Commission d'accès à l'information du Québec.",
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
    updatedLabel: "Last updated",
    updated: UPDATED,
    intro:
      "At Talgasy Web, we take the protection of your personal information seriously. This policy explains what we collect, why, and the rights you have, in line with Quebec's Law 25.",
    sections: [
      {
        h: "Information we collect",
        p: [
          "We only collect what you voluntarily provide through our forms (contact and call booking): your name, your email and/or your phone number.",
          "Depending on the form, we may also collect: your company name, the service you need, an approximate budget, a description of your need, and your message. The site language and the submission date are also recorded.",
        ],
      },
      {
        h: "Why we collect it",
        p: [
          "Your information is used solely to respond to your request: preparing a quote, scheduling a call, answering your questions.",
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
          "Email notifications go through Resend, and call booking through Cal.com. Your information may therefore be processed outside Quebec and be subject to the laws applicable elsewhere. No third party accesses it for purposes other than those described here.",
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
          "If you believe your rights have not been respected, you may file a complaint with Quebec's Commission d'accès à l'information.",
        ],
      },
    ],
  };
}

export function getPrivacy(lang: Locale): PrivacyDoc {
  return lang === "en" ? en() : fr();
}
