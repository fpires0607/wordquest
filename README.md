# WordQuest (protótipo vertical)

Jogo casual para aprender inglês: forme palavras tocando letras embaralhadas, descubra palavras secretas e monte frases. Veja `PRODUCT.md` para os requisitos.

```bash
npm install
npm run dev     # http://localhost:5173 (abra no celular via modo responsivo)
npm test        # testes do motor e integridade do conteúdo
npm run build
```

- `src/engine` lógica pura (avaliação Wordle, validação de secretas, frases)
- `src/data` mundos e fases (novo conteúdo = só dados)
- `src/state/store.ts` progresso em `localStorage` (`wordquest:v1`)

## PWA (instalável e offline)
Manifest em `public/manifest.webmanifest`, service worker em `public/sw.js` (ativo só no build de produção), ícones gerados por `node scripts/make-icons.mjs`.
O navegador só oferece "instalar" em **HTTPS** (ou localhost). Teste no celular com:

```bash
npm run build && npm run preview -- --host   # servidor de produção na rede local
npx cloudflared tunnel --url http://localhost:4173   # link https temporário
```
Para uso contínuo, publique a pasta `dist/` em qualquer hospedagem estática gratuita (Netlify Drop, Cloudflare Pages, GitHub Pages); os caminhos são relativos, então funciona em subpastas.
Ao mudar o app, aumente `VERSION` em `public/sw.js` se quiser forçar a limpeza do cache antigo.
