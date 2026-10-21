import { caminho, listar, type Conteudo } from "@/lib/conteudo";
import { unicas, type ItemIndice } from "@/lib/busca";

// Índice da busca (/busca-indice.json), gerado no build: artigos, guias e análises em português.
// Corpo e FAQ entram só como raízes de palavras normalizadas (corpo: as que aparecem 2+ vezes) — arquivo leve. Só a página /busca baixa este arquivo.
export const dynamic = "force-static";

const textoDoCorpo = (c: Conteudo) => c.blocos.map((b) => ("html" in b ? b.html : "texto" in b ? b.texto : ""))
  .join(" ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");

export function GET() {
  const tipos = ["artigo", "guia", "analise"] as const;
  const itens: ItemIndice[] = tipos.flatMap((tipo) => listar({ tipo, idioma: "pt" }).map((c) => ({
    t: c.titulo,
    r: c.resumo ?? c.seo.description,
    c: c.categoria?.nome ?? "",
    k: tipo,
    u: caminho(tipo, c.slug, "pt"),
    ...(c.capa ? { capa: { src: c.capa.src, alt: c.capa.alt } } : {}),
    f: unicas((c.faq ?? []).map((q) => q.p + " " + q.r).join(" ")),
    p: unicas(textoDoCorpo(c), 2),
  })));
  return Response.json(itens);
}
