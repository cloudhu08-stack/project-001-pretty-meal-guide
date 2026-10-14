# Pretty Meal Guide V1.0 deployment readiness

Audit date: 2026-10-06 (Asia/Shanghai).

**SHIPPED.** Production is available at <https://pretty-meal-guide.vercel.app/>. Vercel authentication, project linkage, deployment and public QA are complete. See `PRODUCTION_QA.md` for final results. The local audit below records the preparation stage.

## Repository audit

- Maintained application: `dist/index.html`, inline CSS and vanilla JavaScript; no framework or source compilation step existed at handover.
- Existing Git history retained: initial commit `d72720c`; no Git remote configured. The handover work already included extensive uncommitted HTML changes and untracked production images/data; these are included in the preparation commit.
- Added npm scripts with no dependencies. `npm run build` validates the existing static output; it does not rebuild or redesign the page. `npm start` serves local QA at port 4175.
- Output: `dist`, 43 files, 6,460,955 bytes. Five public restaurants, six retained data records, 30 referenced local detail images.
- Data: `/data/production-dataset.json`. No environment variables, secrets, backend, database, runtime installation or external script dependencies are needed.
- Homepage images remain the same five public HTTPS source images; all five loaded during local browser QA. Detail Hero, slideshow and supporting images are deployed from `/assets`.
- No local filesystem URLs, localhost asset references, missing assets, JavaScript parse failures or runtime console errors were found in the verified application.
- Google Fonts and Homepage source images remain third-party dependencies. System fonts and existing image fallback handling are retained.
- Da Vittorio is absent from `homeOrder`; its data and implementation are retained without debugging its route.

## Minimal production fix

The Hero's `查看菜单` link used `#menu`, replacing `#restaurant=<id>`. A real Homepage → Taian Table → menu click reproduced a return to Homepage. The link now uses `#restaurant=<id>&section=menu`. Same-restaurant fragment navigation scrolls without recreating the page or restarting its slideshow. Browser history and refresh retain the restaurant.

No Homepage/Detail design, copy, color, schema or restaurant content was changed for this deployment preparation.

## Vercel configuration

- Framework preset: Other (`framework: null`).
- Build command: `npm run build`.
- Install command: empty, because there are no dependencies.
- Output directory: `dist`.
- Environment variables: none.
- Routing: `/#restaurant=<id>`. Fragments are not sent to the server, so refresh and deep links request `/`; no SPA rewrite is necessary.
- Deploy from the `piaoliangfan-guide` directory, not its parent or the stale `piaoliangfan-guide-publish` copy.
- `.gitignore` and `.vercelignore` exclude local browser profiles, downloaded research artifacts, caches, env files and node_modules. The maintained `dist` is intentionally tracked.

After the user resumed login, the official Vercel CLI device authentication completed. Project `fine-dining/pretty-meal-guide` was created, linked and deployed with `vercel deploy --prod`. The production alias was verified anonymously without bypass tokens or account cookies. Vercel reported READY and the build passed. Local Vercel state and downloaded env files remain ignored by Git and excluded from uploads.

## Local browser E2E

These are **local results**, not public production results. Each restaurant was first entered by clicking its Homepage card. Back, forward, refresh and independent direct URL loads passed for all five.

| Restaurant | Homepage→Detail | Images | Menu | Price | Reservation | Refresh | Local status |
|---|---|---|---|---|---|---|---|
| Taian Table | PASS | PASS | PASS | ¥2,888/位 | Official booking page opened and rendered | PASS | READY |
| Fu He Hui | PASS | PASS | Dated August 2026 archive | ¥998/位 archive, current unknown | Valid tel:+862139809188; no call placed | PASS | READY WITH LIMITATION |
| Sushi Oyama | PASS | PASS | Dated historical Omakase | Historical option ¥800/位; current unknown | Valid tel:+8618017563295; no call placed | PASS | READY WITH LIMITATION |
| BOMBANA | PASS | PASS | Current lunch/tasting listings and historical à la carte | Existing current and historical records have no reliable price; pending-price labels retained | Mozrest HTTP 200; browser tab eventually titled “Book your table today”, interactive UI verification timed out locally | PASS | READY WITH LIMITATION |
| Yi Long Court | PASS | PASS | Lunch, tasting, family set and à la carte listing | ¥298/位, ¥988/位, ¥2,088/套; unpublished à la carte prices retained | Official HTTPS URL verified by web retrieval; browser CTA tested, destination UI verification incomplete | PASS | READY WITH LIMITATION |

## Production E2E

| Restaurant | Homepage→Detail | Images | Menu | Price | Reservation | Refresh | Status |
|---|---|---|---|---|---|---|---|
| Taian Table | PASS | PASS | PASS | ¥2,888/位 | Official booking page rendered | PASS | READY |
| Fu He Hui | PASS | PASS | August 2026 archive | Historical ¥998/位; current unknown | Valid phone CTA | PASS | READY WITH LIMITATION |
| Sushi Oyama | PASS | PASS | November 2025 archive | Historical options; current unknown | Valid historical phone CTA | PASS | READY WITH LIMITATION |
| BOMBANA | PASS | PASS | Separate current listings and dated archive | Prices unconfirmed | Mozrest reservation controls rendered | PASS | READY WITH LIMITATION |
| Yi Long Court | PASS | PASS | Separate menu types | Published sets; à la carte unknown | Official page and BOOK A TABLE rendered | PASS | READY WITH LIMITATION |

All five public Homepage clicks, direct loads, browser back/forward and refresh passed. See `PRODUCTION_QA.md` for evidence and limits.

## Mobile and motion

- Local mobile basic QA: PASS for all five at an actual 390px frame viewport; document content width 375px, no horizontal overflow. Homepage cards clicked; Detail Hero, menu, price text and CTA geometry verified.
- The browser viewport override did not resize the page; a separate local-only `/__qa/mobile` iframe fixture provided a verified narrow CSS viewport. It is served by the development script, and is absent from `dist` and production.
- Mobile Hero next-image controls changed each restaurant to `02 / 05` with decoded, nonzero-width images. Existing pause-on-hidden and cleanup behavior retained. Public narrow-viewport and motion QA also passed; physical mobile-device QA was not performed.
- No telephone calls, restaurant bookings or personal-data submissions were made.

## Remaining acceptance work

Open the public HTTPS URL for human acceptance. Deployment and the five-restaurant public QA are complete, including BOMBANA and Yi Long Court reservation destinations. Do not begin V1.1.

GitHub: no remote/authenticated GitHub CLI is available in this environment. The local repository is prepared for pushing; Vercel CLI deployment need not wait for GitHub.

Post-launch backlog is retained in `PRODUCT_BACKLOG.md`: Da Vittorio routing/loading, Honor system, Dish Hover/Mobile Preview, Real-time Availability, Experience Layer, Spoiler, Further Mobile polish, Custom domain.
