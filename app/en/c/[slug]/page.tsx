import type { Metadata } from "next";
import PaginaCategoria from "@/components/paginas/PaginaCategoria";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Categorias (INGLÊS) → /en/c/<slug> (29/10/2026), mesmo modelo do PT, ligadas ao PT pelo "original".
// Com menos de 3 artigos/guias no idioma: noindex, follow e fora do sitemap (lib/conteudo.ts → indexavel).
export const dynamicParams = false;
export function generateStaticParams() {
  return listar({ tipo: "categoria", idioma: "en" }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/en/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("categoria", slug, "en");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/en/c/[slug]">) {
  const { slug } = await params;
  return <PaginaCategoria idioma="en" slug={slug} />;
}
