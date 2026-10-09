# BYA Website Audit Fixes

Branch: `audit/priority-fixes-2026-10`

## Implemented in this change set

- Changed the second prominent homepage heading from `h1` to `h2` so the homepage has a clearer primary heading hierarchy.
- Corrected the typo `MA dedicated hub` to `A dedicated hub` and refined the sentence.
- Updated the registration and contact form notices so they do not claim confirmed success when requests use `fetch(..., { mode: 'no-cors' })`. The browser cannot inspect the response body in this mode, so successful Promise resolution is not proof that the Apps Script saved the record.
- Updated the Contact page's "Open Contact Form" link to open the homepage contact modal using `?openContact=1#contactModal`.
- Added a query-parameter handler on the homepage for that contact deep link.
- Added `rel="noopener noreferrer"` to homepage links that open new tabs with `target="_blank"`.

## Not yet verified

- Whether either Google Apps Script endpoint actually writes submissions successfully; this requires a controlled live submission and checking the destination sheet.
- Whether every internal link and sitemap URL resolves successfully.
- Browser Console errors, mobile-device behavior, offline/PWA behavior, Lighthouse performance, SEO, and accessibility scores.
- Whether all CSS files and JavaScript bundles are necessary; this needs a page-by-page regression check before removing dependencies.

## Recommended QA before merging

1. Open the homepage and confirm only one `h1` remains.
2. Open Contact, click "Open Contact Form", and confirm the modal appears.
3. Submit a test registration and contact message using a designated test record; verify the destination spreadsheet before treating it as received.
4. Check desktop and mobile layouts in current Chrome, Safari/iOS, and Firefox.
5. Run link checking, HTML validation, Lighthouse, keyboard-only navigation, and service-worker offline tests.
6. Review Apps Script deployment permissions, spam controls, data retention, and sheet access.

This file documents code changes and remaining checks. It is not a claim that runtime or live-backend testing has already passed.
