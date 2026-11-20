# Filme SEEDS v11 — título «SUAVIZANDO A CURVA DE PATO»

- **Vídeo:** `video/renders/filme_v11/SEEDS_C6_filme_v11.mp4` — 1920×1080, 30 fps, **102,1 s** (3.063 quadros), igual ao v10.
- **Única diferença em relação ao v10:** o título digitado do capítulo 1 passa de «ALIVIANDO A CURVA DE PATO» para
  **«SUAVIZANDO A CURVA DE PATO»**.
  - A cena do título mantém a mesma duração (182 quadros de origem), então a linha do tempo do filme não muda.
  - A digitação do novo texto termina 2 quadros depois e sobra o mesmo tempo de leitura.
- **Conferência:** quadros fora do título (0100, 1500, 2900) re-renderizados são **idênticos bit a bit** aos do v10; o quadro
  0260 (título) muda só no texto.
- **Código:** `FilmeV4` ganhou o parâmetro opcional `titulo`; composição `FilmeSEEDSv11` = v10 + `titulo`. Sem o parâmetro,
  os filmes v4–v10 ficam idênticos.
- **Também nesta entrega:** capítulo 1 avulso v4 (`video/renders/capitulo1_v4/`, `docs/CAPITULO1_v4.md`), com a mesma troca de
  título sobre a v3.
