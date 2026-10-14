# Pretty Meal Guide mirror deployment

Status (2026-10-06): published and public QA passed. Mirror: https://pretty-meal-guide-mirror.pages.dev/ . The existing Vercel production deployment remains unchanged. Mainland network acceptance is pending the user's test without VPN.

- Platform: Cloudflare Pages, Direct Upload.
- Production deployment: `ddacf8d3-4b5c-4acd-9c06-6e8e38dc5d3e`, branch `main`.
- Immutable deployment URL: https://ddacf8d3.pretty-meal-guide-mirror.pages.dev/ .
- Build: PASS. Public artifact: 43/43 files match local SHA-256 and content types, including targeted retries after intermittent TLS failures.
- Public browser acceptance: see `MIRROR_QA.md`. No product files or Vercel configuration changed.

## Frozen artifact

- Primary: https://pretty-meal-guide.vercel.app/
- Source: the same repository and `dist` as the primary deployment; no second codebase.
- Type: vanilla HTML/CSS/JavaScript static application, not Vite.
- Build: `npm run build` validates the maintained static files without rewriting them.
- Output: `dist`, 43 files, 6,460,955 bytes. Largest file: 1,325,484 bytes.
- Routes: `/#restaurant=<id>` and `/#restaurant=<id>&section=menu`.
- Local detail photos: root-relative `/assets/...`; data: `/data/production-dataset.json`.
- No backend, application environment variables, Vercel-specific paths or imports.
- Homepage external photos, Google Fonts, reservation URLs and restaurant data remain exactly as published on Vercel.
- Da Vittorio remains retained but hidden; no debugging or product changes.
- SHA-256 baseline: ignored local QA artifact `artifacts/mirror-deployment/artifact-manifest.json`.

## Platform decision

Cloudflare Pages is the first choice for this mirror because it accepts the exact prebuilt directory at the domain root, offers platform HTTPS and a different global CDN, and requires no server or domain purchase. Direct Upload keeps the initial artifact byte-for-byte identical.

Netlify is also technically compatible with this static root deployment and can be a fallback if Pages cannot be used. No evidence currently establishes that Netlify's free domain would be more reliable on the user's mainland network. GitHub Pages project sites normally use a repository subpath, which conflicts with the frozen root-relative data and image URLs; changing those URLs or introducing a domain is outside this mirror scope.

The free Pages service does not enable Cloudflare China Network. This is a cross-border backup/workaround, not a mainland-hosted or ICP-filed deployment. Asia/global CDN coverage is not a guarantee of a particular mainland carrier's route or availability. The final mirror needs real testing by the user on their mainland network without VPN. Existing external Homepage photos, fonts and reservation services may have their own reachability limits even if the mirror HTML opens.

References:

- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/china-network/
- https://developers.cloudflare.com/china-network/faq/
- https://docs.netlify.com/deploy/create-deploys/
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Cloudflare configuration

- Framework: None/static HTML.
- Local build command: `npm run build`.
- Upload directory: `dist` (same artifact as Vercel).
- Project name: `pretty-meal-guide-mirror`.
- Production branch: `main`.
- No Functions, Workers script, bindings, custom domain or paid infrastructure.
- No application secrets are uploaded. Only `dist` is deployed; local `.env.local`, `.vercel`, `.wrangler`, source docs and QA artifacts stay outside it.
- No top-level `404.html` exists. Pages provides its documented default SPA fallback. The actual hash routes request `/` on refresh, so no added `_redirects` file is needed. This preserves the identical artifact and avoids wildcard rules intercepting real assets.

After signing into the selected Cloudflare account:

```powershell
npx --yes --registry=https://registry.npmjs.org wrangler@4.147.0 pages project create pretty-meal-guide-mirror --production-branch main --force
npm run deploy:mirror
```

Creation is already complete. Wrangler 4.147.0 delegates new projects to Workers by default; `--force` selected native Pages for initial creation. Subsequent deployment commands use the existing Pages project and do not need this flag. No Workers application was created by the failed initial delegation.

Use the actual returned Pages production URL; do not assume a requested project name proves the URL exists.

Verify the published artifact anonymously:

```powershell
./scripts/verify-static-deployment.ps1 -Url https://pretty-meal-guide-mirror.pages.dev/ -ReportPath artifacts/mirror-deployment/public-file-parity.json
```

The verifier checks response content types and SHA-256 equality against `dist` for every file. It never uses platform authentication or bypass tokens. It stops after three consecutive failed files and records any incomplete check as a failure.

For browser mobile/desktop QA only, set `QA_PUBLIC_ORIGIN` to the actual mirror HTTPS origin and run `npm start`. The development-only `/__qa/mobile-public` and `/__qa/desktop-public` containers then load the mirror itself at 390px and 1280px. This setting and these containers are not part of `dist` or either public website.

## Git and synchronization

There is one local Git repository with existing history. No GitHub remote or authenticated GitHub CLI is currently available. Neither the primary nor the mirror is currently configured for GitHub push auto deployment.

Direct Upload projects cannot later switch to the built-in Git integration in place, but the same GitHub repository can deploy this Pages project through GitHub Actions and Wrangler. Cloudflare documents this CI workflow at https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/ . It requires a repository and account-scoped Pages deployment credentials stored in GitHub Secrets. Never commit those credentials.

This round does not modify Vercel's project, deployment or production domain. A future push-to-both workflow requires completing GitHub setup and explicitly configuring the existing Vercel project. Until then, `npm run deploy:mirror` updates only the mirror from the same maintained `dist`. Do not claim automatic synchronization is enabled.

## Required public acceptance

After publication, verify anonymous HTTPS and SHA-256 equality for all 43 files; correct JSON/image content types; Homepage five real card clicks; all five Detail images, menu/price expressions, original reservation CTAs, back/forward, refresh and independent hash deep links; manual/automatic image motion; 390px mobile basics. Save mirror evidence separately from previous Vercel results.

Do not mark the mirror shipped before obtaining and testing its actual public URL. After mirror QA, stop for the user's mainland-network acceptance. Do not continue product development.
