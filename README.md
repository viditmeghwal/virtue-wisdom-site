# Virtue & Wisdom — Website

Multi-page agency website built from the V&W Brand Deck. Vanilla HTML, CSS, and JavaScript — no build step required.

## Pages

- `index.html` — Home (hero, clients marquee, The Virtue Code, featured work, segments)
- `work.html` — Portfolio grid with category filters (all 10 case studies from the deck)
- `services.html` — Three-pillar capabilities page (Branding Acceleration, Brand Marketing, Experience Orchestration)
- `about.html` — Studio page (leadership team, stats, industries)
- `contact.html` — Contact form with real V&W contact details

## Getting started

Open `index.html` in a browser, or run a local server:

```bash
cd site
python3 -m http.server 8000
# visit http://localhost:8000
```

## Brand tokens

All colors, fonts, and spacing live as CSS variables at the top of `css/style.css`:

```css
--ink: #0a0a0a;      /* deep near-black */
--paper: #ffffff;    /* white */
--accent: #b08d57;   /* champagne — used sparingly on italic accents */
--f-display: "Cormorant Garamond";  /* matches the V&W logo aesthetic */
--f-body: "Inter";
```

The whole palette and type system was chosen to echo the V&W logo — elegant serif, refined, premium black & white.

## Swapping placeholder SVGs for real client photos

Every project card on the work page currently uses an inline SVG as a placeholder. To add real photography:

**1. Drop your photos into `/site/images/`** — ideally 900×675 (4:3 ratio), JPEG, under 150 KB each. Recommended file names matching the data already in the HTML:

- `sasstain.jpg`, `malta.jpg`, `sikarwar.jpg`, `bigha.jpg`, `tiecon.jpg`, `auric.jpg`, `uwc.jpg`, `sparsh.jpg`, `beesi.jpg`, `gooddot.jpg`, `nexus.jpg`

**2. In `work.html`, replace the entire `<svg>` inside each `.project__media`** with an `<img>` tag. Example — for the Sasstain card, find this:

```html
<div class="project__media">
  <svg class="project__canvas" viewBox="0 0 400 300" ...>
    ...placeholder SVG...
  </svg>
  <span class="project__badge">Branding</span>
</div>
```

Replace with:

```html
<div class="project__media">
  <img class="project__canvas" src="images/sasstain.jpg" alt="Sasstain luxury vegan branding by V&W" />
  <span class="project__badge">Branding</span>
</div>
```

The `.project__canvas` class handles the cover-fit and zoom-on-hover automatically for both `<svg>` and `<img>`.

Do the same for the featured cards on `index.html`.

## Swapping leadership team portraits

On `about.html`, each team member has a placeholder SVG portrait. Replace with real photos the same way — drop headshots (ideally 400×500 JPEG) into `/site/images/` and swap the `<svg>` inside `.member__portrait` with an `<img>`:

```html
<div class="member__portrait">
  <img src="images/vidit.jpg" alt="Vidit Meghwal, Founder" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

## Adding a new case study

Copy any existing `<a class="project" data-category="...">` block in `work.html`, change the name, tag, category, and artwork. To filter correctly, match `data-category` to one of: `luxury`, `food`, `healthcare`, `realestate`, `entertainment`, `retail`, `tech`. A project can have multiple: `data-category="luxury,food"`. If you add a new category, also add a new `<button class="filter-btn" data-filter="...">` to the filters section and update the counts.

## Wiring up the contact form

The form currently shows a "Sent ✓" confirmation client-side only. To actually receive submissions:

- **Formspree** — simplest option. Sign up, get a form ID, change the `<form>` tag to `<form action="https://formspree.io/f/YOUR_ID" method="POST" class="contact__form">` and the default handler will take over.
- **Netlify Forms** — if hosting on Netlify, just add `netlify` attribute to the form tag.
- **Custom backend** — the form submit handler is in `js/main.js`; swap the demo logic for a `fetch()` POST to your endpoint.

## What's real vs. placeholder

Real (from the V&W deck):
- All company copy, services, methodology (The Virtue Code), industries
- All 10 case study names and categories
- All leadership team names and roles
- Real contact details (email, phones, website)
- All client names in the marquee strip

Placeholder (for you to replace):
- All SVG project covers on `work.html` and `index.html`
- All SVG team portraits on `about.html`
- Social media links in the footer (all `href="#"` — add your real URLs)

## File structure

```
site/
├── index.html
├── work.html
├── services.html
├── about.html
├── contact.html
├── README.md
├── css/
│   ├── style.css     (tokens, nav, footer, logo, shared)
│   └── pages.css     (page-specific layouts)
├── js/
│   └── main.js       (nav scroll, reveals, filters, form)
└── images/           (empty — drop your photos here)
```

## Credits

- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- Content sourced from the V&W Brand Deck (Oct 2024) and Visuals by V&W
