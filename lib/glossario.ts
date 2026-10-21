import { TERMOS, type Termo } from "@/lib/glossario-dados";
import type { Bloco } from "@/lib/markdown";

// Glossário: os 100 termos do e-book (lib/glossario-dados.ts, gerado) + as dicas dentro dos artigos.
// Dica = botão no termo (1ª ocorrência, máx. 8 por artigo) que abre a definição (components/GlossarioDicas.tsx).
export { TERMOS, type Termo };

export const MAX_DICAS = 8;
// Nas dicas do texto ficam de fora os termos genéricos demais (continuam na página /glossario)
const CAPITULOS_FORA = new Set(["Consistência e evolução", "Mentalidade final"]);
const GENERICOS = new Set(["trader", "ativo", "ordem", "grafico", "indicador", "processo", "emocional", "disciplina", "paciencia", "ansiedade", "resultado"]);
const DICAS = TERMOS.filter((t) => !CAPITULOS_FORA.has(t.capitulo) && !GENERICOS.has(t.slug.replace(/-\d+$/, "")))
  .sort((a, b) => b.termo.length - a.termo.length);   // "Média Móvel Exponencial" antes de "Média Móvel"

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Termo inteiro (não pega "Candle" dentro de "Candlesticks"), sem diferenciar maiúsculas
const PADRAO = new RegExp(`(?<![\\p{L}\\p{N}])(${DICAS.map((t) => escapar(t.termo)).join("|")})(?![\\p{L}\\p{N}])`, "giu");
const PORTERMO = new Map(DICAS.map((t) => [t.termo.toLocaleLowerCase("pt-BR"), t]));
// Dentro destas tags o texto não ganha dica: títulos, links, tabelas, código, botões
const PULAR = /^(a|h[1-6]|table|code|pre|button|figure|figcaption)$/;

// Aplica nos blocos de texto comum ("html"); blocos especiais (Na prática, aviso, selos…) e o FAQ ficam de fora.
export function aplicarGlossario(lista: Bloco[]): Bloco[] {
  const usados = new Set<string>();
  return lista.map((b) => (b.tipo === "html" && usados.size < MAX_DICAS ? { ...b, html: marcar(b.html, usados) } : b));
}

function marcar(html: string, usados: Set<string>): string {
  const pilha: string[] = [];
  return html.split(/(<[^>]+>)/).map((parte) => {
    if (parte.startsWith("<")) {
      const m = parte.match(/^<(\/?)([a-z0-9]+)/i);
      if (m && !/\/>$/.test(parte)) {
        const tag = m[2].toLowerCase();
        if (m[1]) { const i = pilha.lastIndexOf(tag); if (i >= 0) pilha.splice(i); }
        else if (!["br", "img", "hr", "input"].includes(tag)) pilha.push(tag);
      }
      return parte;
    }
    if (!parte.trim() || usados.size >= MAX_DICAS || pilha.some((t) => PULAR.test(t))) return parte;
    return parte.replace(PADRAO, (achado: string) => {
      const t = PORTERMO.get(achado.toLocaleLowerCase("pt-BR"));
      if (!t || usados.has(t.slug) || usados.size >= MAX_DICAS) return achado;
      usados.add(t.slug);
      return `<span class="glossario"><button type="button" class="glossario__termo" aria-expanded="false" aria-controls="gl-${t.slug}" data-termo="${t.slug}">${achado}</button>`
        + `<span class="glossario__dica" id="gl-${t.slug}" hidden><strong>${escHtml(t.termo)}:</strong> ${escHtml(t.definicao)} <a href="/glossario#${t.slug}">Ver no glossário</a></span></span>`;
    });
  }).join("");
}
