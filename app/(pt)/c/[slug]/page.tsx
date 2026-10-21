import type { Metadata } from "next";
import PaginaCategoria from "@/components/paginas/PaginaCategoria";
import { buscar, listar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Categorias (PORTUGUÊS) → /c/<slug>, mesmas URLs da Builderall (+ /c/gestao-de-risco, nova).
// As categorias antigas sem página (/c/-dicas, /c/indicadores, /c/deriv, /c/criptomoedas) têm 308 em next.config.ts.
export const dynamicParams = false;
export function generateStaticParams() {
  return listar({ tipo: "categoria", idioma: "pt" }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = buscar("categoria", slug, "pt");
  return c ? metadados(c) : {};
}

export default async function Page({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  return <PaginaCategoria idioma="pt" slug={slug} />;
}
