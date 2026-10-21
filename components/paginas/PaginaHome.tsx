import Link from "next/link";
import { notFound } from "next/navigation";
import BlocoTelegram from "@/components/BlocoTelegram";
import BoxDeriv from "@/components/BoxDeriv";
import CardConteudo from "@/components/CardConteudo";
import CardsCorretoras from "@/components/CardsCorretoras";
import { ICONES_TEMA } from "@/components/Icones";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import { buscar, caminho, daCategoria, equivalentes, recentes as maisRecentes } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { FIXAS } from "@/lib/rotas-idiomas";

// Campos próprios da home (content/paginas/home.<idioma>.md)
type Guia = { titulo: string; texto: string; href: string; rotulo?: string; principal?: boolean };
type Home = {
  rotulo: string;
  apoio: string[];
  botoes: { principal: { texto: string; href: string }; secundario: { texto: string; href: string } };
  guias: { titulo: string; destaque: string; itens: Guia[] };
  corretoras: { titulo: string; destaque: string; itens: string[]; verTodas: { texto: string; href: string } };
  recentes: { titulo: string; destaque: string };
};
// Home EN/ES (copy aprovada 21/10/2026, seção 4): 3 cards de artigo + ferramentas + glossário + Telegram + box da Deriv.
// Sem temas, sem busca e sem "outras corretoras" (categorias e análises só em PT).
type Card = { titulo: string; texto: string; acao: string };
type HomeIdioma = Omit<Home, "guias" | "corretoras" | "recentes"> & {
  artigos: { titulo: string; destaque: string; itens: { tipo: "guia" | "artigo"; slug: string; texto: string }[] };
  ferramentas: Card;
  glossario: Card;
};

// Ordem dos temas no box de categorias (mesmos slugs de content/categorias/)
const TEMAS = ["opcoes-binarias", "robos-traders", "forex", "metatrader", "gestao-de-risco", "corretoras"];
const RECENTES = 6;
// "Artigos recentes": ordem de lib/conteudo.ts → recentes() (a mesma do /ultimos.json)

// **negrito** dos textos de apoio da cópia → <strong>
const negrito = (s: string) => s.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));

// MODELO DA HOME: topo (título, apoio, box da Deriv) → temas (6 categorias) → guias → 6 artigos recentes (+ plataformas)
// → outras corretoras com aviso de risco. EN/ES: modelo menor (HomeIdioma).
export default function PaginaHome({ idioma }: { idioma: Idioma }) {
  const c = buscar("pagina", "home", idioma);
  if (!c) notFound();
  if (idioma !== "pt") return <HomeIdioma idioma={idioma} c={c} />;
  const t = textos(idioma);
  const h = c.extra as unknown as Home;
  const caminhos = equivalentes(c);

  const temas = TEMAS.map((slug) => buscar("categoria", slug, idioma)).filter((k) => k !== null).map((k) => {
    const nome = String(k.extra.nome);
    return { slug: k.slug, nome, chamada: String(k.extra.chamada ?? ""), href: caminho("categoria", k.slug, idioma), total: daCategoria(nome, idioma).length };
  });

  const recentes = maisRecentes(idioma, ["artigo"], RECENTES);

  return (
    <>
      <Topo idioma={idioma} caminhos={caminhos} />
      <main id="conteudo">
        <Hero idioma={idioma} c={c} h={h} />

        <section className="wrap temas" aria-labelledby="titulo-temas">
          <h2 id="titulo-temas" className="titulo titulo--h2">{partes(t.temas.titulo, t.temas.destaque)}</h2>
          <ul className="temas__grade">
            {temas.map((k) => {
              const Icone = ICONES_TEMA[k.slug];
              return (
                <li key={k.slug}>
                  <Link prefetch={false} className="cartao tema" href={k.href}>
                    <span className="tema__icone">{Icone ? <Icone /> : null}</span>
                    <span className="tema__nome">{k.nome}</span>
                    <span className="tema__chamada">{k.chamada}</span>
                    <span className="tema__total">{k.total} {t.categoria.quantos}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="wrap guias" id="guias" aria-labelledby="titulo-guias">
          <h2 id="titulo-guias" className="titulo titulo--h2">{partes(h.guias.titulo, h.guias.destaque)}</h2>
          <div className="grade-3">
            {h.guias.itens.map((g) => (
              <Link key={g.href} prefetch={false} className={g.principal ? "cartao guia guia--principal" : "cartao guia"} href={g.href}>
                <span className="rotulo">{g.rotulo ?? "GUIA"}</span>
                <span className="guia__titulo">{g.titulo}</span>
                <span className="guia__texto">{g.texto}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="secao-linha">
          <div className="wrap recentes">
            <div className="recentes__lista">
              <h2 className="titulo titulo--h2">{partes(h.recentes.titulo, h.recentes.destaque)}</h2>
              <div className="grade-cards grade-cards--2">
                {recentes.map((a) => (
                  <CardConteudo key={a.slug} capaFalta={t.home.capaFalta} item={{
                    titulo: a.titulo, href: caminho("artigo", a.slug, idioma), capa: a.capa,
                    rotulo: [a.categoria?.nome.toUpperCase(), a.minutos ? a.minutos + " MIN" : null].filter(Boolean).join(" · "),
                    resumo: a.resumo ?? a.seo.description,
                  }} />
                ))}
              </div>
            </div>

            <aside className="plataformas" aria-label={t.home.asideAria}>
              {/* Os 3 cards do protótipo (Trader Bots Club, Ideal Trade, e-book), mesmos textos da lateral do artigo */}
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

        <section className="wrap corretoras" aria-labelledby="titulo-corretoras">
          <h2 id="titulo-corretoras" className="titulo titulo--h3">{partes(h.corretoras.titulo, h.corretoras.destaque)}</h2>
          <CardsCorretoras ids={h.corretoras.itens} idioma={idioma} pagina="home" />
          <Link prefetch={false} className="corretoras__todas" href={h.corretoras.verTodas.href}>{h.corretoras.verTodas.texto} →</Link>
        </section>
      </main>
    </>
  );
}

function Hero({ idioma, c, h }: { idioma: Idioma; c: NonNullable<ReturnType<typeof buscar>>; h: Pick<Home, "rotulo" | "apoio" | "botoes"> }) {
  return (
    <section className="wrap hero">
      <div className="hero__texto">
        <span className="rotulo rotulo--ciano">{h.rotulo}</span>
        <Titulo nivel="h1" className="titulo titulo--hero" texto={c.titulo} destaque={c.tituloDestaque} />
        {h.apoio.map((p, i) => <p key={i} className={i === 0 ? "apoio" : "apoio apoio--menor"}>{negrito(p)}</p>)}
        <div className="hero__botoes">
          <Link prefetch={false} className="botao" href={h.botoes.principal.href}>{h.botoes.principal.texto}</Link>
          <a className="botao botao--contorno" href={h.botoes.secundario.href}>{h.botoes.secundario.texto}</a>
        </div>
      </div>
      <BoxDeriv idioma={idioma} pagina="home" />
    </section>
  );
}

function HomeIdioma({ idioma, c }: { idioma: Idioma; c: NonNullable<ReturnType<typeof buscar>> }) {
  const t = textos(idioma);
  const h = c.extra as unknown as HomeIdioma;
  const artigos = h.artigos.itens.map((it) => {
    const a = buscar(it.tipo, it.slug, idioma);
    if (!a) throw new Error(`Home ${idioma}: artigo não publicado ${it.tipo}/${it.slug}`);
    return { a, texto: it.texto };
  });
  const blocos = [{ ...h.ferramentas, href: FIXAS.ferramentas[idioma] }, { ...h.glossario, href: FIXAS.glossario[idioma] }];
  return (
    <>
      <Topo idioma={idioma} caminhos={equivalentes(c)} />
      <main id="conteudo">
        <Hero idioma={idioma} c={c} h={h} />

        <section className="wrap guias" aria-labelledby="titulo-artigos">
          <h2 id="titulo-artigos" className="titulo titulo--h2">{partes(h.artigos.titulo, h.artigos.destaque)}</h2>
          <div className="grade-3">
            {artigos.map(({ a, texto }) => (
              <CardConteudo key={a.slug} capaFalta={t.home.capaFalta} item={{
                titulo: a.titulo, href: caminho(a.tipo, a.slug, idioma), capa: a.capa,
                rotulo: `${a.minutos} ${t.artigo.minLeitura}`, resumo: texto,
              }} />
            ))}
          </div>
        </section>

        <section className="wrap guias">
          <div className="grade-3 grade-3--2">
            {blocos.map((b) => (
              <Link key={b.href} prefetch={false} className="cartao guia" href={b.href}>
                <span className="guia__titulo">{b.titulo}</span>
                <span className="guia__texto">{b.texto}</span>
                <span className="guia__acao">{b.acao}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="wrap">
          <BlocoTelegram idioma={idioma} />
        </div>
      </main>
    </>
  );
}

// "Os guias para começar" + "guias" → Os <em>guias</em> para começar
function partes(texto: string, destaque: string) {
  const i = texto.toLowerCase().indexOf(destaque.toLowerCase());
  if (i < 0) return texto;
  return <>{texto.slice(0, i)}<em>{texto.slice(i, i + destaque.length)}</em>{texto.slice(i + destaque.length)}</>;
}
