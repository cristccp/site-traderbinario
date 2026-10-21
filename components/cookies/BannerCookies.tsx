"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EVENTO_ABRIR, EVENTO_MUDOU, lerEscolha, salvarEscolha, type Escolha } from "@/lib/consentimento-cookies";
import type { TextosBanner } from "@/lib/i18n/tipos";
import "./cookies.css";

// Banner de cookies (pelo layout). Celular: barra compacta no rodapé da tela. Computador: cartão no canto inferior direito.
// "Aceitar" e "Recusar" com o MESMO tamanho e peso; a escolha fica 12 meses e o banner não volta.
// "Preferências de cookies" (rodapé) reabre. Enquanto aberto, a página ganha embaixo o espaço que ele ocupa (--cookies-h).
// Cópia do site principal; o link da política é externo (cristianopereira.com.br) e abre em nova aba.

const assinar = (aviso: () => void) => {
  window.addEventListener(EVENTO_MUDOU, aviso);
  return () => window.removeEventListener(EVENTO_MUDOU, aviso);
};
const SEM_LEITURA = "servidor";   // na 1ª pintura (HTML estático) o banner não aparece; o navegador decide

export default function BannerCookies({ textos, novaAba }: { textos: TextosBanner; novaAba: string }) {
  const escolha = useSyncExternalStore<Escolha | null | typeof SEM_LEITURA>(assinar, lerEscolha, () => SEM_LEITURA);
  const [reaberto, setReaberto] = useState(false);
  const caixa = useRef<HTMLElement>(null);
  const aberto = escolha === null || (reaberto && escolha !== SEM_LEITURA);

  // "Preferências de cookies" → reabre e leva o foco para o banner
  useEffect(() => {
    const abrir = () => setReaberto(true);
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);
  useEffect(() => { if (reaberto) caixa.current?.focus(); }, [reaberto]);

  // Altura do banner → --cookies-h (espaço embaixo da página)
  useEffect(() => {
    const raiz = document.documentElement;
    if (!aberto || !caixa.current) { raiz.style.removeProperty("--cookies-h"); return; }
    const medir = () => raiz.style.setProperty("--cookies-h", `${Math.max(0, Math.round(window.innerHeight - (caixa.current?.getBoundingClientRect().top ?? window.innerHeight)))}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(caixa.current);
    window.addEventListener("resize", medir);
    return () => { ro.disconnect(); window.removeEventListener("resize", medir); raiz.style.removeProperty("--cookies-h"); };
  }, [aberto]);

  if (!aberto) return null;

  const escolher = (e: Escolha) => { salvarEscolha(e); setReaberto(false); };

  return (
    <section ref={caixa} className="cookies" aria-label={textos.aria} tabIndex={-1}>
      <div className="cookies__wrap">
        <p className="cookies__texto">
          {textos.texto}{" "}
          {textos.politicaHref.startsWith("/")   // PT: política do próprio blog (mesma aba); EN/ES: a do site principal
            ? <a href={textos.politicaHref}>{textos.politica}</a>
            : <a href={textos.politicaHref} target="_blank" rel="noopener noreferrer">{textos.politica}<span className="sr-only"> {novaAba}</span></a>}
        </p>
        <div className="cookies__acoes">
          <button type="button" className="cookies__btn" onClick={() => escolher("granted")}>{textos.aceitar}</button>
          <button type="button" className="cookies__btn" onClick={() => escolher("denied")}>{textos.recusar}</button>
        </div>
      </div>
    </section>
  );
}
