import { buscar, caminho, listar } from "@/lib/conteudo";
import { SITE } from "@/lib/site";

// /llms.txt (gerado no build): o resumo do blog para assistentes de IA — o que é, a regra de risco,
// os guias, as categorias, as ferramentas e o glossário, com o endereço de cada um.
export const dynamic = "force-static";

export function GET() {
  const home = buscar("pagina", "home", "pt");
  const guiasHome = ((home?.extra.guias as { itens?: { titulo: string; texto: string; href: string }[] })?.itens ?? []);
  const guias = listar({ tipo: "guia", idioma: "pt" });
  const categorias = ["opcoes-binarias", "robos-traders", "forex", "metatrader", "gestao-de-risco", "corretoras"]
    .map((s) => buscar("categoria", s, "pt")).filter((c) => c !== null);
  const abs = (p: string) => (p.startsWith("http") ? p : SITE + p);
  const vistos = new Set<string>();
  const linhaGuia = (titulo: string, href: string, frase?: string) => {
    if (vistos.has(href)) return null;
    vistos.add(href);
    return `- [${titulo}](${abs(href)})${frase ? `: ${frase}` : ""}`;
  };

  const texto = [
    "# Trader Binário",
    "",
    `> ${home?.seo.description ?? "Blog de opções binárias, forex, robôs traders e MetaTrader com gestão de risco."}`,
    "",
    "Autor: Cristiano Pereira, trader desde 2017 (https://cristianopereira.com.br).",
    "",
    "Risco: opções binárias, forex e CFDs envolvem alto risco de perda; o conteúdo é educativo, não promete ganho e não é recomendação de investimento.",
    "",
    "## Guias",
    ...guiasHome.map((g) => linhaGuia(g.titulo, g.href, g.texto)),
    ...guias.map((g) => linhaGuia(g.titulo, caminho("guia", g.slug, "pt"), g.seo.description)),
    "",
    "## Categorias",
    ...categorias.map((c) => `- [${String(c.extra.nome)}](${abs(caminho("categoria", c.slug, "pt"))}): ${String(c.extra.chamada ?? c.seo.description)}`),
    "",
    "## Ferramentas e referência",
    `- [Ferramentas de gestão de risco](${abs("/ferramentas")}): calculadora de risco por operação e de acertos para empatar (sem projeção de ganho).`,
    `- [Glossário de day trade](${abs("/glossario")}): 100 termos técnicos de A a Z.`,
    "",
  ].filter((l) => l !== null).join("\n");

  return new Response(texto, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
