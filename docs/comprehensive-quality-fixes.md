# BYA Website — Comprehensive Quality Fixes

**Branch:** `fix/comprehensive-site-quality-2026-10`  
**Scope:** Static source review and source-level fixes  
**Status:** Proposed changes; not yet merged or confirmed on the live site.

## Implemented in this branch

### Forms and user feedback
- Fixed malformed markup around the optional membership phone field.
- Added a proper accessible label to the membership address field.
- Added native browser validation through `reportValidity()` for membership and contact forms.
- Wired both forms through their submit events so keyboard/Enter submission invokes the same validation and handler as clicking the submit button.
- Removed success wording that implied the external Google Apps Script had confirmed persistence. The UI now explains that a request was attempted but the browser cannot confirm saving.
- Preserved entered data instead of clearing the form after an opaque `no-cors` response.
- Added live status announcements for form status areas.
- Added accessible dialog semantics, labelled modal titles, close-button labels, initial/updated `aria-hidden`, Escape-to-close, focus entry/return, and a basic keyboard focus loop for the membership and contact modals.

### Headings and accessibility
- Corrected the primary heading level on About and Learning.
- Removed the second `h1` from the Articles page by changing the article banner heading to `h2`.
- Added screen-reader labels to the article search field and icon-only search button.
- Fixed invalid quote nesting in the inline AI assistant's Facebook-link answer; inline script syntax checks now pass for the audited pages.
- Added accessible labels and expanded-state updates to AI assistant controls.
- Removed duplicate mobile-menu event listeners so one controller manages menu state.
- Added a reduced-motion media query on the homepage.
- Added `rel="noopener noreferrer"` to external links opening a new tab on the pages where this was missing.

### Search safety and coverage
- Replaced Search Result HTML-string rendering with DOM nodes and `textContent`, reducing the risk of HTML injection from index data.
- Added validation so Search Result destinations must be simple, same-site `.html` paths.
- Expanded `data/search-index.json` from the starter set to include all 31 page URLs listed in the sitemap.

### Metadata and offline support
- Added missing canonical links to pages that did not have them, including the Search page.
- Repaired the Get Involved page's outdated `index.html#join-us-upgrade` link so it opens the membership form directly.
- Added the Search page to the sitemap and offline app shell.
- Bumped the Service Worker cache version to invalidate the older app-shell cache.
- Added current published pages, CSS/JS variants and the Search Index to the app-shell list.
- Changed app-shell installation to use `Promise.allSettled` so one unavailable cache asset does not prevent every other asset from being cached.

## Important limitation: form persistence is not yet verified

The two homepage forms still use external Google Apps Script endpoints with `mode: "no-cors"`. The browser cannot inspect the returned response to confirm that the backend stored the data. The updated UI avoids falsely claiming confirmed success, but this is not a complete backend reliability fix.

To make receipt verifiable, the external Apps Script must be reviewed and updated to provide a suitable success/error acknowledgement, then tested with real submissions. That external deployment was not changed by this repository patch.

## Validation performed

Source-level checks on the proposed branch confirmed:
- Homepage has one `h1`.
- Membership phone markup no longer has the stray style text.
- Homepage has no `target="_blank"` links missing `rel`.
- Search Index is marked `site-index` and contains all 31 sitemap pages (the sitemap root URL corresponds to `index.html`).
- Across the 31 sitemap pages, source-level checks found one `h1` per page, canonical metadata on every page, no images missing `alt`, no duplicate IDs, and no `_blank` links missing `rel`.
- Inline JavaScript blocks and the shared JavaScript files passed syntax compilation checks after the script fixes.
- About and Learning each have one `h1`; Articles has one `h1`.
- Search rendering no longer uses `innerHTML` for result titles, types or URLs.
- Service Worker version is bumped and the search index is listed for caching.

## Not claimed as passed

No real-browser automation, screen-reader test, mobile viewport test, Lighthouse run, live HTTP link crawler, external endpoint persistence test, or GitHub Pages deployment-log confirmation was completed in this source patch. Static link and fragment checks were performed against the source; external URLs and actual rendered behavior still require live tests. These remain required before calling the live site production-ready.

## Recommended final QA checklist
1. Confirm GitHub Pages publishes from `main` and check the latest deployment status.
2. Test membership and contact submissions end-to-end with test data; verify the Google Sheet/backend records.
3. Test at mobile widths and desktop widths, including navigation, dialogs, focus and Escape behavior.
4. Check browser console/network errors and all sitemap links.
5. Run Lighthouse and automated accessibility checks, then manually keyboard-test the forms and navigation.
6. Review actual claims on courses, certificates, partnerships and services so planned/unverified offerings are clearly labelled.
