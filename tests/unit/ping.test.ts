import { describe, expect, it } from 'vitest';
import { pingReply } from '../../src/commands/ping.ts';
import { loadConfig } from '../../src/config.ts';

describe('pingReply', () => {
  it('reports docker ok when ping resolves', async () => {
    expect(await pingReply(async () => 'OK')).toBe('pong · docker: ok');
  });

  it('reports docker down when ping rejects', async () => {
    expect(
      await pingReply(async () => {
        throw new Error('no socket');
      }),
    ).toBe('pong · docker: down');
  });
});

describe('loadConfig', () => {
  it('rejects a missing token', () => {
    expect(() => loadConfig({})).toThrow(/DISCORD_TOKEN/);
  });
});
