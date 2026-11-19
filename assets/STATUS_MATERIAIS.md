# Materiais do vídeo C6 — status de carregamento

## Já presentes neste repositório
- README, `CLAUDE.md`, brief e setup da nuvem.
- Código de referência do renderer: `assets/estilo-seeds2/{partitura.js,trama.js,trama.css}`.
- `assets/dados/C6_demanda_SIN_escalada_100_96x15min.csv` — série de demanda em kW, 96 intervalos.
- `assets/dados/C6_clima_C4_Foz_2026-10-02_96x15min.csv` — GHI e temperatura, 96 intervalos.
- `assets/dados/C6_C_tarifa_valle_solar_96_intervalos.txt` — 96 preços sintéticos finais.
- `assets/dados/C6_tarifa_final_96x15min.csv` — o mesmo perfil em formato tabular.
- `assets/dados/C6_parametros_validados.json` — configuração e números consolidados.

## Pendente: transferência de arquivos binários
O arquivo `SEEDS2_VIDEO_Pack_Claude.zip` já foi preparado em ChatGPT (aprox. 11 MB). Ele contém os vídeos, PPTX, PDFs, XLSX, ZIP de figuras, snapshots e arquivos SVG originais. A integração GitHub utilizada para criar os arquivos de texto NÃO envia diretamente binários do ambiente de ChatGPT.

**Para completar (1 upload manual)**:
1. No GitHub abra este repositório e clique em **Add file → Upload files**.
2. Arraste o arquivo `SEEDS2_VIDEO_Pack_Claude.zip` fornecido em ChatGPT.
3. Na mensagem do commit, use `assets: adicionar pacote audiovisual C6` e confirme.
4. Claude Code Cloud deverá descompactar o ZIP em sua branch de trabalho e ler as referências.

**Privacidade:** este repositório estava PÚBLICO ao iniciar o projeto. Se os snapshots ou conteúdos dos relatórios não devem ser públicos, torne-o privado ANTES de enviar o ZIP.

### Atenção — fontes numéricas
O XLSX de C6-B fornecido tem identificador de rodada `43e3ac07`, diferente do PDF C6-B `4713c3e1`; os indicadores principais coincidem, mas o Claude deve comparar as séries antes de assumir identidade completa. O PDF C6-A final é `6f164853`. Se quiser comparação com exatidão e rastreabilidade máximas, exporte também `seeds2_dados_Cenario_1_FV_REDE_v7_6f164853.xlsx` ou o `.seeds2study.zip` dessa rodada.

Não substituir gráficos por séries sintéticas criadas para "parecer melhor".