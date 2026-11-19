// Glifo OFICIAL da marca (constante LOGO de seeds2/ui/static/topbar.js; cópia em public/logo/seeds2_glifo_topbar.svg).
// Geometria, espessuras e opacidades INALTERADAS; só o tamanho (viewBox 32) e a cor (`currentColor`) vêm do vídeo.
// Cor: violeta medido no ícone do storyboard (Presentation 19.pptx, glifo #8b7bff).
export const VIOLETA_MARCA = "#8b7bff";

export const GlifoSeeds: React.FC<{ tamanho: number; cor?: string }> = ({ tamanho, cor = VIOLETA_MARCA }) => (
  <svg viewBox="0 0 32 32" width={tamanho} height={tamanho} style={{ color: cor, display: "block" }} aria-hidden="true">
    <rect x="2" y="2" width="28" height="28" rx="8" fill="currentColor" opacity=".13" />
    <path d="M6 16h20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M10 16V9M16 16V7M22 16V10M12 16v7M20 16v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
    <circle cx="10" cy="8" r="2" fill="currentColor" /><circle cx="16" cy="6" r="2" fill="currentColor" /><circle cx="22" cy="9" r="2" fill="currentColor" />
    <rect x="10" y="23" width="4" height="3" rx="1" fill="currentColor" /><circle cx="20" cy="23.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
