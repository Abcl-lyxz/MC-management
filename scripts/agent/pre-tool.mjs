// PreToolUse guard: deny secret reads and dangerous commands, ask before touching protected files.
// Fails open: any internal error prints a warning and lets the action through.
import { existsSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';

const PROTECTED = [
  'pnpm-lock.yaml',
  'lefthook.yml',
  'biome.json',
  '.secretlintrc.json',
  '.github/',
  'scripts/agent/',
  '.claude/settings.json',
];
const ACCEPTANCE = 'tests/acceptance/';

const DANGEROUS = [
  [/--dangerously-skip-permissions|bypassPermissions/, 'approval-bypass mode'],
  [
    /\brm\s+(-\w*r\w*f\w*|-\w*f\w*r\w*|-r\s+-f|-f\s+-r)\s+(\/|~|\.|\.\.|\*|[a-z]:[\\/]?)(\s|$)/i,
    'recursive force-delete of a broad path',
  ],
  [
    /Remove-Item\b(?=.*-Recurse)(?=.*-Force).*\s(\/|~|\.|\.\.|\*|[a-z]:\\?)(\s|$)/i,
    'recursive force-delete of a broad path',
  ],
  [/\bgit\s+push\b.*(\s--force(-with-lease)?\b|\s-f\b|\s\+\S)/, 'force-push'],
  [/\bgit\s+commit\b.*(\s--no-verify\b|\s-n\b)/, 'commit that skips hooks'],
  [/\bLEFTHOOK(_EXCLUDE)?\s*=|\$env:LEFTHOOK/i, 'disabling git hooks'],
  [/\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z)?sh\b/, 'piping a download into a shell'],
  [
    /\b(iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\b[^|]*\|\s*iex\b/i,
    'piping a download into iex',
  ],
  [/\b(npm|pnpm|yarn)\s+publish\b/, 'publishing a package'],
  [/\bDROP\s+(TABLE|DATABASE)\b|\bTRUNCATE\s+TABLE\b/i, 'destructive database statement'],
  [/\bDELETE\s+FROM\s+\w+\s*(;|"|'|$)/i, 'DELETE without WHERE'],
];
const SHELL_WRITE =
  /(>>?|\bsed\s+-i\b|\btee\b|\bmv\b|\bcp\b|\brm\b|Set-Content|Add-Content|Out-File|Remove-Item|Move-Item|Copy-Item)/i;
const ENV_IN_SHELL = /(^|[\s"'\\/=])\.env(\.(?!example\b)[\w.-]+)?(?=$|[\s"';|&)])/;

function toRepoPath(filePath, cwd) {
  const p = String(filePath ?? '');
  const rel = isAbsolute(p) || /^[a-z]:[\\/]/i.test(p) ? relative(cwd, p) : p;
  return rel.replaceAll('\\', '/').replace(/^\.\//, '');
}

function isEnvFile(repoPath) {
  const base = repoPath.split('/').pop();
  return /^\.env(\..+)?$/.test(base) && base !== '.env.example';
}

function decide(input) {
  const cwd = input.cwd || process.cwd();
  const tool = input.tool_name;
  const ti = input.tool_input ?? {};

  if (['Read', 'Edit', 'Write', 'NotebookEdit'].includes(tool)) {
    const rel = toRepoPath(ti.file_path ?? ti.notebook_path, cwd);
    if (isEnvFile(rel))
      return ['deny', `Secret file (${rel}). Agents never read or write .env files.`];
    if (tool === 'Read') return null;
    if (PROTECTED.some((p) => rel === p || rel.startsWith(p))) {
      return ['ask', `Protected file (${rel}). Ask the user to approve this change.`];
    }
    if (rel.startsWith(ACCEPTANCE) && existsSync(`${cwd}/${rel}`)) {
      return ['ask', `Approved acceptance test (${rel}). Changing it needs the user.`];
    }
    return null;
  }

  if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String(ti.command ?? '');
    for (const [re, why] of DANGEROUS) {
      if (re.test(cmd))
        return ['deny', `Blocked: ${why}. Ask the user to run it themselves if needed.`];
    }
    if (ENV_IN_SHELL.test(cmd)) return ['deny', 'Blocked: shell access to a .env file.'];
    const touchesProtected = [...PROTECTED, ACCEPTANCE].some((p) => cmd.includes(p));
    if (
      touchesProtected &&
      SHELL_WRITE.test(cmd) &&
      !/^\s*pnpm\s+(add|remove|install|update)\b/.test(cmd)
    ) {
      return ['ask', 'Shell command may modify a protected file. Ask the user to approve.'];
    }
  }
  return null;
}

try {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  const result = decide(JSON.parse(raw));
  if (result) {
    const [permissionDecision, permissionDecisionReason] = result;
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision,
          permissionDecisionReason,
        },
      }),
    );
  }
} catch (err) {
  process.stderr.write(`pre-tool hook error (action allowed): ${err.message}\n`);
}
