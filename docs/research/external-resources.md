# External Resources & Ecosystem Tools

Resources discovered during market research that are relevant to ScrimSight's development, data strategy, and competitive positioning.

---

## Data Sources

### luxdotdev/dataset (Parsertime Match Dataset)
- **URL:** https://github.com/luxdotdev/dataset/
- **What:** Anonymized competitive Overwatch 2 match dataset exported from Parsertime's production database.
- **Scale:** ~1,900+ matches, ~92,000+ events across 23 event tables.
- **Format:** PostgreSQL dump (v17.5) or CSV files. Relational schema — not raw ScrimTime `.txt` logs.
- **Privacy:** Player names hashed (e.g., `P_6af4f2c6`), team names hashed, timestamps scrubbed.
- **Potential use for ScrimSight:**
  - Replace current 30-file sample data with a much richer dataset for demos and testing.
  - **Caveat:** The data is pre-parsed into relational tables, not raw log format. Using it would require either:
    - (a) Writing a CSV→ProcessedMatch adapter that maps Parsertime's schema to ScrimSight's domain types, or
    - (b) Reverse-engineering the CSV rows back into ScrimTime-style `.txt` log lines (less practical).
  - The 23 event tables likely map closely to ScrimSight's `MatchEvents` interface (kills, healing, damage, ult events, etc.), so option (a) is probably straightforward.

---

## Ecosystem Tools

### OverFast API
- **URL:** https://github.com/TeKrop/overfast-api
- **What:** Unofficial REST API for Overwatch 2 data — heroes, maps, game modes, and player career profiles.
- **Tech:** FastAPI + Selectolax (HTML scraping) + Valkey caching + nginx.
- **Live instance:** overfast-api.tekrop.fr (rate-limited).
- **Status:** Actively maintained (364 commits, MIT license, 2025 copyright).
- **Relevance to ScrimSight:**
  - Does NOT provide scrim/custom game data (only public career profiles).
  - Could be useful for enriching ScrimSight's hero metadata (abilities, roles, portraits) without hardcoding.
  - Could power a future "player lookup" feature if ScrimSight ever links player battletags to public profiles.
  - Not a competitor — complementary data source for a different layer of information.

### DataStrike (Defunct)
- **Docs URL:** https://github.com/DataStrike/datastrike-docs
- **What:** Was described as "an esport-oriented Overwatch tool" that also parsed ScrimTime logs.
- **Status:** Appears defunct. Site is inaccessible. Repo has 35 commits, 1 star, no releases. Last meaningful activity around early 2024.
- **Maintainers:** ZaT and Rémi Saurel.
- **Relevance:** Mentioned in our market research as a potential competitor. Its apparent abandonment suggests the market is open — but also signals caution about the difficulty of sustaining a niche OW analytics tool without revenue.

---

## Competitive Intelligence Notes

- **Parsertime** (by luxdotdev) is the primary direct competitor. Open source, free, community-driven. The dataset release suggests they have significant real-world usage data. Their weakness per our analysis: no enterprise features (RBAC, org-level views, long-term retention guarantees).
- **Omnic.ai** is the high-end alternative (~$9.99/mo) using computer vision on video. Higher cost, works on console, but lower accuracy for off-screen macro events vs. log-based analysis.
- **Tracker.gg / Overbuff** use Blizzard's public API — cannot see custom game/scrim data. Not direct competitors but validate market interest in stats.
