/* Cache-buster bump for the shared stylesheet.
   Run:  node scripts/bump-css-version.js <from> <to>
   e.g.  node scripts/bump-css-version.js 15 16

   Rewrites style.min.css?v=<from> to ?v=<to> across every live HTML page.
   Skips Local_Preview (stale mirror) and other non-deployed directories.

   Note: ?v= is a cache key, not a version selector. There is one style.min.css on
   the server, so a page still on the old ?v= receives the same updated file - it
   just may serve a cached copy to returning visitors until the bump reaches it.
   A page left un-bumped is stale-for-returning-visitors, never broken. */

const fs = require('fs');
const path = require('path');

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error('Usage: node scripts/bump-css-version.js <from> <to>   e.g. 15 16');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['Local_Preview', '_archive_unused', 'node_modules', '.git',
  'matrix-generator', 'Blogs', 'gmb-post-images', 'gmb-post-images-10', 'scripts']);

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP.has(e.name) && !e.name.startsWith('.')) walk(path.join(dir, e.name));
    } else if (e.name.endsWith('.html')) {
      files.push(path.join(dir, e.name));
    }
  }
})(ROOT);

const needle = `style.min.css?v=${from}`;
const replacement = `style.min.css?v=${to}`;

let changed = 0, refs = 0;
files.forEach(f => {
  const s = fs.readFileSync(f, 'utf8');
  if (!s.includes(needle)) return;
  refs += (s.split(needle).length - 1);
  fs.writeFileSync(f, s.split(needle).join(replacement), 'utf8');
  changed++;
});

console.log(`Bumped ${refs} references across ${changed} files (v=${from} -> v=${to}).`);
const left = files.filter(f => fs.readFileSync(f, 'utf8').includes(needle)).length;
if (left) console.log(`${left} files still on v=${from}.`);
