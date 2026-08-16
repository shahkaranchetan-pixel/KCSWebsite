# Compliance Calendar — Export Fix Plan

**File:** `tools/compliance-calendar.html` (984 lines)
**Scope:** the downloadable PNG (`downloadImage()`, lines 597–844) and PDF (`downloadPDF()`, lines 846–981)
**Date:** 16 Aug 2026
**Status: IMPLEMENTED 16 Aug 2026** — all defects in Part A fixed and verified in-browser; suggestions
1, 2, 3 and 5 from Part C built. See "What shipped" at the end for the verified results and the two
items deliberately left open.

---

## Part A — What is actually wrong

All findings below were reproduced locally by rendering the export template in a browser, running the
capture, and measuring pixel positions in the resulting canvas. Numbers are from the **August 2026**
export (9 entries, canvas 1024 × 1288 px) — i.e. the exact image you attached.

### A1. ROOT CAUSE of the text overlap — html2canvas draws every text node ~½ em too low

This is the single defect responsible for the "FY 2026-27 badge sitting on top of COMPLIANCE CALENDAR"
and for the general "text is not centred in its box" feel throughout the sheet.

Measured, for the `COMPLIANCE CALENDAR` heading (Georgia 51px):

| | Ink top | Ink bottom | Gold badge top | Result |
|---|---|---|---|---|
| Browser layout (truth) | 186 px | 220 px | 239 px | 19 px clearance ✅ |
| **html2canvas 1.4.1 output** | **213 px** | **247 px** | 239 px | **8 px overlap ❌** |

The heading is drawn **26 px lower** than where the browser puts it. The *boxes* are correct — the gold
badge renders at y=239 in both, exactly matching layout. Only the **text inside** the boxes is displaced.

The displacement scales with font size, roughly **0.48 × font-size**:

| Font size | Downward shift |
|---|---|
| 30 px | 17 px |
| 51 px | 27 px |

It is **not** caused by our CSS. I tested this directly:

- changing `line-height` from `1` → `normal` → `1.25` on the heading: shift stays ~26 px
- changing `font-family` from Georgia → Arial → Inter: shift stays ~26 px (Arial 51px = 18.7 px, Inter = 26.7 px)

This is a known text-baseline bug in html2canvas 1.4.1 (last released 2022, effectively unmaintained).
Because the shift is proportional to font size, it damages the sheet everywhere at once:

- **51 px title** → shifted 27 px → collides with the FY badge (the visible defect)
- **41 px `AUGUST 2026`** → shifted ~20 px → sits low in the navy banner, no longer optically centred with the calendar icon
- **32 px `FY 2026-27`** inside the gold badge → sits low in the pill
- **22 px day numbers / 15–16 px cell text** → shifted 7–10 px → cell text drifts toward the bottom border of each row, which is why the table reads as "cramped / overlapping the lines"
- **Font Awesome glyphs** inside the coloured circles → same shift → the `GST` badge and the icons sit low in their circles

### A2. Verified fix for A1 — swap the capture engine

I loaded `html-to-image` (v1.11.11) against the *unmodified* export template and re-measured:

| Engine | Title ink | Clearance to badge |
|---|---|---|
| html2canvas 1.4.1 | 213–247 | **−8 px (overlap)** |
| **html-to-image 1.11.11** | **186–220** | **+19 px (correct)** |

`html-to-image` reproduces the browser's own layout exactly, because it serialises the DOM into an SVG
`<foreignObject>` and lets the browser do the text layout, instead of re-implementing text metrics.
I also confirmed in the same test that it correctly renders the CA India logo (raster `<img>`) and the
Font Awesome glyphs inside the act badges.

**This one change fixes the overlap and the sitewide vertical mis-centring in a single step.**

### A3. Phantom 32 px white band under the last table row

Visible in your image as the empty white strip between "31 / Maharashtra Profession Tax (PTRC)" and the
navy contact bar, still inside the table's border.

Cause: the export template reuses the site's global `.table-scroll` class (line 709), and
`style.css:582` defines `.table-scroll { overflow-x:auto; margin-bottom: 32px; }`. That 32 px margin
lands *inside* the bordered table wrapper.

Measured: last row bottom = 954.5 px, table wrapper bottom = 987.5 px → exactly 33 px of dead space.

The `overflow-x:auto` is also pointless in an export (the canvas is a fixed 1024 px and the table is
`table-layout:fixed` at 100%), and on some machines it can reserve a scrollbar gutter in the capture.

### A4. Column widths are badly balanced

Measured actual widths inside the 936.7 px table:

| Column | Width | Content |
|---|---|---|
| Date | 112 px | a 1–2 digit number |
| Act | 146 px | "TDS / TCS", "PF / ESIC" |
| Period | 159 px | "Jul 2026" — never needs more than ~90 px |
| **Compliance** | **289.7 px** | the longest strings in the table |
| Applicable To | 230 px | "GST TDS / ECO Operators" |

The most important column is the second-narrowest. That is why
`Maharashtra Profession Tax (PTRC)` is the only row that wraps to two lines, which in turn makes that
row taller than its neighbours and breaks the vertical rhythm of the table.

### A5. Header cells are centred, body cells are left-aligned

`thead` uses `text-align:center` (lines 719–723); every `tbody` cell is left-aligned by default. So
"Date", "Period" and "Applicable To" headings float in the middle of columns whose values start at the
left edge. Visible as ragged column alignment throughout.

### A6. Wrong Act label on Profession Tax and LWF rows — factual error on a client deliverable

`Maharashtra Profession Tax (PTRC)` is stored as `cat:'pay'` (line 426), and `ACT_STYLES.pay` renders
the label **"PF / ESIC"** with the payroll icon (line 606). So the exported sheet asserts that PTRC is
a PF/ESIC compliance. Same problem for:

- `Maharashtra LWF (Half-Yearly)` (lines 340, 387)
- `Maharashtra PT Annual Return (Form III-B)` (line 336)
- `Maharashtra PTEC (Annual)` (line 402)

The on-page legend is honest ("PF - ESIC - PT - LWF", line 216) — it is only the export that mislabels.

### A7. PNG is far too heavy to share

`scale: 3` on a 1024 × 1288 canvas produces a **3072 × 3864 px** PNG — typically 6–10 MB for a
9-entry month, and proportionally worse for 15-entry months. WhatsApp will recompress it into mush as
an image, and may reject it as a document. `scale: 2` (2048 px wide) is already beyond what any phone
or laptop screen resolves.

### A8. Google Fonts `@import` race in the export template

Line 659 injects `<style>@import url('...Inter...')</style>` into the template at capture time. `@import`
is fetched asynchronously and is not covered by the `document.fonts.ready` wait at line 775, so the
export can be captured mid-swap. Inter is already loaded by the page itself, so this import is
redundant and only adds a race.

### A9. PNG and PDF use different, contradictory colour systems

| Category | PNG badge (`ACT_STYLES`, line 601) | PDF text (`colors`, line 908) |
|---|---|---|
| Income Tax | `#1D4ED8` blue | `[29,78,216]` blue |
| TDS / TCS | `#10B981` green | `[29,78,216]` **blue — identical to Income Tax** |
| GST | `#F97316` orange | `[109,40,217]` purple |
| MCA / ROC | `#3B82F6` blue | `[5,150,105]` green |
| PF / ESIC | `#8B5CF6` purple | `[185,28,28]` red |

Four of five categories change colour between the two downloads, and in the PDF **TDS and Income Tax
are indistinguishable**, which defeats the point of colour-coding.

### A10. Minor inconsistencies

- Phone number: `+91 7666638995` in the PNG contact bar (line 744) vs `+91 76666 38995` in the PDF footer (line 974).
- `catLabels.pay` = "Payroll" in the PDF (line 860) vs "PF / ESIC" in the PNG vs "PF - ESIC - PT - LWF" in the on-page legend.
- The `setTimeout(..., 400)` at line 812 is a guess-timer layered on top of a proper `waitForExportAssets()` promise; it just adds latency.
- The current month is only *highlighted* (line 588), never *selected*. So a visitor lands on "All Months", clicks "Download as Image", and gets an alert telling them to go pick a month first (line 789).

---

## Part B — Fix plan

### Phase 1 — Fix the overlap (the blocker) · ~30 min

1. In `ensureCalendarPdfLibs()` (line ~263), replace the html2canvas CDN script with
   `html-to-image` 1.11.11. Keep jsPDF + autoTable untouched — the PDF path does not use html2canvas.
2. Rewrite the capture block in `downloadImage()` (lines 812–842) to:
   ```js
   const dataUrl = await htmlToImage.toPng(target, {
     pixelRatio: 2,
     backgroundColor: '#ffffff',
     width: 1024,
     height: target.offsetHeight
   });
   ```
   then feed `dataUrl` straight into the existing download-link logic.
3. Drop the redundant `setTimeout(400)`; keep `waitForExportAssets()` and add
   `await document.fonts.load("900 51px Georgia")` for the two display faces.
4. Keep a graceful failure path: if `htmlToImage` fails to load, alert and point the user at the PDF
   button (as today).

**Acceptance test:** export August 2026; the gold `FY 2026-27` badge must sit clear below the
title with ~19 px of white between them, and every table cell's text must be optically centred
between its row borders.

### Phase 2 — Layout hardening in `buildExportHTML()` · ~45 min

5. **Remove the `.table-scroll` wrapper** (line 709). Replace with a plain `<div>` — this kills the
   32 px phantom band and the scrollbar-gutter risk. If a wrapper is needed, give the export its own
   class name (e.g. `export-table-wrap`) so no site-wide CSS can ever leak into the deliverable again.
6. **Rebalance the columns** (lines 710–716):
   | Column | Now | Proposed |
   |---|---|---|
   | Date | 112 | **96** |
   | Act | 146 | **168** |
   | Period | 159 | **120** |
   | Compliance | ~290 | **auto → ~322** |
   | Applicable To | 230 | **230** |

   This gives the Compliance column +32 px, which is enough to keep
   `Maharashtra Profession Tax (PTRC)` on one line.
7. **Align headers to their data**: set `text-align:left` on the `Act`, `Period`, `Compliance` and
   `Applicable To` `<th>`s; keep `Date` centred *and* centre its cell content to match.
8. **Lock row height**: add `height:52px` to `<td>` so wrapped and unwrapped rows keep the same rhythm
   (`vertical-align:middle` is already set).
9. **Remove the redundant `@import`** at line 659 and rely on the page's already-loaded Inter.
10. **Sanity-guard the sheet height**: for months with more than ~14 entries the PNG becomes a very
    tall strip. Either reduce padding above 14 rows, or split into two images. (Decide at
    implementation time — August has 9, but December/March run longer.)

### Phase 3 — Data and labelling correctness · ~30 min

11. Add an optional per-row `act` override so a row can display its true statute while keeping its
    colour group. Then set it on the four Maharashtra rows:
    - PTRC (line 426) → `act:'Profession Tax'`
    - PT Annual Return Form III-B (line 336) → `act:'Profession Tax'`
    - PTEC Annual (line 402) → `act:'Profession Tax'`
    - LWF Half-Yearly (lines 340, 387) → `act:'Labour Welfare Fund'`

    Apply the override in `buildExportHTML()` (line 650), in the PDF row builder (line 923) **and** in
    the on-page `render()` (line 552), so all three surfaces agree.
12. **Audit August 2026 for missing entries.** The exported sheet lists 9 items; at minimum these look
    absent and should be verified against the source list before the sheet goes to clients:
    - **15 Aug** — Form 16A, quarterly TDS certificate for Q1 FY 2026-27 (non-salary)
    - **30 Aug** — challan-cum-statement Form 26QB / 26QC / 26QD / 26QE for July 2026

    Recommend the same spot-check for every month of the dataset as a separate pass — this plan does
    not attempt a full statutory audit of all 13 months.
13. Align the three category label sets (`ACT_STYLES`, `ACT_DISPLAY`, PDF `catLabels`) onto one shared
    object so they cannot drift again.

### Phase 4 — PDF parity · ~20 min

14. Replace the PDF `colors` map (line 908) with the PNG's `ACT_STYLES` palette converted to RGB, so
    both downloads look like the same firm's document — and so TDS stops rendering identically to
    Income Tax.
15. Standardise the phone number to one format across PNG contact bar and PDF footer.

### Phase 5 — Verification

16. Export **August 2026** and one high-volume month as PNG; check: title/badge clearance, cell text
    centring, no white band under the last row, no wrapped Compliance cell, Act column reads
    "Profession Tax" on the 31st row, file size < 2 MB.
17. Export the same two months as PDF; check colour parity and the footer.
18. Re-test at "All Months" + PDF for pagination and the repeated page header.

---

## Part C — Suggestions beyond the bug fixes

Ranked by value-per-effort.

1. **Default to the current month on load.** Today the page opens on "All Months", so the first click
   on "Download as Image" produces an error alert (line 789). Selecting the current month on load makes
   the primary action work first time, every time. *(15 min, removes a dead-end in the main flow.)*

2. **Add a "Download .ics" button.** Generate an iCalendar file from the *current filter* with an alert
   set 3 days before each due date. This is the single highest-value addition — it turns a poster into
   something that lives in the client's phone, and no competing CA-firm calendar page in India offers
   it. *(2–3 hrs.)*

3. **"Copy as WhatsApp text".** A plain-text version of the filtered list on the clipboard. Staff
   forward due dates in chat far more often than they attach images. *(30 min.)*

4. **Client-name stamp on the export.** One optional text field — "Prepared for: ____" — printed under
   the month banner. It converts a generic poster into an apparently bespoke deliverable, which is what
   makes staff actually send it. *(30 min.)*

5. **QR code in the export footer**, pointing at the tool URL. Every forwarded image becomes a traffic
   source. Encode it as an inline SVG so no new dependency is needed. *(45 min.)*

6. **"Next 7 days" / overdue awareness.** When the selected month is the current month, tint rows whose
   date has passed and badge the ones due within 7 days. Turns a reference table into something worth
   revisiting weekly. *(1 hr.)*

7. **Weekend flag.** Mark due dates that fall on a Sunday or a bank holiday. It does not change the
   statutory date, but it changes when the client must actually act. *(1 hr, needs a small holiday list.)*

8. **Per-row filing links** — GST portal, TRACES, MCA V3, EPFO, ESIC, Mahagst. One click from "what is
   due" to "where do I file it". *(1–2 hrs.)*

9. **SEO: monthly deep links.** Support `?month=aug_26` and expose 13 internal links ("August 2026 due
   dates", …). Monthly compliance-calendar queries have real, recurring search volume and this page is
   currently a single URL competing for all of them. Pair with a `FAQPage` schema block covering the
   three or four most-searched dates. *(2 hrs.)*

10. **Print stylesheet.** Many users will hit Ctrl+P rather than either download button. A simple
    `@media print` block that hides nav/filters and forces the table to full width is cheap insurance.
    *(30 min.)*

---

## What shipped — 16 Aug 2026

All changes are in `tools/compliance-calendar.html` (+519 / −128 lines). Every number below was
measured in a real browser against the built export, not estimated.

### Defects fixed

| # | Defect | Before | After |
|---|---|---|---|
| A1 | Title/badge overlap (html2canvas baseline bug) | 8 px **overlap** | **17.5 px clearance** ✅ |
| A3 | Phantom band under last table row | 33 px | **1 px** ✅ |
| A4 | Column widths | 112/146/159/**290**/230 | 96/168/120/**323**/230 ✅ |
| A4 | PTRC row wrapping to two lines | wrapped | **single line**, rows locked to 52 px ✅ |
| A5 | Header/body alignment | headers centred, data left | both left; Date centred both ✅ |
| A6 | PTRC/PTEC/LWF labelled "PF / ESIC" | 17 rows wrong | **"Profession Tax" / "Labour Welfare Fund"** ✅ |
| A7 | PNG size | 3072×3864, 6–10 MB | **2048×2482, 1.22 MB** ✅ |
| A8 | Google Fonts `@import` race | present | removed; explicit `document.fonts.load()` ✅ |
| A9 | Three contradictory palettes | page/PDF vs PNG, TDS = Income Tax in PDF | **one 5-hue palette across page, PNG and PDF** ✅ |
| A10 | Phone number formatting | two formats | `+91 76666 38995` everywhere ✅ |

Three further defects were found during implementation and fixed:

- **Month chips read `'27` for April–December 2026** (`Apr '27`, `Aug '27`, …) in both the chip
  markup and `MONTH_INFO.short`. Now `'26`.
- **The PDF button was invisible** — it used `.btn-secondary`, which is white-on-transparent for dark
  hero sections, on the white filter bar. Switched to `.btn-outline`.
- **Font Awesome could not be embedded in the export.** `html-to-image` reads `@font-face` rules via
  `cssRules`, which threw a `SecurityError` on the cross-origin CDN sheet. Added
  `crossorigin="anonymous"`; the sheet's 1952 rules are now readable and every icon renders
  (banner calendar icon went from 3.1% → 64.1% ink coverage in the capture).

### Features built

1. **Opens on the current month.** `initMonthSelection()` selects the visitor's month (or the month in
   the URL), so "Download as Image" works on the first click instead of erroring.
2. **"Add to Calendar" (.ics).** RFC 5545 output, no library. All-day `VEVENT`s with a `VALARM` at
   `TRIGGER:-P3D`. Verified: 13 events / 13 alarms for November 2026, 178 events (106 KB) for the full
   year, CRLF line endings, correct `\,` escaping, and **0 lines over the 75-octet limit** after folding.
3. **"Copy for WhatsApp".** Plain text with WhatsApp bold markers; month headings appear only when the
   selection spans several months. Full-year output is 8,855 characters, well inside WhatsApp's limit.
   Falls back to `execCommand`, then to a selectable overlay — the old `window.prompt` path threw in
   some environments.
5. **`?month=` deep links + FAQ schema.** 13 crawlable month links plus a full-year link; each sets its
   own `<title>`, meta description, canonical and `og:url`. The bare URL deliberately keeps the base
   canonical, so its target does not drift month by month. A `FAQPage` block with 6 questions covers
   GST, TDS, EPF/ESIC, PTRC, ROC and ITR due dates.

Mobile was checked at 375 px: no horizontal overflow, and the four action buttons collapse from four
rows to two via short labels.

### Deliberately left open

- **Suggestion 4 (client-name stamp)** — you marked it not required.
- **The statutory data audit.** Two August 2026 entries still look absent (15 Aug Form 16A; 30 Aug
  Form 26QB/QC/QD/QE). Adding them correctly means deciding the recurrence rule for each across all 13
  months, which is a data decision rather than a code fix, so it was not attempted here.

---

## Summary of the causal chain

The overlap in your attached image is **not** a CSS mistake in the template — the template's layout is
correct, and the browser renders it correctly. It is html2canvas 1.4.1 drawing every text node
approximately half an em below its box, which at 51 px moves the title 27 px down and straight into the
gold FY badge. Replacing the capture library with `html-to-image` restores correct positioning
everywhere at once; the remaining items in Phase 2–4 are genuine but secondary polish.
