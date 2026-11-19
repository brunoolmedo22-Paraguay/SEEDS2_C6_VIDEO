# Filme SEEDS · primeira montagem integral (v1)

- **Vídeo:** `video/renders/filme_v1/SEEDS_C6_filme_v1.mp4` — 1920×1080, 30 fps, H.264 (CRF 16), sem áudio,
  **206,3 s** (6.189 quadros).
- **Composição:** `FilmeSEEDS` (`video/src/filme/Filme.tsx`; `npm run render:filme`). Uma ÚNICA linha do tempo do Remotion
  com os três capítulos: as transições são resolvidas entre componentes, não por concatenação de MP4s.
- **Preservados:** os capítulos isolados (`Capitulo1v3`, `Capitulo2`, `Capitulo3v2`, …) e todos os MP4s anteriores.
  As duas alterações em arquivos existentes são aditivas, e os quadros foram conferidos bit a bit antes e depois (ver
  «Verificação»).

## Linha do tempo

| Trecho | Início | Fim | Duração | Antes |
|---|---|---|---|---|
| **Capítulo 1** · abertura → título → PASSO 1 → demanda + tarifa → SOLAR E BATERIA | 0,0 s | 61,5 s | **61,5 s** | 78,1 s |
| **Capítulo 2** · PASSO 2 → quatro cards → «Rodar simulação» → execução → FECHAR | 61,5 s | 90,1 s | **28,6 s** | 40,4 s |
| **Capítulo 3** · Partitura → despacho → carga líquida → sem × com bateria → PEAK SHAVING → marca → créditos | 90,1 s | 206,3 s | **116,2 s** | 135,0 s |
| **Total** | | | **206,3 s** (3 min 26 s) | 253,5 s somados |

Marcos do capítulo 3: R1 (Partitura) em 90,1 s · R2 (despacho) em 95,1 s · R3 (carga líquida) em 127,2 s ·
R4 (sem × com bateria) em 155,4 s · PEAK SHAVING sobre o gráfico em 173,4 s · marca em 186,3 s · créditos em 196,2 s.

## Modificações

| # | Pedido | Implementação |
|---|---|---|
| 1 | Capítulo 1 termina em SOLAR E BATERIA | Mesmas cenas da v3 até `Equipamentos versao={3}`, cortada em `TL_EQ.completo + 60 + 18` (quadro 350 da cena). A composição fica completa no quadro 272, permanece ≈ 2 s estável e sai em 0,6 s. O corte é anterior à ampliação solar (`TL_EQ.zsSobe[0]` = 422, com verificação no código). |
| 2 | Capítulo 2 mais rápido | `filme/Capitulo2Filme.tsx`, cópia do capítulo 2 com mudanças só de ritmo e desfecho. Cards e trilho idênticos. Botão em `CARD(3)+76`. Leitura de ≈ 1 s após o quadro completo. Cursor em 22 quadros (antes, 36 quadros após 5 s de espera). Clique → modal em 2 quadros. Missão MPC com 24 janelas × 6 quadros (antes × 10), mantendo a mecânica real k = 4·j e a regra do progresso do app. Montagem, auditoria e gravação ligeiramente mais curtas. **Mini-diagrama de execução: o MESMO componente**, sem alteração (eólica, PEMFC/H₂, solar, bateria, rede, cores e pulsos). |
| 3 | Conclusão no próprio modal | 100 % → pílula «Concluída» → controle **FECHAR** → o cursor entra e clica → o cartão fecha em 0,4 s (escala, opacidade, leve desfoque) → o capítulo 2 dissolve sobre a Partitura, que começa a se montar por baixo. A cena «SIMULAÇÃO CONCLUÍDA» (R0) saiu: não há tela preta nem segunda mensagem de conclusão. |
| 4 | R1 em 5–6 s | O MESMO `R1Partitura2`, com **remapeamento do tempo** (`<Freeze>` com quadro fracionário, sem pular quadros). Construção paralela em 85 quadros (2,8 s; × 1,66), ≈ 1 s de leitura, ampliação até a geometria da R2 em 1,5 s (× 1,47) e a mesma cauda de fusão. **R1 = 164 quadros = 5,5 s** (v2: 9,8 s). Nenhum componente retirado. |
| 5 | Análise preservada | R2 (despacho + Solar · Rede · Bateria), R3 (carga líquida, vale e ponta) e R4 (lado a lado, sobreposição, faixa violeta, cota −200 MW, 21:00 +193 MW e a nota sobre a rampa) são os componentes do capítulo 3 v2, sem mudança. |
| 6 | Sem a segunda tela PEAK SHAVING | A R4 é cortada em `TL_R4.fecha` (quadro 940), antes do fechamento em que o texto descia ao centro. O gráfico com PEAK SHAVING fica ≈ 13 s visível, sai em 0,9 s e se funde com a marca (12 quadros de sobreposição). |
| 7 | Encerramento | `Marca` (SIMULADO NO SEEDS + frase MILP–MPC) e `Creditos` (seis logotipos nos cartões brancos) iguais à v2. Sem resultados econômicos. |

### Alterações em arquivos existentes (aditivas)

- `capitulo2/ModalExecucao.tsx`: duas props opcionais. `acaoConcluida` substitui as pílulas do rodapé no estado concluído e
  `textoConcluido` troca o texto do rodapé (no filme: «Resultados prontos para abrir.»). Sem elas, o cartão é o mesmo de antes.
  O mini-diagrama não foi tocado.
- `capitulo3v2/Capitulo3v2.tsx`: `export` no componente `R2`, para reutilizá-lo.
- `Root.tsx`: nova composição `FilmeSEEDS`. `package.json`: script `render:filme`.

### Adaptação declarada

O controle **FECHAR** é uma adaptação visual do filme. O cartão de execução do app oferece «OCULTAR PAINEL» e abre os
resultados sozinho; o filme não apresenta o FECHAR como registro literal da interface.

## Verificação

- **Composições aprovadas inalteradas.** Quadros renderizados com e sem as alterações em arquivos existentes
  (`git stash`) são idênticos byte a byte: `Capitulo2` 600 e 1150 (modal concluído) e `Capitulo3v2` 100 (R0 com o modal),
  330 e 3649.
- **Filme × capítulos aprovados.** Quadros do filme renderizados e comparados por SHA-256 com o quadro correspondente da
  composição aprovada (mesmo instante da cena). **Todos idênticos byte a byte:**

  | Cena | Filme | Composição aprovada |
  |---|---|---|
  | Cap. 1 · SOLAR E BATERIA completa | 1767 | `Capitulo1v3` 1767 |
  | Cap. 2 · quatro cards | 2145 | `Capitulo2` 300 |
  | R1 · Partitura completa (tempo remapeado) | 2787 | `Capitulo3v2` 393 |
  | R2 · despacho / Solar | 3152 | `Capitulo3v2` 830 |
  | R2 · Bateria / SOC | 3707 | `Capitulo3v2` 1385 |
  | R3 · vale | 4277 | `Capitulo3v2` 1955 |
  | R3 · ponta | 4537 | `Capitulo3v2` 2215 |
  | R4 · PEAK SHAVING sobre o gráfico | 5511 | `Capitulo3v2` 3189 |
  | Marca · SIMULADO NO SEEDS | 5789 | `Capitulo3v2` 3649 |
  | Créditos | 6036 | `Capitulo3v2` 3896 |

  Os gráficos, valores e trajetórias do filme são, portanto, os mesmos dos capítulos aprovados e das rodadas oficiais.
- **Arquivo final:** ffprobe → h264, 1920×1080, 30/1 fps, 6.189 quadros, 206,300 s, sem trilha de áudio.
- **Números.** `python3 -I ferramentas/verificar_capitulo3.py` → «OK — 31 valores conferidos». Os arquivos de dados
  (`video/src/dados/`) não foram alterados.

## Quadros de inspeção (`video/renders/filme_v1/`)

| Quadro | Tempo | Conteúdo |
|---|---|---|
| `1767` | 58,9 s | SOLAR E BATERIA completa (capítulo 1) |
| `1830` | 61,0 s | saída do capítulo 1 |
| `2361` | 78,7 s | quatro cards completos + «Rodar simulação» |
| `2420` | 80,7 s | clique |
| `2560` | 85,3 s | missão MPC em andamento (mini-diagrama intacto) |
| `2690` | 89,7 s | Concluída + FECHAR com o cursor |
| `2706` | 90,2 s | o cartão fecha; a Partitura começa por baixo |
| `2720` | 90,7 s | Partitura em construção |
| `2787` | 92,9 s | Partitura completa |
| `2830` | 94,3 s | ampliação para o despacho |
| `5361` | 178,7 s | PEAK SHAVING sobre o gráfico, 21:00 marcado |
| `5590` · `5605` | 186,3–186,8 s | saída da R4 → marca |
| `5789` | 193,0 s | SIMULADO NO SEEDS |
| `6036` | 201,2 s | créditos institucionais |
