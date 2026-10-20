import Link from "next/link";
import { PREFIXO } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Trilha (breadcrumb): Início / categoria / página. O mesmo caminho vai no JSON-LD BreadcrumbList (lib/seo.ts).
export default function Trilha({ idioma, categoria, atual }: { idioma: Idioma; categoria?: { nome: string; href: string }; atual: string }) {
  const t = textos(idioma).trilha;
  return (
    <nav className="trilha" aria-label={t.aria}>
      <ol>
        <li><Link href={PREFIXO[idioma] || "/"}>{t.inicio}</Link></li>
        {categoria && <li><Link prefetch={false} href={categoria.href}>{categoria.nome}</Link></li>}
        <li aria-current="page">{atual}</li>
      </ol>
    </nav>
  );
}
