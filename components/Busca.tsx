"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import CardConteudo from "@/components/CardConteudo";
import { IconeBusca } from "@/components/Icones";
import { buscarNoIndice, type ItemIndice } from "@/lib/busca";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { trackBusca } from "@/lib/medicao";

// Página de busca (/busca?q=…): baixa o índice gerado no build (/busca-indice.json) e busca no navegador.
// Cards com capa, título, categoria e resumo; análises de corretora levam o aviso de risco curto.
// Sem resultado: os guias para começar. Mede "search" { search_term } 1 vez por termo (sem dado pessoal).
export default function Busca({ idioma, guias }: { idioma: Idioma; guias: { titulo: string; href: string }[] }) {
  const t = textos(idioma);
  const q = (useSearchParams().get("q") ?? "").trim();
  const [indice, setIndice] = useState<ItemIndice[] | null>(null);
  const medido = useRef("");

  useEffect(() => {
    let vivo = true;
    fetch("/busca-indice.json").then((r) => r.json()).then((dados: ItemIndice[]) => { if (vivo) setIndice(dados); }).catch(() => { if (vivo) setIndice([]); });
    return () => { vivo = false; };
  }, []);

  const resultados = useMemo(() => (indice && q ? buscarNoIndice(indice, q) : []), [indice, q]);

  useEffect(() => {
    if (indice && q && medido.current !== q) { medido.current = q; trackBusca(q); }
  }, [indice, q]);

  return (
    <>
      <form className="busca-form" action="/busca" role="search">
        <input key={q} type="search" name="q" defaultValue={q} placeholder={t.busca.campo} aria-label={t.busca.campo}
          autoFocus={!q} enterKeyHint="search" maxLength={80} />
        <button type="submit" className="botao"><IconeBusca />{t.busca.botao}</button>
      </form>

      {!q ? (
        <p className="busca-status">{t.busca.vazio}</p>
      ) : !indice ? (
        <p className="busca-status" role="status">{t.busca.carregando}</p>
      ) : resultados.length ? (
        <>
          <p className="busca-status" role="status">{resultados.length} {resultados.length === 1 ? t.busca.um : t.busca.resultados} “{q}”</p>
          <div className="grade-cards">
            {resultados.map((r) => (
              <CardConteudo key={r.u} capaFalta={t.home.capaFalta} item={{
                titulo: r.t, href: r.u, capa: r.capa, rotulo: r.c.toUpperCase(), resumo: r.r,
                aviso: r.k === "analise" ? t.corretoras.aviso : undefined,
              }} />
            ))}
          </div>
        </>
      ) : (
        <div className="busca-vazia" role="status">
          <p className="busca-status">{t.busca.nenhum} “{q}”.</p>
          <p>{t.busca.sugestao}</p>
          <ul className="busca-vazia__guias">
            {guias.map((g) => <li key={g.href}><Link prefetch={false} href={g.href}>{g.titulo}</Link></li>)}
          </ul>
        </div>
      )}
    </>
  );
}
