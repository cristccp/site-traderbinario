import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatarData } from "@/components/Autor";
import BoxDeriv from "@/components/BoxDeriv";
import LinkCorretora from "@/components/LinkCorretora";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import { buscar, caminho, idiomasDisponiveis, listar } from "@/lib/conteudo";
import { CORRETORAS } from "@/lib/corretoras";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Campos próprios da home (content/paginas/home.<idioma>.md)
type Guia = { titulo: string; texto: string; href: string; rotulo?: string; principal?: boolean };
type Recente = { titulo: string; href: string; data?: string | null; categoria?: string; resumo?: string; minutos?: number; capa?: { src: string; alt: string } };
type Home = {
  rotulo: string;
  apoio: string[];
  botoes: { principal: { texto: string; href: string }; secundario: { texto: string; href: string } };
  guias: { titulo: string; destaque: string; itens: Guia[] };
  corretoras: { titulo: string; destaque: string; itens: string[]; verTodas: { texto: string; href: string } };
  recentes: { titulo: string; destaque: string; itens: Recente[] };
};

// **negrito** dos textos de apoio da cópia → <strong>
const negrito = (s: string) => s.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p));

// MODELO DA HOME: título + apoio da cópia, box da Deriv, guias, outras corretoras (com aviso), artigos recentes e plataformas.
export default function PaginaHome({ idioma }: { idioma: Idioma }) {
  const c = buscar("pagina", "home", idioma);
  if (!c) notFound();
  const t = textos(idioma);
  const h = c.extra as unknown as Home;
  const idiomas = idiomasDisponiveis("pagina", "home");
  const caminhos = Object.fromEntries(idiomas.map((i) => [i, caminho("pagina", "home", i)]));

  // Artigos já migrados (com capa e tempo de leitura) primeiro; depois os recentes da cópia que ainda vão migrar.
  const migrados: Recente[] = listar({ tipo: "artigo", idioma }).map((a) => ({
    titulo: a.titulo, href: caminho("artigo", a.slug, idioma), data: a.atualizadoEm, categoria: a.categoria?.nome,
    resumo: a.resumo, minutos: a.minutos, capa: a.capa,
  }));
  const recentes = [...migrados, ...h.recentes.itens.filter((r) => !migrados.some((m) => m.href === r.href))];

  return (
    <>
      <Topo idioma={idioma} idiomas={idiomas} caminhos={caminhos} />
      <main id="conteudo">
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

        <section className="wrap corretoras" aria-labelledby="titulo-corretoras">
          <h2 id="titulo-corretoras" className="titulo titulo--h3">{partes(h.corretoras.titulo, h.corretoras.destaque)}</h2>
          <ul className="corretoras__lista">
            {h.corretoras.itens.map((id) => {
              const k = CORRETORAS[id];
              return (
                <li key={id} className="cartao corretora">
                  <Image className="corretora__logo" src={k.logo} alt={t.analise.logoAlt + " " + k.nome} width={40} height={40} />
                  <span className="corretora__nome">{k.nome}</span>
                  <span className="corretora__acoes">
                    <Link prefetch={false} href={k.analise}>{t.corretoras.analise}</Link>
                    <LinkCorretora id={id} href={k.cadastro} className="corretora__cadastro" novaAba={t.novaAba}>{t.corretoras.cadastro}</LinkCorretora>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="aviso-curto corretoras__aviso">{t.corretoras.aviso}</p>
          <Link prefetch={false} className="corretoras__todas" href={h.corretoras.verTodas.href}>{h.corretoras.verTodas.texto} →</Link>
        </section>

        <section className="secao-linha">
          <div className="wrap recentes">
            <div className="recentes__lista">
              <h2 className="titulo titulo--h2">{partes(h.recentes.titulo, h.recentes.destaque)}</h2>
              {recentes.map((r) => (
                <article key={r.href} className="recente">
                  {r.capa ? (
                    <Image className="recente__capa" src={r.capa.src} alt={r.capa.alt} width={220} height={124} sizes="220px" />
                  ) : (
                    <div className="recente__capa recente__capa--falta">{t.home.capaFalta}</div>
                  )}
                  <div className="recente__texto">
                    <span className="rotulo">
                      {[r.categoria?.toUpperCase(), r.minutos ? r.minutos + " MIN" : null, r.data ? formatarData(r.data, idioma) : null].filter(Boolean).join(" · ")}
                    </span>
                    <Link prefetch={false} className="recente__titulo" href={r.href}>{r.titulo}</Link>
                    {r.resumo && <p className="recente__resumo">{r.resumo}</p>}
                  </div>
                </article>
              ))}
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
