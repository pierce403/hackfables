#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const epub = require('epub-gen-memory').default;

const buildDir = path.resolve(__dirname, '..', 'build');
const bookFile = path.resolve(__dirname, '..', 'book', 'book.adoc');
const outFile = path.join(buildDir, 'book.epub');
const cssFile = path.resolve(__dirname, '..', 'ui-overrides', '_', 'css', 'childrens-book.css');
const imagesDir = path.resolve(__dirname, '..', 'modules', 'ROOT', 'assets', 'images');

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';
function absolutizeImageSrc(docHtml) {
  return String(docHtml).replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/gi, (m, pre, src, post) => {
    if (/^(data:|https?:|file:|\/)/i.test(src)) return m;
    const absPath = path.join(imagesDir, src);
    return `<img ${pre}src="${pathToFileURL(absPath).href}"${post}>`;
  });
}
async function main() {
  const { convert } = await import('@asciidoctor/core');
  const html = await convert(fs.readFileSync(bookFile, 'utf8'), { safe: 'safe', backend: 'html5' });
  const option = {
    title: 'Hackfables',
    author: 'Hackfables Contributors',
    css,
  };
  const content = [{ title: 'Hackfables', content: absolutizeImageSrc(html) }];
  fs.writeFileSync(outFile, await epub(option, content));
  console.log(`EPUB generated at ${outFile}`);
}

main().catch((err) => {
  console.error('Failed to generate EPUB:', err);
  process.exit(1);
});
