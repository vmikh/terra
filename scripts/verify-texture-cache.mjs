import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = ts.transpileModule(
  fs.readFileSync('app/texture-cache.ts', 'utf8'),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  },
).outputText;
const { TextureCache } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
);
const originalFetch = globalThis.fetch;
const calls = new Map();
let active = 0,
  peak = 0,
  fail = false;
globalThis.fetch = async (path, { signal }) => {
  calls.set(path, (calls.get(path) || 0) + 1);
  active++;
  peak = Math.max(peak, active);
  await new Promise((resolve) => setTimeout(resolve, 2));
  active--;
  if (signal.aborted) throw new Error('aborted');
  return new Response('texture', {
    status: path === '/bad' && fail ? 503 : 200,
  });
};
try {
  const reports = [];
  const manifest = ['/modern', '/proto', '/lava', '/past', '/future'];
  const cache = new TextureCache(manifest, (...p) => reports.push(p));
  const first = cache.get('/modern');
  assert.equal(
    cache.get('/modern'),
    first,
    'Concurrent foreground loads must deduplicate',
  );
  await first;
  assert.deepEqual(
    [...calls.keys()],
    ['/modern'],
    'Only current surface loads before background starts',
  );
  const preload = cache.preload();
  await Promise.all([preload, cache.get('/proto')]);
  assert.ok(peak <= 3, 'Background concurrency is bounded');
  assert.ok([...calls.values()].every((v) => v === 1));
  assert.deepEqual(reports.at(-1), [5, 5, false]);
  await cache.get('/past');
  assert.equal(
    calls.get('/past'),
    1,
    'Loaded era remains available without another network request',
  );
  const objectUrl = await cache.get('/modern');
  cache.dispose();
  await assert.rejects(
    originalFetch(objectUrl),
    'Object URLs are revoked on disposal',
  );
  await assert.rejects(cache.get('/modern'));

  fail = true;
  const errors = [];
  const retry = new TextureCache(['/ok', '/bad'], (...p) => errors.push(p));
  await retry.preload();
  assert.deepEqual(
    errors.at(-1),
    [1, 2, true],
    'Failure never reports false completion',
  );
  assert.equal(calls.get('/bad'), 2, 'Transient failures retry once');
  fail = false;
  await retry.preload();
  assert.deepEqual(errors.at(-1), [2, 2, false]);
  assert.equal(calls.get('/ok'), 1, 'Retry preserves successful downloads');
  retry.dispose();

  const aborted = [];
  const cancel = new TextureCache(['/a', '/b', '/c', '/d'], (...p) =>
    aborted.push(p),
  );
  const pending = cancel.preload();
  cancel.dispose();
  const count = aborted.length;
  await pending;
  assert.equal(aborted.length, count, 'No state updates after unmount');
  assert.equal(calls.has('/d'), false, 'Unmount cancels queued work');
  console.log(
    'Verified current-first loading, request deduplication, bounded preloading, retained assets, retry, and cleanup.',
  );
} finally {
  globalThis.fetch = originalFetch;
}
