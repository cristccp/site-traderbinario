import { listar, type Conteudo } from "@/lib/conteudo";
import { EBOOKS, type Ebook, type EbookId } from "@/lib/ebooks-dados";

// E-book recomendado em cada artigo/guia (caixa no meio do texto e versão compacta antes do FAQ).
// Ordem: campo `ebook` no frontmatter → palavra do título/endereço → categoria. Nunca em análise de corretora.
// Os dados (nome, linha, capa, URL de captura) vêm do site principal: lib/ebooks-dados.ts (gerado).
export { EBOOKS, type Ebook, type EbookId };

const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const TECNICO = /\b(suporte|resistencia|pullback|fibonacci|medias?|moveis|bollinger|rsi|macd)\b/;
const REGRAS: [RegExp, EbookId][] = [
  [/candle/, "candlesticks"],
  [/boom|crash|sintetic/, "boom-crash"],
  [/glossario|termos|iniciante/, "glossario"],
  [/impulso|psicologia|emocion/, "quebram-banca"],
  [/registr|planilha/, "planilha"],
];
const POR_CATEGORIA: Record<string, EbookId> = {
  "Gestão de risco": "gestao-de-risco",
  "Opções binárias": "quebram-banca",
  Forex: "price-action",
  MetaTrader: "glossario",
  "Robôs traders": "planilha",
  Corretoras: "gestao-de-risco",   // não definido no pedido: proposta (conferir na tabela do relatório)
};

const assunto = (c: Conteudo) => sem(`${c.titulo} ${c.slug.replace(/-/g, " ")}`);

// Artigos de análise técnica alternam entre Price Action e Suporte e Resistência (ordem alfabética dos endereços)
function tecnicos(): string[] {
  return [...listar({ tipo: "artigo", idioma: "pt" }), ...listar({ tipo: "guia", idioma: "pt" })]
    .filter((c) => !/candle/.test(assunto(c)) && TECNICO.test(assunto(c))).map((c) => c.slug).sort();
}

export function escolherEbook(c: Conteudo): Ebook | undefined {
  if (c.tipo !== "artigo" && c.tipo !== "guia") return undefined;
  if (c.ebook && c.ebook in EBOOKS) return EBOOKS[c.ebook as EbookId];
  const a = assunto(c);
  if (/candle/.test(a)) return EBOOKS.candlesticks;
  if (TECNICO.test(a)) return EBOOKS[tecnicos().indexOf(c.slug) % 2 === 1 ? "suporte-resistencia" : "price-action"];
  for (const [re, id] of REGRAS) if (re.test(a)) return EBOOKS[id];
  const id = c.categoria ? POR_CATEGORIA[c.categoria.nome] : undefined;
  return id ? EBOOKS[id] : EBOOKS["gestao-de-risco"];
}

export const urlEbook = (e: Ebook, slug: string) =>
  `${e.url}?utm_source=traderbinario&utm_medium=artigo&utm_campaign=${encodeURIComponent(slug)}`;
