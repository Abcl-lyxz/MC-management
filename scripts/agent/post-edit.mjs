// PostToolUse (Edit|Write): format + lint the edited file with Biome. Reports problems, never blocks.
import { spawnSync } from 'node:child_process';

try {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  const file = JSON.parse(raw).tool_input?.file_path;
  if (file && /\.(m?js|ts|jsonc?)$/.test(file)) {
    // No shell: the path comes from the agent, so pass it as a plain argument.
    const biome = 'node_modules/@biomejs/biome/bin/biome';
    const r = spawnSync(process.execPath, [biome, 'check', '--write', '--colors=off', file], {
      encoding: 'utf8',
    });
    if (r.status !== 0) {
      const additionalContext = `Biome found problems in ${file}:\n${(r.stdout + r.stderr).slice(-3000)}`;
      process.stdout.write(
        JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }),
      );
    }
  }
} catch (err) {
  process.stderr.write(`post-edit hook error (ignored): ${err.message}\n`);
}
