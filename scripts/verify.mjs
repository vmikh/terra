import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source = fs.readFileSync('app/epochs.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const m = await import(
  'data:text/javascript;base64,' + Buffer.from(compiled).toString('base64')
);
assert.equal(m.positionToYear(0), m.MIN);
assert.equal(m.positionToYear(100), m.MAX);
assert.equal(m.yearToPosition(m.NOW), 72);
assert.equal(m.epochAt(m.MAX).year, m.MAX);
let previous = m.MIN;
for (let i = 0; i <= 10000; i++) {
  const p = i / 100,
    y = m.positionToYear(p);
  assert.ok(y >= previous, 'Timeline must be monotonic');
  assert.ok(Math.abs(m.positionToYear(m.yearToPosition(y)) - y) <= 1);
  previous = y;
}
for (const y of [
  1760, 1880, 1950, 2000, 2024, 2025, 2026, 2027, 2030, 2050, 2085, 2100,
]) {
  assert.equal(m.positionToYear(m.yearToPosition(y)), y);
  assert.ok(m.populationAt(y) > 0);
}
assert.equal(m.populationAt(2101), null);
assert.equal(m.populationAt(m.MAX), null);
assert.equal(m.populationAt(-66000000), 0);
assert.equal(m.populationAt(-300000), null);
for (const [i, e] of m.epochs.entries()) {
  if (i) assert.ok(e.year > m.epochs[i - 1].year, 'Epoch ordering');
  for (const k of ['title', 'headline', 'body', 'life', 'period']) {
    assert.equal(e[k].length, 2, `${k} translations`);
    assert.ok(e[k].every(Boolean));
  }
  for (const body of e.body)
    assert.ok(body.split(/\s+/).length < 125, 'Reading time');
  for (const s of e.source) assert.ok(m.sources[s], `Missing source ${s}`);
}
for (let i = 0; i < 3; i++) {
  assert.equal(m.warmingAt(2100, i), m.scenarios[i].end);
  assert.ok(m.warmingAt(2050, i) < m.warmingAt(2100, i));
}
for (const age of JSON.parse(fs.readFileSync('app/paleo-ages.json')))
  assert.ok(fs.existsSync(`public/textures/paleo/${age}.jpg`));
for (const file of ['earth.jpg', 'clouds.png', 'lava.jpg', 'future.jpg'])
  assert.ok(fs.existsSync('public/textures/' + file), `Missing ${file}`);
console.log(
  `Verified ${m.epochs.length} bilingual epochs, 10,001 timeline positions, historical and future population boundaries, scenario endpoints and all texture assets.`,
);
