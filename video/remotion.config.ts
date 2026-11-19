import { Config } from "@remotion/cli/config";

// 16:9 · 1920×1080 · 30 fps (CLAUDE.md). Saída H.264 de alta qualidade para revisão.
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
// Na nuvem, se o download do Chrome Headless Shell for bloqueado, aponte para um Chromium local:
//   REMOTION_BROWSER=/opt/pw-browsers/chromium npx remotion render …
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
