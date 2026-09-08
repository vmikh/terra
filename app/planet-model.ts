import ages from './paleo-ages.json';
import { MIN, MAX, NOW } from './epochs';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const smooth = (a: number, b: number, x: number) => {
  const v = clamp((x - a) / (b - a));
  return v * v * (3 - 2 * v);
};
export type SurfaceFrame = { year: number; key: string; inferred: boolean };
export const surfaceFrames: SurfaceFrame[] = [
  { year: MIN, key: 'proto', inferred: true },
  { year: -4400000000, key: 'proto', inferred: true },
  { year: -3500000000, key: 'archean', inferred: true },
  { year: -1800000000, key: 'nuna', inferred: true },
  { year: -1000000000, key: 'rodinia', inferred: true },
  ...ages
    .filter((a) => a !== 0 && a !== 1)
    .sort((a, b) => b - a)
    .map((age) => ({
      year: NOW - age * 1e6,
      key: String(age),
      inferred: false,
    })),
  { year: -120000, key: 'modern', inferred: true },
  { year: -24000, key: '1', inferred: false },
  { year: -6000, key: 'modern', inferred: true },
  { year: NOW, key: 'modern', inferred: false },
  { year: 2100, key: 'modern', inferred: false },
  { year: 250002026, key: 'future', inferred: true },
  { year: 1000002026, key: 'future-late', inferred: true },
  { year: MAX, key: 'future-late', inferred: true },
];
export function surfaceAt(year: number) {
  const y = clamp(year, MIN, MAX);
  let i = surfaceFrames.findIndex(
    (f, n) =>
      n < surfaceFrames.length - 1 &&
      y >= f.year &&
      y <= surfaceFrames[n + 1].year,
  );
  if (i < 0) i = surfaceFrames.length - 2;
  const from = surfaceFrames[i],
    to = surfaceFrames[i + 1];
  const mix = clamp((y - from.year) / (to.year - from.year));
  const heat =
    y < 0 ? 1 - smooth(MIN, -4250000000, y) : smooth(1500002026, MAX, y);
  const dry =
    y < 0
      ? (1 - smooth(MIN, -4300000000, y)) * 0.65
      : smooth(700002026, 2400002026, y);
  const pulse = (a: number, b: number, c: number, d: number) =>
    smooth(a, b, y) * (1 - smooth(c, d, y));
  const ice = Math.max(
    pulse(-2400000000, -2250000000, -2150000000, -2000000000) * 0.5,
    pulse(-740000000, -710000000, -665000000, -655000000) * 0.78,
    pulse(-653000000, -645000000, -637000000, -625000000) * 0.82,
  );
  // Only dated electric sources; no speculative ancient orbital glow.
  const electric = smooth(2016, 2026, y) * (1 - smooth(2100, 2300, y));
  const ancient = 0;
  const barren = 1 - smooth(-470000000, -350000000, y);
  return {
    position: i + mix,
    from,
    to,
    mix,
    heat,
    dry,
    ice,
    barren,
    electric,
    ancient,
    year: y,
    inferred: from.inferred || to.inferred,
    modern:
      (from.key === 'modern' ? 1 - mix : 0) + (to.key === 'modern' ? mix : 0),
  };
}

export function yearAtSurfacePosition(position: number) {
  const p = clamp(position, 0, surfaceFrames.length - 1);
  const i = Math.min(Math.floor(p), surfaceFrames.length - 2);
  return (
    surfaceFrames[i].year +
    (surfaceFrames[i + 1].year - surfaceFrames[i].year) * (p - i)
  );
}
