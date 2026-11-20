# Capítulo 3 v1 — Resultados (R0–R5)

Produção autorizada conforme `docs/PROPOSTA_RESULTADOS.md`, com as decisões do responsável (R0 sem «PASSO 3»; R1 Partitura
completa em tema escuro; R3 com as duas ênfases; R4 lado a lado → sobreposição; R5 custos → −7,64 % → marca).

- **Vídeo:** `video/renders/capitulo3_v1/SEEDS_C6_capitulo3_resultados_v1.mp4` — 1920×1080, 30 fps, H.264 (CRF 16,
  yuv420p), **153,1 s** (4.594 quadros), sem áudio.
- **Código:** `video/src/capitulo3/` (composição `Capitulo3`; `npm run render:cap3`). Quadros: `node quadros.mjs Capitulo3
  <pasta> <quadro>…` (um só bundle).
- **Capítulos anteriores preservados:** nenhum arquivo deles foi alterado; o protótipo da R2 (`resultados/Despacho.tsx`) é
  usado **sem modificação** (só `Root.tsx` e `package.json` ganharam a composição/roteiro novos).

## Linha do tempo

| Cena | Início | Duração | O que acontece |
|---|---|---|---|
| **R0 · Ponte** | 0,0 s | 8,4 s | Parte do **último quadro do capítulo 2** (congelado com `Freeze`): o fundo do PASSO 2 sai, o painel «Concluída» continua (mesmo componente, mesma posição, animação contínua), encolhe e dissolve. «SIMULAÇÃO CONCLUÍDA» digitado; abaixo, «96 de 96 intervalos · 24 de 24 janelas MPC · auditoria integral aprovada». |
| **R1 · A Partitura se monta** | 8,4 s | 21,0 s | Reconstrução da Partitura (lente Operação, tema escuro): cabeçalho da rodada → lentes → legenda → as **sete raias**, uma a uma (Decisões do MPC j0–j23 · Atendimento · Renováveis · Bateria · Rede com limite 1.200.000 kW · Tarifa · Custo) → inspetor (Intervalo, Recursos, Estados e custos, Decisão) → barra de estado. Interface completa estável; o cursor percorre 11:00 → 19:00 e o inspetor acompanha. A raia **Atendimento** se amplia até a geometria exata do gráfico da R2. |
| **R2 · Despacho + destaques** | 28,9 s | 32,2 s | Protótipo aprovado, iniciando no quadro com o despacho completo (as barras da R1 coincidem com as dele: corte sem salto). 2,5 s de leitura do quadro completo + Solar → Rede → Bateria, como aprovado. |
| **R3 · Carga líquida** | 61,1 s | 29,7 s | Demanda × carga líquida (faixa solar) e compensação. Ênfase 1 «**AUMENTO DA IMPORTAÇÃO NO VALE**» (+739 MWh · carga da bateria; intervalos 11:00–14:45). Ênfase 2 «**DIMINUIÇÃO DO ESFORÇO NA PONTA**» (−200 MW de importação; intervalos 18:00–20:45). |
| **R4 · Sem × com bateria** | 90,8 s | 32,7 s | «SEM BATERIA» | «COM BATERIA» lado a lado, mesma escala (0–1.200 MW) e mesmo eixo do tempo, construídos juntos; valores às 19:30. As duas caixas se movem até a geometria da prova de conceito e se sobrepõem (tracejada × cheia, faixa violeta B − A) → «**PEAK SHAVING**» / «−200 MW NA PONTA» → marca das 21:00 (+193 MW em 15 min). |
| **R5 · Encerramento** | 123,4 s | 29,7 s | Barras cobre «SEM BESS R$ 11,07 milhões» × «COM BESS R$ 10,22 milhões» (eixo a partir de zero) → «**−7,64 %**» / «CUSTO OPERACIONAL» → tela preta: glifo oficial + «SIMULADO NO SEEDS» (digitado) + «Despacho energético otimizado por EMS hierárquico MILP–MPC.» |

## Quadros-chave (`video/renders/capitulo3_v1/`)

| Quadro | Conteúdo |
|---|---|
| `0010` | R0 — painel «Concluída» saindo do capítulo 2 |
| `0200` | R0 — SIMULAÇÃO CONCLUÍDA |
| `0700` | R1 — Partitura completa (instante 19:00–19:15) |
| `0840` | R1 — ampliação da raia Atendimento |
| `0960` | R2 — despacho completo |
| `1183` · `1443` · `1723` | R2 — Solar · Rede · Bateria |
| `2153` | R3 — carga líquida e compensação |
| `2313` · `2593` | R3 — ênfase no vale · ênfase na ponta |
| `3023` | R4 — sem × com bateria lado a lado |
| `3183` | R4 — transição para a sobreposição |
| `3583` | R4 — PEAK SHAVING com a marca das 21:00 |
| `3883` · `4133` · `4463` | R5 — custos · −7,64 % · marca |

## Proveniência dos dados

| Fonte | Uso |
|---|---|
| `video/src/dados/c6b.json` — XLSX `43e3ac07` da rodada **C6-B 4713c3e1** (com BESS); vistas v2 com os mesmos SHA-256 da rodada do PDF oficial | R1, R2, R3, R4 (com bateria), R5 |
| `video/src/dados/c6a.json` — XLSX `3e3dee6a` (`assets/resultados/`) da rodada **C6-A 6f164853** (sem BESS), mesmo SHA-256 | R4 (sem bateria), R5 |
| Indicadores selados dos PDFs oficiais (R$ 11.066.590,26 · R$ 10.220.903,29) | conferidos contra a soma dos custos por intervalo |
| Partitura: `SEEDS_Energy_multimodel` `main` a51fa5e — `partitura.js`, `trama.css` (somente leitura) e quadro de `resultados 1.mp4` | textos e formato do cabeçalho, lentes, inspetor, barra de estado; tokens do tema escuro |

As séries são as **médias de 15 min gravadas** (96 intervalos; energia das fronteiras com 97 pontos), desenhadas em degrau
[t_k, t_k+1) como na Partitura. A animação só revela, cresce a partir de zero até o valor gravado, muda opacidade/foco ou
move a geometria: nenhum valor é interpolado entre intervalos nem alterado. Grandezas **derivadas** (carga líquida = demanda −
solar aproveitada; acumulado; diferença B − A; somas de energia) são operações aritméticas sobre as séries e estão
rotuladas como tal onde aparecem.

**Verificação independente:** `python3 -I ferramentas/verificar_capitulo3.py` recalcula em Python, a partir dos JSON, os
**31 números** exibidos no capítulo (cabeçalho e inspetor da R1, R2, R3, R4, R5) e as premissas (demanda, tarifa e FV
idênticas em A e B; B − A = carga − descarga em todo intervalo; sem vertimento; na C6-A importação = carga líquida). Saída
atual: `OK — 31 valores conferidos`.

## Rigor científico — como cada afirmação aparece

| Afirmação | Valor | Onde | Natureza |
|---|---|---|---|
| Economia diária | **R$ 845.686,97 · −7,64 %** | R5 | indicadores selados C6-A − C6-B |
| Redução de custo **só na ponta** | R$ 900.000,00 | R5, linha separada | Σ (custo A − custo B) nos 12 intervalos de 1,50 R$/kWh |
| Redução da importação na ponta | **−200 MW em cada intervalo 18:00–20:45** | R3, R4 | gravado (−600 MWh) |
| Aumento da importação no vale | **+739 MWh**, intervalos 11:00–14:45 | R3 | importação − carga líquida = energia carregada |
| Energia importada no dia | **+72 MWh** com BESS (perdas) | R5 | «o ganho é econômico, não de energia» |
| Rampa máxima | **não reduzida**: +193 MW às 21:00 (com) × +116 MW (sem) | R4, nota | maior degrau de subida de cada série |
| Pico diário de importação | 1.005 MW (19:30, sem) → 987 MW (21:00, com) | R4 (gráfico + marca 21:00) | não é anunciado como «redução do pico diário» |
| Carga líquida | **idêntica** com e sem bateria | R3 | o efeito da bateria aparece na compensação/importação |
| Otimização | «despacho energético otimizado por EMS hierárquico MILP–MPC» | R5 | 24/24 janelas ótimas; sem alegação de ótimo global do dia |
| Contexto | simulação algébrica offline · tarifa sintética · demanda = perfil do SIN digitalizado e escalado | rodapés R2–R5, barra de estado da R1 | nunca «operação real», «tarifa oficial» ou «medição» |

## Limitações e escolhas a avaliar

1. **R1 é reconstrução vetorial**, não captura: reproduz os textos e o formato do `partitura.js`. Omiti os campos do inspetor
   cujo valor não está no pacote de dados do vídeo (demanda **prevista**, importação **programada**, resíduo do balanço,
   «posição p de N no plano»), em vez de inventá-los. O vertimento (0,0 kW) é derivado (potencial − aproveitada).
2. **Duração total 153 s** (acima dos 60–120 s iniciais): priorizei tempo de leitura em cada estado final, como pedido.
   Cortes possíveis sem perda de conteúdo: pausa do quadro completo na R2 (2,5 s), a varredura do cursor na R1 (≈ 4 s) e a
   pausa final da marca (≈ 4 s).
3. A **legenda da R1** quebra em duas linhas, como no app em largura menor; os rótulos de eixo usam kW completos, como o app.
4. No R0, a linha «auditoria integral aprovada» decorre do estado `concluida` da rodada (missão completa + auditoria
   integral aprovada, contrato do Piso 3D-A).
