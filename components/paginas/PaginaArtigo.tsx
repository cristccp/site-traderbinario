import Image from "next/image";
import { notFound } from "next/navigation";
import { CaixaAutor, LinhaAutor } from "@/components/Autor";
import ContinueLendo from "@/components/ContinueLendo";
import Corpo from "@/components/Corpo";
import Indice from "@/components/Indice";
import JsonLd from "@/components/JsonLd";
import LateralArtigo from "@/components/LateralArtigo";
import Perguntas from "@/components/Perguntas";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar, caminho, idiomasDisponiveis } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { jsonLdArtigo, jsonLdFaq, jsonLdTrilha } from "@/lib/seo";

// MODELO DE ARTIGO (/blog/<slug>): trilha, título com destaque, autor, capa, índice, texto, FAQ (se houver),
// aviso de risco, caixa do autor, lateral fixa e "Continue lendo".
export default function PaginaArtigo({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const c = buscar("artigo", slug, idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const idiomas = idiomasDisponiveis("artigo", slug);
  const caminhos = Object.fromEntries(idiomas.map((i) => [i, caminho("artigo", slug, i)]));
  const indice = c.faq?.length ? [...c.indice, { id: "perguntas-frequentes", texto: t.artigo.faq }] : c.indice;

  return (
    <>
      <Topo idioma={idioma} atual={c.categoria?.href} idiomas={idiomas} caminhos={caminhos} />
      <JsonLd dados={jsonLdArtigo(c)} />
      <JsonLd dados={jsonLdTrilha(c, idioma)} />
      <JsonLd dados={jsonLdFaq(c)} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo">
          <Trilha idioma={idioma} categoria={c.categoria} atual={c.trilha ?? c.titulo} />
          <span className="rotulo rotulo--ciano">{(c.categoria?.nome ?? "").toUpperCase()} · {c.minutos} {t.artigo.minLeitura}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          <LinhaAutor idioma={idioma} atualizadoEm={c.atualizadoEm} />
        </div>

        <div className="wrap colunas">
          <article className="colunas__texto">
            {c.capa ? (
              <Image className="capa" src={c.capa.src} alt={c.capa.alt} width={c.capa.largura} height={c.capa.altura}
                sizes="(min-width: 64rem) 760px, 100vw" priority />
            ) : (
              <div className="capa capa--falta">{t.artigo.capaFalta}</div>
            )}
            <Indice titulo={t.artigo.neste} itens={indice} />
            <Corpo blocos={c.blocos} idioma={idioma} pagina={slug} />
            <Perguntas titulo={t.artigo.faq} itens={c.faq} />
            <p className="aviso-fim">{t.artigo.risco}</p>
            <CaixaAutor idioma={idioma} />
          </article>
          <LateralArtigo idioma={idioma} pagina={slug} />
        </div>
      </main>
      <ContinueLendo idioma={idioma} itens={c.relacionados} />
    </>
  );
}
