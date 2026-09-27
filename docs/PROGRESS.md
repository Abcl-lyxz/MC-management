# Progress log (newest first, ≤10 lines per entry, never rewrite old entries)

Template:
## YYYY-MM-DD — <slice id> — done | partial | blocked
- CLI / model / effort:
- Did:
- Evidence: <command> → <result>
- Next:
- Gotchas:
- Open questions:

---

## 2026-09-27 — P0 bootstrap — partial
- CLI / model / effort: Claude Code 2.1.283 / claude-opus-5-5 / not pinned (session default)
- Did: bootstrap per docs/archive/bootstrap-plan.md — tooling, /ping skeleton, state files, lefthook, CI, Claude hooks + permissions.
- Evidence: pnpm check → 25 tests pass; CI run 36310157887 check=success; hook payload tests 21/21; headless session answered "pnpm check | P0-S1"; context7 lookup (/discordjs/guide: ephemeral replies use flags: MessageFlags.Ephemeral) → fixed src/index.ts.
- Next: P0-S3 needs the user's real DISCORD_TOKEN (docker compose up + /ping in a guild); P0-S4 needs a green CI run including gitleaks; then P1-S1.
- Gotchas: gitleaks-action fails on the very first push (scans root^ range) — expected to pass on later pushes; heredocs in the Bash tool can eat backslashes; ecc GateGuard asks for facts before each new file (ecc disabled for this project from next session).
- Open questions: switch local Node 25 (EOL) to Node 24?
