import Link from "next/link";
import { textos } from "@/lib/i18n";
import { IDIOMAS, NOME_IDIOMA, PREFIXO, type Idioma } from "@/lib/i18n/tipos";

// Seletor PT · EN · ES (padrao-idiomas.md, regra 2: nada automático), visível em TODAS as páginas.
// Leva à MESMA página no outro idioma (`caminhos`, só os idiomas em que ela existe); sem equivalente, à home do idioma.
export default function SeletorIdioma({ idioma, caminhos, className = "" }:
  { idioma: Idioma; caminhos: Partial<Record<Idioma, string>>; className?: string }) {
  return (
    <nav className={`seletor ${className}`.trim()} aria-label={textos(idioma).seletorAria}>
      {IDIOMAS.map((i) => (
        <Link key={i} href={caminhos[i] ?? (PREFIXO[i] || "/")} prefetch={false} lang={i} hrefLang={i} aria-current={i === idioma ? "true" : undefined}
          className="seletor__item">
          {i.toUpperCase()}<span className="sr-only"> {NOME_IDIOMA[i]}</span>
        </Link>
      ))}
    </nav>
  );
}
