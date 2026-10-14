# Pretty Meal Guide mirror public QA

Tested 2026-10-06. Primary: https://pretty-meal-guide.vercel.app/ . Mirror: https://pretty-meal-guide-mirror.pages.dev/ .

## Deployment and artifact

Cloudflare Pages production deployment `ddacf8d3-4b5c-4acd-9c06-6e8e38dc5d3e`, branch `main`, uploaded the original 43-file `dist` (6,460,955 bytes). `npm run build` passed for all five public restaurants. No `dist`, data, images, UI, routes or `vercel.json` changed.

All 43 anonymously retrieved HTTPS files matched local SHA-256 and expected HTML/JSON/image content types. The first run matched 41 files and recorded two TLS connection failures; targeted retries verified the remaining two. An intermediate curl retry also timed out. These are retained as network evidence rather than omitted or interpreted as changed content. No certificate validation was bypassed.

## Browser acceptance

The actual mirror Homepage was opened directly in the browser. Desktop (1280px) and mobile (390px) QA containers loaded **the public mirror HTTPS URL in an iframe**, not a localhost copy. Every Homepage card was clicked. Each direct hash document was then independently loaded and the container reloaded, recreating the remote document at the same restaurant hash. Back/Forward exercised the iframe's browser history. This verified hash initialization and server delivery without a 404, infinite loading or wrong restaurant.

Additional direct-tab check: Homepage card click to Taian Table, followed by browser reload at `https://pretty-meal-guide-mirror.pages.dev/#restaurant=taian-table`, retained the correct Detail title, images, menu and CTA.

| Restaurant | Detail | Images | Menu | Price | Reservation | Refresh | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Taian Table | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| Fu He Hui | PASS | PASS | PASS | PASS | PASS (tel) | PASS | PASS |
| Sushi Oyama | PASS | PASS | PASS | PASS | PASS (tel) | PASS | PASS |
| BOMBANA | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 逸龙阁 | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

- Homepage: five original external images decoded successfully after scrolling. Fonts and icons displayed. No restaurant added or removed.
- Detail images: all 10 image elements per restaurant decoded with positive natural width after scrolling, including slideshow, visual story and food images.
- Motion: manual next advanced `01 / 05` to `02 / 05`; subsequent autonomous advance observed on all five. Mobile hero height remained approximately 625px through image changes.
- Menu links preserved `#restaurant=<id>&section=menu`. Historical disclosure expanded correctly. BOMBANA's lunch/eight-course listings and Yi Long Court's additional menus remained visible.
- Prices: PASS means the existing expression was preserved. Taian current ¥2,888/person; Fu current unknown with dated August 2026 ¥998 archive; Sushi current unknown with November 2025 ¥800/¥980/¥1,280 archive; BOMBANA current and historical prices unknown; Yi ¥298/person lunch, ¥988/person tasting, ¥2,088/set family, unknown à la carte prices. No historical amount was promoted to a current price.
- Reservation: mirror links clicked for Taian, BOMBANA and Yi. Official destinations showed respectively Book a Table, party/date/time controls, and BOOK A TABLE. Fu and Sushi `tel:` links and numbers verified; no call or booking placed.
- Homepage return, Back and Forward: PASS for all five, correct title and public hash.
- Mobile: five Homepage-to-Detail flows, decoded hero images, manual slideshow, readable menus (~343px), correct CTA link targets and visible positive-sized tap areas. Document width stayed within 390px.

Ignored local evidence is in `artifacts/mirror-deployment/`: artifact manifest, initial and final public parity reports, desktop/mobile browser records and mirror Homepage screenshot. Previous Vercel evidence remains separate.

## Synchronization and limitations

One existing local Git repository; no second codebase. No GitHub remote/authentication or push auto deployment is configured for either site. `npm run deploy:mirror` validates and uploads the same maintained `dist` to Pages only. Vercel was not modified or redeployed. Future push automation can use the same GitHub repository plus Wrangler in CI; it requires GitHub setup and deployment credentials.

The first mirror browser request ended with a connection error before subsequent loads succeeded. Command-line HTTPS checks also encountered intermittent TLS failures/timeouts. This test environment cannot establish reliability for the user's mainland ISP without VPN. Free Pages does not enable Cloudflare China Network; this is a cross-border backup/workaround, not a mainland ICP-filed deployment. External Homepage images, Google Fonts and reservation services retain their own network dependencies. Test the new URL on the user's mainland network before judging improvement over Vercel.

Mirror work stops here for mainland-network acceptance. No product, domain, server or infrastructure expansion is included.
