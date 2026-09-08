# TERRA — Earth through time

A Russian/English 3D planetary atlas covering 52 chapters, from Earth’s formation to a model of possible solar engulfment. Designed for a minimum viewport of 1440 × 700.

## Run

```sh
npm install
npm run dev
```

Open the address printed by the development server. `npm run build` creates the production Worker and assets. Run `npx tsc --noEmit` and `node scripts/verify.mjs` / `node scripts/verify-model.mjs` for validation.

## Controls

- Drag the globe to rotate; scroll or use + / − to zoom. Orbit and cloud buttons toggle rotation and illustrative clouds.
- The full-width nonlinear timeline allocates extra precision to recent history. Arrow keys advance by one year around modern times; Home / End jump to the boundaries.
- Click the displayed date or **Enter year** for an exact calendar year. Negative values mean BCE. The scale has no year zero; deep-time labels are approximate offsets from 2026.
- **All epochs** opens searchable chapters. Playback moves to the next chapter every six seconds.
- **Surface / Climate** switches between natural rendering and an illustrative global climate tint. The latter is not a regional temperature simulation.
- The language preference is saved only in the browser.

## Scientific scope

This is an educational atlas, not a coupled Earth-system simulation. Chapters and most metrics are discrete epoch summaries. Historical population is interpolated between rounded reference values. Modern population uses rounded UN WPP 2024 values; the medium projection ends in 2100. Beyond that date, a separate hypothetical declining population illustration fills the display. Its grey values are labelled AI reconstruction; they are not UN forecasts.

The present view is 2026, with 2025 mean surface air temperature (14.97 °C), the latest completed annual observation used here. Annual temperatures for 2024 and 2025 are distinguished. Future temperature uses an approximate 13.5 °C pre-industrial baseline plus IPCC AR6 scenario warming; interpolated years are illustrative, not forecasts of individual years. IPCC period endpoints and likely ranges are retained. Missing temperature, population, oxygen, ocean and CO₂ values are filled using explicit hypothetical anchor tables in `app/estimates.ts`. They are grey and labelled AI reconstruction. These are educational estimates, not newly inferred scientific data.

The globe keeps one lighting model. Modern Earth uses a genuine NASA Blue Marble 8K texture directly, without the 4K offscreen bottleneck, with GEBCO elevation for bump shading. Other eras use 4K natural-colour surfaces and deterministic multiscale fine terrain. This increases visual detail, not the scientific resolution of the source coastlines.

`scripts/build-hq.py` registers every adjacent pair using bidirectional OpenCV DIS optical flow. The shader back-traces both maps along their displacement fields and reconstructs a single moving coastline. Arbitrary date jumps animate through the chronological surface frames, with no whole-globe crossfade. Loading retains the last complete surface; an LRU keeps four surface pairs and six small motion maps. This is image registration, not a physical plate-tectonic solver.

Earlier than 750 Ma, coastlines are hypothetical deformations of available templates. Farnsworth et al. (2023), Fig. 1e anchors one +250 Myr Pangaea Ultima scenario. Intermediate and later geography and fine ancient relief are illustrative. Heating, ice and ocean loss remain gradual. At the final date Earth and its atmospheric shells disappear, with a bilingual engulfment caption.

Night lights are restricted to the night hemisphere. No artificial glow is drawn before 1882. Selected documented electric supply locations are shown as amplified markers: Holborn/London and Pearl Street/New York from 1882, Nihonbashi/Tokyo from 1887. These are deliberately selective, not exhaustive historical maps or radiance measurements; absence of a marker does not imply absence of historical lighting. Japan's 1878 first electric lamp and 1882 Ginza demonstration do not justify illuminating its modern urban network. The genuine NASA 2016 Black Marble texture only enters from 2016, reaching full illustrative brightness in 2026. Its decline after 2100 to zero by 2300 is a scenario, not a forecast.

Historical lighting references: https://edison.rutgers.edu/life-of-edison/chronology/1881-1890 ; https://www.tepco.co.jp/shiryokan/virtualtour/ ; https://www.tepco.co.jp/shiryokan/floor/index-j.html .

Future red-giant timing and engulfment are model-dependent; the final chapter shows one possible outcome. No actual live measurements, regional climate calculations or continuous plate reconstructions are performed.

## Data and licences

- Day surface: NASA Earth Observatory / Reto Stoeckli, July 2004 Blue Marble, cloud-free topographic composite. Source 21600x10800, delivered 8192x4096: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography/july/world.topo.200407.3x21600x10800.jpg
- Real modern relief: NASA Earth Observatory / GEBCO, land elevation 0-6400m, delivered 4096x2048: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/topography/gebco_08_rev_elev_21600x10800.jpg
- Night emissive map: NASA Earth Observatory / Joshua Stevens, Suomi NPP VIIRS data from Miguel Roman, NASA GSFC. 2016 Black Marble grayscale, source 13500x6750, delivered 8192x4096: https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144897/BlackMarble_2016_3km_gray.jpg . Source/year: https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/
- NASA reuse guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/ . Clouds and illustrative lava retain the Three.js example textures; clouds are not live weather.
- PALEOMAP PaleoAtlas v3, Christopher R. Scotese (2016), via EarthByte. CC BY 4.0. Original 3600 × 1800 rasters resized to 2048 × 1024 for web delivery. Original source: https://www.earthbyte.org/paleomap-paleoatlas-for-gplates/
- Future coastlines: Farnsworth et al. (2023), https://doi.org/10.1038/s41561-023-01259-3, CC BY 4.0. Digitised, simplified and recoloured from Fig. 1e. The reference figure can be supplied to `scripts/digitize-future.py` as documented in that script; Python requires Pillow, NumPy and SciPy.
- Climate: Copernicus GCH 2025; IPCC AR6; Judd et al. (2024); Tierney et al. (2020).
- Population: UN WPP 2024 and approximate historical anchor estimates informed by HYDE 3.2.
- Biosphere and future: Smithsonian, IPBES, Ozaki & Reinhard (2021), Farnsworth et al. (2023), Schröder & Smith (2008), NASA.
- The social preview image is AI-generated artwork and is not used as scientific imagery.

To regenerate the surface assets, run `python scripts/build-surfaces.py` with Pillow, NumPy and SciPy installed. Then run `python scripts/build-hq.py` with OpenCV installed for 4K terrain and motion maps. Supply `--nasa-source-dir` with the three original NASA downloads named `day-21600.jpg`, `elevation-21600.jpg`, and `night-2016-13500-gray.jpg` to regenerate the modern assets. These scripts are deterministic and make no network requests.

Source links, indicator notes and uncertainty explanations are available inside the interface and in `app/epochs.ts`.

## Validation limits

TypeScript, production compilation, 10,001 sampled timeline positions, chronological ordering, bilingual completeness, reading length, source IDs, scenario endpoints, population boundaries and local asset presence are checked. Model checks also cover 101 surface frames, boundary continuity, finite placeholder estimates and the chronology of night lights. `scripts/verify-hq.py` checks every texture resolution and five samples of every bidirectional coastline morph (minimum land coverage 9.9%). Historical light checks cover Japan in 1800/1886, documented starts, the 2016 cutoff, and future shutdown. Browser visual/interaction QA was unavailable in the build session.


## Audio narration

15 bilingual chapters cover every position of the timeline. Audio is generated once and served as local MP3 files; the browser never contacts ElevenLabs and never receives its API key. George / Eleven Multilingual v2 uses the approved calm settings: speed 0.87, stability 0.82, similarity 0.75, paragraph breaks of one second. The first chapter reuses the approved samples.

The player offers play/pause, seeking, chapter selection, previous/next, playback rates 0.75x-2x with pitch preservation, and optional advancement after a chapter ends. Manual timeline navigation and language changes pause/reset narration. No initial autoplay. The former six-second automatic tour is replaced by narration-paced advancement. Manual year entry and the logo subtitle are removed.

Scripts live in `content/narration.json`. To resume generation after adding credits: `node --env-file=.env.elevenlabs.local scripts/generate-narration.mjs`. Existing audio is retained. The ignored local key file must never be bundled or committed. `content/audio-availability.json` is refreshed after each batch; unavailable recordings are disabled instead of generating broken requests. Narration credit appears in the sources dialog.
