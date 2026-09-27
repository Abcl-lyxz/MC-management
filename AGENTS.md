# MC-management — agent guide
Discord bot (TypeScript, discord.js) that runs one Minecraft Java server in Docker (itzg/minecraft-server) and is configured entirely from Discord. Spec: docs/SPEC.md · Roadmap: docs/ROADMAP.md · Status: docs/features.json · Log: docs/PROGRESS.md · Tooling facts: docs/TOOLING.md

## Commands
- Setup: `pnpm install` then `pnpm exec lefthook install`
- Check everything (must pass before "done"): `pnpm check`
- Quick check (no tests): `pnpm check-fast`
- Single test: `pnpm vitest run tests/unit/ping.test.ts`
- Auto-fix format/lint: `pnpm fix`
- Validate compose file: `docker compose config`
- Running the bot needs a real `DISCORD_TOKEN` in `.env`; the user does that, never the agent.

## Session protocol
Start
1. Read the latest docs/PROGRESS.md entry and the first passes:false slice in docs/features.json.
2. Run `git status` and the full check. If anything is red, fix that first.
3. Name the slice and its acceptance criteria. One slice per session unless the user says otherwise.

During
- Write the slice's acceptance test first (in tests/acceptance/), then the code. Never edit approved acceptance tests, or delete/skip tests, to get green. If a test looks wrong, ask.
- Stay inside the slice; log unrelated ideas as follow-ups in PROGRESS.
- Before adding a dependency, confirm the exact package exists and is official. Record significant choices as a decision.
- Facts about tools come from docs/TOOLING.md or live sources, never from memory.
- Keep context lean: use subagents for broad research if available; don't paste huge logs.
- If 2 different approaches to the same problem fail (the expected first red test doesn't count): stop, log what you tried, ask or suggest a fresh session.
- If context is nearly full or compaction is near: finish via Definition of Done and continue in a fresh session.

## Definition of Done
- Full check passes; the slice's verify command was run and its output shown.
- No skipped or deleted tests; no TODO hiding required behavior.
- features.json: passes:true only for slices proven this session, with evidence.
- PROGRESS entry added; repeated mistakes or procedures tallied as candidates.
- One commit with the slice id in the message.

## Boundaries
- Always: run `pnpm check` before claiming done; admin-only commands check the guild's admin role; talk to Docker only through src/docker.ts.
- Ask first: new dependencies, changing approved acceptance tests (tests/acceptance/), schema/data migrations, hook/CI/linter config, anything that costs money, pushing to the remote.
- Never: read or print secrets (.env), commit secrets, bypass hooks (--no-verify, LEFTHOOK=0), force-push, delete or skip tests to pass, use approval-bypass modes, deploy or run docker compose up, touch the user's production server.

## Conventions (only what linters can't enforce)
- Bot replies are in English; error replies are ephemeral.
- Minecraft server state is derived from stored settings → container env; never hand-edit the container.

## Tools
- context7 (MCP): use for discord.js / dockerode / Vitest API questions; not for itzg or Modrinth (read their official docs) · proof: the PROGRESS Evidence line names the lookup.

## Where things go
Decisions → docs/decisions/ · Status → docs/features.json · Session notes → docs/PROGRESS.md · Candidates → docs/CANDIDATES.md · Tool facts → docs/TOOLING.md · Phase gate → docs/ROADMAP.md.
If sources disagree: git > features.json > PROGRESS; newest decision > SPEC; repo files > tool memory or chat.

## Growing this file
Only via the candidates list, with user approval. Prefer a lint rule or hook over a new line here.
