import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AvisoPais from "@/components/AvisoPais";
import BlocoTelegram from "@/components/BlocoTelegram";
import CardConteudo from "@/components/CardConteudo";
import CardsCorretoras from "@/components/CardsCorretoras";
import JsonLd from "@/components/JsonLd";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import VerMais from "@/components/VerMais";
import { buscar, caminho, daCategoria, equivalentes } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { jsonLdTrilha } from "@/lib/seo";

// Campos próprios da categoria (content/categorias/<slug>.<idioma>.md)
type Categoria = { nome: string; guia?: { titulo: string; texto: string; href: string }; ordem?: string[] };
const VISIVEIS = 12;

// MODELO DE CATEGORIA (/c/<slug>, mesmas URLs da Builderall): título, apoio, guia do tema em destaque (com capa),
// corretoras analisadas (só quando a categoria tem análises) e os textos em grade: 12 visíveis + "Ver mais"
// (todos os links já no HTML). Lateral de plataformas como na home.
// EN/ES (29/10/2026): aviso de país no topo, bloco do Telegram no fim e estado vazio; o PT não muda.
export default function PaginaCategoria({ idioma, slug }: { idioma: Idioma; slug: string }) {
  const c = buscar("categoria", slug, idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const k = c.extra as unknown as Categoria;
  const aqui = caminho("categoria", slug, idioma);
  const traduzida = idioma !== "pt";

  const paginas = daCategoria(k.nome, idioma);
  const posicao = (id: string) => { const i = k.ordem?.indexOf(id) ?? -1; return i < 0 ? 999 : i; };
  const corretoras = paginas.filter((p) => p.tipo === "analise" && p.corretora?.id).map((p) => p.corretora!.id!)
    .sort((a, b) => posicao(a) - posicao(b));
  const lista = paginas.filter((p) => p.tipo !== "analise" && caminho(p.tipo, p.slug, idioma) !== k.guia?.href);
  // O guia do tema pode ser um guia (/slug) ou um artigo (/blog/slug): acha pelo endereço para mostrar a capa
  const guia = k.guia ? (["guia", "artigo"] as const).map((tp) => buscar(tp, k.guia!.href.split("/").pop()!, idioma))
    .find((g) => g && caminho(g.tipo, g.slug, idioma) === k.guia!.href) : undefined;

  return (
    <>
      <Topo idioma={idioma} atual={aqui} caminhos={equivalentes(c)} />
      <JsonLd dados={jsonLdTrilha(c, idioma)} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo">
          <Trilha idioma={idioma} atual={c.trilha ?? k.nome} />
          <span className="rotulo rotulo--ciano">{t.categoria.rotulo} · {paginas.length} {t.categoria.quantos}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          {c.resumo && <p className="apoio">{c.resumo}</p>}
          {traduzida && <AvisoPais idioma={idioma} className="categoria__aviso-pais" />}
        </div>

        {k.guia && (
          <section className="wrap guias">
            <Link prefetch={false} className="cartao guia guia--principal guia--destaque" href={k.guia.href}>
              {guia?.capa && (
                <Image className="guia__capa" src={guia.capa.src} alt="" width={640} height={360} sizes="(min-width: 64rem) 480px, 100vw" />
              )}
              <span className="guia__corpo">
                <span className="rotulo">{t.categoria.guia}</span>
                <span className="guia__titulo">{k.guia.titulo}</span>
                <span className="guia__texto">{k.guia.texto}</span>
              </span>
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
                <VerMais total={lista.length} limite={VISIVEIS} rotulo={t.categoria.verMais}>
                  {lista.map((p) => (
                    <CardConteudo key={p.slug} capaFalta={t.home.capaFalta} item={{
                      titulo: p.titulo, href: caminho(p.tipo, p.slug, idioma), capa: p.capa,
                      rotulo: p.minutos ? `${p.minutos} MIN` : undefined, resumo: p.resumo ?? p.seo.description,
                    }} />
                  ))}
                </VerMais>
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

        {traduzida && (
          <div className="wrap">
            {lista.length === 0 && !k.guia && t.categoria.vazio && <p className="apoio categoria__vazio">{t.categoria.vazio}</p>}
            <BlocoTelegram idioma={idioma} />
          </div>
        )}
      </main>
    </>
  );
}
