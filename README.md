# Serene Mind — Mental Health Support

Serene Mind is a wellbeing website and an in-progress private client portal. The original public-facing experience is in `index.html`; the authenticated portal scaffold is in `portal/`.

## Project areas

- **Public website:** existing single-page Serene Mind experience, preserving its original visual identity.
- **Private portal:** React + Vite application with patient, therapist and administrator interface shells.
- **Database:** Supabase PostgreSQL migrations with initial row-level security (RLS) policies.
- **Planning:** product, existing-site audit and architecture documents in `docs/`.

## Run the portal locally

Requirements: Node.js 20 or later and npm.

```bash
cd portal
npm install
cp .env.example .env.local
```

Edit `portal/.env.local` and set:

- `VITE_SUPABASE_URL`: your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: your Supabase publishable/anon key.

Then start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Database setup

In a new Supabase project, review and apply migrations in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_patient_consent_and_permissions.sql`

Configure Auth email confirmation and allowed redirect URLs in the Supabase dashboard. Create separate synthetic patient and therapist test accounts. Therapist and platform-admin roles must be assigned through a trusted administrative process; do not expose role changes in client-side registration.

## Important security and product status

**This repository is not production-ready and must not be used for real patient information yet.**

- No Supabase project, production domain, email provider, hosting environment or production secrets are connected.
- The portal is an initial scaffold; validate all database policies with separate test accounts before relying on them.
- Never put a Supabase service-role key or email-provider secret in browser code or a `VITE_*` variable.
- Therapist access is intended to be patient-approved and permission-scoped. Complete and independently test the consent, audit, account recovery, export/deletion, backup and incident-response workflows before launch.
- Appointment reminder delivery and transactional email are not implemented yet.
- Review crisis resources with a qualified local professional; this website is not an emergency or crisis service.
- Obtain appropriate privacy/legal review for the applicable Indian data-protection requirements before processing real patient data.

Use synthetic test records only during development.

## Repository structure

```
.
├── index.html
├── docs/
│   ├── PRODUCT_PLAN.md
│   ├── EXISTING_SITE_AUDIT.md
│   └── ARCHITECTURE.md
├── portal/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── supabase/
    └── migrations/
```

## Development

Work is currently being prepared on `feature/mental-health-portal`. The `main` branch is kept unchanged until the work is reviewed and accepted.
