# Viabilidade técnica e proposta de animação (para discussão — nada aqui está aprovado)

## 1. Viabilidade

| Item | Situação |
|---|---|
| Remotion 4.0.540 + React 19 + TypeScript em `video/` | instalado; `npm run typecheck` ok |
| Agent Skills oficiais do Remotion (`npx remotion skills add`) | instaladas em `.agents/skills` (links em `.claude/skills`); não existe plugin no marketplace |
| Navegador de render | o download do Chrome Headless Shell (`remotion.media`) é **bloqueado** pela rede da nuvem ⇒ usar o Chromium já instalado: `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (lido em `remotion.config.ts`) |
| Fontes | Archivo e Source Sans 3 (as da Partitura, OFL) versionadas em `video/public/fonts`; o render não depende da rede |
| Dados | `ferramentas/preparar_dados.py` → `video/src/dados/c6b.json` (96 intervalos + 97 fronteiras; valores copiados do XLSX sem alteração) |
| Teste técnico renderizado | `docs/evidencias/teste_tecnico.mp4`: 1920×1080, 30 fps, H.264, 4 s, ≈ 2 s de render |
| Licença Remotion | gratuita para **indivíduos** e organizações sem fins lucrativos (texto em `node_modules/remotion/LICENSE.md`). Confirme se o vídeo é produção individual/acadêmica; se for de uma empresa com mais de 3 pessoas, exige licença paga. |
| Repositório **público** | o ZIP com instantâneas e relatórios já está público (aviso de `STATUS_MATERIAIS.md`) |

**Conclusão:** viável sem nenhuma dependência além de Remotion; todos os gráficos podem ser SVG desenhado a partir do JSON,
quadro a quadro e de forma determinística.

## 2. Linguagem gráfica herdada da Partitura (tema escuro)

- **Cores** — únicos tokens, em `video/src/tema.ts`: rede `#e05a5a` · solar `#bd860a` · bateria `#8b7cff` · tarifa
  `#22d3ee` · custo `#f9853a` · demanda `#f3f3f1` · carga líquida `#b3a8ff` · grade `rgba(255,255,255,.09)`.
  Fundo `#000` (a Partitura usa `#0a0a0a`; a diferença é imperceptível e o brief pede preto absoluto).
- **Geometria fiel ao dado** (como em `trama.js`):
  - grandezas de intervalo = **barras/degraus** em `[t_k, t_k+1)`, nunca linhas inclinadas entre pontos;
  - estados de fronteira (energia do BESS) = **pontos em t_k**;
  - pilha de injeções rede → solar → bateria;
  - carga da bateria **abaixo de zero, hachurada**;
  - demanda como linha sobreposta;
  - tarifa como **degrau** com o valor rotulado no início de cada patamar.
- **Tipografia**: títulos em Archivo (grandes, peso 500–700); números e rótulos em Source Sans 3; poucos rótulos de eixo.
  Simplifica-se a moldura (sem painéis, botões, inspetor), **nunca** o dado.

## 3. Como animar sem falsear

Princípio: a animação controla **quanto** do desenho aparece e **onde** está a atenção, nunca o valor desenhado.

| Técnica | Uso | Fidelidade |
|---|---|---|
| **Revelação temporal** (máscara da esquerda para a direita, como no teste técnico) | contar o dia de 00:00 a 24:00 | os degraus já estão completos; a máscara só os revela |
| **Barras que crescem da linha zero** em sequência (atraso por intervalo) | entrada da pilha de atendimento | cada barra termina exatamente no valor gravado |
| **Empilhamento por camadas** (rede → solar → bateria, cada uma entrando sobre a anterior) | mostrar o que cada recurso agrega | soma final = demanda atendida |
| **Destaque por foco**: a série em foco fica a 100 % e as outras esmaecem para ≈ 20 % | herdado do `resultados 1.mp4` | nada muda de valor |
| **Morfose A → B** (barras de importação do C6-A interpolam até o C6-B) | o efeito do BESS | ⚠ cria quadros intermediários sem significado físico: só com rótulo explícito, ou preferir **sobreposição** (A em contorno, B cheio) |
| **Contadores numéricos** que param no valor exato | R$ 845.686,97 · 7,64 % · 600 MWh | o valor final é o do PDF |
| **Faixa da ponta tarifária** 18:00–21:00 marcada e ampliada | onde está o ganho | horários reais da tarifa |

Títulos digitados como no `PASSO 1.mp4`: caractere a caractere, com pausas irregulares (o ritmo pode ser roteirizado por
título: lista de atrasos por caractere); cursor fino alto que pisca ≈ 0,65 s; texto centralizado que cresce
simetricamente. Proposta: digitar só os títulos de seção; frases de apoio entram por *fade*/máscara.

## 4. Cenas possíveis (para escolhermos juntos)

As opções seguem o PPT. Cada cena traz o dado que exige e o cuidado científico. A ordem e a duração estão em aberto.

1. **Abertura** — ícone SEEDS → *wordmark* (referência `seeds intro`). Exige o logo vetorial (lacuna). 4–6 s.
2. **A curva de pato** — demanda (linha) e FV aproveitada (área âmbar) → carga líquida = demanda − FV, desenhada em
   degraus. Rotular «perfil SIN escalado · ensaio». 8–12 s.
3. **O preço do tempo** — tarifa sintética em degraus, com os patamares 0,10 (vale solar) e 1,50 (ponta) iluminados.
   Rotular «tarifa sintética». 6–8 s.
4. **O sistema** — 580 MWp · 1.003 MWh / 200 MW · PCC 1.200 MW: três números grandes, ou a Planta simplificada sem a TAG. 6–8 s.
5. **Como o EMS decide** — PASSO 2/3: MPC de 24 decisões (blocos j0…j23 surgindo); «minimiza custo»; 24/24 com valor
   futuro. 8–10 s.
6. **A bateria desloca energia** — SOC 20 % → sobe no vale (carga hachurada sob zero) → cai na ponta → 20 %. 8–10 s.
7. **Importação no PCC: A × B** — ponta 18:00–21:00 com −200 MW em todos os intervalos; mostrar com honestidade a nova
   rampa às 21:00. 10–12 s.
8. **Resultado** — R$ 11,07 mi → R$ 10,22 mi · **−7,64 %** · «mitigação parcial · ensaio offline». 6–8 s.

Soma: ≈ 60–80 s.

## 5. Proposta de protótipo (10–15 s, após sua escolha)

- Título digitado (ex.: «O preço do tempo» ou «A bateria desloca energia»).
- Um gráfico verdadeiramente animado, a partir do JSON: por exemplo a cena 7, com barras de importação do C6-B, a faixa da
  ponta e a sobreposição da carga líquida.
- Entrega: MP4 1080p + quadros-chave em PNG + a tabela de valores conferidos na cena.
