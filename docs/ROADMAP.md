# Roadmap

- **Phase 0 — skeleton + guardrails.** Exit: `pnpm check` green locally and in CI; `/ping` answers in a real guild; hooks tested.
- **Phase 1 — lifecycle.** `/setup`, `/server start|stop|restart|status`, `/server logs`, `/console`. Exit: a vanilla server started from Discord and joinable. Slices: docs/features.json (P1-*).
- **Phase 2 — worlds and loaders:** `/world create|list|switch|delete`, `/server type` (loader + version).
- **Phase 3 — Modrinth:** `/modpack search|install` with autocomplete, `/mod add|remove|list`.
- **Phase 4 — admin tools:** `/properties set|get`, `/whitelist`, `/op`, join/leave and crash notifications to a channel.
- **Phase 5 — backups and ops:** itzg/mc-backup, `/backup now|list|restore`, VPS install guide, update flow.

Phases 2–5 are detailed at the phase gate before they start.

## Phase-gate checklist
- Run the full `check` and demo the phase's user-visible result.
- Prune AGENTS.md, adding only the candidate promotions the user approved.
- Move older PROGRESS entries to `docs/archive/`.
- Mark outdated decisions as superseded.
- Move important facts from tool memory into the files.
- Remove extensions that were never used.
- Re-verify `docs/TOOLING.md` if the CLI version changed.
- Detail the next 1–2 phases with the user.
- Re-check extensions marked LATER.
