"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconeBusca, IconeFechar, IconeInstagram, IconeMenu, IconeTelegram, IconeYoutube } from "@/components/Icones";
import LinkTelegram from "@/components/LinkTelegram";
import SeletorIdioma from "@/components/SeletorIdioma";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { REDES } from "@/lib/redes";

// Menu do celular (até 64rem): botão ☰ que abre um painel com a busca (só PT), o menu, o seletor de idioma, as redes e o Telegram.
// Acessível: aria-expanded/aria-controls, Esc fecha e devolve o foco ao botão, o foco vai para o 1º link ao abrir,
// clicar num link fecha. Sem biblioteca. No computador o botão e o painel nem aparecem (CSS).
export default function MenuCelular({ idioma, atual, caminhos }: { idioma: Idioma; atual?: string; caminhos: Partial<Record<Idioma, string>> }) {
  const t = textos(idioma);
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    painel.current?.querySelector<HTMLElement>("a")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setAberto(false); botao.current?.focus(); }
    };
    document.addEventListener("keydown", tecla);
    document.documentElement.classList.add("menu-aberto");
    return () => {
      document.removeEventListener("keydown", tecla);
      document.documentElement.classList.remove("menu-aberto");
    };
  }, [aberto]);

  const fechar = () => setAberto(false);

  return (
    <>
      <button ref={botao} type="button" className="redondo menu-celular__botao" aria-expanded={aberto} aria-controls="menu-celular"
        aria-label={aberto ? t.menu.fechar : t.menu.abrir} onClick={() => setAberto((a) => !a)}>
        {aberto ? <IconeFechar /> : <IconeMenu />}
      </button>
      <div ref={painel} id="menu-celular" className="menu-celular" hidden={!aberto}>
        {idioma === "pt" && (
          <form className="menu-celular__busca" action="/busca" role="search">
            <input type="search" name="q" placeholder={t.busca.campo} aria-label={t.busca.campo} maxLength={80} enterKeyHint="search" />
            <button type="submit" aria-label={t.busca.botao}><IconeBusca /></button>
          </form>
        )}
        <nav aria-label={t.menu.aria}>
          <ul className="menu-celular__lista">
            {t.menu.itens.map((it) => (
              <li key={it.href}>
                {it.externo ? (
                  <a className="menu-celular__link menu-celular__link--externo" href={it.href} target="_blank" rel="noopener noreferrer" onClick={fechar}>
                    {it.label}<span className="sr-only"> {t.novaAba}</span>
                  </a>
                ) : (
                  <Link prefetch={false} className="menu-celular__link" href={it.href} aria-current={atual === it.href ? "page" : undefined} onClick={fechar}>{it.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <SeletorIdioma idioma={idioma} caminhos={caminhos} className="menu-celular__seletor" />
        <div className="menu-celular__acoes">
          <a className="redondo" href={REDES.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${t.redes.youtube} ${t.novaAba}`}><IconeYoutube /></a>
          <a className="redondo" href={REDES.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${t.redes.instagram} ${t.novaAba}`}><IconeInstagram /></a>
          <LinkTelegram idioma={idioma} className="botao botao--pequeno" novaAba={t.novaAba}><IconeTelegram />{t.telegram}</LinkTelegram>
        </div>
      </div>
    </>
  );
}
