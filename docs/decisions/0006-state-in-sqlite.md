0006 — Bot settings in SQLite via node:sqlite · 2026-09-27 · accepted

Context: need persistent per-guild and MC server settings; `node:sqlite` is release-candidate in Node 24 and needs no native build (verified it loads). · Decision: store settings in `data/bot.db` inside the `./data` volume. · Consequences: if the `node:sqlite` API changes, swap to better-sqlite3.
