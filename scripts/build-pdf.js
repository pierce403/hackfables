#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const asciidoctor = require('@asciidoctor/core')();
const puppeteer = require('puppeteer');

(async () => {
  const buildDir = path.resolve(__dirname, '..', 'build');
  const bookFile = path.resolve(__dirname, '..', 'book', 'book.adoc');
  const outFile = path.join(buildDir, 'book.pdf');
  const cssFile = path.resolve(__dirname, '..', 'ui-overrides', '_', 'css', 'childrens-book.css');
  const imagesDir = path.resolve(__dirname, '..', 'modules', 'ROOT', 'assets', 'images');

  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

  const html = asciidoctor.convert(fs.readFileSync(bookFile, 'utf8'), {
    safe: 'safe',
    backend: 'html5'
  });

  const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';
  function toDataUri(filePath) {
    try {
      const data = fs.readFileSync(filePath);
      const ext = (filePath.split('.').pop() || '').toLowerCase();
      const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', webp: 'image/webp' }[ext] || 'application/octet-stream';
      return `data:${mime};base64,${data.toString('base64')}`;
    } catch (_) {
      return null;
    }
  }
  function inlineImages(docHtml) {
    return String(docHtml).replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi, (m, src) => {
      if (/^(data:|https?:|file:)/i.test(src)) return m;
      const candidate = path.isAbsolute(src) ? src : path.join(imagesDir, src);
      const dataUri = toDataUri(candidate);
      return dataUri ? m.replace(src, dataUri) : m;
    });
  }
  const htmlWithCss = (function injectCssIntoHtml(docHtml, cssText) {
    if (!cssText) return String(docHtml);
    const closingHead = /<\/head>/i;
    if (closingHead.test(docHtml)) {
      return inlineImages(String(docHtml).replace(closingHead, `\n<style>${cssText}</style>\n</head>`));
    }
    // Fallback: wrap in minimal HTML document
    return inlineImages(`<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>${cssText}</style></head><body>${docHtml}</body></html>`);
  })(String(html), css);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(String(htmlWithCss), { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outFile,
    width: '8.5in',
    height: '8.5in',
    printBackground: true,
    margin: {
      top: '0.6in',
      right: '0.6in',
      bottom: '0.6in',
      left: '0.6in'
    }
  });

  await browser.close();
  console.log(`PDF generated at ${outFile}`);
})().catch((err) => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
