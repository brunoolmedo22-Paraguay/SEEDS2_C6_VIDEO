# Instruções permanentes para Claude Code — SEEDS2 C6 VIDEO

## Missão e ambiente
Projeto **audiovisual**, não desenvolvimento do EMS. Trabalhar apenas neste repositório `SEEDS2_C6_VIDEO`. O código científico original da plataforma está em `SEEDS_Energy_multimodel` (somente leitura). O repositório entregue à banca `EnergyMultimodelv1.5` é totalmente intocável.

## Estado do projeto
O usuário está DEFININDO a direção criativa e a sequência narrativa. O PowerPoint é referência exploratória, não roteiro fechado. **Não começar a produzir um vídeo completo sem validar o storyboard e pelo menos um protótipo curto**. Evitar escolher cenas, duração exata, narrativa, locução, música ou transições sem alinhamento explícito.

## Estética exigida
- Fundo preto #000000, grandes áreas vazias e poucos elementos por cena.
- Títulos grandes, brancos, com animação de escrita caractere por caractere e timing natural; a referência é `PASSO 1.mp4`.
- Logos com entrada/escala sutis inspirados em `seeds intro.mp4`, mantendo fidelidade à marca (não copiar/gerar logo novo arbitrário).
- Gráficos verdadeiramente animados a partir de CSV/JSON; não simular dados com formas inventadas.
- Mesma linguagem gráfica da Partitura: fonte, cores, espessura, grid e convenções (ver arquivos em `assets/estilo-seeds2`).
- Rede em vermelho, FV em âmbar, bateria em violeta, tarifa de importação em ciano, custo em cobre.
- Sem templates genéricos, imagens stock aleatórias, transições exageradas, parágrafos em tela ou tabelas densas.
- 16:9, 1920×1080, 30 fps. Duração alvo inicial 60–120 s; somente fechar após aprovação.

## Integridade e ciência
- Os resultados oficiais de referência são os PDFs finais C6-A (rodada `6f164853...`) e C6-B (rodada `4713c3e1...`).
- Caso validado: **1.000.000 módulos de 580 W = 580 MWp**. Registros anteriores mencionando 700.000 módulos / 406 MWp são rascunhos e não devem aparecer no vídeo final.
- BESS equivalente 1.003 MWh e 200 MW operativos; SOC 20→20%; energia carregada 739,05 MWh, descarregada 667,00 MWh.
- Economia do ensaio: **R$ 845.686,97 (7,64%)**; cenário sem BESS R$ 11.066.590,26 e com BESS R$ 10.220.903,29.
- A tarifa é SINTÉTICA; não chamar de tarifa oficial brasileira. A demanda é curva do SIN digitalizada e escalada; não afirmar que são medições reais da microrrede.
- O EMS minimiza custo, e a redução de importação na ponta decorre do despacho econômico. A curva de pato definida como demanda menos FV **não é o mesmo** que a curva de importação com armazenamento. Demonstrar isso honestamente.
- Não alegar redução da rampa máxima de 24 h sem calcular e conferir.
- Usar fonte explícita para cada número ou gráfico e jamais alterar a trajetória temporal para fins estéticos. Não modificar dados, apenas seu desenho e animação.

## Fluxo de trabalho
1. Inspecionar `README.md`, `docs/BRIEF_DIRECAO.md`, materiais `assets/` e referências.
2. Inventariar dados existentes e faltantes; **solicitar XLSX/CSV final do C6-A** se necessário para comparação exata.
3. Propor storyboard com cenas, objetivos e movimentos; aguardar aprovação do responsável.
4. Criar um protótipo de 10–15 s com título digitado + gráfico SVG animado fiel ao SEEDS2.
5. Verificar legibilidade, geometria dos gráficos, valores e estética com o responsável.
6. Somente então implementar vídeo completo com Remotion (ou equivalente programático), com preview e MP4.
7. Salvar código, manifests, schemas e arquivos leves no repo em branch própria; abrir PR. Não efetuar merge sem autorização.
8. Para vídeos pesados considerar GitHub Releases ou armazenamento de artefatos; evitar arquivos renderizados gigantes no histórico.

## Recomendações técnicas
Preferir Remotion/React e componentes SVG dinâmicos (paths, linhas, barras) com animação determinística por frame. Usar fonte de dados canônica CSV/JSON (96 amostras, `15 min`) e plotar sem alisar descontinuidades reais. O SVG exportado da aplicação é apenas referência de estilo e layout, não substitui o dataset. Se algum material não estiver acessível no repo, declarar a lacuna; não inventá-lo.
