import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Corpo from "@/components/Corpo";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar } from "@/lib/conteudo";
import { metadados } from "@/lib/seo";

// Política de privacidade do blog (PORTUGUÊS) → /politica-de-privacidade, no sitemap (tipo "pagina" em content/).
// Texto em content/paginas/politica-de-privacidade.pt.md (adaptado da v4.1 do site principal, com o Tutor IA).
const c = buscar("pagina", "politica-de-privacidade", "pt");
export const metadata: Metadata = c ? metadados(c) : {};

export default function Page() {
  if (!c) notFound();
  return (
    <>
      <Topo idioma="pt" atual="/politica-de-privacidade" />
      <main id="conteudo">
        <div className="wrap cabeca-artigo politica">
          <Trilha idioma="pt" atual={c.titulo} />
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          {c.resumo && <p className="apoio">{c.resumo}</p>}
          <div className="politica__texto">
            <Corpo blocos={c.blocos} idioma="pt" pagina="/politica-de-privacidade" />
          </div>
        </div>
      </main>
    </>
  );
}
