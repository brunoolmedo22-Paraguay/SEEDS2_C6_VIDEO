# SEEDS2 · C6 | Vídeo de demonstração

Repositório de produção audiovisual **independente** da plataforma de simulação. Objetivo: vídeo curto (1–2 minutos) sobre a mitigação **parcial** da curva de pato por deslocamento econômico de energia em microrrede simulada pelo EMS hierárquico MILP–MPC do SEEDS2.

## Linguagem visual

- **Fundo preto absoluto**, tipografia grande branca e poucas palavras na tela.
- Visual limpo e espaçoso, com animações fluidas; estética minimalista premium.
- Títulos com efeito de **escrita progressiva**, conforme vídeo de referência `PASSO 1.mp4`.
- Gráficos **verdadeiramente animados**, reconstruídos a partir de dados verificados; sem inventar valores.
- Usar as cores reais da Partitura SEEDS2: solar âmbar, rede vermelho, bateria violeta, tarifa ciano e custo cobre.
- Vídeos `seeds intro.mp4` e `resultados 1.mp4` estabelecem identidade e ritmo de movimento.
- O PowerPoint é um **storyboard em desenvolvimento**, não um vídeo para converter literalmente. Blocos azuis são *placeholders*.
- **Antes de construir o vídeo inteiro:** discutir o storyboard e criar uma prova de conceito curta para aprovar estilo e gráficos.

## Fontes e rastreabilidade

O caso **validado** tem 1.000.000 módulos FV de 580 W (**580 MWp**), bateria equivalente 1.003 MWh / 200 MW e 96 intervalos de 15 minutos.

| Resultado | C6-A · sem BESS | C6-B · com BESS |
|---|---:|---:|
| Custo diário | R$ 11.066.590,26 | R$ 10.220.903,29 |
| Importação | 17.936.004,0 kWh | 18.008.061,6 kWh |
| Atendimento da demanda | 21.810.467,1 kWh | 21.810.467,1 kWh |
| Decisões MPC com valor futuro | 24/24 | 24/24 |

Economia diária **R$ 845.686,97 (~7,64%)**. BESS: 739.052,6 kWh carregados, 666.995,0 kWh descarregados; SOC inicial/final 20%/20%. São resultados de **simulação algébrica offline com tarifa sintética**, não operação física nem faturamento real.

**Atenção científica:** a função objetivo é econômica, não de minimização explícita da curva de pato. A curva de carga líquida `demanda - FV efetivamente aproveitada` não muda quando a bateria carrega; o efeito do BESS deve ser mostrado na **importação no PCC** e no deslocamento temporal. Não afirmar suavização global da rampa máxima sem medição.

## Organização do material

- `assets/referencias/` — storyboard, intro e exemplos de movimento
- `assets/dados/` — demanda, clima, tarifa e dados numéricos das rodadas
- `assets/resultados/` — relatórios, CSV/XLSX e figuras exportadas
- `assets/estilo-seeds2/` — código de referência visual do renderer SEEDS2
- `docs/` — briefing, validações, storyboard aprovado e registro de decisões
- `video/` — futuro código Remotion e arquivos renderizados pequenos

## Como começar no Claude Code Cloud

1. Abrir [claude.ai/code](https://claude.ai/code) e conectar GitHub.
2. Escolher exclusivamente este repositório: `brunoolmedo22-Paraguay/SEEDS2_C6_VIDEO`.
3. Ler `CLAUDE.md` e o material em `assets/`.
4. Trabalhar em **branch própria**, salvar resultados com commits e criar PR.
5. **Não alterar** os repositórios `SEEDS_Energy_multimodel` nem `EnergyMultimodelv1.5`.
6. Não considerar arquivos temporários da sessão cloud como armazenamento definitivo: versionar fontes e entregáveis ou gerar artefatos de release.

> Os arquivos binários grandes (MP4, PPTX, PDF, snapshots, XLSX, ZIP) são adicionados separadamente ao repositório. Confira os nomes presentes antes de começar a produção.

