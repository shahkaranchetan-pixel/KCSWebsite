# scripts/

## Compliance calendar

Two files:

- **`compliance-data.js`** — the FY 2026-27 dataset. **This is the single source of truth.**
  Edit due dates here, nowhere else.
- **`build-compliance-calendar.js`** — the generator.

### Changing a due date

```bash
node scripts/build-compliance-calendar.js
```

That does two things:

1. Rewrites the block between the `COMPLIANCE-TABLE:START` / `COMPLIANCE-TABLE:END` markers
   inside `tools/compliance-calendar.html` with the full-year table, so the due dates sit in the
   served HTML instead of being built by JavaScript after page load.
2. Regenerates the 13 static month pages, `tools/compliance-calendar-<month>-<year>.html`.

It also prints the sitemap lines for those 13 URLs. It is idempotent — running it twice in a row
leaves the files byte-identical.

### Rules

- **Do not hand-edit** the generated table in `tools/compliance-calendar.html`, or any
  `tools/compliance-calendar-<month>-<year>.html` file. The next build overwrites both.
- The interactive page reads its data **back out of the rendered rows** rather than carrying a
  second copy in JavaScript. So the `data-month`, `data-cat`, `data-sub` and `data-day` attributes
  on each `<tr>`, and the `.act-pill` / `.period-text` / `.desc-text` / `.applicable-text` spans,
  are load-bearing. If you change that markup in the generator, update the `COMPLIANCES` reader in
  `tools/compliance-calendar.html` to match.
- Month pages take their nav, footer and critical CSS from `tools/compliance-calendar.html` at
  build time. Change the shell there and rebuild; do not edit 13 copies.
- Adding or removing a month means updating `MONTH_INFO` in `compliance-data.js`, rebuilding, and
  updating `sitemap.xml` with the printed lines.

### URL shape

Flat, not nested: `/tools/compliance-calendar-august-2026`.

A nested `/tools/compliance-calendar/august-2026` would require a `tools/compliance-calendar/`
directory, and the extensionless-URL rewrite in `.htaccess` skips any request whose path resolves
to a directory (`RewriteCond %{REQUEST_FILENAME} !-d`). Creating that directory would stop
`/tools/compliance-calendar` resolving to `compliance-calendar.html` and break the main page.
The flat form also matches the query people actually type.
