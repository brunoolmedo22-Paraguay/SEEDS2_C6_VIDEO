# video/ — projeto Remotion (SEEDS2 · C6)

```bash
../ferramentas/extrair_pacote.sh            # extrai o pacote em ../work (não versionado)
npm ci                                       # Remotion 4.0.540 fixado (package-lock.json)
npm run dados                                # XLSX oficial → src/dados/c6b.json (valores sem alteração)
export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npm run typecheck && npm run render:teste    # out/ não é versionado
npm run studio                               # pré-visualização local
```

- Composições: **`FilmeSEEDS`** (montagem integral v1 dos três capítulos numa só linha do tempo; `src/filme/`; `npm run render:filme`; ver `docs/FILME_MONTAGEM_v1.md`), `Capitulo3v2` (resultados com foco energético + marca + créditos; `src/capitulo3v2/`, ver `docs/CAPITULO3_RESULTADOS_v2.md`), `Creditos`, `Capitulo3` (resultados R0–R5; `src/capitulo3/`, ver `docs/CAPITULO3_RESULTADOS_v1.md`; quadros com `node quadros.mjs`), `Capitulo2` (PASSO 2 → rodada em execução; `src/capitulo2/`), `Capitulo1v3` (capítulo 1 sem resultados do BESS; `src/capitulo1v3/`; ver `docs/CAPITULO1_v3_CAPITULO2_v1.md`), `Capitulo1v2` (capítulo 1 v2; `src/capitulo1v2/`, ver `docs/CAPITULO1_v2.md`), `Capitulo1` (abertura · título · PASSO 1 · curvas de entrada; `src/capitulo1/`, ver `docs/CAPITULO1_v1.md`),
  `ProvaConceito` (prova v1 aprovada; `src/cenas/`) e `TesteTecnico` (validação do ambiente).
- Marca exibida: **SEEDS** (sem «2»); glifo oficial em `src/componentes/LogoSeeds.tsx`.
- Cores e fontes: `src/tema.ts` e `src/fontes.ts` (tokens da Partitura, tema escuro; fontes OFL em `public/fonts`).
- Na nuvem, o download do Chrome Headless Shell é bloqueado: use `REMOTION_BROWSER` (lido em `remotion.config.ts`).
