import { buscar, caminho, recentes, type Conteudo } from "@/lib/conteudo";
import { IDIOMAS, type Idioma } from "@/lib/i18n/tipos";
import { SITE } from "@/lib/site";

// Últimos artigos do blog para a faixa da home do cristianopereira.com.br (21/10/2026).
// Endereço público: /ultimos.json?idioma=pt|en|es (padrão pt) → rewrite em next.config.ts para /ultimos/<idioma>.
// Gerado no BUILD (um arquivo por idioma), cache de 1 h e X-Robots-Tag: noindex (next.config.ts → headers). Fora do sitemap.
// PT: os 3 artigos/guias mais recentes (mesma ordem da home, reescritos primeiro). EN/ES: os 3 traduzidos, na ordem dos cards da home.
// Só estes campos; URLs absolutas sempre em traderbinario.com.br. Nenhum dado pessoal.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => IDIOMAS.map((idioma) => ({ idioma }));

const N = 3;
const abs = (p: string) => SITE + p;
type CardHome = { tipo: "guia" | "artigo"; slug: string };

function lista(idioma: Idioma): Conteudo[] {
  if (idioma === "pt") return recentes("pt", ["artigo", "guia"], N);
  const home = buscar("pagina", "home", idioma);
  const itens = ((home?.extra.artigos as { itens?: CardHome[] } | undefined)?.itens ?? []);
  return itens.map((it) => buscar(it.tipo, it.slug, idioma)).filter((c): c is Conteudo => c !== null).slice(0, N);
}

export async function GET(_req: Request, { params }: { params: Promise<{ idioma: string }> }) {
  const { idioma } = await params;
  const itens = lista(idioma as Idioma).map((c) => ({
    titulo: c.titulo,
    url: abs(caminho(c.tipo, c.slug, c.idioma)),
    capa: c.capa ? abs(c.capa.src) : null,
    capaAlt: c.capa?.alt ?? null,
    categoria: c.categoria?.nome ?? null,
    data: c.atualizadoEm ?? c.publicadoEm ?? null,
  }));
  return Response.json(itens);
}
