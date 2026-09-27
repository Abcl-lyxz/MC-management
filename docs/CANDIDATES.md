# Candidates

## Growth rule
- **Rule candidate.** The same mistake happened twice or more. At the next phase gate, propose a fix: preferably a lint rule or a hook, otherwise one AGENTS.md line.
- **Skill candidate.** The same multi-step procedure was explained or done three or more times. Create it eval-first:
  1. Record how the agent does without the skill on 3 realistic test prompts.
  2. Write the minimum skill: project-specific facts, commands and gotchas, plus a validator script if possible; mandatory steps kept separate from optional notes; a body of about 100 lines or fewer; a clear third-person description of what it does and when to use it.
  3. Re-run the 3 prompts.
  4. Keep the skill only if it's clearly better. Otherwise delete it.
  The user approves before the skill is added.
- **Subagent candidate.** A recurring, well-bounded task that clutters the main context. Same approval flow.
- **MCP candidate.** A real, repeated need that plain CLI tools don't cover. Run the vetting checklist.

## Tally
| Candidate | Type | Count | Notes |
|---|---|---|---|
| CurseForge support | feature | 0 | needs an API key; out of scope for v1 |
| discord.js command skill | skill | 0 | only if adding commands repeats with mistakes |
| testcontainers | tooling | 0 | if integration tests outgrow plain dockerode |
| Disable more user-level plugins for this project | config | 0 | if context pressure shows |
| Per-guild command registration in dev | tooling | 0 | global commands can take time to appear |
| ecc GateGuard blocks every new file during setup | config | 1 | user-level hook; consider disabling ecc for this project |
