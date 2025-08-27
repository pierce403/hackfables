# Hackfables

Short parables for hackers, published as a book-like site via Antora and exportable to HTML, PDF, and EPUB.

## Prerequisites

- Node.js 18+ (or 20+ recommended)

## Install

```bash
npm install
```

## Build

- Site (HTML website via Antora):

```bash
npm run build:site
```

- PDF (build/book.pdf):

```bash
npm run build:pdf
```

- EPUB (build/book.epub):

```bash
npm run build:epub
```

- Clean build artifacts:

```bash
make clean
```

## Preview locally

```bash
make site preview
# open http://localhost:8080
```

## Contributing parables

- Add a new `.adoc` file under `modules/ROOT/pages/`.
- Start with a document title on the first line, e.g. `= The Ship of Theseus`.
- Keep content concise; include a short `== Moral` section.
- Add an entry in `modules/ROOT/nav.adoc`, e.g.

```adoc
* xref:your-parable.adoc[Your Parable Title]
```

- To include in PDF/EPUB, add to `book/book.adoc` with:

```adoc
include::../modules/ROOT/pages/your-parable.adoc[]
```

- Submit a Pull Request. CI will build the site and deploy to GitHub Pages on merge to `main`. The site will be available at https://hackfables.org.

## License

All content and configuration in this repository are licensed under CC0 1.0 Universal (see `LICENSE`).
