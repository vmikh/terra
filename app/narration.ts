import recordings from '../content/narration.json';
import availability from '../content/audio-availability.json';
export const hasAudio = (id: string, lang: 'ru' | 'en') =>
  Boolean((availability as Record<string, boolean>)[`${id}-${lang}`]);
// Each audio chapter covers a broad period containing several atlas epochs.
export const audioChapters = recordings.map(({ id, year, title }) => ({
  id,
  year,
  title,
}));
export const playbackRates = [0.75, 1, 1.25, 1.5, 2];
export function chapterIndexAt(year: number) {
  const next = audioChapters.findIndex((c) => c.year > year);
  return next < 0 ? audioChapters.length - 1 : Math.max(0, next - 1);
}
export const audioPath = (id: string, lang: 'ru' | 'en') =>
  `/audio/chapter-${id}-${lang}.mp3`;
