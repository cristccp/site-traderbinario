import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatarData } from "@/components/Autor";
import CardsCorretoras from "@/components/CardsCorretoras";
import JsonLd from "@/components/JsonLd";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar, caminho, daCategoria, idiomasDisponiveis } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { jsonLdTrilha } from "@/lib/seo";

// Campos próprios da categoria (content/categorias/<slug>.<idioma>.md)
type Categoria = { nome: string; guia?: { titulo: string; texto: string; href: string }; ordem?: string[] };

// MODELO DE CATEGORIA (/c/<slug>, mesmas URLs da Builderall): título, apoio, guia do tema, corretoras analisadas
// (só quando a categoria tem análises) e a lista de textos da categoria, com a lateral de plataformas da home.
export default function PaginaCategoria({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const c = buscar("categoria", slug, idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const k = c.extra as unknown as Categoria;
  const idiomas = idiomasDisponiveis("categoria", slug);
  const caminhos = Object.fromEntries(idiomas.map((i) => [i, caminho("categoria", slug, i)]));
  const aqui = caminho("categoria", slug, idioma);

  const paginas = daCategoria(k.nome, idioma);
  const posicao = (id: string) => { const i = k.ordem?.indexOf(id) ?? -1; return i < 0 ? 999 : i; };
  const corretoras = paginas.filter((p) => p.tipo === "analise" && p.corretora?.id).map((p) => p.corretora!.id!)
    .sort((a, b) => posicao(a) - posicao(b));
  const lista = paginas.filter((p) => p.tipo !== "analise" && caminho(p.tipo, p.slug, idioma) !== k.guia?.href);

  return (
    <>
      <Topo idioma={idioma} atual={aqui} idiomas={idiomas} caminhos={caminhos} />
      <JsonLd dados={jsonLdTrilha(c, idioma)} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo">
          <Trilha idioma={idioma} atual={c.trilha ?? k.nome} />
          <span className="rotulo rotulo--ciano">{t.categoria.rotulo} · {paginas.length} {t.categoria.quantos}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          {c.resumo && <p className="apoio">{c.resumo}</p>}
        </div>

        {k.guia && (
          <section className="wrap guias">
            <Link prefetch={false} className="cartao guia guia--principal" href={k.guia.href}>
              <span className="rotulo">{t.categoria.guia}</span>
              <span className="guia__titulo">{k.guia.titulo}</span>
              <span className="guia__texto">{k.guia.texto}</span>
            </Link>
          </section>
        )}

        {corretoras.length > 0 && (
          <section className="wrap corretoras" aria-labelledby="titulo-corretoras">
            <h2 id="titulo-corretoras" className="titulo titulo--h3">{t.categoria.corretoras}</h2>
            <CardsCorretoras ids={corretoras} idioma={idioma} pagina={`c-${slug}`} />
          </section>
        )}

        {lista.length > 0 && (
          <section className="secao-linha">
            <div className="wrap recentes">
              <div className="recentes__lista">
                <h2 className="titulo titulo--h2">{t.categoria.textos}</h2>
                {lista.map((p) => (
                  <article key={p.slug} className="recente">
                    {p.capa ? (
                      <Image className="recente__capa" src={p.capa.src} alt={p.capa.alt} width={220} height={124} sizes="220px" />
                    ) : (
                      <div className="recente__capa recente__capa--falta">{t.home.capaFalta}</div>
                    )}
                    <div className="recente__texto">
                      <span className="rotulo">
                        {[p.minutos ? p.minutos + " MIN" : null, p.atualizadoEm ? formatarData(p.atualizadoEm, idioma) : null].filter(Boolean).join(" · ")}
                      </span>
                      <Link prefetch={false} className="recente__titulo" href={caminho(p.tipo, p.slug, idioma)}>{p.titulo}</Link>
                      <p className="recente__resumo">{p.resumo ?? p.seo.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="plataformas" aria-label={t.home.asideAria}>
                {t.lateral.cards.map((card) => (
                  <div key={card.titulo} className="cartao plataforma">
                    <span className="rotulo rotulo--ciano">{card.rotulo}</span>
                    <span className="plataforma__titulo">{card.titulo}</span>
                    <span className="plataforma__texto">{card.texto}</span>
                    <a className="plataforma__acao" href={card.href} target="_blank" rel="noopener noreferrer">{card.acao}<span className="sr-only"> {t.novaAba}</span></a>
                  </div>
                ))}
              </aside>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
