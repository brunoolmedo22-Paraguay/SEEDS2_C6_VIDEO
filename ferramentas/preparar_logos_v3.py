#!/usr/bin/env python3
"""Logotipos para o FECHAMENTO UNIFICADO do filme v3 (SIMULADO NO SEEDS à esquerda + marcas à direita, sobre preto).
Igual a preparar_logos_v2.py (que fica intacto, com suas saídas), mais:
  (1b) UFPB: os brancos PRESOS nas contraformas do texto «UFPB» (miolos de P e B, que não tocam a borda e por isso
       sobreviviam ao preenchimento externo) também são fundo: na faixa do texto (linhas abaixo da última faixa
       inteiramente branca sob o brasão) todo pixel quase branco é retirado. O brasão, acima, não é tocado.
  tamanhos menores (células da metade direita da tela).
(texto original do v2:) Logotipos para os CRÉDITOS v2 (filme v2): fundo cinza neutro, SEM cartões brancos. Originais do responsável
(assets/logos_instituicoes/) intocados; o script v1 (preparar_logos.py) e suas saídas também.
Operações (nenhuma cor, proporção ou elemento das marcas é alterado):
  (1) UFPB: retira SÓ o fundo branco EXTERNO — preenchimento a partir das bordas da imagem sobre pixels quase brancos
      (min RGB >= 235) conectados à borda; brancos INTERNOS do brasão (pontos, faixas, pergaminho) não são tocados por não
      estarem conectados ao exterior. Num anel de 2 px junto ao fundo retirado, «cor para alfa» contra o branco desfaz a
      mistura anti-serrilhada com o branco (sem halo claro sobre o cinza). Os demais logotipos já têm transparência.
  (2) FRANJA de recorte: pixels SEMITRANSPARENTES (0 < alfa < 255) quase brancos (min RGB >= 200) — resíduo do recorte
      sobre fundo branco nos arquivos originais (CEAR, GPEnSE), que vira um halo claro sobre o cinza — recebem «cor para alfa»
      contra o branco. Pixels OPACOS nunca são alterados (a grade branca do globo do CEAR e o contorno do GPEnSE ficam).
  (3) recorte das margens vazias (alfa = 0) e redimensionamento proporcional (Lanczos) ao tamanho EXATO de exibição.
Equilíbrio óptico: mesma área visual (A px²) por marca, limitada à célula útil; UNILA (traço fino + texto secundário) × 1,55.
Uso: python3 -I ferramentas/preparar_logos_v3.py → video/public/logos/instituicoes_v3/*.png + video/src/creditos/logos_v3.json
"""
import json, math
from collections import deque
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
ORIG, SAIDA = RAIZ / "assets/logos_instituicoes", RAIZ / "video/public/logos/instituicoes_v3"
JSON = RAIZ / "video/src/creditos/logos_v3.json"
A, MAXW, MAXH = 14_500, 200, 136
FATOR = {"06_UNILA": 1.55}
LIM, ANEL = 235, 2


def sem_fundo_externo(im: Image.Image):
    im = im.convert("RGBA"); w, h = im.size; px = im.load()
    branco = lambda p: min(p[:3]) >= LIM
    fora = bytearray(w * h); q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if branco(px[x, y]) and not fora[y * w + x]: fora[y * w + x] = 1; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if branco(px[x, y]) and not fora[y * w + x]: fora[y * w + x] = 1; q.append((x, y))
    # (1b) faixa do texto: abaixo da última sequência de linhas inteiramente brancas (separação brasão | «UFPB»)
    tinta = [y for y in range(h) if any(not branco(px[x, y]) for x in range(w))]
    cortes = [tinta[i + 1] for i in range(len(tinta) - 1) if tinta[i + 1] - tinta[i] > 1]
    y_texto = cortes[-1] if cortes else h
    for y in range(y_texto, h):
        for x in range(w):
            if branco(px[x, y]) and not fora[y * w + x]: fora[y * w + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not fora[ny * w + nx] and branco(px[nx, ny]):
                fora[ny * w + nx] = 1; q.append((nx, ny))
    dist = [0 if fora[i] else 99 for i in range(w * h)]
    for d in range(1, ANEL + 1):
        for y in range(h):
            for x in range(w):
                i = y * w + x
                if dist[i] == 99 and any(0 <= x + a < w and 0 <= y + b < h and dist[(y + b) * w + x + a] == d - 1
                                         for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    dist[i] = d
    removidos = borda = 0
    for y in range(h):
        for x in range(w):
            i = y * w + x; r, g, b, a = px[x, y]
            if fora[i]:
                px[x, y] = (255, 255, 255, 0); removidos += 1
            elif dist[i] <= ANEL:
                al = max(255 - r, 255 - g, 255 - b) / 255
                if al < 1:
                    px[x, y] = (255, 255, 255, 0) if al <= 0 else tuple(
                        round(min(255, max(0, (c - 255 * (1 - al)) / al))) for c in (r, g, b)) + (round(255 * al * a / 255),)
                    borda += 1
    return im, removidos, borda


def sem_franja(im: Image.Image):
    px = im.load(); n = 0
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if 0 < a < 255 and min(r, g, b) >= 200:
                al = max(255 - r, 255 - g, 255 - b) / 255
                px[x, y] = (255, 255, 255, 0) if al <= 0 else tuple(round(min(255, max(0, (c - 255 * (1 - al)) / al))) for c in (r, g, b)) + (round(a * al),)
                n += 1
    return im, n


SAIDA.mkdir(parents=True, exist_ok=True)
saida = []
for p in sorted(ORIG.glob("0*.png")):
    im = Image.open(p).convert("RGBA"); trat = None
    if p.stem == "05_UFPB":
        im, rem, bor = sem_fundo_externo(im); trat = {"fundo_externo_removido_px": rem, "anel_borda_px": bor}
    im, nf = sem_franja(im)
    if nf: trat = {**(trat or {}), "franja_semitransparente_px": nf}
    bb = im.split()[3].getbbox(); im = im.crop(bb)
    asp = im.width / im.height
    hh = math.sqrt(A * FATOR.get(p.stem, 1.0) / asp); ww = hh * asp
    k = min(1.0, MAXW / ww, MAXH / hh); ww, hh = round(ww * k), round(hh * k)
    im.resize((ww, hh), Image.LANCZOS).save(SAIDA / p.name, optimize=True)
    item = {"id": p.stem, "arquivo": f"logos/instituicoes_v2/{p.name}", "w": ww, "h": hh, "recorte": list(bb), "origem": list(Image.open(p).size)}
    if trat: item["tratamento"] = trat
    saida.append(item)
    print(p.stem, "recorte", bb, "→", ww, "×", hh, f"(escala {ww / (bb[2] - bb[0]):.2f})", trat or "")
JSON.write_text(json.dumps(saida, indent=1, ensure_ascii=False) + "\n")
