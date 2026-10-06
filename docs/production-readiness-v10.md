# BYA V10 — Production Readiness Foundation

V10 is the controlled production foundation for the BYA public website and future operating platform.

## Truth rules
- Never publish invented members, partners, events, opportunities, impact figures, certificates, affiliations, registrations, or funding claims.
- Empty registries are intentional until verified records exist.
- Forms remain disabled until an approved backend endpoint and privacy controls are configured.
- Authentication and admin authorization must be enforced server-side.
- Safeguarding cases must never be exposed to the public frontend.

## Architecture
Public: Website → Search → Programs → Learning → Opportunities → Community → Research → Impact → Trust.

Operational: Authentication → Database → API → Member Portal → Admin Console → RBAC → Audit Logs → Notifications.

## Production gates
1. Approved backend provider.
2. Authentication enabled.
3. Database schema migrated.
4. RBAC tested.
5. Form endpoints configured.
6. Privacy and retention controls implemented.
7. Safeguarding workflow protected.
8. Certificate registry backed by authoritative records.
9. Analytics consent/disclosure implemented.
10. Accessibility, broken-link, SEO and mobile QA passed.

The GitHub Pages frontend is the public presentation layer. It must not contain secrets, private records, privileged admin data, or client-side authorization logic.
