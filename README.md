# MC-management

A Discord bot that runs a Minecraft Java server in Docker and lets you manage it entirely from Discord: start/stop, worlds, loaders, Modrinth modpacks and mods, server properties, whitelist, backups.

Status: Phase 0 (walking skeleton: `/ping`). See [docs/ROADMAP.md](docs/ROADMAP.md).

## Quickstart (VPS, Ubuntu + Docker)

1. Create a Discord application at https://discord.com/developers/applications → **Bot** → copy the token.
2. Invite it: OAuth2 → URL Generator → scopes `bot` and `applications.commands` → open the URL.
3. On the VPS:
   ```sh
   git clone https://github.com/Abcl-lyxz/MC-management.git
   cd MC-management
   cp .env.example .env   # then put your token in DISCORD_TOKEN
   docker compose up -d --build
   ```
4. In Discord: `/ping` → `pong · docker: ok`.

Security: the bot mounts the Docker socket, which is root-equivalent on the VPS. Keep the token secret.

## Development (Windows/macOS/Linux)

Needs Node 24 LTS (`.nvmrc`), pnpm and Docker.

```sh
pnpm install
pnpm exec lefthook install
pnpm check         # format, lint, typecheck, tests, status validation, secret scan
pnpm dev           # runs the bot with .env (needs a real token)
```

## Working with AI agents

- **Start a session:** "Follow the session protocol in AGENTS.md and work on the next slice."
- **End a session:** "Wrap up using the Definition of Done in AGENTS.md."
- **Phase gate:** "Run the phase gate checklist in the roadmap for phase N."
- **If the agent seems to get worse,** check in this order:
  1. Start a fresh session; long sessions degrade.
  2. Check the model and reasoning-effort settings, and compare them with recent PROGRESS entries.
  3. Check context usage and which instruction files are loaded.
  4. Split the slice smaller.
  5. Check whether AGENTS.md has bloated.
  6. If the CLI was upgraded, re-verify `docs/TOOLING.md`.
- **Temporarily disable the agent hooks:** see `docs/TOOLING.md`.
