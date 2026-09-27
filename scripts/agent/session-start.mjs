// SessionStart: print where the project stands. Never blocks; errors become a warning line.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const out = [];
const section = (title, fn) => {
  try {
    out.push(`## ${title}\n${fn()}`);
  } catch (err) {
    out.push(`## ${title}\n(unavailable: ${err.message})`);
  }
};

section('Latest PROGRESS entry', () => {
  const log = readFileSync('docs/PROGRESS.md', 'utf8').split('\n---\n')[1] ?? '';
  const entry = log.split(/\n(?=## \d{4}-)/).find((s) => s.trim().startsWith('## '));
  return entry?.trim() ?? '(none yet)';
});

section('Next slice (first passes:false)', () => {
  const next = JSON.parse(readFileSync('docs/features.json', 'utf8')).slices.find((s) => !s.passes);
  return next ? `${next.id} — ${next.title}\nverify: ${next.verify}` : 'all slices pass';
});

section(
  'git status --short',
  () => execSync('git status --short', { encoding: 'utf8' }).trim() || 'clean',
);

section('Tools (from AGENTS.md)', () => {
  const agents = readFileSync('AGENTS.md', 'utf8');
  return agents.split('## Tools')[1]?.split('\n## ')[0].trim() ?? '(none)';
});

process.stdout.write(out.join('\n\n').slice(0, 9000));
