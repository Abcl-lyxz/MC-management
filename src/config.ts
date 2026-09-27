import { z } from 'zod';

const Env = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required (put it in .env)'),
  LOG_LEVEL: z.string().default('info'),
});

export type Config = z.infer<typeof Env>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return Env.parse(env);
}
