# Ken Wheeler Knowledge Library

A public, searchable research archive of locally collected Ken Wheeler texts,
visual documents, reading lists, and web-discovered source links.

The repository is designed for close reading. It preserves page markers and
checksums, collapses exact duplicates, labels image-only PDFs for OCR, and keeps
Wheeler's authored claims distinct from independent verification.

Start with [`library/README.md`](library/README.md), the machine-readable
[`library/catalog.json`](library/catalog.json), and the broader
[`research/catalog/author-links.json`](research/catalog/author-links.json).

> **Rights and accuracy notice:** “free to download” does not mean public domain
> or openly licensed. Every source retains a rights label; inclusion is not a
> grant of reuse rights. Physics, historical, religious, health, survival, and
> other claims in the corpus are the authors' claims unless independently
> supported. The archive does not endorse them.

## What is included

- one record per unique local PDF, with duplicate filenames documented;
- two complete additional works found and ingested during web research;
- an author-linked catalog of further books and public mirrors;
- page-preserving text exports for full-text search;
- metadata-only records for material carrying an explicit reproduction restriction;
- three visual PDFs marked `needs-ocr` rather than treated as complete text;
- two locally collected image references with checksums;
- one locally saved video transcript that points to a Ken Wheeler interview;
- a small reading-room app generated entirely from the tracked archive.

## Layout

```text
library/
  catalog.json        source, extraction, rights, and checksum metadata
  author-works/       extracted Ken Wheeler texts
  reference-lists/    author indexes and reading lists
  visual-documents/   placeholder exports for image-only PDFs
  research-leads/     transcripts and other discovery leads
  visuals/            locally collected image references
research/
  catalog/            source map, author links, and evidence policy
  derived/            ignored local ingest output with private paths
scripts/
  ingest-source.mjs   page-preserving extraction and hashing
  export-github-library.mjs
                      path-safe repository export
  build-research-index.mjs
                      browser search-index builder
```

## Run the reading room

Node.js 22.13 or newer is required.

```bash
npm ci
npm run dev
```

## Add a source

```bash
npm run research:ingest -- \
  --file "/path/to/source.pdf" \
  --id stable-kebab-case-id \
  --title "Source title" \
  --creator "Creator name" \
  --tier A \
  --rights author-shared-free-download \
  --visibility public

npm run research:export
npm run research:index
```

Review the rights label before publishing any newly extracted text. A checksum
match should be used to collapse duplicates without relying on filenames.
