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
| (filled in during bootstrap step 10) | | | | |

How to disable temporarily: create `.claude/settings.local.json` (gitignored) with `{ "disableAllHooks": true }`, then restart the session. Git hooks: `pnpm exec lefthook uninstall` (reinstall with `pnpm setup`).

## Extensions
| Name | Pinned version / URL | Source | Scope | Trigger | Proof of use | Vetted on |
|---|---|---|---|---|---|---|
| context7 | user-level, `npx -y @upstash/context7-mcp` (unpinned — user-level config) | github.com/upstash/context7 | user | discord.js / dockerode / Vitest API questions | PROGRESS Evidence names the lookup | 2026-09-27 |

## Re-verify when
CLI upgraded · hook/config stops working · phase gate
