"use client";

import { useEffect } from "react";

// Cabeçalho fixo (o visual está em app/blog.css, no estilo do menu do cristianopereira.com.br):
//  - data-rolou no <header class="topo">: a página saiu do topo → fundo "vidro" escuro, desfoque, linha ciano embaixo
//    e, no computador, versão mais baixa (logo menor, sem "POR CRISTIANO PEREIRA");
//  - --topo-h no <html>: a altura ATUAL do cabeçalho, usada nas âncoras (scroll-padding-top) e no topo da lateral fixa;
//  - margin-bottom = altura cheia − altura atual: o espaço que o cabeçalho ocupa na página não muda quando ele encolhe,
//    então o conteúdo não "pula".
// Sem dependência: um ouvinte de rolagem passivo (no máximo 1 vez por quadro) e um ResizeObserver. Não desenha nada.
export default function TopoRolagem() {
  useEffect(() => {
    const topo = document.querySelector<HTMLElement>(".topo");
    if (!topo) return;
    const raiz = document.documentElement;
    let quadro = 0;

    const medir = () => {
      const rolou = topo.hasAttribute("data-rolou");
      if (rolou) topo.removeAttribute("data-rolou");
      const cheio = topo.getBoundingClientRect().height;                // altura sem encolher (lida sem pintar a tela)
      if (rolou) topo.setAttribute("data-rolou", "");
      const atual = topo.getBoundingClientRect().height;
      raiz.style.setProperty("--topo-h", `${atual}px`);
      topo.style.marginBottom = `${cheio - atual}px`;
    };
    const atualizar = () => {
      quadro = 0;
      const rolou = window.scrollY > 6;
      if (rolou !== topo.hasAttribute("data-rolou")) { topo.toggleAttribute("data-rolou", rolou); medir(); }
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(atualizar); };

    atualizar();
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(topo);
    window.addEventListener("scroll", agendar, { passive: true });
    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", agendar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return null;
}
