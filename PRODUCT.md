# WordQuest — Documento de Produto

> Fonte de verdade do contexto do produto. Atualize aqui ao mudar uma decisão.

## Visão
Jogo **casual de palavras em inglês**, com cara de jogo mobile (não de plataforma de estudos nem de formulário). O jogador aprende inglês naturalmente enquanto joga. Prioridade: ser divertido e "viciante no bom sentido" (sessões curtas, feedback rápido, recompensas pequenas e frequentes, sem culpa nem pressão).

## Requisitos centrais
1. **Jogo casual** — divertido primeiro; aprendizado como consequência.
2. **Mecânica principal** — formar palavras em inglês **tocando letras embaralhadas** na tela (sem digitar). Teclado físico é bônus no desktop.
3. **Frases** — após descobrir a palavra, desafio de construção de frase em inglês (ordenar palavras).
4. **Palavras secretas** — palavras secundárias formáveis com as letras disponíveis. Mostrar **quantas existem** sem revelar quais; cada descoberta **inédita** = **+1 moeda**.
5. **Feedback visual (estilo Wordle)** — verde = posição correta; amarelo = letra presente em outra posição; cinza = ausente. Letras repetidas tratadas corretamente (passada de verdes primeiro, depois amarelos limitados pela contagem restante).
6. **Mundos temáticos** — Everyday City, Music World, Travel Quest, Mystery Words, cada um com identidade, desafios e progresso independentes.
7. **Aprendizado contextual** — ao descobrir uma palavra: tradução, explicação curta, exemplo de uso e botão de pronúncia.
8. **Antirrepetição** — palavras conhecidas reaparecem em **novos contextos** (variantes de frase, cloze de revisão), sem repetir o mesmo exercício.
9. **Dicas e moedas** — dicas custam moedas; moedas vêm de jogar. **Sem monetização real.**
10. **Públicos** — motor preparado para iniciante → avançado (`beginner | intermediate | advanced`).
11. **Music World** — apenas frases originais ou conteúdo autorizado. **Nunca** letras comerciais protegidas.

## Regras de palavras secretas
- Cada fase tem uma lista **curada** (`secretWords`), em vez de aceitar qualquer combinação arbitrária.
- Respeitam a **frequência máxima** de cada letra do conjunto (inclusive repetidas).
- Palavras secretas **não** são obrigatórias para concluir a fase.
- Recompensa **uma única vez** por palavra por fase (persistida); fases concluídas podem ser revisitadas para achar as restantes.
- **Não contam como domínio de vocabulário** sem validação adicional (só a palavra principal + frase contam).
- Validação em módulo **separado** da avaliação da palavra principal (`engine/secrets.ts` vs `engine/evaluate.ts`).
- Se um palpite com o tamanho da palavra principal for um anagrama listado como secreta (ex.: BREAD → BEARD), conta como secreta.

## Mundos (Fase 2)
Mundos são **áreas de interesse**; nível de proficiência é uma escolha separada (qualquer mundo mistura iniciante→avançado).

| Mundo | Fases | Observação |
|---|---|---|
| Travel World | ticket, airport, passport | |
| Business World | meeting | conteúdo novo |
| Music World | guitar, melody, symphony | só conteúdo original (ver *Music World*) |
| Movies & Series | series | conteúdo novo |
| Everyday Life | bread, street, pharmacy | antigo *Everyday City* (ids `city-*` mantidos) |
| Slang & Culture | chill | conteúdo novo |
| **Mystery Words** (modo especial, `kind: 'mode'`) | secret, mystery, labyrinth | deixou de ser mundo de interesse; progresso preservado |

- **Onboarding:** nível + **múltiplos interesses** (mín. 1); editável depois (✏️ na Home). Mundos escolhidos aparecem primeiro; os demais ficam em *More worlds*; todos continuam acessíveis.
- Estrutura: `World { kind: 'interest' | 'mode', levelIds, theme, categories }`; `Level.worldId`. Novo mundo/fase = só dados.
- **Ids de fase são estáveis** (o progresso usa o id), mesmo quando a fase muda de mundo.

## Fluxo de uma fase
`Palavra principal` → `Cartão da palavra` (tradução, explicação, exemplo, 🔊) → `Frase` (ordenar) → `Revisão rápida` (cloze com palavra já aprendida, se houver) → `Celebração`. Palavras secretas podem ser achadas a qualquer momento e depois, na revisita.

## Economia (sem dinheiro real)
- Ganha: palavra principal +5 (1ª vez), frase +3 (1ª vez), revisão +1, secreta +1 (1ª vez).
- Gasta: dica de letra 3, dica de significado 1, pista de secreta 2.

## Fora de escopo agora
Backend, contas, 3D/animações complexas, anúncios/compras, conquistas, ranking, conteúdo de letras comerciais.

## Stack e arquitetura
React + TypeScript + Vite, `localStorage` (`wordquest:v1`), Web Speech API para pronúncia, WebAudio para efeitos.
Lógica de jogo pura em `src/engine` (testável com Vitest); conteúdo em `src/data` (novo mundo/fase = só dados).


## Fase 2 — decisões

### Modelo de conteúdo
`Word (lemma)` → `Sense` (significado contextual, id `lemma#slug`) → usado em **frases** via `gloss`. **Desafio** = `Level` (pertence a um mundo/modo). **Histórico** = por *sense*, não por grafia.
- Mesma palavra em vários contextos tem *senses* distintos (ex.: `ticket#pass` em Travel × `ticket#support-request` em Business; `mystery#unknown` × `mystery#story-genre`).
- Dominar um *sense* **não** marca os outros como dominados (`Progress.meanings[senseId]`). Palavras secretas continuam sem contar como domínio.
- Mecânica de secretas e de frases inalterada.

### Dicionário Vivo
- Toque em qualquer palavra de uma frase (frase concluída, revisão e exemplos dos cartões). Antes de concluir a frase, ligue 📖 *Look up words*, para não conflitar com montar a frase.
- Cartão: palavra como aparece, forma-base (se diferente), tradução **do contexto**, explicação curta, exemplo, 🔊.
- Dados: `SentenceChallenge.gloss` = um item por palavra: `lemma#slug` | `-` (sem entrada) | `~` (continua a expressão anterior, ex.: *break a leg*). Registro em `data/senses.ts`; os sentidos das palavras principais vêm de `levels.ts`.
- **Sem entrada revisada → fallback explícito** ("No reviewed entry yet") + tradução da frase inteira + pronúncia; nada é inventado. Sem IA nem rede.
- Pontuação e espaços preservados (`tokenizeText`); os índices de palavra coincidem com os do montador de frases.

### Persistência
`Progress` v2 (`interests`, `onboarded`, `meanings`); a chave `wordquest:v1` foi mantida e o payload carrega `version`. `migrateProgress` (v1→v2): preserva moedas, configurações e fases; converte `words[texto]` em `meanings[senseId]`; infere interesses dos mundos já jogados; entrada inválida → progresso novo.

### Music World — planejado (não integrado)
- Modelo pronto em `data/types.ts`: `LicenseInfo` (status, titular, referência, validade, permissões por recurso) e `MusicChallenge` (faixa, trechos, licença, notas de linguagem figurada, áudio autorizado). `engine/licensing.ts#canUse` bloqueia `unverified`, exige permissão explícita por recurso (texto/tradução/áudio) e respeita validade.
- Hoje: só frases originais; um teste garante que todo conteúdo enviado é original/autorizado.
- **Pendências:** licença de letras (por faixa e território); fonte de tradução **revisada por humano** para trechos licenciados; UI de descoberta de palavras em trechos; interpretação de linguagem figurada (`FigurativeNote` já modelada); player de áudio autorizado; painel de curadoria/licenças. Fora de escopo: scraping, letras comerciais, tradução automática de letras, integrações pagas.

### Conteúdo
Todas as palavras das 31 frases têm entrada no dicionário; palavras fora do registro caem no fallback. Traduções e exemplos foram escritos à mão e **precisam de revisão humana** antes de uma publicação ampla.
