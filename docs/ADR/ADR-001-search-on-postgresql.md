# ADR-001: Search on PostgreSQL (No OpenSearch)

**Date:** 2026-11-03  
**Status:** Accepted  
**Deciders:** Ddotsmedia Technologies LLC  

## Context

The original project specification (Section 34, item 7) listed OpenSearch as a locked architectural decision for full-text search. However, running OpenSearch on the UEVIO VPS requires a minimum of 2–4 GB of RAM exclusively for the JVM heap, in addition to operating system and JVM overhead, pushing total memory to 6+ GB just for search — leaving insufficient headroom for the rest of the stack on an 8 GB VPS.

## Decision

Remove OpenSearch entirely. Implement all search functionality using PostgreSQL 16 built-in features:

1. **Full-text search** — `tsvector` columns with GIN indexes for English content
2. **Fuzzy / partial matching** — `pg_trgm` extension with GIN trigram indexes
3. **Geo-proximity search** — PostGIS `ST_DWithin` with GIST spatial indexes
4. **Arabic search** — Application-layer normalisation before indexing (strip diacritics, normalise alef variants, unify ya/alef maqsura), stored in a separate `search_terms` column

### Key indexes

```sql
-- Full-text search (English)
CREATE INDEX idx_businesses_fts ON businesses
  USING GIN(to_tsvector('english', name_en || ' ' || coalesce(description_en, '')));

-- Trigram (fuzzy/partial matching)
CREATE INDEX idx_businesses_trgm ON businesses
  USING GIN(name_en gin_trgm_ops);

-- Arabic search terms (pre-normalised)
CREATE INDEX idx_businesses_search_terms ON businesses
  USING GIN(to_tsvector('simple', coalesce(search_terms, '')));

-- PostGIS location
CREATE INDEX idx_businesses_location ON businesses
  USING GIST(coordinates);
```

## Consequences

**Positive:**
- ~2–3 GB RAM savings on the VPS
- No separate search service to deploy, monitor, or scale
- Simpler deployment (one fewer container)
- PostgreSQL transactions keep search index always consistent
- PostGIS geo-search is more powerful than OpenSearch geo queries for UAE use case

**Negative:**
- No real-time analytics / aggregations (Kibana-style dashboards)
- Full-text ranking less sophisticated than OpenSearch BM25 for very large datasets
- Arabic stemming handled in application layer, not search engine layer

**Mitigation:**
- For Phase 1 (< 50K businesses) PostgreSQL full-text is more than adequate
- If search demands grow beyond PostgreSQL's capacity in Phase 3+, we can add ParadeDB (PostgreSQL extension) which provides BM25 ranking without a separate service

## Supersedes

Original spec Section 34, item 7 ("OpenSearch for search"). That decision is overridden by this ADR.
