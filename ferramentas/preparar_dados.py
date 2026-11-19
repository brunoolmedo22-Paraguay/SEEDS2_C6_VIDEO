"""Gera `video/src/dados/c6b.json`: séries do C6-B lidas do XLSX oficial, SEM transformar valores (só seleção de colunas).

Fonte: `seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx` (rodada 43e3ac07), cujas vistas `v2/intervalos.csv`,
`v2/fronteiras.csv` e `v2/planos.csv` têm o MESMO SHA-256 da rodada oficial 4713c3e1 (PDF final) — ver
`docs/VERIFICACAO_DADOS.json`. Números em kW (médias de intervalo [t_k, t_k+1)) e kWh (fronteiras), como gravados.

Uso: python3 ferramentas/preparar_dados.py [pasta do pacote extraído]
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
PACOTE = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / "work" / "SEEDS2_VIDEO_Pack_Claude"
XLSX = PACOTE / "03_Resultados_C6" / "seeds2_dados_Cenario_2_BESS_FV_REDE_v5_43e3ac07.xlsx"
SAIDA = RAIZ / "video" / "src" / "dados" / "c6b.json"
COLUNAS = {  # nome no vídeo ← coluna gravada (folha «06 Intervalos»)
    "demanda_kW": "demanda_realizada_kW",
    "fv_aproveitada_kW": "arr-f36eac949fdd|P_R_kW",
    "fv_potencial_kW": "arr-f36eac949fdd|A_prevista_kW",
    "bess_carga_kW": "eq-d4f88ea16dba|P_c_kW",
    "bess_descarga_kW": "eq-d4f88ea16dba|P_d_kW",
    "importacao_kW": "pcc_importacao_realizada_kW",
    "tarifa_R_kWh": "tarifa_importacao_decisao_R_kWh",
    "custo_intervalo_R": "custo_realizado_intervalo_R",
}


def main() -> None:
    import openpyxl

    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    rows = list(wb["06 Intervalos"].iter_rows(values_only=True))
    hdr, dados = rows[0], [dict(zip(rows[0], r)) for r in rows[1:] if r and r[0] is not None]
    fr = list(wb["07 Fronteiras"].iter_rows(values_only=True))
    fh, fdados = fr[0], [dict(zip(fr[0], r)) for r in fr[1:] if r and r[0] is not None]
    assert len(dados) == 96 and len(fdados) == 97, (len(dados), len(fdados))
    out = {
        "fonte": {"arquivo": XLSX.name, "sha256": hashlib.sha256(XLSX.read_bytes()).hexdigest(),
                  "rodada_xlsx": "43e3ac07f1164cd493eb52ed9a04d0ed", "rodada_oficial_pdf": "4713c3e1fd79428f8a4b8f2d09907cf4",
                  "v2_intervalos_csv_sha256": "320327dd74d00a3a857e27670d73151aed661916e4d901fb92d0a3bd27cc915c",
                  "nota": "Valores copiados sem alteração. Simulação algébrica offline de ensaio; tarifa sintética."},
        "delta_min": 15,
        "inicio_local": [str(d["inicio_local"])[11:16] for d in dados],
        **{k: [float(d[c]) for d in dados] for k, c in COLUNAS.items()},
        "bess_energia_fronteira_kWh": [float(d["eq-d4f88ea16dba|energia_kWh"]) for d in fdados],
        "bess_soc_fronteira": [float(d["eq-d4f88ea16dba|soc"]) for d in fdados],
    }
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"OK {SAIDA.relative_to(RAIZ)}: {len(dados)} intervalos, {len(fdados)} fronteiras")


if __name__ == "__main__":
    main()
