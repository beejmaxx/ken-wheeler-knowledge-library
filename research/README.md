# Ken Wheeler research corpus

This directory holds the knowledge layer behind the public reading room. The
goal is to make a scattered collection navigable while preserving provenance,
page references, extraction limits, rights status, and uncertainty.

## Source records

Every locally ingested item gets:

- a stable `source_id` and bibliographic metadata;
- an evidence tier and explicit rights label;
- the SHA-256 checksum of the exact source file;
- page-preserving text and searchable chunks;
- an OCR flag when a PDF has no useful text layer.

Raw local files are not modified. Machine paths and intermediate extraction
artifacts live under ignored `research/derived/` and `research/private/`.

## Evidence tiers

| Tier | Meaning |
|---|---|
| A | Ken Wheeler primary text or author index; primary evidence for what he wrote, not independent verification |
| B | Direct recording, transcript, or contemporaneous context |
| C | Independent scholarly or technical context |
| D | Discovery lead or unverified third-party reference |

The repo must not present a tier-A authored assertion as scientific or
historical consensus merely because it is a primary source.

## Rights states

- `author-shared-free-download`: publicly offered by the author, with no open
  license inferred;
- `all-rights-reserved`: explicit restriction in the source;
- `research-only`: retained as a study or discovery copy;
- `unknown`: no reliable publication permission identified.

## Catalogs

- `catalog/seed-sources.json` defines the ingested corpus and evidence policy.
- `catalog/author-links.json` transcribes the local author index and adds public
  mirrors discovered on the web.
- `private/local-inventory.json` records machine-local paths and duplicate
  groups; it is deliberately ignored.

## Ingestion

```bash
npm run research:ingest -- \
  --file "/path/to/document.pdf" \
  --id stable-source-id \
  --title "Document title" \
  --creator "Ken L. Wheeler" \
  --tier A \
  --rights author-shared-free-download \
  --visibility public
```

Run `npm run research:export` and `npm run research:index` after review. PDF
scans with no usable embedded text stay labeled `needs-ocr` until OCR output is
visually checked against the pages.
