import { TERMOS, type Termo } from "@/lib/glossario-dados";
import { TERMOS_EN, TERMOS_ES } from "@/lib/glossario-dados-idiomas";
import { textos } from "@/lib/i18n";
import { LANG_HTML, type Idioma } from "@/lib/i18n/tipos";
import type { Bloco } from "@/lib/markdown";
import { FIXAS } from "@/lib/rotas-idiomas";

// Glossário: os 100 termos do e-book (lib/glossario-dados.ts, gerado) + as dicas dentro dos artigos.
// EN/ES: lib/glossario-dados-idiomas.ts (gerado do arquivo aprovado, mesma numeração).
// Dica = botão no termo (1ª ocorrência, máx. 8 por artigo) que abre a definição (components/GlossarioDicas.tsx).
export { TERMOS, type Termo };
export const TERMOS_POR_IDIOMA: Record<Idioma, Termo[]> = { pt: TERMOS, en: TERMOS_EN, es: TERMOS_ES };

export const MAX_DICAS = 8;
// Nas dicas do texto ficam de fora os termos genéricos demais (continuam na página do glossário).
// A regra é a do PT; nos outros idiomas valem os MESMOS números de termo.
const CAPITULOS_FORA = new Set(["Consistência e evolução", "Mentalidade final"]);
const GENERICOS = new Set(["trader", "ativo", "ordem", "grafico", "indicador", "processo", "emocional", "disciplina", "paciencia", "ansiedade", "resultado"]);
const NUMEROS_DICA = new Set(TERMOS.filter((t) => !CAPITULOS_FORA.has(t.capitulo) && !GENERICOS.has(t.slug.replace(/-\d+$/, ""))).map((t) => t.numero));

// Falsos amigos por idioma: número do termo → texto logo ANTES que impede a dica (EN: "a lot of" não é o termo "Lot").
const FALSO_ANTES: Partial<Record<Idioma, Record<number, RegExp>>> = { en: { 8: /\ba\s+$/i } };

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Dicas = { padrao: RegExp; porTermo: Map<string, Termo>; locale: string; href: string; ver: string; falso: Record<number, RegExp> };
const DICAS = {} as Record<Idioma, Dicas>;
function dicas(idioma: Idioma): Dicas {
  if (DICAS[idioma]) return DICAS[idioma];
  const lista = TERMOS_POR_IDIOMA[idioma].filter((t) => NUMEROS_DICA.has(t.numero))
    .sort((a, b) => b.termo.length - a.termo.length);   // "Média Móvel Exponencial" antes de "Média Móvel"
  const locale = LANG_HTML[idioma];
  return (DICAS[idioma] = {
    // Termo inteiro (não pega "Candle" dentro de "Candlesticks"), sem diferenciar maiúsculas
    padrao: new RegExp(`(?<![\\p{L}\\p{N}])(${lista.map((t) => escapar(t.termo)).join("|")})(?![\\p{L}\\p{N}])`, "giu"),
    porTermo: new Map(lista.map((t) => [t.termo.toLocaleLowerCase(locale), t])),
    locale,
    href: FIXAS.glossario[idioma],
    ver: textos(idioma).glossario.ver,
    falso: FALSO_ANTES[idioma] ?? {},
  });
}
// Dentro destas tags o texto não ganha dica: títulos, links, tabelas, código, botões
const PULAR = /^(a|h[1-6]|table|code|pre|button|figure|figcaption)$/;

// Aplica nos blocos de texto comum ("html"); blocos especiais (Na prática, aviso, selos…) e o FAQ ficam de fora.
export function aplicarGlossario(lista: Bloco[], idioma: Idioma = "pt"): Bloco[] {
  const usados = new Set<string>();
  const d = dicas(idioma);
  return lista.map((b) => (b.tipo === "html" && usados.size < MAX_DICAS ? { ...b, html: marcar(b.html, usados, d) } : b));
}

function marcar(html: string, usados: Set<string>, d: Dicas): string {
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
    return parte.replace(d.padrao, (achado: string, _g: string, pos: number, texto: string) => {
      const t = d.porTermo.get(achado.toLocaleLowerCase(d.locale));
      if (!t || usados.has(t.slug) || usados.size >= MAX_DICAS) return achado;
      if (d.falso[t.numero]?.test(texto.slice(0, pos))) return achado;
      usados.add(t.slug);
      return `<span class="glossario"><button type="button" class="glossario__termo" aria-expanded="false" aria-controls="gl-${t.slug}" data-termo="${t.slug}">${achado}</button>`
        + `<span class="glossario__dica" id="gl-${t.slug}" hidden><strong>${escHtml(t.termo)}:</strong> ${escHtml(t.definicao)} <a href="${d.href}#${t.slug}">${d.ver}</a></span></span>`;
    });
  }).join("");
}
