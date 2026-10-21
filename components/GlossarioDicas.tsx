"use client";

import { useEffect } from "react";
import { track } from "@/lib/medicao";

// Dicas do glossário no texto (marcadas por lib/glossario.ts): <button class="glossario__termo"> + <span class="glossario__dica" hidden>.
// Um ouvinte só, para a página toda: abre ao passar o mouse e ao tocar/clicar (Enter/Espaço no teclado),
// fecha com Esc, com toque/clique fora ou ao sair com o mouse. A dica fica dentro da tela no celular.
// Evento glossario_dica { termo } 1 vez por termo por página. Não renderiza nada.
export default function GlossarioDicas() {
  useEffect(() => {
    const vistos = new Set<string>();
    let aberto: HTMLButtonElement | null = null;

    const dicaDe = (b: HTMLButtonElement) => document.getElementById(b.getAttribute("aria-controls") ?? "");
    const fechar = () => {
      if (!aberto) return;
      const d = dicaDe(aberto);
      if (d) { d.hidden = true; d.style.removeProperty("--desloc"); }
      aberto.setAttribute("aria-expanded", "false");
      aberto = null;
    };
    const abrir = (b: HTMLButtonElement) => {
      if (aberto === b) return;
      fechar();
      const d = dicaDe(b);
      if (!d) return;
      d.hidden = false;
      b.setAttribute("aria-expanded", "true");
      aberto = b;
      // dentro da tela (margem de 8px)
      const r = d.getBoundingClientRect();
      const desloc = r.left < 8 ? 8 - r.left : r.right > window.innerWidth - 8 ? window.innerWidth - 8 - r.right : 0;
      if (desloc) d.style.setProperty("--desloc", `${desloc}px`);
      const termo = b.dataset.termo ?? "";
      if (termo && !vistos.has(termo)) { vistos.add(termo); track("glossario_dica", { termo }); }
    };
    const botao = (e: Event) => (e.target as Element | null)?.closest?.(".glossario__termo") as HTMLButtonElement | null;

    const clique = (e: MouseEvent) => {
      const b = botao(e);
      if (b) { if (aberto === b) fechar(); else abrir(b); return; }
      if (aberto && !(e.target as Element).closest(".glossario")) fechar();
    };
    const entrar = (e: PointerEvent) => { if (e.pointerType === "mouse") { const b = botao(e); if (b) abrir(b); } };
    const sair = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !aberto) return;
      const caixa = aberto.closest(".glossario");
      if (caixa && !caixa.contains(e.relatedTarget as Node | null)) fechar();
    };
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape" && aberto) { const b = aberto; fechar(); b.focus(); } };

    document.addEventListener("click", clique);
    document.addEventListener("pointerover", entrar);
    document.addEventListener("pointerout", sair);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("click", clique);
      document.removeEventListener("pointerover", entrar);
      document.removeEventListener("pointerout", sair);
      document.removeEventListener("keydown", tecla);
    };
  }, []);
  return null;
}
