# Inventário dos materiais — SEEDS2 · C6 (vídeo)

Levantamento feito em 19/11/2026 sobre `main` `f4d8ffc`. O pacote `SEEDS2_VIDEO_Pack_Claude.zip` (SHA-256
`ddf05b43…cb93c73`, 42 entradas) é extraído em `work/` por `ferramentas/extrair_pacote.sh`. A pasta `work/` **não é
versionada**: os binários ficam no histórico uma única vez, dentro do ZIP. Os hashes de todos os arquivos extraídos estão em
`docs/MANIFESTO_PACOTE.tsv`.

Legenda de uso: **CANÔNICO** = fonte numérica do vídeo · **REF** = referência de estilo/movimento · **RASCUNHO** = versão
superada, não usar · **APOIO** = contexto opcional.

## 1. Já versionados no repositório

| Arquivo | Conteúdo | Uso |
|---|---|---|
| `assets/dados/C6_demanda_SIN_escalada_100_96x15min.csv` | demanda kW, 96 × 15 min | CANÔNICO (= série gravada, desvio máx. 0 kW) |
| `assets/dados/C6_clima_C4_Foz_2026-10-02_96x15min.csv` | GHI e temperatura | CANÔNICO (idêntico ao clima C4 do pacote) |
| `assets/dados/C6_C_tarifa_valle_solar_96_intervalos.txt` e `C6_tarifa_final_96x15min.csv` | tarifa sintética final | CANÔNICO (= tarifa gravada da decisão) |
| `assets/dados/C6_parametros_validados.json` | configuração e números consolidados | CANÔNICO (conferido; ver `VERIFICACAO_DADOS.md`) |
| `assets/resultados/seeds2_dados_Cenario_1_FV_REDE_v7_3e3dee6a.xlsx` | séries gravadas do C6-A (enviado em 19/11/2026) | CANÔNICO — mesmo SHA-256 de `v2/intervalos.csv` da rodada oficial `6f164853` |
| `assets/estilo-seeds2/{partitura.js,trama.js,trama.css}` | renderer da Partitura | REF — SHA-256 idêntico ao `main` atual do SEEDS2 (inclui as cores do UI-VISUAL-01) |

## 2. Dentro do pacote

### 01 · Storyboards e referências
| Arquivo | O que é | Observações |
|---|---|---|
| `PASSO 1.mp4` (1134×634, 30 fps, 9,5 s) | gravação de tela do PowerPoint: «PASSO 1: ADICIONANDO O SISTEMA» digitado | Texto centralizado que cresce simetricamente, caixa-alta, peso regular, letras de ≈ 30 px. Cursor fino, ≈ 2,5× a altura das letras. Ritmo IRREGULAR: pausa de ≈ 1 s após «P» e ≈ 1,2 s após «PASSO 1». São 30 caracteres em ≈ 7,5 s. Ao final o cursor pisca com período ≈ 0,65 s. Fonte do PowerPoint (Segoe UI). |
| `seeds intro.mp4` (1920×1080, 10 s) | gravação de tela de transição *morph* no PowerPoint | Ícone grande → encolhe → desloca à esquerda → a palavra «SEEDS» é revelada saindo de trás do ícone. Os 2 s finais mostram a interface do PowerPoint, que é só artefato da gravação. |
| `resultados 1.mp4` (944×608, 9,3 s) | gravação da Partitura (tema escuro, lente Operação, C6-B) | O destaque por legenda (Rede, Solar, Bateria, Demanda) esmaece as demais séries. Mostra a pilha rede → solar → bateria. |
| `Presentation 19.pptx` (16 slides, 16:9) | storyboard exploratório | Sequência: logo (3 slides) → título → PASSO 1 sistema (Planta) → curva de carga/tarifa (quadros azuis) → parâmetros FV/BESS → PASSO 2 etapas → PASSO 3 simulação em andamento → PASSO 4 resultados (vídeo + Carga líquida). Erros de digitação a não levar ao vídeo: «DESICION», «TAFIRA», «SIMULACAO». |

### 02 · Dados e parâmetros
| Arquivo | Uso |
|---|---|
| `C6_C_tarifa_valle_solar_96_intervalos.txt` | CANÔNICO (idêntico a `assets/dados`) |
| `C4_original_clima_Foz_2026-10-02_96x15min.csv` | CANÔNICO (idêntico a `assets/dados`) |
| `C6_curvas_SIN_digitalizadas_30min.csv`, `C6_curvas_SIN_15min_interpoladas.csv` | APOIO — origem documental da demanda; a série usada é a de `assets/dados` |
| `CONFIGURACAO_C6_VALIDADA.txt` | CANÔNICO (1.000.000 módulos, 580 MWp, BESS 1.003 MWh / 200 MW) |
| `SEEDS2_C6_Pacote_Completo_Simulacao(1).zip` → `ROTEIRO_C6_SEEDS2_PT.md`, `C6_parametros_propostos.json`, `C6_ficha_preenchimento.txt` | **RASCUNHO** — configuração anterior: 700.000 módulos, 406 MWp, TAG `FV-C6-406MWP`. A tarifa «COLAR_NO_SEEDS2» difere da final em 20 intervalos (40–55 e 60–63). Não usar. |

### 03 · Resultados C6
| Arquivo | Rodada | Uso |
|---|---|---|
| `seeds2_relatorio_Cenario_1_FV_REDE_v7_6f164853.pdf` (27 p.) | C6-A oficial `6f164853` | CANÔNICO para indicadores. **Sem série tabular** do C6-A no pacote. |
| `seeds2_relatorio_Cenario_2_BESS_FV_REDE_v5_4713c3e1.pdf` (30 p.) | C6-B oficial `4713c3e1` | CANÔNICO |
| `seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx` | reexecução `43e3ac07` da MESMA versão v5 | CANÔNICO para as séries do C6-B: `intervalos.csv`, `fronteiras.csv`, `planos.csv`, `auditoria.json`, `preflight.json` e `renovaveis.json` têm o **mesmo SHA-256** da `4713c3e1` |
| `seeds2_figuras_Cenario_2_BESS_FV_REDE_v5_43e3ac07.zip` | idem | REF de layout (não substitui o dado) |

### 04 · Materiais SEEDS2
| Arquivo | Observações |
|---|---|
| `…_406ae68a_20261119_1423/1431.seeds2snapshot.zip` | Inspeção oficial aprovada. **NÃO contêm as rodadas oficiais.** Contêm rodadas ANTERIORES: C6-A `ce3c8bb7`/`efed4325` (R$ 11.331.688,93), «Cenario 1» v6 `06a3b498` (R$ 10.994.657,91) e C6-B v4 `bf034ccb` (R$ 10.208.970,94). FV 20 × 50.000 = 1.000.000 módulos, mas a TAG ainda é `FV-C6-406MWP`. **Não são fonte numérica do vídeo.** |
| `seeds2_06a3b498_…png`, `seeds2_ce3c8bb7_…png` | Exportações da Partitura dessas rodadas anteriores: REF de estilo apenas |
| `image(20261119-162845).png` | captura da plataforma: REF |

### 05 · Comparação e 06 · Opcionais
- `comparacao_importacao_peak_shaving.png`: A (cheia) × B (tracejada); REF narrativa.
- `polaris_*.svg/png`: curvas do SIN (pato, carga renovável, resposta hidro-térmica); APOIO para contexto, com fonte a citar.

## 3. Lacunas (pedir ao responsável)

1. ~~Série gravada do C6-A~~ — **recebida** (19/11/2026): `assets/resultados/seeds2_dados_Cenario_1_FV_REDE_v7_3e3dee6a.xlsx`,
   mesma versão v7 e mesmos SHA-256 dos dados gravados da rodada oficial `6f164853`.
2. ~~Logo vetorial oficial~~ — **resolvido**: uso do SVG de `topbar.js` autorizado (`video/public/logo/`). Registro anterior: O PPTX só tem rasters de 135×135 (ícone) e 203×63 («SEEDS»), insuficientes para 1080p. Existe um SVG oficial do glifo na plataforma (`seeds2/ui/static/topbar.js`), de traço mais fino que o ícone do PPT. É preciso decidir entre usar esse SVG ou enviar o arquivo-fonte do ícone e do *wordmark*.
3. Fonte do *wordmark* «SEEDS» (peso muito pesado; parece Segoe UI Black ou similar).
4. Narração, trilha, duração, texto em tela e ordem das cenas (decisões em aberto do brief).
