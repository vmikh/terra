// Dates are first documented local supply, not worldwide adoption dates.
// Sources: Edison Papers (Rutgers), TEPCO Electric Power Historical Museum.
export const historicLights = [
  {
    name: 'London · Holborn',
    lon: -0.105,
    lat: 51.517,
    start: 1882,
    mature: 1930,
  },
  {
    name: 'New York · Pearl Street',
    lon: -74.005,
    lat: 40.707,
    start: 1882,
    mature: 1930,
  },
  {
    name: 'Tokyo · Nihonbashi',
    lon: 139.774,
    lat: 35.684,
    start: 1887,
    mature: 1950,
  },
];
const ramp = (a: number, b: number, y: number) => {
  const t = Math.max(0, Math.min(1, (y - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function lightsAt(year: number) {
  const modern = ramp(2016, 2026, year) * (1 - ramp(2100, 2300, year));
  return {
    modern,
    cities: historicLights.map(
      (c) => ramp(c.start, c.mature, year) * (1 - ramp(2016, 2026, year)),
    ),
  };
}
