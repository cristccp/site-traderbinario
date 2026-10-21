"use client";

import { useMemo, useState } from "react";
import type { Termo } from "@/lib/glossario-dados";

// Lista do glossário (/glossario, /en/glossary, /es/glosario): os termos de A a Z, agrupados por letra, com âncora por termo (#slug),
// navegação por letra e busca simples na própria página (sem acento, sem maiúsculas). Tudo já vem no HTML.
const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function GlossarioLista({ termos, locale, rotuloBusca, nenhum, rotuloLetras }:
  { termos: Termo[]; locale: string; rotuloBusca: string; nenhum: string; rotuloLetras: string }) {
  const [q, setQ] = useState("");
  const ordenados = useMemo(() => [...termos].sort((a, b) => a.termo.localeCompare(b.termo, locale)), [termos, locale]);
  const filtro = sem(q.trim());
  const visiveis = filtro ? ordenados.filter((t) => sem(`${t.termo} ${t.definicao}`).includes(filtro)) : ordenados;
  const grupos = visiveis.reduce<Record<string, Termo[]>>((g, t) => {
    const l = sem(t.termo).charAt(0).toUpperCase();
    (g[l] ??= []).push(t);
    return g;
  }, {});
  const letras = Object.keys(grupos);

  return (
    <>
      <div className="glossario-busca">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={rotuloBusca} aria-label={rotuloBusca} />
      </div>
      {!filtro && (
        <nav className="glossario-letras" aria-label={rotuloLetras}>
          {letras.map((l) => <a key={l} href={`#letra-${l}`}>{l}</a>)}
        </nav>
      )}
      {!visiveis.length && <p className="busca-status" role="status">{nenhum}</p>}
      {letras.map((l) => (
        <section key={l} className="glossario-grupo" aria-labelledby={`letra-${l}`}>
          <h2 id={`letra-${l}`} className="glossario-grupo__letra">{l}</h2>
          <dl>
            {grupos[l].map((t) => (
              <div key={t.slug} id={t.slug} className="glossario-item">
                <dt>{t.termo}</dt>
                <dd>{t.definicao}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
