#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const asciidoctor = require('@asciidoctor/core')();
const puppeteer = require('puppeteer');

(async () => {
  const buildDir = path.resolve(__dirname, '..', 'build');
  const bookFile = path.resolve(__dirname, '..', 'book', 'book.adoc');
  const outFile = path.join(buildDir, 'book.pdf');

  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

  const html = asciidoctor.convert(fs.readFileSync(bookFile, 'utf8'), {
    safe: 'safe',
    backend: 'html5'
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setContent(String(html), { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '16mm',
      bottom: '20mm',
      left: '16mm'
    }
  });

  await browser.close();
  console.log(`PDF generated at ${outFile}`);
})().catch((err) => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
