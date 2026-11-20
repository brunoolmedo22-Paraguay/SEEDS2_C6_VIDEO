# Proposta — capítulo de resultados (para aprovação antes da produção)

Rodada de referência: **C6-B 4713c3e1** (com BESS) × **C6-A 6f164853** (sem BESS). As séries vêm de `video/src/dados/{c6a,c6b}.json`,
com os mesmos SHA-256 dos PDFs oficiais (`docs/VERIFICACAO_DADOS.md`). Visual do SEEDS = Partitura, tema escuro (referências:
`resultados 1.mp4`, slide 15; painel «Carga líquida», slide 16), redesenhada em SVG com os dados gravados. Não há captura
estática: o marco da Partitura não está disponível fora do app, e a reprodução vetorial permite animar e manter a nitidez.

**Protótipo pronto da cena central R2:** `video/renders/resultados_prototipo/SEEDS_C6_resultados_prototipo_despacho.mp4`
(34,3 s). Composição `ProtoResultadosDespacho` (`src/resultados/Despacho.tsx`). Quadros: `0180` despacho completo · `0380` solar
· `0640` rede · `0920` bateria.

## Sequência proposta (≈ 85–95 s)

| Cena | Duração | Visualização do SEEDS | Gráfico de apoio | Texto em tela (curto) |
|---|---|---|---|---|
| **R0 · Ponte** — continua o capítulo 2: o painel «Concluída» encolhe e se dissolve; o preto volta | ≈ 5 s | painel de execução (capítulo 2) | — | **SIMULAÇÃO CONCLUÍDA** (digitado) · abaixo, pequeno: «96 de 96 intervalos · auditoria aprovada» |
| **R1 · A interface se monta** | ≈ 14 s (≈ 9 s de construção + 5 s estável) | **Partitura, lente Operação** (como em `resultados 1.mp4`): cabeçalho da rodada → abas das lentes → legenda → as sete raias entram uma a uma e se desenham (Decisões do MPC j0…j23 · Atendimento · Renováveis · Bateria · Rede com limite 1.200 MW · Tarifa · Custo) → barra de estado | — | só o que a própria interface mostra (R$ 10.220.903,29 realizados · 21.810 MWh atendidos · déficit 0 · valor futuro em 24 de 24 decisões) |
| **R2 · Despacho completo + destaques** (protótipo) | ≈ 34 s | a raia **Atendimento** se amplia para a tela toda (pilha rede → solar → bateria, carga hachurada abaixo de zero, demanda em linha); depois o **foco por recurso** (os outros esmaecem, como no foco da legenda) | ver as três linhas abaixo | «DESPACHO COMPLETO» |
| ↳ a) Solar | 8,7 s | foco em solar | **potência FV aproveitada** (área âmbar), pico marcado | «SOLAR» · «3.874 MWh · 17,8 % da energia demandada» · «pico 515 MW · 12:00» |
| ↳ b) Rede | 9 s | foco em rede; faixas **vale 11h–14h** e **ponta 18h–21h** atravessando os dois gráficos | **tarifa de importação** em degrau (ciano) | «REDE» · «vale · R$ 0,10» · «ponta · R$ 1,50» |
| ↳ c) Bateria | 9 s | foco em bateria (descarga cheia, carga hachurada); faixas carga/descarga | **SOC nas fronteiras** (20 % → 90 % às 15:00 → 20 %) | «BATERIA» · «carrega · 739 MWh» · «descarrega · 600 MWh na ponta» |
| **R3 · Carga líquida** | ≈ 18 s | painel **Carga líquida** do explorador: demanda × carga líquida (faixa solar) + **compensação** (importação e descarga acima de zero, carga hachurada abaixo, linha da carga líquida) | — | 1ª ênfase (faixa 11:00–14:45; barras de importação acima da linha da carga líquida): **«AUMENTO DA IMPORTAÇÃO NO VALE»** + «+739 MWh · carga da bateria». 2ª ênfase (faixa 18:00–21:00; descarga preenchendo até a linha): **«DIMINUIÇÃO DO ESFORÇO NA PONTA»** + «−200 MW de importação» |
| **R4 · Comparação grande** | ≈ 15 s | composição da **prova de conceito aprovada**, ampliada: C6-A tracejada × C6-B cheia, faixa violeta (= ação do BESS), ponta em ciano, cota −200 MW, **transição das 21:00 visível** | — | **PEAK SHAVING NA PONTA** (grande) · «−200 MW em cada intervalo das 18h às 21h» · «21:00 · +193 MW em 15 min» |
| **R5 · Encerramento** | ≈ 10 s | custo da missão em duas barras cobre (C6-A × C6-B) → marca SEEDS | — | «R$ 11,07 mi → R$ 10,22 mi · **−7,64 %**» → «Simulado no SEEDS.» · «MILP–MPC: energia deslocada, ponta reduzida, custo menor.» |

Ritmo: cada destaque tem entrada (≈ 0,5 s), construção do apoio (≈ 2 s), leitura estável (≥ 4,5 s) e saída. Títulos
digitados só em R0 e no encerramento; os nomes de recurso entram por *fade*, porque digitação a cada destaque cansaria.

## Números citados (todos das séries gravadas; script `ferramentas/verificar_dados.py`)

| Afirmação | Valor | Natureza |
|---|---|---|
| Energia FV / participação | 3.874,5 MWh · 17,76 % de 21.810,5 MWh | soma das séries · razão derivada |
| Aumento da importação no vale | +739,05 MWh (11:00–14:45) = energia carregada | B − A = carga − descarga (verificado em todo intervalo) |
| Redução na ponta tarifária | −200 MW em cada um dos 12 intervalos de 18:00–20:45 · −600 MWh | gravado |
| Custo na ponta / no vale | −R$ 900.000 na ponta · +R$ 87.810 no vale | importação × tarifa × Δ |
| Custo total | R$ 11.066.590,26 → R$ 10.220.903,29 (−R$ 845.686,97 · −7,64 %) | indicadores selados |
| Descarga fora da ponta | ≈ 67 MWh (16:00–17:15 e 21:00) | gravado |

## Riscos de interpretação científica (e como a proposta os evita)

1. **«Aumento da carga no vale» é ambíguo.** A **carga líquida** (demanda − solar) **não muda** com a bateria; o que aumenta é a
   **importação da rede**, para carregar o BESS. Proposta: «AUMENTO DA IMPORTAÇÃO NO VALE» (ou «Carga da bateria no vale»).
   Se mantiver «carga», precisa ser «carga da rede».
2. **Peak shaving só na ponta tarifária.** A importação cai 200 MW **entre 18h e 21h**, mas o **pico diário** de importação cai só
   1,8 % (1.005 → 987 MW) e **passa para 21:00**, quando a descarga termina, com uma **rampa de +193 MW em 15 min**, maior que a
   do C6-A (+116 MW). Por isso: «PEAK SHAVING NA PONTA», a marcação das 21:00 sempre visível, e nunca «redução do pico diário»
   nem «suavização da rampa».
3. **Mais energia importada, custo menor.** O C6-B importa **+72 MWh** no dia (perdas do BESS, η 95 % × 95 %). O ganho é
   **econômico** (energia comprada a R$ 0,10–0,20 e evitada a R$ 1,50), não de energia. Evitar «economia de energia».
4. **A curva de pato não muda.** A carga líquida é idêntica em A e B: o efeito aparece na **importação** e na **compensação**
   (R3 deixa isso explícito, como pede o brief).
5. **«Otimizado».** Cada uma das 24 janelas do MILP foi resolvida até o ótimo (gap ~10⁻¹⁶), mas o MPC de horizonte recedente
   não prova ótimo global do dia. Proposta: «despacho otimizado pelo MILP–MPC», não «despacho ótimo do dia».
6. **Contexto de ensaio.** Simulação algébrica offline; tarifa **sintética**; demanda = perfil SIN digitalizado e escalado.
   O rodapé de cada cena diz isso; nunca «operação real», «tarifa oficial» ou «medição».
7. **Descarga.** Dos 667 MWh descarregados, 600 MWh foram na ponta. O texto diz «600 MWh na ponta», não «toda a descarga na
   ponta».

## Decisões para você

1. Texto da R3: «AUMENTO DA IMPORTAÇÃO NO VALE» (recomendado) ou outra forma.
2. R4: sobreposição A × B (recomendado; é a prova aprovada) ou lado a lado.
3. Mensagem final: qual das três frases, ou a combinação proposta.
4. R1: confirmar a interface em tema escuro, como em `resultados 1.mp4`.
