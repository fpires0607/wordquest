import type { Level, WordInfo } from './types'

// Expansion pack: 20 more levels so every world has 5 (2 beginner, 2 intermediate, 1 advanced).
// Same rules as levels.ts: original sentences only; secrets are common words checked by tests;
// every sentence has a gloss for the live dictionary.
const w = (text: string, translation: string, example: string): WordInfo => ({ text, translation, example })

export const EXTRA_LEVELS: Level[] = [
  // ───────────── Travel World ─────────────
  {
    id: 'travel-hotel',
    worldId: 'travel',
    difficulty: 'beginner',
    category: 'Places',
    decoys: 'a',
    main: {
      text: 'hotel',
      senseId: 'hotel#lodging',
      translation: 'hotel',
      meaning: 'A place where travelers pay to stay and sleep.',
      example: 'We stayed at a small hotel by the sea.',
      cloze: { sentence: 'I booked a room at the ___ near the beach.', distractors: ['bakery', 'pharmacy'] },
    },
    secretWords: [
      w('hat', 'chapéu', 'He wears a red hat.'),
      w('hot', 'quente', 'The soup is hot.'),
      w('toe', 'dedo do pé', 'I hurt my toe.'),
      w('late', 'tarde / atrasado', 'The bus is late.'),
      w('heat', 'calor', 'I love the summer heat.'),
    ],
    sentences: [
      {
        text: 'The hotel is near the beach.',
        translation: 'O hotel fica perto da praia.',
        gloss: 'the#article hotel#lodging be#state near#close-to the#article beach#shore',
      },
      {
        text: 'We booked a room at the hotel.',
        translation: 'Reservamos um quarto no hotel.',
        gloss: 'we#pronoun book#reserve a#article room#bedroom at#place the#article hotel#lodging',
      },
    ],
  },
  {
    id: 'travel-luggage',
    worldId: 'travel',
    difficulty: 'intermediate',
    category: 'Transport',
    decoys: 'r',
    main: {
      text: 'luggage',
      senseId: 'luggage#bags',
      translation: 'bagagem',
      meaning: 'The bags and suitcases you take on a trip.',
      example: 'My luggage is very heavy.',
      cloze: { sentence: 'Please put your ___ on the scale.', distractors: ['language', 'message'] },
    },
    secretWords: [
      w('age', 'idade', 'What is your age?'),
      w('leg', 'perna', 'My leg hurts.'),
      w('glue', 'cola', 'I need glue for this paper.'),
      w('large', 'grande', 'I want a large coffee.'),
      w('rule', 'regra', 'Follow the rule.'),
    ],
    sentences: [
      {
        text: 'Please carry my luggage to the room.',
        translation: 'Por favor, leve minha bagagem até o quarto.',
        gloss: 'please#polite carry#transport my#possessive luggage#bags to#direction the#article room#bedroom',
      },
      {
        text: 'Your luggage is very heavy.',
        translation: 'Sua bagagem está muito pesada.',
        gloss: 'your#possessive luggage#bags be#state very#intensifier heavy#weighty',
      },
    ],
  },

  // ───────────── Business World ─────────────
  {
    id: 'business-email',
    worldId: 'business',
    difficulty: 'beginner',
    category: 'Workplace',
    decoys: 's',
    main: {
      text: 'email',
      senseId: 'email#message',
      translation: 'e-mail',
      meaning: 'A message you send with a computer or phone.',
      example: 'I will send you an email today.',
      cloze: { sentence: 'I will reply to your ___ this afternoon.', distractors: ['smile', 'meal'] },
    },
    secretWords: [
      w('mail', 'correio', 'The mail arrives at noon.'),
      w('mile', 'milha', 'The shop is one mile away.'),
      w('aim', 'objetivo', 'Our aim is to learn fast.'),
      w('same', 'mesmo / igual', 'We have the same phone.'),
      w('sale', 'liquidação', 'There is a sale this week.'),
    ],
    sentences: [
      {
        text: 'Please check your email before lunch.',
        translation: 'Por favor, confira seu e-mail antes do almoço.',
        gloss: 'please#polite check#verify your#possessive email#message before#time lunch#midday-meal',
      },
      {
        text: 'I will send you an email.',
        translation: 'Vou te enviar um e-mail.',
        gloss: 'i#pronoun will#future send#deliver you#pronoun a#article email#message',
      },
    ],
  },
  {
    id: 'business-office',
    worldId: 'business',
    difficulty: 'beginner',
    category: 'Workplace',
    decoys: 'a',
    main: {
      text: 'office',
      senseId: 'office#workplace',
      translation: 'escritório',
      meaning: 'A room or building where people work.',
      example: 'My office is on the second floor.',
      cloze: { sentence: 'I work in an ___ downtown.', distractors: ['elephant', 'envelope'] },
    },
    secretWords: [
      w('ice', 'gelo', 'Put some ice in the glass.'),
      w('off', 'desligado', 'Turn the light off.'),
      w('face', 'rosto', 'She has a kind face.'),
      w('cafe', 'cafeteria', 'We met at a small cafe.'),
      w('ace', 'ás / craque', 'He is an ace at chess.'),
    ],
    sentences: [
      {
        text: 'My office is on the second floor.',
        translation: 'Meu escritório fica no segundo andar.',
        gloss: 'my#possessive office#workplace be#state on#place-street the#article second#ordinal floor#storey',
      },
      {
        text: 'She works in a big office.',
        translation: 'Ela trabalha em um escritório grande.',
        gloss: 'she#pronoun work#have-job in#inside a#article big#large office#workplace',
      },
    ],
  },
  {
    id: 'business-deadline',
    worldId: 'business',
    difficulty: 'intermediate',
    category: 'Workplace',
    decoys: 'o',
    main: {
      text: 'deadline',
      senseId: 'deadline#due-date',
      translation: 'prazo',
      meaning: 'The latest time when something must be finished.',
      example: 'The deadline for the report is Friday.',
      cloze: { sentence: 'We must finish the project before the ___.', distractors: ['headline', 'airline'] },
    },
    secretWords: [
      w('deal', 'acordo', 'We made a good deal.'),
      w('lead', 'liderar', 'She will lead the team.'),
      w('line', 'linha / fila', 'Wait in line, please.'),
      w('idea', 'ideia', 'That is a great idea.'),
      w('need', 'precisar', 'I need more time.'),
      w('dine', 'jantar', 'We dine at eight.'),
    ],
    sentences: [
      {
        text: 'The deadline is next Friday.',
        translation: 'O prazo é na próxima sexta.',
        gloss: 'the#article deadline#due-date be#state next#following friday#weekday',
      },
      {
        text: 'We can still meet the deadline.',
        translation: 'Ainda podemos cumprir o prazo.',
        gloss: 'we#pronoun can#ability still#continue meet#fulfill the#article deadline#due-date',
      },
    ],
  },
  {
    id: 'business-contract',
    worldId: 'business',
    difficulty: 'advanced',
    category: 'Documents',
    decoys: 'e',
    main: {
      text: 'contract',
      senseId: 'contract#agreement',
      translation: 'contrato',
      meaning: 'A written agreement between people or companies.',
      example: 'Both sides signed the contract.',
      cloze: { sentence: 'Please sign the ___ at the bottom of the page.', distractors: ['contest', 'content'] },
    },
    secretWords: [
      w('act', 'agir / ato', 'Act quickly, please.'),
      w('cart', 'carrinho', 'Push the cart slowly.'),
      w('coat', 'casaco', 'Wear a warm coat.'),
      w('care', 'cuidado', 'Take care of yourself.'),
      w('trace', 'rastro / traço', 'I could not find a trace.'),
      w('carton', 'caixa de papelão', 'Open the carton carefully.'),
      w('contact', 'contato', 'Keep in contact with me.'),
    ],
    sentences: [
      {
        text: 'Please sign the contract today.',
        translation: 'Por favor, assine o contrato hoje.',
        gloss: 'please#polite sign#write-name the#article contract#agreement today#now',
      },
      {
        text: 'The contract ends in December.',
        translation: 'O contrato termina em dezembro.',
        gloss: 'the#article contract#agreement end#finish in#time-span december#month',
      },
    ],
  },

  // ───────────── Music World ─────────────
  {
    id: 'music-piano',
    worldId: 'music',
    difficulty: 'beginner',
    category: 'Instruments',
    decoys: 'e',
    main: {
      text: 'piano',
      senseId: 'piano#keyboard',
      translation: 'piano',
      meaning: 'A big instrument with black and white keys.',
      example: 'She plays the piano after dinner.',
      cloze: { sentence: 'He sat down at the ___ and began to play.', distractors: ['pilot', 'pizza'] },
    },
    secretWords: [
      w('pain', 'dor', 'I feel pain in my back.'),
      w('nap', 'cochilo', 'I take a nap after lunch.'),
      w('open', 'abrir', 'Open the window, please.'),
      w('pine', 'pinheiro', 'A pine tree is green all year.'),
      w('pen', 'caneta', 'Do you have a pen?'),
    ],
    sentences: [
      {
        text: 'She plays the piano every evening.',
        translation: 'Ela toca piano toda noite.',
        gloss: 'she#pronoun play#instrument the#article piano#keyboard every#each evening#late-day',
      },
      {
        text: 'The piano sounds beautiful tonight.',
        translation: 'O piano soa lindo hoje à noite.',
        gloss: 'the#article piano#keyboard sound#seem beautiful#pretty tonight#night',
      },
    ],
  },
  {
    id: 'music-singer',
    worldId: 'music',
    difficulty: 'intermediate',
    category: 'Concerts',
    decoys: 'a',
    main: {
      text: 'singer',
      senseId: 'singer#performer-voice',
      translation: 'cantor(a)',
      meaning: 'A person who sings songs.',
      example: 'The singer has a beautiful voice.',
      cloze: { sentence: 'The ___ stepped onto the stage and smiled.', distractors: ['signer', 'sinner'] },
    },
    secretWords: [
      w('sing', 'cantar', 'I sing in the shower.'),
      w('ring', 'anel / tocar', 'She wears a gold ring.'),
      w('sign', 'placa / assinar', 'Read the sign on the door.'),
      w('rise', 'subir', 'The sun will rise soon.'),
      w('near', 'perto', 'The park is near my house.'),
      w('gain', 'ganhar', 'You gain strength every day.'),
    ],
    sentences: [
      {
        text: 'The singer has a great voice.',
        translation: 'A cantora tem uma voz ótima.',
        gloss: 'the#article singer#performer-voice have#possess a#article great#excellent voice#singing-sound',
      },
      {
        text: 'My sister wants to become a singer.',
        translation: 'Minha irmã quer ser cantora.',
        gloss: 'my#possessive sister#sibling-f want#desire to#infinitive become#turn-into a#article singer#performer-voice',
      },
    ],
  },

  // ───────────── Movies & Series ─────────────
  {
    id: 'movies-movie',
    worldId: 'movies',
    difficulty: 'beginner',
    category: 'Cinema',
    decoys: 't',
    main: {
      text: 'movie',
      senseId: 'movie#film',
      translation: 'filme',
      meaning: 'A story shown on a screen, usually in a cinema.',
      example: 'We watched a funny movie last night.',
      cloze: { sentence: 'Let us watch a ___ tonight.', distractors: ['mobile', 'music'] },
    },
    secretWords: [
      w('move', 'mover', 'Please move your bag.'),
      w('vote', 'votar', 'We vote on Sunday.'),
      w('time', 'tempo / hora', 'What time is it?'),
      w('item', 'item', 'Check every item on the list.'),
      w('tie', 'gravata / empate', 'He wears a blue tie.'),
    ],
    sentences: [
      {
        text: 'This movie is very funny.',
        translation: 'Este filme é muito engraçado.',
        gloss: 'this#near movie#film be#state very#intensifier funny#amusing',
      },
      {
        text: 'We watched a movie last night.',
        translation: 'Assistimos a um filme ontem à noite.',
        gloss: 'we#pronoun watch#view a#article movie#film last#previous night#dark-hours',
      },
    ],
  },
  {
    id: 'movies-actor',
    worldId: 'movies',
    difficulty: 'intermediate',
    category: 'Cast & crew',
    decoys: 'e',
    main: {
      text: 'actor',
      senseId: 'actor#performer',
      translation: 'ator / atriz',
      meaning: 'A person who plays a role in a film or play.',
      example: 'The actor learned his lines quickly.',
      cloze: { sentence: 'The famous ___ won an important award.', distractors: ['carpet', 'tractor'] },
    },
    secretWords: [
      w('art', 'arte', 'I love modern art.'),
      w('cart', 'carrinho', 'Push the cart slowly.'),
      w('coat', 'casaco', 'Wear a warm coat.'),
      w('race', 'corrida', 'She won the race.'),
      w('rate', 'taxa / avaliar', 'Please rate the film.'),
      w('core', 'núcleo', 'Honesty is at the core.'),
    ],
    sentences: [
      {
        text: 'The actor speaks very fast.',
        translation: 'O ator fala muito rápido.',
        gloss: 'the#article actor#performer speak#talk very#intensifier fast#quickly',
      },
      {
        text: 'She wants to be an actor.',
        translation: 'Ela quer ser atriz.',
        gloss: 'she#pronoun want#desire to#infinitive be#state a#article actor#performer',
      },
    ],
  },
  {
    id: 'movies-scene',
    worldId: 'movies',
    difficulty: 'intermediate',
    category: 'Cinema',
    decoys: 'a',
    main: {
      text: 'scene',
      senseId: 'scene#film-part',
      translation: 'cena',
      meaning: 'A short part of a film or play.',
      example: 'That scene made everyone laugh.',
      cloze: { sentence: 'My favorite ___ is at the end of the film.', distractors: ['screen', 'science'] },
    },
    secretWords: [
      w('see', 'ver', 'I can see the screen.'),
      w('sea', 'mar', 'The sea is calm tonight.'),
      w('case', 'caso / estojo', 'Put it in the case.'),
      w('scan', 'escanear', 'Scan the code, please.'),
      w('sane', 'são / lúcido', 'He seems calm and sane.'),
      w('cane', 'bengala', 'He walks with a cane.'),
    ],
    sentences: [
      {
        text: 'This scene is my favorite.',
        translation: 'Esta cena é a minha favorita.',
        gloss: 'this#near scene#film-part be#state my#possessive favorite#preferred',
      },
      {
        // "last" here means final, not previous (compare movies-movie)
        text: 'The last scene was very sad.',
        translation: 'A última cena foi muito triste.',
        gloss: 'the#article last#final scene#film-part be#state very#intensifier sad#unhappy',
      },
    ],
  },
  {
    id: 'movies-director',
    worldId: 'movies',
    difficulty: 'advanced',
    category: 'Cast & crew',
    decoys: 'a',
    main: {
      text: 'director',
      senseId: 'director#film-boss',
      translation: 'diretor(a)',
      meaning: 'The person who guides the making of a film.',
      example: 'The director chose a new actor.',
      cloze: { sentence: 'The ___ shouted, “Quiet on the set!”', distractors: ['dentist', 'detective'] },
    },
    secretWords: [
      w('dirt', 'sujeira', 'There is dirt on your shoes.'),
      w('rice', 'arroz', 'We eat rice every day.'),
      w('cord', 'cabo / corda', 'The cord is too short.'),
      w('credit', 'crédito', 'She gets credit for the idea.'),
      w('trade', 'comércio / trocar', 'They trade old books.'),
      w('direct', 'direto / dirigir', 'Take a direct flight.'),
      w('tired', 'cansado', 'I am tired after work.'),
    ],
    sentences: [
      {
        text: 'The director wants another take.',
        translation: 'O diretor quer outra tomada.',
        gloss: 'the#article director#film-boss want#desire another#one-more take#shot',
      },
      {
        text: 'She is the director of the film.',
        translation: 'Ela é a diretora do filme.',
        gloss: 'she#pronoun be#state the#article director#film-boss of#belonging the#article film#movie',
      },
    ],
  },

  // ───────────── Everyday Life ─────────────
  {
    id: 'everyday-water',
    worldId: 'everyday',
    difficulty: 'beginner',
    category: 'Food',
    decoys: 'o',
    main: {
      text: 'water',
      senseId: 'water#liquid',
      translation: 'água',
      meaning: 'The clear liquid we drink.',
      example: 'I drink water every morning.',
      cloze: { sentence: 'Can I have a glass of ___, please?', distractors: ['winter', 'waiter'] },
    },
    secretWords: [
      w('eat', 'comer', 'We eat at seven.'),
      w('tea', 'chá', 'I drink tea every morning.'),
      w('art', 'arte', 'I love modern art.'),
      w('wear', 'vestir', 'I wear a coat in winter.'),
      w('tear', 'lágrima / rasgar', 'A tear ran down her cheek.'),
    ],
    sentences: [
      {
        text: 'Please drink more water.',
        translation: 'Por favor, beba mais água.',
        gloss: 'please#polite drink#swallow more#extra water#liquid',
      },
      {
        text: 'The water is very cold.',
        translation: 'A água está muito fria.',
        gloss: 'the#article water#liquid be#state very#intensifier cold#low-temp',
      },
    ],
  },
  {
    id: 'everyday-kitchen',
    worldId: 'everyday',
    difficulty: 'intermediate',
    category: 'Places',
    decoys: 'a',
    main: {
      text: 'kitchen',
      senseId: 'kitchen#cooking-room',
      translation: 'cozinha',
      meaning: 'The room where food is cooked.',
      example: 'My mother is cooking in the kitchen.',
      cloze: { sentence: 'We cook dinner in the ___.', distractors: ['chicken', 'kitten'] },
    },
    secretWords: [
      w('kite', 'pipa', 'The kite flies high today.'),
      w('thin', 'fino', 'The paper is very thin.'),
      w('chain', 'corrente', 'He wears a gold chain.'),
      w('teach', 'ensinar', 'I teach English online.'),
      w('think', 'pensar', 'I think you are right.'),
      w('tank', 'tanque', 'Fill the tank with water.'),
    ],
    sentences: [
      {
        text: 'The kitchen smells really good.',
        translation: 'A cozinha está com um cheiro muito bom.',
        gloss: 'the#article kitchen#cooking-room smell#odor really#truly good#nice',
      },
      {
        text: 'I help my father in the kitchen.',
        translation: 'Eu ajudo meu pai na cozinha.',
        gloss: 'i#pronoun help#assist my#possessive father#dad in#inside the#article kitchen#cooking-room',
      },
    ],
  },

  // ───────────── Slang & Culture ─────────────
  {
    id: 'slang-dude',
    worldId: 'slang',
    difficulty: 'beginner',
    category: 'Casual talk',
    decoys: 'an',
    main: {
      text: 'dude',
      senseId: 'dude#casual-friend',
      translation: 'cara / mano',
      meaning: 'Casual word for a man or a friend.',
      example: 'Hey dude, are you coming tonight?',
      cloze: { sentence: 'Hey ___, long time no see!', distractors: ['dune', 'duty'] },
    },
    secretWords: [
      w('dad', 'pai', 'My dad is a teacher.'),
      w('end', 'fim', 'This is the end.'),
      w('and', 'e', 'Salt and pepper.'),
      w('due', 'devido', 'The report is due today.'),
      w('dune', 'duna', 'We climbed a sand dune.'),
    ],
    sentences: [
      {
        text: 'Hey dude, what is up?',
        translation: 'Ei, cara, e aí?',
        gloss: 'hey#greeting dude#casual-friend what-is-up#how-are-you ~ ~',
      },
      {
        text: 'You are a cool dude.',
        translation: 'Você é um cara legal.',
        gloss: 'you#pronoun be#state a#article cool#awesome dude#casual-friend',
      },
    ],
  },
  {
    id: 'slang-awesome',
    worldId: 'slang',
    difficulty: 'intermediate',
    category: 'Casual talk',
    decoys: 'k',
    main: {
      text: 'awesome',
      senseId: 'awesome#great',
      translation: 'incrível / demais',
      meaning: 'Really great; very impressive.',
      example: 'Your new bike looks awesome!',
      cloze: { sentence: 'That concert was ___!', distractors: ['asleep', 'aware'] },
    },
    secretWords: [
      w('some', 'algum', 'I want some water.'),
      w('same', 'mesmo / igual', 'We have the same phone.'),
      w('seem', 'parecer', 'You seem happy today.'),
      w('ease', 'facilidade', 'She did it with ease.'),
      w('owe', 'dever', 'I owe you a coffee.'),
      w('was', 'era / foi', 'It was a great day.'),
    ],
    sentences: [
      {
        text: 'That party was awesome!',
        translation: 'Aquela festa foi incrível!',
        gloss: 'that#far party#celebration be#state awesome#great',
      },
      {
        text: 'This pizza tastes awesome.',
        translation: 'Esta pizza tem um gosto incrível.',
        gloss: 'this#near pizza#food-pizza taste#flavor awesome#great',
      },
    ],
  },
  {
    id: 'slang-slang',
    worldId: 'slang',
    difficulty: 'intermediate',
    category: 'Expressions',
    decoys: 'e',
    main: {
      text: 'slang',
      senseId: 'slang#informal-words',
      translation: 'gíria',
      meaning: 'Informal words used by a group of people.',
      example: 'Teenagers use a lot of slang.',
      cloze: { sentence: 'He used a new ___ word I did not know.', distractors: ['salad', 'single'] },
    },
    secretWords: [
      w('sang', 'cantou', 'She sang all night.'),
      w('lane', 'faixa / travessa', 'Stay in your lane.'),
      w('angle', 'ângulo', 'Look at it from another angle.'),
      w('sale', 'liquidação', 'There is a sale this week.'),
      w('seal', 'foca / selo', 'A seal swims by the boat.'),
      w('sane', 'são / lúcido', 'He seems calm and sane.'),
    ],
    sentences: [
      {
        text: 'Slang changes very fast.',
        translation: 'A gíria muda muito rápido.',
        gloss: 'slang#informal-words change#become-different very#intensifier fast#quickly',
      },
      {
        text: 'I do not know this slang.',
        translation: 'Eu não conheço essa gíria.',
        gloss: 'i#pronoun do-not#negation ~ know#be-familiar this#near slang#informal-words',
      },
    ],
  },
  {
    id: 'slang-awkward',
    worldId: 'slang',
    difficulty: 'advanced',
    category: 'Feelings',
    decoys: 'e',
    main: {
      text: 'awkward',
      senseId: 'awkward#uncomfortable',
      translation: 'constrangedor / sem jeito',
      meaning: 'Uncomfortable and not easy to deal with.',
      example: 'It was an awkward silence.',
      cloze: { sentence: 'There was an ___ pause after his joke.', distractors: ['award', 'array'] },
    },
    secretWords: [
      w('war', 'guerra', 'They hope for the end of the war.'),
      w('raw', 'cru', 'Do not eat raw eggs.'),
      w('draw', 'desenhar', 'I draw with a pencil.'),
      w('dark', 'escuro', 'It is dark outside.'),
      w('wear', 'vestir', 'I wear a coat in winter.'),
      w('award', 'prêmio', 'She won an award.'),
      w('weak', 'fraco', 'I feel weak today.'),
    ],
    sentences: [
      {
        text: 'That was an awkward moment.',
        translation: 'Aquele foi um momento constrangedor.',
        gloss: 'that#far be#state a#article awkward#uncomfortable moment#instant',
      },
      {
        text: 'I feel awkward in big crowds.',
        translation: 'Eu me sinto sem jeito em multidões.',
        gloss: 'i#pronoun feel#experience awkward#uncomfortable in#inside big#large crowd#many-people',
      },
    ],
  },

  // ───────────── Mystery Words (special mode) ─────────────
  {
    id: 'mystery-shadow',
    worldId: 'mystery',
    difficulty: 'beginner',
    category: 'Ideas',
    decoys: 'e',
    main: {
      text: 'shadow',
      senseId: 'shadow#dark-shape',
      translation: 'sombra',
      meaning: 'A dark shape made when something blocks the light.',
      example: 'I saw a shadow behind the door.',
      cloze: { sentence: 'A strange ___ moved across the wall.', distractors: ['shower', 'shallow'] },
    },
    secretWords: [
      w('show', 'mostrar / programa', 'The show starts at eight.'),
      w('wash', 'lavar', 'Wash your hands, please.'),
      w('dash', 'correr / traço', 'We had to dash to the bus.'),
      w('shade', 'sombra (do sol)', 'Let us sit in the shade.'),
      w('shed', 'galpão', 'The tools are in the shed.'),
    ],
    sentences: [
      {
        text: 'Something moved in the shadow.',
        translation: 'Algo se moveu na sombra.',
        gloss: 'something#unknown-thing move#change-place in#inside the#article shadow#dark-shape',
      },
      {
        text: 'A shadow followed me home.',
        translation: 'Uma sombra me seguiu até em casa.',
        gloss: 'a#article shadow#dark-shape follow#go-behind me#object home#house',
      },
    ],
  },
  {
    id: 'mystery-detective',
    worldId: 'mystery',
    difficulty: 'intermediate',
    category: 'Stories',
    decoys: 'a',
    main: {
      text: 'detective',
      senseId: 'detective#investigator',
      translation: 'detetive',
      meaning: 'A person who investigates crimes and looks for clues.',
      example: 'The detective found a hidden key.',
      cloze: { sentence: 'The ___ looked for clues in the dark room.', distractors: ['defective', 'directive'] },
    },
    secretWords: [
      w('dice', 'dados', 'We roll the dice.'),
      w('diet', 'dieta', 'She follows a healthy diet.'),
      w('edit', 'editar', 'Please edit the text.'),
      w('tide', 'maré', 'The tide is low now.'),
      w('vice', 'vício', 'Chocolate is my vice.'),
      w('cite', 'citar', 'Always cite your sources.'),
    ],
    sentences: [
      {
        text: 'The detective found a clue.',
        translation: 'O detetive encontrou uma pista.',
        gloss: 'the#article detective#investigator find#discover a#article clue#evidence',
      },
      {
        text: 'Can you help the detective?',
        translation: 'Você pode ajudar o detetive?',
        gloss: 'can#request you#pronoun help#assist the#article detective#investigator',
      },
    ],
  },
]
