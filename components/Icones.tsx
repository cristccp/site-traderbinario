import type { JSX, ReactNode } from "react";

// Ícones de linha do design aprovado (mesmo traço do protótipo). Decorativos: o nome fica no aria-label do link.
export const IconeYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" /></svg>
);
export const IconeInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" /></svg>
);
export const IconeTelegram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4z" /></svg>
);
export const IconeMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconeFechar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconePlay = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
export const IconeBusca = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
);

// Ícones dos 6 temas (box de categorias da home): mesmo traço, tamanho maior.
const Tema = ({ children }: { children: ReactNode }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
export const ICONES_TEMA: Record<string, () => JSX.Element> = {
  // velas com seta para cima e para baixo
  "opcoes-binarias": () => <Tema><path d="M6 8v8M6 10h0M10 5v12M14 9v8" /><rect x="4.5" y="10" width="3" height="4" rx=".5" /><rect x="8.5" y="7" width="3" height="6" rx=".5" /><rect x="12.5" y="11" width="3" height="4" rx=".5" /><path d="M18 9l2-2 2 2M20 7v5M18 15l2 2 2-2M20 12v5" /></Tema>,
  // robô
  "robos-traders": () => <Tema><rect x="5" y="8" width="14" height="10" rx="3" /><path d="M12 4v4M9 13h0M15 13h0M9.5 16h5M3 12v3M21 12v3" /><circle cx="9" cy="12.5" r="1" /><circle cx="15" cy="12.5" r="1" /></Tema>,
  // câmbio: globo com setas
  forex: () => <Tema><circle cx="12" cy="12" r="6" /><path d="M6 12h12M12 6c2 2 2 10 0 12M12 6c-2 2-2 10 0 12" /><path d="M3 8a10 10 0 0 1 4-4.5M21 16a10 10 0 0 1-4 4.5" /></Tema>,
  // monitor com gráfico
  metatrader: () => <Tema><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4M6 13l3-3 3 2 5-5" /></Tema>,
  // escudo
  "gestao-de-risco": () => <Tema><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></Tema>,
  // prédio (corretora)
  corretoras: () => <Tema><path d="M3 20h18M5 20V10M9.5 20V10M14.5 20V10M19 20V10M2.5 10L12 4l9.5 6z" /></Tema>,
};
