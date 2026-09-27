// Validates docs/features.json: parses, unique slice ids, passes:true needs evidence.
import { readFileSync } from 'node:fs';

const errors = [];
let data;
try {
  data = JSON.parse(readFileSync('docs/features.json', 'utf8'));
} catch (e) {
  console.error(`features.json: ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(data.slices)) errors.push('slices must be an array');
const seen = new Set();
for (const s of data.slices ?? []) {
  if (!s.id) errors.push('slice without id');
  else if (seen.has(s.id)) errors.push(`duplicate id ${s.id}`);
  seen.add(s.id);
  if (typeof s.passes !== 'boolean') errors.push(`${s.id}: passes must be boolean`);
  if (s.passes === true && !String(s.evidence ?? '').trim())
    errors.push(`${s.id}: passes:true without evidence`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`features.json ok (${seen.size} slices)`);
