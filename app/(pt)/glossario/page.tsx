import type { Metadata } from "next";
import GlossarioLista from "@/components/GlossarioLista";
import JsonLd from "@/components/JsonLd";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { EBOOKS } from "@/lib/ebooks-dados";
import { TERMOS } from "@/lib/glossario";
import { textos } from "@/lib/i18n";
import { SITE } from "@/lib/site";

// Glossário (PORTUGUÊS) → /glossario, indexável e no sitemap: os 100 termos do e-book Glossário (lib/glossario-dados.ts),
// de A a Z, com âncora por termo (as dicas dos artigos levam para cá) e busca na página. JSON-LD DefinedTermSet.
const t = textos("pt");
export const metadata: Metadata = {
  title: t.glossario.seoTitle,
  description: t.glossario.meta,
  alternates: { canonical: "/glossario" },
  openGraph: { title: t.glossario.seoTitle, description: t.glossario.meta, url: "/glossario", type: "website" },
};

export default function Page() {
  const g = t.glossario;
  const ebook = `${EBOOKS.glossario.url}?utm_source=traderbinario&utm_medium=glossario&utm_campaign=glossario`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: g.titulo,
    url: `${SITE}/glossario`,
    hasDefinedTerm: TERMOS.map((x) => ({ "@type": "DefinedTerm", name: x.termo, description: x.definicao, url: `${SITE}/glossario#${x.slug}` })),
  };
  return (
    <>
      <Topo idioma="pt" atual="/glossario" />
      <JsonLd dados={jsonLd} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo glossario-pagina">
          <Trilha idioma="pt" atual={g.titulo} />
          <span className="rotulo rotulo--ciano">{g.rotulo}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={g.titulo} destaque={g.destaque} />
          <p className="apoio">{g.apoio}</p>
          <p className="ferramenta__links">{g.ebookTexto} <a href={ebook} target="_blank" rel="noopener">{g.ebookLink}<span className="sr-only"> {t.novaAba}</span></a>.</p>
          <GlossarioLista termos={TERMOS} rotuloBusca={g.busca} nenhum={g.nenhum} rotuloLetras={g.menu} />
        </div>
      </main>
    </>
  );
}
