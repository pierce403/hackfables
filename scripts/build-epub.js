#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const asciidoctor = require('@asciidoctor/core')();
const Epub = require('epub-gen');

const buildDir = path.resolve(__dirname, '..', 'build');
const bookFile = path.resolve(__dirname, '..', 'book', 'book.adoc');
const outFile = path.join(buildDir, 'book.epub');

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

// Convert the aggregated book Asciidoc to HTML
const html = asciidoctor.convert(fs.readFileSync(bookFile, 'utf8'), { safe: 'safe', backend: 'html5' });

const option = {
  title: 'Hackfables',
  author: 'Hackfables Contributors',
  output: outFile,
  content: [
    { title: 'Hackfables', data: html }
  ]
};

new Epub(option).promise.then(() => {
  console.log(`EPUB generated at ${outFile}`);
}).catch((err) => {
  console.error('Failed to generate EPUB:', err);
  process.exit(1);
});
