# Talgasy Web — site vitrine

Site vitrine bilingue (FR/EN) orienté génération de leads pour PME québécoises.
Domaine : `talgasyweb.ca` (voir `src/config/site.ts`).

## Stack

Next.js 16 (App Router, React Compiler, Turbopack) · React 19 · TypeScript strict ·
Tailwind CSS v4 · GSAP + Lenis · Neon Postgres (SQL brut via `@neondatabase/serverless`) ·
Resend (notification des leads) · Cal.com (prise de rendez-vous).

## Commandes

```bash
npm run dev     # serveur de développement (http://localhost:3000)
npm run build   # build de production (type-check inclus)
npm run lint    # ESLint
```

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — structure feature-based, règles, flux.
- [`CLAUDE.md`](./CLAUDE.md) — contexte projet, conventions, design.
- `docs/` — documents internes (gitignoré, jamais dans `public/`).

## Variables d'environnement

Toutes optionnelles (le site fonctionne sans, les fonctions concernées se désactivent) ;
modèle dans `.env.example`, lecture centralisée dans `src/lib/env.ts` :

- `DATABASE_URL` — Neon Postgres (enregistrement des leads).
- `RESEND_API_KEY` — envoi des notifications e-mail.
- `LEAD_NOTIFICATION_EMAIL` — destinataire des notifications de lead.
- `LEAD_FROM_EMAIL` — expéditeur des notifications (défaut : `onboarding@resend.dev`).

## Déploiement

Hébergement Hostinger (Node auto-géré). Le déploiement se déclenche par `git push`
sur la branche suivie par Hostinger.
