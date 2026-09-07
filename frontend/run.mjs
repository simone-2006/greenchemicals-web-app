// Avvia Next.js (dev o start) sulla porta definita in ports.json.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const { frontend } = JSON.parse(readFileSync(join(dir, '../ports.json'), 'utf8'));
const nextBin = join(dir, 'node_modules/next/dist/bin/next');
const command = process.argv[2] === 'start' ? 'start' : 'dev';

const args = [nextBin, command, '-p', String(frontend)];
if (command === 'dev') args.push('--turbopack');

const child = spawn(process.execPath, args, {
  cwd: dir,
  stdio: 'inherit'
});

child.on('exit', (code) => process.exit(code ?? 0));
