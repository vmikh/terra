export type Lang = 'ru' | 'en';
export type Pair = [string, string];
export const NOW = 2026,
  MIN = -4540000000,
  MAX = 7600002026;
export type Epoch = {
  year: number;
  title: Pair;
  headline: Pair;
  body: Pair;
  life: Pair;
  period: Pair;
  temp: string;
  oxygen: string;
  population: number | null;
  co2: string;
  source: string[];
};
const E = (
  year: number,
  title: Pair,
  headline: Pair,
  body: Pair,
  life: Pair,
  period: Pair,
  temp = '—',
  oxygen = '—',
  population: number | null = 0,
  co2 = '—',
  source = ['history'],
): Epoch => ({
  year,
  title,
  headline,
  body,
  life,
  period,
  temp,
  oxygen,
  population,
  co2,
  source,
});
export const epochs: Epoch[] = [
  E(
    MIN,
    ['Рождение Земли', 'Birth of Earth'],
    ['Всё начинается с пыли.', 'It all begins with dust.'],
    [
      'Вокруг молодого Солнца сталкиваются каменные тела. Они собираются в горячую протопланету: тяжёлое железо опускается к ядру, более лёгкие породы остаются сверху. Поверхность периодически плавится от ударов. Ни океанов, ни устойчивой коры, ни известной жизни ещё нет. Это этап формирования, а не событие с точной датой.',
      'Rocky bodies collide around the young Sun, building a hot protoplanet. Heavy iron sinks toward the core while lighter rock rises. Impacts repeatedly melt the surface. There are no oceans, no lasting crust and no known life. Formation is a process, not an event with an exact date.',
    ],
    ['Жизнь не известна', 'No known life'],
    ['Катархей', 'Hadean'],
    '>1 000',
    '≈0',
    0,
    '—',
    ['formation'],
  ),
  E(
    -4500000000,
    ['Рождение Луны', 'Birth of the Moon'],
    ['Столкновение, которое изменило всё.', 'A collision changes everything.'],
    [
      'Согласно ведущей гипотезе, молодая Земля сталкивается с крупным телом. Из выброшенного вещества формируется Луна. Удары и радиоактивный распад поддерживают океан магмы. Луна пока гораздо ближе; приливы сильнее современных. Геометрия столкновения и его точное время остаются предметом исследований.',
      'In the leading hypothesis, a large body strikes the young Earth. Ejected material forms the Moon. Impacts and radioactive decay sustain a magma ocean. The Moon is much closer and tides are stronger. The impact geometry and exact timing remain active research questions.',
    ],
    ['Жизнь не известна', 'No known life'],
    ['Катархей', 'Hadean'],
    '>1 000',
    '≈0',
    0,
    '—',
    ['formation'],
  ),
  E(
    -4400000000,
    ['Первые океаны', 'The first oceans'],
    ['Камень остывает. Вода остаётся.', 'Rock cools. Water stays.'],
    [
      'Древнейшие цирконы указывают на взаимодействие пород с жидкой водой уже около 4,4 млрд лет назад. Между крупными ударами поверхность могла остывать, а водяной пар выпадать дождями. Атмосфера почти лишена свободного кислорода. Размер и расположение первых участков суши восстановить надёжно нельзя.',
      'Ancient zircons suggest rock interacted with liquid water around 4.4 billion years ago. Between major impacts, the surface could cool and water vapour could condense into rain. The atmosphere has almost no free oxygen. The extent and location of the first land cannot be reliably reconstructed.',
    ],
    ['Свидетельств жизни нет', 'No established life evidence'],
    ['Катархей', 'Hadean'],
    '—',
    '≈0',
    0,
    '—',
    ['formation'],
  ),
  E(
    -3800000000,
    ['Ранняя биосфера', 'An early biosphere'],
    ['Жизнь оставляет едва заметные следы.', 'Life leaves faint traces.'],
    [
      'В древних породах встречаются изотопные сигналы, которые иногда связывают с жизнью. Их происхождение спорно: геологические процессы тоже способны создавать похожие следы. Если жизнь уже существует, это простые микробные сообщества в воде. Солнце слабее современного, а парниковые газы помогают океану оставаться жидким.',
      'Ancient rocks contain isotope signals sometimes linked to life. Their origin is debated because geological processes can produce similar traces. If life already exists, it consists of simple aquatic microbes. A fainter Sun is offset by greenhouse gases that help keep the ocean liquid.',
    ],
    ['Возможные ранние микробы', 'Possible early microbes'],
    ['Архей', 'Archean'],
    '—',
    '≈0',
  ),
  E(
    -3500000000,
    ['Планета микробов', 'A microbial planet'],
    [
      'Крошечные организмы. Огромное будущее.',
      'Tiny organisms. An immense future.',
    ],
    [
      'Микробные сообщества строят слоистые структуры: строматолиты. Бактерии и археи осваивают химическую энергию, некоторые используют свет. Суша остаётся без лесов и животных. Миллиарды лет самые важные преобразования планеты будут происходить в мире, невидимом невооружённым глазом.',
      'Microbial communities build layered structures called stromatolites. Bacteria and archaea exploit chemical energy, and some use sunlight. Land has no forests or animals. For billions of years, the planet’s greatest transformations will happen in a world invisible to the naked eye.',
    ],
    [
      'Бактерии · Археи · Микробные маты',
      'Bacteria · Archaea · Microbial mats',
    ],
    ['Архей', 'Archean'],
    '—',
    '≈0',
  ),
  E(
    -2400000000,
    ['Кислородная революция', 'The Great Oxidation'],
    ['Жизнь меняет атмосферу.', 'Life changes the atmosphere.'],
    [
      'Кислород, выделяемый фотосинтезирующими микробами, начинает накапливаться в атмосфере. Для многих анаэробов он токсичен, но открывает путь более энергоэффективному обмену веществ. Меняется химия океанов и минералов. Это длительный переход с колебаниями, а не мгновенное появление современного воздуха.',
      'Oxygen released by photosynthetic microbes begins accumulating in the atmosphere. It is toxic to many anaerobes but enables more energy-efficient metabolism. Ocean chemistry and minerals change. This is a prolonged, fluctuating transition, not the sudden appearance of modern air.',
    ],
    ['Цианобактерии · Анаэробы', 'Cyanobacteria · Anaerobes'],
    ['Протерозой · Палеопротерозой', 'Proterozoic · Paleoproterozoic'],
    '—',
    '<1',
    0,
    '—',
    ['oxygen'],
  ),
  E(
    -2200000000,
    ['Большое оледенение', 'A great glaciation'],
    ['Молодой мир подо льдом.', 'A young world under ice.'],
    [
      'Гуронские оледенения сопровождают перестройку атмосферы. Уменьшение метана могло ослабить парниковый эффект при ещё тусклом Солнце. Ледники распространяются широко, хотя точная степень оледенения спорна. Микробы переживают холод в океане и убежищах; глобальную температуру этого времени нельзя указать уверенно.',
      'Huronian glaciations accompany atmospheric change. A decline in methane may weaken the greenhouse effect under a still-faint Sun. Ice spreads widely, though its exact extent is debated. Microbes survive in ocean refuges; a confident global temperature is unavailable.',
    ],
    ['Микробные сообщества', 'Microbial communities'],
    ['Протерозой · Палеопротерозой', 'Proterozoic · Paleoproterozoic'],
  ),
  E(
    -1800000000,
    ['Сложная клетка', 'The complex cell'],
    ['Новая архитектура жизни.', 'A new architecture for life.'],
    [
      'В летописи ископаемых появляются убедительные признаки эукариот: клеток с ядром. Союз древних клеток дал начало митохондриям, энергетическим органеллам. Эти изменения в будущем позволят появиться водорослям, грибам, растениям и животным. Пока биосфера остаётся преимущественно микробной.',
      'The fossil record shows convincing evidence of eukaryotes: cells with nuclei. Ancient cellular partnerships gave rise to mitochondria, the cell’s energy-producing organelles. These changes will eventually enable algae, fungi, plants and animals. For now, the biosphere remains predominantly microbial.',
    ],
    ['Бактерии · Археи · Эукариоты', 'Bacteria · Archaea · Eukaryotes'],
    ['Протерозой · Палеопротерозой', 'Proterozoic · Paleoproterozoic'],
  ),
  E(
    -1000000000,
    ['Родиния', 'Rodinia'],
    ['Континенты собираются вместе.', 'Continents come together.'],
    [
      'Большая часть суши объединяется в суперконтинент Родиния. В морях живут разнообразные микробы и водоросли; многоклеточность развивается независимо в разных линиях. На суше ещё нет привычной растительности. Положение древних блоков материков реконструируется с большой неопределённостью.',
      'Much of the land joins into the supercontinent Rodinia. Seas host diverse microbes and algae; multicellularity evolves independently in different lineages. Land still lacks familiar vegetation. The arrangement of these ancient continental blocks has substantial uncertainty.',
    ],
    ['Водоросли · Микроорганизмы', 'Algae · Microorganisms'],
    ['Протерозой · Тоний', 'Proterozoic · Tonian'],
  ),
  E(
    -720000000,
    ['Земля-снежок', 'Snowball Earth'],
    ['Лёд почти до экватора.', 'Ice almost to the equator.'],
    [
      'В криогении Земля переживает два чрезвычайно сильных оледенения, разделённых потеплением. Ледники достигают низких широт. Вулканический CO₂ постепенно накапливается, помогая выйти из замерзания. Жизнь сохраняется в океане; открытая вода и подлёдные убежища в разных моделях выглядят по-разному.',
      'During the Cryogenian, Earth experiences two extreme glaciations separated by warming. Glaciers reach low latitudes. Volcanic CO₂ gradually builds up, helping end the frozen state. Life persists in the ocean; open-water and under-ice refuges differ between models.',
    ],
    ['Водоросли · Микробные маты', 'Algae · Microbial mats'],
    ['Протерозой · Криогений', 'Proterozoic · Cryogenian'],
    '—',
    '—',
    0,
    '—',
    ['snowball'],
  ),
  E(
    -635000000,
    ['Первые большие организмы', 'The first large organisms'],
    ['Океан обретает новые формы.', 'The ocean takes new shapes.'],
    [
      'После криогенного льда мир постепенно теплеет. В эдиакарских морях позднее распространяются крупные мягкотелые организмы: диски, ветвящиеся формы и ранние животные. Их родство с современной жизнью не всегда ясно. Экосистемы становятся сложнее задолго до появления динозавров или деревьев.',
      'After Cryogenian ice, the world gradually warms. Large soft-bodied organisms later spread through Ediacaran seas: discs, branching forms and early animals. Their relationship to modern life is not always clear. Ecosystems become more complex long before dinosaurs or trees.',
    ],
    ['Водоросли · Мягкотелые организмы', 'Algae · Soft-bodied organisms'],
    ['Протерозой · Эдиакарий', 'Proterozoic · Ediacaran'],
  ),
  E(
    -539000000,
    ['Кембрийский взрыв', 'The Cambrian explosion'],
    ['Жизнь пробует почти всё.', 'Life experiments with almost everything.'],
    [
      'В морях быстро по геологическим меркам разнообразятся животные. Появляются многочисленные панцири, глаза, активные хищники и сложные пищевые сети. Трилобиты ползают по дну, древние членистоногие плавают над ними. Большая часть суши остаётся почти пустой. Это растянутое на миллионы лет разнообразие, а не один «взрыв».',
      'Animals diversify rapidly on geological timescales. Shells, eyes, active predators and complex food webs become widespread. Trilobites roam the seafloor beneath swimming arthropods. Most land remains nearly empty. This diversification spans millions of years rather than a single explosive event.',
    ],
    ['Трилобиты · Губки · Членистоногие', 'Trilobites · Sponges · Arthropods'],
    ['Фанерозой · Кембрий', 'Phanerozoic · Cambrian'],
  ),
  E(
    -485000000,
    ['Моря полны жизни', 'Seas full of life'],
    ['Эволюция набирает глубину.', 'Evolution deepens.'],
    [
      'В ордовике морское биоразнообразие резко растёт. Рифы, брахиоподы, головоногие и ранние рыбы занимают новые ниши. Крошечные растения начинают осваивать сушу. В конце периода похолодание и падение уровня моря приведут к одному из крупнейших массовых вымираний.',
      'Marine biodiversity expands during the Ordovician. Reefs, brachiopods, cephalopods and early fish occupy new niches. Small plants begin colonising land. At the period’s end, cooling and falling sea level will contribute to a major mass extinction.',
    ],
    ['Брахиоподы · Головоногие · Рыбы', 'Brachiopods · Cephalopods · Fish'],
    ['Фанерозой · Ордовик', 'Phanerozoic · Ordovician'],
    '≈25–35',
    '—',
    0,
    '—',
    ['temperature', 'history'],
  ),
  E(
    -444000000,
    ['Выход на сушу', 'Onto the land'],
    ['Берега становятся зелёными.', 'The shore turns green.'],
    [
      'После ордовикского вымирания морские сообщества восстанавливаются. В силуре распространяются небольшие сосудистые растения, а членистоногие осваивают сушу. Рыбы с челюстями разнообразятся. Почвы и наземные пищевые цепи только начинают приобретать знакомый облик.',
      'Marine communities recover after the Ordovician extinction. Small vascular plants spread in the Silurian, while arthropods colonise land. Jawed fish diversify. Soils and terrestrial food webs are only beginning to take familiar shapes.',
    ],
    [
      'Сосудистые растения · Рыбы · Членистоногие',
      'Vascular plants · Fish · Arthropods',
    ],
    ['Фанерозой · Силур', 'Phanerozoic · Silurian'],
  ),
  E(
    -419000000,
    ['Век рыб и первых лесов', 'Fish and the first forests'],
    ['У планеты появляются леса.', 'The planet grows forests.'],
    [
      'Девонские моря населены панцирными и костными рыбами. На суше вырастают первые леса: корни ускоряют выветривание, меняют почвы и круговорот углерода. К концу периода некоторые позвоночные выходят на мелководье и сушу. Несколько кризисов резко сокращают морское разнообразие.',
      'Devonian seas teem with armoured and bony fish. The first forests rise on land: roots accelerate weathering and alter soils and the carbon cycle. By the late Devonian, some vertebrates venture into shallows and onto land. Several crises sharply reduce marine diversity.',
    ],
    [
      'Рыбы · Первые леса · Ранние четвероногие',
      'Fish · Early forests · Early tetrapods',
    ],
    ['Фанерозой · Девон', 'Phanerozoic · Devonian'],
  ),
  E(
    -359000000,
    ['Угольные леса', 'Coal forests'],
    [
      'Болота, из которых вырастет индустрия.',
      'Swamps that will fuel an industrial world.',
    ],
    [
      'В каменноугольном периоде экваториальные заболоченные леса накапливают растительные остатки: из них образуется уголь. Кислорода временами больше, чем сегодня; среди членистоногих встречаются гиганты. На юге лежат ледники. Появляются амниоты, способные размножаться вдали от открытой воды.',
      'Equatorial swamp forests accumulate plant remains that will become coal. Oxygen is at times higher than today, and some arthropods reach giant sizes. Ice sheets occupy southern land. Amniotes emerge, able to reproduce away from open water.',
    ],
    ['Плауны · Папоротники · Земноводные', 'Lycopsids · Ferns · Amphibians'],
    ['Фанерозой · Карбон', 'Phanerozoic · Carboniferous'],
    '—',
    '≈25–35',
    0,
    '—',
    ['history'],
  ),
  E(
    -299000000,
    ['Пангея', 'Pangaea'],
    [
      'Один материк. Один огромный океан.',
      'One continent. One enormous ocean.',
    ],
    [
      'Материки объединены в Пангею, окружённую Панталассой. Далеко от влажных побережий простираются сезонные и засушливые области. Семенные растения и синапсиды, дальние родственники млекопитающих, занимают сушу. Океанские и атмосферные течения устроены иначе, чем сегодня.',
      'Continents form Pangaea, surrounded by Panthalassa. Seasonal and arid landscapes stretch far from moist coasts. Seed plants and synapsids, distant relatives of mammals, occupy the land. Ocean and atmospheric circulation differ greatly from today.',
    ],
    ['Семенные растения · Синапсиды', 'Seed plants · Synapsids'],
    ['Фанерозой · Пермь', 'Phanerozoic · Permian'],
  ),
  E(
    -252000000,
    ['Великое вымирание', 'The Great Dying'],
    ['Биосфера на грани.', 'The biosphere at the brink.'],
    [
      'Масштабный вулканизм Сибирских траппов сопровождается выбросами парниковых газов. Планета быстро теплеет, океан теряет кислород и закисляется. Исчезает подавляющая доля морских видов и множество наземных групп. Восстановление сложных экосистем займёт миллионы лет.',
      'Massive Siberian Traps volcanism releases greenhouse gases. Earth warms rapidly while oceans lose oxygen and become more acidic. Most marine species and many terrestrial groups disappear. Complex ecosystems will take millions of years to recover.',
    ],
    [
      'Выжившие моллюски · Микробы · Терапсиды',
      'Surviving molluscs · Microbes · Therapsids',
    ],
    [
      'Фанерозой · Граница перми и триаса',
      'Phanerozoic · Permian–Triassic boundary',
    ],
    '≈30–35',
    '—',
    0,
    '—',
    ['extinction', 'temperature'],
  ),
  E(
    -230000000,
    ['Первые динозавры', 'The first dinosaurs'],
    ['Новая жизнь после катастрофы.', 'New life after catastrophe.'],
    [
      'В триасовом мире появляются ранние динозавры и первые млекопитающие. Пангея ещё объединяет сушу, её внутренние области сухие и сезонные. Крокодиловые родственники, морские рептилии и хвойные разнообразятся. Динозавры пока лишь одна из нескольких успешных групп.',
      'Early dinosaurs and the first mammals appear in the Triassic. Pangaea still unites the land, with dry and seasonal interiors. Crocodile relatives, marine reptiles and conifers diversify. Dinosaurs are still only one of several successful groups.',
    ],
    [
      'Ранние динозавры · Хвойные · Рептилии',
      'Early dinosaurs · Conifers · Reptiles',
    ],
    ['Фанерозой · Триас', 'Phanerozoic · Triassic'],
  ),
  E(
    -201000000,
    ['Мир динозавров', 'The dinosaur world'],
    ['Пангея раскалывается.', 'Pangaea breaks apart.'],
    [
      'После очередного массового вымирания динозавры становятся ведущими крупными наземными животными. Раскол Пангеи открывает молодую Атлантику. В тёплом мире растут хвойные, саговники и папоротники; гигантские зауроподы бродят по суше. В юре появятся и первые птицы.',
      'After another mass extinction, dinosaurs become the leading large land animals. Pangaea’s breakup opens a young Atlantic. Conifers, cycads and ferns grow in a warm world, and giant sauropods roam the land. The first birds will also appear during the Jurassic.',
    ],
    ['Динозавры · Аммониты · Хвойные', 'Dinosaurs · Ammonites · Conifers'],
    ['Фанерозой · Юра', 'Phanerozoic · Jurassic'],
  ),
  E(
    -145000000,
    ['Цветущая планета', 'A flowering planet'],
    ['Цветы меняют правила игры.', 'Flowers change the game.'],
    [
      'В меловом периоде цветковые растения распространяются и создают новые связи с насекомыми. Континенты расходятся, мелководные моря затапливают большие площади. К середине периода климат становится чрезвычайно тёплым. Птицы и млекопитающие разнообразятся в тени крупных динозавров.',
      'Flowering plants spread through the Cretaceous, forming new partnerships with insects. Continents separate and shallow seas flood broad areas. By the mid-Cretaceous, climate becomes extremely warm. Birds and mammals diversify alongside large dinosaurs.',
    ],
    [
      'Цветковые · Динозавры · Насекомые',
      'Flowering plants · Dinosaurs · Insects',
    ],
    ['Фанерозой · Мел', 'Phanerozoic · Cretaceous'],
  ),
  E(
    -90000000,
    ['Парниковая Земля', 'Greenhouse Earth'],
    ['Тепло от полюса до полюса.', 'Warmth from pole to pole.'],
    [
      'Уровень моря высок, а полярные области гораздо теплее современных. На месте привычных континентальных равнин разливаются внутренние моря. Реконструкции глобальной температуры показывают один из максимумов последних сотен миллионов лет. Высокий CO₂ поддерживает климат без современных крупных ледяных щитов.',
      'Sea level is high and polar regions are far warmer than today. Inland seas cover familiar continental plains. Global temperature reconstructions indicate one of the warmest intervals of the past several hundred million years. High CO₂ sustains a climate without today’s large ice sheets.',
    ],
    [
      'Динозавры · Планктон · Цветковые',
      'Dinosaurs · Plankton · Flowering plants',
    ],
    ['Фанерозой · Поздний мел', 'Phanerozoic · Late Cretaceous'],
    '≈30–36',
    '—',
    0,
    '—',
    ['temperature'],
  ),
  E(
    -66000000,
    ['После астероида', 'After the asteroid'],
    ['Конец одной эры. Начало другой.', 'One era ends. Another begins.'],
    [
      'Удар астероида у нынешнего Юкатана поднимает пыль и аэрозоли, перекрывающие солнечный свет. Пищевые цепи рушатся. Нептичьи динозавры исчезают вместе со многими морскими организмами; птицы, небольшие млекопитающие и другие выжившие постепенно осваивают освободившиеся ниши.',
      'An asteroid impact near present-day Yucatán lofts dust and aerosols that block sunlight. Food webs collapse. Non-avian dinosaurs disappear along with many marine organisms. Birds, small mammals and other survivors gradually occupy newly available niches.',
    ],
    ['Птицы · Млекопитающие · Цветковые', 'Birds · Mammals · Flowering plants'],
    ['Фанерозой · Палеоген', 'Phanerozoic · Paleogene'],
    '—',
    '—',
    0,
    '—',
    ['extinction'],
  ),
  E(
    -56000000,
    ['Древнее быстрое потепление', 'An ancient rapid warming'],
    ['Углерод меняет климат. Снова.', 'Carbon changes the climate. Again.'],
    [
      'Палеоцен-эоценовый термический максимум связан с большим поступлением углерода в океан и атмосферу. Глобальная температура резко растёт по геологическим меркам, океан закисляется, виды мигрируют. Событие длится тысячи лет; современный выброс углерода происходит значительно быстрее.',
      'The Paleocene–Eocene Thermal Maximum involves a major release of carbon into the ocean and atmosphere. Global temperature rises sharply on geological timescales, oceans acidify and species migrate. The event unfolds over thousands of years; modern carbon emissions occur much faster.',
    ],
    [
      'Приматы · Млекопитающие · Тропические леса',
      'Primates · Mammals · Tropical forests',
    ],
    ['Фанерозой · Эоцен', 'Phanerozoic · Eocene'],
    '≈27–32',
    '—',
    0,
    '—',
    ['temperature'],
  ),
  E(
    -34000000,
    ['Антарктида замерзает', 'Antarctica freezes'],
    ['Белый континент рождается заново.', 'A white continent emerges.'],
    [
      'Снижение CO₂ и изменения океанической циркуляции сопровождают похолодание. На Антарктиде быстро растёт крупный ледяной щит. Уровень моря падает, экосистемы перестраиваются. Тёплый мир эоцена уступает более прохладному климатическому режиму кайнозоя.',
      'Falling CO₂ and changes in ocean circulation accompany cooling. A large Antarctic ice sheet expands rapidly. Sea level falls and ecosystems reorganise. The warm Eocene world gives way to the cooler climate regime of the later Cenozoic.',
    ],
    ['Млекопитающие · Птицы · Леса', 'Mammals · Birds · Forests'],
    ['Фанерозой · Олигоцен', 'Phanerozoic · Oligocene'],
  ),
  E(
    -23000000,
    ['Мир трав и млекопитающих', 'Grasses and mammals'],
    ['Открытые пространства, новые пути.', 'Open landscapes, new paths.'],
    [
      'В неогене во многих регионах расширяются травянистые ландшафты. Разнообразятся пасущиеся млекопитающие и их хищники, эволюционируют человекообразные обезьяны. Подъём гор и изменения течений влияют на дожди. Климат колеблется, но в долгосрочной перспективе движется к более холодному миру.',
      'Grass-dominated landscapes expand in many regions during the Neogene. Grazing mammals and their predators diversify, while apes evolve. Mountain building and shifting currents alter rainfall. Climate fluctuates but trends toward a cooler world over the long term.',
    ],
    ['Травы · Млекопитающие · Человекообразные', 'Grasses · Mammals · Apes'],
    ['Фанерозой · Неоген', 'Phanerozoic · Neogene'],
  ),
  E(
    -2600000,
    ['Ледниковый ритм', 'The rhythm of ice ages'],
    ['Планета дышит льдом.', 'The planet breathes in ice.'],
    [
      'В плейстоцене ледниковые эпохи сменяются межледниковьями под влиянием орбитальных циклов и климатических обратных связей. Ледяные щиты неоднократно покрывают северные материки. Представители рода Homo расселяются, делают каменные орудия и постепенно меняют отношения с окружающей средой.',
      'Pleistocene glacial periods alternate with interglacials under orbital cycles and climate feedbacks. Ice sheets repeatedly cover northern continents. Members of the genus Homo disperse, make stone tools and gradually change their relationship with the environment.',
    ],
    ['Мегафауна · Homo · Холодные степи', 'Megafauna · Homo · Cold steppes'],
    ['Фанерозой · Плейстоцен', 'Phanerozoic · Pleistocene'],
  ),
  E(
    -300000,
    ['Появление Homo sapiens', 'Homo sapiens emerges'],
    ['Мы входим в историю.', 'We enter the story.'],
    [
      'В Африке появляются ранние Homo sapiens. Рядом существуют другие человеческие линии. Люди охотятся, собирают растения, используют огонь и сложные орудия. Современные материки уже узнаваемы, но уровень моря и границы льда меняются вместе с климатическими циклами. Численность людей известна очень приблизительно.',
      'Early Homo sapiens appear in Africa alongside other human lineages. People hunt, gather plants, use fire and make complex tools. Continents are recognisable, but sea level and ice boundaries vary with climate cycles. Human population size is highly uncertain.',
    ],
    [
      'Homo sapiens · Мегафауна · Растения',
      'Homo sapiens · Megafauna · Plants',
    ],
    ['Фанерозой · Плейстоцен', 'Phanerozoic · Pleistocene'],
    '—',
    '≈21',
    null,
  ),
  E(
    -24000,
    ['Последний ледниковый максимум', 'The Last Glacial Maximum'],
    ['Знакомая Земля, другой мир.', 'A familiar Earth, a different world.'],
    [
      'Огромные ледяные щиты покрывают Канаду и север Европы. Уровень моря примерно на 120 метров ниже современного, открыты сухопутные мосты. Люди живут небольшими сообществами, создают искусство и охотятся на крупную дичь. За ледниковым максимумом последует потепление и подъём океана.',
      'Vast ice sheets cover Canada and northern Europe. Sea level is roughly 120 metres below today, exposing land bridges. People live in small communities, create art and hunt large game. Warming and rising seas will follow the glacial maximum.',
    ],
    ['Люди · Мамонты · Степные травы', 'Humans · Mammoths · Steppe grasses'],
    ['Фанерозой · Поздний плейстоцен', 'Phanerozoic · Late Pleistocene'],
    '≈8–10',
    '≈21',
    null,
    '≈190',
    ['iceage'],
  ),
  E(
    -9700,
    ['Начало голоцена', 'The Holocene begins'],
    ['Лёд отступает. Люди остаются.', 'Ice retreats. People stay.'],
    [
      'Завершается последний ледниковый период. Ледяные щиты сокращаются, уровень моря поднимается, леса возвращаются на север. В нескольких регионах начинается переход к земледелию и оседлой жизни. Сравнительно стабильный климат создаёт условия для развития сложных обществ, хотя региональные засухи и похолодания продолжаются.',
      'The last glacial period ends. Ice sheets shrink, sea level rises and forests return north. Several regions begin transitioning toward farming and settled life. A relatively stable climate supports complex societies, although regional droughts and cool intervals continue.',
    ],
    ['Люди · Леса · Дикие злаки', 'Humans · Forests · Wild cereals'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13–14',
    '≈21',
    0.004,
    '≈260',
    ['populationHistory', 'history'],
  ),
  E(
    -4000,
    ['Земля первых городов', 'Earth’s first cities'],
    ['Мы строим мир вокруг себя.', 'We build a world around us.'],
    [
      'Земледелие распространяется, поселения растут. В речных долинах возникают города, ирригация и разделение труда; позднее появляется письменность. Люди вырубают леса и меняют почвы задолго до промышленности. Большинство энергии по-прежнему дают пища, древесина, ветер и человеческий труд.',
      'Farming spreads and settlements grow. River valleys develop cities, irrigation and specialised labour; writing follows. People clear forests and alter soils long before industry. Food, wood, wind and human effort still provide most energy.',
    ],
    [
      'Люди · Культуры · Домашние животные',
      'Humans · Crops · Domestic animals',
    ],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13–14',
    '20.95',
    0.02,
    '≈280',
    ['populationHistory'],
  ),
  E(
    1,
    ['Мир древних цивилизаций', 'A world of ancient civilisations'],
    ['Континенты связаны путями.', 'Routes connect the continents.'],
    [
      'Крупные государства, торговые пути и сельское хозяйство меняют ландшафты Евразии, Африки и Америк. Население мира измеряется сотнями миллионов, но оценки расходятся. Города зависят от урожая и доставки продовольствия. Большинство людей живёт в деревнях; ископаемое топливо ещё не стало основой энергетики.',
      'Large states, trade routes and agriculture transform landscapes across Eurasia, Africa and the Americas. Global population numbers in the hundreds of millions, though estimates differ. Cities depend on harvests and food transport. Most people live rurally; fossil fuels do not yet underpin the energy system.',
    ],
    ['Люди · Культуры · Леса', 'Humans · Crops · Forests'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13–14',
    '20.95',
    0.19,
    '≈280',
    ['populationHistory'],
  ),
  E(
    1000,
    ['Средневековый мир', 'The medieval world'],
    ['Жизнь следует за урожаем.', 'Life follows the harvest.'],
    [
      'Растут города и региональные торговые сети. Водяные и ветряные мельницы помогают ремёслам и сельскому хозяйству. Климатические изменения различаются по регионам и не означают одновременного глобального потепления. Урожаи, эпидемии и войны сильно влияют на численность населения.',
      'Cities and regional trade networks expand. Watermills and windmills support crafts and farming. Climatic changes differ across regions rather than forming a simultaneous global warming. Harvests, epidemics and wars strongly influence population.',
    ],
    ['Люди · Сельхозкультуры · Животные', 'Humans · Crops · Animals'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13–14',
    '20.95',
    0.3,
    '≈280',
    ['populationHistory'],
  ),
  E(
    1500,
    ['Связанный мир', 'A connected world'],
    ['Океаны становятся дорогами.', 'Oceans become roads.'],
    [
      'Дальние морские связи соединяют экосистемы, долго развивавшиеся отдельно. Обмен растениями и животными перестраивает питание и сельское хозяйство. Колонизация, насилие и завезённые инфекции приводят к катастрофическому сокращению коренных народов Америки. Начинается новый этап глобального воздействия человека.',
      'Long-distance sea routes connect ecosystems that evolved separately. Exchanges of crops and animals transform diets and farming. Colonisation, violence and introduced infections cause catastrophic losses among Indigenous peoples of the Americas. A new stage of global human influence begins.',
    ],
    [
      'Люди · Культуры · Переселённые виды',
      'Humans · Crops · Introduced species',
    ],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13–14',
    '20.95',
    0.46,
    '≈280',
    ['populationHistory'],
  ),
  E(
    1760,
    ['Промышленная революция', 'The Industrial Revolution'],
    [
      'Древние леса приводят машины в движение.',
      'Ancient forests power machines.',
    ],
    [
      'Уголь, паровые машины и фабрики начинают преобразовывать производство. Население и города растут. Углерод, миллионы лет хранившийся под землёй, всё быстрее возвращается в атмосферу. Эти изменения сначала сосредоточены в отдельных регионах, но со временем станут планетарными.',
      'Coal, steam engines and factories begin transforming production. Population and cities grow. Carbon stored underground for millions of years returns to the atmosphere ever faster. Initially concentrated in a few regions, these changes will eventually become planetary.',
    ],
    ['Люди · Культуры · Леса', 'Humans · Crops · Forests'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13.5',
    '20.95',
    0.78,
    '≈280',
    ['populationHistory', 'ipcc'],
  ),
  E(
    1880,
    ['Электрический век', 'The electrical age'],
    ['Ночь становится светлее.', 'The night grows brighter.'],
    [
      'Электрические сети, освещение, телеграф и промышленность меняют повседневную жизнь. Электричество не изобретено в этот момент: люди постепенно учатся производить, передавать и применять его. Уголь питает заводы и транспорт; нефтяная эпоха набирает силу. Начинаются глобальные инструментальные ряды температуры.',
      'Power networks, lighting, telegraphy and industry reshape daily life. Electricity is not invented at this moment: people gradually learn to generate, transmit and use it. Coal powers factories and transport while the oil age gathers pace. Global instrumental temperature records begin.',
    ],
    ['Люди · Культуры · Животные', 'Humans · Crops · Animals'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13.5',
    '20.95',
    1.45,
    '≈290',
    ['populationHistory', 'ipcc'],
  ),
  E(
    1950,
    ['Великое ускорение', 'The Great Acceleration'],
    ['Наш след становится глобальным.', 'Our footprint becomes global.'],
    [
      'После мировой войны быстро растут население, потребление энергии, производство удобрений и пластика. Антибиотики и санитария спасают жизни. Автомобили, электростанции и промышленное земледелие меняют круговороты углерода и азота. Локальные загрязнения складываются в воздействие на всю биосферу.',
      'After the world war, population, energy use, fertiliser production and plastics expand rapidly. Antibiotics and sanitation save lives. Cars, power plants and industrial farming alter carbon and nitrogen cycles. Local pollution adds up to a biosphere-wide influence.',
    ],
    ['Люди · Культуры · Микроорганизмы', 'Humans · Crops · Microorganisms'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈13.9',
    '20.95',
    2.49,
    '≈311',
    ['un', 'ipcc'],
  ),
  E(
    1969,
    ['Земля со стороны', 'Earth from the outside'],
    ['Впервые мы видим свой дом целиком.', 'We see our home as a whole.'],
    [
      'Люди достигают Луны, спутники наблюдают за погодой, а снимки Земли становятся символом её конечности. Компьютеры и связь развиваются, население быстро растёт. Экологическое движение привлекает внимание к загрязнению воздуха, воды и исчезновению видов.',
      'Humans reach the Moon, satellites watch the weather and images of Earth symbolise its finite nature. Computing and communications develop while population grows quickly. Environmental movements focus attention on polluted air, water and disappearing species.',
    ],
    ['Люди · Растения · Животные', 'Humans · Plants · Animals'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈14.0',
    '20.95',
    3.63,
    '≈325',
    ['un', 'ipcc'],
  ),
  E(
    2000,
    ['Цифровая планета', 'The digital planet'],
    ['Информация обгоняет расстояния.', 'Information outpaces distance.'],
    [
      'Интернет и мобильная связь соединяют общества. Международная торговля и производство растут, а вместе с ними энергопотребление и выбросы. Возобновляемая энергетика ещё занимает небольшую долю. Спутники и климатические модели всё лучше показывают потепление, таяние льда и изменение землепользования.',
      'The internet and mobile communications connect societies. Global trade and production expand, along with energy use and emissions. Renewables still provide a small share of energy. Satellites and climate models increasingly reveal warming, melting ice and land-use change.',
    ],
    ['Люди · Растения · Микроорганизмы', 'Humans · Plants · Microorganisms'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈14.3',
    '20.95',
    6.17,
    '≈370',
    ['un', 'ipcc'],
  ),
  E(
    2015,
    ['Климат становится общим делом', 'Climate becomes a shared concern'],
    ['Обещания планетарного масштаба.', 'Promises on a planetary scale.'],
    [
      'Парижское соглашение формулирует общую цель ограничить потепление. Солнечная и ветровая энергетика растут, но ископаемое топливо остаётся основой энергоснабжения. Океаны накапливают тепло, ледники отступают. Защита биоразнообразия и сокращение загрязнения становятся не менее важными задачами.',
      'The Paris Agreement sets a shared goal to limit warming. Solar and wind power grow, but fossil fuels still underpin energy supply. Oceans accumulate heat and glaciers retreat. Protecting biodiversity and reducing pollution become equally important challenges.',
    ],
    ['Люди · Растения · Животные', 'Humans · Plants · Animals'],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '≈14.8',
    '20.95',
    7.47,
    '≈401',
    ['un', 'ipcc'],
  ),
  E(
    2024,
    ['Эпоха человечества', 'The human age'],
    ['Маленький мир. Большое влияние.', 'A small world. An immense influence.'],
    [
      'Человечество связало континенты интернетом, вышло в космос и развивает искусственный интеллект. Солнечная и ветровая энергетика растут, но выбросы продолжают нагревать планету. Океаны накапливают тепло, ледники отступают; утрата местообитаний угрожает разнообразию жизни. Наше будущее зависит от решений сегодня. Показатели не являются измерениями в реальном времени.',
      'Humanity has connected continents through the internet, reached space and developed artificial intelligence. Solar and wind power expand, but emissions continue warming the planet. Oceans accumulate heat and glaciers retreat; habitat loss threatens biodiversity. Our future depends on today’s decisions. These indicators are not real-time measurements.',
    ],
    [
      'Растения · Микроорганизмы · Животные',
      'Plants · Microorganisms · Animals',
    ],
    ['Фанерозой · Голоцен', 'Phanerozoic · Holocene'],
    '14.97',
    '20.95',
    8.3,
    '—',
    ['copernicus', 'un', 'ipbes'],
  ),
  E(
    2030,
    ['Десятилетие решений', 'A decade of decisions'],
    [
      'Каждая доля градуса имеет значение.',
      'Every fraction of a degree matters.',
    ],
    [
      'Дальнейшее потепление повышает риск сильной жары, экстремальных осадков и потерь экосистем. Итог зависит от сокращения выбросов и адаптации. Население продолжает расти, потребность в воде и продовольствии усиливает нагрузку. Это сценарный срез ближайших десятилетий, а не предсказание погоды выбранного года.',
      'Further warming increases risks from extreme heat, heavy rainfall and ecosystem loss. Outcomes depend on emission cuts and adaptation. Population keeps growing, adding pressure on water and food systems. This is a scenario view of the coming decades, not a weather prediction for the selected year.',
    ],
    ['Современные группы под давлением', 'Modern groups under pressure'],
    ['Будущее · Климатические сценарии', 'Future · Climate scenarios'],
    '—',
    '≈20.9',
    8.57,
    '—',
    ['ipcc', 'un', 'ipbes'],
  ),
  E(
    2050,
    ['Мир середины века', 'The mid-century world'],
    [
      'Адаптация становится повседневностью.',
      'Adaptation becomes everyday life.',
    ],
    [
      'Города адаптируются к жаре, водоснабжение и сельское хозяйство подстраиваются к меняющимся осадкам. Старение населения и урбанизация идут неравномерно. Чем выше выбросы, тем сильнее потепление и ущерб природе. Демографическая оценка основана на среднем варианте ООН; климатические сценарии выбираются отдельно.',
      'Cities adapt to heat while water supplies and farming adjust to changing rainfall. Population ageing and urbanisation unfold unevenly. Higher emissions mean greater warming and ecological damage. Population follows the UN medium projection; climate scenarios are selected independently.',
    ],
    [
      'Современные экосистемы · Смещение ареалов',
      'Modern ecosystems · Shifting ranges',
    ],
    ['Будущее · Климатические сценарии', 'Future · Climate scenarios'],
    '—',
    '≈20.9',
    9.66,
    '—',
    ['ipcc', 'un'],
  ),
  E(
    2085,
    ['Пик населения?', 'Peak population?'],
    ['Рост не продолжается бесконечно.', 'Growth does not continue forever.'],
    [
      'Средний прогноз ООН предполагает пик населения примерно в середине 2080-х, около 10,3 млрд человек. Это условная траектория, чувствительная к рождаемости и смертности. Более тёплый океан и сокращение льда продолжают влиять на побережья. Сила воздействия на жизнь зависит от накопленных выбросов и защиты природы.',
      'The UN medium projection places a population peak around the mid-2080s at roughly 10.3 billion. This is a conditional trajectory, sensitive to fertility and mortality. A warmer ocean and shrinking ice continue affecting coasts. Impacts on life depend on cumulative emissions and nature protection.',
    ],
    [
      'Смещение экосистем · Уязвимые рифы',
      'Shifting ecosystems · Vulnerable reefs',
    ],
    ['Будущее · Конец XXI века', 'Future · Late 21st century'],
    '—',
    '≈20.9',
    10.3,
    '—',
    ['un', 'ipcc'],
  ),
  E(
    2100,
    ['На развилке будущего', 'At a future crossroads'],
    ['Один век. Разные планеты.', 'One century. Different worlds.'],
    [
      'К концу века низкие и высокие выбросы дают резко разные результаты для жары, ледников, кораллов и продовольственной безопасности. Уровень моря продолжит расти и после стабилизации температуры. Показанная температура рассчитана из изменения относительно 1850–1900, а не предсказывает отдельный год. После 2100 серые числа обозначают условную ИИ-реконструкцию, а не прогноз ООН.',
      'By century’s end, low and high emissions produce sharply different outcomes for heat, glaciers, coral reefs and food security. Sea level will keep rising even after temperature stabilises. The displayed temperature is derived from change relative to 1850–1900, not a prediction for one year. After 2100, grey values are hypothetical AI reconstructions, not UN projections.',
    ],
    ['Жизнь зависит от сценария', 'Life depends on the scenario'],
    ['Будущее · Конец XXI века', 'Future · Late 21st century'],
    '—',
    '≈20.9',
    10.2,
    '—',
    ['ipcc', 'un'],
  ),
  E(
    2101,
    ['Долгое климатическое наследие', 'A long climate legacy'],
    [
      'Выбросы заканчиваются. Последствия остаются надолго.',
      'Emissions end. Their effects linger.',
    ],
    [
      'Часть выброшенного CO₂ влияет на климат веками и тысячелетиями. Океан и ледяные щиты реагируют медленно, поэтому подъём моря продолжается после стабилизации потепления. Будущие технологии, население и политические решения нельзя надёжно предсказать. Серые числа показывают условную ИИ-реконструкцию для наглядности, а не надёжный прогноз.',
      'Some emitted CO₂ affects climate for centuries to millennia. Oceans and ice sheets respond slowly, so sea-level rise persists after warming stabilises. Future technology, population and political choices cannot be reliably predicted. Grey numbers are a hypothetical AI reconstruction for illustration, not a reliable forecast.',
    ],
    [
      'Состав будущей биосферы неизвестен',
      'Future biosphere composition unknown',
    ],
    ['Будущее · Долгосрочные последствия', 'Future · Long-term consequences'],
    '—',
    '—',
    null,
    '—',
    ['ipcc'],
  ),
  E(
    1002026,
    ['Тектоника продолжается', 'Tectonics continues'],
    ['Наши карты перестают быть точными.', 'Our maps lose their precision.'],
    [
      'За миллион лет плиты смещаются на десятки километров, вулканизм и эрозия меняют рельеф. Климат зависит от орбиты, углеродного цикла и оставленного человеком следа. Эволюция продолжается, но названия будущих видов и судьба человечества неизвестны. Современная карта больше не может считаться точным изображением.',
      'Over a million years, plates move tens of kilometres while volcanism and erosion reshape relief. Climate depends on orbital cycles, the carbon cycle and humanity’s legacy. Evolution continues, but future species and humanity’s fate are unknown. The modern map can no longer be treated as exact.',
    ],
    ['Эволюционирующая биосфера', 'An evolving biosphere'],
    ['Далёкое будущее · Тектонические модели', 'Deep future · Tectonic models'],
    '—',
    '—',
    null,
    '—',
    ['future'],
  ),
  E(
    250002026,
    ['Следующий суперконтинент', 'The next supercontinent'],
    ['Возможное новое соединение суши.', 'Land may come together again.'],
    [
      'Пангея Ультима: один из сценариев следующего суперконтинента, примерно через 250 млн лет. Его жаркие внутренние области, вулканический CO₂ и более яркое Солнце могут серьёзно ограничить пригодные для млекопитающих территории. Другие тектонические сценарии дают другую географию; это не единственная «правильная карта будущего».',
      'Pangaea Ultima is one scenario for a new supercontinent, around 250 million years from now. Hot interiors, volcanic CO₂ and a brighter Sun could severely limit land suitable for mammals. Other tectonic scenarios produce different geographies; there is no single correct future map.',
    ],
    ['Виды неизвестны · Тепловой стресс', 'Species unknown · Heat stress'],
    [
      'Далёкое будущее · Гипотеза Пангеи Ультима',
      'Deep future · Pangaea Ultima hypothesis',
    ],
    '—',
    '—',
    null,
    '410–816',
    ['future'],
  ),
  E(
    1000002026,
    ['Угасание кислородного мира', 'The oxygen world fades'],
    ['У биосферы есть солнечные часы.', 'The biosphere has a solar clock.'],
    [
      'Солнце постепенно становится ярче. В модели биогеохимии Земли кислородная атмосфера сохраняется ещё около 1,08 ± 0,14 млрд лет, после чего может резко обеднеть кислородом. Сложной жизни становится трудно существовать. Это результат модели с неопределённостью, а не установленная дата конца человечества.',
      'The Sun gradually brightens. One Earth biogeochemistry model estimates roughly 1.08 ± 0.14 billion more years of an oxygen-rich atmosphere before strong deoxygenation. Complex life becomes difficult to sustain. This is an uncertain model result, not a scheduled end for humanity.',
    ],
    [
      'Возможное возвращение микробного мира',
      'Possible return to a microbial world',
    ],
    [
      'Далёкое будущее · Эволюция биосферы',
      'Deep future · Biosphere evolution',
    ],
    '—',
    '—',
    null,
    '—',
    ['lifespan'],
  ),
  E(
    2000002026,
    ['Мир без океанов', 'A world losing its oceans'],
    ['Вода больше не вечна.', 'Water is no longer forever.'],
    [
      'В ближайшие несколько миллиардов лет рост светимости Солнца может привести к влажному парниковому режиму и утечке воды в космос. Сроки зависят от облаков, атмосферы и модели климата. Океаны исчезают, обитаемость заканчивается задолго до превращения Солнца в красного гиганта.',
      'Over the next few billion years, the brighter Sun may trigger a moist greenhouse and loss of water to space. Timing depends on clouds, atmosphere and climate modelling. Oceans disappear and habitability ends long before the Sun becomes a red giant.',
    ],
    ['Жизнь на поверхности маловероятна', 'Surface life unlikely'],
    [
      'Далёкое будущее · Потеря обитаемости',
      'Deep future · Loss of habitability',
    ],
    '—',
    '—',
    null,
    '—',
    ['solar', 'lifespan'],
  ),
  E(
    5000002026,
    ['Солнце меняется', 'The Sun transforms'],
    ['Наша звезда покидает зрелость.', 'Our star leaves its middle age.'],
    [
      'Исчерпание водорода в ядре меняет устройство Солнца. В последующие этапы оно раздувается, становится красным гигантом и теряет массу. Земля к этому времени давно непригодна для привычной жизни. Масштаб и скорость изменений на изображении условны: это эволюционная модель, а не точный снимок будущего.',
      'Depletion of core hydrogen changes the Sun’s structure. In subsequent stages it expands into a red giant and loses mass. Earth is already inhospitable to familiar life. The image is schematic: it represents stellar evolution rather than a precise future snapshot.',
    ],
    ['Знакомая нам жизнь отсутствует', 'No familiar life'],
    ['Далёкое будущее · Эволюция Солнца', 'Deep future · Solar evolution'],
    '—',
    '—',
    null,
    '—',
    ['solar'],
  ),
  E(
    MAX,
    ['Последняя глава Земли', 'Earth’s final chapter'],
    ['Даже планеты не вечны.', 'Even planets are not forever.'],
    [
      'Некоторые модели эволюции Солнца предсказывают поглощение Земли примерно через 7,6 млрд лет: приливное торможение может превысить расширение орбиты из-за потери солнечной массы. Точный исход зависит от модели. Здесь показан сценарий разрушения Земли, а не утверждение о точно известном дне её гибели.',
      'Some solar-evolution models predict Earth’s engulfment in roughly 7.6 billion years: tidal drag may outweigh orbital expansion from solar mass loss. The exact outcome is model-dependent. This shows an Earth-destruction scenario, not a claim to know the precise day of its demise.',
    ],
    ['Обитаемость утрачена', 'Habitability lost'],
    [
      'Далёкое будущее · Возможное поглощение',
      'Deep future · Possible engulfment',
    ],
    '—',
    '—',
    null,
    '—',
    ['engulfment'],
  ),
];
export const sources: Record<
  string,
  { title: string; url: string; note: Pair }
> = {
  formation: {
    title: 'NASA · Early Earth & Moon formation',
    url: 'https://science.nasa.gov/moon/formation/',
    note: [
      'Аккреция и гипотеза гигантского столкновения.',
      'Accretion and the giant-impact hypothesis.',
    ],
  },
  history: {
    title: 'Smithsonian · Deep Time',
    url: 'https://naturalhistory.si.edu/education/teaching-resources/paleontology/deep-time',
    note: [
      'История жизни; обзорные описания эпох.',
      'Life history; educational summaries of eras.',
    ],
  },
  oxygen: {
    title: 'Great Oxidation · Nature Communications (2020)',
    url: 'https://www.nature.com/articles/s41467-020-16493-1',
    note: [
      'Кислородная революция, около 2,4–2,1 млрд лет назад.',
      'The Great Oxidation, around 2.4–2.1 billion years ago.',
    ],
  },
  snowball: {
    title: 'Hoffman et al. · Snowball Earth (2017)',
    url: 'https://www.science.org/doi/10.1126/sciadv.1600983',
    note: [
      'Криогенные оледенения и неопределённости моделей.',
      'Cryogenian glaciations and model uncertainty.',
    ],
  },
  temperature: {
    title: 'Judd et al. · Science (2024)',
    url: 'https://doi.org/10.1126/science.adk3705',
    note: [
      'Реконструкция климата за 485 млн лет. Диапазоны в приложении: округлённые ориентиры для эпох, не точные годовые значения.',
      '485 million years of climate reconstruction. App ranges are rounded epoch-level guides, not exact annual values.',
    ],
  },
  extinction: {
    title: 'Smithsonian · Mass extinctions',
    url: 'https://naturalhistory.si.edu/education/teaching-resources/paleontology/extinction-over-time',
    note: [
      'Массовые вымирания и восстановление экосистем.',
      'Mass extinctions and ecosystem recovery.',
    ],
  },
  iceage: {
    title: 'Tierney et al. · Nature (2020)',
    url: 'https://www.nature.com/articles/s41586-020-2617-x',
    note: [
      'Последний ледниковый максимум: глобальное охлаждение примерно на 6 °C относительно доиндустриального климата.',
      'Last Glacial Maximum: roughly 6 °C of global cooling relative to pre-industrial climate.',
    ],
  },
  populationHistory: {
    title: 'HYDE 3.2 · Klein Goldewijk et al. (2017)',
    url: 'https://essd.copernicus.org/articles/9/927/2017/',
    note: [
      'Историческая численность: округлённые оценки, особенно неопределённые в древности.',
      'Historical population: rounded estimates with especially large uncertainty in antiquity.',
    ],
  },
  un: {
    title: 'UN · World Population Prospects 2024',
    url: 'https://population.un.org/wpp/',
    note: [
      'Средний вариант до 2100; между опорными годами используется интерполяция. После 2100 научный ряд заканчивается; серые значения показывают отдельную условную ИИ-реконструкцию.',
      'Medium variant through 2100; interpolated between anchor years. The scientific series ends in 2100; grey values are separate hypothetical AI reconstructions.',
    ],
  },
  copernicus: {
    title: 'Copernicus · Global Climate Highlights 2025',
    url: 'https://climate.copernicus.eu/copernicus-2025-was-third-hottest-year-record',
    note: [
      '14,97 °C: средняя температура воздуха у поверхности за 2025, последний полный год. Это не среднее за незавершённый 2026.',
      '14.97 °C is 2025 surface air temperature, the latest full year. It is not an average for incomplete 2026.',
    ],
  },
  ipcc: {
    title: 'IPCC · AR6 Synthesis Report',
    url: 'https://www.ipcc.ch/report/ar6/syr/longer-report/',
    note: [
      'SSP1-2.6, SSP2-4.5, SSP5-8.5; изменения к 2081–2100 относительно 1850–1900: 1,8 / 2,7 / 4,4 °C.',
      'SSP1-2.6, SSP2-4.5, SSP5-8.5; changes in 2081–2100 relative to 1850–1900: 1.8 / 2.7 / 4.4 °C.',
    ],
  },
  ipbes: {
    title: 'IPBES · Global Assessment (2019)',
    url: 'https://www.ipbes.net/global-assessment',
    note: [
      'Землепользование, эксплуатация ресурсов, климат, загрязнение и инвазивные виды: ключевые факторы утраты природы.',
      'Land use, exploitation, climate, pollution and invasive species are key drivers of nature loss.',
    ],
  },
  maps: {
    title: 'Scotese · PALEOMAP PaleoAtlas v3',
    url: 'https://www.earthbyte.org/paleomap-paleoatlas-for-gplates/',
    note: [
      'Берега основаны на палеогеографических реконструкциях. Промежуточные контуры интерполированы, цвет и фактура рельефа стилизованы под спутниковый вид. CC BY 4.0.',
      'Coasts follow published paleogeography. Intermediate outlines are interpolated; colours and relief texture are styled to resemble satellite imagery. CC BY 4.0.',
    ],
  },
  future: {
    title: 'Farnsworth et al. · Nature Geoscience (2023)',
    url: 'https://www.nature.com/articles/s41561-023-01259-3',
    note: [
      'Пангея Ультима: условная конфигурация около +250 млн лет. Это одна гипотеза, не достоверный прогноз берегов.',
      'Pangaea Ultima is a conditional +250 Myr configuration, one hypothesis rather than a certain coastline forecast.',
    ],
  },
  lifespan: {
    title: 'Ozaki & Reinhard · Nature Geoscience (2021)',
    url: 'https://www.nature.com/articles/s41561-021-00693-5',
    note: [
      'Срок кислородной атмосферы: 1,08 ± 0,14 млрд лет (модель, 1σ).',
      'Oxygenated atmosphere lifespan: 1.08 ± 0.14 billion years (model, 1σ).',
    ],
  },
  solar: {
    title: 'NASA · Aging Into Gianthood',
    url: 'https://science.nasa.gov/exoplanets/resources/life-and-death/chapter-6/',
    note: [
      'Красный гигант через несколько миллиардов лет; сроки приблизительны.',
      'Red-giant evolution in several billion years; timing is approximate.',
    ],
  },
  engulfment: {
    title: 'Schröder & Smith · MNRAS (2008)',
    url: 'https://doi.org/10.1111/j.1365-2966.2008.13022.x',
    note: [
      'Модель поглощения Земли через 7,59 млрд лет.',
      'A model of Earth engulfment in 7.59 billion years.',
    ],
  },
  earth: {
    title: 'NASA · Earth facts',
    url: 'https://science.nasa.gov/earth/facts/',
    note: [
      'Современные параметры Земли. Дневная поверхность NASA Blue Marble 2004, рельеф GEBCO; ночная карта NASA 2016. До 2016-го показаны выборочные датированные очаги электрификации, не спутниковые наблюдения.',
      'Modern Earth parameters. NASA Blue Marble 2004 surface, GEBCO relief; NASA 2016 night map. Pre-2016 lights are selected dated electrification markers, not satellite observations.',
    ],
  },
};
export const anchors = [
  [0, MIN],
  [20, -720000000],
  [34, -252000000],
  [45, -66000000],
  [55, -24000],
  [62, 1760],
  [72, NOW],
  [82, 2100],
  [90, 250002026],
  [96, 1000002026],
  [100, MAX],
];
export function positionToYear(p: number) {
  p = Math.max(0, Math.min(100, p));
  const i = anchors.findIndex(
    (a, j) => j < anchors.length - 1 && p >= a[0] && p <= anchors[j + 1][0],
  );
  if (i < 0) return MAX;
  const [x, y] = anchors[i],
    [nx, ny] = anchors[i + 1];
  return Math.round(y + ((p - x) / (nx - x)) * (ny - y));
}
export function yearToPosition(y: number) {
  y = Math.max(MIN, Math.min(MAX, y));
  const i = anchors.findIndex(
    (a, j) => j < anchors.length - 1 && y >= a[1] && y <= anchors[j + 1][1],
  );
  if (i < 0) return 100;
  const [x, v] = anchors[i],
    [nx, nv] = anchors[i + 1];
  return x + ((y - v) / (nv - v)) * (nx - x);
}
export function epochAt(y: number) {
  return epochs.reduce((a, e) => (e.year <= y ? e : a), epochs[0]);
}
// Russian copy keeps short prepositions and conjunctions on the same line as the next word.
export const nbsp = (s: string) =>
  s.replace(
    /(?<=^|[\s(«"])(в|во|к|ко|с|со|о|об|у|и|а|на|по|за|из|до|от|не|но|для|при|без|под|над|про)\s+/giu,
    '$1\u00a0',
  );
export const pick = (p: Pair, l: Lang) => (l === 'ru' ? nbsp(p[0]) : p[1]);
export function dateLabel(y: number, l: Lang): { value: string; unit: string } {
  const n = (v: number) =>
    new Intl.NumberFormat(l, { maximumFractionDigits: 2 }).format(v);
  if (y <= -1000000) {
    const d = NOW - y;
    return {
      value: '−' + n(d / (d >= 1e9 ? 1e9 : 1e6)),
      unit:
        l === 'ru'
          ? d >= 1e9
            ? 'млрд лет'
            : 'млн лет'
          : d >= 1e9
            ? 'billion years'
            : 'million years',
    };
  }
  if (y >= 1000000) {
    const d = y - NOW;
    return {
      value: '+' + n(d / (d >= 1e9 ? 1e9 : 1e6)),
      unit:
        l === 'ru'
          ? d >= 1e9
            ? 'млрд лет'
            : 'млн лет'
          : d >= 1e9
            ? 'billion years'
            : 'million years',
    };
  }
  return {
    value: n(Math.abs(y)),
    unit:
      l === 'ru'
        ? y < 0
          ? 'год до н. э.'
          : 'год н. э.'
        : y < 0
          ? 'BCE'
          : 'CE',
  };
}
export function populationAt(y: number): number | null {
  if (y > 2100) return null;
  const e = epochAt(y);
  if (e.population === null || y < -9700) return e.population;
  if (y >= 2024 && y <= NOW) return 8.16 + (y - 2024) * 0.07;
  if (y > NOW && y < 2030) return 8.3 + ((y - NOW) / 4) * (8.57 - 8.3);
  const i = epochs.indexOf(e);
  const next = epochs[i + 1];
  if (!next || next.population === null) return e.population;
  const nextPopulation = next.year === 2024 ? 8.16 : next.population;
  return (
    e.population +
    ((nextPopulation - e.population) * (y - e.year)) / (next.year - e.year)
  );
}
export const scenarios = [
  {
    id: 'low',
    ssp: 'SSP1-2.6',
    label: ['Низкие выбросы', 'Low emissions'] as Pair,
    mid: 1.7,
    end: 1.8,
    range: '1.3–2.4',
    sea: '0.32–0.62',
  },
  {
    id: 'medium',
    ssp: 'SSP2-4.5',
    label: ['Средние выбросы', 'Intermediate emissions'] as Pair,
    mid: 2,
    end: 2.7,
    range: '2.1–3.5',
    sea: '0.44–0.76',
  },
  {
    id: 'high',
    ssp: 'SSP5-8.5',
    label: ['Очень высокие выбросы', 'Very high emissions'] as Pair,
    mid: 2.4,
    end: 4.4,
    range: '3.3–5.7',
    sea: '0.63–1.01',
  },
];
export function warmingAt(y: number, scenario: number) {
  const s = scenarios[scenario];
  if (y <= 2050) return 1.5 + ((s.mid - 1.5) * Math.max(0, y - 2026)) / 24;
  return s.mid + ((s.end - s.mid) * (Math.min(y, 2100) - 2050)) / 50;
}
