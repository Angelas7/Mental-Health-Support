# Deployment guide

## Recommended first independent deployment

Deploy the authenticated portal as a separate static application (for example, a Vercel project) with the project root set to `portal`, build command `npm run build`, and output directory `dist`. Add a custom domain after the staging deployment is verified.

Required environment variables in the hosting dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are the Supabase project URL and public anon/publishable key. Never set a service-role key or email-provider secret as a frontend environment variable.

Before enabling public traffic:
1. Create a separate Supabase project for staging and apply the SQL migrations in order.
2. Configure Auth email confirmation, allowed site URL and redirect URLs.
3. Test patient and therapist accounts with synthetic data, including attempts to access another patient's IDs.
4. Verify that journal and mood access remains blocked until the patient grants the relevant permission.
5. Add the production domain to Supabase Auth redirect allowlists.
6. Configure backups, recovery, retention, deletion, monitoring and incident response.
7. Complete privacy/legal and clinical review before any real patient records are entered.

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
