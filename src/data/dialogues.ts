import type { Dialogue } from './types'

// Short original dialogues for the worlds where conversation matters most (Business, Movies & Series).
// The answer is always the level's main word; distractors are look-alikes or wrong in context.
const d = (lines: Dialogue['lines'], options: Dialogue['options'], answer: string): Dialogue => ({ lines, options, answer })

export const DIALOGUES: Record<string, Dialogue> = {
  'business-email': d(
    [
      { who: 'A', text: 'Did you get my ___?', pt: 'Você recebeu meu e-mail?' },
      { who: 'B', text: 'Yes, I will reply today.', pt: 'Sim, vou responder hoje.' },
    ],
    ['email', 'mailbox', 'address'],
    'email',
  ),
  'business-office': d(
    [
      { who: 'A', text: 'Do you work at home or in an ___?', pt: 'Você trabalha em casa ou em um escritório?' },
      { who: 'B', text: 'In an office, near the station.', pt: 'Em um escritório, perto da estação.' },
    ],
    ['bank', 'office', 'shop'], // "an" needs a vowel sound: only "office" fits
    'office',
  ),
  'business-meeting': d(
    [
      { who: 'A', text: 'Are you free for a ___ at three?', pt: 'Você está livre para uma reunião às três?' },
      { who: 'B', text: 'Sure, send me the link.', pt: 'Claro, me mande o link.' },
    ],
    ['holiday', 'passport', 'meeting'],
    'meeting',
  ),
  'business-deadline': d(
    [
      { who: 'A', text: 'When is the ___?', pt: 'Quando é o prazo?' },
      { who: 'B', text: 'Next Friday, so we need to hurry.', pt: 'Na próxima sexta, então precisamos nos apressar.' },
    ],
    ['headline', 'bedroom', 'deadline'],
    'deadline',
  ),
  'business-contract': d(
    [
      { who: 'A', text: 'Did the client sign the ___?', pt: 'O cliente assinou o contrato?' },
      { who: 'B', text: 'Yes, it arrived this morning.', pt: 'Sim, chegou hoje de manhã.' },
    ],
    ['contact', 'contract', 'contest'],
    'contract',
  ),
  'business-presentation': d(
    [
      { who: 'A', text: 'How was your ___?', pt: 'Como foi sua apresentação?' },
      { who: 'B', text: 'Great! Everyone asked questions.', pt: 'Ótima! Todo mundo fez perguntas.' },
    ],
    ['presentation', 'prevention', 'pronunciation'],
    'presentation',
  ),
  'movies-series': d(
    [
      { who: 'A', text: 'I watched the whole ___ in a weekend.', pt: 'Assisti a série inteira em um fim de semana.' },
      { who: 'B', text: 'No way! Was it good?', pt: 'Não acredito! Foi boa?' },
    ],
    ['serious', 'sorry', 'series'],
    'series',
  ),
  'movies-movie': d(
    [
      { who: 'A', text: 'What ___ are we watching tonight?', pt: 'Que filme vamos assistir hoje à noite?' },
      { who: 'B', text: 'Something funny, please.', pt: 'Algo engraçado, por favor.' },
    ],
    ['motor', 'movie', 'mobile'],
    'movie',
  ),
  'movies-actor': d(
    [
      { who: 'A', text: 'Who is the ___ in this film?', pt: 'Quem é o ator neste filme?' },
      { who: 'B', text: 'I think it is Maria Costa.', pt: 'Acho que é a Maria Costa.' },
    ],
    ['actor', 'tractor', 'doctor'],
    'actor',
  ),
  'movies-scene': d(
    [
      { who: 'A', text: 'That last ___ made me cry.', pt: 'Aquela última cena me fez chorar.' },
      { who: 'B', text: 'Me too, it was so sad.', pt: 'Eu também, foi tão triste.' },
    ],
    ['season', 'scene', 'screen'],
    'scene',
  ),
  'movies-director': d(
    [
      { who: 'A', text: 'The ___ wants one more take.', pt: 'O diretor quer mais uma tomada.' },
      { who: 'B', text: 'Okay, everyone back to your places!', pt: 'Certo, todo mundo de volta aos lugares!' },
    ],
    ['dictator', 'director', 'direction'],
    'director',
  ),
  'movies-trailer': d(
    [
      { who: 'A', text: 'Have you seen the new ___?', pt: 'Você viu o novo trailer?' },
      { who: 'B', text: 'Yes! I cannot wait for the film.', pt: 'Vi! Mal posso esperar pelo filme.' },
    ],
    ['trailer', 'tractor', 'trainer'],
    'trailer',
  ),
}

export const dialogueFor = (levelId: string): Dialogue | undefined => DIALOGUES[levelId]
