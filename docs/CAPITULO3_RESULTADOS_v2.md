# Capítulo 3 v2 — Resultados com foco na operação energética

- **Vídeo:** `video/renders/capitulo3_v2/SEEDS_C6_capitulo3_resultados_v2.mp4` — 1920×1080, 30 fps, H.264 (CRF 16),
  **135,0 s** (4.049 quadros), sem áudio.
- **Composição:** `Capitulo3v2` (`video/src/capitulo3v2/`; `npm run render:cap3v2`). A **v1** (`Capitulo3`,
  `video/src/capitulo3/`, `renders/capitulo3_v1/`) e todos os capítulos anteriores estão **preservados**.
- **Protótipo da R2:** `resultados/Despacho.tsx` ganhou o parâmetro opcional `ritmo`; com o valor padrão (1), os quadros do
  protótipo são **idênticos bit a bit** aos de antes (conferido em 4 quadros, com e sem a alteração).

## Diferenças em relação à v1

| # | Pedido | O que mudou |
|---|---|---|
| 1 | R1 em ≤ 5 s | Construção **paralela**. Cabeçalho, lentes e palco em < 1 s. As seis raias começam com 5 quadros de diferença e se desenham juntas (62 quadros cada). O inspetor entra junto, e o cursor vai de 11:00 a 19:00 durante a montagem. **Interface completa em ≈ 4,7 s**, **≈ 2,7 s estável**, depois a mesma ampliação da raia Atendimento (2,2 s) e a fusão com a R2. R1: 21,0 s → 9,8 s. |
| 2 | Gráficos ≈ 15 % mais rápidos | Duração do **desenho × 0,85**. R2: revelação dos apoios (solar, tarifa, SOC) e entrada das notas. R3: demanda, carga líquida, barras e linha da compensação. R4: revelação lado a lado, 130 → 110 quadros. **Pausas de leitura, ênfases e transições** (ampliação, sobreposição, faixas) **com a mesma duração**. Dados e trajetórias inalterados. |
| 3 | Sem resultados econômicos | Retirados: barras de custo R$ 11,07 mi × R$ 10,22 mi, **−7,64 %**, **R$ 845.686,97**, **R$ 900.000,00** e o «+72 MWh / ganho econômico». Na R1: o cabeçalho perde o custo realizado; saem a raia «Custo realizado por intervalo» e o item «custo realizado» da legenda (a legenda volta a caber numa linha). O cartão «Estados e custos» vira «**Estados**»: energia armazenada, **estado de carga** (SOC gravado), vertimento e tarifa de decisão. A **tarifa** continua como dado de entrada (raia da R1, apoio «Rede» da R2, faixa da ponta na R3/R4). |
| 4 | Clímax preservado | R4 igual à v1 aprovada: lado a lado, sobreposição, faixa violeta, cota −200 MW, marca das 21:00 (+193 MW em 15 min) e a nota «redução restrita à ponta tarifária · a rampa máxima do dia não foi reduzida». |
| 5 | Novo encerramento | O gráfico sai e **PEAK SHAVING / −200 MW NA PONTA** desce ao centro e cresce (≈ 3 s estável). Depois, tela preta: glifo oficial + **SIMULADO NO SEEDS** (digitado) + «Despacho energético otimizado por EMS hierárquico MILP–MPC.», discreto. |
| 6 | Créditos institucionais | Nova tela com os **seis logotipos**, em duas linhas de três, na ordem do `LEIA.txt` (CEAR · PPGIES · LACA / GPEnSE · UFPB · UNILA). Entrada por fade em cascata; ≈ 6,7 s com todas as marcas visíveis. **Nenhum texto**: nenhum nome, vínculo, apoio ou financiamento é atribuído. |
| 7 | Aprovados intocados | Abertura, capítulos 1 e 2, modal de execução e mini-diagrama (eólica/PEMFC inclusos), digitação, R0 (o mesmo componente da v1), gráficos e dados verificados. |

## Logotipos — tratamento

- **Originais** do responsável em `assets/logos_instituicoes/` (com o `LEIA.txt`), sem modificação.
- **Preparação** (`ferramentas/preparar_logos.py`):
  - só recorte das margens vazias (transparência; na UFPB, a margem branca externa ao brasão) e redimensionamento proporcional (Lanczos) ao **tamanho exato de exibição**, para o navegador não reamostrar;
  - **nenhuma cor, proporção ou elemento** alterado. Saída: `video/public/logos/instituicoes/` + `video/src/creditos/logos.json`.
- **Por que cartões brancos:**
  - CEAR (azul-escuro), LACA e UNILA (roxo-escuro) somem sobre preto, e a UFPB tem fundo branco opaco.
  - Seis cartões **brancos idênticos** (400×240 px, cantos de 20 px) dão contraste às marcas escuras e integram a UFPB sem recortar nem redesenhar o brasão. É a solução que o `LEIA.txt` indica: bloco branco de largura consistente.
  - Não encontrei versão oficial transparente da UFPB verificável neste ambiente.
- **Equilíbrio óptico:** cada marca recebe a mesma área visual (≈ 19.000 px²), limitada à área útil do cartão. A UNILA tem fator 1,55, por causa do traço fino e do texto secundário.
- **Reamostragem:** CEAR, PPGIES e LACA são ampliadas 1,0–1,2× (arquivos de baixa resolução); as demais são reduzidas.
- **A confirmar:** o arquivo `02_Programa_verde.png` exibe «PPGIES». O `LEIA.txt` pede para confirmar a sigla antes de escrevê-la em texto, e por isso ela não aparece escrita em nenhum lugar fora do próprio logotipo.

## Linha do tempo

| Cena | Início | Duração |
|---|---|---|
| R0 · SIMULAÇÃO CONCLUÍDA | 0,0 s | 8,4 s |
| R1 · Partitura ganha vida | 8,4 s | 9,8 s |
| R2 · despacho + Solar · Rede · Bateria | 17,7 s | 32,2 s |
| R3 · carga líquida (vale → ponta) | 49,8 s | 28,1 s |
| R4 · sem × com bateria → PEAK SHAVING → fechamento | 78,0 s | 37,0 s |
| Marca · SIMULADO NO SEEDS | 115,0 s | 9,9 s |
| Créditos institucionais | 124,9 s | 10,1 s |

## Quadros-chave (`video/renders/capitulo3_v2/`)

| Quadro | Conteúdo |
|---|---|
| `0330` · `0452` · `0502` | R1 em construção paralela · completa · ampliação |
| `0620` | R2 despacho completo |
| `0845` · `1105` · `1385` | R2 Solar · Rede · Bateria |
| `1795` · `1955` · `2215` | R3 completa · vale · ponta |
| `2639` · `2779` · `3189` | R4 lado a lado · transição · PEAK SHAVING |
| `3379` | fechamento PEAK SHAVING / −200 MW NA PONTA |
| `3649` | SIMULADO NO SEEDS |
| `3896` | créditos institucionais |

## Proveniência

Igual à v1 (`docs/CAPITULO3_RESULTADOS_v1.md`): séries gravadas das rodadas C6-A 6f164853 e C6-B 4713c3e1, sem alteração.
`python3 -I ferramentas/verificar_capitulo3.py` continua conferindo os números. Alguns valores verificados lá (custos)
**não aparecem mais** na v2.
