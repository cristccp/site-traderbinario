import type { Metadata } from "next";
import PaginaArtigo from "@/components/paginas/PaginaArtigo";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Artigo (ESPANHOL) → /es/blog/<slug>. Só os artigos publicados no idioma viram página (o resto dá 404).
export const dynamicParams = false;
export function generateStaticParams() {
  return listar({ tipo: "artigo", idioma: "es" }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/es/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("artigo", slug, "es");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/es/blog/[slug]">) {
  const { slug } = await params;
  return <PaginaArtigo idioma="es" slug={slug} />;
}
