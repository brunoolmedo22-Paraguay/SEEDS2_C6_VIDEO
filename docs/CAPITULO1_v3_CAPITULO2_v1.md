# Capítulo 1 v3 e capítulo 2 v1 — novo fluxo narrativo (para aprovação)

## Capítulo 1 v3 — só apresentação e montagem do sistema

- **Prévia:** `video/renders/capitulo1_v3/SEEDS_C6_capitulo1_v3.mp4` — 1080p, 30 fps, **78,1 s**.
- **Quadros:** `1867` composição solar + bateria · `2137` solar ampliada · `2320` final.
- **Igual à v2 aprovada:** abertura, título, PASSO 1, demanda + tarifa e a composição solar + bateria.
- **Diferenças:**
  - **Removido** o protagonismo final da bateria (SOC realizado e potência do BESS); fica para o capítulo de
    execução/resultados.
  - Bateria só como **equipamento**: 1.003 MWh · 200 MW · η 95 % · SOC inicial 20 % (condição de partida), com a janela
    20–90 % declarada.
  - Ampliação solar: passa a mostrar o **potencial FV previsto**, curva de entrada do EMS (modelo físico sobre o clima
    previsto; `A_prevista`, idêntica à aproveitada nesta rodada). Saem «vertimento 0» e «potência aproveitada gravada»,
    que são resultados.
  - Depois da ampliação solar, a composição volta e fica 2,5 s antes da saída.
- **Implementação:** `Equipamentos versao={3}`; o padrão continua `2`. Os quadros da v2 re-renderizados (1867, 2137, 2567)
  são idênticos bit a bit aos arquivados.

## Capítulo 2 v1 — PASSO 2: DEFININDO A SIMULAÇÃO → rodada em execução

- **Prévia:** `video/renders/capitulo2_v1/SEEDS_C6_capitulo2_v1.mp4` — 1080p, 30 fps, **40,4 s**, sem áudio.
- **Quadros:**
  - `0330` dois cards · `0530` quadro completo · `0640` com o botão · `0725` cursor sobre o botão;
  - execução: `0760` montagem · `0900` missão (intervalo 40 de 96, 41 %) · `1060` auditoria · `1150` concluída.
- **Código:** `video/src/capitulo2/Capitulo2.tsx` e `ModalExecucao.tsx`. Composição `Capitulo2`.

### Composição (slide 11 do PPTX)

| Tempo | O que acontece |
|---|---|
| 0–5,8 s | «PASSO 2: DEFININDO A SIMULAÇÃO» digitado no centro e subindo ao topo, como no PASSO 1 aprovado. |
| 5,8–17 s | **Trilho das «Etapas do experimento»**, com o mesmo vocabulário do Centro de Operação: marcadores 01–04 que viram ✓, e a etapa 04 com anel de «próxima». Cards revelados um a um, ≈ 2,7 s entre eles. Cada card tem «ETAPA 0X», título, um elemento visual animado, duas ou três linhas curtas e o estado. |
| 17–24,5 s | **Quadro completo estável**; o botão **«Rodar simulação»** entra e fica 5 s. |
| 24,5–24,7 s | O **cursor** entra, para sobre o botão (anel de destaque), aperta (o botão afunda) e clica (onda). |
| 24,7–40,4 s | A cena **desfoca e escurece** (o fundo do modal do app) e sobe o **painel de execução**. Fases: Montagem (barra indeterminada) → Missão MPC (24 janelas, k = 4·j, porcentagem real k/96, horizonte MPC de 8 intervalos) → Auditoria → Gravação → **Concluída** («Abrindo os resultados gravados…»). |

Conteúdo dos cards:
- **Inicialização:** ícones da rede, solar e bateria · «sistema configurado» · «rede + solar + bateria» · SOC inicial **20 %**.
- **Previsões:** miniaturas desenhadas das curvas de entrada (demanda 755–1.006 MW; irradiância 0–970 W/m²) · «curva de
  demanda» · «clima e irradiância».
- **Estratégia EMS:** **MILP–MPC** · barra do planejador de 24 h e janela MPC de 2 h que aplica 1 h, deslizando · «despacho
  hierárquico» · «carga crítica atendida» · «arbitragem tarifária».
- **Execução:** **1.440 min** · régua de 96 intervalos preenchida · **96 × 15 min** · «pronta para rodar».

### Fidelidade ao SEEDS na cena de execução

Reprodução do modal do app, **não** uma animação genérica. As fontes estão em `SEEDS_Energy_multimodel` `main` `a51fa5e`:
- `seeds2/ui/static/trama/execucao.js` — estrutura, textos e regras do progresso;
- `trama.css .pt.mx` — tema escuro, raios, tipografia e animações;
- `integracao_v2/ui.py` — `dados_modal` e `FASES`.

Detalhes:
- **Cabeçalho:** «RUNNING SIMULATION» e pílula «Em execução» → «Concluída».
- **Mini-diagrama decorativo:** pulsos (`mx-pulso` 2,2/2,6 s), brilho do barramento (`mx-brilho`) e respiração dos nós
  (`mx-respira`), reproduzidos quadro a quadro.
- **Rótulos reais:** fases (Fila · Montagem · Missão MPC · Auditoria · Gravação), textos de fase («Montando a missão e
  verificando o solver»…), progresso («Intervalo k de 96 · j janela(s) resolvida(s)», porcentagem só na missão com k < n,
  100 % só concluída) e horizonte MPC («próxima janela de 8 intervalo(s) a partir de k»).
- **Comportamento real:** barra indeterminada fora da missão; transição de 0,6 s da barra; «CANCELAR EXECUÇÃO» desabilitado
  na auditoria e na gravação; nota do rodapé.
- **Dados da rodada C6-B:** «Cenario 2 - BESS + FV + REDE · versão 5», rodada 4713c3e1…, N = 8 · m = 4 · H_L = 96, iniciada
  19/11 16:31 (hora gravada, em UTC). A rodada real levou **42 s**; aqui é exibida acelerada, como declara a legenda.

## Decisões para avaliar

1. **Marca no cabeçalho do painel:** «SEEDS», sem o «2». O app mostra «SEEDS2»; segui a regra da marca do vídeo.
2. **Cores do mini-diagrama do painel:** reproduzidas como no app (Gestor: solar laranja, eólica azul, PEMFC petróleo,
   bateria verde, rede vermelha). Os nós eólica e PEMFC fazem parte do desenho decorativo fixo do app, embora a C6 não os
   tenha. Posso restringir aos recursos da C6 e às cores do filme, se preferir.
3. **Fim da cena:** a missão termina em «Concluída · abrindo os resultados gravados…» e o capítulo sai pelo preto, como ponte
   para o capítulo de resultados.
4. **Hora de início:** 16:31, a hora gravada (UTC) e a que o app exibe no servidor de implantação. Em horário de Brasília
   seria 13:31.
