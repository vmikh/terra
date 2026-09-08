import fs from 'node:fs/promises';
export async function writeAudioInventory() {
  const chapters = JSON.parse(
    await fs.readFile('content/narration.json', 'utf8'),
  );
  const available = {};
  for (const c of chapters)
    for (const lang of ['ru', 'en']) {
      try {
        const stat = await fs.stat(`public/audio/chapter-${c.id}-${lang}.mp3`);
        if (stat.size > 1000) available[`${c.id}-${lang}`] = true;
      } catch {}
    }
  await fs.writeFile(
    'content/audio-availability.json',
    JSON.stringify(available, null, 2) + '\n',
  );
  return available;
}
if (process.argv[1]?.endsWith('audio-inventory.mjs'))
  console.log(
    'Available recordings:',
    Object.keys(await writeAudioInventory()).length,
  );
