# Capítulo 1 v2 — correções sobre a v1 (para avaliação)

- **Prévia:** `video/renders/capitulo1_v2/SEEDS_C6_capitulo1_v2.mp4` — 1920×1080, 30 fps, H.264, **88,9 s** (2.666 quadros), sem
  áudio.
- **Quadros-chave** (mesma pasta, PNG; número = quadro):
  - abertura: `0030` ícone · `0128` revelação · `0180` marca estável;
  - título: `0330`;
  - PASSO 1: `0712`;
  - demanda + tarifa: `1095` construção · `1389` quadro completo;
  - solar + bateria: `1700` construção · `1867` composição completa · `2137` solar ampliada · `2567` bateria ampliada.
- **Código:** `video/src/capitulo1v2/` — `Abertura2`, `DemandaTarifa`, `Equipamentos`, `Cartao`, `painel` e `Capitulo1v2`.
  Composições: `Capitulo1v2` e, para avaliação isolada, `Abertura2`, `DemandaTarifa` e `Equipamentos`.
- **Reproduzir:** `npm run dados && npm run render:cap1v2`.
- **v1 e prova v1 preservadas:** os quadros re-renderizados da v1 (300, 525, 615, 915, 1185) e da prova (424) são
  **idênticos bit a bit** aos PNGs arquivados. Os únicos toques em arquivos da v1 foram a exportação de `ICONE`/`Tipo`/
  `SOBE_PASSO1` e um parâmetro opcional `dur`, cujo padrão é a duração da v1.

## 1. Vibração do logotipo — diagnóstico e correção

| | v1 | v2 |
|---|---|---|
| Causa | A largura de «SEEDS» era **medida no DOM** durante o render. O Remotion renderiza com várias abas em paralelo, e as abas mediam larguras diferentes (≈ 13 px). Quadros vizinhos tinham máscara e centro diferentes, então o logotipo **alternava de posição**. Não era subpixel, fonte ou redimensionamento. | Nada é medido no render. A largura vem das métricas da própria fonte (Archivo wght 800: 797,3 px a 228 px) e é travada no SVG (`textLength`); a altura das maiúsculas (0,686 em) centraliza a palavra. As posições finais são pixels inteiros, e há 1,1 s de marca estática antes do *fade*. |
| MP4, após o fim do movimento | 11 posições distintas; salto de até **16 px** entre quadros consecutivos | **1 posição; salto 0 px** (quadros 166–193) |
| PNG sem perda (quadros 167, 175, 183, 191) | — | idênticos bit a bit (Δ = 0) |

A marca exibida continua **SEEDS**, sem «2».

## 2–4. Composições e tempo de observação

| Cena | Tempo | v1 | v2 |
|---|---|---|---|
| Abertura | 0,0–7,0 s | 5,9 s, com vibração | 7,0 s, estável, com 1,1 s de marca parada |
| Título | 7,0–13,1 s | 5,1 s | 6,1 s |
| PASSO 1 | 13,1–27,3 s | 10,1 s (≈ 1,5 s completo) | 14,2 s (**5 s** completo e estável) |
| Demanda + tarifa | 27,3–49,8 s | duas telas sucessivas: curva de pato e tarifa | **composição simultânea do slide 7**: ↖ identificação da demanda (valor vivo do intervalo sob a cabeça de leitura, depois 21.810 MWh/dia selados) · ↙ tarifa sintética · ↗ demanda, solar e carga líquida (destaque) · ↘ quatro extremos com marcas no gráfico. Entrada sequencial; quadro completo **5 s** estável. |
| Solar + bateria | 49,8–88,9 s | inexistente | **Composição do slide 8**: coluna solar (580 MWp, irradiância GHI animada, pico 515 MW, 3.874 MWh) e coluna bateria (1.003 MWh, 200 MW, η 95 %, janela 20–90 % animada, 702 MWh), **5 s** estável. Depois o **protagonismo**: a solar se amplia e a potência FV aproveitada é desenhada sob a irradiância, com os 580 MWp tracejados (**5 s**); volta à composição; a bateria se amplia com SOC nas fronteiras (20 % → 90 % às 15:00 → 20 %) e potência no barramento (carga 739 MWh hachurada, descarga 667 MWh, 600 na ponta) (**4,8 s**). |

Cada quadro passa por três etapas: construção, exibição completa e estável, e transição pelo preto. A digitação **não**
foi acelerada em relação à v1.

## Fidelidade — valores novos e fontes

| Em tela | Valor | Fonte |
|---|---|---|
| Irradiância GHI, 96 amostras, máximo 970 W/m² às 12:00 | amostra de 15 min usada no intervalo (degrau) | `assets/dados/C6_clima_C4_Foz_2026-10-02_96x15min.csv` → `dados/clima.json` |
| Potência FV aproveitada, pico 515 MW às 12:00, 3.874 MWh, vertimento 0 | 514.635,5 kW; 3.874.463,1 kWh | `c6b.json` (= indicadores selados) |
| SOC nas fronteiras (97 pontos), 90 % às 15:00 | 0,2 → 0,9 → 0,2 | `c6b.json`, fronteiras da rodada 4713c3e1 (rotulado «ensaio C6-B») |
| Carga 739 MWh (11:00–14:45) · descarga 667 MWh · 600 MWh na ponta | 739.052,6 / 666.995,0 / 600.000,0 kWh | `c6b.json`; `VERIFICACAO_DADOS.json` |
| Janela 20–90 % = 702 MWh; 200,6 e 902,7 MWh | 0,7 × 1.003 MWh (derivado, rotulado) | capacidade e limites declarados (XLSX) |
| Demanda 21.810 MWh/dia; extremos 1.006 / 755 / 1.005 / 447 MW | Σ × Δ = indicador selado; máximos e mínimos das séries | `c6b.json` |

## Decisões para avaliar

1. **Título da composição 7:** «A CURVA DE PATO» digitado no centro, depois reduzido ao topo para liberar as quatro regiões.
   A composição 8 usa «SOLAR E BATERIA».
2. **Rótulos compactos da tarifa:** na vista compacta, os patamares de 1 h (0,30 · 0,20 · 0,45) não levam rótulo próprio, para
   não sobrepor as linhas; ficam legíveis pelo eixo. Os destaques 0,10 e 1,50 são explícitos.
3. **Protagonismo da bateria:** mostra o **resultado** do ensaio C6-B (SOC e potência), rotulado como tal. A alternativa é
   reservar essa curva para o capítulo de resultados.
4. **TAG de inventário:** `FV-C6-406MWP` (resto do rascunho) não aparece em nenhum cartão.
