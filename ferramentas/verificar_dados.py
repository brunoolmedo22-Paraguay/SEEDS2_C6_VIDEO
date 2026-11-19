"""Verificação de consistência dos dados do vídeo C6 (SEEDS2) — só leitura, sem rede, sem solver.

Confronta:
  * entradas versionadas (`assets/dados/`) × entradas do pacote (`work/…`) × séries gravadas na rodada C6-B (XLSX 43e3ac07);
  * identidade XLSX 43e3ac07 × PDF oficial C6-B 4713c3e1 (SHA-256 dos dados gravados listados nos dois documentos);
  * indicadores selados (XLSX) × somas das séries × números do README/CLAUDE.md;
  * C6-A: XLSX 3e3dee6a (`assets/resultados/`) × PDF oficial 6f164853 (SHA-256 dos dados gravados), indicadores selados ×
    séries, e o contrafactual DERIVADO «importação = demanda − FV» × a série GRAVADA (só conferência).

Uso: python ferramentas/verificar_dados.py [pasta do pacote extraído] > docs/VERIFICACAO_DADOS.json
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
PACOTE = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "work" / "SEEDS2_VIDEO_Pack_Claude"
INTERNO = RAIZ / "work" / "inner"
DT = 0.25  # h (15 min)


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def csv_col(p: Path, col: int = 1) -> list[float]:
    with p.open(newline="", encoding="utf-8") as fh:
        r = list(csv.reader(fh))
    return [float(x[col]) for x in r[1:] if x]


def txt_vals(p: Path) -> list[float]:
    return [float(x) for x in p.read_text("utf-8").split()]


def xlsx_intervalos(p: Path) -> tuple[list[dict], dict]:
    import openpyxl
    wb = openpyxl.load_workbook(p, read_only=True, data_only=True)
    rows = list(wb["06 Intervalos"].iter_rows(values_only=True))
    hdr = rows[0]
    serie = [dict(zip(hdr, r)) for r in rows[1:] if r and r[0] is not None]
    ind = {}
    for r in wb["02 Indicadores"].iter_rows(values_only=True):
        if r and r[0] and len(r) > 1 and r[1] is not None:
            ind[str(r[0])] = r[1]
    proc = {}
    for r in wb["10 Procedência"].iter_rows(values_only=True):
        if r and r[0] and str(r[0]).startswith("v2/"):
            proc[str(r[0])] = r[1]
    ident = {}
    for r in wb["01 Identificação"].iter_rows(values_only=True):
        if r and r[0] and len(r) > 1 and r[1] is not None:
            ident[str(r[0])] = r[1]
    return serie, {"indicadores": ind, "procedencia": proc, "identificacao": ident}


def pdf_texto(p: Path) -> str:
    return subprocess.run(["pdftotext", "-layout", str(p), "-"], capture_output=True, text=True, check=True).stdout


def pdf_hashes(txt: str) -> dict:
    return {m.group(1): m.group(2) for m in re.finditer(r"^(v2/[\w.]+)\s+([0-9a-f]{64})", txt, re.M)}


def num_br(s: str) -> float:
    return float(s.replace(".", "").replace(",", "."))


def maxabs(a, b):
    return max(abs(x - y) for x, y in zip(a, b))


def main() -> None:
    R = PACOTE / "03_Resultados_C6"
    xlsx = R / "seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx"
    pdf_b = R / "seeds2_relatorio_Cenario_2_BESS_FV_REDE_v5_4713c3e1.pdf"
    pdf_a = R / "seeds2_relatorio_Cenario_1_FV_REDE_v7_6f164853.pdf"
    out: dict = {"fontes": {p.name: sha(p) for p in (xlsx, pdf_a, pdf_b)}}

    S, meta = xlsx_intervalos(xlsx)
    I = meta["indicadores"]
    col = lambda k: [float(x[k]) for x in S]  # noqa: E731
    dem, pv, pc, pd = col("demanda_realizada_kW"), col("arr-f36eac949fdd|P_R_kW"), col("eq-d4f88ea16dba|P_c_kW"), col("eq-d4f88ea16dba|P_d_kW")
    imp, tar, cint = col("pcc_importacao_realizada_kW"), col("tarifa_importacao_decisao_R_kWh"), col("custo_realizado_intervalo_R")
    pv_pot, vert = col("arr-f36eac949fdd|A_prevista_kW"), col("arr-f36eac949fdd|vertimento_kW")

    # 1 · identidade XLSX 43e3ac07 × PDF 4713c3e1
    hb = pdf_hashes(pdf_texto(pdf_b))
    comuns = sorted(set(hb) & set(meta["procedencia"]))
    out["identidade_xlsx_43e3ac07_x_pdf_4713c3e1"] = {k: hb[k] == meta["procedencia"][k] for k in comuns}

    # 2 · entradas × séries gravadas
    A = RAIZ / "assets" / "dados"
    dem_csv, tar_txt, tar_csv = csv_col(A / "C6_demanda_SIN_escalada_100_96x15min.csv"), txt_vals(A / "C6_C_tarifa_valle_solar_96_intervalos.txt"), csv_col(A / "C6_tarifa_final_96x15min.csv")
    ent = {"demanda_assets_x_gravada_maxabs_kW": maxabs(dem_csv, dem), "demanda_prevista_x_realizada_maxabs_kW": maxabs(col("demanda_prevista_kW"), dem),
           "tarifa_txt_x_gravada_maxabs": maxabs(tar_txt, tar), "tarifa_csv_x_txt_maxabs": maxabs(tar_csv, tar_txt), "n_intervalos": len(S)}
    if INTERNO.exists():
        di = csv_col(INTERNO / "01_Entradas_CSV" / "C6_demanda_SIN_escalada_100_96x15min.csv")
        ti = txt_vals(INTERNO / "02_Parametros_e_Tarifa" / "C6_tarifa_importacao_96valores_COLAR_NO_SEEDS2.txt")
        ent["demanda_pacote_interno_x_gravada_maxabs_kW"] = maxabs(di, dem)
        ent["tarifa_pacote_interno_x_gravada_intervalos_diferentes"] = [i for i, (x, y) in enumerate(zip(ti, tar)) if abs(x - y) > 1e-12]
    out["entradas"] = ent

    # 3 · indicadores selados × somas das séries (C6-B)
    E = lambda a: sum(a) * DT  # noqa: E731
    b = {"E_demanda_kWh": (E(dem), I["energia_demanda_kWh"]), "E_importada_kWh": (E(imp), I["energia_importada_kWh"]),
         "E_fv_aproveitada_kWh": (E(pv), I["indicadores_selados.E_renovavel_usada_kWh"]), "E_carga_kWh": (E(pc), I["indicadores_selados.E_bess_carga_kWh"]),
         "E_descarga_kWh": (E(pd), I["indicadores_selados.E_bess_descarga_kWh"]), "custo_R": (sum(i * t * DT for i, t in zip(imp, tar)), I["custo_realizado_total_R"]),
         "custo_intervalos_R": (sum(cint), I["custo_realizado_total_R"])}
    out["c6b_selado_x_series"] = {k: {"series": v[0], "selado": float(v[1]), "dif": v[0] - float(v[1])} for k, v in b.items()}
    out["c6b_balanco_maxabs_kW"] = max(abs(i + p + d - c - x) for i, p, d, c, x in zip(imp, pv, pd, pc, dem))
    out["c6b_vertimento_total_kWh"] = E(vert)
    out["c6b_fv_pico_kW"] = max(pv)
    out["c6b_soc"] = {"inicial": I["baterias.eq-d4f88ea16dba.soc_inicial"], "final": I["baterias.eq-d4f88ea16dba.soc_final"]}
    out["c6b_pc_e_pd_simultaneos"] = sum(1 for c, d in zip(pc, pd) if c > 1e-6 and d > 1e-6)
    out["c6b_potencia_max_carga_descarga_kW"] = [max(pc), max(pd)]

    # descarga por patamar tarifário
    pat = {}
    for t, d, c in zip(tar, pd, pc):
        q = pat.setdefault(f"{t:.2f}", {"intervalos": 0, "descarga_kWh": 0.0, "carga_kWh": 0.0})
        q["intervalos"] += 1; q["descarga_kWh"] += d * DT; q["carga_kWh"] += c * DT
    out["c6b_por_patamar_tarifario"] = pat
    hora = lambda i: S[i]["inicio_local"][11:16]  # noqa: E731
    out["c6b_janelas"] = {"carga": [hora(i) for i, c in enumerate(pc) if c > 1e-6], "descarga": [hora(i) for i, d in enumerate(pd) if d > 1e-6]}

    # 4 · C6-A: indicadores do PDF × contrafactual derivado (importação = demanda − FV aproveitada do C6-B)
    ta = pdf_texto(pdf_a)
    custo_a = num_br(re.search(r"R\$ ([\d.]+,\d{2})", ta).group(1))
    imp_a_pub = 17936004.0
    deriv = [d - p for d, p in zip(dem, pv)]
    out["c6a"] = {"custo_pdf_R": custo_a, "importacao_readme_kWh": imp_a_pub,
                  "derivado_importacao_kWh": E(deriv), "derivado_custo_R": sum(x * t * DT for x, t in zip(deriv, tar)),
                  "derivado_min_importacao_kW": min(deriv),
                  "nota": "DERIVADO (demanda − FV aproveitada do C6-B), NÃO é a série gravada do C6-A; serve só para testar coerência."}
    out["c6a"]["dif_importacao_kWh"] = out["c6a"]["derivado_importacao_kWh"] - imp_a_pub
    out["c6a"]["dif_custo_R"] = out["c6a"]["derivado_custo_R"] - custo_a
    hashes_a = pdf_hashes(ta)
    out["c6a"]["v2_intervalos_sha256_pdf"] = hashes_a.get("v2/intervalos.csv")
    xa = RAIZ / "assets" / "resultados" / "seeds2_dados_Cenario_1_FV_REDE_v7_3e3dee6a.xlsx"
    SA, ma = xlsx_intervalos(xa)
    out["fontes"][xa.name] = sha(xa)
    IA = ma["indicadores"]
    ca = lambda k: [float(x[k]) for x in SA]  # noqa: E731
    imp_a, dem_a, pv_a, tar_a = ca("pcc_importacao_realizada_kW"), ca("demanda_realizada_kW"), ca("arr-f36eac949fdd|P_R_kW"), ca("tarifa_importacao_decisao_R_kWh")
    out["identidade_xlsx_3e3dee6a_x_pdf_6f164853"] = {k: hashes_a[k] == ma["procedencia"][k] for k in sorted(set(hashes_a) & set(ma["procedencia"]))}
    out["c6a_gravado"] = {
        "rodada_xlsx": ma["identificacao"].get("UID da rodada"), "versao_cenario": ma["identificacao"].get("Versão do cenário"),
        "E_importada_series_kWh": E(imp_a), "E_importada_selado_kWh": float(IA["energia_importada_kWh"]),
        "custo_series_R": sum(i * t * DT for i, t in zip(imp_a, tar_a)), "custo_selado_R": float(IA["custo_realizado_total_R"]),
        "custo_selado_x_pdf_R": float(IA["custo_realizado_total_R"]) - custo_a,
        "demanda_A_igual_B": dem_a == dem, "tarifa_A_igual_B": tar_a == tar, "fv_A_igual_B": pv_a == pv,
        "derivado_x_gravado_maxabs_kW": maxabs(deriv, imp_a),
        "B_menos_A_igual_carga_menos_descarga_maxabs_kW": max(abs((ib - ia) - (c - d)) for ib, ia, c, d in zip(imp, imp_a, pc, pd)),
    }
    deriv = imp_a  # daqui em diante: série GRAVADA do C6-A

    # 5 · economia e números do README
    custo_b = float(I["custo_realizado_total_R"])
    out["economia"] = {"R": custo_a - custo_b, "pct": 100 * (custo_a - custo_b) / custo_a,
                       "importacao_extra_kWh": float(I["energia_importada_kWh"]) - float(IA["energia_importada_kWh"]),
                       "perdas_bess_kWh": float(I["indicadores_selados.E_bess_carga_kWh"]) - float(I["indicadores_selados.E_bess_descarga_kWh"])}

    # 6 · rampas (só medidas; o filme não pode alegar redução sem estes números)
    def rampas(a):
        d = [a[i + 1] - a[i] for i in range(len(a) - 1)]
        return {"max_subida_kW_por_15min": max(d), "max_descida_kW_por_15min": min(d), "pico_kW": max(a), "vale_kW": min(a)}
    liq = [d - p for d, p in zip(dem, pv)]
    out["rampas"] = {"carga_liquida_demanda_menos_fv": rampas(liq), "importacao_c6b": rampas(imp), "importacao_c6a_gravada": rampas(deriv)}
    pk = [i for i, t in enumerate(tar) if abs(t - 1.5) < 1e-12]
    out["ponta_tarifaria"] = {"inicio": S[pk[0]]["inicio_local"][11:16], "fim_exclusivo_local": S[pk[-1] + 1]["inicio_local"][11:16],
                              "intervalos": len(pk), "reducao_kW_por_intervalo": sorted({round(deriv[i] - imp[i], 6) for i in pk})}
    j = next(i for i in range(95) if tar[i] == 1.5 and tar[i + 1] != 1.5)
    out["transicao_21h_c6b"] = {"de": S[j]["inicio_local"][11:16], "para": S[j + 1]["inicio_local"][11:16], "importacao_antes_kW": imp[j],
                                "importacao_depois_kW": imp[j + 1], "salto_kW": imp[j + 1] - imp[j], "salto_c6a_kW": deriv[j + 1] - deriv[j]}
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
