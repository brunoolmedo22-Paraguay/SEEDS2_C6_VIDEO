# Capítulo 1 v1 — abertura, título, PASSO 1 e curvas de entrada (para avaliação)

- **Prévia:** `video/renders/capitulo1_v1/SEEDS_C6_capitulo1_v1.mp4` — 1920×1080, 30 fps, H.264, **40,1 s** (1.202 quadros), sem
  áudio.
- **Quadros-chave** (mesma pasta, PNG 1920×1080; número = quadro):
  - abertura: `0040` ícone grande · `0090` redução · `0128` «SEEDS» saindo de trás do ícone · `0150` marca completa;
  - título: `0300`;
  - PASSO 1: `0525` barramento e solar · `0615` sistema completo;
  - curva de pato: `0822` demanda desenhada · `0915` carga líquida e extremos;
  - tarifa: `1110` traçado · `1185` destaques.
- **Código:** `video/src/capitulo1/` — `Abertura`, `TituloVideo`, `Passo1Sistema`, `CurvaPato`, `Tarifa` e `Capitulo1`
  (sequência). Componentes novos: `componentes/LogoSeeds.tsx`, `CenaTitulada.tsx` e `grafico.ts`.
- **Reproduzir:** `npm run render:cap1`, com `REMOTION_BROWSER` definido.
- **Prova v1 intacta:** `cenas/ProvaConceito.tsx`, `componentes/{ImportacaoAB,TituloDigitado}.tsx` e `renders/prova_conceito_v1/`.
  O único ajuste em código compartilhado foi acrescentar a composição `Capitulo1` em `Root.tsx`.

## Sequência

| Cena | Início · duração | Movimento |
|---|---|---|
| Abertura | 0,0 s · 5,9 s | Glifo oficial entra com *fade* e escala 0,94 → 1; ≈ 1,2 s parado em 520 px; reduz para 300 px com desaceleração (1,3 s); «SEEDS» sai de trás do ícone para a direita enquanto o ícone desliza à esquerda (1,8 s; primeiro aparecem as letras finais, como no *morph* da referência); pausa e *fade*. |
| Título | 5,9 s · 5,1 s | «ALIVIANDO A CURVA DE PATO» digitado no centro, 100 px, cursor piscando; sai com *fade* e leve subida. |
| PASSO 1 | 11,0 s · 10,1 s | Título digitado sobe ao topo. O **barramento equivalente** é desenhado do centro para fora. Cada recurso entra com o fio crescendo a partir do pino (solar acima; bateria, rede e demanda abaixo), seguido do ícone (escala 0,9 → 1) e de rótulo · valor · detalhe. |
| Curva de pato | 21,1 s · 9,8 s | Título sobe. A **demanda** é desenhada (2 s). Em seguida, juntas, a **faixa solar aproveitada** (âmbar) e a **carga líquida** (violeta-claro), em 2 s. Por fim o mínimo e o máximo da carga líquida e a definição «carga líquida = demanda − solar aproveitada». |
| Tarifa | 30,9 s · 9,2 s | Título sobe. A tarifa em **degrau** ciano é desenhada (2,3 s), com o valor de cada período, como na Partitura. Depois destacam-se o **vale solar R$ 0,10** e a **ponta R$ 1,50**. |

## Fidelidade — números e fontes

| Em tela | Valor | Fonte |
|---|---|---|
| Solar 580 MWp · 1.000.000 módulos de 580 W | configuração validada | `CLAUDE.md`; XLSX (20 × 50.000 módulos CS7L-580MS) |
| Bateria 1.003 MWh · 200 MW de potência operativa | capacidade 1.003.000 kWh; limites 200.000 kW | XLSX `02 Indicadores`; PDF 4713c3e1 |
| Rede · PCC 1.200 MW · limite de importação | 1.200.000 kW, somente importação | parâmetros validados; PDF |
| Demanda «até 1.006 MW» | máximo gravado 1.006.387,5 kW às 14:30 | `c6b.json` (= C6-A) |
| Curva de demanda, faixa solar, carga líquida | 96 médias de 15 min | `c6b.json`; carga líquida = demanda − FV aproveitada (DERIVADO, rotulado) |
| Mínimo 447 MW · 12:30 / máximo 1.005 MW · 19:30 | 446.794,7 kW e 1.005.239,2 kW | derivado das séries gravadas |
| Tarifa: 0,50 · 0,30 · 0,10 · 0,20 · 0,45 · 0,50 · 1,50 · 0,50 R$/kWh | início de cada período (00h, 10h, 11h, 14h, 15h, 16h, 18h, 21h) | tarifa de decisão gravada (idêntica a `assets/dados`); **sintética**, declarado no rodapé |

Escalas: carga em 0–1.200 MW, a mesma da prova v1 (as cenas são comparáveis); tarifa em 0–1,75 R$/kWh. Ambos os eixos
começam em zero. Nenhum valor é interpolado: as séries só são reveladas.

## Decisões para avaliar

1. **Marca:** **SEEDS** (sem «2»). O glifo é o SVG oficial sem alteração geométrica, em violeta `#8b7bff` (medido no ícone do
   PPT). O fundo do ícone usa a opacidade oficial do SVG (13 % → `#121021` sobre preto), um pouco mais escuro que o do PPT
   (`#201d2e`). A palavra está em Archivo 800; o PPT usa uma fonte pesada de sistema (provável Segoe UI Black), que não está
   disponível.
2. **Cores do diagrama:** ícones da Planta/Gestor com as **cores da Partitura**. No Gestor a bateria é verde e a demanda
   violeta; aqui a bateria é violeta e a demanda branca, para que cada cor signifique o mesmo em todo o filme.
3. **Nó «Demanda» incluído** no PASSO 1, como na Planta e no slide 6, além de solar, bateria e rede.
4. **Faixa solar** com opacidade 0,52 (a Partitura usa 0,38 sobre superfície cinza; sobre preto puro ficava turva).
5. **Digitação** um pouco mais rápida que na prova v1 (2–4 quadros por caractere, contra 3–6), mesma lógica de pausas.
6. **Duração 40 s**, acima da faixa de 25–35 s pedida. Cerca de 14 s são digitação de quatro títulos. Opções para cortar:
   - digitação ainda mais rápida (−3 s);
   - títulos dos gráficos por *fade* em vez de digitação (−5 s);
   - abertura mais curta (−1,5 s).
