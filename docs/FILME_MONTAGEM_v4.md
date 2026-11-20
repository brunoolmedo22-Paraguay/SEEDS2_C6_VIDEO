# Filme SEEDS · montagem integral v4 (1,5× + rodapé institucional)

- **Vídeo:** `video/renders/filme_v4/SEEDS_C6_filme_v4.mp4` — 1920×1080, 30 fps, H.264 (CRF 16), sem áudio,
  **102,2 s** (3.066 quadros). Filme v3: 153,3 s (4.598 quadros) → 153,27 / 1,5 = 102,18 s.
- **Composição:** `FilmeSEEDSv4` (`video/src/filme/FilmeV4.tsx`; `npm run render:filme4`) sobre o filme v3 (`cc9e4ba`).
  `FilmeSEEDSv4SoTempo` = a mesma composição sem rodapé e sem redução de escala, usada para conferir o tempo.
- **Preservados:** os MP4s v1, v2 e v3 e os capítulos isolados.

## 1 · Aceleração global 1,5×

- Remapeamento temporal da composição inteira: o quadro de saída f mostra o filme v3 no instante **1,5·f**, com quadros
  fracionários e novo render de cada quadro (não é mudança de metadados de reprodução).
- Títulos, digitação, gráficos, execução e mini-diagrama, cursor, transições e pausas aceleram juntos, na mesma proporção.
  Nenhuma cena é acelerada à parte.
- As séries continuam com 96 intervalos de 15 min. Os gráficos de cada instante são os do v3; só a apresentação muda.
- **Implementação:** as mesmas camadas do v3 (ordem, inícios e durações), cada uma com **um único `<Freeze>`** no seu quadro
  local de origem (1,5·f − início). Nas cenas que já tinham mapa de tempo próprio (R1, R2, R3), esse mapa é composto ao
  ×1,5.
- **Por que não um `<Freeze>` global:** um `<Freeze>` envolvendo todo o filme, por fora dos `<Freeze>` internos, não se
  compõe corretamente. No teste, o quadro que devia mostrar a R4 mostrou a R2. O defeito foi detectado na conferência
  abaixo e por isso não foi usado.
- **Conferência** (SHA-256, `FilmeSEEDSv4SoTempo` quadro f × `FilmeSEEDSv3` quadro 1,5·f). **Todos idênticos:**

  | Cena | v4 | v3 |
  |---|---|---|
  | abertura + sigla | 160 | 240 |
  | PASSO 1 (sem ponto solto) | 496 | 744 |
  | cards do capítulo 2 | 1604 | 2406 |
  | Concluída + FECHAR (mini-diagrama com eólica e PEMFC/H₂) | 1824 | 2736 |
  | Partitura | 1894 | 2841 |
  | R2 Solar · R2 Bateria/SOC | 2010 · 2130 | 3015 · 3195 |
  | R3 vale | 2430 | 3645 |
  | R4 PEAK SHAVING lado a lado | 2796 | 4194 |
  | fechamento unificado | 2934 | 4401 |

## 2 · Rodapé institucional global (`filme/RodapeInstitucional.tsx`)

- Seis logotipos (CEAR · PPGIES · LACA · GPEnSE · UFPB · UNILA, ordem do LEIA.txt) numa **única fileira centrada** na base
  do quadro.
- **Tamanho e espaçamento:** alturas de 28 a 44 px, com a mesma área óptica por marca (UNILA × 1,55) e espaçamento regular
  de 34 px. Arquivos em tamanho exato de exibição (`ferramentas/preparar_logos_rodape.py`, mesmo tratamento dos logotipos do
  fechamento: cores e proporções oficiais).
- **Faixa segura:** o quadro do filme é **reduzido uniformemente para 93,3 %** (1008/1080, ancorado no topo, centrado),
  liberando 72 px na base. Na cena mais densa (Partitura, com a barra de estado), o conteúdo termina em y = 983, e a faixa do
  rodapé começa em y = 1016. Nenhum texto, eixo, horário, legenda ou nota científica é coberto em nenhuma cena: tudo o que
  existia está acima de y = 1008 após a redução.
- **Legibilidade sobre preto:** direto no preto, LACA e UNILA (roxo-escuro, contraste ≈ 1,5) somem nesse tamanho e o texto
  «UFPB» (preto) desaparece. Por isso a fileira fica sobre **uma faixa estreita e arredondada** (56 px de altura) no cinza
  neutro já aprovado (`#949494`). É um único fundo pequeno, sem cartões individuais e sem branco.
- **Abertura e fechamento:** o rodapé entra com a abertura e fica presente em abertura, PASSO 1, configuração, execução,
  Partitura, gráficos e comparação. Ele **sai durante a dissolução para o fechamento unificado**, que já mostra as seis marcas
  em tamanho grande, para não duplicar.

## Correção de um defeito do v3

O script `preparar_logos_v3.py` gravava no JSON o caminho dos arquivos **v2** (`logos/instituicoes_v2/…`). Por isso, o
fechamento do MP4 v3 exibiu os logotipos v2 reduzidos pelo navegador, sem a limpeza dos miolos das letras P e B da UFPB.
Agora os scripts derivam o caminho da pasta de saída. O v4 usa os arquivos v3 corretos, e o MP4 v3 permanece como foi
entregue.

## Integridade

- `python3 -I ferramentas/verificar_capitulo3.py` → «OK — 31 valores conferidos»; `video/src/dados/` sem alteração.
- Nenhum indicador financeiro; PEAK SHAVING lado a lado, mini-diagrama, sigla e PASSO 1 corrigido preservados
  (quadros idênticos ao v3, acima).

## Quadros de inspeção (`video/renders/filme_v4/`)

| Quadro | Tempo | Conteúdo |
|---|---|---|
| `0153` | 5,1 s | abertura com a sigla + rodapé |
| `0497` | 16,6 s | PASSO 1 + rodapé |
| `1730` | 57,7 s | execução (mini-diagrama) + rodapé |
| `1894` | 63,1 s | Partitura (barra de estado acima do rodapé) |
| `2010` | 67,0 s | R2 Solar + rodapé |
| `2430` | 81,0 s | R3 vale + rodapé |
| `2796` | 93,2 s | PEAK SHAVING lado a lado + rodapé |
| `2934` | 97,8 s | fechamento unificado (sem rodapé duplicado) |

## Filme v5 — faixa do rodapé em cinza escuro

- `video/renders/filme_v5/SEEDS_C6_filme_v5.mp4` (composição `FilmeSEEDSv5`, `npm run render:filme5`): **idêntico ao v4**
  exceto a cor da faixa do rodapé, **`#949494` → `#5a5a5a`** (pedido do responsável: menos clara). Mesmo tempo (102,2 s,
  3.066 quadros), 1920×1080, 30 fps, sem áudio.
- Testados `#4a4a4a`, `#555555`, `#606060` e `#6b6b6b`. Abaixo de `#555555`, LACA e UNILA (roxo-escuro) começam a sumir;
  `#5a5a5a` é o tom mais escuro em que as seis marcas e o nome «UFPB» continuam reconhecíveis. O contraste dos roxos é
  menor que no `#949494` (≈ 2 × ≈ 4,6), troca aceita pela discrição. O painel grande do fechamento continua em `#949494`.
- O v4 não muda (quadro 2796 reconferido byte a byte depois da alteração). Quadros: `video/renders/filme_v5/quadro_0153.png`
  (abertura) e `quadro_2796.png` (PEAK SHAVING).

## Filme v6 — só LACA e GPEnSE, grandes, nos cantos inferiores

- `video/renders/filme_v6/SEEDS_C6_filme_v6.mp4` (composição `FilmeSEEDSv6`, `npm run render:filme6`): o mesmo filme v4/v5
  (1,5×, 102,2 s, 3.066 quadros, 1920×1080, 30 fps, sem áudio), com o rodapé substituído conforme o pedido do responsável:
  **só LACA (esquerda, 380 × 105 px) e GPEnSE (direita, 136 × 140 px)**, cada um numa aba presa à borda inferior em cinza
  bem escuro **`#333333`**, entrando de baixo para cima no início (`filme/RodapeCantos.tsx`; logotipos de
  `ferramentas/preparar_logos_rodape_cantos.py`, mesmo tratamento, cores e proporções oficiais).
- Faixa reservada de 160 px: o conteúdo do filme é reduzido uniformemente a 85,2 % (nada coberto). O rodapé sai na
  dissolução para o fechamento unificado (que mostra as seis marcas).
- Observação: o arquivo original da LACA tem 221 px de largura; a 380 px fica ampliado 1,72× (um pouco suave). Uma versão
  vetorial ou em alta resolução da LACA resolveria.
- Propostas anteriores (A–E, cantos 1–5): `docs/evidencias/propostas_rodape*/`; composições `PropostaRodape*` e
  `PropostaCantos*` mantidas só para referência.

## Filme v7 — LACA e GPEnSE no topo (alternativa A, escolhida pelo responsável)

- `video/renders/filme_v7/SEEDS_C6_filme_v7.mp4` (composição `FilmeSEEDSv7`, `npm run render:filme7`): o mesmo filme
  (1,5×, 102,2 s, 3.066 quadros, 1920×1080, 30 fps, sem áudio) com **LACA no canto superior esquerdo (380 × 105 px) e
  GPEnSE no superior direito (136 × 140 px)**, em abas quase pretas **`#1c1c1c`** presas à borda superior; as marcas descem do
  topo no início e saem na dissolução para o fechamento unificado (`filme/MarcasLayout.tsx`, layout «topo»).
- Faixa superior reservada de 160 px: o conteúdo é reduzido uniformemente a 85,2 % e ancorado na base (nada coberto).
- Escolhida entre as alternativas A/B/C (`docs/evidencias/propostas_marcas/`). Com o fundo quase preto, o roxo da LACA tem
  pouco contraste (legível pelo tamanho).

## Filme v8 — título do PASSO 2, «OTIMIZADO NO SEEDS» e marcas no canto superior esquerdo

- `video/renders/filme_v8/SEEDS_C6_filme_v8.mp4` (composição `FilmeSEEDSv8`, `npm run render:filme8`): 1,5×, **102,1 s**
  (3.063 quadros; o título novo tem um caractere a menos), 1920×1080, 30 fps, sem áudio.
- **PASSO 2:** «PASSO 2: DEFININDO A SIMULAÇÃO» → **«PASSO 2: DEFININDO PARÂMETROS»** (`filme/Capitulo2Filme.tsx`; o
  capítulo 2 isolado não muda).
- **Fechamento:** «SIMULADO NO SEEDS» → **«OTIMIZADO NO SEEDS»** (`filme/Cierre.tsx`).
- **Marcas:** só LACA (280 × 77 px) em cima e GPEnSE (126 × 130 px) embaixo, **sem fundo**, alinhadas à esquerda no canto
  superior esquerdo (layout «esquerdaTopo», `filme/MarcasLayout.tsx`). Elas entram pela esquerda no início e saem na
  dissolução para o fechamento. Coluna esquerda de 340 px reservada: o conteúdo é reduzido a 82,3 % e ancorado à direita,
  centrado na vertical (nada coberto).
- Como `Capitulo2Filme` e `Cierre` são compartilhados, um novo render das composições v3–v7 também passa a mostrar os
  textos novos. Os MP4s já entregues não mudam.
- Dados: `verificar_capitulo3.py` → «OK — 31 valores conferidos».

## Filme v9 — conteúdo centrado; LACA no canto superior esquerdo, GPEnSE no inferior direito

- `video/renders/filme_v9/SEEDS_C6_filme_v9.mp4` (composição `FilmeSEEDSv9`, `npm run render:filme9`): igual ao v8
  (PASSO 2: DEFININDO PARÂMETROS, OTIMIZADO NO SEEDS, 1,5×, **102,1 s**, 3.063 quadros, 1920×1080, 30 fps, sem áudio).
  A diferença está na posição das marcas, pedida pelo responsável: **o conteúdo principal fica CENTRADO**, sem deslocamento
  para nenhum lado.
- **Marcas:** sem fundo; LACA (252 × 70 px) no canto superior esquerdo, que desce do topo ao entrar, e GPEnSE
  (104 × 107 px) no canto inferior direito, que sobe da base (layout «diagonal», `filme/MarcasLayout.tsx`; logotipos de
  `ferramentas/preparar_logos_diagonal.py`). Elas saem na dissolução para o fechamento.
- **Espaço para as marcas:** o conteúdo é reduzido uniformemente a 86 % **a partir do centro**, o que mantém o mesmo centro
  e libera os cantos.
- **Verificação de sobreposição:** composição `VerificaDiagonal` (o mesmo filme, sem as marcas), 60 quadros distribuídos
  pelo filme. Dentro das áreas das duas marcas (com margem de 8 px), o brilho máximo é 10/255, que é apenas o fundo quase
  preto da Partitura: nenhum texto, eixo ou gráfico fica sob as marcas.
- Dados: `verificar_capitulo3.py` → «OK — 31 valores conferidos».

## Filme v10 — logo OFICIAL do SEEDS

- `video/renders/filme_v10/SEEDS_C6_filme_v10.mp4` (composição `FilmeSEEDSv10`, `npm run render:filme10`): igual ao v9
  (conteúdo centrado, LACA no canto superior esquerdo, GPEnSE no inferior direito, «PASSO 2: DEFININDO PARÂMETROS»,
  «OTIMIZADO NO SEEDS», 1,5×, **102,1 s**, 3.063 quadros, 1920×1080, 30 fps, sem áudio), com o **logo oficial**.
- **Original:** `assets/logo_oficial/SEEDS_logo_oficial.png` (1071 × 352 px, fundo branco), fornecido pelo responsável e
  guardado intocado.
- **Preparação** (`ferramentas/preparar_logo_oficial.py`): o fundo NÃO entra no filme.
  - Retira o branco conectado à borda e os 9 vazados do desenho (miolos dos 7 nós do circuito, miolo do «D»), que são
    regiões brancas fechadas com área ≥ 80 px.
  - Mantém as nervuras claras das folhas, que fazem parte do desenho.
  - Desfaz a mistura com o branco num anel de 2 px (sem halo sobre o preto).
  - Separa o emblema (287 × 309 px) e a palavra «SEEDS» (671 × 131 px). Cores e formas intactas.
- **Abertura** (`filme/AberturaOficial.tsx`), mesma coreografia aprovada:
  - o desenho surge sozinho e grande no centro e encolhe;
  - desliza à esquerda enquanto «SEEDS» se abre por trás dele;
  - o conjunto final reproduz o logo oficial em escala 1:1 (posições relativas do arquivo).
  - Depois surge a frase «Smart Energy Ecosystem for Decision Support». No arquivo ela é cinza-escuro e ficaria ilegível
    sobre preto, por isso no filme é TEXTO em cinza claro, com as mesmas palavras, a mesma posição e a mesma largura.
- **Fechamento:** o emblema oficial substitui o glifo violeta antigo acima de «OTIMIZADO NO SEEDS».
- Dados: `verificar_capitulo3.py` → «OK — 31 valores conferidos».

## Filme v11 — título «SUAVIZANDO A CURVA DE PATO»

- `video/renders/filme_v11/SEEDS_C6_filme_v11.mp4` (composição `FilmeSEEDSv11`, `npm run render:filme11`): igual ao v10,
  com o título **«ALIVIANDO A CURVA DE PATO» → «SUAVIZANDO A CURVA DE PATO»** (pedido do responsável). 102,1 s, 3.063
  quadros, 1920×1080, 30 fps, sem áudio.
- Mesmo tempo de cena do título aprovado: a digitação termina no quadro 114 de 182 (antes, 112), e o título fica 68 quadros
  visível depois de completo. Nada mais muda de tempo. `TituloVideo` ganhou o parâmetro opcional `texto`; sem ele, o título
  original fica intacto.
- Observação científica, registrada sem alterar o pedido: o despacho reduz 200 MW na ponta tarifária, mas não reduz a rampa
  máxima do dia. A nota da comparação final continua dizendo isso.
- Dados: `verificar_capitulo3.py` → «OK — 31 valores conferidos».
