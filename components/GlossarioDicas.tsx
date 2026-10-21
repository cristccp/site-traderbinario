"use client";

import { useEffect } from "react";
import { track } from "@/lib/medicao";

// Dicas do glossário no texto (marcadas por lib/glossario.ts, PT/EN/ES): <span class="glossario"> com
// <button class="glossario__termo"> + <span class="glossario__dica" hidden>. Um ouvinte só, para a página toda. Não renderiza nada.
//  - Mouse: abre ao passar na palavra; continua aberta sobre a caixinha (a "ponte" do CSS cobre o vão entre as duas);
//    fecha ~300 ms depois de sair das duas — voltar a qualquer uma cancela o fechamento.
//  - Toque/clique: abre e FIXA (não fecha ao tirar o mouse); tocar fora ou em outra palavra fecha; o link funciona com um toque.
//  - Teclado: Tab na palavra abre, Tab segue para o link da caixinha, Esc fecha e devolve o foco à palavra.
//  - Só uma aberta por vez. Abre para BAIXO quando não cabe acima (perto do topo, atrás do cabeçalho fixo) e fica dentro da tela.
// Evento glossario_dica { termo } uma vez por abertura (21/10/2026; antes: 1 vez por termo por página).
const ATRASO = 300;

export default function GlossarioDicas() {
  useEffect(() => {
    let aberto: HTMLButtonElement | null = null;
    let fixado = false;
    let timer = 0;
    let devolvendo = false;   // Esc devolve o foco à palavra: esse foco não reabre a caixinha

    const caixaDe = (b: HTMLButtonElement) => b.closest<HTMLElement>(".glossario");
    const dicaDe = (b: HTMLButtonElement) => document.getElementById(b.getAttribute("aria-controls") ?? "");
    const cancelar = () => { if (timer) { clearTimeout(timer); timer = 0; } };

    const fechar = () => {
      cancelar();
      if (!aberto) return;
      const d = dicaDe(aberto);
      if (d) { d.hidden = true; d.style.removeProperty("--desloc"); d.classList.remove("glossario__dica--baixo"); }
      aberto.setAttribute("aria-expanded", "false");
      aberto = null;
      fixado = false;
    };
    const agendarFechar = () => { if (!fixado && !timer) timer = window.setTimeout(fechar, ATRASO); };

    const abrir = (b: HTMLButtonElement, fixar: boolean) => {
      cancelar();
      if (aberto === b) { fixado ||= fixar; return; }
      fechar();
      const d = dicaDe(b);
      if (!d) return;
      d.hidden = false;
      b.setAttribute("aria-expanded", "true");
      aberto = b;
      fixado = fixar;
      // em cima por padrão; para baixo se ficaria atrás do cabeçalho fixo ou fora da tela
      const topo = document.querySelector(".topo")?.getBoundingClientRect().bottom ?? 0;
      if (d.getBoundingClientRect().top < topo + 8) d.classList.add("glossario__dica--baixo");
      // dentro da tela (margem de 8px)
      const r = d.getBoundingClientRect();
      const desloc = r.left < 8 ? 8 - r.left : r.right > window.innerWidth - 8 ? window.innerWidth - 8 - r.right : 0;
      if (desloc) d.style.setProperty("--desloc", `${desloc}px`);
      const termo = b.dataset.termo ?? "";
      if (termo) track("glossario_dica", { termo });
    };

    const botaoDe = (alvo: EventTarget | null) => (alvo as Element | null)?.closest?.<HTMLButtonElement>(".glossario__termo") ?? null;
    const dentroDe = (alvo: EventTarget | null) => (alvo as Element | null)?.closest?.<HTMLElement>(".glossario") ?? null;

    const clique = (e: MouseEvent) => {
      const b = botaoDe(e.target);
      if (b) {
        if (aberto === b && fixado) fechar();
        else abrir(b, true);
        return;
      }
      if (aberto && dentroDe(e.target) !== caixaDe(aberto)) fechar();   // toque/clique fora (o link da caixinha segue normal)
    };
    const entrar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const caixa = dentroDe(e.target);
      if (!caixa) return;
      if (aberto && caixa === caixaDe(aberto)) { cancelar(); return; }   // voltou para a palavra ou a caixinha
      const b = botaoDe(e.target);
      if (b) abrir(b, false);
    };
    const sair = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !aberto) return;
      const caixa = caixaDe(aberto);
      if (caixa && dentroDe(e.target) === caixa && !caixa.contains(e.relatedTarget as Node | null)) agendarFechar();
    };
    const focoEntra = (e: FocusEvent) => { const b = botaoDe(e.target); if (b && !devolvendo && b.matches(":focus-visible")) abrir(b, false); };
    const focoSai = (e: FocusEvent) => {
      if (!aberto) return;
      const caixa = caixaDe(aberto);
      if (caixa && dentroDe(e.target) === caixa && e.relatedTarget && !caixa.contains(e.relatedTarget as Node)) fechar();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !aberto) return;
      const b = aberto;
      fechar();
      devolvendo = true; b.focus(); devolvendo = false;
    };

    document.addEventListener("click", clique);
    document.addEventListener("pointerover", entrar);
    document.addEventListener("pointerout", sair);
    document.addEventListener("focusin", focoEntra);
    document.addEventListener("focusout", focoSai);
    document.addEventListener("keydown", tecla);
    return () => {
      cancelar();
      document.removeEventListener("click", clique);
      document.removeEventListener("pointerover", entrar);
      document.removeEventListener("pointerout", sair);
      document.removeEventListener("focusin", focoEntra);
      document.removeEventListener("focusout", focoSai);
      document.removeEventListener("keydown", tecla);
    };
  }, []);
  return null;
}
