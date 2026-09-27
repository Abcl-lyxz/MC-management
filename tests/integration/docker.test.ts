import { expect, it } from 'vitest';
import { pingReply } from '../../src/commands/ping.ts';

// Needs a running Docker daemon (local Docker Desktop or the CI runner).
it('reaches the real Docker daemon', async () => {
  expect(await pingReply()).toBe('pong · docker: ok');
});
