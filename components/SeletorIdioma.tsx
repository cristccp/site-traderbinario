import Link from "next/link";
import { textos } from "@/lib/i18n";
import { NOME_IDIOMA, type Idioma } from "@/lib/i18n/tipos";

// Seletor PT · EN · ES (padrao-idiomas.md, regra 2: nada automático). Só aparece quando a página existe em
// MAIS DE UM idioma — e só mostra os idiomas que existem, levando à MESMA página no outro idioma.
// Nesta etapa (só PT) ele fica escondido em todas as páginas.
export default function SeletorIdioma({ idioma, idiomas, caminhos }:
  { idioma: Idioma; idiomas: Idioma[]; caminhos: Partial<Record<Idioma, string>> }) {
  if (idiomas.length < 2) return null;
  return (
    <nav className="seletor" aria-label={textos(idioma).seletorAria}>
      {idiomas.map((i) => (
        <Link key={i} href={caminhos[i] ?? "/"} lang={i} hrefLang={i} aria-current={i === idioma ? "true" : undefined}
          className="seletor__item">
          {i.toUpperCase()}<span className="sr-only"> {NOME_IDIOMA[i]}</span>
        </Link>
      ))}
    </nav>
  );
}
