import type { Metadata } from "next";
import PaginaCategoria from "@/components/paginas/PaginaCategoria";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Categorias (ESPANHOL) → /es/c/<slug> (29/10/2026), mesmo modelo do PT, ligadas ao PT pelo "original".
// Com menos de 3 artigos/guias no idioma: noindex, follow e fora do sitemap (lib/conteudo.ts → indexavel).
export const dynamicParams = false;
export function generateStaticParams() {
  return listar({ tipo: "categoria", idioma: "es" }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/es/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("categoria", slug, "es");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/es/c/[slug]">) {
  const { slug } = await params;
  return <PaginaCategoria idioma="es" slug={slug} />;
}
