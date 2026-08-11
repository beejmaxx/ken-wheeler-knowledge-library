# Library guide

This is the tracked, path-safe export of the Ken Wheeler research corpus.

## Counts

- 17 ingested source records;
- 14 documents with usable embedded text;
- 3 image-only PDFs awaiting reviewed OCR;
- 2 visual references;
- 30 author-linked or web-discovered downloads in the broader catalog;
- 7 duplicate local PDF filenames collapsed by SHA-256.

The complete source metadata is in [`catalog.json`](catalog.json). Additional
works that are linked but not yet ingested are listed in
[`../research/catalog/author-links.json`](../research/catalog/author-links.json).

## Directories

- `author-works/`: page-preserving text extracted from Wheeler documents;
- `reference-lists/`: the author’s free-book index and recommended reading;
- `visual-documents/`: page placeholders for image-only PDFs, explicitly marked
  `needs-ocr` in the catalog;
- `research-leads/`: contextual material that cannot verify a claim by itself;
- `visuals/`: two locally supplied JPG references plus descriptive metadata.

## How to read the evidence labels

Tier A means the item is a primary source for Wheeler’s own words. It does not
mean the text’s scientific, historical, medical, religious, or practical claims
have been independently validated. Tier D is a lead only.

Rights labels are equally deliberate. `author-shared-free-download` records the
author’s public-access wording without inferring an open license.

## Extraction notes

Text files retain markers such as `===== PAGE 0007 =====` so search results can
return to a page. Page numbers refer to the PDF page sequence, not necessarily a
printed page number. Empty page sections are retained. Exact source checksums and
original filenames are recorded in `catalog.json`; private machine paths are not.
