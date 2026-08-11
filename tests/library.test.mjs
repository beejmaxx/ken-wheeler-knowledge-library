import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const libraryRoot = new URL("../library/", import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, root), "utf8"));
}

test("catalogs the unique corpus without machine-local paths", async () => {
  const catalogText = await readFile(new URL("catalog.json", libraryRoot), "utf8");
  const catalog = JSON.parse(catalogText);

  assert.equal(catalog.repository_visibility, "public");
  assert.equal(catalog.summary.sources, 17);
  assert.equal(catalog.summary.non_empty_texts, 13);
  assert.equal(catalog.summary.needs_ocr, 3);
  assert.equal(catalog.summary.metadata_only, 1);
  assert.deepEqual(catalog.summary.categories, {
    "author-works": 10,
    "reference-lists": 2,
    "visual-documents": 3,
    "restricted-metadata": 1,
    "research-leads": 1,
  });
  assert.doesNotMatch(catalogText, /\/Users\/|[A-Z]:\\Users\\/);
});

test("keeps one page-preserving text record for every ingested source", async () => {
  const catalog = await readJson("library/catalog.json");

  for (const source of catalog.sources) {
    const textUrl = new URL(source.text_file, libraryRoot);
    await access(textUrl);
    const text = await readFile(textUrl, "utf8");
    const pageMarkers = text.match(/^===== PAGE \d{4} =====$/gm) ?? [];

    assert.equal(pageMarkers.length, source.pages, source.source_id);
    assert.match(source.original.sha256, /^[a-f0-9]{64}$/, source.source_id);
  }
});

test("keeps visual references as text metadata without binary files", async () => {
  const visualText = await readFile(new URL("research/catalog/visual-references.json", root), "utf8");
  const visualCatalog = JSON.parse(visualText);

  assert.equal(visualCatalog.items.length, 2);
  assert.ok(visualCatalog.items.every((item) => /^[a-f0-9]{64}$/.test(item.sha256)));
  assert.doesNotMatch(visualText, /\/Users\/|[A-Z]:\\Users\\/);
  await assert.rejects(access(new URL("library/visuals/antenna.jpg", root)));
  await assert.rejects(access(new URL("library/visuals/authority.jpg", root)));
});

test("does not republish prose carrying an explicit reproduction restriction", async () => {
  const catalog = await readJson("library/catalog.json");
  const source = catalog.sources.find((item) => item.source_id === "secret-of-water");
  const text = await readFile(new URL(source.text_file, libraryRoot), "utf8");

  assert.equal(source.extraction_status, "metadata-only");
  assert.equal(source.category, "restricted-metadata");
  assert.doesNotMatch(text, /harmonic proportionality|basis of all life/i);
  assert.equal((text.match(/^===== PAGE \d{4} =====$/gm) ?? []).length, source.pages);
});

test("records the author index and web discoveries as external links", async () => {
  const linksText = await readFile(new URL("research/catalog/author-links.json", root), "utf8");
  const links = JSON.parse(linksText);

  assert.equal(links.items.length, 30);
  assert.ok(links.items.some((item) => item.title.includes("Indefinite Dyad") && item.mirrors?.length >= 2 && item.local_source_id));
  assert.ok(links.items.some((item) => item.local_source_id === "monistic-metaphysics-of-the-sakya-disciples"));
  assert.doesNotMatch(linksText, /\/Users\/|[A-Z]:\\Users\\/);
});

test("retains directly searchable corpus text", async () => {
  const magnetism = await readFile(new URL("author-works/uncovering-secrets-of-magnetism-third-edition.txt", libraryRoot), "utf8");
  const monistic = await readFile(new URL("author-works/monistic-metaphysics-of-the-sakya-disciples.txt", libraryRoot), "utf8");

  assert.match(magnetism, /dielectricity/i);
  assert.match(monistic, /monistic metaphysics/i);
});
