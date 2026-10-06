# BYA V9 Operational Architecture

## Goal
Move BYA from a static public website toward a governed youth-development digital platform without inventing programs, members, partners, impact or credentials.

## Layers
1. Public Website — identity, learning, opportunities, community, research, impact, trust.
2. Forms Layer — validated forms, consent, anti-spam, provider-neutral endpoints.
3. Identity Layer — authentication, email verification, profiles and account recovery.
4. Member Portal — applications, learning, events, certificates, opportunities and settings.
5. Operations Layer — admin console, workflows, approvals and audit logs.
6. Data Layer — structured entities and reporting periods.
7. Trust Layer — privacy, safeguarding, accessibility, terms and complaints.
8. Evidence Layer — impact metrics, reports, sources, methodology and last-updated metadata.

## Core entities
Users, Members, Profiles, Applications, Volunteers, Programs, Courses, Modules, Enrollments, Resources, Opportunities, Events, Registrations, Partners, Research, Publications, Certificates, ImpactMetrics, Reports, Notifications, SafeguardingCases, AuditLogs.

## Suggested backend relationships
- User 1:1 Profile
- User 0:1 Member
- Member 1:N Applications
- Member N:N Courses through Enrollments
- Member N:N Events through Registrations
- Program 1:N Courses
- Program 1:N Events
- Partner 1:N Programs/Opportunities
- Certificate N:1 Enrollment or Program completion
- ImpactMetric N:1 ReportingPeriod
- SafeguardingCase N:1 restricted authorized officer
- AuditLog N:1 actor

## RBAC
Super Admin, Admin, Program Manager, Community Manager, Learning Manager, Research Lead, Partnership Manager, Safeguarding Officer, Content Editor, Viewer.

## Public truth rules
- Empty registry means no public claim.
- Building means architecture exists but service is not fully operational.
- Planned means future capability.
- Verified means source/evidence has been checked.
- Never publish fabricated partners, events, members, testimonials, impact, certificates, board members, registration status or international affiliations.

## Production gates
### Forms
Secure endpoint, server-side validation, consent, rate limiting, spam controls, retention policy and confirmation workflow.

### Authentication
Secure identity provider, MFA where appropriate, password/session controls, email verification, account recovery and server-side authorization.

### Admin
Authentication + RBAC + audit log + server-side authorization. Never rely on hidden frontend buttons for access control.

### Safeguarding
Named responsible officer, secure reporting channel, case workflow, escalation/referral, confidentiality, retention and anti-retaliation policy.

### Privacy
Data inventory, lawful/appropriate basis, consent where required, purpose limitation, retention, deletion/access processes, third-party disclosure and youth/child data controls.

### Impact
Every metric: definition, source, reporting period, methodology, lastUpdated and evidence URL.

### AI
Approved knowledge base, server-side model access, no frontend API keys, disclosure, logging/minimization and escalation for uncertain/high-risk questions.

## Recommended deployment
Static public frontend can remain on GitHub Pages. Add a separate secure backend/database/auth service for member and operational features. Do not place secrets in the repository.
