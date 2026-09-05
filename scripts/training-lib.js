// Shared helpers for the Zoho Books Academy build scripts. The hub page's sidebar markup is the
// single source of truth for lessons; everything else (schema, module pages) is derived from it.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HUB = path.join(ROOT, 'zoho-books-training.html');
const SITE = 'https://kcshah.com';
const META = require('./training-video-meta.json').videos;

const decode = t => (t || '').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&amp;/g, '&').replace(/&middot;/g, '·').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘').replace(/&quot;/g, '"').replace(/&#8377;/g, '₹').replace(/<[^>]+>/g, '');
const iso = secs => `PT${Math.floor(secs / 3600) ? Math.floor(secs / 3600) + 'H' : ''}${Math.floor(secs % 3600 / 60)}M${secs % 60}S`;
const hms = secs => `${Math.floor(secs / 3600) ? Math.floor(secs / 3600) + ':' : ''}${String(Math.floor(secs % 3600 / 60)).padStart(Math.floor(secs / 3600) ? 2 : 1, '0')}:${String(secs % 60).padStart(2, '0')}`;
const attr = (a, k) => { const r = new RegExp(k + '="([^"]*)"').exec(a); return r ? r[1] : ''; };

function readHub() { return fs.readFileSync(HUB, 'utf8').replace(/\r\n/g, '\n'); }

// Every core lesson from the sidebar, with the crawlable curriculum copy (note, links, reading body).
function lessons(s = readHub()) {
  const out = [];
  const re = /<li class="course-lesson"([^>]*)>([\s\S]*?)<\/li>/g; let m;
  while ((m = re.exec(s))) {
    const a = m[1]; const id = attr(a, 'data-id'); if (!id || id.startsWith('20.')) continue;
    const pills = [...m[2].matchAll(/<span class="lesson-pill ([a-z-]+)">([^<]*)<\/span>/g)].map(p => ({ cls: p[1], text: p[2] }));
    const age = (/<span class="lesson-age[^"]*">([^<]*)<\/span>/.exec(m[2]) || [])[1] || '';
    const vid = attr(a, 'data-vid'); const doc = attr(a, 'data-doc');
    const meta = vid ? META[vid] : null;
    if (vid && !meta) throw new Error(`no metadata for ${id} (${vid}) — add it to scripts/training-video-meta.json`);
    const links = attr(a, 'data-links').split('|').filter(Boolean).map(p => { const i = p.indexOf('::'); return { label: p.slice(0, i), href: p.slice(i + 2) }; });
    const docBody = doc ? ((new RegExp(`<div class="doc-source" id="doc-src-${doc}">([\\s\\S]*?)</div>\\s*<p class="curr-links">`).exec(s) || [])[1] || '') : '';
    out.push({ id, module: +id.split('.')[0], vid, doc, meta, pills, age,
      titleHtml: attr(a, 'data-title').replace(/&/g, '&amp;').replace(/&amp;(mdash|amp|ndash|rsquo);/g, '&$1;'),
      title: decode(attr(a, 'data-title')), notesHtml: attr(a, 'data-notes'), notes: decode(attr(a, 'data-notes')),
      duration: attr(a, 'data-duration'), links, docBody,
      hubUrl: `${SITE}/zoho-books-training#l-${id.replace('.', '-')}` });
  }
  return out;
}

// schema.org parts for one module: VideoObject for videos, LearningResource for KCS reading lessons.
function schemaParts(ls) {
  return ls.map(l => l.vid ? {
    '@type': 'VideoObject', name: l.title, description: l.notes,
    thumbnailUrl: [`https://i.ytimg.com/vi/${l.vid}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${l.vid}/hqdefault.jpg`],
    uploadDate: `${l.meta.published}T00:00:00+05:30`, duration: iso(l.meta.seconds),
    embedUrl: `https://www.youtube-nocookie.com/embed/${l.vid}`, url: l.hubUrl,
    publisher: { '@type': 'Organization', name: 'Zoho Books' }
  } : {
    '@type': 'LearningResource', name: l.title, description: l.notes, learningResourceType: 'Reading', url: l.hubUrl,
    author: { '@type': 'Organization', name: 'KC Shah & Associates' }, inLanguage: 'en-IN'
  });
}

const provider = { '@type': 'Organization', name: 'KC Shah & Associates', sameAs: SITE };

module.exports = { ROOT, HUB, SITE, META, decode, iso, hms, readHub, lessons, schemaParts, provider };
