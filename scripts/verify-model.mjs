import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const url = (source) =>
  'data:text/javascript;base64,' +
  Buffer.from(
    ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ES2022,
      },
    }).outputText,
  ).toString('base64');
const epochUrl = url(fs.readFileSync('app/epochs.ts', 'utf8'));
const load = (path) =>
  import(
    url(
      fs
        .readFileSync(path, 'utf8')
        .replace(
          /import ages from '.\/paleo-ages.json';/,
          `const ages=${fs.readFileSync('app/paleo-ages.json', 'utf8')};`,
        )
        .replace(/from '.\/epochs'/g, `from '${epochUrl}'`),
    )
  );
const { MIN, MAX, NOW, epochs } = await import(epochUrl);
const { surfaceAt, surfaceFrames, yearAtSurfacePosition } = await load(
  'app/planet-model.ts',
);
const { estimatedAt } = await load('app/estimates.ts');
const { lightsAt, historicLights } = await load('app/night-lights.ts');
assert.equal(surfaceFrames[0].year, MIN);
assert.equal(surfaceFrames.at(-1).year, MAX);
const weights = (s) => {
  const out = {};
  out[s.from.key] = (out[s.from.key] ?? 0) + 1 - s.mix;
  out[s.to.key] = (out[s.to.key] ?? 0) + s.mix;
  return out;
};
for (let i = 0; i < surfaceFrames.length; i++) {
  const f = surfaceFrames[i];
  if (i) assert.ok(f.year > surfaceFrames[i - 1].year);
  assert.ok(fs.existsSync(`public/textures/hq/${f.key}.jpg`));
  if (i && f.key !== surfaceFrames[i - 1].key)
    assert.ok(
      fs.existsSync(
        `public/textures/motion/${surfaceFrames[i - 1].key}_${f.key}.png`,
      ),
    );
  assert.equal(yearAtSurfacePosition(surfaceAt(f.year).position), f.year);
  assert.ok(fs.existsSync(`public/textures/surface/${f.key}-field.png`));
  if (i && i < surfaceFrames.length - 1) {
    const a = weights(surfaceAt(f.year - 0.01)),
      b = weights(surfaceAt(f.year + 0.01));
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
      assert.ok(
        Math.abs((a[key] ?? 0) - (b[key] ?? 0)) < 0.0001,
        'Coastline weights must be continuous at boundaries',
      );
  }
}
for (const y of [
  ...epochs.map((e) => e.year),
  MIN,
  MAX,
  2101,
  2200,
  10000,
  1002026,
  600000000,
  1200002026,
  2200002026,
]) {
  const s = surfaceAt(y),
    e = estimatedAt(y);
  assert.ok(s.from.key && !s.from.key.startsWith('solid'));
  assert.ok(s.mix >= 0 && s.mix <= 1);
  for (const key of ['heat', 'dry', 'ice', 'electric', 'ancient', 'barren'])
    assert.ok(s[key] >= 0 && s[key] <= 1, key);
  for (const key of ['temperature', 'oxygen', 'ocean', 'population', 'co2'])
    assert.ok(Number.isFinite(e[key]), `${key} missing for ${y}`);
  assert.ok(e.ocean >= 0 && e.ocean <= 100);
  assert.ok(e.oxygen >= 0 && e.oxygen <= 100);
  assert.ok(e.population >= 0);
}
assert.equal(surfaceAt(NOW).modern, 1);
assert.equal(surfaceAt(NOW).heat, 0);
assert.equal(surfaceAt(NOW).dry, 0);
assert.equal(surfaceAt(NOW).ice, 0);
assert.equal(surfaceAt(MIN).heat, 1);
assert.equal(surfaceAt(MAX).heat, 1);
assert.equal(surfaceAt(-1000000).electric, 0);
assert.equal(surfaceAt(-1000000).ancient, 0);
assert.equal(surfaceAt(-100000).ancient, 0);
assert.equal(surfaceAt(1950).electric, 0);
for (const y of [-300000, 0, 1760, 1800, 1878, 1881]) {
  assert.equal(lightsAt(y).modern, 0);
  assert.ok(lightsAt(y).cities.every((v) => v === 0));
}
assert.equal(lightsAt(1886).cities[2], 0);
assert.ok(lightsAt(1900).cities[2] > 0);
assert.equal(lightsAt(2015).modern, 0);
assert.equal(lightsAt(2026).modern, 1);
assert.equal(lightsAt(2300).modern, 0);
assert.ok(lightsAt(2300).cities.every((v) => v === 0));
assert.equal(historicLights[2].start, 1887);
assert.ok(surfaceAt(NOW).electric > surfaceAt(1950).electric);
assert.equal(estimatedAt(2101).inferredPopulation, true);
assert.equal(estimatedAt(NOW).inferredPopulation, false);
console.log(
  `Verified ${surfaceFrames.length} dated surface frames, continuous frame boundaries, preserved modern styling, light chronology, and nonempty estimates across every epoch.`,
);
const { moonAt } = await load('app/moon-model.ts');
assert.equal(moonAt(MIN).visible, false);
assert.equal(moonAt(-4500000000).visible, true);
assert.equal(moonAt(-4500000000).molten, 1);
assert.equal(moonAt(-4400000000).molten, 0);
assert.equal(moonAt(-4300000000).maria, 0);
assert.equal(moonAt(NOW).maria, 1);
assert.equal(moonAt(NOW).solarHeat, 0);
assert.equal(moonAt(MAX).visible, false);
assert.equal(moonAt(NOW).endVisibility, 1);
assert.equal(moonAt(MAX).endVisibility, 0);
assert.ok(
  moonAt(MAX - 50000000).endVisibility > 0 &&
    moonAt(MAX - 50000000).endVisibility < 1,
);
for (let year = MIN; year < MAX; year += 1000000) {
  const moon = moonAt(year);
  for (const k of ['formation', 'molten', 'craters', 'maria', 'solarHeat']) {
    assert.ok(moon[k] >= 0 && moon[k] <= 1);
    assert.ok(Math.abs(moonAt(year + 1)[k] - moon[k]) < 0.00001);
  }
}
assert.ok(fs.existsSync('public/textures/hq/moon.jpg'));
console.log(
  'Verified lunar formation, cooling, maria chronology, continuous visual parameters, and final disappearance.',
);
