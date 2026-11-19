#!/usr/bin/env python3
"""Confere, de forma independente do código do vídeo (TypeScript), CADA número exibido no capítulo 3 (resultados).

Fontes: video/src/dados/c6a.json (C6-A 6f164853, sem BESS) e c6b.json (C6-B 4713c3e1, com BESS), gerados por
ferramentas/preparar_dados.py a partir dos XLSX cujas vistas v2 têm os mesmos SHA-256 dos PDFs oficiais
(docs/VERIFICACAO_DADOS.md). Indicadores selados (PDFs oficiais) comparados com as somas das séries.
Uso: python3 ferramentas/verificar_capitulo3.py   (sai com erro se algum valor divergir)
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
A = json.loads((RAIZ / "video/src/dados/c6a.json").read_text())
B = json.loads((RAIZ / "video/src/dados/c6b.json").read_text())
N, DT = 96, 0.25
dem, fv, fvp = B["demanda_kW"], B["fv_aproveitada_kW"], B["fv_potencial_kW"]
iA, iB, pc, pd, tar = A["importacao_kW"], B["importacao_kW"], B["bess_carga_kW"], B["bess_descarga_kW"], B["tarifa_R_kWh"]
cA, cB, soc, eb = A["custo_intervalo_R"], B["custo_intervalo_R"], B["bess_soc_fronteira"], B["bess_energia_fronteira_kWh"]
liq = [d - f for d, f in zip(dem, fv)]
hora = lambda i: f"{i // 4:02d}:{(i % 4) * 15:02d}"
linhas = []

def ok(rotulo, valor, esperado, tol):
    assert abs(valor - esperado) <= tol, f"{rotulo}: {valor} ≠ {esperado}"
    v = f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    linhas.append(f"| {rotulo} | {v} |")

# premissas: demanda, tarifa e FV idênticas nas duas rodadas ⇒ carga líquida idêntica (R3)
for k in ("demanda_kW", "tarifa_R_kWh", "fv_aproveitada_kW"):
    assert A[k] == B[k], k
assert all(abs((b - a) - (c - d)) < 1e-6 for a, b, c, d in zip(iA, iB, pc, pd)), "B − A ≠ carga − descarga"
assert all(abs(p - f) < 1e-9 for p, f in zip(fvp, fv)), "há vertimento"
assert all(abs(iA[i] - liq[i]) < 1e-6 for i in range(N)), "C6-A: importação ≠ carga líquida"

ponta = [i for i in range(N) if tar[i] == 1.5]; carga = [i for i in range(N) if pc[i] > 1e-6]
assert (hora(ponta[0]), hora(ponta[-1]), len(ponta)) == ("18:00", "20:45", 12)
assert (hora(carga[0]), hora(carga[-1])) == ("11:00", "14:45")

# R0/R1 — cabeçalho e inspetor da Partitura
ok("R1 custo realizado C6-B [R$] (selado 10.220.903,29)", sum(cB), 10_220_903.29, 0.01)
ok("R1 energia atendida [kWh] (cabeçalho 21.810.467)", sum(dem) * DT, 21_810_467, 1)
i19 = 76
ok("R1 inspetor 19:00 demanda [kW]", dem[i19], 1_000_186.8, 0.06)
ok("R1 inspetor 19:00 rede [kW]", iB[i19], 800_186.8, 0.06)
ok("R1 inspetor 19:00 bateria descarga [kW]", pd[i19], 200_000.0, 0.01)
ok("R1 inspetor 19:00 custo do intervalo [R$]", cB[i19], 300_070.03, 0.006)
ok("R1 inspetor 19:00 acumulado [R$]", sum(cB[: i19 + 1]), 6_719_763.46, 0.006)
ok("R1 inspetor energia armazenada 19:00 [kWh]", eb[i19], 622_957.0, 0.06)
ok("R1 inspetor energia armazenada 19:15 [kWh]", eb[i19 + 1], 570_325.5, 0.06)
# R2 (protótipo aprovado): FV, tarifa, SOC
ok("R2 energia FV [MWh] (3.874)", sum(fv) * DT / 1000, 3874.46, 0.01)
ok("R2 FV / demanda [%] (17,8)", 100 * sum(fv) / sum(dem), 17.76, 0.01)
ok("R2 pico FV [MW] às 12:00 (515)", max(fv) / 1000, 514.635, 0.001); assert hora(fv.index(max(fv))) == "12:00"
ok("R2 SOC máximo [%] às 15:00 (90)", 100 * max(soc), 90.0, 1e-6); assert hora(soc.index(max(soc))) == "15:00"
ok("R2 SOC inicial e final [%] (20)", 100 * soc[0], 20.0, 1e-6); assert abs(soc[-1] - soc[0]) < 1e-9
# R3 — carga líquida e compensação
ok("R3 carga líquida mínima [MW] às 12:30 (447)", min(liq) / 1000, 446.795, 0.001); assert hora(liq.index(min(liq))) == "12:30"
ext = sum(iB[i] - liq[i] for i in carga) * DT
ok("R3 importação acima da carga líquida no vale [MWh] (+739)", ext / 1000, 739.05, 0.01)
ok("R3 energia carregada no dia [MWh] (739)", sum(pc) * DT / 1000, 739.05, 0.01)
assert all(abs((liq[i] - iB[i]) - 200_000) < 1e-3 for i in ponta), "na ponta a importação não fica 200 MW abaixo"
ok("R3/R4 redução da importação em cada intervalo da ponta [MW]", (iA[ponta[6]] - iB[ponta[6]]) / 1000, 200.0, 1e-6)
ok("R2 descarga na ponta [MWh] (600)", sum(pd[i] for i in ponta) * DT / 1000, 600.0, 1e-6)
# R4 — sem × com bateria
ok("R4 importação 19:30 sem bateria [MW] (1.005)", iA[78] / 1000, 1005.239, 0.001)
ok("R4 importação 19:30 com bateria [MW] (805)", iB[78] / 1000, 805.239, 0.001)
sub = lambda s: max(s[i] - s[i - 1] for i in range(1, N))
ok("R4 degrau 20:45→21:00 com bateria [MW] (+193)", (iB[84] - iB[83]) / 1000, 193.485, 0.001)
ok("R4 maior subida do dia com bateria [MW] (= 21:00)", sub(iB) / 1000, 193.485, 0.001)
ok("R4 maior subida do dia sem bateria [MW] (+116)", sub(iA) / 1000, 115.862, 0.001)
ok("R4 pico diário importação sem bateria [MW] (19:30)", max(iA) / 1000, 1005.239, 0.001)
ok("R4 pico diário importação com bateria [MW] (21:00)", max(iB) / 1000, 987.205, 0.001); assert hora(iB.index(max(iB))) == "21:00"
# R5 — custos
ok("R5 custo C6-A [R$] (selado 11.066.590,26)", sum(cA), 11_066_590.26, 0.01)
eco = sum(cA) - sum(cB)
ok("R5 economia diária [R$] (845.686,97)", eco, 845_686.97, 0.01)
ok("R5 economia [%] (7,64)", 100 * eco / sum(cA), 7.6418, 0.0001)
ok("R5 redução de custo só na ponta [R$] (900.000,00)", sum(cA[i] - cB[i] for i in ponta), 900_000.0, 0.01)
ok("R5 energia importada a mais no dia [MWh] (+72)", (sum(iB) - sum(iA)) * DT / 1000, 72.0576, 0.0001)

print("| Verificação | Valor |\n|---|---|")
print("\n".join(linhas))
print(f"\nOK — {len(linhas)} valores conferidos.")
