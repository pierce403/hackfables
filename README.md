# Hackfables

Short parables for software engineers, published as a book-like site via Antora and exportable to HTML, PDF, and EPUB.

## Prerequisites

- Node.js 18+ (or 20+ recommended)
- Ruby 3.x with Bundler

## Install

```bash
npm install
bundle install
```

## Build

- Site (HTML website via Antora):

```bash
npm run build:site
```

- PDF (book/book.pdf):

```bash
make pdf
```

- EPUB (book/book.epub):

```bash
make epub
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

- Submit a Pull Request. CI will build the site and deploy to GitHub Pages on merge to `main`.

## License

Content is licensed under [CC BY-SA 4.0](LICENSE). Code/config is MIT unless noted otherwise.
