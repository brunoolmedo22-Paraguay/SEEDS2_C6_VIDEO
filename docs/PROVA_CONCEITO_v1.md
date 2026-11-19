# Prova de conceito v1 — «IMPORTAÇÃO NO PCC» (para avaliação; não é cena definitiva)

- **Prévia:** `video/renders/prova_conceito_v1/SEEDS2_C6_prova_conceito_v1.mp4` — 1920×1080, 30 fps, H.264, 14,3 s (429
  quadros), sem áudio.
- **Quadros-chave** (mesma pasta, PNG 1920×1080): `quadro_045` digitação · `quadro_120` título completo · `quadro_170` título
  no topo e eixos · `quadro_230` C6-A sendo desenhada · `quadro_300` C6-B e faixa do BESS · `quadro_372` foco na ponta e
  −200 MW · `quadro_424` final, com a transição das 21:00.
- **Código:** `video/src/cenas/ProvaConceito.tsx`, `componentes/TituloDigitado.tsx` e `componentes/ImportacaoAB.tsx`.
- **Reproduzir:** `npm run dados && npm run render:poc`, com `REMOTION_BROWSER` definido como em `video/README.md`.

## Roteiro de movimento

| Tempo | O que acontece |
|---|---|
| 0–4,3 s | «IMPORTAÇÃO NO PCC» digitado no centro, em Archivo 112 px e caixa-alta. Segue o ritmo do `PASSO 1.mp4`: o 1º caractere aparece com uma pausa longa e o resto vem em cadência irregular de 3–6 quadros por caractere, com pausa nos espaços. O cursor fino pisca a cada ≈ 0,67 s ao final. |
| 4,3–5,3 s | O título sobe e reduz para o topo. Grade, eixos, legenda e rodapé entram por *fade*. |
| 5,8–8,8 s | C6-A (sem BESS) desenhada em **vermelho tracejado**, da esquerda para a direita, com cabeça de leitura e hora. |
| 8,8–11,3 s | C6-B (com BESS) em **vermelho cheio** sobre a A. Entre as curvas, a faixa **violeta** é exatamente o que a bateria fez: **hachurada = carga** (B acima de A) e **cheia = descarga** (B abaixo de A). |
| 11,5 s | Faixa da **ponta tarifária** 18:00–21:00 em ciano. Fora dela, as curvas esmaecem para 30 % (foco, como o destaque da Partitura). |
| 12,0 s | Cota **−200 MW**, «em cada intervalo da ponta». |
| 12,9 s | O foco se desfaz. O degrau de **21:00** é marcado em branco: **+193 MW em 15 min · fim da descarga**. Pausa até 14,3 s. |

## Fidelidade — tudo em tela vem dos dados gravados

| Elemento em tela | Valor | Fonte |
|---|---|---|
| Curva C6-A | 96 médias de 15 min | XLSX `3e3dee6a`: `v2/intervalos.csv` com o mesmo SHA-256 da rodada oficial `6f164853` |
| Curva C6-B | 96 médias de 15 min | XLSX `43e3ac07`: mesmo SHA-256 da rodada oficial `4713c3e1` |
| Faixa violeta | B − A = carga − descarga | conferido em todos os intervalos (resíduo < 10⁻⁶ kW), `preparar_dados.py` |
| Ponta 18:00–21:00 · 1,50 R$/kWh | 12 intervalos | tarifa de decisão gravada (idêntica em A e B); sintética, declarada no rodapé |
| **−200 MW** | 200.000 kW em todos os 12 intervalos | `VERIFICACAO_DADOS.json` → `ponta_tarifaria` |
| **21:00 · +193 MW** | 793.719,71 → 987.205,13 kW (+193.485,42 kW) | `VERIFICACAO_DADOS.json` → `transicao_21h_c6b` |
| Eixo Y | 0 → 1.200 MW (= limite de importação do PCC) | parâmetro declarado; o eixo começa em zero, sem exagerar diferenças |

Garantias do desenho:
- cada intervalo é um **degrau** horizontal em [t_k, t_k+1), como na Partitura;
- a animação só revela (máscara), muda opacidade e foco;
- **nenhum quadro mostra valor intermediário inventado**, porque não há morfose entre A e B.

## Decisões tomadas só para esta prova (avaliar)

1. **Título** «IMPORTAÇÃO NO PCC»: caixa-alta como no `PASSO 1`; Archivo 500 em vez do Segoe UI do PowerPoint.
2. **A tracejada × B cheia**: as duas na cor da rede, porque as duas são importação; a diferença está só no traço.
3. **Faixa violeta entre as curvas**: mostra a causa (a bateria) sem acrescentar outra série.
4. **Foco que esmaece fora da ponta e volta a 100 % na marcação das 21:00**: a transição nunca fica escondida no quadro final.
5. **Sem música e sem logo**: o glifo oficial autorizado já está em `video/public/logo/`, reservado para a abertura.

## Perguntas para a avaliação

- Velocidade da digitação (≈ 4 s para 17 caracteres) e tamanho final do título no topo.
- Duração de cada traçado (3 s para A e 2,5 s para B) e o esmaecimento (30 %).
- Legibilidade das legendas (25 px) e do rodapé (21 px) numa tela grande.
- Se a frase sob a cota deve mudar («em cada intervalo da ponta»), ou se basta «−200 MW».
- Se a tarifa deve aparecer como curva em degrau (ciano) sob o gráfico, em vez de só a faixa.
