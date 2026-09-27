// Prints a warning (never blocks) when staged files touch protected paths.
const protectedPrefixes = [
  'tests/acceptance/',
  'lefthook.yml',
  'biome.json',
  '.secretlintrc.json',
  '.github/',
  '.claude/',
  'scripts/agent/',
];
const hits = process.argv
  .slice(2)
  .map((f) => f.replaceAll('\\', '/'))
  .filter((f) => protectedPrefixes.some((p) => f.startsWith(p)));
if (hits.length) {
  console.warn(`WARNING: protected files changed (needs user approval):\n  ${hits.join('\n  ')}`);
}
