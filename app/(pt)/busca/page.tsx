import type { Metadata } from "next";
import { Suspense } from "react";
import Busca from "@/components/Busca";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import { buscar } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";

// Busca (PORTUGUÊS) → /busca?q=… — página estática; os resultados saem no navegador (components/Busca.tsx).
// noindex (resultado de busca não vai para o Google) e fora do sitemap.
const t = textos("pt");
export const metadata: Metadata = {
  title: t.busca.titulo,
  description: t.busca.meta,
  robots: { index: false, follow: true },
  alternates: { canonical: "/busca" },
};

export default function Page() {
  const home = buscar("pagina", "home", "pt");
  const guias = ((home?.extra.guias as { itens?: { titulo: string; href: string }[] })?.itens ?? []).map(({ titulo, href }) => ({ titulo, href }));
  return (
    <>
      <Topo idioma="pt" />
      <main id="conteudo">
        <div className="wrap cabeca-artigo busca">
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={t.busca.titulo} destaque={t.busca.destaque} />
          <Suspense fallback={<p className="busca-status">{t.busca.carregando}</p>}>
            <Busca idioma="pt" guias={guias} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
