"use client";

import { useEffect, useMemo, useState } from "react";

type Source = {
  source_id: string;
  title: string;
  creator: string;
  evidence_tier: string;
  pages: number;
  chunks: number;
  needs_ocr: boolean;
};

type Chunk = { chunk_id: string; source_id: string; page: number; text: string };
type ResearchIndex = { built_at: string; sources: Source[]; chunks: Chunk[] };

const concepts = [
  { id: "aether ether", title: "Aether and field theory", idea: "Trace Wheeler’s underlying medium and compare his definitions with standard field theory.", level: "Start here" },
  { id: "magnetism magnetic", title: "Magnetism", idea: "Follow the geometric and dielectric account developed across the magnetism and definitions texts.", level: "Core idea" },
  { id: "dielectricity dielectric", title: "Dielectricity", idea: "Map how the corpus distinguishes dielectric and magnetic field modalities.", level: "Core idea" },
  { id: "energy inertia", title: "Energy and inertia", idea: "Compare the short Energy paper with the later unification treatment.", level: "Physics claims" },
  { id: "water molecule", title: "Water and harmonic geometry", idea: "Read the proportionality argument while keeping rights and evidence status visible.", level: "Geometry" },
  { id: "monism dyad", title: "Monism and the indefinite dyad", idea: "Connect the metaphysical vocabulary used in the Greek and Buddhist writings.", level: "Metaphysics" },
  { id: "anatta atman", title: "Original Buddhism and anatta", idea: "Study Wheeler’s translations and doctrinal claims as one authored interpretation.", level: "Buddhism" },
  { id: "theurgy liberation", title: "Theurgy and liberation", idea: "Follow the practical and philosophical contrast drawn between theurgy and meditation.", level: "Practice" },
];

function excerpt(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  const positions = terms.map((term) => lower.indexOf(term)).filter((position) => position >= 0);
  const startAt = positions.length ? Math.max(0, Math.min(...positions) - 150) : 0;
  const value = text.slice(startAt, startAt + 520).trim();
  return `${startAt > 0 ? "…" : ""}${value}${startAt + 520 < text.length ? "…" : ""}`;
}

export default function Home() {
  const [data, setData] = useState<ResearchIndex | null>(null);
  const [query, setQuery] = useState("");
  const [activeSource, setActiveSource] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/research-index.json")
      .then((response) => response.json())
      .then((index: ResearchIndex) => setData(index))
      .finally(() => setLoading(false));
  }, []);

  const sourceMap = useMemo(() => new Map(data?.sources.map((source) => [source.source_id, source]) ?? []), [data]);
  const terms = useMemo(
    () => query.toLowerCase().trim().split(/\s+/).filter((term) => term.length > 1),
    [query],
  );
  const results = useMemo(() => {
    if (!data || !terms.length) return [];
    return data.chunks
      .filter((chunk) => activeSource === "all" || chunk.source_id === activeSource)
      .map((chunk) => {
        const haystack = chunk.text.toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.split(term).length - 1), 0);
        return { ...chunk, score };
      })
      .filter((chunk) => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }, [activeSource, data, terms]);

  const chooseConcept = (id: string) => {
    setQuery(id.split(" ")[0]);
    setActiveSource("all");
    requestAnimationFrame(() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main className="study-shell">
      <header className="topbar">
        <a href="#top" className="brand"><span className="brand-dot" /> Wheeler Study</a>
        <div className="corpus-count">{data ? `${data.sources.length} sources · ${data.chunks.length.toLocaleString()} passages` : "Loading library…"}</div>
          <div className="local-badge"><span /> Public archive</div>
      </header>

      <div className="workspace" id="top">
        <aside className="sidebar">
          <div className="side-label">Study</div>
          <nav>
            <a className="selected" href="#start">Start here</a>
            <a href="#concepts">Concepts</a>
            <a href="#search">Search library</a>
            <a href="#sources">Sources</a>
          </nav>
          <div className="side-label second">Principle</div>
          <p className="side-note">Read Wheeler’s claims in their own terms, then compare them with independent historical and scientific sources.</p>
        </aside>

        <section className="content">
          <div className="intro" id="start">
            <div className="kicker">A PERSONAL KNOWLEDGE BASE</div>
            <h1>Read the corpus.<br />Test the claims.</h1>
            <p>This public reading room organizes locally collected Ken Wheeler documents, an author-supplied book index, and carefully labeled web discoveries. Search the texts together without confusing an author’s assertion with independent verification.</p>
            <button onClick={() => chooseConcept("aether ether")} className="start-button">Begin with the aether <span>→</span></button>
          </div>

          <section className="how-it-works">
            <div className="section-title"><span>How to use this</span></div>
            <div className="steps">
              <div><b>1</b><h3>Choose a concept</h3><p>Start with a recurring term rather than a filename.</p></div>
              <div><b>2</b><h3>Read across the corpus</h3><p>Compare the wording across books, articles, diagrams, and transcripts.</p></div>
              <div><b>3</b><h3>Check the evidence</h3><p>Use source tiers to separate primary claims, interpretation, and outside verification.</p></div>
            </div>
          </section>

          <section className="concept-section" id="concepts">
            <div className="section-heading">
              <div><div className="kicker">LEARNING MAP</div><h2>Core concepts</h2></div>
              <p>These will become full explanations as the library is worked through.</p>
            </div>
            <div className="concept-list">
              {concepts.map((concept, index) => (
                <button key={concept.id} onClick={() => chooseConcept(concept.id)} className="concept-row">
                  <span className="concept-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="concept-main"><b>{concept.title}</b><small>{concept.idea}</small></span>
                  <span className="concept-level">{concept.level}</span>
                  <span className="concept-arrow">→</span>
                </button>
              ))}
            </div>
          </section>

          <section className="search-section" id="search">
            <div className="section-heading compact">
              <div><div className="kicker">FULL-TEXT SEARCH</div><h2>Search your library</h2></div>
              <p>Searches every usable text extraction while preserving source and page.</p>
            </div>
            <div className="search-controls">
              <label className="search-input"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘dielectricity’ or ‘indefinite dyad’" /></label>
              <select value={activeSource} onChange={(event) => setActiveSource(event.target.value)} aria-label="Limit search to one source">
                <option value="all">All sources</option>
                {data?.sources.map((source) => <option value={source.source_id} key={source.source_id}>{source.title}</option>)}
              </select>
            </div>

            <div className="search-meta">
              {loading ? "Preparing the library…" : terms.length ? `${results.length}${results.length === 40 ? "+" : ""} matching passages` : "Enter a term or choose a concept above"}
            </div>
            <div className="results">
              {results.map((result) => {
                const source = sourceMap.get(result.source_id);
                return (
                  <article className="result" key={result.chunk_id}>
                    <div className="result-meta"><span>{source?.title ?? result.source_id}</span><span>{source?.pages === 1 ? "Digital text" : `Page ${result.page}`}</span></div>
                    <p>{excerpt(result.text, terms)}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="source-section" id="sources">
            <div className="section-heading compact">
              <div><div className="kicker">INGESTED MATERIAL</div><h2>What is here</h2></div>
              <p>Exact duplicates are collapsed. Image-only scans are labeled for OCR rather than presented as complete text.</p>
            </div>
            <div className="source-table">
              {data?.sources.map((source) => (
                <button key={source.source_id} onClick={() => { setActiveSource(source.source_id); setQuery(""); document.getElementById("search")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <span className="tier">{source.evidence_tier}</span>
                  <span className="source-name"><b>{source.title}</b><small>{source.creator}</small></span>
                  <span>{source.pages === 1 ? `${source.chunks} sections` : `${source.pages} pages`}</span>
                  <span>Search →</span>
                </button>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
