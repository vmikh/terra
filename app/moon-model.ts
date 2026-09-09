// Illustrative chronology, not a dynamical orbit reconstruction.
// NASA: science.nasa.gov/moon/formation/ and science.nasa.gov/moon/facts/
import { MAX } from './epochs';
const smooth = (a: number, b: number, year: number) => {
  const x = Math.max(0, Math.min(1, (year - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
export function moonAt(year: number) {
  return {
    visible: year >= -4500000000 && year < MAX,
    formation: 0.35 + 0.65 * smooth(-4500000000, -4495000000, year),
    molten: 1 - smooth(-4500000000, -4400000000, year),
    craters: smooth(-4450000000, -3800000000, year),
    maria: smooth(-4200000000, -1200000000, year),
    solarHeat: smooth(3000002026, MAX, year),
    // Compressed separation only; do not extrapolate today's recession rate.
    separation: 2.6 + 0.5 * smooth(-4500000000, 2026, year),
  };
}
