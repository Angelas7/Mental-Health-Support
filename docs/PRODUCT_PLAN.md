# Balenza Therapy Portal — Product Plan

## Goal

Evolve the existing Balenza Therapy mental-wellness website into a client-ready portal while preserving its calm, welcoming visual identity. The public-facing website should remain familiar; authenticated patient and therapist experiences can add functionality without turning the product into a generic corporate dashboard.

## Current baseline

- The current experience is a static, single-page HTML/CSS/JavaScript website.
- Its visual language uses sage green, cream, blush and lavender tones, with Cormorant Garamond and DM Sans typography.
- Existing interactive elements are front-end demonstrations. They do not provide secure accounts, persistent patient records, appointment storage or real email delivery.
- GitHub Pages can host the static public site, but it must not be used as the backend or storage layer for private patient information.

## Proposed MVP

### Public website
- Preserve the current Balenza Therapy landing-page experience and its existing visual identity.
- Add clear entry points for patient sign-in and therapist/admin sign-in.
- Keep public forms honest: show a confirmation only after a real backend operation succeeds.

### Patient portal
- Secure sign-in and sign-out.
- View upcoming appointments and reminders.
- Maintain a private journal and mood history.
- View therapist-assigned homework and mark tasks complete.
- Access approved resources and contact the care team through a controlled channel.

### Therapist / administrator portal
- Role-restricted access.
- View only patients assigned to the signed-in therapist or explicitly authorized administrator.
- Manage appointment details and assign homework.
- Review patient-submitted journal or progress information only where the patient has consented and the product's policy allows it.
- Keep an auditable record of sensitive administrative actions.

## Proposed technical direction

The existing static site should not be rewritten until the current page has been preserved and its reusable sections have been mapped.

A practical MVP option to validate is:
- Front end: React with a build tool such as Vite, if a component-based application is needed.
- Authentication and database: a managed PostgreSQL-backed service such as Supabase, with row-level security.
- Email: a transactional email provider called only from trusted server-side code.
- Hosting: a production host that supports server-side functions and environment secrets, with a custom domain.
- Delivery: GitHub branch protection/reviews and CI checks; containerization and Jenkins can be added once the application build and deployment target are stable.

These are proposals, not final vendor commitments. Confirm hosting, data residency, budget and operational ownership before selecting providers.

## Privacy and security requirements

- Never use real patient information in development, screenshots, test fixtures or public repository files.
- Do not put API keys, service-role keys, passwords or other secrets in browser code or Git.
- Enforce authorization on the server/database, not only by hiding UI elements.
- Use least-privilege roles and patient/therapist relationship checks for every record.
- Apply database row-level security and test both allowed and denied access paths.
- Collect explicit consent for any sharing of journal, mood or other sensitive information.
- Define audit logging, retention, export and deletion procedures before onboarding real users.
- Use HTTPS, secure session handling, rate limits and appropriate account recovery protections.
- Obtain qualified legal/privacy review for applicable Indian requirements, including the DPDP framework, before processing real patient data.

## Delivery sequence

1. Preserve the existing site and document its current behavior and visual system.
2. Decide the MVP roles, patient-data visibility rules and consent model.
3. Choose the hosting, authentication and database providers based on budget and privacy requirements.
4. Implement and test authentication and authorization.
5. Build the patient experience and therapist experience using synthetic test data.
6. Add appointments, homework and transactional notifications.
7. Add CI/CD, monitoring, backups and operational runbooks.
8. Complete security, privacy and usability review before production launch.

## Explicit non-goals for the first MVP

- Emergency or crisis-response services.
- Diagnosis, clinical decision support or automated treatment recommendations.
- Public exposure of patient records or unrestricted administrator access.
- Claiming regulatory compliance before a qualified review has confirmed it.
