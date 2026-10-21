import Link from "next/link";
import { IconeBusca, IconeInstagram, IconeTelegram, IconeYoutube } from "@/components/Icones";
import LinkTelegram from "@/components/LinkTelegram";
import MenuCelular from "@/components/MenuCelular";
import SeletorIdioma from "@/components/SeletorIdioma";
import TopoRolagem from "@/components/TopoRolagem";
import { PREFIXO } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { REDES } from "@/lib/redes";

// prefetch={false} nos links internos: várias páginas ainda não migraram (o pré-carregamento daria 404 no console).
// Cabeçalho do design aprovado: "Trader Binário" + "POR CRISTIANO PEREIRA", menu, YouTube/Instagram e botão do Telegram.
// Fixo no topo ao rolar, com efeito vidro (TopoRolagem + app/blog.css). No celular o menu vira o botão ☰ (MenuCelular). `atual` = item do menu da seção da página (fica em ciano).
// `idiomas` = idiomas em que ESTA página existe (o seletor só aparece com mais de um) e `caminhos` = endereço em cada um.
export default function Topo({ idioma, atual, idiomas = [idioma], caminhos = {} }:
  { idioma: Idioma; atual?: string; idiomas?: Idioma[]; caminhos?: Partial<Record<Idioma, string>> }) {
  const t = textos(idioma);
  const itens = t.menu.itens;
  return (
    <header className="topo">
      <a className="pular" href="#conteudo">{t.pularParaConteudo}</a>
      <TopoRolagem />
      <div className="topo__wrap">
        <Link className="marca" href={PREFIXO[idioma] || "/"} aria-label={t.marca.aria}>
          <span className="marca__nome">{t.marca.nome} <em>{t.marca.destaque}</em></span>
          <span className="marca__por">{t.marca.por}</span>
        </Link>

        <nav className="topo__nav" aria-label={t.menu.aria}>
          {itens.map((it) =>
            it.externo ? (
              <a key={it.href} className="topo__link topo__link--externo" href={it.href} target="_blank" rel="noopener noreferrer">
                {it.label}<span className="sr-only"> {t.novaAba}</span>
              </a>
            ) : (
              <Link key={it.href} prefetch={false} className="topo__link" href={it.href} aria-current={atual === it.href ? "page" : undefined}>{it.label}</Link>
            ),
          )}
        </nav>

        <div className="topo__acoes">
          {/* Busca: campo no computador (formulário GET, funciona sem JavaScript) e lupa no celular → /busca */}
          <form className="topo__busca" action="/busca" role="search">
            <input type="search" name="q" placeholder={t.busca.campo} aria-label={t.busca.campo} maxLength={80} enterKeyHint="search" />
            <button type="submit" aria-label={t.busca.botao}><IconeBusca /></button>
          </form>
          <Link prefetch={false} className="redondo topo__lupa" href="/busca" aria-label={t.busca.rotulo}><IconeBusca /></Link>
          <SeletorIdioma idioma={idioma} idiomas={idiomas} caminhos={caminhos} />
          <a className="redondo topo__rede" href={REDES.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${t.redes.youtube} ${t.novaAba}`}><IconeYoutube /></a>
          <a className="redondo topo__rede" href={REDES.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${t.redes.instagram} ${t.novaAba}`}><IconeInstagram /></a>
          <LinkTelegram idioma={idioma} className="botao botao--pequeno topo__telegram" novaAba={t.novaAba}>
            <IconeTelegram />{t.telegram}
          </LinkTelegram>
          <MenuCelular idioma={idioma} atual={atual} />
        </div>
      </div>
    </header>
  );
}
