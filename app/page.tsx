'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
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
  BookOpen,
  Orbit,
  Info,
  Cloud,
  Search,
  Check,
  Maximize2,
  Minimize2,
  Leaf,
  Headphones,
  Monitor,
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
import NarrationPlayer, { type NarrationHandle } from './narration-player';
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
import { surfaceAt } from './planet-model';
import { estimatedAt } from './estimates';
export default function Home() {
  const [desktop, setDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const media = matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  if (desktop === null) return <div className="device-loading" />;
  if (!desktop)
    return (
      <main className="desktop-placeholder">
        <a className="brand" href="/" aria-label="Terra">
          <Orbit />
          <span>
            TERRA<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="desktop-placeholder-icon">
          <Monitor aria-hidden="true" />
        </div>
        <h1>Большой мир — на большом экране</h1>
        <p>
          Откройте TERRA на компьютере, чтобы исследовать Землю и путешествовать
          по её истории.
        </p>
        <div lang="en">
          <h2>A whole world needs a bigger screen</h2>
          <p>
            Open TERRA on your computer to explore Earth and travel through its
            history.
          </p>
        </div>
      </main>
    );
  return <Observatory />;
}
function Observatory() {
  const [globeJump, setGlobeJump] = useState(0);
  const narrationRef = useRef<NarrationHandle>(null);
  const [lang, setLang] = useState<Lang>('ru'),
    [year, setYear] = useState(NOW),
    [rotation, setRotation] = useState(true),
    [clouds, setClouds] = useState(true),
    [zoom, setZoom] = useState(0),
    [reset, setReset] = useState(0),
    [scenario, setScenario] = useState(1),
    [modal, setModal] = useState<'sources' | 'epochs' | 'details' | null>(null),
    [search, setSearch] = useState(''),
    [full, setFull] = useState(false);
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
    const fn = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);
  const map = useMemo(() => surfaceAt(year), [year]);
  const inferred = estimatedAt(year);
  const rawPop = populationAt(year),
    pop = inferred.population,
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
        : epoch.temp === '—'
          ? '≈' + number(inferred.temperature, 1)
          : epoch.temp;
  const temperatureText =
    lang === 'ru' ? temperature.replace(/\./g, ',') : temperature;
  const oceanInferred = !modern;
  const ocean = modern ? '71' : '≈' + number(inferred.ocean, 1);
  const oxygenInferred = epoch.oxygen === '—';
  const oxygen = oxygenInferred
    ? '≈' + number(inferred.oxygen, 2)
    : lang === 'ru'
      ? epoch.oxygen.replace('.', ',')
      : epoch.oxygen;
  const reconstructionNote = t(
    'ИИ-реконструкция · ненадёжные данные',
    'AI reconstruction · uncertain data',
  );
  const mapNote =
    year >= MAX
      ? t(
          'Земля поглощена Солнцем · возможный сценарий',
          'Earth engulfed by the Sun · possible scenario',
        )
      : map.modern === 1
        ? t(
            'NASA · поверхность 8K · огни по эпохе',
            'NASA · 8K surface · lights by era',
          )
        : map.inferred
          ? t(
              'ИИ-реконструкция географии · условные переходы',
              'AI geography reconstruction · illustrative transitions',
            )
          : t(
              'PALEOMAP · интерполяция берегов, условный рельеф',
              'PALEOMAP · interpolated coasts, illustrative relief',
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
      unit: '°C',
      inferred: !nearFuture && inferred.inferredTemperature,
      note: nearFuture
        ? `${scenarios[scenario].ssp} · ${t('сценарная оценка', 'scenario estimate')}`
        : year >= 2025 && year <= NOW
          ? t('Последний полный год · 2025', 'Latest complete year · 2025')
          : inferred.inferredTemperature
            ? reconstructionNote
            : t('Ориентир для эпохи', 'Approximate epoch value'),
    },
    {
      icon: Users,
      title: t('Население людей', 'Human population'),
      value: (rawPop === null ? '≈' : '') + popValue,
      inferred: rawPop === null,
      unit: popUnit,
      note:
        rawPop === null
          ? reconstructionNote
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
      unit: '%',
      inferred: oceanInferred,
      note: oceanInferred
        ? reconstructionNote
        : year >= 2000002026
          ? t('Сценарий потери океанов', 'Ocean-loss scenario')
          : t('Доля поверхности', 'Fraction of the surface'),
    },
    {
      icon: Wind,
      title: t('Кислород в атмосфере', 'Atmospheric oxygen'),
      value: oxygen,
      unit: '%',
      inferred: oxygenInferred,
      note: oxygenInferred
        ? reconstructionNote
        : t(
            'Объёмная доля · ориентир эпохи',
            'Volume fraction · epoch estimate',
          ),
    },
  ];
  return (
    <main
      className={`observatory ${future ? 'future' : ''} ${map.heat > 0.45 ? 'hot-world' : ''}`}
    >
      <header className="topbar">
        <a className="brand" href="/" aria-label="Terra">
          <Orbit />
          <span>
            TERRA<span className="brand-dot">.</span>
          </span>
        </a>
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
                className={`stat-number ${s.value.length > 6 ? 'compact-number' : ''} ${s.inferred ? 'inferred' : ''}`}
              >
                {s.value}
                <small>{s.unit}</small>
              </div>
              <p className={s.inferred ? 'inference-note' : undefined}>
                {s.note}
              </p>
            </button>
          ))}
        </aside>
        <Globe
          jump={globeJump}
          year={year}
          clouds={clouds}
          rotate={rotation}
          zoom={zoom}
          reset={reset}
          lang={lang}
          warming={nearFuture ? warmingAt(year, scenario) : 0}
        />
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
            title={t('Показать облака', 'Show clouds')}
            aria-label={t('Показать облака', 'Show clouds')}
            className={clouds ? 'active' : ''}
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
        <div className="globe-hint">
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
            <div className="date-button">
              <h3>
                {date.value}
                <small>{date.unit}</small>
              </h3>
            </div>
          </div>
          <NarrationPlayer
            ref={narrationRef}
            year={year}
            lang={lang}
            onNavigate={navigate}
            onStartTour={(year) => {
              setGlobeJump((value) => value + 1);
              navigate(year);
            }}
          />
          <div className="time-controls">
            <Button
              className="full-story-button"
              onClick={() => narrationRef.current?.startTour()}
            >
              <Headphones />
              {t('Слушать всю историю', 'Listen to the full story')}
            </Button>
            <Button
              variant="outline"
              className="now-button"
              onClick={() => {
                setGlobeJump((value) => value + 1);
                navigate(NOW);
              }}
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
            {t(
              `${epochs.length} ЭПОХ · 15 АУДИОГЛАВ`,
              `${epochs.length} EPOCHS · 15 AUDIO CHAPTERS`,
            )}
          </span>
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
        <DialogContent className="terra-dialog">
          <DialogTitle>
            {modal === 'epochs'
              ? t('Атлас времени', 'An atlas of time')
              : modal === 'details'
                ? t('За каждым числом — контекст', 'Every number has a context')
                : t('Наука за путешествием', 'The science behind the journey')}
          </DialogTitle>
          <DialogDescription>
            {modal === 'epochs'
              ? t(
                  `${epochs.length} коротких глав о нашем единственном доме.`,
                  `${epochs.length} short chapters about our only home.`,
                )
              : t(
                  'Наблюдения, реконструкции и сценарии — с обозначенными границами знания.',
                  'Observations, reconstructions and scenarios, with their limits made explicit.',
                )}
          </DialogDescription>
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
                    <strong className={s.inferred ? 'inferred' : undefined}>
                      {s.value} {s.unit}
                    </strong>
                    <p className={s.inferred ? 'inference-note' : undefined}>
                      {s.note}
                    </p>
                  </div>
                ))}
              </div>
              <dl>
                <div>
                  <dt>CO₂</dt>
                  <dd className={epoch.co2 === '—' ? 'inferred' : undefined}>
                    {epoch.co2 === '—'
                      ? '≈' + number(inferred.co2, 0)
                      : epoch.co2}{' '}
                    ppm{' '}
                    {epoch.co2 === '—' && (
                      <small className="inferred">{reconstructionNote}</small>
                    )}
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
                  'Серые числа со знаком ≈ — ИИ-реконструкция, а не научные измерения. Пропуски заполнены интерполяцией и условными опорными значениями. После 2100 население показано как условный сценарий снижения, а не прогноз ООН: действительное будущее неизвестно. Для 2026 используется температура полного 2025 года.',
                  'Grey values marked ≈ are AI reconstructions, not scientific measurements. Gaps use interpolation and hypothetical anchor values. Population after 2100 is an illustrative declining scenario, not a UN forecast; the actual future is unknown. The 2026 view uses the complete 2025 temperature.',
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
              <p className="moon-method">
                {t(
                  'Луна появляется около 4,5 млрд лет назад, остывает и постепенно приобретает кратеры и тёмные вулканические моря. Древний вид условный; современная карта — NASA Scientific Visualization Studio / LRO. Размер относительно Земли сохранён, расстояние сжато для наглядности. Будущий нагрев и исчезновение вместе с Землёй — иллюстрация выбранного солнечного сценария, а не расчёт лунной орбиты.',
                  'The Moon appears around 4.5 billion years ago, cools, and gradually develops craters and dark volcanic plains. Ancient surfaces are illustrative; the modern map is from NASA Scientific Visualization Studio / LRO. Relative size is preserved; distance is compressed for visibility. Future heating and disappearance with Earth illustrate the selected solar scenario, not a calculated lunar orbit.',
                )}{' '}
                <a
                  href="https://science.nasa.gov/moon/formation/"
                  target="_blank"
                  rel="noreferrer"
                >
                  NASA · {t('Происхождение', 'Formation')}
                </a>{' '}
                ·{' '}
                <a
                  href="https://science.nasa.gov/moon/facts/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('Эволюция', 'Evolution')}
                </a>{' '}
                ·{' '}
                <a
                  href="https://svs.gsfc.nasa.gov/4720/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LRO CGI Moon Kit
                </a>
              </p>
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
                      'Береговые линии плавно интерполируются между картами PALEOMAP; фактура рельефа стилизована под современную Землю. До 750 млн лет назад и в далёком будущем участки суши условные: это ИИ-реконструкция, не восстановленная тектоника. Уменьшение льда, высыхание океанов и нагрев плавно меняют одну и ту же модель.',
                      'Coastlines interpolate smoothly between PALEOMAP maps; relief textures are styled to match modern Earth. Before 750 million years ago and in the deep future, land is hypothetical: an AI reconstruction, not recovered tectonics. Ice retreat, ocean loss and heating gradually change the same globe.',
                    )}
                  </p>
                  <p>
                    {t(
                      'Современная поверхность — NASA Blue Marble (2004), 8K, рельеф GEBCO. Остальные эпохи — 4K с условным мелким рельефом. Движение берегов рассчитано между реконструкциями, а не физической моделью тектоники. До 1882 года искусственное свечение скрыто. Затем показаны выборочные подтверждённые очаги: Лондон и Нью-Йорк с 1882-го, Токио с 1887-го. Это усиленные отметки, не полная карта освещения. Спутниковая карта ночных огней 2016 года появляется только с 2016-го. Её затухание после 2100 года условно. География далёкого будущего — один из сценариев.',
                      'Modern surface: NASA Blue Marble (2004), 8K, with GEBCO relief. Other eras use 4K maps with illustrative fine relief. Registered coast motion is not a physical tectonic model. Artificial glow is hidden before 1882. Selected documented locations then appear: London and New York from 1882, Tokyo from 1887. These are amplified markers, not complete historical lighting maps. The 2016 satellite night map only appears from 2016. Its decline after 2100 is hypothetical. Deep-future geography illustrates one scenario.',
                    )}
                  </p>
                  <p className="light-sources">
                    <a
                      href="https://www.tepco.co.jp/shiryokan/virtualtour/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TEPCO
                    </a>
                    {' · '}
                    <a
                      href="https://www.tepco.co.jp/shiryokan/floor/index-j.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Tokyo · 1887
                    </a>
                    {' · '}
                    <a
                      href="https://edison.rutgers.edu/life-of-edison/chronology/1881-1890"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Edison Papers · 1882
                    </a>
                    {' · '}
                    <a
                      href="https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NASA · 2016
                    </a>
                  </p>
                </div>
              </div>
              <p className="narration-credit">
                {t('Голос George · Озвучка: ', 'George voice · Narration: ')}
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  elevenlabs.io
                </a>
              </p>
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
