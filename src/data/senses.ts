import type { Sense } from './types'
import { LEVELS } from './levels'

// Reviewed, structured dictionary entries (no external services).
// Tuple: [id, translation, usage, example?]. Main-word senses are derived from levels.ts (single source of truth).
type T = [string, string, string, string?]

const ENTRIES: T[] = [
  // pronouns / determiners
  ['i#pronoun', 'eu', 'The speaker, as the subject of a sentence.', 'I live here.'],
  ['you#pronoun', 'você / vocês', 'The person (or people) you are talking to.', 'You are late.'],
  ['she#pronoun', 'ela', 'A woman or girl we already know about.', 'She is my sister.'],
  ['we#pronoun', 'nós', 'The speaker and other people.', 'We are friends.'],
  ['they#pronoun', 'eles / elas', 'People or things already mentioned.', 'They are at home.'],
  ['my#possessive', 'meu / minha', 'Shows that something belongs to the speaker.', 'My bag is red.'],
  ['our#possessive', 'nosso(a)', 'Belongs to the speaker and other people.', 'Our house is small.'],
  ['your#possessive', 'seu / sua', 'Belongs to the person you are talking to.', 'Is this your phone?'],
  ['this#near', 'este / esta / isto', 'Points to something close to you.', 'This is my phone.'],
  ['the#article', 'o / a / os / as', 'Points to a specific thing both people know.', 'The sun is hot.'],
  ['a#article', 'um / uma', 'Any one thing, not a specific one. (Use "an" before vowel sounds.)', 'I have a dog.'],
  ['me#object', 'me / mim', 'The speaker as the object of an action.', 'Call me later.'],
  // be / have / modals
  ['be#state', 'ser / estar', 'The verb "to be": says what someone or something is. (am, is, are)', 'The soup is hot.'],
  ['have#possess', 'ter', 'To own or to hold something. (has = he/she/it)', 'She has a car.'],
  ['can#ability', 'conseguir / saber', 'Being able to do something.', 'Can you swim?'],
  ['can#possibility', 'poder', 'Asking or saying what is possible.', 'Where can I park?'],
  ['can#request', 'poder (pedido)', 'A polite request: "Can we...?"', 'Can we start now?'],
  ['will#future', 'vou / irei', 'Says what is going to happen.', 'I will call you.'],
  ['let-us#suggest', 'vamos', '"Let us" invites others to do something together.', 'Let us go now.'],
  // prepositions & connectors
  ['to#direction', 'para / até', 'Shows a destination, direction or target time.', 'We walk to school.'],
  ['to#purpose', 'para (+ verbo)', 'Shows the reason for an action.', 'I came to help.'],
  ['to#infinitive', '(marca do infinitivo)', 'Goes before a verb in its base form.', 'I want to read.'],
  ['at#place', 'em', 'An exact place or point.', 'She is at home.'],
  ['at#clock-time', 'às / em', 'An exact time of the day.', 'See you at noon.'],
  ['in#inside', 'em / dentro de', 'Inside a place or space.', 'The keys are in the bag.'],
  ['in#time-span', 'em / durante', 'Within a period of time.', 'We finished in one day.'],
  ['on#place-street', 'em / na', 'Used with streets and surfaces.', 'The shop is on Main Street.'],
  ['on#instrument', 'no / ao', 'Says which instrument a tune is played on.', 'He plays a song on the piano.'],
  ['on#day', 'na / no', 'Used with days of the week.', 'On Monday, we rest.'],
  ['for#duration', 'por', 'How long something lasts.', 'I waited for an hour.'],
  ['with#together', 'com', 'Together with someone or something.', 'Tea with milk, please.'],
  ['and#add', 'e', 'Joins two ideas or things.', 'Salt and pepper.'],
  ['before#time', 'antes de', 'Earlier than something else.', 'Wash your hands before lunch.'],
  ['through#passing', 'por / através de', 'From one end or side to the other.', 'We walked through the park.'],
  ['inside#within', 'dentro de', 'In the inner part of a place.', 'The cat is inside the box.'],
  ['every#each', 'todo / toda', 'Each one, without exception.', 'I run every day.'],
  ['very#intensifier', 'muito', 'Makes the next word stronger.', 'It is very cold.'],
  ['just#simply', 'só / apenas', 'Only; simply.', 'Just relax.'],
  ['one#number', 'um / uma', 'The number 1.', 'I have one brother.'],
  ['where#question-place', 'onde', 'Asks about a place.', 'Where is the bank?'],
  ['please#polite', 'por favor', 'Makes a request polite.', 'Sit down, please.'],
  // time words
  ['tonight#night', 'hoje à noite', 'This evening or this night.', 'I will study tonight.'],
  ['today#now', 'hoje', 'This present day.', 'It is sunny today.'],
  ['morning#am', 'manhã', 'The early part of the day.', 'Good morning!'],
  ['noon#midday', 'meio-dia', 'Twelve o’clock in the day.', 'Lunch is at noon.'],
  ['hour#time-unit', 'hora', 'A period of sixty minutes.', 'The film is two hours long.'],
  ['friday#weekday', 'sexta-feira', 'The day after Thursday.', 'We meet on Friday.'],
  ['weekend#days', 'fim de semana', 'Saturday and Sunday.', 'I rest at the weekend.'],
  ['nine#number', 'nove', 'The number 9.', 'It is nine o’clock.'],
  // verbs
  ['buy#purchase', 'comprar', 'To get something by paying for it. (bought = past)', 'I buy milk at the shop.'],
  ['like#enjoy', 'gostar de', 'To enjoy something.', 'I like music.'],
  ['cross#go-over', 'atravessar', 'To go from one side to the other.', 'Cross the bridge slowly.'],
  ['close#end-business', 'fechar', 'To stop being open for the day.', 'The bank closes at five.'],
  ['pick-up#collect', 'pegar / buscar', 'To go and collect something or someone.', 'I pick up the kids at five.'],
  ['tune#adjust', 'afinar', 'To adjust an instrument to the right sounds.', 'He tunes his violin.'],
  ['play#instrument', 'tocar', 'To make music with an instrument.', 'I play the piano.'],
  ['make#cause-feeling', 'fazer (alguém sentir)', 'To cause someone to feel something.', 'This song makes me smile.'],
  ['feel#experience', 'sentir-se', 'To experience an emotion or condition.', 'I feel tired.'],
  ['begin#start', 'começar', 'To start.', 'Class begins at eight.'],
  ['go#travel', 'ir', 'To move or travel to a place. (went = past)', 'We go to school by bus.'],
  ['hear#listen', 'ouvir', 'To receive sounds with your ears.', 'I can hear music.'],
  ['need#require', 'precisar de', 'To require something.', 'I need water.'],
  ['arrive#reach', 'chegar', 'To reach a place.', 'The train arrives at six.'],
  ['show#present', 'mostrar', 'To let someone see something.', 'Show your ticket, please.'],
  ['keep#store', 'guardar', 'To put something somewhere and have it there.', 'I keep my keys here.'],
  ['keep#hold-private', 'guardar (segredo)', 'To not tell a secret to anyone.', 'Please keep it secret.'],
  ['love#adore', 'adorar / amar', 'To like something very much.', 'I love pizza.'],
  ['read#book', 'ler', 'To look at words and understand them.', 'I read before bed.'],
  ['wander#roam', 'vagar', 'To walk without a plan.', 'They wander in the old town.'],
  ['move#reschedule', 'mudar / remarcar', 'To change a plan to another time.', 'Can we move lunch to one?'],
  ['open#create-record', 'abrir (chamado)', 'To start a new request or record.', 'Open a new case for this.'],
  ['watch#view', 'assistir', 'To look at something for some time.', 'I watch TV at night.'],
  // nouns
  ['cheese#cheese', 'queijo', 'A food made from milk.', 'I like cheese pizza.'],
  ['shop#store', 'loja', 'A place where you buy things.', 'The shop opens at nine.'],
  ['medicine#drug', 'remédio', 'Something you take to feel better.', 'Take this medicine twice a day.'],
  ['brother#sibling', 'irmão', 'A boy or man with the same parents as you.', 'My brother is tall.'],
  ['show#performance', 'show / espetáculo', 'A public performance.', 'The show starts at eight.'],
  ['piano#keyboard', 'piano', 'A large instrument with black and white keys.', 'She plays the piano.'],
  ['train#rail', 'trem', 'A vehicle that runs on rails.', 'The train is fast.'],
  ['desk#counter', 'balcão / mesa', 'A table or counter where people work or help you.', 'Ask at the front desk.'],
  ['museum#place', 'museu', 'A building where people look at art, history or science.', 'We visited the museum on Sunday.'],
  ['place#location', 'lugar', 'A particular spot.', 'This is a quiet place.'],
  ['key#door-key', 'chave', 'A small object that opens a lock.', 'I lost my key.'],
  ['mystery#story-genre', '(história de) mistério', 'A story where you try to find out what happened.', 'I read a mystery on holiday.'],
  ['treasure#valuables', 'tesouro', 'Valuable things, like gold and jewels.', 'The pirates hid the treasure.'],
  ['break#pause', 'pausa', 'A short rest from work.', 'Let us take a break.'],
  ['support#help-service', 'suporte', 'A service that helps users with problems.', 'Call customer support.'],
  ['ticket#support-request', 'chamado (de suporte)', 'A record of a problem sent to a help team.', 'I opened a ticket yesterday.'],
  ['break-a-leg#luck', 'quebre a perna! (boa sorte)', 'Idiom: wishing good luck, usually before a show.', 'Break a leg tonight!'],
  ['home#house', 'casa / lar', 'The place where you live.', 'I am at home.'],
  ['ending#conclusion', 'final', 'The last part of a story.', 'The film has a sad ending.'],
  // adjectives / adverbs
  ['fresh#recent', 'fresco', 'Recently made or picked; not old.', 'Fresh juice, please.'],
  ['next#following', 'próximo', 'The one that comes after this one.', 'See you next week.'],
  ['carefully#with-care', 'com cuidado', 'In a careful way.', 'Drive carefully.'],
  ['new#recent', 'novo', 'Recently made, bought or discovered.', 'I have a new phone.'],
  ['sweet#pleasant', 'doce / agradável', 'Pleasant to hear or taste.', 'She has a sweet voice.'],
  ['happy#glad', 'feliz', 'Feeling joy.', 'I am happy today.'],
  ['softly#gently', 'suavemente', 'In a quiet, gentle way.', 'Speak softly, please.'],
  ['busy#crowded', 'movimentado / ocupado', 'Full of people or activity.', 'The street is busy.'],
  ['safe#secure', 'seguro', 'Free from danger.', 'Keep your money safe.'],
  ['little#small', 'pequeno', 'Small in size or amount.', 'A little dog.'],
  ['missing#lost', 'perdido / desaparecido', 'Not where it should be.', 'My missing keys.'],
  ['good#nice', 'bom / boa', 'Of high quality; pleasant.', 'A good book.'],
  ['hidden#concealed', 'escondido', 'Kept where nobody can see.', 'A hidden door.'],
  ['deep#far-inside', 'bem no fundo', 'Far inside or far down.', 'Deep in the forest.'],
  ['short#brief', 'curto / breve', 'Not long in time.', 'A short walk.'],
  ['whole#entire', 'inteiro / todo', 'All of something.', 'I ate the whole pizza.'],
  ['great#excellent', 'ótimo', 'Very good.', 'What a great day!'],
]

function build(): Record<string, Sense> {
  const out: Record<string, Sense> = {}
  const lemmaOf = (id: string) => id.split('#')[0].replace(/-/g, ' ')
  for (const [id, translation, usage, example] of ENTRIES) {
    out[id] = { id, lemma: lemmaOf(id), translation, usage, example }
  }
  // Main-word senses come straight from the levels that teach them.
  for (const l of LEVELS) {
    const m = l.main
    out[m.senseId] = { id: m.senseId, lemma: m.text, translation: m.translation, usage: m.meaning, example: m.example }
  }
  return out
}

export const SENSES: Record<string, Sense> = build()
