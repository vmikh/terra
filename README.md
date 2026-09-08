# TERRA — Earth through time

A Russian/English 3D planetary atlas covering 52 chapters, from Earth’s formation to a model of possible solar engulfment. Designed for a minimum viewport of 1440 × 700.

## Run

```sh
npm install
npm run dev
```

Open the address printed by the development server. `npm run build` creates the production Worker and assets. Run `npx tsc --noEmit` and `node scripts/verify.mjs` for validation.

## Controls

- Drag the globe to rotate; scroll or use + / − to zoom. Orbit and cloud buttons toggle rotation and illustrative clouds.
- The full-width nonlinear timeline allocates extra precision to recent history. Arrow keys advance by one year around modern times; Home / End jump to the boundaries.
- Click the displayed date or **Enter year** for an exact calendar year. Negative values mean BCE. The scale has no year zero; deep-time labels are approximate offsets from 2026.
- **All epochs** opens searchable chapters. Playback moves to the next chapter every six seconds.
- **Surface / Climate** switches between natural rendering and an illustrative global climate tint. The latter is not a regional temperature simulation.
- The language preference is saved only in the browser.

## Scientific scope

This is an educational atlas, not a coupled Earth-system simulation. Chapters and most metrics are discrete epoch summaries. Historical population is interpolated between rounded reference values. Modern population uses rounded UN WPP 2024 values; the medium projection ends in 2100. No human population is forecast beyond that date.

The present view is 2026, with 2025 mean surface air temperature (14.97 °C), the latest completed annual observation used here. Annual temperatures for 2024 and 2025 are distinguished. Future temperature uses an approximate 13.5 °C pre-industrial baseline plus IPCC AR6 scenario warming; interpolated years are illustrative, not forecasts of individual years. IPCC period endpoints and likely ranges are retained. A dash means unavailable, never zero.

Ancient geography uses the nearest PALEOMAP raster, labelled with its actual slice age. There are 90 local rasters, including a Last Glacial Maximum map whose atlas filename is `_001` (not a one-million-year reconstruction). Earlier than 750 Ma and across most of the far future, geometry is explicitly unknown and a schematic globe is shown. The Pangaea Ultima outline is digitised from Farnsworth et al. (2023), Fig. 1e; it represents one +250 Myr hypothesis. Its colours are illustrative, not a vegetation forecast. Modern coastlines remain unchanged in 21st-century views because projected metre-scale sea-level changes are not visible at globe scale.

Future red-giant timing and engulfment are model-dependent; the final chapter shows one possible outcome. No actual live measurements, regional climate calculations or continuous plate reconstructions are performed.

## Data and licences

- Earth and cloud textures: NASA-derived Earth textures distributed in the Three.js examples. Clouds are not live weather. Lava is an illustrative Three.js texture.
- PALEOMAP PaleoAtlas v3, Christopher R. Scotese (2016), via EarthByte. CC BY 4.0. Original 3600 × 1800 rasters resized to 2048 × 1024 for web delivery. Original source: https://www.earthbyte.org/paleomap-paleoatlas-for-gplates/
- Future coastlines: Farnsworth et al. (2023), https://doi.org/10.1038/s41561-023-01259-3, CC BY 4.0. Digitised, simplified and recoloured from Fig. 1e. The reference figure can be supplied to `scripts/digitize-future.py` as documented in that script; Python requires Pillow, NumPy and SciPy.
- Climate: Copernicus GCH 2025; IPCC AR6; Judd et al. (2024); Tierney et al. (2020).
- Population: UN WPP 2024 and approximate historical anchor estimates informed by HYDE 3.2.
- Biosphere and future: Smithsonian, IPBES, Ozaki & Reinhard (2021), Farnsworth et al. (2023), Schröder & Smith (2008), NASA.
- The social preview image is AI-generated artwork and is not used as scientific imagery.

Source links, indicator notes and uncertainty explanations are available inside the interface and in `app/epochs.ts`.

## Validation limits

TypeScript, production compilation, 10,001 sampled timeline positions, chronological ordering, bilingual completeness, reading length, source IDs, scenario endpoints, population boundaries and local asset presence are checked. Browser visual/interaction QA was unavailable in the build session.
