#!/usr/bin/env node
/**
 * Post-deploy fix for duplicated HTML in webroot.
 *
 * - Duplicates all HTML pages from build/site/hackfables/ into build/site/
 * - Injects <base href="/hackfables/"> into the <head> of the root copies so
 *   relative links (e.g., _images/, preface.html) resolve correctly.
 */
const fs = require('fs');
const path = require('path');

const siteDir = path.resolve(__dirname, '..', 'build', 'site');
const srcDir = path.join(siteDir, 'hackfables');

if (!fs.existsSync(siteDir) || !fs.existsSync(srcDir)) {
  console.error('Expected build/site and build/site/hackfables to exist. Run `make site` first.');
  process.exit(1);
}

const isHtml = (f) => f.toLowerCase().endsWith('.html');

const files = fs.readdirSync(srcDir).filter(isHtml);
let updated = 0;
for (const file of files) {
  const from = path.join(srcDir, file);
  const to = path.join(siteDir, file);
  // Copy page to webroot
  fs.copyFileSync(from, to);
  let html = fs.readFileSync(to, 'utf8');
  // If there is already a base tag for hackfables, skip injection
  if (/\<base[^>]*href=["']\/hackfables\/["'][^>]*\>/i.test(html)) continue;
  // Inject base tag right after <head>
  html = html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}\n  <base href="/hackfables/">`);
  fs.writeFileSync(to, html, 'utf8');
  updated += 1;
}

console.log(`Duplicated ${files.length} pages; injected <base> into ${updated} root copies.`);

