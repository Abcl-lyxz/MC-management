// Stop: if code changed and check-fast fails, block once so the agent fixes it.
// Loop guard: never blocks when stop_hook_active is true. Errors let the agent stop.
import { execSync, spawnSync } from 'node:child_process';

try {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  const input = JSON.parse(raw);
  if (!input.stop_hook_active) {
    const changed = execSync('git status --porcelain', { encoding: 'utf8' })
      .split('\n')
      .map((l) => l.slice(3).trim())
      .filter((f) => /^(src|tests|scripts)\//.test(f));
    if (changed.length) {
      const r = spawnSync('pnpm', ['check-fast'], { encoding: 'utf8', shell: true });
      if (r.status !== 0) {
        const reason = `pnpm check-fast failed after your changes. Fix it (or ask the user if blocked):\n${(r.stdout + r.stderr).slice(-3000)}`;
        process.stdout.write(JSON.stringify({ decision: 'block', reason }));
      }
    }
  }
} catch (err) {
  process.stderr.write(`stop hook error (ignored): ${err.message}\n`);
}
