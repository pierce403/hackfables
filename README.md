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

## Deployment paths (important)

The live site is served with a duplicated `hackfables/` directory at the webroot to provide cleaner public URLs.

- Live page URLs look like:
  - `https://hackfables.org/hackfables/hamster-ferret-firesheep.html`
  - Images are emitted at: `https://hackfables.org/hackfables/_images/...`

- Authoring rules in this repo:
  - Use module‑relative image refs in AsciiDoc, e.g. `image::my-image.png[]` in `modules/ROOT/pages/...`. Antora will publish these under `_images/` for the page.
  - Don’t hardcode leading slashes (`/`) for images or page links in `.adoc` files. Let Antora generate relative paths.
  - In UI templates, prefer links relative to `{{siteRootPath}}hackfables/` for top‑nav items so they resolve on the duplicated path in production.

If you add new UI assets (CSS/JS) via `ui-overrides`, ensure they are available under `ui-overrides/css` (not just `ui-overrides/_/css`) so the production bundle can load them.

### Root HTML duplication and `<base>` injection

For nicer URLs, the GitHub Pages runner duplicates the HTML pages under `build/site/hackfables/` into the webroot. A post-build script injects `<base href="/hackfables/">` into the root copies so relative assets (like `_images/`) resolve correctly.

- Local build does this automatically now via:

```bash
npm run build:site
# runs Antora then scripts/post-deploy-fix.js
```

- If you maintain your own CI, run `node scripts/post-deploy-fix.js` after generating the site.

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
