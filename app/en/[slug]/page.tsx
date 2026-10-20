import type { Metadata } from "next";
import PaginaAnalise from "@/components/paginas/PaginaAnalise";
import PaginaArtigo from "@/components/paginas/PaginaArtigo";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Páginas da raiz: análises de corretora (modelo de análise) e guias/páginas fixas (modelo de artigo).
// Páginas da raiz (INGLÊS) → /en/<slug>: hoje as análises de corretora (/analise-corretora-…); depois, as páginas-guia.
// URLs IGUAIS às da Builderall. Só as publicadas no idioma viram página (o resto dá 404).
export const dynamicParams = false;
export function generateStaticParams() {
  return [...listar({ tipo: "analise", idioma: "en" }), ...listar({ tipo: "guia", idioma: "en" })].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/en/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("analise", slug, "en") ?? buscar("guia", slug, "en");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/en/[slug]">) {
  const { slug } = await params;
  return buscar("analise", slug, "en") ? <PaginaAnalise idioma="en" slug={slug} /> : <PaginaArtigo idioma="en" slug={slug} tipo="guia" />;
}
