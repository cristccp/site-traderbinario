import type { Metadata } from "next";
import GlossarioLista from "@/components/GlossarioLista";
import JsonLd from "@/components/JsonLd";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { EBOOKS } from "@/lib/ebooks-dados";
import { TERMOS_POR_IDIOMA } from "@/lib/glossario";
import { textos } from "@/lib/i18n";
import { LANG_HTML, type Idioma } from "@/lib/i18n/tipos";
import { FIXAS } from "@/lib/rotas-idiomas";
import { metadadosFixa } from "@/lib/seo";
import { SITE } from "@/lib/site";

// Glossário → /glossario · /en/glossary · /es/glosario, indexável e no sitemap: os 100 termos (PT do e-book; EN/ES do
// arquivo aprovado, lib/glossario-dados-idiomas.ts), de A a Z, com âncora por termo (as dicas dos artigos levam para cá)
// e busca na página. JSON-LD DefinedTermSet. Link do e-book em PDF: só em PT.
export const metadadosGlossario = (idioma: Idioma): Metadata =>
  metadadosFixa(FIXAS.glossario, idioma, textos(idioma).glossario.seoTitle, textos(idioma).glossario.meta);

export default function PaginaGlossario({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma);
  const g = t.glossario;
  const termos = TERMOS_POR_IDIOMA[idioma];
  const url = `${SITE}${FIXAS.glossario[idioma]}`;
  const ebook = `${EBOOKS.glossario.url}?utm_source=traderbinario&utm_medium=glossario&utm_campaign=glossario`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: g.titulo,
    url,
    inLanguage: LANG_HTML[idioma],
    hasDefinedTerm: termos.map((x) => ({ "@type": "DefinedTerm", name: x.termo, description: x.definicao, url: `${url}#${x.slug}` })),
  };
  return (
    <>
      <Topo idioma={idioma} atual={FIXAS.glossario[idioma]} caminhos={FIXAS.glossario} />
      <JsonLd dados={jsonLd} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo glossario-pagina">
          <Trilha idioma={idioma} atual={g.titulo} />
          <span className="rotulo rotulo--ciano">{g.rotulo}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={g.titulo} destaque={g.destaque} />
          <p className="apoio">{g.apoio}</p>
          {g.ebookTexto && g.ebookLink && (
            <p className="ferramenta__links">{g.ebookTexto} <a href={ebook} target="_blank" rel="noopener">{g.ebookLink}<span className="sr-only"> {t.novaAba}</span></a>.</p>
          )}
          <GlossarioLista termos={termos} locale={LANG_HTML[idioma]} rotuloBusca={g.busca} nenhum={g.nenhum} rotuloLetras={g.menu} />
        </div>
      </main>
    </>
  );
}
