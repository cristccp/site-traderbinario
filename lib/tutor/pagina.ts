import "server-only";
import { buscar, caminho, type Conteudo } from "@/lib/conteudo";
import { escolherEbook } from "@/lib/ebooks";
import type { Bloco } from "@/lib/markdown";

// "Pergunte sobre este artigo": o navegador manda SÓ o caminho da página; o texto sai daqui, de content/ (camada de
// conteúdo), nunca do navegador. Vira o 3º bloco do system em /api/tutor, depois da base em cache.
// Só artigo, guia e análise (home, categorias, busca e ferramentas não têm texto próprio → null).

const MAX_CARACTERES = 12_000;   // ~3 mil tokens: o suficiente para um artigo longo

// Caminho → conteúdo: /blog/<slug> = artigo · /<slug> = guia ou análise
export function conteudoDaPagina(pagina: string | null): Conteudo | null {
  if (!pagina) return null;
  const limpo = pagina.split(/[?#]/)[0].replace(/\/+$/, "");
  const artigo = limpo.match(/^\/blog\/([a-z0-9-]+)$/);
  if (artigo) return buscar("artigo", artigo[1], "pt");
  const raiz = limpo.match(/^\/([a-z0-9-]+)$/);
  if (raiz) return buscar("guia", raiz[1], "pt") ?? buscar("analise", raiz[1], "pt");
  return null;
}

const entidades = (s: string) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")
  .replace(/&gt;/g, ">").replace(/&lt;/g, "<");

// HTML do Markdown → texto simples: títulos viram "## ", links mantêm o endereço, as dicas escondidas do glossário saem
function texto(html: string): string {
  return entidades(html
    .replace(/<span class="glossario__dica"[^>]*>[\s\S]*?<\/span>/g, "")
    .replace(/<h([23])[^>]*>/g, (_, n) => `\n${"#".repeat(Number(n))} `)
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "$2 ($1)")
    .replace(/<li[^>]*>/g, "\n- ")
    .replace(/<\/(p|h[1-6]|li|tr|table|ul|ol|div)>/g, "\n")
    .replace(/<(td|th)[^>]*>/g, " | ")
    .replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
}

function textoDoBloco(b: Bloco): string {
  switch (b.tipo) {
    case "html": case "naPratica": case "aviso": case "selos": return texto(b.html);
    case "sessoes": return b.itens.map((s) => `- ${s.nome} (${s.horario}): ${s.texto}`).join("\n");
    case "calculadora": return `[Calculadora de ${b.modo === "risco" ? "risco por operação" : "acertos para empatar"} — também em /ferramentas]`;
    default: return "";
  }
}

// Bloco de contexto da página (ou null quando a página não tem texto). O conteúdo não muda depois do deploy:
// cada página é montada uma vez por servidor e fica na memória (a rota não relê content/ a cada pergunta).
const memoria = new Map<string, string | null>();
export function contextoDaPagina(pagina: string | null): string | null {
  if (!pagina) return null;
  if (!memoria.has(pagina)) {
    if (memoria.size >= 300) memoria.clear();   // o blog tem ~80 páginas: caminho inventado não enche a memória
    memoria.set(pagina, montar(pagina));
  }
  return memoria.get(pagina) ?? null;
}

function montar(pagina: string): string | null {
  const c = conteudoDaPagina(pagina);
  if (!c) return null;
  const tipo = c.tipo === "analise" ? "análise de corretora" : c.tipo;
  const ebook = escolherEbook(c);
  let corpo = c.blocos.map(textoDoBloco).filter(Boolean).join("\n");
  if (corpo.length > MAX_CARACTERES) corpo = corpo.slice(0, MAX_CARACTERES) + "\n[…texto cortado]";
  return [
    "Página que o leitor está lendo agora (responda primeiro com base nela):",
    `Título: ${c.titulo}`,
    `Endereço: ${caminho(c.tipo, c.slug, "pt")} (${tipo})`,
    ...(ebook ? [`E-book grátis do tema desta página: ${ebook.nome} — ${ebook.url}`] : []),
    "",
    "Texto da página:",
    corpo,
  ].join("\n");
}
