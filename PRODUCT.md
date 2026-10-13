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

## Mundos
Estrutura de dados (`World`): `id`, `title`, `description`, `theme` (cores/ícone), `categories`, `levelIds`. Progresso independente por mundo (derivado dos níveis). Conquistas/colecionáveis: campo futuro, não implementado.

| Mundo | Identidade | Níveis do protótipo |
|---|---|---|
| Everyday City | cidade ensolarada | BREAD (iniciante), STREET (interm.), PHARMACY (avançado) |
| Music World | roxo/neon | GUITAR, MELODY, SYMPHONY |
| Travel Quest | céu/aventura | TICKET, AIRPORT, PASSPORT |
| Mystery Words | noite/mistério | SECRET, MYSTERY, LABYRINTH |

O jogador escolhe mundos livremente; o seletor de nível de inglês só **recomenda** fases (todas ficam destravadas).

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
