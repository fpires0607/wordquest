import type { Level, WordInfo } from './types'

// Content rules: every sentence below is original (no commercial lyrics).
// Secret words are curated and checked by engine.test.ts against the wheel letters.
// Level ids are stable (saved progress is keyed by them) even when a level moves between worlds.
// `gloss`: one item per word of the sentence — see SentenceChallenge in types.ts.
const w = (text: string, translation: string, example: string): WordInfo => ({ text, translation, example })

export const LEVELS: Level[] = [
  // ───────────── Everyday Life (formerly "Everyday City"; ids keep the old prefix) ─────────────
  {
    id: 'city-bread',
    worldId: 'everyday',
    difficulty: 'beginner',
    category: 'Food',
    decoys: 'o',
    main: {
      text: 'bread',
      senseId: 'bread#food',
      translation: 'pão',
      meaning: 'Food made from flour and baked in an oven.',
      example: 'I eat bread with butter every morning.',
      cloze: { sentence: 'Can I have some ___ and butter, please?', distractors: ['bear', 'beard'] },
    },
    secretWords: [
      w('beard', 'barba', 'He has a long grey beard.'),
      w('read', 'ler', 'I read a book before bed.'),
      w('bear', 'urso', 'A bear lives in the forest.'),
      w('dare', 'ousar', 'I dare you to jump!'),
      w('road', 'estrada', 'The road is long and quiet.'),
      w('ear', 'orelha', 'My left ear hurts.'),
      w('red', 'vermelho', 'She wears a red hat.'),
    ],
    sentences: [
      {
        text: 'I buy fresh bread every morning.',
        translation: 'Eu compro pão fresco toda manhã.',
        gloss: 'i#pronoun buy#purchase fresh#recent bread#food every#each morning#am',
      },
      {
        text: 'She likes bread with cheese.',
        translation: 'Ela gosta de pão com queijo.',
        gloss: 'she#pronoun like#enjoy bread#food with#together cheese#cheese',
      },
    ],
  },
  {
    id: 'city-street',
    worldId: 'everyday',
    difficulty: 'intermediate',
    category: 'Places',
    decoys: 'a',
    main: {
      text: 'street',
      senseId: 'street#road',
      translation: 'rua',
      meaning: 'A road in a town with buildings on both sides.',
      example: 'The bus stops on my street.',
      cloze: { sentence: 'Look both ways before you cross the ___.', distractors: ['stream', 'tree'] },
    },
    secretWords: [
      w('tree', 'árvore', 'The tree is very tall.'),
      w('rest', 'descansar', 'I need to rest after lunch.'),
      w('test', 'teste', 'We have a test on Friday.'),
      w('steer', 'guiar', 'Please steer the boat to the left.'),
      w('reset', 'reiniciar', 'Reset your password today.'),
      w('tester', 'testador', 'The tester found a small bug.'),
    ],
    sentences: [
      {
        text: 'The shop is on the next street.',
        translation: 'A loja fica na próxima rua.',
        gloss: 'the#article shop#store be#state on#place-street the#article next#following street#road',
      },
      {
        text: 'Please cross the street carefully.',
        translation: 'Por favor, atravesse a rua com cuidado.',
        gloss: 'please#polite cross#go-over the#article street#road carefully#with-care',
      },
    ],
  },
  {
    id: 'city-pharmacy',
    worldId: 'everyday',
    difficulty: 'advanced',
    category: 'Services',
    decoys: 'e',
    main: {
      text: 'pharmacy',
      senseId: 'pharmacy#shop',
      translation: 'farmácia',
      meaning: 'A shop where you can buy medicine.',
      example: 'The pharmacy is next to the bank.',
      cloze: { sentence: 'I need to buy some medicine at the ___.', distractors: ['bakery', 'library'] },
    },
    secretWords: [
      w('charm', 'charme', 'The old town has a lot of charm.'),
      w('march', 'marchar', 'They march through the city.'),
      w('champ', 'campeão', 'Our team is the champ!'),
      w('cramp', 'câimbra', 'I felt a cramp in my leg.'),
      w('army', 'exército', 'He joined the army last year.'),
      w('camp', 'acampar', 'We camp near the lake.'),
    ],
    sentences: [
      {
        text: 'The pharmacy closes at nine tonight.',
        translation: 'A farmácia fecha às nove hoje à noite.',
        gloss: 'the#article pharmacy#shop close#end-business at#clock-time nine#number tonight#night',
      },
      {
        text: 'I picked up my medicine at the pharmacy.',
        translation: 'Eu peguei meu remédio na farmácia.',
        gloss: 'i#pronoun pick-up#collect ~ my#possessive medicine#drug at#place the#article pharmacy#shop',
      },
    ],
  },

  // ───────────── Music World ─────────────
  {
    id: 'music-guitar',
    worldId: 'music',
    difficulty: 'beginner',
    category: 'Instruments',
    decoys: 'e',
    main: {
      text: 'guitar',
      senseId: 'guitar#instrument',
      translation: 'violão / guitarra',
      meaning: 'A musical instrument with strings.',
      example: 'He plays the guitar every night.',
      cloze: { sentence: 'She plays the ___ in a rock band.', distractors: ['drum', 'piano'] },
    },
    secretWords: [
      w('great', 'ótimo', 'That was a great show.'),
      w('gait', 'jeito de andar', 'He has a slow gait.'),
      w('rug', 'tapete', 'The rug is soft and warm.'),
      w('tug', 'puxar', 'Tug the rope gently.'),
      w('art', 'arte', 'I love modern art.'),
      w('air', 'ar', 'The air is fresh today.'),
    ],
    sentences: [
      {
        text: 'My brother bought a new guitar.',
        translation: 'Meu irmão comprou um violão novo.',
        gloss: 'my#possessive brother#sibling buy#purchase a#article new#recent guitar#instrument',
      },
      {
        text: 'She tunes the guitar before the show.',
        translation: 'Ela afina o violão antes do show.',
        gloss: 'she#pronoun tune#adjust the#article guitar#instrument before#time the#article show#performance',
      },
    ],
  },
  {
    id: 'music-melody',
    worldId: 'music',
    difficulty: 'intermediate',
    category: 'Sounds',
    decoys: 'a',
    main: {
      text: 'melody',
      senseId: 'melody#tune',
      translation: 'melodia',
      meaning: 'A group of notes that makes a tune.',
      example: "I can't stop humming that melody.",
      cloze: { sentence: 'The ___ of this song is easy to remember.', distractors: ['medal', 'model'] },
    },
    secretWords: [
      w('model', 'modelo', 'She is a fashion model.'),
      w('demo', 'demonstração', 'Watch the demo video first.'),
      w('medal', 'medalha', 'He won a gold medal.'),
      w('mole', 'toupeira', 'A mole digs under the ground.'),
      w('old', 'velho', 'My grandfather is old but strong.'),
      w('dome', 'cúpula', 'The dome is made of glass.'),
    ],
    sentences: [
      {
        text: 'She plays a sweet melody on the piano.',
        translation: 'Ela toca uma melodia doce no piano.',
        gloss: 'she#pronoun play#instrument a#article sweet#pleasant melody#tune on#instrument the#article piano#keyboard',
      },
      {
        text: 'This melody makes me feel happy.',
        translation: 'Esta melodia me deixa feliz.',
        gloss: 'this#near melody#tune make#cause-feeling me#object feel#experience happy#glad',
      },
    ],
  },
  {
    id: 'music-symphony',
    worldId: 'music',
    difficulty: 'advanced',
    category: 'Concerts',
    decoys: 'a',
    main: {
      text: 'symphony',
      senseId: 'symphony#orchestra-piece',
      translation: 'sinfonia',
      meaning: 'A long piece of music for a big orchestra.',
      example: 'The orchestra played a beautiful symphony.',
      cloze: { sentence: 'The orchestra performed a ___ by a famous composer.', distractors: ['melody', 'whisper'] },
    },
    secretWords: [
      w('phony', 'falso', 'That phone call felt phony.'),
      w('hymn', 'hino', 'We sang a hymn together.'),
      w('pony', 'pônei', 'She rides a small pony.'),
      w('nosy', 'enxerido', 'My neighbor is very nosy.'),
      w('shy', 'tímido', 'He is shy with new people.'),
      w('spy', 'espião', 'A spy keeps many secrets.'),
    ],
    sentences: [
      {
        text: 'The symphony begins very softly.',
        translation: 'A sinfonia começa muito suavemente.',
        gloss: 'the#article symphony#orchestra-piece begin#start very#intensifier softly#gently',
      },
      {
        text: 'We went to hear a symphony on Friday.',
        translation: 'Fomos ouvir uma sinfonia na sexta.',
        gloss: 'we#pronoun go#travel to#purpose hear#listen a#article symphony#orchestra-piece on#day friday#weekday',
      },
    ],
  },

  // ───────────── Travel World ─────────────
  {
    id: 'travel-ticket',
    worldId: 'travel',
    difficulty: 'beginner',
    category: 'Transport',
    decoys: 's',
    main: {
      text: 'ticket',
      senseId: 'ticket#pass',
      translation: 'passagem / ingresso',
      meaning: 'A small paper that lets you travel or enter a place.',
      example: 'I bought a ticket for the concert.',
      cloze: { sentence: 'Please show your ___ at the gate.', distractors: ['kite', 'stick'] },
    },
    secretWords: [
      w('kite', 'pipa', 'The kite flies high today.'),
      w('tick', 'marcar', 'Tick the box with a pen.'),
      w('stick', 'vara', 'Pick up that stick.'),
      w('ice', 'gelo', 'Put some ice in the glass.'),
      w('tie', 'gravata', 'He wears a blue tie.'),
      w('cite', 'citar', 'Always cite your sources.'),
    ],
    sentences: [
      {
        text: 'I need a ticket to the museum.',
        translation: 'Preciso de um ingresso para o museu.',
        gloss: 'i#pronoun need#require a#article ticket#pass to#direction the#article museum#place',
      },
      {
        text: 'Where can I buy a train ticket?',
        translation: 'Onde posso comprar uma passagem de trem?',
        gloss: 'where#question-place can#possibility i#pronoun buy#purchase a#article train#rail ticket#pass',
      },
    ],
  },
  {
    id: 'travel-airport',
    worldId: 'travel',
    difficulty: 'intermediate',
    category: 'Places',
    decoys: 'e',
    main: {
      text: 'airport',
      senseId: 'airport#terminal',
      translation: 'aeroporto',
      meaning: 'A place where planes take off and land.',
      example: 'We arrived at the airport two hours early.',
      cloze: { sentence: 'Our plane leaves from the ___ at six.', distractors: ['harbor', 'station'] },
    },
    secretWords: [
      w('port', 'porto', 'The ship is in port.'),
      w('trip', 'viagem', 'Our trip was really fun.'),
      w('pair', 'par', 'I bought a pair of shoes.'),
      w('part', 'parte', 'This is the best part.'),
      w('raptor', 'ave de rapina', 'A raptor hunts from the sky.'),
      w('pirate', 'pirata', 'A pirate sails the sea.'),
    ],
    sentences: [
      {
        text: 'We arrive at the airport at noon.',
        translation: 'Chegamos ao aeroporto ao meio-dia.',
        gloss: 'we#pronoun arrive#reach at#place the#article airport#terminal at#clock-time noon#midday',
      },
      {
        text: 'The airport is very busy today.',
        translation: 'O aeroporto está muito movimentado hoje.',
        gloss: 'the#article airport#terminal be#state very#intensifier busy#crowded today#now',
      },
    ],
  },
  {
    id: 'travel-passport',
    worldId: 'travel',
    difficulty: 'advanced',
    category: 'Documents',
    decoys: 'e',
    main: {
      text: 'passport',
      senseId: 'passport#document',
      translation: 'passaporte',
      meaning: 'An official document that lets you travel to other countries.',
      example: "Don't forget your passport at the hotel.",
      cloze: { sentence: 'You need a valid ___ to travel abroad.', distractors: ['postcard', 'suitcase'] },
    },
    secretWords: [
      w('sport', 'esporte', 'Soccer is my favorite sport.'),
      w('strap', 'alça', 'Fix the strap of your bag.'),
      w('pass', 'passar', 'Pass me the salt, please.'),
      w('post', 'enviar pelo correio', 'I will post the letter today.'),
      w('past', 'passado', 'In the past, we walked to school.'),
      w('trap', 'armadilha', 'The mouse is in the trap.'),
    ],
    sentences: [
      {
        text: 'Please show your passport at the desk.',
        translation: 'Por favor, mostre seu passaporte no balcão.',
        gloss: 'please#polite show#present your#possessive passport#document at#place the#article desk#counter',
      },
      {
        text: 'I keep my passport in a safe place.',
        translation: 'Eu guardo meu passaporte em um lugar seguro.',
        gloss: 'i#pronoun keep#store my#possessive passport#document in#inside a#article safe#secure place#location',
      },
    ],
  },

  // ───────────── Mystery Words (special mode) ─────────────
  {
    id: 'mystery-secret',
    worldId: 'mystery',
    difficulty: 'beginner',
    category: 'Ideas',
    decoys: 'l',
    main: {
      text: 'secret',
      senseId: 'secret#hidden-info',
      translation: 'segredo',
      meaning: 'Something that only a few people know.',
      example: 'Can you keep a secret?',
      cloze: { sentence: "Please don't tell anyone, it's a ___.", distractors: ['crest', 'secure'] },
    },
    secretWords: [
      w('crest', 'crista', 'The bird has a red crest.'),
      w('rest', 'descansar', 'Let us rest for a minute.'),
      w('tree', 'árvore', 'A tree grows by the river.'),
      w('reset', 'reiniciar', 'Press the button to reset it.'),
      w('terse', 'seco / direto', 'Her answer was short and terse.'),
      w('erect', 'ereto', 'Stand erect and look ahead.'),
    ],
    sentences: [
      {
        text: 'Can you keep a secret?',
        translation: 'Você consegue guardar um segredo?',
        gloss: 'can#ability you#pronoun keep#hold-private a#article secret#hidden-info',
      },
      {
        text: 'This is our little secret.',
        translation: 'Este é o nosso segredinho.',
        gloss: 'this#near be#state our#possessive little#small secret#hidden-info',
      },
    ],
  },
  {
    id: 'mystery-mystery',
    worldId: 'mystery',
    difficulty: 'intermediate',
    category: 'Stories',
    decoys: 'a',
    main: {
      text: 'mystery',
      senseId: 'mystery#unknown',
      translation: 'mistério',
      meaning: 'Something strange that is hard to explain.',
      example: 'The missing key is a mystery.',
      cloze: { sentence: 'Nobody knows who took it. It is a real ___.', distractors: ['history', 'master'] },
    },
    secretWords: [
      w('stem', 'caule', 'The stem of the flower is green.'),
      w('terms', 'termos', 'Read the terms first.'),
      w('master', 'mestre', 'He is a chess master.'),
      w('yet', 'ainda', 'I am not ready yet.'),
      w('try', 'tentar', 'Try again, you can do it!'),
      w('yes', 'sim', 'Yes, I can help you.'),
    ],
    sentences: [
      {
        text: 'The missing key is a mystery.',
        translation: 'A chave perdida é um mistério.',
        gloss: 'the#article missing#lost key#door-key be#state a#article mystery#unknown',
      },
      {
        // same spelling, different sense: a story genre, not "something unexplained"
        text: 'She loves to read a good mystery.',
        translation: 'Ela adora ler um bom mistério (história).',
        gloss: 'she#pronoun love#adore to#infinitive read#book a#article good#nice mystery#story-genre',
      },
    ],
  },
  {
    id: 'mystery-labyrinth',
    worldId: 'mystery',
    difficulty: 'advanced',
    category: 'Adventure',
    decoys: 'e',
    main: {
      text: 'labyrinth',
      senseId: 'labyrinth#maze',
      translation: 'labirinto',
      meaning: 'A complicated set of paths where it is easy to get lost.',
      example: 'The explorers got lost in the labyrinth.',
      cloze: { sentence: 'He got lost in a ___ of dark tunnels.', distractors: ['harbor', 'library'] },
    },
    secretWords: [
      w('brain', 'cérebro', 'Use your brain!'),
      w('train', 'trem', 'The train is late.'),
      w('birth', 'nascimento', 'Her birth was in May.'),
      w('hairy', 'peludo', 'The dog is very hairy.'),
      w('hint', 'dica', 'Give me a hint, please.'),
      w('lair', 'covil', 'The lion went back to its lair.'),
      w('learn', 'aprender', 'I learn English every day.'),
    ],
    sentences: [
      {
        text: 'The treasure is hidden deep inside the labyrinth.',
        translation: 'O tesouro está escondido no fundo do labirinto.',
        gloss: 'the#article treasure#valuables be#state hidden#concealed deep#far-inside inside#within the#article labyrinth#maze',
      },
      {
        text: 'They wandered through the labyrinth for hours.',
        translation: 'Eles vagaram pelo labirinto por horas.',
        gloss: 'they#pronoun wander#roam through#passing the#article labyrinth#maze for#duration hour#time-unit',
      },
    ],
  },

  // ───────────── Business World (new, original content) ─────────────
  {
    id: 'business-meeting',
    worldId: 'business',
    difficulty: 'intermediate',
    category: 'Workplace',
    decoys: 'a',
    main: {
      text: 'meeting',
      senseId: 'meeting#work-gathering',
      translation: 'reunião',
      meaning: 'A time when people come together to talk about work.',
      example: 'The meeting starts at ten.',
      cloze: { sentence: 'We have a team ___ at nine tomorrow.', distractors: ['melting', 'meaning'] },
    },
    secretWords: [
      w('meet', 'encontrar / reunir-se', 'Let us meet at the office.'),
      w('time', 'tempo / hora', 'What time is the call?'),
      w('team', 'equipe', 'Our team is very fast.'),
      w('ten', 'dez', 'We are ten in the team.'),
      w('gem', 'joia / pérola', 'She is a gem at work.'),
      w('mint', 'hortelã', 'This tea has mint.'),
    ],
    sentences: [
      {
        text: 'Can we move the meeting to Friday?',
        translation: 'Podemos mudar a reunião para sexta?',
        gloss: 'can#request we#pronoun move#reschedule the#article meeting#work-gathering to#direction friday#weekday',
      },
      {
        text: 'We need a short break before the meeting.',
        translation: 'Precisamos de uma pausa curta antes da reunião.',
        gloss: 'we#pronoun need#require a#article short#brief break#pause before#time the#article meeting#work-gathering',
      },
      {
        // "ticket" again, now in a work context: a different sense than travel-ticket
        text: 'Please open a support ticket before the meeting.',
        translation: 'Por favor, abra um chamado de suporte antes da reunião.',
        gloss: 'please#polite open#create-record a#article support#help-service ticket#support-request before#time the#article meeting#work-gathering',
      },
    ],
  },

  // ───────────── Movies & Series (new, original content) ─────────────
  {
    id: 'movies-series',
    worldId: 'movies',
    difficulty: 'beginner',
    category: 'TV',
    decoys: 'a',
    main: {
      text: 'series',
      senseId: 'series#tv-show',
      translation: 'série (de TV)',
      meaning: 'A TV show with many episodes.',
      example: 'We watch a new series every weekend.',
      cloze: { sentence: 'I love this TV ___, I watch every episode.', distractors: ['seeds', 'serious'] },
    },
    secretWords: [
      w('rise', 'subir / nascer', 'The sun will rise soon.'),
      w('sire', 'senhor (antigo)', 'The knight said, “Yes, sire.”'),
      w('see', 'ver', 'I can see the screen.'),
      w('sir', 'senhor', 'Excuse me, sir.'),
      w('rises', 'sobe', 'The hero rises at the end.'),
      w('ears', 'orelhas', 'Cover your ears, it is loud!'),
    ],
    sentences: [
      {
        text: 'We watched the whole series in one weekend.',
        translation: 'Assistimos à série inteira em um fim de semana.',
        gloss: 'we#pronoun watch#view the#article whole#entire series#tv-show in#time-span one#number weekend#days',
      },
      {
        text: 'This series has a great ending.',
        translation: 'Esta série tem um final ótimo.',
        gloss: 'this#near series#tv-show have#possess a#article great#excellent ending#conclusion',
      },
    ],
  },

  // ───────────── Slang & Culture (new, original content) ─────────────
  {
    id: 'slang-chill',
    worldId: 'slang',
    difficulty: 'beginner',
    category: 'Casual talk',
    decoys: 'a',
    main: {
      text: 'chill',
      senseId: 'chill#relax',
      translation: 'relaxar / ficar de boa',
      meaning: 'To relax and not worry about anything.',
      example: 'Let us chill at my place tonight.',
      cloze: { sentence: "I'm tired. I just want to ___ on the couch.", distractors: ['child', 'chilly'] },
    },
    secretWords: [
      w('hill', 'colina', 'The house is on a hill.'),
      w('call', 'ligar / chamar', 'Call me after class.'),
      w('all', 'tudo / todos', 'We are all here.'),
      w('ill', 'doente', 'He is ill today.'),
      w('hail', 'granizo', 'Hail hit the car.'),
    ],
    sentences: [
      {
        text: 'Let us chill at home tonight.',
        translation: 'Vamos relaxar em casa hoje à noite.',
        gloss: 'let-us#suggest ~ chill#relax at#place home#house tonight#night',
      },
      {
        text: 'Just chill and break a leg tonight!',
        translation: 'Fique de boa e boa sorte hoje à noite!',
        gloss: 'just#simply chill#relax and#add break-a-leg#luck ~ ~ tonight#night',
      },
    ],
  },
]

export const levelById = (id: string) => LEVELS.find((l) => l.id === id)!
