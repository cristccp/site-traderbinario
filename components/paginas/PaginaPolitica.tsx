import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Corpo from "@/components/Corpo";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { buscar, caminho, equivalentes } from "@/lib/conteudo";
import type { Idioma } from "@/lib/i18n/tipos";
import { metadados } from "@/lib/seo";

// Política de privacidade do blog (tipo "pagina" em content/): completa em PT (/politica-de-privacidade,
// adaptada da v4.1 do site principal, com o Tutor IA) e curta em EN (/en/privacy) e ES (/es/privacidad), com link para a completa.
const SLUG: Record<Idioma, string> = { pt: "politica-de-privacidade", en: "privacy", es: "privacidad" };

export function metadadosPolitica(idioma: Idioma): Metadata {
  const c = buscar("pagina", SLUG[idioma], idioma);
  return c ? metadados(c) : {};
}

export default function PaginaPolitica({ idioma }: { idioma: Idioma }) {
  const c = buscar("pagina", SLUG[idioma], idioma);
  if (!c) notFound();
  const aqui = caminho("pagina", c.slug, idioma);
  return (
    <>
      <Topo idioma={idioma} atual={aqui} caminhos={equivalentes(c)} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo politica">
          <Trilha idioma={idioma} atual={c.titulo} />
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={c.titulo} destaque={c.tituloDestaque} />
          {c.resumo && <p className="apoio">{c.resumo}</p>}
          <div className="politica__texto">
            <Corpo blocos={c.blocos} idioma={idioma} pagina={aqui} />
          </div>
        </div>
      </main>
    </>
  );
}
