-- Migration one-shot — Talgasy Web
-- À exécuter UNE SEULE FOIS au déploiement, avec un rôle DB *administrateur*.
-- Le rôle applicatif utilisé au runtime (DATABASE_URL) ne doit avoir que
-- INSERT + SELECT sur `leads` (moindre privilège — voir create-lead.ts).
--
--   psql "$ADMIN_DATABASE_URL" -f scripts/init-db.sql
--
-- puis, pour le rôle applicatif :
--   GRANT INSERT, SELECT ON leads TO <role_app>;

CREATE TABLE IF NOT EXISTS leads (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  message    TEXT NOT NULL,
  locale     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
