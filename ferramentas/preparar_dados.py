"""Gera `video/src/dados/{c6a,c6b}.json`: séries lidas dos XLSX oficiais, SEM transformar valores (só seleção de colunas).

* C6-B: `seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx` (pacote) — vistas v2 com o MESMO SHA-256 da rodada 4713c3e1;
* C6-A: `assets/resultados/seeds2_dados_Cenario_1_FV_REDE_v7_3e3dee6a.xlsx` — MESMO SHA-256 da rodada 6f164853.
Ver `docs/VERIFICACAO_DADOS.json`. kW = médias de intervalo [t_k, t_k+1); kWh = estados de fronteira, como gravados.

Uso: python3 ferramentas/preparar_dados.py [pasta do pacote extraído]
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
PACOTE = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "work" / "SEEDS2_VIDEO_Pack_Claude"
RODADAS = {
    "c6b": {"xlsx": PACOTE / "03_Resultados_C6" / "seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx",
            "rodada_xlsx": "43e3ac07f1164cd493eb52ed9a04d0ed", "rodada_oficial_pdf": "4713c3e1fd79428f8a4b8f2d09907cf4",
            "v2_intervalos_csv_sha256": "320327dd74d00a3a857e27670d73151aed661916e4d901fb92d0a3bd27cc915c", "bess": True},
    "c6a": {"xlsx": RAIZ / "assets" / "resultados" / "seeds2_dados_Cenario_1_FV_REDE_v7_3e3dee6a.xlsx",
            "rodada_xlsx": "3e3dee6a4aa049ceb230f5166212ec5e", "rodada_oficial_pdf": "6f164853495d4cb5909a8d07238ea30a",
            "v2_intervalos_csv_sha256": "678b6398c5d3460a1eb9ff73d44549145cd6bbbb5af4aa64af3d0154ef2bace8", "bess": False},
}
SAIDA = RAIZ / "video" / "src" / "dados"
COLUNAS = {  # nome no vídeo ← coluna gravada (folha «06 Intervalos»)
    "demanda_kW": "demanda_realizada_kW",
    "fv_aproveitada_kW": "arr-f36eac949fdd|P_R_kW",
    "fv_potencial_kW": "arr-f36eac949fdd|A_prevista_kW",
    "importacao_kW": "pcc_importacao_realizada_kW",
    "tarifa_R_kWh": "tarifa_importacao_decisao_R_kWh",
    "custo_intervalo_R": "custo_realizado_intervalo_R",
}


BESS = {"bess_carga_kW": "eq-d4f88ea16dba|P_c_kW", "bess_descarga_kW": "eq-d4f88ea16dba|P_d_kW"}


def extrair(nome: str, r: dict) -> dict:
    import openpyxl

    xlsx = r["xlsx"]
    wb = openpyxl.load_workbook(xlsx, read_only=True, data_only=True)
    rows = list(wb["06 Intervalos"].iter_rows(values_only=True))
    dados = [dict(zip(rows[0], x)) for x in rows[1:] if x and x[0] is not None]
    assert len(dados) == 96, (nome, len(dados))
    cols = {**COLUNAS, **(BESS if r["bess"] else {})}
    out = {
        "fonte": {"arquivo": xlsx.name, "sha256": hashlib.sha256(xlsx.read_bytes()).hexdigest(), "rodada_xlsx": r["rodada_xlsx"],
                  "rodada_oficial_pdf": r["rodada_oficial_pdf"], "v2_intervalos_csv_sha256": r["v2_intervalos_csv_sha256"],
                  "nota": "Valores copiados sem alteração. Simulação algébrica offline de ensaio; tarifa sintética."},
        "delta_min": 15,
        "inicio_local": [str(d["inicio_local"])[11:16] for d in dados],
        **{k: [float(d[c]) for d in dados] for k, c in cols.items()},
    }
    if r["bess"]:
        fr = list(wb["07 Fronteiras"].iter_rows(values_only=True))
        fd = [dict(zip(fr[0], x)) for x in fr[1:] if x and x[0] is not None]
        assert len(fd) == 97
        out["bess_energia_fronteira_kWh"] = [float(d["eq-d4f88ea16dba|energia_kWh"]) for d in fd]
        out["bess_soc_fronteira"] = [float(d["eq-d4f88ea16dba|soc"]) for d in fd]
    return out


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    js = {n: extrair(n, r) for n, r in RODADAS.items()}
    # invariantes que o gráfico A × B pressupõe (falham alto se os dados mudarem)
    A, B = js["c6a"], js["c6b"]
    assert A["inicio_local"] == B["inicio_local"] and A["demanda_kW"] == B["demanda_kW"] and A["tarifa_R_kWh"] == B["tarifa_R_kWh"]
    assert A["fv_aproveitada_kW"] == B["fv_aproveitada_kW"], "FV aproveitada difere entre A e B"
    for i in range(96):  # diferença B − A = carga − descarga (balanço do barramento), dentro do resíduo numérico
        assert abs((B["importacao_kW"][i] - A["importacao_kW"][i]) - (B["bess_carga_kW"][i] - B["bess_descarga_kW"][i])) < 1e-6, i
    for n, d in js.items():
        (SAIDA / f"{n}.json").write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"OK video/src/dados/{n}.json: {len(d['inicio_local'])} intervalos ({d['fonte']['rodada_oficial_pdf'][:8]})")


if __name__ == "__main__":
    main()
