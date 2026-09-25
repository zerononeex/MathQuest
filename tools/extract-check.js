// Extracts <script> blocks from math-quest.html and runs node --check on each.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const file = path.join(__dirname, '..', 'math-quest.html');
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);

if (scripts.length === 0) {
  console.error('FAIL: no <script> blocks found');
  process.exit(1);
}

let ok = true;
scripts.forEach((code, i) => {
  const tmp = path.join(__dirname, `_check_${i}.js`);
  fs.writeFileSync(tmp, code);
  try {
    execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
    console.log(`OK: script block ${i} (${code.length} chars) syntax valid`);
  } catch (e) {
    ok = false;
    console.error(`FAIL: script block ${i} syntax error:\n${e.stderr.toString()}`);
  } finally {
    fs.unlinkSync(tmp);
  }
});

process.exit(ok ? 0 : 1);
