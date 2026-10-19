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

## Tela de palavras secretas (Fase 2.1)
- Botão **Secret words x/y** abre a tela com uma fileira de caixas por palavra escondida (só o **tamanho** aparece), agrupadas por tamanho; a ordem da lista curada não é exposta. Achadas preenchem em verde e abrem o cartão ao toque. Roda e GO ficam na mesma tela; nas fases concluídas ela é a tela padrão.
- Na tela de secretas, um palpite com o tamanho da palavra principal que não é secreta conta como tentativa da principal (aviso na tela); acertar a principal volta para a visão principal.
- **Pista progressiva:** cada clique revela **mais uma letra, da esquerda para a direita, da mesma palavra**, até faltar só a última (o jogador sempre precisa completar). Só cobra quando revela; sem moedas ou sem nada a revelar, não cobra. As letras reveladas ficam salvas (`LevelProgress.clues`). Escolha da palavra: continua a mais avançada; senão começa pela mais curta.

### Dificuldade das secretas (Fase 2.2)
- **Orçamento por nível (verificado por teste):** iniciante ≤5 palavras de ≤5 letras; intermediário ≤6 palavras de ≤6 letras; avançado ≤8 palavras de ≤9 letras. Listas revisadas para vocabulário **comum** (saíram *gait, sire, terse, erect, hail, mole, phony, raptor, crest…*).
- **Letra grátis:** iniciante mostra a 1ª letra de cada palavra escondida (`FREE_LETTERS`); intermediário e avançado, nenhuma. A 1ª letra paga começa depois das grátis (nenhuma moeda desperdiçada).
- **Dica de tradução (1 moeda):** tocar numa palavra escondida oferece mostrar o significado em português (ajuda a deduzir a palavra em inglês). Pede confirmação, cobra uma vez por palavra e fica salva (`LevelProgress.peeks`).
- **Backlog relacionado:** palavras bônus (palavra comum válida fora da grade, sem moeda), dica de "travado" após várias tentativas erradas, estrelas por fase.

## Sequência de dias 🔥 (Fase 2.1)
- Conta o dia como ativo ao **progredir de verdade** (achar secreta, resolver principal, concluir frase ou revisão), não só por abrir o app. Dia local (`YYYY-MM-DD`).
- Dia seguinte +1; dia pulado reinicia em 1 (guarda o melhor). A sequência continua viva até o fim do dia seguinte ao último; chama colorida = hoje já ativo, cinza = jogue hoje para manter.
- Persistido em `Progress.streak` (campo aditivo; saves sem ele recebem o padrão). Sem congelamento nem recompensa em moedas por enquanto.

## Fluxo de uma fase
`Palavra principal` → `Cartão da palavra` (tradução, explicação, exemplo, 🔊) → `Frase` (ordenar) → `Revisão rápida` (cloze com palavra já aprendida, se houver) → `Celebração`. Palavras secretas podem ser achadas a qualquer momento e depois, na revisita.

## Economia (sem dinheiro real)
- Ganha: palavra principal +3 (1ª vez), frase +1 (1ª vez), revisão +1 (acerto de primeira), secreta +1 (1ª vez). Começa com 3 moedas. *(Reduzido na Fase 2.1: ganhar estava fácil demais.)*
- Gasta: dica de letra 3, dica de significado 1, pista de secreta 2 **por letra revelada**.

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

## Backlog
- **Conquistas / insígnias** (estilo conquistas do Xbox): por mundo, por palavras secretas, por sequência de dias, por domínio de significados; tela de coleção. A sequência de dias e o histórico por *sense* já fornecem os dados.
- Melhorias da sequência: congelamento (usar moedas), marcos (7/30 dias), lembrete.
- Revisão humana do conteúdo (traduções, exemplos, dicionário).
- Music World licenciado (ver pendências acima).
