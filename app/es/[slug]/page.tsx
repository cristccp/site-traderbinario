import type { Metadata } from "next";
import PaginaAnalise from "@/components/paginas/PaginaAnalise";
import PaginaArtigo from "@/components/paginas/PaginaArtigo";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Páginas da raiz: análises de corretora (modelo de análise) e guias/páginas fixas (modelo de artigo).
// Páginas da raiz (ESPANHOL) → /es/<slug>: hoje as análises de corretora (/analise-corretora-…); depois, as páginas-guia.
// URLs IGUAIS às da Builderall. Só as publicadas no idioma viram página (o resto dá 404).
export const dynamicParams = false;
export function generateStaticParams() {
  return [...listar({ tipo: "analise", idioma: "es" }), ...listar({ tipo: "guia", idioma: "es" })].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/es/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("analise", slug, "es") ?? buscar("guia", slug, "es");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/es/[slug]">) {
  const { slug } = await params;
  return buscar("analise", slug, "es") ? <PaginaAnalise idioma="es" slug={slug} /> : <PaginaArtigo idioma="es" slug={slug} tipo="guia" />;
}
