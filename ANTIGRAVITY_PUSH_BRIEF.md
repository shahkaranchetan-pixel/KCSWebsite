# Antigravity Task Brief — Verify & Push (consolidated)

**Repo:** `C:\Development\KCS Website` · **Branch:** `main` · **Remote:** `origin`
**Date:** 16 Aug 2026

**This brief supersedes `ANTIGRAVITY_COMPLIANCE_CALENDAR_PUSH_BRIEF.md` and
`ANTIGRAVITY_BLOG_LINKING_PUSH_BRIEF.md`.** Those two described the work in stages, but a later
site-wide stylesheet change means everything now has to ship as one commit. Ignore the file lists in
those two briefs; use the list here. They remain useful as background on what changed and why.

Verify, then commit and push. If a check fails, stop and report rather than pushing.

---

## STOP — scoping

The tree contains **38 HTML files carrying someone else's uncommitted work** (a removed office-location
card on `about.html`, altered schema blocks on the calculators, and more). Committing them ships that
unfinished work.

**Never run `git add -A`, `git add .`, or `git commit -a` in this repo.**

Those 38 files have been deliberately restored to the exact state they were found in — the stylesheet
version bump described below was reverted on them specifically so their diffs contain only their
owner's changes. **Do not re-apply the bump to them and do not commit them.**

They are: `about.html`, `blog-ais-reconciliation-guide`, `blog-business-valuation-india`,
`blog-ca-fees-mumbai`, `blog-capital-gains-tax-ay2627`, `blog-cost-of-accounting-outsourcing`,
`blog-dpiit-startup-recognition`, `blog-esop-valuation-india`, `blog-fema-compliance-startups`,
`blog-gst-compliance-outsourced-mumbai`, `blog-itr-filing-salaried-ay2627`,
`blog-itr-form-selector-ay2627`, `blog-mumbai-startups-outsourced-accounting-valuation`,
`blog-new-vs-old-regime-ay2627`, `blog-registered-valuer-vs-ca`, `blog-section-87a-rebate-ay2627`,
`blog-tally-to-zoho-migration`, `blog-zoho-books-gst-setup`, `blog-zoho-books-vs-tally`,
`blog-zoho-finance-partner-mumbai`, `business-valuation.html`, `ca-in/andheri-east`,
`ca-in/andheri-west`, `ca-in/mumbai`, `company-incorporation.html`, `contact.html`,
`disclaimer.html`, `index.html`, `tools/advance-tax-calculator`, `tools/capital-gain-calculator`,
`tools/emi-calculator`, `tools/income-tax-calculator`, `tools/loan-eligibility-calculator`,
`tools/loan-tenure-calculator`, `tools/sign-stamp-tool`, `tools/tds-rate-chart`, `virtual-cfo.html`,
`zoho-books-pricing-india.html`, `zoho-books-training.html`.

Also **do not commit**: `.htaccess` (pre-existing edit), `competitor_page.html`, `Local_Preview/`,
`_archive_unused/`, `matrix-generator/`, `gmb-post-images*/`, `download_ytdlp.js`, `yt-dlp.exe`,
`playlist.json`, `.agents/`, and the older `ANTIGRAVITY_*.md` / `CHANGELOG_JUL2026.md` /
`DEPLOYMENT_GUIDE.md` / `THIN_CONTENT_REPORT.md` / `Antigravity_Optimization_Plan.md` files.

---

## The commit — 57 paths

```bash
git add \
  style.css style.min.css sitemap.xml scripts/ \
  blog-late-filing-penalties-fy2627.html blog.html \
  tools/compliance-calendar.html tools/compliance-calendar-*.html \
  blog-43bh-msme-compliance-checklist.html blog-dir3-kyc-guide.html blog-gst-itc-guide.html \
  blog-gstr9-filing-guide.html blog-itr-deadline-ay2526.html blog-itr-forms-fy2526.html \
  blog-itr-mistakes-ay2627.html blog-private-limited-registration.html \
  blog-roc-compliance-calendar.html blog-section-194-tds-dividends.html \
  blog-startup-compliance-checklist.html blog-zoho-books-gst-filing.html \
  audit-assurance.html blog-ca-in-andheri-startup-guide.html blog-fractional-cfo-vs-ca.html \
  blog-ibbi-registered-valuer-startup-funding.html \
  blog-in-house-vs-outsourced-accounting-services.html \
  blog-outsourced-accounting-gst-compliance.html blog-outsourced-cfo-mumbai.html \
  blog-registered-valuer-ma-india.html blog-sme-tax-planning-mumbai-fy2627.html \
  blog-tech-savvy-ca-in-mumbai.html blog-transitioning-outsourced-accounting-checklist.html \
  blog-zoho-books-gst-maharashtra.html blog-zoho-books-india-guide.html \
  ca-in/bkc.html ca-in/fort.html corporate-finance.html fema-compliance.html gst-filing.html \
  income-tax.html outsourced-accounting-services.html tools/index.html \
  zoho-books-implementation.html \
  COMPLIANCE_CALENDAR_EXPORT_FIX_PLAN.md ANTIGRAVITY_PUSH_BRIEF.md

git status   # confirm none of the 38 do-not-commit files are staged
git commit -F -
git push origin main
```

That breaks down as: 3 shared files + `scripts/` (4 files), 14 new pages, 14 substantively edited
pages, 22 pages carrying only a one-line stylesheet-version bump, and 2 docs.

---

## What changed

**1. Compliance calendar export fixes.** PNG export swapped from html2canvas to html-to-image
(html2canvas 1.4.1 draws text ~0.48× font-size too low, so the FY badge overlapped the title;
measured 8px overlap before, 17.5px clearance after). Removed the `.table-scroll` class from the
export template (its 32px margin printed as a white band), rebalanced columns, fixed header
alignment, cut PNG size from 3072×3864 to 2048×2482, added a per-row act override so Profession Tax
and LWF stop printing as "PF / ESIC", unified one 5-hue palette across page/PNG/PDF, fixed month
chips reading `'27` for 2026 months, and fixed the PDF button being white-on-white.

**2. Calendar features.** Opens on the current month; "Add to Calendar" (RFC 5545 .ics, all-day
events, 3-day reminder); "Copy for WhatsApp"; `?month=` deep links.

**3. Server-rendered calendar + 13 static month pages.** `scripts/compliance-data.js` is the single
source of truth; `node scripts/build-compliance-calendar.js` bakes all 178 rows into the served HTML
and regenerates the month pages. Filtering now hides pre-rendered rows instead of rebuilding, and the
page reads its data back out of the DOM rather than shipping it twice.

**4. New blog post** `blog-late-filing-penalties-fy2627.html` (2,568 words). Section numbers taken
from the Income-tax Act, 2025: interest on late TDS is **398(3)** not 201(1A), TDS statement fee
**427** not 234E, return late fee **428** not 234F, interest on a late return **423** not 234A.
Sections 427 and 428 were substituted by the Finance Act, 2026. **Do not "correct" these back.**

**5. Internal linking.** 12 posts gained a bespoke in-content callout; 19 new editorial links into the
calendar cluster. The calendar previously had zero in-content inbound links from the blog.

**6. Link-visibility fix (site-wide).** The global `a{text-decoration:none;color:inherit}` rule made
every in-content link on every blog post render as plain grey body text — a WCAG 2.1 SC 1.4.1
failure. A scoped rule was added to `style.css` and `style.min.css`:

```css
.blog-content p > a:not(.btn):not(.card-link),
.blog-content li > a:not(.btn):not(.card-link){color:var(--brand-saffron-text);text-decoration:underline;text-underline-offset:2px}
```

Contrast measured at **4.92:1** (AA needs 4.5:1). Buttons, card links, share icons and nav are
unaffected. The cache-buster was bumped `?v=15` → `?v=16`, but **only on the 36 pages that were
otherwise clean** — see the note below.

---

## Why 38 pages are still on `?v=15`, and why that is fine

`?v=` is a cache key, not a version selector. There is one `style.min.css` on the server, so a page
requesting `?v=15` receives exactly the same updated file as one requesting `?v=16`. This was verified
in a browser: a page left on `?v=15` shows the link fix correctly.

The only consequence is that a **returning** visitor whose browser already cached the old stylesheet
keeps it a little longer on those 38 pages. New visitors are unaffected everywhere.

Once the owner lands their own pending edits on those 38 files, finish the bump with:

```bash
node scripts/bump-css-version.js 15 16
```

---

## TASK 1 — Static checks

- [ ] `git status` shows none of the 38 do-not-commit files staged.
- [ ] `node scripts/build-compliance-calendar.js` runs clean and leaves **no file changed**.
- [ ] `curl` the calendar and confirm the due dates are in the raw HTML with no JS run:
      178 × `<tr data-month=`, 13 × `class="month-section" data-month=`.
- [ ] `style.css` and `style.min.css` both contain `text-underline-offset:2px`; brace balance in
      `style.min.css` is 0.
- [ ] No blog post still contains the string `In-content links inherit body colour` (the temporary
      per-post copies were removed once the rule went into the shared stylesheet).
- [ ] `sitemap.xml` well-formed, 89 `<url>` entries, no `?month=` URLs.
- [ ] Line endings are CRLF. Five `ca-in/*.html` files have mixed endings **in HEAD already** —
      pre-existing, leave them.

## TASK 2 — Browser verification

Serve the repo root over HTTP; do not use `file://`.

- [ ] `/tools/compliance-calendar` opens on the current month, 178 rows in the DOM under any filter,
      no console errors. Download as Image: badge clear of the title, no white band under the last
      row, ~1–2 MB.
- [ ] `/tools/compliance-calendar-october-2026` — 20 rows, correct H1, prev/next to September and
      November.
- [ ] `/blog-late-filing-penalties-fy2627` — one H1, 3 JSON-LD blocks that parse, FAQ schema matches
      the visible FAQ, 3 tables, no horizontal scroll at 375px.
- [ ] `/blog-zoho-books-india-guide` (bumped) **and** `/blog-tally-to-zoho-migration` (left on v=15) —
      in-content links underlined and saffron on **both**.
- [ ] On any post: share buttons still navy without underline, CTA button text still white, nav
      unchanged.
- [ ] `/virtual-cfo` — no `.blog-content` wrapper, so no underline styling leaks onto service pages.

If any check fails, **stop and report. Do not push.**

---

## Commit message

```
Fix calendar export, pre-render due dates, add penalties post and fix link visibility

Compliance calendar export:
- Replace html2canvas with html-to-image. html2canvas 1.4.1 draws text ~0.48x
  font-size too low, so the FY 2026-27 badge overlapped the title. Measured
  8px overlap before, 17.5px clearance after.
- Drop the shared .table-scroll class from the export template; its 32px margin
  printed as an empty band inside the table border.
- Rebalance columns, align headers with data, lock row height.
- Reduce PNG from 3072x3864 (6-10MB) to 2048x2482 (~1.2MB).
- Add crossorigin=anonymous to the Font Awesome link so the export can embed it.
- Add a per-row act override so Profession Tax, PTEC and LWF stop printing as
  "PF / ESIC" (17 rows), and unify one 5-hue palette across page, PNG and PDF.
- Fix month chips reading '27 for Apr-Dec 2026, and the PDF button using
  btn-secondary (white on white).

Calendar features and rendering:
- Open on the visitor's current month; add .ics export with a 3-day reminder,
  WhatsApp text copy, and ?month= deep links.
- Move the dataset to scripts/compliance-data.js and add a build step that bakes
  all 178 rows into the served HTML instead of building the table in JavaScript.
  Filtering now hides pre-rendered rows, so the full year stays in the DOM.
- Add 13 static month pages with their own titles, canonicals and schema.

Blog:
- Add blog-late-filing-penalties-fy2627.html (2,568 words) using Income-tax Act
  2025 section numbers: 398(3) not 201(1A), 427 not 234E, 428 not 234F,
  423 not 234A.
- Add in-content callouts to 12 posts, 19 new editorial links into the calendar.

Accessibility:
- In-content links inherited a{color:inherit;text-decoration:none} and rendered
  as plain body text, failing WCAG 2.1 SC 1.4.1. Add a scoped rule to style.css
  and style.min.css; contrast now 4.92:1. Bump ?v=15 to ?v=16 on the pages that
  were otherwise clean.
```

---

## Follow-ups — do NOT fold into this commit

**Figures in the new post needing the owner's sign-off.** Direct-tax provisions were verified against
the Act text. These were not verified from a primary source and move through notifications: GST late
fee caps (Notification 19/2021) and the GSTR-9 scale (07/2023); the 1 October 2025 three-year GST
filing bar; ROC ₹100/day uncapped and DIR-3 KYC ₹5,000; EPF s.7Q interest and s.14B damages (the post
deliberately gives no rate for 14B); Maharashtra PTRC 1.25%/month and the ₹1,000 late return fee.

**Statutory data audit.** Two August 2026 entries look absent from the calendar dataset — 15 Aug
Form 16A and 30 Aug Form 26QB/QC/QD/QE. Adding them means deciding a recurrence rule per item across
13 months; that is the owner's call.

**Finish the version bump** on the 38 held-back files once their pending edits land.
