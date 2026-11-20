# Continuidade — transferência para outra sessão de Claude Code Cloud
**19/11/2026. Documento de passagem; não autoriza mudanças nem merge.**

## Abrir a fonte certa
- Repositório: `brunoolmedo22-Paraguay/SEEDS2_C6_VIDEO`.
- PR aberto e sem merge: https://github.com/brunoolmedo22-Paraguay/SEEDS2_C6_VIDEO/pull/1
- **Branch de trabalho:** `claude/storyboard-prototipo`.
- Último commit conferido antes da transferência: `3c5b68aa3bd2a80ed1685293c506a5cfb7cea0df`.
- **Não partir de `main`**, que ainda não contém os vídeos. Se a sessão abrir main, executar `git fetch origin claude/storyboard-prototipo && git switch -c claude/storyboard-prototipo --track origin/claude/storyboard-prototipo` se não existir branch local; caso contrário `git switch claude/storyboard-prototipo && git pull --ff-only`. Conferir `git branch --show-current && git rev-parse --short HEAD && git status --short`.
- **NÃO CRIAR OUTRO PR** sem necessidade. Continuar no PR #1, sem merge. Para enviar mudanças, fazer commit e push no branch `claude/storyboard-prototipo`.
- Os repositórios `SEEDS_Energy_multimodel` e `EnergyMultimodelv1.5` são referências de leitura, nunca editar.

## Materiais entregues
- Capítulo 1 v3 — 78,1 s: `video/renders/capitulo1_v3/SEEDS_C6_capitulo1_v3.mp4`.
- Capítulo 2 v1 — 40,4 s: `video/renders/capitulo2_v1/SEEDS_C6_capitulo2_v1.mp4`.
- Capítulo 3 v2 — 135,0 s: `video/renders/capitulo3_v2/SEEDS_C6_capitulo3_resultados_v2.mp4`.
- Fontes e animações Remotion em `video/src/`; dados oficiais C6-A/B em `video/src/dados/`; relatórios `docs/`.
- Ler `CLAUDE.md`, `docs/BRIEF_DIRECAO.md`, `docs/CAPITULO3_RESULTADOS_v2.md`, `video/README.md`, `docs/VERIFICACAO_DADOS.md`.
- Logos institucionais estão em `assets/logos_instituicoes/` (CEAR, marca verde com sigla a confirmar, LACA, GPEnSE, UFPB, UNILA), exibidos em 6 cartões brancos sobre fundo preto para preservar contraste.
- Ambiente usa Node.js + Remotion e Chromium local da cloud, conforme `video/README.md`. Não instalar nada no computador do usuário. O ZIP inicial pode ser descompactado com `ferramentas/extrair_pacote.sh` em `work/` (não versionada).

## Direção criativa APROVADA
- Fundo preto, tipografia grande, poucas palavras, movimento limpo premium, títulos com efeito de digitação.
- Marca **SEEDS**, sem 2 na tela.
- Cap. 1 apresentação do sistema sem revelar resultados; cap. 2 quatro cards e clique em «Rodar simulação»; cap. 3 resultados operativos e conclusão.
- **NUNCA remover eólica nem PEMFC/H₂ do mini-diagrama decorativo da execução.** Usuário confirmou que ama esse desenho e exige mantê-lo exatamente como está.
- R1 da Partitura agora monta tudo quase em paralelo, em ~4,7 s; gráficos ~15% mais rápidos, com pausas de leitura.
- Capítulo 3 v2 já **não mostra resultados financeiros**: não reintroduzir R$, custos, -7,64% nem barras econômicas. Tarifa é dado de entrada e pode aparecer.
- Clímax: curva sem/com BESS lado a lado → sobreposição → «PEAK SHAVING · −200 MW NA PONTA», sem esconder degrau às 21h.
- Final: «SIMULADO NO SEEDS» + frase breve MILP–MPC + seis logos institucionais.
- Usuário disse «muito melhor», mas **ainda quer polir algumas coisas**. Não inferir quais. Aguardar as observações dele antes de editar/renderizar.

## Integridade científica
- Cenários C6-A `6f164853` e C6-B `4713c3e1`: séries auditadas, 96 intervalos de 15 minutos.
- FV 1.000.000 módulos × 580 W = 580 MWp; BESS 1.003 MWh / 200 MW, SOC inicial 20%.
- Importação no PCC reduz exatamente 200 MW de 18h a 21h. O BESS carrega ~739 MWh no vale, descarrega ~600 MWh na ponta, ~667 MWh no dia.
- **Carga líquida = demanda − FV aproveitada**; permanece idêntica em A e B. BESS altera a compensação e importação da rede.
- Peak shaving é limitado à ponta tarifária. Pico diário muda só ~1,8%, rampa máxima piora para +193 MW / 15 min às 21h. Não alegar suavização global.
- Simulação algébrica offline, demanda SIN escalada e tarifa sintética; não alegar operação real nem ótimo global diário.

## PRIMEIRA TAREFA da nova sessão
1. Ler instruções deste documento e `CLAUDE.md` no branch correto.
2. Confirmar HEAD remoto, PR #1, MP4 v2 e documentação.
3. Resumir o estado em um parágrafo.
4. **Não editar código, renderizar ou fazer merge ainda**. O usuário vai transmitir correções de polimento específicas e autorizar a próxima missão.
