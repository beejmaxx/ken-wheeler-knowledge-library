import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  assert.equal(catalog.summary.non_empty_texts, 14);
  assert.equal(catalog.summary.needs_ocr, 3);
  assert.deepEqual(catalog.summary.categories, {
    "author-works": 11,
    "reference-lists": 2,
    "visual-documents": 3,
    "research-leads": 1,
  });
  assert.doesNotMatch(catalogText, /\/Users\/|[A-Z]:\\Users\\/);
});

test("keeps one page-preserving text export for every ingested source", async () => {
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

test("preserves the two supplied visuals with verified checksums", async () => {
  const visualCatalog = await readJson("library/visuals/catalog.json");
  assert.equal(visualCatalog.items.length, 2);

  for (const item of visualCatalog.items) {
    const bytes = await readFile(new URL(`visuals/${item.filename}`, libraryRoot));
    const digest = createHash("sha256").update(bytes).digest("hex");
    assert.equal(digest, item.sha256, item.filename);
  }
});

test("records the author index and web discoveries as external links", async () => {
  const linksText = await readFile(new URL("research/catalog/author-links.json", root), "utf8");
  const links = JSON.parse(linksText);

  assert.equal(links.items.length, 30);
  assert.ok(links.items.some((item) => item.title.includes("Indefinite Dyad") && item.mirrors?.length >= 2 && item.local_source_id));
  assert.ok(links.items.some((item) => item.local_source_id === "monistic-metaphysics-of-the-sakya-disciples"));
  assert.doesNotMatch(linksText, /\/Users\/|[A-Z]:\\Users\\/);
});

test("builds a complete searchable index from the tracked archive", async () => {
  const catalog = await readJson("library/catalog.json");
  const index = await readJson("public/data/research-index.json");
  const indexedChunks = index.sources.reduce((sum, source) => sum + source.chunks, 0);

  assert.equal(index.sources.length, catalog.summary.sources);
  assert.equal(index.chunks.length, indexedChunks);
  assert.ok(index.chunks.some((chunk) => /dielectricity/i.test(chunk.text)));
  assert.ok(index.chunks.some((chunk) => /monistic metaphysics/i.test(chunk.text)));
});

test("server-renders the Wheeler reading room", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Wheeler Study — Open Knowledge Library/);
  assert.match(html, /Read the corpus/);
  assert.match(html, /Search your library/);
});
