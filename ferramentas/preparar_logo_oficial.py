#!/usr/bin/env python3
"""Logo OFICIAL do SEEDS (assets/logo_oficial/SEEDS_logo_oficial.png, fornecido pelo responsável, intocado) preparado para o
filme sobre FUNDO PRETO. Operações (nenhuma cor, proporção ou forma da marca é alterada):
  1. FUNDO: o branco/quase branco (min RGB >= 232) CONECTADO À BORDA da imagem vira transparente (preenchimento a partir das
     bordas). Os VAZADOS do desenho — miolos dos sete nós do circuito e o miolo do «D» — também viram transparentes: são
     regiões brancas FECHADAS com área >= 80 px (no original, são o próprio fundo visto através da marca). Regiões brancas
     fechadas menores (nervuras claras das folhas) FAZEM PARTE do desenho e ficam.
  2. BORDA: num anel de 2 px junto às regiões retiradas, «cor para alfa» contra o branco desfaz a mistura anti-serrilhada com
     o fundo branco (sem halo claro sobre o preto).
  3. PARTES: emblema (desenho) e palavra «SEEDS» recortados separadamente, para a animação (o desenho aparece e a palavra se
     abre). A FRASE PEQUENA do arquivo (cinza-escuro, ilegível sobre preto) não é usada como imagem: no filme ela é texto,
     com as mesmas palavras e a mesma posição relativa, em cinza claro.
  Posições relativas das partes = as do arquivo original (o conjunto final reproduz o desenho do logo).
Uso: python3 -I ferramentas/preparar_logo_oficial.py → video/public/logo/oficial/{emblema,palavra}.png + video/src/dados_logo_oficial.json
"""
import json
from collections import deque
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]
ORIG = RAIZ / "assets/logo_oficial/SEEDS_logo_oficial.png"
SAIDA = RAIZ / "video/public/logo/oficial"
JSON = RAIZ / "video/src/dados_logo_oficial.json"
LIM, AREA_VAZADO, ANEL = 232, 80, 2

im = Image.open(ORIG).convert("RGBA"); w, h = im.size; px = im.load()
br = lambda p: min(p[:3]) >= LIM
fora = bytearray(w * h); q = deque()
def semente(x, y):
    if br(px[x, y]) and not fora[y * w + x]: fora[y * w + x] = 1; q.append((x, y))
for x in range(w): semente(x, 0); semente(x, h - 1)
for y in range(h): semente(0, y); semente(w - 1, y)
while q:
    x, y = q.popleft()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not fora[ny * w + nx] and br(px[nx, ny]): fora[ny * w + nx] = 1; q.append((nx, ny))
# regiões brancas fechadas: vazados (>= AREA_VAZADO) também são fundo
vis = bytearray(w * h); vazados = []
for y in range(h):
    for x in range(w):
        i = y * w + x
        if br(px[x, y]) and not fora[i] and not vis[i]:
            comp = []; dq = deque([(x, y)]); vis[i] = 1
            while dq:
                a, b = dq.popleft(); comp.append((a, b))
                for na, nb in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                    j = nb * w + na
                    if 0 <= na < w and 0 <= nb < h and not vis[j] and not fora[j] and br(px[na, nb]): vis[j] = 1; dq.append((na, nb))
            if len(comp) >= AREA_VAZADO:
                for a, b in comp: fora[b * w + a] = 1
                xs = [p[0] for p in comp]; ys = [p[1] for p in comp]; vazados.append([len(comp), min(xs), min(ys), max(xs), max(ys)])
dist = [0 if fora[i] else 99 for i in range(w * h)]
for d in range(1, ANEL + 1):
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if dist[i] == 99 and any(0 <= x + a < w and 0 <= y + b < h and dist[(y + b) * w + x + a] == d - 1 for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                dist[i] = d
for y in range(h):
    for x in range(w):
        i = y * w + x; r, g, b, a = px[x, y]
        if fora[i]: px[x, y] = (255, 255, 255, 0)
        elif dist[i] <= ANEL:
            al = max(255 - r, 255 - g, 255 - b) / 255
            if al < 1:
                px[x, y] = (255, 255, 255, 0) if al <= 0 else tuple(round(min(255, max(0, (c - 255 * (1 - al)) / al))) for c in (r, g, b)) + (round(255 * al * a / 255),)

SAIDA.mkdir(parents=True, exist_ok=True)
partes = {}
for nome, caixa in {"emblema": (0, 0, 322, h), "palavra": (322, 110, w, 272), "frase": (322, 272, w, h)}.items():
    p = im.crop(caixa); bb = p.split()[3].getbbox()
    x0, y0 = caixa[0] + bb[0], caixa[1] + bb[1]
    partes[nome] = {"x": x0, "y": y0, "w": bb[2] - bb[0], "h": bb[3] - bb[1]}
    if nome != "frase":
        p.crop(bb).save(SAIDA / f"{nome}.png", optimize=True)
        partes[nome]["arquivo"] = f"logo/oficial/{nome}.png"
JSON.write_text(json.dumps({"origem": [w, h], "partes": partes, "vazados_retirados": vazados}, indent=1, ensure_ascii=False) + "\n")
print(json.dumps(partes), len(vazados), "vazados")
