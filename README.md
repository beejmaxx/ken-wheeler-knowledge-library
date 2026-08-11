# Ken Wheeler Knowledge Library

A public, GitHub-native text archive of locally collected Ken Wheeler writings,
reading lists, transcripts, and web-discovered source links.

The durable object here is the corpus: readable text, page markers, checksums,
provenance, rights labels, and evidence tiers. There is no website framework,
generated search database, package manager, or hosting configuration.

Start with the [`library` guide](library/README.md), the machine-readable
[`source catalog`](library/catalog.json), and the broader
[`author-links catalog`](research/catalog/author-links.json).

> **Rights and accuracy notice:** “free to download” does not mean public domain
> or openly licensed. Inclusion is not a grant of reuse rights. Scientific,
> historical, religious, health, survival, and other claims in the corpus are
> the authors' claims unless independently supported; the archive does not
> endorse them.

## Contents

- 17 ingested source records and 13 searchable text exports;
- one retained copy from each local SHA-256 duplicate group;
- two complete works found and ingested during web research;
- 30 author-linked or web-discovered documents and mirrors;
- page-preserving text suitable for GitHub search, `rg`, or other research tools;
- metadata-only treatment for one document with an explicit reproduction restriction;
- textual metadata for three image-only PDFs and two local JPG references;
- lightweight extraction, export, and integrity-check scripts with no npm dependencies.

## Layout

```text
library/
  catalog.json         source, extraction, rights, and checksum metadata
  author-works/        extracted Ken Wheeler texts
  reference-lists/     author indexes and recommended reading
  visual-documents/    textual page placeholders for image-only PDFs
  restricted-metadata/ metadata without restricted prose
  research-leads/      transcripts and discovery leads
research/
  catalog/             author links, visual metadata, and evidence policy
  derived/             ignored local extraction output
scripts/
  ingest-source.mjs    page-preserving extraction and hashing
  export-github-library.mjs
                       path-safe text export
tests/
  library.test.mjs     corpus and privacy integrity checks
```

## Read and search

GitHub renders every file and searches the tracked text directly. After cloning,
[`ripgrep`](https://github.com/BurntSushi/ripgrep) provides fast local search:

```bash
rg -n -i 'dielectricity' library/
rg -l -i 'indefinite dyad' library/
```

Page markers such as `===== PAGE 0007 =====` make results traceable to the PDF
page sequence.

## Validate the archive

The checks use only Node.js built-ins:

```bash
node --test tests/library.test.mjs
```

## Add a local source

PDF extraction requires `pdftotext` from Poppler.

```bash
node scripts/ingest-source.mjs \
  --file "/path/to/source.pdf" \
  --id stable-kebab-case-id \
  --title "Source title" \
  --creator "Creator name" \
  --tier A \
  --rights author-shared-free-download \
  --visibility public

node scripts/export-github-library.mjs
node --test tests/library.test.mjs
```

Review rights before publishing an extraction. Collapse duplicates by checksum,
not by filename.
