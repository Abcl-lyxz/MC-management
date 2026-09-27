# MC-management — spec (changes need user approval)

## Problem
Installing modpacks and running a Minecraft server for friends needs shell work. The owner wants to do everything from Discord after a one-time clone + setup on a VPS.

## Users
- Admin: members with the guild's configured admin role (set by the guild owner via /setup).
- Player: every other member of a set-up guild.

## Core journey
1. On the VPS: git clone, copy .env.example → .env, put DISCORD_TOKEN, `docker compose up -d --build`.
2. Invite the bot; guild owner runs /setup admin-role:@Role.
3. Admin chooses loader/version or a Modrinth modpack, creates a world, runs /server start.
4. Friends run /server status to get the address and see who is online.

## v1 scope (all phases)
Lifecycle · logs · RCON console · worlds · loader/version · Modrinth modpacks · Modrinth mods · server.properties · whitelist/op · backups/restore · crash + join/leave notifications · multi-guild (one MC server).

## Out of scope
Web dashboard · CurseForge · Bedrock/Geyser · more than one MC server at a time · payments · hosting for other people.

## Acceptance (v1)
- A fresh Ubuntu VPS with Docker reaches a joinable server using only: clone, edit .env, one compose command, then Discord commands.
- Every feature in the roadmap works from Discord with no SSH.
- Non-admins cannot change anything except /server start and read-only commands.
- The bot survives restarts: settings persist in the data volume.

## Non-functional
- Runs on a small VPS (bot ≤ 150 MB RAM).
- Commands reply within 3 s (defer for long jobs).
- No secrets in git.
- Docker socket access is admin-gated.

## Assumptions (user can revisit)
Java Edition · SQLite via built-in `node:sqlite` · pnpm · Node 24 LTS · bot commands answer only in guilds that ran /setup.
