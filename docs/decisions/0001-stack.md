0001 — TypeScript + discord.js on Node 24 LTS, pnpm · 2026-09-27 · accepted

Context: user chose TS + discord.js (most-used Discord library). Node 25 on the dev machine is EOL per the nodejs.org schedule. · Decision: Node 24 LTS (image `node:24.21.0-slim`), TypeScript 7.0.2 (`tsc --noEmit` verified), run TS directly with tsx as a runtime dependency (no build step), exact-pinned dependencies. · Consequences: Node 26 becomes LTS on 2026-10-28, so revisit at a phase gate. The dev machine should move to Node 24.
