# Portal architecture and implementation plan

## Product shape

Keep the existing Serene Mind public website and its visual identity. Add a separate authenticated portal at a dedicated route or subdomain. GitHub Pages may continue serving static public content, but it must not host private patient records or secrets.

## Proposed MVP stack

- Frontend: React + Vite for the authenticated portal; reuse the existing palette, typography, spacing and interaction language.
- Identity and database: Supabase Auth + PostgreSQL, with Row Level Security (RLS) on every patient-data table.
- Email: a server-side/Edge Function using a transactional email provider. Never expose provider keys or Supabase service-role credentials in browser code.
- Hosting: a static host for the public site and a host supporting server-side functions for the portal/API. Final provider/domain choice remains a deployment decision.
- Delivery: GitHub Actions for lint/build/test and deployment. Add Docker/Jenkins only when the deployment target or customer workflow benefits from them; Kubernetes is not an MVP requirement.

## Roles and access

- Patient: can read/write their own journal and mood entries, view assigned homework and appointments, and manage their own basic profile.
- Therapist: can see only patients with an active, patient-approved access grant. Journal and mood visibility are separate permissions. Can assign homework and manage appointments only where explicitly granted.
- Platform administrator: manages account provisioning and platform configuration. No blanket access to journal or mood content is granted by the schema. Any exceptional support access needs a documented, time-limited, audited process outside the normal dashboard.

Never accept a role, patient ID, therapist ID, or permission from a browser request as proof of authority. Derive identity from the authenticated session and enforce authorization in the database/API.

## Core data model

- profiles: one row per Auth user; role is assigned by a trusted operator, never by self-registration input.
- therapist_patient_access: patient-approved relationship and scoped permissions.
- journal_entries: private patient-authored entries.
- mood_entries: private mood check-ins.
- homework: tasks assigned by a therapist to an assigned patient.
- appointments: scheduled sessions and reminder preferences/status.

The initial SQL migration defines these tables and RLS policies. It is a starting implementation, not a security certification; test policies with separate patient, therapist and admin accounts before any real data is used.

## Privacy and safety requirements

1. Use synthetic data only during development and demos.
2. Obtain clear patient consent before a therapist can access any category of patient content.
3. Enforce least privilege with RLS and server-side authorization; deny by default.
4. Keep service-role keys and email-provider credentials in server-side secrets only.
5. Do not put journal text, mood notes, or sensitive details in email reminders; send minimal appointment notices.
6. Provide account recovery, session expiry/revocation, rate limiting, audit events, export and deletion workflows.
7. Define retention, backup, restore, incident response and access-review procedures before launch.
8. Review crisis resources and escalation wording with a qualified local professional. Do not present the portal as an emergency service.
9. Obtain India-specific privacy/legal review (including applicable DPDP requirements) before processing real patient data. This plan does not claim legal or clinical compliance.

## Build sequence

1. Baseline audit and product plan — completed in this branch.
2. Architecture and initial database/RLS migration — added in this branch.
3. Create Auth project, configure redirect URLs and secrets outside Git; test RLS with synthetic accounts.
4. Build login, registration/invitation, patient dashboard and therapist dashboard while preserving the current visual language.
5. Connect journal, mood, homework and appointment screens to the database.
6. Add server-side email invitations and appointment reminders with consent and minimal content.
7. Add automated tests, accessibility checks, CI build and staging deployment.
8. Complete security/privacy review, backup/restore test, customer acceptance and production deployment.

## Current limitations

No Supabase project, email provider, production domain, hosting target or customer account has been connected. No backend or authentication is live yet. Do not enter real patient data until the controls above are implemented and independently tested.
