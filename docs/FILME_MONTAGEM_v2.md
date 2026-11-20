# Filme SEEDS · montagem integral v2

- **Vídeo:** `video/renders/filme_v2/SEEDS_C6_filme_v2.mp4` — 1920×1080, 30 fps, H.264 (CRF 16), sem áudio,
  **159,5 s** (4.784 quadros).
- **Composição:** `FilmeSEEDSv2` (`video/src/filme/FilmeV2.tsx`; `npm run render:filme2`), a partir do filme v1 aprovado
  (`FilmeSEEDS`, commit `f88c670`).
- **Preservados:** o filme v1 (código, MP4 e quadros), os capítulos isolados e todos os MP4s anteriores. Arquivos existentes
  alterados: `Root.tsx` (nova composição), `filme/Filme.tsx` (`export` em `CENAS_C1` e `R1Rapida`; nenhum quadro muda) e
  `package.json` (script).

## Durações v1 × v2

| Trecho | v1 | v2 | Diferença |
|---|---|---|---|
| Capítulo 1 | 61,5 s | 61,5 s | = |
| Capítulo 2 (até FECHAR e o início da Partitura) | 28,6 s | 28,6 s | = |
| R1 · Partitura (com a fusão) | 5,0 s | 5,0 s | = |
| R2 · despacho completo + Solar · Rede · Bateria | 32,2 s | **18,2 s** | −14,0 s |
| R3 · carga líquida + vale + ponta | 28,1 s | **14,4 s** | −13,7 s |
| R4 · sem × com bateria + PEAK SHAVING | 31,3 s | **12,4 s** | −18,9 s |
| Marca · SIMULADO NO SEEDS | 9,9 s | 9,9 s | = |
| Créditos | 10,1 s | 10,2 s | +0,1 s |
| **Capítulo 3** | 116,2 s | **69,4 s** | −46,8 s |
| **Total** | **206,3 s** | **159,5 s (2 min 40 s)** | **−46,8 s** |

Pontos do v2: Partitura em 1:30,1 · despacho em 1:35,1 · carga líquida em 1:53,2 · sem × com bateria em 2:07,3 ·
PEAK SHAVING em 2:12,4 · marca em 2:19,3 · créditos em 2:29,2.

## Modificações

### 1 · Capítulo 3 mais rápido (R2 e R3)

Os mesmos componentes aprovados (`ResultadosDespacho` com ritmo 0,85 e `R3CargaLiquida2`), com o **tempo remapeado**
(`filme/tempo.tsx`). Em cada quadro do filme, o componente aparece exatamente como era num instante da cena original
(`Freeze` com quadro fracionário). Muda só o ritmo: geometria, textos e dados de cada instante continuam os originais.
Trechos em que a cena original estava parada são percorridos depressa, o que encurta as pausas.

| Trecho | v1 | v2 |
|---|---|---|
| «DESPACHO COMPLETO» (depois da ampliação da Partitura) | 4,8 s | 1,5 s |
| Destaque Solar · Rede · Bateria (cada) | 8,7 s | 5,4 s: construção 2,5 s (× 1,32) + **leitura 2,5 s** + saída 0,4 s |
| Carga líquida: construção dos dois gráficos + pausa | 10,1 s | 5,5 s (× 1,75) |
| Ênfase vale · ênfase ponta (cada) | 8,3 s / 9,0 s | 4,2 s: construção 1,3 s (× 1,4) + **leitura 2,5 s** + saída 0,4 s |
| Passagem para a comparação | fim → preto → R4 | dissolução de 10 quadros |

O despacho completo não é redesenhado na R2: ele chega montado pela ampliação da raia Atendimento da Partitura.
Por isso a aceleração dele é a pausa mais curta.

### 2 · Comparação final só lado a lado (`filme/R4LadoALado.tsx`)

- **SEM BATERIA** à esquerda (C6-A 6f164853) e **COM BATERIA** à direita (C6-B 4713c3e1). Importação no PCC gravada, em
  degraus de 15 min, com a **mesma escala** vertical (0–1.200 MW, limite do PCC) e o **mesmo eixo** 00h–24h.
- As duas curvas se desenham **em paralelo** (2 s), com cabeça de leitura.
- Ponta tarifária marcada nos dois gráficos e 19:30 marcado nos dois: **1.005 MW** e **805 MW**.
- No gráfico da direita, cada intervalo da ponta recebe uma barra violeta da diferença «sem − com bateria», igual à
  descarga gravada (200 MW em todos os 12 intervalos). A cota às 19:30 traz o rótulo **−200 MW**.
- **PEAK SHAVING / −200 MW NA PONTA** surge no alto da mesma composição, sem cobrir os gráficos. Fica visível por cerca de
  6,5 s antes da saída.
- O trecho após 21:00 continua inteiro. O degrau **21:00 · +193 MW em 15 min** está marcado, e a nota diz que a rampa
  máxima do dia não foi reduzida (+193 MW com bateria × +116 MW sem).
- Não há sobreposição das curvas nem tela isolada de PEAK SHAVING: a cena dissolve direto em «SIMULADO NO SEEDS».

### 3 · Créditos sobre cinza neutro (`filme/Creditos2.tsx`)

- **Fundo `#949494`**, em tela inteira (entra a partir do preto), com as seis marcas em duas linhas de três, sem cartões.
- **Teste de contraste.** Contraste WCAG da cor dominante de cada marca contra o fundo:

  | Marca (cor dominante) | `#262626`–`#5c5c5c` (grafite) | **`#949494`** | preto (referência) |
  |---|---|---|---|
  | LACA / UNILA (roxo `#481848`) | 1,2–1,9 (somem) | **4,6** | 1,5 |
  | CEAR (azul `#183078`) | 1,1–1,7 | **4,0** | 1,7 |
  | UFPB (preto do texto / azul) | 1,9–2,9 | **6,9 / 3,8** | 1,0 |
  | PPGIES (verde `#78c030`) | 4,6–2,8 | 1,4 (verde saturado: reconhecível pela cor) | 9,4 |
  | GPEnSE (verdes + contorno próprio) | 2,0–1,2 | 1,7 (contorno e amarelo legíveis) | 4,0 |

  Nenhum cinza favorece todas as marcas: o roxo-escuro pede fundo claro e o verde-claro do PPGIES perde contraste de
  luminância à medida que o fundo clareia. Os tons de grafite apagam LACA e UNILA, e acima de `#b0` o contorno branco
  próprio do GPEnSE vira halo. `#949494` mantém as seis reconhecíveis. A prévia comparativa de `#262626` a `#b8b8b8`
  foi inspecionada antes da escolha.
- **Preparação** (`ferramentas/preparar_logos_v2.py`; originais e saídas v1 intocados):
  - **UFPB:** só o branco **externo** é retirado, por preenchimento a partir das bordas da imagem sobre pixels quase
    brancos conectados à borda. Pontos, faixas e pergaminho do brasão não estão conectados ao exterior e continuam
    brancos (conferido ampliado). Um anel de 2 px desfaz a mistura com o branco na borda.
  - **Franja de recorte** (CEAR, GPEnSE): só pixels **semitransparentes** e quase brancos (resíduo do recorte sobre
    branco, que formava halo sobre o cinza) recebem «cor para alfa». Nenhum pixel opaco é alterado: a grade branca do
    globo do CEAR e o contorno do GPEnSE ficam.
  - Mesma área óptica por marca (UNILA × 1,55) e redimensionamento Lanczos ao tamanho exato de exibição.
- Nenhum texto, nome ou vínculo é atribuído.

### 4 · Preservado sem mudança

Capítulo 1, capítulo 2 (mini-diagrama com eólica e PEMFC/H₂, FECHAR e transição), Partitura, marca SEEDS e
«SIMULADO NO SEEDS». Nenhum indicador financeiro.

## Verificação

- **Dados.** `python3 -I ferramentas/verificar_capitulo3.py` → «OK — 31 valores conferidos». `video/src/dados/` não foi
  alterado. Valores da R4 lidos das séries no código da cena: 19:30 = 1.005.239,19 kW (sem) × 805.239,19 kW (com);
  diferença de 200.000,000000 kW em cada um dos 12 intervalos da ponta.
- **Identidade com as cenas aprovadas** (SHA-256 de quadros renderizados). **Todos idênticos byte a byte:**

  | Cena | Filme v2 | Referência aprovada |
  |---|---|---|
  | Cap. 1 · SOLAR E BATERIA | 1767 | `FilmeSEEDS` (v1) 1767 |
  | Cap. 2 · cards + botão | 2361 | `FilmeSEEDS` 2361 |
  | Cap. 2 · Concluída + FECHAR | 2690 | `FilmeSEEDS` 2690 |
  | R1 · Partitura completa | 2787 | `FilmeSEEDS` 2787 |
  | R2 · Solar construído (origem 308) | 2972 | `Capitulo3v2` 773 |
  | R2 · Bateria / SOC construído (origem 838) | 3294 | `Capitulo3v2` 1303 |
  | R3 · vale (origem 360) | 3602 | `Capitulo3v2` 1855 |
  | R3 · ponta (origem 610) | 3729 | `Capitulo3v2` 2105 |
  | Marca · SIMULADO NO SEEDS | 4380 | `Capitulo3v2` 3649 |

  O remapeamento do tempo mostra, portanto, os mesmos quadros das cenas aprovadas: curvas de FV, SOC, importação e carga
  líquida idênticas.
- **Arquivo final:** ffprobe → um único fluxo de vídeo h264, 1920×1080, 30/1 fps, 4.784 quadros, 159,47 s; sem áudio.

## Quadros de inspeção (`video/renders/filme_v2/`)

| Quadro | Tempo | Conteúdo |
|---|---|---|
| `2880` | 96,0 s | DESPACHO COMPLETO |
| `3012` · `3163` · `3334` | 100,4–111,1 s | Solar · Rede · Bateria |
| `3547` · `3637` · `3777` | 118,2–125,9 s | carga líquida · vale · ponta |
| `3904` | 130,1 s | as duas curvas montadas, lado a lado |
| `4000` · `4150` | 133,3 · 138,3 s | **PEAK SHAVING com os dois gráficos** |
| `4185` | 139,5 s | saída → marca |
| `4380` | 146,0 s | SIMULADO NO SEEDS |
| `4627` | 154,2 s | **seis logotipos sobre o fundo cinza** |
