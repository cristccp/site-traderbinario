import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaixaAutor, formatarData } from "@/components/Autor";
import Corpo from "@/components/Corpo";
import Indice from "@/components/Indice";
import JsonLd from "@/components/JsonLd";
import LinkCorretora from "@/components/LinkCorretora";
import LinkDeriv from "@/components/LinkDeriv";
import Perguntas from "@/components/Perguntas";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar, caminho, idiomasDisponiveis } from "@/lib/conteudo";
import { CORRETORAS } from "@/lib/corretoras";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { jsonLdArtigo, jsonLdFaq, jsonLdTrilha } from "@/lib/seo";

// MODELO DE ANÁLISE DE CORRETORA (/analise-corretora-<nome>): ficha (só dados confirmados), prós e contras,
// capa no topo do texto (a mesma do og:image), texto completo com índice, FAQ, lateral "Outras corretoras" e aviso de risco.
// Botão da ficha: Deriv (lib/deriv.ts) quando a corretora é a Deriv ou `corretora.cadastro: deriv` (ex.: Binary.com, incorporada);
// senão o link de lib/corretoras.ts (LinkCorretora, broker_click). Sem link confirmado → sem botão.
export default function PaginaAnalise({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const c = buscar("analise", slug, idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const idiomas = idiomasDisponiveis("analise", slug);
  const caminhos = Object.fromEntries(idiomas.map((i) => [i, caminho("analise", slug, i)]));
  const indice = c.faq?.length ? [...c.indice, { id: "perguntas-frequentes", texto: t.artigo.faq }] : c.indice;
  const ehDeriv = slug === "analise-corretora-deriv";
  const viaDeriv = ehDeriv || c.corretora?.cadastro === "deriv";
  const outra = c.corretora?.id ? CORRETORAS[c.corretora.id] : undefined;

  return (
    <>
      <Topo idioma={idioma} atual={c.categoria?.href} idiomas={idiomas} caminhos={caminhos} />
      <JsonLd dados={jsonLdArtigo(c)} />
      <JsonLd dados={jsonLdTrilha(c, idioma)} />
      <JsonLd dados={jsonLdFaq(c)} />
      <main id="conteudo">
        <section className="wrap cabeca-analise">
          <Trilha idioma={idioma} categoria={c.categoria} atual={c.trilha ?? c.titulo} />
          <div className="cabeca-analise__linha">
            <div className="cabeca-analise__texto">
              <span className="rotulo rotulo--ciano">{t.analise.rotulo}{c.corretora?.rotulo ? " · " + c.corretora.rotulo.toUpperCase() : ""}</span>
              <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
              {c.corretora?.nota && <p className="nota-corretora" role="note">{c.corretora.nota}</p>}
              {c.resumo && <p className="apoio">{c.resumo}</p>}
              <span className="meta">{t.autor.por} {t.autor.nome}{c.atualizadoEm ? " · " + t.autor.atualizado + " " + formatarData(c.atualizadoEm, idioma) : ""}</span>
            </div>

            {c.corretora && (
              <div className="ficha cartao cartao--brilho">
                <div className="ficha__marca">
                  {c.corretora.logo ? (
                    <Image className="ficha__logo" src={c.corretora.logo} alt={t.analise.logoAlt + " " + c.corretora.nome} width={56} height={56} />
                  ) : (
                    <span className="ficha__logo ficha__logo--letra" aria-hidden="true">{c.corretora.nome.charAt(0)}</span>
                  )}
                  <div>
                    <div className="ficha__nome">{c.corretora.nome}</div>
                    <div className="ficha__linha">{c.corretora.linha}</div>
                  </div>
                </div>
                <dl className="ficha__dados">
                  {c.ficha?.map((f) => (
                    <div key={f.rotulo} className="ficha__dado"><dt>{f.rotulo}</dt><dd>{f.valor}</dd></div>
                  ))}
                </dl>
                {viaDeriv ? (
                  <LinkDeriv local="ficha" pagina={slug} className="botao" novaAba={t.novaAba}>{t.deriv.fichaBotao}</LinkDeriv>
                ) : outra?.cadastro ? (
                  <LinkCorretora id={outra.id} href={outra.cadastro} className="botao" novaAba={t.novaAba}>{t.corretoras.cadastro} na {c.corretora.nome}</LinkCorretora>
                ) : null}
                <span className="aviso-curto">{ehDeriv ? t.deriv.fichaRisco : t.corretoras.aviso}</span>
              </div>
            )}
          </div>
        </section>

        {(c.pros?.length || c.contras?.length) ? (
          <section className="wrap pros-contras" aria-label={t.analise.fortes + " / " + t.analise.atencao}>
            <div className="cartao pros-contras__bloco pros-contras__bloco--pros">
              <div className="rotulo">{t.analise.fortes}</div>
              <ul>{c.pros?.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="cartao pros-contras__bloco pros-contras__bloco--contras">
              <div className="rotulo">{t.analise.atencao}</div>
              <ul>{c.contras?.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </section>
        ) : null}

        <div className="secao-linha">
          <div className="wrap colunas">
            <article className="colunas__texto">
              {c.capa && (
                <Image className="capa" src={c.capa.src} alt={c.capa.alt} width={c.capa.largura} height={c.capa.altura}
                  sizes="(min-width: 64rem) 760px, 100vw" />
              )}
              <Indice titulo={t.artigo.neste} itens={indice} />
              <Corpo blocos={c.blocos} idioma={idioma} pagina={slug} />
              <Perguntas titulo={t.artigo.faq} itens={c.faq} />
              <p className="aviso-fim">{t.artigo.risco}</p>
              <CaixaAutor idioma={idioma} />
            </article>
            <aside className="lateral" aria-label={t.analise.outras}>
              <div className="lateral__fixa">
                <span className="rotulo">{t.analise.outras}</span>
                {c.outras?.map((o) => (
                  <Link key={o.href} prefetch={false} className="cartao outra" href={o.href}>
                    <span className="outra__nome">{o.nome}</span><span className="outra__acao">{t.corretoras.analise} →</span>
                  </Link>
                ))}
                <Link prefetch={false} className="outra__todas" href={t.analise.verTodasHref}>{t.analise.verTodas}</Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
