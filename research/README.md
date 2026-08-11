# Research data

This directory contains the textual provenance and regeneration layer for the
Ken Wheeler corpus. It keeps source discovery separate from the readable exports
under `../library/`.

## Catalogs

- `catalog/seed-sources.json`: ingested corpus, evidence tiers, topics, and rights;
- `catalog/author-links.json`: the local author index plus public mirrors found
  during web research;
- `catalog/visual-references.json`: descriptions and checksums for two excluded
  local JPGs;
- `private/local-inventory.json`: ignored machine-local paths and duplicate groups.

## Evidence tiers

| Tier | Meaning |
|---|---|
| A | Ken Wheeler primary text or author index; evidence for what he wrote, not independent verification |
| B | Direct recording, transcript, or contemporaneous context |
| C | Independent scholarly or technical context |
| D | Discovery lead or unverified third-party reference |

## Rights states

- `author-shared-free-download`: publicly offered by the author; no open license inferred;
- `all-rights-reserved`: prose is not republished in the tracked library;
- `research-only`: retained as study or discovery metadata;
- `unknown`: no reliable publication permission identified.

## Local regeneration

`scripts/ingest-source.mjs` creates ignored manifests, page records, and search
chunks under `research/derived/`. `scripts/export-github-library.mjs` creates the
path-safe text archive. Review its output and rights labels before committing.
