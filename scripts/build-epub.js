#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const asciidoctor = require('@asciidoctor/core')();
const Epub = require('epub-gen');

const buildDir = path.resolve(__dirname, '..', 'build');
const bookFile = path.resolve(__dirname, '..', 'book', 'book.adoc');
const outFile = path.join(buildDir, 'book.epub');
const cssFile = path.resolve(__dirname, '..', 'ui-overrides', '_', 'css', 'childrens-book.css');
const imagesDir = path.resolve(__dirname, '..', 'modules', 'ROOT', 'assets', 'images');

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

// Convert the aggregated book Asciidoc to HTML
const html = asciidoctor.convert(fs.readFileSync(bookFile, 'utf8'), { safe: 'safe', backend: 'html5' });
const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';
function absolutizeImageSrc(docHtml) {
  return String(docHtml).replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/gi, (m, pre, src, post) => {
    if (/^(data:|https?:|file:|\/)/i.test(src)) return m;
    const absPath = path.join(imagesDir, src);
    return `<img ${pre}src="${absPath}"${post}>`;
  });
}
const htmlInlined = absolutizeImageSrc(html);

const option = {
  title: 'Hackfables',
  author: 'Hackfables Contributors',
  output: outFile,
  css,
  content: [
    { title: 'Hackfables', data: htmlInlined }
  ]
};

new Epub(option).promise.then(() => {
  console.log(`EPUB generated at ${outFile}`);
}).catch((err) => {
  console.error('Failed to generate EPUB:', err);
  process.exit(1);
});
