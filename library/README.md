# Library guide

This directory is the tracked, path-safe text export of the Ken Wheeler corpus.

## Counts

- 17 ingested source records;
- 13 public searchable text exports;
- 3 image-only PDFs represented by page placeholders and `needs-ocr` metadata;
- 1 all-rights-reserved document retained as metadata and page markers only;
- 30 author-linked or web-discovered downloads in the broader catalog;
- 7 duplicate local PDF filenames collapsed by SHA-256.

The complete source metadata is in [`catalog.json`](catalog.json). Additional
works that are linked but not yet ingested are in
[`../research/catalog/author-links.json`](../research/catalog/author-links.json).
The two locally supplied JPGs are not republished; their descriptions and
checksums are in
[`../research/catalog/visual-references.json`](../research/catalog/visual-references.json).

## Directories

- `author-works/`: page-preserving text extracted from Wheeler documents;
- `reference-lists/`: the author’s free-book index and recommended reading;
- `visual-documents/`: textual page placeholders for image-only PDFs;
- `restricted-metadata/`: page markers without prose where reproduction is
  explicitly restricted;
- `research-leads/`: contextual material that cannot verify a claim by itself.

## Evidence and rights

Tier A means an item is a primary source for Wheeler’s own words. It does not
mean its scientific, historical, medical, religious, or practical claims have
been independently validated. Tier D is a discovery lead only.

`author-shared-free-download` records the author's public-access wording without
inferring an open license. Original PDFs and JPGs are intentionally not stored
in this text-first repository.

## Extraction notes

Text files retain markers such as `===== PAGE 0007 =====`. Page numbers refer to
the PDF page sequence, not necessarily a printed page number. Empty page sections
are preserved. Exact source checksums and original filenames appear in
`catalog.json`; private machine paths do not.
