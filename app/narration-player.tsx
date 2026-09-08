'use client';
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { flushSync } from 'react-dom';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import {
  audioChapters,
  chapterIndexAt,
  audioPath,
  playbackRates,
  hasAudio,
} from './narration';
import type { Lang } from './epochs';
const clock = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export type NarrationHandle = { startTour: () => void };
const NarrationPlayer = forwardRef<
  NarrationHandle,
  {
    year: number;
    lang: Lang;
    onNavigate: (year: number) => void;
    onStartTour: (year: number) => void;
  }
>(function NarrationPlayer({ year, lang, onNavigate, onStartTour }, ref) {
  const audio = useRef<HTMLAudioElement>(null),
    continueTour = useRef(false),
    previousLanguage = useRef(lang),
    request = useRef(0);
  const [playing, setPlaying] = useState(false),
    [time, setTime] = useState(0),
    [duration, setDuration] = useState(0),
    [rate, setRate] = useState(1),
    [tour, setTour] = useState(false),
    [error, setError] = useState(false);
  const i = chapterIndexAt(year),
    chapter = audioChapters[i];
  const available = hasAudio(chapter.id, lang);
  const t = (ru: string, en: string) => (lang === 'ru' ? ru : en);
  const play = async (a: HTMLAudioElement) => {
    const id = ++request.current;
    a.playbackRate = rate;
    a.preservesPitch = true;
    setError(false);
    try {
      await a.play();
    } catch {
      if (id === request.current) {
        setPlaying(false);
        setError(true);
      }
    }
  };
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const shouldContinue =
      continueTour.current && previousLanguage.current === lang;
    continueTour.current = false;
    previousLanguage.current = lang;
    request.current++;
    a.pause();
    a.currentTime = 0;
    setPlaying(false);
    setTime(0);
    setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    setError(false);
    if (shouldContinue) void play(a);
    return () => {
      request.current++;
      a.pause();
    };
    // Each selected date or language starts a fresh, explicitly selected chapter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, lang]);
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);
  useImperativeHandle(ref, () => ({
    startTour() {
      continueTour.current = false;
      // Commit the first chapter before play(), within the original user gesture.
      flushSync(() => {
        setTour(true);
        onStartTour(audioChapters[0].year);
      });
      const a = audio.current;
      if (a) {
        a.currentTime = 0;
        setTime(0);
        void play(a);
      }
    },
  }));
  const choose = (n: number) => {
    continueTour.current = false;
    onNavigate(audioChapters[n].year);
  };
  return (
    <section
      className="narration-player"
      aria-label={t('Аудиоповествование', 'Audio narration')}
    >
      <audio
        key={chapter.id + lang}
        ref={audio}
        src={available ? audioPath(chapter.id, lang) : undefined}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          e.currentTarget.playbackRate = rate;
        }}
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
        onEnded={() => {
          setPlaying(false);
          if (
            tour &&
            i < audioChapters.length - 1 &&
            hasAudio(audioChapters[i + 1].id, lang)
          ) {
            continueTour.current = true;
            onNavigate(audioChapters[i + 1].year);
          }
        }}
      />
      <div className="narration-heading">
        <Headphones size={14} />
        <span>
          {t('ГЛАВА', 'CHAPTER')} {i + 1}/15
        </span>
        <Select
          value={i}
          onValueChange={(value) => {
            if (value !== null) choose(Number(value));
          }}
        >
          <SelectTrigger
            className="chapter-select"
            aria-label={t('Выбрать аудиоглаву', 'Choose audio chapter')}
          >
            <SelectValue>{chapter.title[lang === 'ru' ? 0 : 1]}</SelectValue>
          </SelectTrigger>
          <SelectContent
            className="narration-menu"
            side="top"
            alignItemWithTrigger={false}
            sideOffset={12}
          >
            {audioChapters.map((c, n) => (
              <SelectItem key={c.id} value={n}>
                <span className="chapter-option-number">{c.id}</span>
                {c.title[lang === 'ru' ? 0 : 1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="narration-controls">
        <button
          type="button"
          disabled={i === 0}
          onClick={() => choose(i - 1)}
          aria-label={t('Предыдущая аудиоглава', 'Previous audio chapter')}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="narration-play"
          disabled={!available}
          aria-label={
            playing
              ? t('Пауза', 'Pause')
              : error
                ? t('Повторить загрузку аудио', 'Retry audio')
                : t('Слушать главу', 'Listen to chapter')
          }
          onClick={() => {
            const a = audio.current;
            if (!a) return;
            if (playing) {
              request.current++;
              a.pause();
            } else {
              if (error) a.load();
              if (a.ended) a.currentTime = 0;
              void play(a);
            }
          }}
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button
          type="button"
          disabled={i === audioChapters.length - 1}
          onClick={() => choose(i + 1)}
          aria-label={t('Следующая аудиоглава', 'Next audio chapter')}
        >
          <ChevronRight size={16} />
        </button>
        <input
          type="range"
          aria-label={t('Позиция в аудиозаписи', 'Audio playback position')}
          min={0}
          max={duration || 1}
          step={0.1}
          value={Math.min(time, duration || 1)}
          disabled={!duration}
          onChange={(e) => {
            if (audio.current) {
              audio.current.currentTime = Number(e.target.value);
              setTime(Number(e.target.value));
            }
          }}
        />
        <span className="narration-time">
          {clock(time)} / {clock(duration)}
        </span>
        <Select
          value={rate}
          onValueChange={(value) => {
            if (value !== null) setRate(Number(value));
          }}
        >
          <SelectTrigger
            className="narration-rate"
            aria-label={t('Скорость воспроизведения', 'Playback speed')}
          >
            <SelectValue>{rate}×</SelectValue>
          </SelectTrigger>
          <SelectContent
            className="narration-menu rate-menu"
            side="top"
            alignItemWithTrigger={false}
          >
            {playbackRates.map((r) => (
              <SelectItem key={r} value={r}>
                {r}×
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label
          className="narration-tour"
          title={t(
            'Следующая глава после окончания рассказа',
            'Advance when narration ends',
          )}
        >
          <input
            type="checkbox"
            checked={tour}
            onChange={(e) => setTour(e.target.checked)}
          />
          <span className="tour-switch" aria-hidden="true" />
          {t('Авто', 'Auto')}
        </label>
      </div>
      {!available && (
        <span className="narration-unavailable">
          {t(
            'Озвучка этой главы ещё не добавлена',
            'Audio for this chapter has not been added yet',
          )}
        </span>
      )}
      {error && (
        <span className="narration-error" role="status">
          {t(
            'Не удалось воспроизвести. Нажмите ▶ для повтора.',
            'Playback unavailable. Press ▶ to retry.',
          )}
        </span>
      )}
    </section>
  );
});
export default NarrationPlayer;
