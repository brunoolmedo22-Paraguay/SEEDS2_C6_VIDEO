# Filme SEEDS · montagem integral v3 (ajustes finais)

- **Vídeo:** `video/renders/filme_v3/SEEDS_C6_filme_v3.mp4` — 1920×1080, 30 fps, H.264 (CRF 16), sem áudio,
  **153,3 s** (4.598 quadros).
- **Composição:** `FilmeSEEDSv3` (`video/src/filme/FilmeV3.tsx`; `npm run render:filme3`), a partir do filme v2
  (`88d7d3f`).
- **Preservados:** o filme v2 e o v1 (código, MP4 e quadros), os capítulos isolados e os logotipos v2.

## Mudanças

| # | Pedido | Implementação |
|---|---|---|
| 1 | Significado da sigla na abertura | `Abertura2` ganhou dois parâmetros opcionais (`subtitulo`, `dur`); sem eles, a abertura é idêntica. No v3, depois da revelação da palavra SEEDS, surge discretamente sob a marca **«Smart Energy Ecosystem for Decision Support»** (Source Sans 3, 36 px, cinza claro, espaçamento 0,06 em). A abertura ganhou +1,5 s de leitura (7,0 → 8,5 s). |
| 2 | Ponto solto no PASSO 1 | Causa: a linha do barramento era desenhada com comprimento zero e ponta redonda antes de crescer, o que deixava um ponto branco de 6 px no centro da tela (960, 560) durante toda a digitação do título. Correção em `capitulo1/Passo1Sistema.tsx`: a linha só é desenhada quando começa a crescer. Os MP4s anteriores ficam como estão; um novo render das composições antigas também sairá sem o ponto. |
| 3 | Fundo preto no final | A cena final é preta. O cinza aparece só no painel das marcas (ver 5). |
| 4 | «SIMULADO NO SEEDS» + instituições numa só cena | `filme/Cierre.tsx` substitui «Marca» + «Créditos» (20,1 s → 12,4 s). **Esquerda:** glifo oficial; **SIMULADO NO SEEDS** digitado (mesmo ritmo e semente da Marca aprovada, alinhado à esquerda); embaixo, em pequeno, «Smart Energy Ecosystem for Decision Support» e a frase aprovada «Despacho energético otimizado por EMS hierárquico MILP–MPC.». **Direita:** os seis logotipos (ordem do LEIA.txt, 2 × 3), entrando em cascata **em paralelo** com a digitação. Cerca de 6 s com tudo visível e saída de 1 s. A R4 (PEAK SHAVING lado a lado) se dissolve direto nessa cena. |
| 5 | Logotipos sobre preto | Ver «Legibilidade» abaixo. |

## Legibilidade dos logotipos sobre preto

Testei os seis logotipos preparados **diretamente sobre preto** (contraste WCAG da cor dominante):

| Marca | sobre preto | resultado |
|---|---|---|
| PPGIES (verde) | 9,4 | legível |
| GPEnSE (verdes, amarelo, contorno) | 4,0 | legível |
| CEAR (azul-escuro) | 1,7 | texto «CEAR» fraco |
| LACA (roxo-escuro) | 1,5 | quase some |
| UNILA (roxo-escuro) | 1,5 | quase some; texto secundário ilegível |
| UFPB (texto preto) | 1,0 | o nome **«UFPB» desaparece** |

Recolorir as marcas alteraria a identidade, e não há versão negativa oficial verificável no pacote. Por isso a solução
adotada é **um único painel discreto** (cantos arredondados, sem branco, sem cartões individuais) no cinza neutro
`#949494`, testado no filme v2 (LACA/UNILA 4,6, CEAR 4,0, UFPB 6,9). O resto da tela fica em preto.

**Limpeza mínima** (`ferramentas/preparar_logos_v3.py`; originais e saídas v2 intocados): a mesma do v2 (UFPB sem o branco
externo; franja semitransparente de CEAR e GPEnSE), mais os **miolos brancos das letras P e B do texto «UFPB»**. Esses miolos
não tocam a borda da imagem e por isso sobreviviam ao preenchimento externo, aparecendo como manchas brancas sobre o fundo.
Na faixa do texto, abaixo da última faixa inteiramente branca sob o brasão, todo pixel quase branco é fundo; o brasão não é
tocado (conferido ampliado). Cores e proporções oficiais preservadas; tamanhos de exibição exatos (Lanczos).

## Linha do tempo v3

| Trecho | Início | Duração | v2 |
|---|---|---|---|
| Capítulo 1 | 0:00 | 63,0 s | 61,5 s |
| Capítulo 2 | 1:03,0 | 28,6 s | 28,6 s |
| Capítulo 3 (Partitura → R4) | 1:31,6 | 49,3 s | 49,3 s |
| Fechamento unificado | 2:20,8 | 12,4 s | 20,1 s (marca + créditos) |
| **Total** | | **153,3 s** | **159,5 s** |

## Verificação

- `python3 -I ferramentas/verificar_capitulo3.py` → «OK — 31 valores conferidos»; `video/src/dados/` sem alteração.
- Gráficos, mini-diagrama com eólica e PEMFC/H₂ e PEAK SHAVING lado a lado: os mesmos componentes e mapas de tempo do v2.
  A tabela de identidade com o v2 está abaixo.
- **Identidade com o v2** (SHA-256 de quadros renderizados; v3 = v2 + 45 quadros depois da abertura). **Todos idênticos:**
  PASSO 1 completo (745 × 700), cards do capítulo 2 (2406 × 2361), Concluída + FECHAR com o mini-diagrama (2735 × 2690),
  R2 Solar (3017 × 2972), R2 Bateria/SOC (3339 × 3294), R3 vale (3647 × 3602) e R4 PEAK SHAVING lado a lado (4195 × 4150).
- Arquivo final: ffprobe → um único fluxo h264, 1920×1080, 30/1 fps, 4.598 quadros, 153,27 s; sem áudio.

## Quadros de inspeção (`video/renders/filme_v3/`)

| Quadro | Tempo | Conteúdo |
|---|---|---|
| `0230` | 7,7 s | abertura com «Smart Energy Ecosystem for Decision Support» |
| `0495` | 16,5 s | PASSO 1 durante a digitação, sem o ponto solto |
| `4232` | 141,1 s | R4 → fechamento (dissolução) |
| `4300` | 143,3 s | fechamento: digitação em paralelo com a entrada das marcas |
| `4400` | 146,7 s | fechamento unificado completo |
