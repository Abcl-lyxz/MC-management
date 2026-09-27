import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import pino from 'pino';
import * as ping from './commands/ping.ts';
import { loadConfig } from './config.ts';

const config = loadConfig();
const log = pino({ level: config.LOG_LEVEL });
const commands = new Map([[ping.data.name, ping]]);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  // ponytail: global registration takes up to an hour to propagate; per-guild if that hurts dev loops.
  await c.application.commands.set([...commands.values()].map((cmd) => cmd.data.toJSON()));
  log.info({ user: c.user.tag, guilds: c.guilds.cache.size }, 'ready');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    log.error({ err, command: interaction.commandName }, 'command failed');
    const msg = { content: 'Something went wrong.', flags: MessageFlags.Ephemeral } as const;
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

await client.login(config.DISCORD_TOKEN);
