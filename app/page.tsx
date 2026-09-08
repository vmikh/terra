'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Thermometer,
  Users,
  Waves,
  Wind,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  BookOpen,
  Orbit,
  Info,
  Cloud,
  Compass,
  ArrowRight,
  Search,
  Check,
  Clock3,
  Maximize2,
  Minimize2,
  Leaf,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Globe from './globe';
import {
  NOW,
  MIN,
  MAX,
  epochs,
  epochAt,
  yearToPosition,
  positionToYear,
  pick,
  dateLabel,
  populationAt,
  scenarios,
  warmingAt,
  sources,
  type Lang,
} from './epochs';
import paleoAges from './paleo-ages.json';
export default function Home() {
  const [lang, setLang] = useState<Lang>('ru'),
    [year, setYear] = useState(NOW),
    [playing, setPlaying] = useState(false),
    [rotation, setRotation] = useState(true),
    [clouds, setClouds] = useState(true),
    [zoom, setZoom] = useState(0),
    [reset, setReset] = useState(0),
    [scenario, setScenario] = useState(1),
    [modal, setModal] = useState<
      'sources' | 'epochs' | 'year' | 'details' | null
    >(null),
    [inputYear, setInputYear] = useState(String(NOW)),
    [inputError, setInputError] = useState(''),
    [search, setSearch] = useState(''),
    [full, setFull] = useState(false),
    [view, setView] = useState<'natural' | 'climate'>('natural');
  const t = (ru: string, en: string) => (lang === 'ru' ? ru : en);
  const epoch = epochAt(year),
    index = epochs.indexOf(epoch),
    date = dateLabel(year, lang),
    position = yearToPosition(year),
    nearFuture = year > NOW && year <= 2100;
  const future = year > NOW,
    modern = year > -9700 && year < 1002026;
  const number = (n: number, d = 2) =>
    new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(n);
  const navigate = (y: number) => {
    setPlaying(false);
    setYear(Math.max(MIN, Math.min(MAX, Math.round(y))));
  };
  useEffect(() => {
    const saved = localStorage.getItem('terra-language');
    if (saved === 'ru' || saved === 'en') setLang(saved);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches)
      setRotation(false);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('terra-language', lang);
    document.title = t(
      'TERRA — Земля сквозь время',
      'TERRA — Earth through time',
    );
  }, [lang]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setYear((y) => {
          const i = epochs.findIndex((e) => e.year > y);
          if (i === -1) {
            setPlaying(false);
            return y;
          }
          return epochs[i].year;
        }),
      6000,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    const fn = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);
  const map = useMemo(() => {
    if (year < -4400000000)
      return { texture: '/textures/lava.jpg', mode: 'hot', age: null };
    if (year < -750000000)
      return {
        texture: 'solid:ocean',
        mode: year >= -2200000000 && year < -2100000000 ? 'ice' : 'ocean',
        age: null,
      };
    if (year >= 2000002026)
      return {
        texture: '/textures/lava.jpg',
        mode: year >= MAX ? 'destroyed' : 'hot',
        age: null,
      };
    if (year >= 1000002026)
      return { texture: 'solid:barren', mode: 'barren', age: null };
    if (year >= 250002026)
      return { texture: '/textures/future.jpg', mode: 'ancient', age: 250 };
    if (year >= 1002026)
      return { texture: 'solid:ocean', mode: 'ocean', age: null };
    if (year <= -9700) {
      const age =
        year >= -24000
          ? 1
          : paleoAges
              .filter((a) => a !== 1)
              .reduce(
                (a, b) =>
                  Math.abs(b - (NOW - year) / 1e6) <
                  Math.abs(a - (NOW - year) / 1e6)
                    ? b
                    : a,
                750,
              );
      return {
        texture: `/textures/paleo/${age}.jpg`,
        mode:
          (year >= -720000000 && year < -660000000) ||
          (year >= -650000000 && year < -635000000)
            ? 'ice'
            : 'ancient',
        age,
      };
    }
    return { texture: '/textures/earth.jpg', mode: 'modern', age: 0 };
  }, [year]);
  const pop = populationAt(year),
    popValue =
      pop === null
        ? '—'
        : pop === 0
          ? '0'
          : number(pop >= 1 ? pop : pop * 1000, pop >= 1 ? 2 : 1),
    popUnit =
      pop === null
        ? ''
        : pop >= 1
          ? t('млрд', 'bn')
          : pop > 0
            ? t('млн', 'm')
            : t('человек', 'humans');
  const temperature = nearFuture
    ? '≈' + number(13.5 + warmingAt(year, scenario), 1)
    : year === 2024
      ? '15.10'
      : year >= 2025 && year <= NOW
        ? '14.97'
        : epoch.temp;
  const temperatureText =
    lang === 'ru' ? temperature.replace(/\./g, ',') : temperature;
  const ocean = modern
    ? '71'
    : year < -4400000000 || year >= 2000002026
      ? '0'
      : '—';
  const mapNote =
    map.mode === 'ice'
      ? t(
          'Схематичный ледяной покров · границы неопределённы',
          'Schematic ice cover · uncertain boundaries',
        )
      : map.mode === 'modern'
        ? t('Современная география · NASA', 'Modern geography · NASA')
        : year >= 250002026 && year < 1000002026
          ? t(
              'Пангея Ультима · оцифровка модели +250 млн лет',
              'Pangaea Ultima · digitised +250 Myr model',
            )
          : map.age !== null
            ? t(
                `PALEOMAP · срез ${map.age === 1 ? 'ледникового максимума' : map.age + ' млн лет назад'}`,
                `PALEOMAP · ${map.age === 1 ? 'Last Glacial Maximum' : map.age + ' million years ago'}`,
              )
            : t(
                'Схематический вид · география неизвестна',
                'Schematic view · geography unknown',
              );
  const estimate =
    year === NOW
      ? t('ВЫ ЗДЕСЬ · НАСТОЯЩЕЕ', 'YOU ARE HERE · THE PRESENT')
      : future
        ? t('ВОЗМОЖНОЕ БУДУЩЕЕ', 'A POSSIBLE FUTURE')
        : year < 1850
          ? t('РЕКОНСТРУКЦИЯ ПРОШЛОГО', 'RECONSTRUCTING THE PAST')
          : t('ИСТОРИЧЕСКИЕ ДАННЫЕ', 'HISTORICAL DATA');
  const currentSources = [
    ...new Set([
      ...epoch.source,
      'maps',
      'earth',
      ...(nearFuture ? ['ipcc', 'un'] : []),
    ]),
  ];
  const inputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputYear.replace(/[\s,]/g, '').replace('−', '-');
    const v = Number(cleaned);
    if (
      !cleaned ||
      !/^[-+]?\d+$/.test(cleaned) ||
      !Number.isSafeInteger(v) ||
      v < MIN ||
      v > MAX ||
      v === 0
    ) {
      setInputError(
        t(
          'Введите целый год от −4 540 000 000 до 7 600 002 026. Года 0 в этой шкале нет.',
          'Enter an integer year from −4,540,000,000 to 7,600,002,026. This scale has no year 0.',
        ),
      );
      return;
    }
    navigate(v);
    setModal(null);
  };
  const openYear = () => {
    setInputYear(String(year));
    setInputError('');
    setModal('year');
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFull(false);
    }
  };
  const filtered = epochs.filter((e) =>
    (pick(e.title, lang) + ' ' + pick(e.period, lang) + ' ' + e.year)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const stats = [
    {
      icon: Thermometer,
      title: t('Средняя температура', 'Mean surface temperature'),
      value: temperatureText,
      unit: temperature === '—' ? '' : '°C',
      note: nearFuture
        ? `${scenarios[scenario].ssp} · ${t('сценарная оценка', 'scenario estimate')}`
        : year >= 2025 && year <= NOW
          ? t('Последний полный год · 2025', 'Latest complete year · 2025')
          : temperature === '—'
            ? t('Надёжной оценки нет', 'No reliable estimate')
            : t('Ориентир для эпохи', 'Approximate epoch value'),
    },
    {
      icon: Users,
      title: t('Население людей', 'Human population'),
      value: popValue,
      unit: popUnit,
      note:
        pop === null
          ? t('Надёжной оценки нет', 'No reliable estimate')
          : pop === 0
            ? t('Homo sapiens ещё нет', 'Homo sapiens has not appeared')
            : future
              ? t('ООН · средний вариант', 'UN · medium projection')
              : year >= 1950
                ? t('ООН · округлённая оценка', 'UN · rounded estimate')
                : t(
                    'Историческая оценка · приблизительно',
                    'Historical estimate · approximate',
                  ),
    },
    {
      icon: Waves,
      title: t('Покрытие океаном', 'Ocean coverage'),
      value: ocean,
      unit: ocean === '—' ? '' : '%',
      note:
        ocean === '—'
          ? t('Глобальная доля не определена', 'Global fraction not specified')
          : year >= 2000002026
            ? t('Сценарий потери океанов', 'Ocean-loss scenario')
            : t('Доля поверхности', 'Fraction of the surface'),
    },
    {
      icon: Wind,
      title: t('Кислород в атмосфере', 'Atmospheric oxygen'),
      value: lang === 'ru' ? epoch.oxygen.replace('.', ',') : epoch.oxygen,
      unit: epoch.oxygen === '—' ? '' : '%',
      note:
        epoch.oxygen === '—'
          ? t('Высокая неопределённость', 'High uncertainty')
          : t(
              'Объёмная доля · ориентир эпохи',
              'Volume fraction · epoch estimate',
            ),
    },
  ];
  return (
    <main
      className={`observatory ${future ? 'future' : ''} ${map.mode === 'hot' || map.mode === 'destroyed' ? 'hot-world' : ''}`}
    >
      <header className="topbar">
        <a className="brand" href="/" aria-label="Terra">
          <Orbit />
          <span>
            TERRA<span className="brand-dot">.</span>
          </span>
          <small>{t('ИСТОРИЯ ОДНОЙ ПЛАНЕТЫ', 'THE STORY OF ONE PLANET')}</small>
        </a>
        <nav className="topnav">
          <Button
            variant="ghost"
            className="nav-active"
            onClick={() => setModal(null)}
          >
            {t('Исследовать', 'Explore')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              setModal('epochs');
            }}
          >
            <Clock3 />
            {t('Все эпохи', 'All epochs')}
          </Button>
          <Button variant="ghost" onClick={() => setModal('sources')}>
            <BookOpen />
            {t('Об исследовании', 'About the research')}
          </Button>
        </nav>
        <div className="language" aria-label={t('Язык', 'Language')}>
          <Button
            variant="ghost"
            className={lang === 'ru' ? 'selected' : ''}
            aria-pressed={lang === 'ru'}
            onClick={() => setLang('ru')}
          >
            RU
          </Button>
          <Button
            variant="ghost"
            className={lang === 'en' ? 'selected' : ''}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </Button>
        </div>
      </header>
      <section className="universe">
        <div className="ambient" />
        <div className="stars" />
        <div className="epoch-heading">
          <div className="eyebrow">
            <span className="live-dot" />
            {estimate}
          </div>
          <h1>{pick(epoch.title, lang)}</h1>
          <p>
            {t(
              'Одна планета. Миллиарды историй.',
              'One planet. Billions of stories.',
            )}
          </p>
        </div>
        <aside className="stats">
          <div className="section-label">
            {t('ПЛАНЕТА В ЦИФРАХ', 'THE PLANET IN NUMBERS')}{' '}
            <span>01 — 04</span>
          </div>
          {stats.map((s) => (
            <button
              className="stat"
              key={s.title}
              onClick={() => setModal('details')}
              aria-label={`${s.title}: ${s.value} ${s.unit}. ${t('Подробнее', 'Details')}`}
            >
              <div className="stat-label">
                <s.icon />
                {s.title}
                <Info className="stat-info" />
              </div>
              <div
                className={`stat-number ${s.value.length > 6 ? 'compact-number' : ''}`}
              >
                {s.value}
                <small>{s.unit}</small>
              </div>
              <p>{s.note}</p>
            </button>
          ))}
        </aside>
        <Globe
          texture={map.texture}
          mode={map.mode}
          clouds={clouds}
          rotate={rotation}
          zoom={zoom}
          reset={reset}
          lang={lang}
          climate={view === 'climate'}
          warming={nearFuture ? warmingAt(year, scenario) : 0}
        />
        <div className="planet-caption">
          <span className="live-dot" />
          {t('ЗЕМЛЯ', 'EARTH')}
          <span>
            {t('Третья планета от Солнца', 'Third planet from the Sun')}
          </span>
        </div>
        <div className="view-controls">
          <Button
            variant="ghost"
            className={view === 'natural' ? 'active' : ''}
            aria-pressed={view === 'natural'}
            onClick={() => setView('natural')}
          >
            <Compass />
            {t('Поверхность', 'Surface')}
          </Button>
          <Button
            variant="ghost"
            className={view === 'climate' ? 'active' : ''}
            aria-pressed={view === 'climate'}
            onClick={() => setView('climate')}
          >
            <Thermometer />
            {t('Климат', 'Climate')}
          </Button>
        </div>
        <aside className="story-panel">
          <div className="section-label">
            <Sparkles />
            {t('МГНОВЕНИЕ В ИСТОРИИ', 'A MOMENT IN HISTORY')}
            <span>
              {String(index + 1).padStart(2, '0')} / {epochs.length}
            </span>
          </div>
          <h2>{pick(epoch.headline, lang)}</h2>
          <p className="story-copy" key={epoch.year + '-' + lang}>
            {pick(epoch.body, lang)}
          </p>
          {nearFuture && (
            <div className="scenario-picker">
              <div className="section-label">
                {t('СЦЕНАРИЙ ВЫБРОСОВ', 'EMISSIONS SCENARIO')}
              </div>
              <div className="scenario-buttons">
                {scenarios.map((s, i) => (
                  <Button
                    key={s.id}
                    variant="ghost"
                    className={scenario === i ? 'active' : ''}
                    onClick={() => setScenario(i)}
                    aria-pressed={scenario === i}
                    title={s.ssp}
                  >
                    {t(
                      ['Низкие', 'Средние', 'Высокие'][i],
                      ['Low', 'Middle', 'High'][i],
                    )}
                  </Button>
                ))}
              </div>
              <small>
                +{number(warmingAt(year, scenario), 1)} °C{' '}
                {t('к 1850–1900', 'vs 1850–1900')} · {scenarios[scenario].ssp}
              </small>
            </div>
          )}
          <div className="life">
            <div className="section-label">
              <Leaf />
              {t('РАСПРОСТРАНЁННАЯ ЖИЗНЬ', 'PREVALENT LIFE')}
            </div>
            <div className="tags">
              {pick(epoch.life, lang)
                .split(' · ')
                .map((x) => (
                  <span key={x}>{x}</span>
                ))}
            </div>
          </div>
          <Button
            variant="ghost"
            className="era-badge"
            onClick={() => {
              setSearch('');
              setModal('epochs');
            }}
          >
            <span className="live-dot" />
            <div>
              {pick(epoch.period, lang).split(' · ')[0]}
              <small>
                {pick(epoch.period, lang).split(' · ').slice(1).join(' · ')}
              </small>
            </div>
            <ChevronRight />
          </Button>
          <Button
            variant="ghost"
            className="story-source"
            onClick={() => setModal('sources')}
          >
            {t('Источники и точность', 'Sources & uncertainty')}
            <ArrowUpRight />
          </Button>
        </aside>
        <div className="planet-tools">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => z + 1)}
            aria-label={t('Приблизить', 'Zoom in')}
            title={t('Приблизить', 'Zoom in')}
          >
            <Plus />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => z - 1)}
            aria-label={t('Отдалить', 'Zoom out')}
            title={t('Отдалить', 'Zoom out')}
          >
            <Minus />
          </Button>
          <span />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRotation((v) => !v)}
            aria-pressed={rotation}
            title={t('Автовращение', 'Auto-rotate')}
            aria-label={t('Автовращение', 'Auto-rotate')}
            className={rotation ? 'active' : ''}
          >
            <Orbit />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setClouds((v) => !v)}
            aria-pressed={clouds}
            disabled={!modern}
            title={t('Показать облака', 'Show clouds')}
            aria-label={t('Показать облака', 'Show clouds')}
            className={clouds && modern ? 'active' : ''}
          >
            <Cloud />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setReset((v) => v + 1);
              setZoom(0);
            }}
            title={t('Сбросить ракурс', 'Reset view')}
            aria-label={t('Сбросить ракурс', 'Reset view')}
          >
            <RotateCcw />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            title={t('Полный экран', 'Full screen')}
            aria-label={t('Полный экран', 'Full screen')}
          >
            {full ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
        {view === 'climate' && (
          <div className="climate-legend">
            <span>{t('КЛИМАТИЧЕСКИЙ КОНТЕКСТ', 'CLIMATE CONTEXT')}</span>
            <strong>
              {temperatureText}
              {temperature === '—' ? '' : ' °C'}
            </strong>
            <p>
              {nearFuture
                ? t(
                    'Цвет показывает глобальное потепление, не региональную карту.',
                    'Colour indicates global warming, not a regional map.',
                  )
                : t(
                    'Среднее для эпохи; это не карта местных температур.',
                    'An epoch average, not a map of local temperatures.',
                  )}
            </p>
            <div className="temperature-gradient" />
            <small>
              {t('Холоднее', 'Cooler')}
              <span>{t('Теплее', 'Warmer')}</span>
            </small>
          </div>
        )}
        <div className="globe-hint">
          <div>
            {t('Перетащите, чтобы вращать', 'Drag to rotate')}
            <span>·</span>
            {t('Прокрутите, чтобы приблизить', 'Scroll to zoom')}
          </div>
          <button onClick={() => setModal('sources')}>
            {mapNote}
            <Info />
          </button>
        </div>
      </section>
      <footer className="timeline">
        <div className="timeline-top">
          <div className="date-block">
            <span className="section-label">
              {t('ПУТЕШЕСТВИЕ ВО ВРЕМЕНИ', 'A JOURNEY THROUGH TIME')}
            </span>
            <button
              className="date-button"
              onClick={openYear}
              title={t('Ввести год вручную', 'Enter a year')}
            >
              <h3>
                {date.value}
                <small>{date.unit}</small>
              </h3>
              <ChevronRight />
            </button>
          </div>
          <div className="quick-jumps">
            {[
              [-4540000000, t('Рождение', 'Birth')],
              [-299000000, t('Пангея', 'Pangaea')],
              [-66000000, t('Астероид', 'Asteroid')],
              [2100, t('2100 год', 'Year 2100')],
              [MAX, t('Последняя глава', 'Final chapter')],
            ].map(([y, label]) => (
              <Button
                key={y}
                variant="ghost"
                onClick={() => navigate(Number(y))}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="time-controls">
            <Button variant="outline" className="year-entry" onClick={openYear}>
              {t('Ввести год', 'Enter year')}
              <ArrowRight />
            </Button>
            <div className="playback">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(epochs[Math.max(0, index - 1)].year)}
                disabled={year === MIN}
                aria-label={t('Предыдущая эпоха', 'Previous epoch')}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  playing
                    ? t('Пауза', 'Pause')
                    : t('Путешествие по эпохам', 'Play epoch tour')
                }
                title={t(
                  'Автопереход каждые 6 секунд',
                  'Advance every 6 seconds',
                )}
                onClick={() => {
                  if (year === MAX) setYear(MIN);
                  setPlaying((p) => !p);
                }}
              >
                {playing ? <Pause /> : <Play />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  navigate(epochs[Math.min(epochs.length - 1, index + 1)].year)
                }
                disabled={year === MAX}
                aria-label={t('Следующая эпоха', 'Next epoch')}
              >
                <ChevronRight />
              </Button>
            </div>
            <Button
              variant="outline"
              className="now-button"
              onClick={() => navigate(NOW)}
            >
              <RotateCcw />
              {t('Сейчас', 'Now')}
            </Button>
          </div>
        </div>
        <div className="timeline-track">
          <div className="timeline-ticks" />
          <div className="now-marker" style={{ left: '72%' }} />
          <Slider
            aria-label={t('Временная шкала', 'Time slider')}
            value={[position]}
            min={0}
            max={100}
            step={0.001}
            onValueChange={(v) =>
              navigate(positionToYear(Array.isArray(v) ? v[0] : v))
            }
            onKeyDown={(e) => {
              if (
                [
                  'ArrowLeft',
                  'ArrowRight',
                  'ArrowUp',
                  'ArrowDown',
                  'Home',
                  'End',
                ].includes(e.key)
              ) {
                e.preventDefault();
                const sign =
                  e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 1;
                navigate(
                  e.key === 'Home'
                    ? MIN
                    : e.key === 'End'
                      ? MAX
                      : year >= 1760 && year <= 2100
                        ? year + sign
                        : positionToYear(position + sign * 0.05),
                );
              }
            }}
          />
        </div>
        <div className="timeline-labels">
          {[
            {
              p: 0,
              y: MIN,
              a: t('−4,54 млрд лет', '−4.54 bn years'),
              b: t('Рождение Земли', 'Earth is born'),
            },
            {
              p: 20,
              y: -720000000,
              a: t('−720 млн', '−720 m'),
              b: t('Земля-снежок', 'Snowball Earth'),
            },
            {
              p: 34,
              y: -252000000,
              a: t('−252 млн', '−252 m'),
              b: t('Великое вымирание', 'The Great Dying'),
            },
            {
              p: 45,
              y: -66000000,
              a: t('−66 млн', '−66 m'),
              b: t('Астероид', 'Asteroid'),
            },
            { p: 62, y: 1760, a: '1760', b: t('Индустрия', 'Industry') },
            { p: 72, y: NOW, a: String(NOW), b: t('Настоящее', 'Present') },
            { p: 82, y: 2100, a: '2100', b: t('Будущее', 'Future') },
            {
              p: 96,
              y: 1000002026,
              a: t('+1 млрд', '+1 bn'),
              b: t('Угасание жизни', 'Life fades'),
            },
          ].map((tick) => (
            <button
              style={{ left: `${tick.p}%` }}
              className={tick.y === NOW ? 'present-tick' : ''}
              key={tick.p}
              onClick={() => navigate(tick.y)}
            >
              {tick.a}
              <b>{tick.b}</b>
            </button>
          ))}
        </div>
        <div className="timeline-bottom">
          <span>
            {t('НЕЛИНЕЙНАЯ ШКАЛА', 'NONLINEAR SCALE')}
            <span className="thin-dot">·</span>
            {playing
              ? t('АВТОПЕРЕХОД · 6 СЕК', 'AUTO-ADVANCE · 6 SEC')
              : t(
                  `${epochs.length} ЭПОХ · ОТ РОЖДЕНИЯ ДО ФИНАЛА`,
                  `${epochs.length} EPOCHS · FROM ORIGIN TO FINALE`,
                )}
          </span>
          <button onClick={() => setModal('sources')}>
            {t('ДАННЫЕ', 'DATA')}: NASA · IPCC · {t('ООН', 'UN')} · PALEOMAP
            <ArrowUpRight />
          </button>
        </div>
      </footer>
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent
          className={`terra-dialog ${modal === 'year' ? 'year-dialog' : ''}`}
        >
          <DialogTitle>
            {modal === 'year'
              ? t('В какой год отправимся?', 'Which year shall we visit?')
              : modal === 'epochs'
                ? t('Атлас времени', 'An atlas of time')
                : modal === 'details'
                  ? t(
                      'За каждым числом — контекст',
                      'Every number has a context',
                    )
                  : t(
                      'Наука за путешествием',
                      'The science behind the journey',
                    )}
          </DialogTitle>
          <DialogDescription>
            {modal === 'year'
              ? t(
                  'От формирования планеты до возможного поглощения Солнцем.',
                  'From planetary formation to possible solar engulfment.',
                )
              : modal === 'epochs'
                ? t(
                    `${epochs.length} коротких глав о нашем единственном доме.`,
                    `${epochs.length} short chapters about our only home.`,
                  )
                : t(
                    'Наблюдения, реконструкции и сценарии — с обозначенными границами знания.',
                    'Observations, reconstructions and scenarios, with their limits made explicit.',
                  )}
          </DialogDescription>
          {modal === 'year' && (
            <form onSubmit={inputSubmit} className="year-form">
              <label htmlFor="year-input">{t('Год', 'Year')}</label>
              <Input
                id="year-input"
                autoFocus
                inputMode="text"
                value={inputYear}
                onChange={(e) => {
                  setInputYear(e.target.value);
                  setInputError('');
                }}
                aria-invalid={!!inputError}
                aria-describedby="year-help"
              />
              <p id="year-help">
                {t(
                  'Отрицательные числа — до н. э. Например: −66000000 — время астероида; 1880 — электрический век; 2100 — будущее. Миллионы лет на шкале отсчитываются от 2026.',
                  'Negative numbers mean BCE. Examples: −66000000 for the asteroid, 1880 for the electrical age, 2100 for the future. Million-year offsets are measured from 2026.',
                )}
              </p>
              {inputError && (
                <p className="input-error" role="alert">
                  {inputError}
                </p>
              )}
              <Button type="submit">
                {t('Переместиться', 'Travel to year')}
                <ArrowRight />
              </Button>
            </form>
          )}
          {modal === 'epochs' && (
            <>
              <div className="epoch-search">
                <Search />
                <Input
                  aria-label={t('Найти эпоху', 'Search epochs')}
                  placeholder={t(
                    'Название эпохи, период или год…',
                    'Epoch, period or year…',
                  )}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="epoch-list">
                {filtered.length === 0 ? (
                  <p className="empty">
                    {t(
                      'Эпохи не найдены. Попробуйте другое название.',
                      'No epochs found. Try another name.',
                    )}
                  </p>
                ) : (
                  filtered.map((e) => (
                    <button
                      key={e.year}
                      className={e === epoch ? 'current' : ''}
                      onClick={() => {
                        navigate(e.year);
                        setModal(null);
                      }}
                    >
                      <span>
                        {dateLabel(e.year, lang).value}
                        <small>{dateLabel(e.year, lang).unit}</small>
                      </span>
                      <div>
                        <strong>{pick(e.title, lang)}</strong>
                        <small>{pick(e.period, lang)}</small>
                      </div>
                      {e === epoch ? <Check /> : <ArrowUpRight />}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
          {modal === 'details' && (
            <div className="detail-content">
              <div className="detail-grid">
                {stats.map((s) => (
                  <div key={s.title}>
                    <s.icon />
                    <small>{s.title}</small>
                    <strong>
                      {s.value} {s.unit}
                    </strong>
                    <p>{s.note}</p>
                  </div>
                ))}
              </div>
              <dl>
                <div>
                  <dt>CO₂</dt>
                  <dd>
                    {epoch.co2} {epoch.co2 === '—' ? '' : 'ppm'}
                  </dd>
                </div>
                <div>
                  <dt>{t('Возраст Земли', 'Age of Earth')}</dt>
                  <dd>
                    ≈{number((year - MIN) / 1e9, 3)}{' '}
                    {t('млрд лет', 'billion years')}
                  </dd>
                </div>
                <div>
                  <dt>{t('Карта поверхности', 'Surface map')}</dt>
                  <dd>{mapNote}</dd>
                </div>
                {nearFuture && (
                  <>
                    <div>
                      <dt>
                        {t('Потепление к 2081–2100', 'Warming in 2081–2100')}
                      </dt>
                      <dd>+{scenarios[scenario].range} °C</dd>
                    </div>
                    <div>
                      <dt>
                        {t('Подъём моря к 2100', 'Sea-level rise by 2100')}
                      </dt>
                      <dd>
                        {scenarios[scenario].sea}{' '}
                        {t('м к 1995–2014', 'm vs 1995–2014')}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
              <p className="method-note">
                {t(
                  '«—» означает, что надёжное значение не задано, а не ноль. Исторические численности округлены и интерполированы между опорными годами. Температуры древних эпох — обзорные ориентиры. Для 2026 показана температура 2025: полный год ещё не завершён.',
                  '“—” means a reliable value is not specified, not zero. Historical population is rounded and interpolated between anchor years. Ancient temperatures are broad guides. The 2026 view uses 2025 temperature because the full year is not yet complete.',
                )}
              </p>
              <Button variant="outline" onClick={() => setModal('sources')}>
                {t('Открыть источники', 'Open sources')}
                <ArrowUpRight />
              </Button>
            </div>
          )}
          {modal === 'sources' && (
            <div className="source-content">
              <div className="method-box">
                <Info />
                <div>
                  <h4>
                    {t(
                      'Атлас, а не точный прогноз',
                      'An atlas, not a precise forecast',
                    )}
                  </h4>
                  <p>
                    {t(
                      'Ползунок выбирает год, текст — соответствующую главу, география — ближайший опубликованный срез. Древние даты округлены. Облака и освещение иллюстративны. До 750 млн лет назад и в большей части далёкого будущего география не восстанавливается уверенно: вместо выдуманных материков показана схема.',
                      'The slider selects a year, text follows its chapter, and geography uses the nearest published slice. Ancient dates are rounded. Clouds and lighting are illustrative. Before 750 million years ago and through much of the deep future, geography is uncertain: a schematic replaces invented continents.',
                    )}
                  </p>
                  <p>
                    {t(
                      'В XXI веке берега сохраняют современную геометрию: метровый подъём моря неразличим в масштабе глобуса. Климатический слой показывает глобальную тенденцию цветом, не вычисляет региональный климат. Пангея Ультима — оцифрованный контур одного сценария +250 млн лет; его нельзя принимать за карту всех последующих дат.',
                      '21st-century coasts retain modern geometry: metre-scale sea-level rise is invisible at globe scale. The climate layer colours a global trend; it does not compute regional climate. Pangaea Ultima is a digitised outline of one +250 Myr scenario, not a map of every later date.',
                    )}
                  </p>
                </div>
              </div>
              <h4 className="sources-subtitle">
                {t('ДЛЯ ВЫБРАННОЙ ЭПОХИ', 'FOR THE SELECTED EPOCH')}
              </h4>
              {currentSources.map((id) => (
                <a
                  className="source-row"
                  key={id}
                  href={sources[id].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div>
                    <strong>{sources[id].title}</strong>
                    <p>{pick(sources[id].note, lang)}</p>
                  </div>
                  <ArrowUpRight />
                </a>
              ))}
              <details>
                <summary>
                  {t('Все источники и лицензии', 'All sources and licences')}
                </summary>
                {Object.entries(sources)
                  .filter(([id]) => !currentSources.includes(id))
                  .map(([id, s]) => (
                    <a
                      className="source-row"
                      key={id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div>
                        <strong>{s.title}</strong>
                        <p>{pick(s.note, lang)}</p>
                      </div>
                      <ArrowUpRight />
                    </a>
                  ))}
                <p className="method-note">
                  PALEOMAP © Christopher R. Scotese.{' '}
                  {t(
                    'Карты уменьшены для веба. Контур будущей суши оцифрован из рис. 1e Farnsworth et al. (2023), цвета условные.',
                    'Maps resized for the web. Future land outline digitised from Fig. 1e, Farnsworth et al. (2023); colours are schematic.',
                  )}{' '}
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    CC BY 4.0
                  </a>
                  .{' '}
                  {t(
                    'Оформление TERRA; карточка для соцсетей создана с помощью ИИ.',
                    'TERRA design; social preview artwork is AI-generated.',
                  )}
                </p>
              </details>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
