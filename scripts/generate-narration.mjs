// Run with: node --env-file=.env.elevenlabs.local scripts/generate-narration.mjs
// Existing recordings are retained; uncertain/failed requests are never retried.
import fs from 'node:fs/promises';
import { writeAudioInventory } from './audio-inventory.mjs';
const chapters = JSON.parse(
  await fs.readFile('content/narration.json', 'utf8'),
);
const voice = 'JBFqnCBsd6RMkjVDRZzb';
const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error('Local ElevenLabs key is missing');
await fs.mkdir('public/audio', { recursive: true });
await fs.mkdir('outputs/narration-production', { recursive: true });
const jobs = [];
for (const chapter of chapters)
  for (const lang of ['ru', 'en']) {
    const path = `public/audio/chapter-${chapter.id}-${lang}.mp3`;
    try {
      await fs.access(path);
    } catch {
      jobs.push({ chapter, lang, path });
    }
  }
console.log(`${jobs.length} recordings to generate`);
const generate = async ({ chapter, lang, path }) => {
  const body = {
    text: chapter[lang].replace(/\n\n/g, '\n<break time="1.0s" />\n'),
    model_id: 'eleven_multilingual_v2',
    language_code: lang,
    voice_settings: {
      stability: 0.82,
      similarity_boost: 0.75,
      style: 0,
      use_speaker_boost: true,
      speed: 0.87,
    },
  };
  let r;
  try {
    r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180000),
      },
    );
  } catch {
    console.log(`${chapter.id}/${lang}: connection uncertain; no retry`);
    return false;
  }
  if (!r.ok) {
    let code = 'unknown';
    try {
      const e = await r.json();
      code = String(e.detail?.status ?? 'unknown').slice(0, 80);
    } catch {}
    console.log(
      JSON.stringify({ chapter: chapter.id, lang, status: r.status, code }),
    );
    return false;
  }
  const bytes = Buffer.from(await r.arrayBuffer());
  if (
    bytes.length < 1000 ||
    !r.headers.get('content-type')?.includes('audio')
  ) {
    console.log(`${chapter.id}/${lang}: invalid audio response`);
    return false;
  }
  await fs.writeFile(path, bytes, { flag: 'wx' });
  await fs.writeFile(
    `outputs/narration-production/${chapter.id}-${lang}.json`,
    JSON.stringify({ voice, ...body, bytes: bytes.length }, null, 2),
  );
  console.log(`${chapter.id}/${lang}: saved ${bytes.length} bytes`);
  return true;
};
for (let i = 0; i < jobs.length; i += 2) {
  const results = await Promise.all(jobs.slice(i, i + 2).map(generate));
  await writeAudioInventory();
  if (results.some((v) => !v)) {
    process.exitCode = 1;
    break;
  }
}
