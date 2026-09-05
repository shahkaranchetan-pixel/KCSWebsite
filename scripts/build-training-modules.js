// Generates one standalone page per Zoho Books Academy module from the hub page's lesson markup
// and the module copy in scripts/training-modules.js, wires the hub to them, and keeps
// sitemap.xml in step.
//
//   node scripts/build-training-modules.js
//
// Page chrome (head, nav, footer, GA4) is lifted from blog-tcs-sale-of-goods-zoho-books.html so
// the module pages stay byte-identical to the rest of the site in everything but their content.
const fs = require('fs');
const path = require('path');
const lib = require('./training-lib.js');
const MODULES = require('./training-modules.js');

const AUDITED = '5 September 2026';
const TEMPLATE = path.join(lib.ROOT, 'blog-tcs-sale-of-goods-zoho-books.html');
const tpl = fs.readFileSync(TEMPLATE, 'utf8').replace(/\r\n/g, '\n');
const slice = (re, label) => { const m = re.exec(tpl); if (!m) throw new Error('template: ' + label); return m[0]; };
const sharedHead = slice(/<link rel="icon"[\s\S]*?(?=<script type="application\/ld\+json">)/, 'shared head');
const ga = slice(/<script async src="https:\/\/www\.googletagmanager\.com[^\n]*\n<script>[^\n]*gtag[^\n]*<\/script>/, 'ga4');
const nav = slice(/<body>[\s\S]*?<main id="main-content">/, 'nav');
const footer = slice(/<\/main>[\s\S]*$/, 'footer');
// The footer script wires .share-linkedin / .share-whatsapp / .share-twitter, so every page
// that carries the footer must also carry the share bar.
const shareBar = slice(/    <div class="share-bar">[\s\S]*?\n    <\/div>\n/, 'share bar');

let hub = lib.readHub();
const all = lib.lessons(hub);
const blurbs = {}; [...hub.matchAll(/<h3 id="module-(\d+)">[^<]*<\/h3>\s*<p class="curr-blurb">([\s\S]*?)<\/p>/g)].forEach(m => blurbs[+m[1]] = m[2]);

const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const jsonld = o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;

const css = `<style>
  .mod-hero{background:linear-gradient(135deg,var(--brand-blue-deep) 0%,var(--brand-blue) 60%,var(--brand-blue-light) 100%);color:#fff;border-radius:var(--radius-md);padding:32px 34px;margin:0 0 28px}
  .mod-hero .kicker{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--brand-saffron);margin-bottom:10px}
  .mod-hero h1{color:#fff;font-size:clamp(1.6rem,3.2vw,2.3rem);margin:0 0 14px}
  .mod-hero .chips{display:flex;flex-wrap:wrap;gap:8px;font-size:.74rem}
  .mod-hero .chips span{background:rgba(255,255,255,.14);padding:4px 12px;border-radius:50px}
  .direct-answer{font-size:1.05rem;font-weight:500;color:var(--brand-blue-deep);background:var(--off-white);border-left:4px solid var(--brand-saffron);padding:16px 20px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin:0 0 24px}
  .key-takeaways{background:var(--off-white);border-radius:var(--radius-md);padding:22px 26px;margin:0 0 36px}
  .key-takeaways h3{font-size:1.05rem;margin:0 0 12px;color:var(--brand-blue-deep)}
  .key-takeaways ul{list-style:none;padding:0;margin:0}
  .key-takeaways li{position:relative;padding-left:22px;margin-bottom:8px;font-size:.93rem;color:var(--text-body)}
  .key-takeaways li::before{content:"\\203A";position:absolute;left:6px;top:-1px;color:var(--brand-saffron);font-weight:700}
  .mod-lesson{border:1px solid var(--light-grey);border-radius:var(--radius-md);padding:22px 24px;margin:0 0 22px;scroll-margin-top:90px}
  .mod-lesson h3{font-size:1.15rem;margin:0 0 12px;display:flex;flex-wrap:wrap;align-items:center;gap:8px}
  .mod-lesson .dur{font-size:.78rem;font-weight:500;color:var(--text-grey);margin-left:auto}
  .lesson-pill{font-size:.62rem;font-weight:700;letter-spacing:.6px;padding:2px 8px;border-radius:50px;text-transform:uppercase}
  .pill-new{background:#dcfce7;color:#15803d}.pill-kcs{background:#e0e7ff;color:#3730a3}.pill-optional{background:#fef3c7;color:#92400e}.pill-clip{background:#f1f5f9;color:#475569}.pill-start{background:#ffedd5;color:#9a3412}
  .lite-yt{position:relative;aspect-ratio:16/9;background:#000 center/cover no-repeat;border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;margin:0 0 14px}
  .lite-yt img{width:100%;height:100%;object-fit:cover;display:block;opacity:.92}
  .lite-yt button{position:absolute;inset:0;margin:auto;width:72px;height:50px;border:0;border-radius:12px;background:rgba(217,94,11,.95);cursor:pointer}
  .lite-yt button::after{content:"";position:absolute;left:29px;top:15px;border-style:solid;border-width:10px 0 10px 18px;border-color:transparent transparent transparent #fff}
  .lite-yt:hover button{background:var(--brand-saffron-text)}
  .lite-yt iframe,.mod-lesson iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:var(--radius-sm);margin:0 0 14px}
  .mod-lesson .note{font-size:.95rem;margin:0 0 10px}
  .mod-lesson .links{font-size:.86rem;color:var(--text-grey);margin:0}
  .mod-lesson .doc-source{background:var(--off-white);border-radius:var(--radius-sm);padding:6px 20px;margin:0 0 14px;font-size:.95rem}
  .mod-lesson .doc-source h3{font-size:1.02rem;margin:18px 0 8px;display:block}
  .mod-lesson .doc-source p,.mod-lesson .doc-source li{font-size:.93rem}
  .mod-lesson .doc-source ol,.mod-lesson .doc-source ul{padding-left:22px;margin:0 0 12px}
  .mod-lesson .doc-source ul{list-style:disc}
  .mod-nav{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:36px 0 8px}
  .mod-nav a{display:block;border:1px solid var(--light-grey);border-radius:var(--radius-sm);padding:12px 16px;font-size:.9rem;font-weight:600;color:var(--brand-blue-deep)}
  .mod-nav a span{display:block;font-size:.72rem;font-weight:500;color:var(--text-grey);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
  .mod-nav a.next{text-align:right}
  .deadline-table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:0.92rem}
  .deadline-table th{background:var(--brand-blue-deep);color:white;padding:12px 14px;text-align:left;font-size:0.85rem;letter-spacing:0.4px}
  .deadline-table td{padding:11px 14px;border-bottom:1px solid var(--light-grey);vertical-align:top}
  .deadline-table tr:nth-child(even) td{background:var(--off-white)}
  .table-note{font-size:0.82rem;color:var(--text-grey);margin:0 0 28px}
  .blog-content ol:not(.curr-lessons){padding-left:22px;margin:0 0 20px}
  .blog-content ol li{margin-bottom:10px}
  .faq-section{margin:40px 0 8px}
  .cta-box{background:var(--off-white);border-radius:var(--radius-md);padding:28px 30px;margin:40px 0 8px;text-align:center}
  @media (max-width:640px){.mod-hero{padding:24px 20px}.mod-nav{grid-template-columns:1fr}.mod-nav a.next{text-align:left}}
</style>`;

const script = `<script>
(function(){
  document.querySelectorAll('.lite-yt').forEach(function(el){
    el.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+el.dataset.vid+'?rel=0&autoplay=1';
      f.title='Video: '+el.dataset.title;
      f.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen=true;
      el.replaceWith(f);
      if(typeof gtag==='function') gtag('event','lesson_start',{lesson_id:el.dataset.id,module:el.dataset.id.split('.')[0],lesson_type:'video',surface:'module_page'});
    });
  });
})();
</script>`;

function lessonCard(l) {
  const pills = l.pills.map(p => ` <span class="lesson-pill ${p.cls}">${p.text}</span>`).join('');
  const dur = l.vid ? lib.hms(l.meta.seconds) : 'Reading lesson';
  const media = l.vid
    ? `<div class="lite-yt" data-vid="${l.vid}" data-id="${l.id}" data-title="${esc(l.title)}" role="button" tabindex="0" aria-label="Play ${esc(l.title)}"><img loading="lazy" src="https://i.ytimg.com/vi/${l.vid}/hqdefault.jpg" width="480" height="360" alt="${esc(l.title)} — Zoho Books video lesson"><button type="button" aria-label="Play video"></button></div>`
    : `<div class="doc-source">${l.docBody.trim()}</div>`;
  const internal = l.links.filter(x => !/^https?:/.test(x.href)).map(x => `<a href="${x.href}">${x.label}</a>`);
  const external = l.links.filter(x => /^https?:/.test(x.href)).map(x => `<a href="${x.href}" target="_blank" rel="noopener noreferrer">${x.label}</a>`);
  const links = [...internal, ...external, `<a href="/zoho-books-training#l-${l.id.replace('.', '-')}">Open in the Academy player</a>`].join(' &middot; ');
  return `      <article class="mod-lesson" id="l-${l.id.replace('.', '-')}">
        <h3>${l.titleHtml}${pills}<span class="dur">${dur}${l.age ? ' &middot; ' + l.age : ''}</span></h3>
        ${media}
        <p class="note">${l.notesHtml}</p>
        <p class="links">Related: ${links}</p>
      </article>`;
}

function page(mod, i) {
  const own = all.filter(l => l.module === mod.n);
  const secs = own.filter(l => l.vid).reduce((a, l) => a + l.meta.seconds, 0);
  const hours = secs >= 3600 ? `${Math.floor(secs / 3600)}h ${Math.round(secs % 3600 / 60)}m` : `${Math.round(secs / 60)} min`;
  const url = `${lib.SITE}/${mod.slug}`;
  const prev = MODULES[i - 1], next = MODULES[i + 1];
  const titleTxt = lib.decode(mod.title);

  const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${mod.pageTitle}</title>
<meta name="description" content="${esc(mod.metaDescription)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(`Module ${mod.n}: ${titleTxt} — Zoho Books Training (India) | KC Shah & Associates`)}">
<meta property="og:description" content="${esc(mod.metaDescription)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://kcshah.com/og-image.jpg">
<meta property="og:image:width" content="1024">
<meta property="og:image:height" content="1024">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(`Module ${mod.n}: ${titleTxt} — Zoho Books Training`)}">
<meta name="twitter:description" content="${esc(mod.metaDescription)}">
<meta name="twitter:image" content="https://kcshah.com/og-image.jpg">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
${sharedHead}${jsonld({ '@context': 'https://schema.org', '@type': 'Course', '@id': url + '#course', name: `Module ${mod.n}: ${titleTxt}`, description: mod.metaDescription, url, provider: lib.provider, isAccessibleForFree: true, inLanguage: 'en-IN', isPartOf: { '@type': 'Course', '@id': `${lib.SITE}/zoho-books-training#course`, name: 'Zoho Books Training Course — India Edition', url: `${lib.SITE}/zoho-books-training` }, hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: lib.iso(secs) }, hasPart: lib.schemaParts(own) })}

${jsonld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: mod.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}

${jsonld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: lib.SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Zoho Books Training', item: lib.SITE + '/zoho-books-training' }, { '@type': 'ListItem', position: 3, name: `Module ${mod.n}: ${titleTxt}`, item: url }] })}

${css}
${ga}
</head>
${nav}

<div style="background:var(--off-white);padding:10px 0;border-bottom:1px solid var(--light-grey)"><div class="container"><div class="breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/zoho-books-training">Zoho Books Training</a> <span>/</span> <span>Module ${mod.n}</span></div></div></div>

<section class="section" style="padding-top:32px">
  <div class="container blog-content" style="max-width:900px;margin:0 auto">

    <div class="mod-hero">
      <span class="kicker">Zoho Books Academy &middot; Module ${mod.n} of ${MODULES.length}</span>
      <h1>${mod.title}</h1>
      <div class="chips"><span>${own.length} lessons</span><span>${hours} of video</span><span>India edition</span><span>Free</span><span>Audited ${AUDITED}</span></div>
    </div>

    <p class="direct-answer">${blurbs[mod.n]}</p>

${mod.intro.map(p => `    <p>${p}</p>`).join('\n')}

    <aside class="key-takeaways">
      <h3><i class="fa-solid fa-list-check"></i> After this module you can</h3>
      <ul>
${mod.outcomes.map(o => `        <li>${o}</li>`).join('\n')}
      </ul>
    </aside>

${mod.extra ? '    ' + mod.extra + '\n' : ''}
    <h2 id="lessons">The ${own.length} lesson${own.length === 1 ? '' : 's'}</h2>
    <p style="font-size:.9rem;color:var(--text-grey)">Every video is an official Zoho Books upload, embedded from YouTube and verified live on ${AUDITED}. Lessons marked <span class="lesson-pill pill-kcs">KCS NOTE</span> are written by us. Progress is tracked in the <a href="/zoho-books-training">Academy player</a>; use the link under each lesson to open it there.</p>

${own.map(lessonCard).join('\n')}

    <section class="faq-section">
      <h2 id="faq">Frequently asked questions</h2>
${mod.faqs.map(([q, a]) => `      <div class="faq-item"><div class="faq-question">${q} <i class="fa-solid fa-chevron-down"></i></div><div class="faq-answer"><p>${a}</p></div></div>`).join('\n')}
    </section>

${shareBar.replace('Share this article:', 'Share this module:')}
    <nav class="mod-nav" aria-label="Module navigation">
      ${prev ? `<a href="/${prev.slug}"><span>Previous</span>Module ${prev.n}: ${prev.title}</a>` : `<a href="/zoho-books-training"><span>Back to</span>Course overview</a>`}
      ${next ? `<a class="next" href="/${next.slug}"><span>Next</span>Module ${next.n}: ${next.title}</a>` : `<a class="next" href="/zoho-books-training#module-20"><span>Next</span>Accounting Fundamentals for Freshers</a>`}
    </nav>

    <div class="cta-box">
      <h3 style="color:var(--brand-blue-deep);margin-bottom:10px">Want this set up for you rather than by you?</h3>
      <p style="margin-bottom:18px">We implement Zoho Books for SMEs and run the books on it afterwards. If your team is working through this module because something is not reconciling, that is usually a configuration problem we can fix in a day. See <a href="/zoho-books-implementation">Zoho Books implementation</a> or <a href="/outsourced-accounting-services">outsourced accounting</a>.</p>
      <a href="/contact" class="btn btn-primary">Talk to us</a>
    </div>

    <div style="text-align:center;margin-top:36px">
      <a href="/zoho-books-training" class="btn btn-outline"><i class="fa-solid fa-arrow-left" style="margin-right:8px"></i> All 13 modules</a>
    </div>

  </div>
</section>
${script}
${footer}`;
  return head;
}

// ---------- write module pages ----------
MODULES.forEach((mod, i) => {
  fs.writeFileSync(path.join(lib.ROOT, mod.slug + '.html'), page(mod, i), 'utf8');
});

// ---------- wire the hub: module-page strip under the header + link on each curriculum H3 ----------
const strip = `<!-- module-pages:start (generated by scripts/build-training-modules.js) -->
<nav class="module-pages" aria-label="Module pages"><div class="container"><span class="module-pages-label">Module pages:</span>${MODULES.map(m => `<a href="/${m.slug}">${m.n}. ${m.title}</a>`).join('')}</div></nav>
<!-- module-pages:end -->`;
const stripRe = /<!-- module-pages:start[\s\S]*?<!-- module-pages:end -->/;
if (stripRe.test(hub)) hub = hub.replace(stripRe, strip);
else {
  const anchor = /(<div class="page-header"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\n)/;
  if (!anchor.test(hub)) throw new Error('hub: page-header anchor not found');
  hub = hub.replace(anchor, `$1${strip}\n`);
  hub = hub.replace('.pill-start { background: #ffedd5; color: #9a3412; }',
    '.pill-start { background: #ffedd5; color: #9a3412; }\n.module-pages{background:var(--off-white);border-bottom:1px solid var(--light-grey);font-size:.78rem}\n.module-pages .container{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding-top:8px;padding-bottom:8px}\n.module-pages-label{font-weight:700;color:var(--brand-blue-deep);margin-right:4px}\n.module-pages a{background:#fff;border:1px solid var(--light-grey);border-radius:50px;padding:3px 10px;color:var(--brand-blue-deep);white-space:nowrap}\n.module-pages a:hover{border-color:var(--brand-saffron)}\n.curr-modlink{font-size:.8rem;font-weight:600;color:var(--brand-saffron-text);margin-left:12px;white-space:nowrap}');
}
MODULES.forEach(m => {
  const re = new RegExp(`(<h3 id="module-${m.n}">[^<]*)(?:<a class="curr-modlink"[^<]*</a>)?</h3>`);
  if (!re.test(hub)) throw new Error('hub: curriculum h3 for module ' + m.n);
  hub = hub.replace(re, `$1<a class="curr-modlink" href="/${m.slug}">Module page &rarr;</a></h3>`);
});
fs.writeFileSync(lib.HUB, hub.replace(/\n/g, '\r\n'), 'utf8');

// ---------- sitemap ----------
const SM = path.join(lib.ROOT, 'sitemap.xml');
let sm = fs.readFileSync(SM, 'utf8');
const today = new Date().toISOString().slice(0, 10);
MODULES.forEach(m => {
  const loc = `${lib.SITE}/${m.slug}`;
  const entry = `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
  const existing = new RegExp(`  <url><loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[^\\n]*`);
  if (existing.test(sm)) sm = sm.replace(existing, entry);
  else sm = sm.replace(/(  <url><loc>https:\/\/kcshah\.com\/zoho-books-training<\/loc>[^\n]*\n)/, `$1${entry}\n`);
});
fs.writeFileSync(SM, sm, 'utf8');

console.log(`module pages: ${MODULES.length} written; hub wired; sitemap has ${(sm.match(/<url>/g) || []).length} urls`);
