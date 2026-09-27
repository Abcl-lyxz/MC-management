import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { dockerPing } from '../docker.ts';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check that the bot and Docker are alive');

export async function pingReply(ping: () => Promise<unknown> = dockerPing): Promise<string> {
  try {
    await ping();
    return 'pong · docker: ok';
  } catch {
    return 'pong · docker: down';
  }
}

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply(await pingReply());
}
