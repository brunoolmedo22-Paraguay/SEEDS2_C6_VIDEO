#!/usr/bin/env bash
# Extrai SEEDS2_VIDEO_Pack_Claude.zip (e o pacote interno de simulação) em work/ — pasta de trabalho NÃO versionada.
# Os binários continuam versionados uma única vez, dentro do ZIP da raiz (sem duplicar ~12 MB no histórico).
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
cd "$RAIZ"
mkdir -p work
unzip -q -o SEEDS2_VIDEO_Pack_Claude.zip -d work/
unzip -q -o "work/SEEDS2_VIDEO_Pack_Claude/02_Dados_e_Parametros/SEEDS2_C6_Pacote_Completo_Simulacao(1).zip" -d work/inner
echo "OK: work/SEEDS2_VIDEO_Pack_Claude e work/inner"
