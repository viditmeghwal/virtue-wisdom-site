# Virtue & Wisdom — SEO Implementation

**Date:** April 28, 2026
**Scope:** On-page SEO + technical SEO + 2 new landing pages

---

## Quick start

This package contains everything needed to deploy the SEO changes. Your existing site already had substantial SEO infrastructure (schema, OG tags, GA4, etc.) — most of the work was layering "branding agency" vocabulary on top of your existing "brand building company" identity, populating empty social arrays, and adding two new long-form landing pages.

### Folder structure

```
deliverable/
├── README.md                      ← you're here
├── robots.txt                     ← upload to site root
├── sitemap.xml                    ← upload to site root
├── modified/                      ← 26 files: drop-in replacements for existing files
│   ├── index.html
│   ├── services.html
│   ├── ... (24 more)
└── new/                           ← 2 brand new pages
    ├── branding-agency-india.html
    └── d2c-branding-agency.html
```

### How to deploy

1. **Back up your current site** (or work in a new branch).
2. **Replace the 26 files** in `modified/` with the new versions (same filenames).
3. **Upload the 2 new files** in `new/` to your site root.
4. **Upload `robots.txt` and `sitemap.xml`** to your site root.
5. **Verify locally** by opening `index.html` and a sector page in a browser — confirm nothing visually broke.
6. **Deploy** to production.
7. **Submit** `https://virtuewisdom.com/sitemap.xml` to Google Search Console.

---

## What was changed

### 1. Footer social links (20 files)

**Before:** 4 placeholder links (`href="#"`) for Instagram, LinkedIn, Behance, YouTube.
**After:** 2 real links — Instagram (`https://www.instagram.com/brandvirtuewisdom`) and LinkedIn (`https://www.linkedin.com/company/virtue-wisdom/`). Behance and YouTube were removed (as you don't have those accounts yet — empty placeholder links hurt more than missing ones).

When you create Behance and YouTube accounts later, search-replace this block in all 20 files:

```html
<li><a href="https://www.linkedin.com/company/virtue-wisdom/" target="_blank" rel="noopener">LinkedIn</a></li>
```

…and add new `<li>` items below it for Behance/YouTube with real URLs.

### 2. `sameAs` array in Organization schema (20 files)

The Organization schema across all pages had `"sameAs": []` (empty array). This is now populated with the Instagram and LinkedIn URLs. Google uses the `sameAs` array to build the Knowledge Panel for your brand — populated arrays meaningfully improve brand-search recognition.

### 3. Title tags (7 key pages)

Layered "Branding Agency" vocabulary alongside the existing "Brand Building" identity:

| Page | Before | After |
|------|--------|-------|
| index.html | Brand Building Company in Udaipur, India | Branding & Marketing Agency in India |
| services.html | Capabilities — Strategy, Branding, Marketing, Events | Branding & Marketing Services in India |
| sectors.html | Sectors We Specialise In — Brand Building Across Industries | Industry-Specific Branding Agency in India |
| about.html | Studio — The Team Behind Virtue & Wisdom | About — Branding & Marketing Agency in Udaipur |
| contact.html | Contact — Start a Brand Building Project | Contact a Branding Agency in India |
| blog.html | Journal — Notes on Building Iconic Brands | Brand Strategy Journal | Virtue & Wisdom Branding Agency |
| work.html | Brand Building Portfolio — Hospitality, Marble, Jewellery | Branding Agency Portfolio in India |

**Why this matters:** "Brand Building Company" has very low monthly search volume in India. "Branding Agency" has 10–100x more. Updated titles now capture both vocabularies.

### 4. SEO H2 subheads added (6 pages)

Added keyword-rich H2 subheads beneath the existing H1s. On the homepage, the H2 is hidden visually (positioned off-screen) so the cinematic "We create iconic brands." hero stays untouched. On sector pages, the H2 is visible with subtle italic styling underneath the existing H1.

| Page | New H2 |
|------|--------|
| index.html (hidden) | Virtue & Wisdom — a branding and marketing agency in India, building iconic brands across hospitality, marble, jewellery and lifestyle. |
| sectors.html (visible) | An industry-specific branding agency for marble, hospitality, cafés and jewellery brands across India. |
| brand-building-for-marble-companies.html | A branding agency playbook for marble companies in India. |
| brand-building-for-resorts-and-hotels.html | A branding agency playbook for hotels and resorts in India. |
| brand-building-for-cafes.html | A branding agency playbook for cafés and restaurants in India. |
| brand-building-for-jewellery-brands.html | A branding agency playbook for jewellery brands in India. |

A `<!-- vw-seo-subhead -->` marker comment is left right above each insert so future re-runs of the script are idempotent (won't double-insert).

### 5. New pages: `branding-agency-india.html` and `d2c-branding-agency.html`

Two new long-form landing pages built using your marble sector page as the structural template — same head, same nav, same footer, same chat panel. Each page includes:

- Full meta tags (title, description, OG, Twitter)
- 4 JSON-LD schemas (Service, Article, FAQPage, BreadcrumbList)
- Hero with H1 + SEO H2 subhead
- ~5 paragraphs of original long-form copy targeting the keyword
- 6 FAQ entries with FAQPage schema
- Custom "Read on" cross-link cards
- Custom CTA band

Both pages are added to the sitemap.

### 6. `robots.txt` and `sitemap.xml`

Created from scratch. The sitemap includes 28 URLs (all main pages + sector pages + case studies + blog posts + the 2 new pages). Pages excluded from the sitemap: `report.html`, `success.html`, `chat-snippet.html` (internal/funnel-only).

---

## What was NOT changed (and why)

- **Sector page schemas** — already had Service, Article, BreadcrumbList, FAQPage. Already excellent.
- **Sector page FAQ HTML** — already exists on all 4 sector pages. Excellent.
- **Open Graph tags on existing pages** — already present and well-configured.
- **Google Analytics / Search Console verification** — already in place.
- **Geo meta tags on sector pages** — already present.
- **Meta descriptions on existing pages** — already good. Layering keywords here would have diminishing returns.
- **Case study pages, blog posts, tool/visuals/report/success pages** — only footer + sameAs were updated. Their existing meta is fine.
- **Sitemap of new pages includes them with `lastmod` of today** — Search Console will pick them up on next crawl.

---

## Recommended next steps after deploy

1. **Submit sitemap** to Google Search Console (Settings → Sitemaps → Add `sitemap.xml`).
2. **Request indexing** for the 2 new pages individually in Search Console (URL Inspection → Request Indexing).
3. **Internal linking**: add a link from your homepage and capabilities page to `branding-agency-india.html` and `d2c-branding-agency.html`. These pages are currently only reachable through the sitemap — internal links from high-authority pages will accelerate ranking.
4. **Run pagespeed test** on the 2 new pages (https://pagespeed.web.dev/) — they share the marble template's CSS, so they should perform identically.
5. **Set up Behance/YouTube accounts** when ready, then add the URLs back to footer + sameAs arrays.
6. **Monitor rankings** for the 11 target keywords from the SEO plan over the next 90 days. Sector keywords ("branding for marble companies India") should move first, within 30–60 days.

---

## Files in this package

### Root
- `README.md` — this file
- `robots.txt`
- `sitemap.xml`

### `modified/` (26 files — replace existing)

`about.html`, `blog-cafe-instagram.html`, `blog-cafe-reels.html`, `blog-clothing-brand.html`, `blog-fnb-shoot.html`, `blog-hospitality-playbook.html`, `blog-marble-brand.html`, `blog-resort-fade.html`, `blog.html`, `brand-building-for-cafes.html`, `brand-building-for-jewellery-brands.html`, `brand-building-for-marble-companies.html`, `brand-building-for-resorts-and-hotels.html`, `case-ameyaa.html`, `case-auric.html`, `case-dune.html`, `case-greenlab.html`, `case-nira.html`, `case-sasstain.html`, `contact.html`, `index.html`, `sectors.html`, `services.html`, `tool.html`, `visuals.html`, `work.html`

### `new/` (2 files — add to site root)

- `branding-agency-india.html`
- `d2c-branding-agency.html`

---

## Validation summary

- ✅ HTML structure validated on all 13 critical pages
- ✅ JSON-LD schemas validated across all 31 site pages
- ✅ All target keywords covered: 11 from main plan + 4 sector keywords (already won via existing sector pages)
- ✅ Idempotent — `<!-- vw-seo-subhead -->` markers prevent double-inserts on re-run
- ✅ No marble/Kishangarh/Makrana leakage in the new generic pages

---

*Implementation by Claude. Questions or revisions: just ask.*
