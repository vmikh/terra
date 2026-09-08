import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const rows = JSON.parse(fs.readFileSync('content/narration.json', 'utf8'));
const availability = JSON.parse(
  fs.readFileSync('content/audio-availability.json', 'utf8'),
);
const source = fs
  .readFileSync('app/narration.ts', 'utf8')
  .replace(
    /import recordings from '[^']+';/,
    `const recordings=${JSON.stringify(rows)};`,
  )
  .replace(
    /import availability from '[^']+';/,
    `const availability=${JSON.stringify(availability)};`,
  );
const js = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { chapterIndexAt, audioPath, hasAudio, playbackRates } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
);
assert.equal(rows.length, 15);
assert.equal(new Set(rows.map((r) => r.id)).size, 15);
let seconds = 0,
  count = 0;
for (const [i, row] of rows.entries()) {
  if (i) assert.ok(row.year > rows[i - 1].year);
  assert.equal(chapterIndexAt(row.year), i);
  if (i) assert.equal(chapterIndexAt(row.year - 1), i - 1);
  for (const lang of ['ru', 'en']) {
    assert.ok(row[lang].length > 400);
    assert.ok(hasAudio(row.id, lang), `Missing ${row.id}/${lang}`);
    const file = 'public' + audioPath(row.id, lang);
    const info = execFileSync('afinfo', [file], { encoding: 'utf8' });
    const duration = Number(info.match(/estimated duration:\s+([\d.]+)/)?.[1]);
    assert.ok(duration > 25 && duration < 180, `${file} duration ${duration}`);
    assert.ok(info.includes('44100 Hz'));
    seconds += duration;
    count++;
  }
}
assert.equal(chapterIndexAt(2026), 12);
assert.equal(chapterIndexAt(2027), 13);
assert.equal(chapterIndexAt(7600002026), 14);
assert.ok(
  playbackRates.includes(1) &&
    playbackRates.includes(0.75) &&
    playbackRates.includes(2),
);
const page = fs.readFileSync('app/page.tsx', 'utf8');
assert.ok(
  !page.includes('openYear') &&
    !page.includes('year-input') &&
    !page.includes('THE STORY OF ONE PLANET'),
);
assert.ok(page.includes('NarrationPlayer'));
console.log(
  `Verified ${count} MP3 files, ${Math.round(seconds / 60)} minutes, all chapter boundaries, rates, and removed year input.`,
);
