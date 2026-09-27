0004 — Biome, Vitest, lefthook, secretlint, gitleaks in CI · 2026-09-27 · accepted

Context: single-package TS project developed on Windows; want few dependencies and no global installs. · Decision: Biome 2.5.14 (format + lint, `preset: recommended`), Vitest 5.0.2, lefthook 2.1.14 (npm binary), secretlint 13.0.6 locally, gitleaks-action v3.0.0 in CI. Task runner = package.json scripts (no make on Windows). · Consequences: ESLint/Prettier plugins are not available.
