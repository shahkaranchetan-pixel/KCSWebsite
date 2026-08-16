/* Build step for the compliance calendar.
   Run:  node scripts/build-compliance-calendar.js

   Reads the dataset from scripts/compliance-data.js and writes:
     1. the full-year table baked into tools/compliance-calendar.html, between the
        COMPLIANCE-TABLE markers, so the due dates are in the served HTML rather
        than being built by JavaScript after load;
     2. thirteen static month pages, tools/compliance-calendar-<month>-<year>.html,
        each with its own title, description, canonical, intro and FAQ schema.

   The page shell (critical CSS, nav, footer) is lifted out of the main page at
   build time, so the month pages stay in step with it automatically. */

const fs = require('fs');
const path = require('path');
const { MONTH_INFO, COMPLIANCES, ACT_DISPLAY, actLabel } = require('./compliance-data.js');

const ROOT = path.join(__dirname, '..');
const MAIN_PAGE = path.join(ROOT, 'tools', 'compliance-calendar.html');
const SITE = 'https://kcshah.com';

const esc = s => String(s).replace(/[&<>"']/g, ch =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// The repo's HTML is CRLF; normalise so generated files don't land as mixed.
const writeCRLF = (file, text) =>
  fs.writeFileSync(file, text.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'), 'utf8');

// "August 2026" -> "august-2026"
const slugOf = key => MONTH_INFO[key].name.toLowerCase().replace(/\s+/g, '-');
const urlOf = key => `${SITE}/tools/compliance-calendar-${slugOf(key)}`;
const fileOf = key => path.join(ROOT, 'tools', `compliance-calendar-${slugOf(key)}.html`);

const monthKeys = Object.keys(MONTH_INFO).sort((a, b) => MONTH_INFO[a].order - MONTH_INFO[b].order);
const byMonth = key => COMPLIANCES.filter(c => c.month === key).sort((a, b) => a.day - b.day);

const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const listify = arr => arr.length <= 1 ? (arr[0] || '')
  : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];

/* ------------------------------------------------------------------ *
 *  Table markup - shared by the main page and the month pages
 * ------------------------------------------------------------------ */

function rowHTML(c) {
  return `        <tr data-month="${c.month}" data-cat="${c.cat}" data-sub="${c.sub || ''}" data-day="${c.day}">
          <td data-label="Date"><span class="date-pill">${c.day}</span></td>
          <td data-label="Act"><span class="act-pill ${c.cat}">${esc(actLabel(c))}</span></td>
          <td data-label="Period"><span class="period-text">${esc(c.period)}</span></td>
          <td data-label="Compliance"><span class="desc-text">${esc(c.title)}</span></td>
          <td data-label="Applicable"><span class="applicable-text">${esc(c.tag)}</span></td>
        </tr>`;
}

function monthSectionHTML(key, items) {
  const info = MONTH_INFO[key];
  return `    <div class="month-section" data-month="${key}">
      <div class="month-section-header">
        <h3>${esc(info.name)}</h3>
        <span class="badge-count">${items.length} ${items.length === 1 ? 'compliance' : 'compliances'}</span>
      </div>
      <div class="table-scroll"><table class="compliance-table">
        <thead>
          <tr>
            <th style="width:64px">Date</th>
            <th style="width:128px">Act</th>
            <th style="width:140px">Period</th>
            <th>Description</th>
            <th style="width:170px">Applicable To</th>
          </tr>
        </thead>
        <tbody>
${items.map(rowHTML).join('\n')}
        </tbody>
      </table></div>
    </div>`;
}

/* ------------------------------------------------------------------ *
 *  Per-month prose and FAQ, generated from the data so each page is
 *  genuinely distinct rather than a template with the month swapped in
 * ------------------------------------------------------------------ */

function monthFacts(key) {
  const items = byMonth(key);
  const info = MONTH_INFO[key];

  const byDay = {};
  items.forEach(c => { (byDay[c.day] = byDay[c.day] || []).push(c); });
  const busiestDay = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => byDay[b].length - byDay[a].length || a - b)[0];

  // No "and" inside these labels - listify() adds its own conjunction and the
  // two together read as nonsense ("ROC and MCA, payroll and labour and income tax").
  const catNames = { it: 'income tax', tds: 'TDS/TCS', gst: 'GST', roc: 'ROC/MCA', pay: 'payroll' };
  const catsPresent = [...new Set(items.map(c => c.cat))]
    .sort((a, b) => items.filter(x => x.cat === b).length - items.filter(x => x.cat === a).length)
    .map(c => catNames[c]);

  return { items, info, byDay, busiestDay, catsPresent };
}

function introHTML(key) {
  const { items, info, byDay, busiestDay, catsPresent } = monthFacts(key);
  const first = items[0], last = items[items.length - 1];
  const busiest = byDay[busiestDay] || [];

  const parts = [];
  parts.push(`<p><strong>${esc(info.name)}</strong> carries <strong>${items.length} statutory due dates</strong> for Indian businesses, spanning ${esc(listify(catsPresent))}. The first falls on the ${ordinal(first.day)} (${esc(first.title)}) and the last on the ${ordinal(last.day)} (${esc(last.title)}).</p>`);

  if (busiest.length > 1) {
    parts.push(`<p>The heaviest date is the <strong>${ordinal(busiestDay)}</strong>, when ${busiest.length} filings fall due together: ${esc(listify(busiest.map(c => c.title)))}. Plan the working papers for these a few days ahead - the portals slow noticeably on peak dates.</p>`);
  }

  const gst = items.filter(c => c.cat === 'gst');
  const roc = items.filter(c => c.cat === 'roc');
  const it = items.filter(c => c.cat === 'it');
  const extra = [];
  if (gst.length) extra.push(`${gst.length} GST ${gst.length === 1 ? 'return' : 'returns'}`);
  if (it.length) extra.push(`${it.length} income tax ${it.length === 1 ? 'item' : 'items'}`);
  if (roc.length) extra.push(`${roc.length} ROC ${roc.length === 1 ? 'filing' : 'filings'}`);
  if (extra.length > 1) {
    parts.push(`<p>In total that is ${esc(listify(extra))}, alongside the recurring TDS deposit and payroll obligations. Dates below are indicative and can shift if CBDT, GSTN, MCA, EPFO or ESIC issue an extension circular.</p>`);
  }

  return parts.join('\n');
}

function faqSchema(key) {
  const { items, info, byDay, busiestDay, catsPresent } = monthFacts(key);
  const qa = [];

  qa.push({
    q: `How many compliance due dates are there in ${info.name}?`,
    a: `There are ${items.length} statutory due dates in ${info.name} for Indian businesses, covering ${listify(catsPresent)}. They run from the ${ordinal(items[0].day)} to the ${ordinal(items[items.length - 1].day)} of the month.`
  });

  const busiest = byDay[busiestDay] || [];
  if (busiest.length) {
    qa.push({
      q: `What is due on ${busiestDay} ${info.name}?`,
      a: `On ${busiestDay} ${info.name}, ${busiest.length === 1 ? 'the following is due' : `${busiest.length} filings are due`}: ` +
         busiest.map(c => `${c.title} (${actLabel(c)}, applicable to ${c.tag})`).join('; ') + '.'
    });
  }

  const gst = items.filter(c => c.cat === 'gst');
  if (gst.length) {
    qa.push({
      q: `What are the GST due dates in ${info.name}?`,
      a: `${info.name} has ${gst.length} GST due ${gst.length === 1 ? 'date' : 'dates'}: ` +
         gst.map(c => `${c.title} on the ${ordinal(c.day)}`).join(', ') + '.'
    });
  }

  const pay = items.filter(c => c.cat === 'pay');
  if (pay.length) {
    qa.push({
      q: `When are PF, ESIC and profession tax due in ${info.name}?`,
      a: pay.map(c => `${c.title} is due on ${c.day} ${info.name} (${c.tag})`).join('. ') +
         '. Profession tax and labour welfare fund dates shown are for Maharashtra; other states differ.'
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(x => ({
      '@type': 'Question',
      name: x.q,
      acceptedAnswer: { '@type': 'Answer', text: x.a }
    }))
  };
}

/* ------------------------------------------------------------------ *
 *  Shell extracted from the main page
 * ------------------------------------------------------------------ */

function readShell(html) {
  const between = (startMark, endMark, from = 0) => {
    const a = html.indexOf(startMark, from);
    if (a === -1) throw new Error(`Shell marker not found: ${startMark}`);
    const b = html.indexOf(endMark, a + startMark.length);
    if (b === -1) throw new Error(`Shell end marker not found after: ${startMark}`);
    return html.slice(a, b + endMark.length);
  };

  // Everything from the CDN preconnect through the Font Awesome noscript: the
  // critical inline CSS, the two stylesheet preloads and the icon font.
  const faNoscript = html.indexOf('<noscript><link rel="stylesheet" href="https://cdnjs');
  const headAssets = html.slice(
    html.indexOf('<link rel="preconnect"'),
    html.indexOf('</noscript>', faNoscript) + '</noscript>'.length
  );

  return {
    headAssets,
    pageCss: between('/* -- Sticky filter bar -- */', '</style>').replace(/^/, '<style>\n'),
    header: between('<a href="#main-content" class="skip-link">', '<main id="main-content">'),
    footer: between('</main>', '<script src="../scripts.min.js')
      .replace(/<script src="\.\.\/scripts\.min\.js$/, '')
  };
}

/* ------------------------------------------------------------------ *
 *  Month page
 * ------------------------------------------------------------------ */

function monthPageHTML(key, shell) {
  const { items, info } = monthFacts(key);
  const idx = monthKeys.indexOf(key);
  const prev = monthKeys[idx - 1];
  const next = monthKeys[idx + 1];

  const title = `${info.name} Compliance Calendar | GST, TDS, PF & ESIC Due Dates`;
  const desc = `All ${items.length} statutory due dates in ${info.name} - GST returns, TDS deposit, PF, ESIC, profession tax and ROC filings, with the forms and who each applies to.`;
  const canonical = urlOf(key);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE}/tools/` },
      { '@type': 'ListItem', position: 3, name: 'Compliance Calendar', item: `${SITE}/tools/compliance-calendar` },
      { '@type': 'ListItem', position: 4, name: info.name, item: canonical }
    ]
  };

  const otherMonths = monthKeys.filter(k => k !== key)
    .map(k => `<a href="compliance-calendar-${slugOf(k)}">${esc(MONTH_INFO[k].name)}</a>`)
    .join('\n    ');

  const prevNext = [
    prev ? `<a class="monthnav-prev" href="compliance-calendar-${slugOf(prev)}"><i class="fa-solid fa-arrow-left"></i> ${esc(MONTH_INFO[prev].name)}</a>` : '<span></span>',
    next ? `<a class="monthnav-next" href="compliance-calendar-${slugOf(next)}">${esc(MONTH_INFO[next].name)} <i class="fa-solid fa-arrow-right"></i></a>` : '<span></span>'
  ].join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(info.name)} Compliance Calendar | KC Shah &amp; Associates">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(info.name)} Compliance Calendar | KC Shah &amp; Associates">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/og-image.jpg">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<link rel="icon" type="image/png" href="../favicon.png">
<link rel="manifest" href="../manifest.webmanifest">
<meta name="theme-color" content="#152A52">
${shell.headAssets}

<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema(key))}</script>
${shell.pageCss}
<style>
.monthnav { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 24px; border-top: 1px solid var(--light-grey); font-size: .85rem; font-weight: 600; }
.monthnav a { color: var(--navy); display: inline-flex; align-items: center; gap: 8px; }
.monthnav a:hover { color: var(--brand-saffron-text); }
.month-intro { padding: 20px 24px 4px; }
.month-intro p { font-size: .93rem; }
.month-other { padding: 4px 24px 24px; }
.month-other h2 { font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 800; color: var(--navy); margin: 0 0 10px; letter-spacing: 0; }
.month-other nav { display: flex; flex-wrap: wrap; gap: 8px; }
.month-other nav a { font-size: .76rem; font-weight: 600; color: var(--navy); background: rgba(248,249,250,.9); border: 1px solid var(--light-grey); border-radius: 50px; padding: 6px 14px; white-space: nowrap; }
.month-other nav a:hover { border-color: var(--navy); background: #fff; }
.month-cta-strip { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin: 0 24px 20px; padding: 14px 18px; background: rgba(217,94,11,.07); border: 1px solid rgba(217,94,11,.25); border-radius: var(--radius-md); }
.month-cta-strip p { margin: 0; font-size: .85rem; color: var(--text-primary); font-weight: 600; }
</style>
</head>
<body>
${shell.header}

<section class="tool-page-header">
<div class="container" style="position:relative;z-index:2">
<div class="breadcrumb"><a href="../index">Home</a><span>-</span><a href="/tools/">Free Tools</a><span>-</span><a href="compliance-calendar">Compliance Calendar</a><span>-</span><span style="color:rgba(255,255,255,.7)">${esc(info.name)}</span></div>
<h1>${esc(info.name)} Compliance Calendar</h1>
<p>Every statutory due date falling in ${esc(info.name)} - GST, TDS, income tax, ROC, PF, ESIC and profession tax - with the form, the period it covers and who it applies to.</p>
<div class="tool-badge-row">
<span class="tool-badge"><i class="fa-regular fa-calendar-check"></i> ${items.length} due dates</span>
<span class="tool-badge"><i class="fa-solid fa-building-columns"></i> FY 2026-27</span>
</div>
</div>
</section>

<div class="tool-container" style="padding-top:0;padding-bottom:40px">
<div class="tool-card" style="padding:0;overflow:visible">

<div class="month-intro">
${introHTML(key)}
</div>

<div class="month-cta-strip">
  <p>Need this as a shareable file? Open the interactive calendar to download ${esc(info.name)} as an image, a PDF, or a calendar file with reminders.</p>
  <a href="compliance-calendar?month=${key}" class="btn btn-primary btn-sm"><i class="fa-solid fa-sliders" style="margin-right:6px"></i>Open interactive calendar</a>
</div>

<!-- Color legend -->
<div class="color-legend">
  <span class="color-legend-item"><span class="color-legend-dot it"></span>Income Tax</span>
  <span class="color-legend-item"><span class="color-legend-dot tds"></span>TDS / TCS</span>
  <span class="color-legend-item"><span class="color-legend-dot gst"></span>GST</span>
  <span class="color-legend-item"><span class="color-legend-dot roc"></span>ROC / MCA</span>
  <span class="color-legend-item"><span class="color-legend-dot pay"></span>PF - ESIC - PT - LWF</span>
</div>

<div class="compliance-body">
${monthSectionHTML(key, items)}
</div>

<div class="monthnav">
    ${prevNext}
</div>

<div class="month-other">
  <h2>Other months in FY 2026-27</h2>
  <nav aria-label="Other months">
    ${otherMonths}
    <a href="compliance-calendar">Full year calendar</a>
  </nav>
</div>

<div style="padding:0 24px 24px">
  <div class="tool-info-box"><i class="fa-solid fa-info-circle"></i><p><strong>Notes:</strong> AOC-4, MGT-7 &amp; ADT-1 dates assume the AGM is held on 30 Sep 2026 (the last permissible date - adjust if your AGM is earlier). PT &amp; LWF deadlines are for <strong>Maharashtra only</strong>; other states differ. Monthly TDS deposit is due the 7th of the following month, except TDS on March deductions which is due 30 April. All dates are indicative and subject to extension circulars by CBDT, GSTN, MCA, EPFO &amp; ESIC.</p></div>
</div>

</div><!-- /tool-card -->
</div><!-- /tool-container -->
${shell.footer}
<script src="../scripts.min.js?v=6" defer></script>
<script src="../tools-shared.min.js?v=6" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ *
 *  Run
 * ------------------------------------------------------------------ */

const START = '<!-- COMPLIANCE-TABLE:START - generated by scripts/build-compliance-calendar.js, do not edit by hand -->';
const END = '<!-- COMPLIANCE-TABLE:END -->';

let mainHtml = fs.readFileSync(MAIN_PAGE, 'utf8');
const shell = readShell(mainHtml);

// 1. Bake the full-year table into the main page.
const fullTable = monthKeys.map(k => monthSectionHTML(k, byMonth(k))).join('\n');
const a = mainHtml.indexOf(START);
const b = mainHtml.indexOf(END);
if (a === -1 || b === -1) {
  console.error('ERROR: COMPLIANCE-TABLE markers not found in tools/compliance-calendar.html.');
  console.error('Add this inside <div id="compliance-body">:\n' + START + '\n' + END);
  process.exit(1);
}
mainHtml = mainHtml.slice(0, a + START.length) + '\n' + fullTable + '\n' + mainHtml.slice(b);
writeCRLF(MAIN_PAGE, mainHtml);
console.log(`Baked ${COMPLIANCES.length} rows across ${monthKeys.length} months into tools/compliance-calendar.html`);

// 2. Write the month pages.
monthKeys.forEach(key => {
  writeCRLF(fileOf(key), monthPageHTML(key, shell));
  console.log(`  wrote tools/compliance-calendar-${slugOf(key)}.html  (${byMonth(key).length} rows)`);
});

// 3. Sitemap lines, for pasting into sitemap.xml.
const today = new Date().toISOString().slice(0, 10);
console.log('\nSitemap entries:\n');
monthKeys.forEach(key => {
  console.log(`  <url><loc>${urlOf(key)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
});
