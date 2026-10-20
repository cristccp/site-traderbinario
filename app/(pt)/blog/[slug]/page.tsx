import type { Metadata } from "next";
import PaginaArtigo from "@/components/paginas/PaginaArtigo";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Artigo (PORTUGUÊS) → /blog/<slug>. Só os artigos publicados no idioma viram página (o resto dá 404).
export const dynamicParams = false;
export function generateStaticParams() {
  return listar({ tipo: "artigo", idioma: "pt" }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("artigo", slug, "pt");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return <PaginaArtigo idioma="pt" slug={slug} />;
}
