#!/usr/bin/env python3
"""Prepara os logotipos institucionais (assets/logos_instituicoes/, ORIGINAIS do responsável, intocados) para a tela de
créditos do vídeo. Únicas operações: (1) recorte das margens vazias — transparência (alpha = 0) ou, na UFPB, o fundo
branco opaco ao redor do conjunto; (2) redimensionamento proporcional (Lanczos) ao tamanho EXATO de exibição em pixels, para o
navegador de render não reamostrar. Nenhuma cor, proporção ou elemento é alterado. Os logotipos são exibidos sobre cartões
BRANCOS idênticos (cor do fundo original da UFPB), o que dá contraste às marcas escuras (CEAR, LACA, UNILA) e integra a UFPB
sem retirar o fundo do brasão.

Equilíbrio óptico: todas as marcas recebem a mesma ÁREA visual (≈ A px²), limitada à área útil do cartão; UNILA (traço fino +
texto secundário) recebe fator 1,55 para legibilidade equivalente.
Uso: python3 -I ferramentas/preparar_logos.py   → video/public/logos/instituicoes/*.png + video/src/creditos/logos.json
"""
import json, math
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
ORIG, SAIDA = RAIZ / "assets/logos_instituicoes", RAIZ / "video/public/logos/instituicoes"
JSON = RAIZ / "video/src/creditos/logos.json"
A, MAXW, MAXH = 19_000, 300, 166
FATOR = {"06_UNILA": 1.55}
SAIDA.mkdir(parents=True, exist_ok=True); JSON.parent.mkdir(parents=True, exist_ok=True)
saida = []
for p in sorted(ORIG.glob("0*.png")):
    im = Image.open(p).convert("RGBA")
    if p.stem == "05_UFPB":   # fundo branco opaco: recorta só a margem branca externa
        bb = Image.eval(im.convert("L"), lambda v: 255 if v < 235 else 0).getbbox()
    else:
        bb = im.split()[3].getbbox()
    im = im.crop(bb)
    asp = im.width / im.height
    area = A * FATOR.get(p.stem, 1.0)
    h = math.sqrt(area / asp); w = h * asp
    k = min(1.0, MAXW / w, MAXH / h); w, h = round(w * k), round(h * k)
    im.resize((w, h), Image.LANCZOS).save(SAIDA / p.name, optimize=True)
    saida.append({"id": p.stem, "arquivo": f"logos/instituicoes/{p.name}", "w": w, "h": h, "recorte": bb, "origem": list(Image.open(p).size)})
    print(p.stem, "recorte", bb, "→", w, "×", h, f"(escala {w / (bb[2] - bb[0]):.2f})")
JSON.write_text(json.dumps(saida, indent=1, ensure_ascii=False) + "\n")
