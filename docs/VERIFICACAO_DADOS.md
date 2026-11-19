# Verificação dos dados definitivos × relatórios científicos

Reprodutível: `python3 ferramentas/verificar_dados.py > docs/VERIFICACAO_DADOS.json`. O script só lê; não usa rede nem
solver. Requisitos: `openpyxl`, `pdftotext` e o pacote extraído em `work/`.

## 1. Identidade das fontes

- O XLSX `43e3ac07` e o PDF oficial C6-B `4713c3e1` são a **mesma versão v5 do cenário, executada duas vezes**. Os
  SHA-256 coincidem para `v2/intervalos.csv`, `fronteiras.csv`, `planos.csv`, `auditoria.json`, `preflight.json` e
  `renovaveis.json`. Diferem só os arquivos com identificadores e carimbos de tempo: `janelas`, `coordenacoes`, `indice`,
  `modelo` e `registros_selados`. Mesmo padrão já visto no C4. **Conclusão: as séries do XLSX são exatamente as da rodada
  oficial.**
- C6-A `6f164853`: o XLSX `3e3dee6a` (enviado em 19/11/2026, versionado em `assets/resultados/`) é a reexecução da MESMA
  versão v7. `v2/intervalos.csv` (`678b6398…`), `fronteiras`, `planos`, `auditoria`, `preflight` e `renovaveis` têm o mesmo
  SHA-256 do PDF oficial. Importação e custo selados = somas das séries (diferença 0,0); custo = R$ 11.066.590,262178
  (PDF: R$ 11.066.590,26).
- As instantâneas `.seeds2snapshot.zip` do pacote **não contêm** nenhuma rodada oficial (ver `INVENTARIO_MATERIAIS.md` §04).

## 2. Entradas × séries gravadas (C6-B)

| Conferência | Resultado |
|---|---|
| demanda `assets/dados` × demanda gravada | desvio máximo **0 kW** (96 intervalos) |
| tarifa `.txt` e `.csv` × tarifa de decisão gravada | desvio máximo **0** |
| clima `assets/dados` × clima C4 do pacote | arquivos idênticos (SHA-256) |
| tarifa do pacote interno («COLAR_NO_SEEDS2») | **difere** em 20 intervalos: rascunho, não usar |

## 3. Indicadores selados × somas das séries (C6-B)

Todas as diferenças são **0,0** (energias = Σ média de intervalo × 0,25 h):

| Grandeza | Valor |
|---|---:|
| Demanda / atendida | 21.810.467,1 kWh / 21.810.467,1 kWh |
| Importação no PCC | 18.008.061,6 kWh |
| FV aproveitada (vertimento 0) | 3.874.463,1 kWh · pico 514.635,5 kW |
| BESS carregada / descarregada | 739.052,6 kWh / 666.995,0 kWh · SOC 20 % → 20 % |
| Custo = Σ importação × tarifa × Δ = Σ custo por intervalo | R$ 10.220.903,29 |
| Balanço do barramento | resíduo máx. 1,2 × 10⁻¹⁰ kW · carga e descarga nunca simultâneas · limites 200.000 kW atingidos |

## 4. C6-A e economia

- Custo C6-A (PDF): **R$ 11.066.590,26**; economia **R$ 845.686,97 = 7,6418 %** ✓ (README e CLAUDE.md corretos).
- A série GRAVADA do C6-A é idêntica a «demanda − FV aproveitada» (desvio máximo 0,0 kW). Demanda, tarifa e FV aproveitada
  são IGUAIS em A e B, e **B − A = carga − descarga** em todos os intervalos (resíduo < 10⁻¹⁰ kW). A faixa entre as curvas
  é, portanto, exatamente a ação do BESS.
- O C6-B importa **mais** energia que o C6-A (+72.057,6 kWh), exatamente as perdas do BESS (739.052,6 − 666.995,0). O
  ganho é **econômico**: a mesma energia é comprada em horas mais baratas.

## 5. Onde a bateria atua (C6-B)

| Patamar tarifário (sintético) | Horário local | Carga | Descarga |
|---|---|---:|---:|
| 0,10 R$/kWh («vale solar») | 11:00–13:45 | **600.000 kWh** | 0 |
| 0,20 | 14:00–14:45 | 139.052,6 kWh | 0 |
| **1,50 (ponta)** | **18:00–20:45** | 0 | **600.000 kWh** (200 MW × 3 h) |
| 0,50 | 16:00, 16:15, 17:15 | 0 | 66.995 kWh |

✓ «600 MWh descarregados na ponta» (RESUMO_C6_VIDEO.json) confere exatamente. Os outros patamares (0,30 às 10:00 e 0,45
às 15:00) não têm atuação.

## 6. Pontas e rampas — atenção para o roteiro

| Grandeza | C6-A (gravado) | C6-B (gravado) |
|---|---:|---:|
| Importação média na ponta tarifária 18:00–20:45 | 989.702 kW | **789.702 kW (−200 MW)** |
| Pico diário de importação | 1.005.239 kW às 19:30 | 987.205 kW às **21:00** (−1,8 %) |
| Maior subida em 15 min | +115.862 kW (16:45 → 17:00) | **+193.485 kW (20:45 → 21:00)** |
| Maior descida em 15 min | −124.450 kW (07:45 → 08:00) | −137.280 kW (13:45 → 14:00) |

- Na janela de ponta, a importação cai **200 MW em todos os 12 intervalos** (exatamente 200.000 kW): esta é a mensagem visual
  forte e verdadeira. Às 21:00 o C6-B salta 793.719,7 → 987.205,1 kW (+193.485,4 kW); no mesmo instante o C6-A varia −1.557,9 kW.
- O pico diário quase não cai (−1,8 %) e **migra para 21:00**, quando a tarifa volta a 0,50 e a bateria para.
- A **maior rampa piora**: +193 MW em 15 min às 21:00, contra +116 MW sem BESS. O filme **não pode** dizer que a rampa foi
  suavizada. Pode dizer que a importação foi deslocada da ponta tarifária e que a mitigação é parcial.
- A curva de carga líquida (demanda − FV) é a mesma nos dois cenários. A ponta da carga líquida é às 19:30 (1.005 MW); a
  demanda máxima, às 14:30 (1.006 MW, perfil SIN escalado).

## 7. Outras inconsistências encontradas (não bloqueiam; evitar no vídeo)

- A TAG `FV-C6-406MWP` (resto do rascunho de 406 MWp) aparece na Planta do slide 6, no XLSX e nas instantâneas, embora o
  equipamento seja «Usina FV C6 — 580 MWp» com 1.000.000 de módulos. Não mostrar a TAG; corrigi-la é tarefa da plataforma
  (fora deste repo).
- O inventário declara BESS 250 MW; na rodada os limites de carga e descarga são 200.000 kW. A potência operativa no vídeo
  é **200 MW**.
- O PCC é declarado «somente importação», com limite de 1.200 MW. Exportação = 0.
- Valores redondos em `RESUMO_C6_VIDEO.json` (custos sem centavos): usar os do PDF.
