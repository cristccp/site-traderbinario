import Image from "next/image";
import { notFound } from "next/navigation";
import { CaixaAutor, LinhaAutor } from "@/components/Autor";
import BlocoTelegram from "@/components/BlocoTelegram";
import CaixaEbook from "@/components/CaixaEbook";
import ContinueLendo from "@/components/ContinueLendo";
import Corpo from "@/components/Corpo";
import EmResumo from "@/components/EmResumo";
import GlossarioDicas from "@/components/GlossarioDicas";
import Indice from "@/components/Indice";
import JsonLd from "@/components/JsonLd";
import LateralArtigo from "@/components/LateralArtigo";
import Perguntas from "@/components/Perguntas";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar, equivalentes } from "@/lib/conteudo";
import { escolherEbook } from "@/lib/ebooks";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { jsonLdArtigo, jsonLdFaq, jsonLdTrilha } from "@/lib/seo";

// MODELO DE ARTIGO (/blog/<slug>): trilha, título com destaque, autor, capa, índice, texto, FAQ (se houver),
// aviso de risco, caixa do autor, lateral fixa e "Continue lendo". + "Em 30 segundos" (se houver), e-book recomendado
// (no meio do texto e compacto antes do FAQ) e as dicas do glossário.
// EN/ES: sem e-book (só PT) → Telegram compacto antes do FAQ e completo no fim; sem tutor (RaizSite).
export default function PaginaArtigo({ idioma, slug, tipo = "artigo" }: { idioma: Idioma; slug: string; tipo?: "artigo" | "guia" }) {
  const c = buscar(tipo, slug, idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const indice = c.faq?.length ? [...c.indice, { id: "perguntas-frequentes", texto: t.artigo.faq }] : c.indice;
  const ebook = idioma === "pt" ? escolherEbook(c) : null;

  return (
    <>
      <Topo idioma={idioma} atual={c.categoria?.href} caminhos={equivalentes(c)} />
      <JsonLd dados={jsonLdArtigo(c)} />
      <JsonLd dados={jsonLdTrilha(c, idioma)} />
      <JsonLd dados={jsonLdFaq(c)} />
      <main id="conteudo" data-tutor="pagina">
        <div className="wrap cabeca-artigo">
          <Trilha idioma={idioma} categoria={c.categoria} atual={c.trilha ?? c.titulo} />
          <span className="rotulo rotulo--ciano">{[c.categoria?.nome.toUpperCase(), `${c.minutos} ${t.artigo.minLeitura}`].filter(Boolean).join(" · ")}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          <LinhaAutor idioma={idioma} atualizadoEm={c.atualizadoEm} />
          <EmResumo itens={c.emResumo} idioma={idioma} />
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
            <Corpo blocos={c.blocos} idioma={idioma} pagina={slug} ebook={ebook ?? undefined} />
            {ebook ? <CaixaEbook ebook={ebook} idioma={idioma} pagina={slug} local="fim" /> : <BlocoTelegram idioma={idioma} compacto />}
            <Perguntas titulo={t.artigo.faq} itens={c.faq} />
            <p className="aviso-fim">{t.artigo.risco}</p>
            {idioma !== "pt" && <BlocoTelegram idioma={idioma} />}
            <CaixaAutor idioma={idioma} />
          </article>
          <LateralArtigo idioma={idioma} pagina={slug} />
        </div>
      </main>
      <ContinueLendo idioma={idioma} itens={c.relacionados} />
      <GlossarioDicas />
    </>
  );
}
