import type { Metadata } from "next";
import PaginaAnalise from "@/components/paginas/PaginaAnalise";
import PaginaArtigo from "@/components/paginas/PaginaArtigo";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Páginas da raiz: análises de corretora (modelo de análise) e guias/páginas fixas (modelo de artigo).
// Páginas da raiz (PORTUGUÊS) → /<slug>: hoje as análises de corretora (/analise-corretora-…); depois, as páginas-guia.
// URLs IGUAIS às da Builderall. Só as publicadas no idioma viram página (o resto dá 404).
export const dynamicParams = false;
export function generateStaticParams() {
  return [...listar({ tipo: "analise", idioma: "pt" }), ...listar({ tipo: "guia", idioma: "pt" })].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("analise", slug, "pt") ?? buscar("guia", slug, "pt");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  return buscar("analise", slug, "pt") ? <PaginaAnalise idioma="pt" slug={slug} /> : <PaginaArtigo idioma="pt" slug={slug} tipo="guia" />;
}
