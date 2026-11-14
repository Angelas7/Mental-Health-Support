# Deployment guide

## Recommended first independent deployment

Deploy the authenticated portal as a separate static application (for example, a Vercel project) with the project root set to `portal`, build command `npm run build`, and output directory `dist`. Add a custom domain after the staging deployment is verified.

Required environment variables in the hosting dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are the Supabase project URL and public anon/publishable key. Never set a service-role key or email-provider secret as a frontend environment variable.

Before enabling public traffic:
1. Use a separate Supabase staging project before testing production changes; the initial Balenza Therapy project is currently the primary backend.
2. Apply all SQL migrations in order: `001` through `006`.
3. Configure Auth email confirmation, allowed site URL and redirect URLs.
4. Deploy the Edge Functions and set secrets listed below.
5. Test patient and therapist accounts with synthetic data, including attempts to access another patient's IDs and requests to connect to non-therapist accounts.
6. Verify that journal and mood access remains blocked until the patient grants the relevant permission.
7. Add the production domain to Supabase Auth redirect allowlists.
8. Configure backups, recovery, retention, deletion, monitoring and incident response.
9. Complete privacy/legal and clinical review before any real patient records are entered.

## Email and account functions

Deploy the Edge Functions from the repository root with the Supabase CLI:

```bash
supabase functions deploy admin-invite-user
supabase functions deploy admin-list-users
supabase functions deploy send-appointment-reminders
```

Set server-side function secrets in the Supabase project (never in frontend `.env.local`):

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `SUPABASE_ANON_KEY` for caller-session verification in admin functions
- `AUTH_REDIRECT_URL` for account invitation confirmation
- `RESEND_API_KEY` and `REMINDER_FROM_EMAIL` for appointment reminder delivery
- `REMINDER_CRON_SECRET` for the scheduled reminder endpoint

Both admin Edge Functions enforce exact-origin CORS allowlists in their source files. The current approved origins include the canonical production domain `https://balenza-therapy.vercel.app` and the current feature preview alias. If a Vercel alias changes, update both admin function sources and redeploy them; never use a wildcard origin.\n\nConfigure a trusted scheduler to POST to `send-appointment-reminders` with `Authorization: Bearer <REMINDER_CRON_SECRET>` every 15 minutes. Verify the sender domain with the email provider first. Supabase Auth invitation/confirmation emails also need a production SMTP provider configured in the Auth settings.

The reminder email contains only the appointment date/time and a sign-in prompt; it does not include journal, mood, diagnosis or homework details. Review time-zone, consent, deliverability and retry behavior before production.

To provision the first platform administrator, use a trusted project-owner session in the Supabase SQL editor after verifying the intended account UUID:

```sql
update public.profiles
set role = 'platform_admin'
where id = '<verified-auth-user-uuid>';
```

Never expose the service-role key in the browser. The admin dashboard deliberately has no access to journal or mood content.

## Docker local run

From the repository root, create a local `.env` file (never commit it) with:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Then run:

```bash
docker compose build
docker compose up -d
```

Open `http://localhost:8081`. This serves the frontend only; authentication and data require the separately configured Supabase project.

## Current deployment boundary

No hosting provider, domain, Supabase project, email provider, DNS records or production secrets have been configured from this repository. A deployment link cannot be live until those external account steps are completed. The original GitHub Pages URL continues to serve the original static website and does not become the private portal automatically.
