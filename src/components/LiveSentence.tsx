import { tokenizeText, type Resolved, type Resolver } from '../engine/dictionary'

interface Props {
  text: string
  resolve: Resolver
  onWord(surface: string, resolved: Resolved): void
  className?: string
}

/** Renders a sentence exactly as written (spaces, punctuation); every word — or whole expression — is tappable. */
export function LiveSentence({ text, resolve, onWord, className }: Props) {
  const pieces = tokenizeText(text)
  const nodes: React.ReactNode[] = []
  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i]
    if (p.kind === 'gap') {
      nodes.push(<span key={i}>{p.text}</span>)
      continue
    }
    const r = resolve(p.index)
    let surface = p.text
    let end = i
    if (r.start === p.index && r.span > 1) {
      // expression: swallow pieces up to the last word of the span, keeping inner spaces/punctuation
      const lastWord = p.index + r.span - 1
      while (end < pieces.length - 1) {
        const q = pieces[end]
        if (q.kind === 'word' && q.index === lastWord) break
        end++
        surface += pieces[end].text
      }
    }
    nodes.push(
      <button key={i} className={`lw${r.entry ? ' known' : ''}${r.span > 1 ? ' expr' : ''}`} onClick={() => onWord(surface, r)}>
        {surface}
      </button>,
    )
    i = end
  }
  return <span className={`live-sentence${className ? ` ${className}` : ''}`}>{nodes}</span>
}
