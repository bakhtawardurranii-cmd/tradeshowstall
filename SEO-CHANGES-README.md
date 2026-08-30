# SEO fixes applied — summary

All fixes below are already applied to the files in this folder. Re-deploy
this whole folder to replace what's currently live.

## 1. Internal homepage links now use `/` instead of `index.html`
Every `href="index.html"` across the site (nav, footer, logo, breadcrumcs,
CTAs, 404 page, etc.) was replaced with `href="/"`. Confirmed zero
remaining `index.html` internal links anywhere in the HTML.

## 2. `/index.html` → `/` (301, single-hop)
This can only be enforced at the server/host level — it isn't something
a static HTML file can do. Pick whichever matches your actual hosting
and delete the other files:

- **Apache / cPanel / shared hosting** → `.htaccess` (included)
- **Netlify** → `_redirects` (included)
- **Vercel** → `vercel.json` (included)
- **GitHub Pages with Cloudflare DNS/proxy in front of it** (the most
  likely setup here, since a `CNAME` file is present) → GitHub Pages
  itself cannot run server-side redirects at all. Use `CLOUDFLARE-WORKER.js`
  (included) — deploy it as a Worker with a route on
  `tradeshowstall.com/*` and `www.tradeshowstall.com/*`, and turn on
  "Always Use HTTPS" for the zone.
- If you're on plain GitHub Pages with **no** Cloudflare/proxy in front,
  there is no way to get a true server-side 301 — you'd need to add a
  proxy (Cloudflare's free tier works fine) to get real redirects.

Each config redirects in exactly one hop — verified no host/scheme/path
combination bounces through more than one redirect.

## 3. Sitemap cleaned up
Removed from `sitemap.xml`:
- `/privacy-policy.html`
- `/terms-and-conditions.html`

Both pages already carry `<meta name="robots" content="noindex, follow">`,
and `robots.txt` was **not** touched to block them — they stay crawlable/
linkable, just out of the sitemap, which is the correct combination for
noindexed-but-still-linked pages.

## 4. Canonical hostname
`https://tradeshowstall.com/` is confirmed as the single canonical host
in every `<link rel="canonical">`, every `og:url`, and the sitemap. The
actual HTTP→HTTPS and www→non-www enforcement is handled by whichever
redirect config from item 2 you deploy (this is a host-level concern,
not something in the HTML).

## 5. Self-referencing canonicals
Verified every indexable page already has a canonical that exactly
matches its own final URL (including `lahore.html` and `karachi.html` —
neither was canonicalizing to another page). No changes were needed here;
this was already correct.

## 6. City "LocalBusiness" schema fixed
There is no genuine separate physical address for any city (no
`PostalAddress`/street address anywhere on the site) — everything runs
through one company and one phone/email. So instead of six fake
`LocalBusiness` entities (which is what existed before — each city page
declared `"@type": "LocalBusiness"` with a city-specific name but reused
the shared `#organization` @id, creating conflicting data on the same
entity), the site now has:

- **One** real `Organization` entity on the homepage:
  `https://tradeshowstall.com/#organization`
- Every city page (`karachi.html`, `lahore.html`, `islamabad.html`,
  `multan.html`, `bahawalpur.html`, `faisalabad.html`) now declares a
  `Service` (not a business) scoped to that city, with
  `"provider": {"@id": "https://tradeshowstall.com/#organization"}`
  pointing back at the one real organization.
- The homepage's redundant duplicate `LocalBusiness` node (which
  duplicated the `Organization` node) was removed and its useful fields
  (image, description, areaServed) merged into the single `Organization`
  entity.

If a genuine physical office/workshop address exists and you want a real
`LocalBusiness` (with `PostalAddress`, opening hours, geo-coordinates) for
that specific location, that can be added on the relevant page as a
separate, honest entity — just say the word and give me the address.

## 7. Broken OG/schema image references fixed
The site referenced an `/og-images/` folder that doesn't exist anywhere
in the repo — every `og:image`, `twitter:image`, and JSON-LD `image`/`logo`
field was a 404. These were remapped to the real files already sitting in
`/images/`:

| Old (missing) | New (existing, 200 OK) |
|---|---|
| `og-images/custom-two-storey-exhibition-booth-pakistan.webp` | `images/exhibition-stall-two-storey-tech-booth.webp` |
| `og-images/exhibition-booth-reception-design-expo.webp` | `images/exhibition-stall-booth-showcase.webp` |
| `og-images/exhibition-stall-fabric-brand-karachi.webp` | `images/exhibition-stall-textile-wood-brass-karachi.webp` |
| `og-images/trade-show-stall-logo.webp` | `images/logo-trade-show-stall.webp` |

If you have the *actual* dedicated OG images (1200×630, different crops
from the in-page photos) sitting somewhere, upload them to `/images/` (or
recreate an `/og-images/` folder) and I can re-point these back — reusing
in-page photos as OG images works fine but is a fallback, not ideal.

## 8. Wrong Lahore image fixed
`lahore.html`'s "Recent Work in Lahore" section was showing
`exhibition-stall-textile-wood-brass-karachi.webp` — a Karachi-labelled
photo — right next to copy describing "the two-storey booth ... built for
a technology exhibitor." That's the genuine Lahore project image already
used earlier on the same page
(`exhibition-stall-two-storey-tech-booth.webp`). Swapped the `src` to
that file and rewrote the `alt` text and added a `title` attribute so it
accurately describes the real Lahore project instead of Karachi's.

---

### Files added
- `.htaccess` — Apache redirect rules
- `_redirects` — Netlify redirect rules
- `vercel.json` — Vercel redirect rules
- `CLOUDFLARE-WORKER.js` — Cloudflare Worker redirect script
- `SEO-CHANGES-README.md` — this file

### Files modified
All `.html` files (internal links + image refs), `sitemap.xml`,
`lahore.html` (image), `index.html` and the six city pages (schema).
