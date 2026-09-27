# Tooling facts (verified — re-check when a CLI version changes or something stops working)

Confidence: **tested** = ran it here · **documented** = official docs · **inferred** = reasoned (never used to write config).

## Claude Code 2.1.283 — checked 2026-09-27
Docs base: https://code.claude.com/docs/en/ (pages named below).

| Capability | Available | How it works here | Source | Confidence |
|---|---|---|---|---|
| AGENTS.md | yes (≥2.1.277) but only when no CLAUDE.md exists | `CLAUDE.md` contains `@AGENTS.md` (import; no symlink on Windows) | memory | documented |
| See loaded instructions | yes | `/memory`, `/context` | memory | documented |
| Plan mode | yes | Shift+Tab or `--permission-mode plan` | permission-modes | documented |
| Headless | yes | `claude -p "<q>" --output-format json`; `-p` runs project hooks; `--bare` skips hooks/CLAUDE.md | `claude --help`, headless | tested (help) |
| Hook config | yes | `.claude/settings.json` → `hooks` | hooks | documented |
| Hook blocking | yes | exit 2 blocks (stderr = reason); PreToolUse JSON `hookSpecificOutput.permissionDecision` = deny/ask; other exit codes do not block | hooks | documented |
| Stop loop guard | yes | stdin `stop_hook_active`; max 8 continuations | hooks | documented |
| SessionStart output | yes | stdout added to context (≤10,000 chars) | hooks | documented |
| Hook trust | yes | project hooks run after the folder is trusted interactively | hooks | documented |
| Windows paths | note | `tool_input.file_path` is absolute with backslashes — scripts normalize | hooks | documented |
| Permissions | yes | deny → ask → allow, first match wins; `Bash(pnpm run *)`, `Read(./.env)` | permissions | documented |
| Approval-bypass mode (never use) | exists | `bypassPermissions` / `--dangerously-skip-permissions`; disabled in project settings via `disableBypassPermissionsMode` | `claude --help`, permissions | documented |
| Sandbox | **no** on native Windows | macOS/Linux/WSL2 only | sandboxing | documented |
| MCP | yes | `.mcp.json`, `claude mcp add/list/remove`, `${VAR}` expansion | `claude mcp --help`, mcp | tested (help) |
| Skills / subagents | yes | `.claude/skills/<n>/SKILL.md`, `.claude/agents/*.md` — none in this repo | skills, sub-agents | documented |
| Plugins per project | yes | `enabledPlugins` in `.claude/settings.json` | discover-plugins | documented |
| Auto memory | on | `~/.claude/projects/<p>/memory/`; `autoMemoryEnabled: false` disables per project | memory | documented |
| Model / effort pin | yes | settings `model`, `effortLevel` — not pinned here | settings-reference | documented |
| Auto-commit | no | commits go through `git commit`, so lefthook runs | CHANGELOG | inferred → see Hooks table |
| Context tools | yes | `/context`, `/compact`, `/clear` | commands | documented |

## Stack (npm registry / GitHub / Docker Hub, 2026-09-27)
Node 24.21.0 (image `node:24.21.0-slim`) · pnpm 10.33.2 · TypeScript 7.0.2 · tsx 4.23.15 · discord.js 14.27.0 · dockerode 5.0.1 (+ @types/dockerode 4.0.1; dockerode ships no types) · zod 4.6.5 · pino 10.3.1 · Vitest 5.0.2 · Biome 2.5.14 · lefthook 2.1.14 · secretlint 13.0.6 · itzg/minecraft-server `2026.9.2-java21` · Modrinth API v2 (no key, 300 req/min, User-Agent required).

## Hooks
| Event | Script | Purpose | Blocks? | Tested on |
|---|---|---|---|---|
| SessionStart (startup\|resume\|clear\|compact) | scripts/agent/session-start.mjs | print latest PROGRESS entry, next slice, git status, AGENTS.md Tools | no | 2026-09-27 (tests/unit/agent-hooks.test.ts; headless `claude -p` answered `pnpm check \| P0-S1`) |
| PreToolUse (Read\|Edit\|Write\|NotebookEdit\|Bash\|PowerShell) | scripts/agent/pre-tool.mjs | deny .env access + dangerous commands; ask for protected files | yes (clear match) | 2026-09-27 (18 payload cases in agent-hooks.test.ts; live: blocked a Bash command containing `.env` in this session) |
| PostToolUse (Edit\|Write) | scripts/agent/post-edit.mjs | Biome format/lint of the edited file, reports problems | no | 2026-09-27 (live: reformatted files after edits) |
| Stop | scripts/agent/stop.mjs | block once if src/tests/scripts changed and `pnpm check-fast` fails | once; loop guard `stop_hook_active` | 2026-09-27 (agent-hooks.test.ts loop-guard case) |
| git pre-commit (lefthook) | lefthook.yml | Biome on staged files, secretlint, protected-file warning | yes | 2026-09-27 (lint-error commit blocked; fake AWS key blocked) |
| git pre-push (lefthook) | lefthook.yml | `pnpm check` | yes | 2026-09-27 (ran on first push) |

Permissions (`.claude/settings.json`): deny rule `Read(./.env)` tested 2026-09-27 via headless session (Read was denied). Project hooks load in this session without restart; `enabledPlugins: false` for ecc/claude-mem/supermemory/shipd took effect for shipd immediately, ecc hooks stay active until a new session.

How to disable temporarily: create `.claude/settings.local.json` (gitignored) with `{ "disableAllHooks": true }`, then restart the session. Git hooks: `pnpm exec lefthook uninstall` (reinstall with `pnpm setup`).

## Extensions
| Name | Pinned version / URL | Source | Scope | Trigger | Proof of use | Vetted on |
|---|---|---|---|---|---|---|
| context7 | user-level, `npx -y @upstash/context7-mcp` (unpinned — user-level config) | github.com/upstash/context7 | user | discord.js / dockerode / Vitest API questions | PROGRESS Evidence names the lookup | 2026-09-27 |

## Re-verify when
CLI upgraded · hook/config stops working · phase gate
