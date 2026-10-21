import type { Metadata } from "next";
import Link from "next/link";
import Calculadora from "@/components/Calculadora";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { EBOOKS } from "@/lib/ebooks-dados";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { FIXAS } from "@/lib/rotas-idiomas";
import { metadadosFixa } from "@/lib/seo";

// Ferramentas → /ferramentas · /en/tools · /es/herramientas, indexável e no sitemap: as duas calculadoras de gestão de risco
// (sem projeção de ganho; tudo no navegador), link para o glossário do idioma e o aviso de risco.
// Planilha grátis: só em PT (material só em PT).
export const metadadosFerramentas = (idioma: Idioma): Metadata =>
  metadadosFixa(FIXAS.ferramentas, idioma, textos(idioma).ferramentas.seoTitle, textos(idioma).ferramentas.meta);

export default function PaginaFerramentas({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma);
  const f = t.ferramentas;
  const planilha = `${EBOOKS.planilha.url}?utm_source=traderbinario&utm_medium=ferramentas&utm_campaign=ferramentas`;
  return (
    <>
      <Topo idioma={idioma} atual={FIXAS.ferramentas[idioma]} caminhos={FIXAS.ferramentas} />
      <main id="conteudo">
        <div className="wrap cabeca-artigo ferramentas">
          <Trilha idioma={idioma} atual={f.titulo} />
          <span className="rotulo rotulo--ciano">{f.rotulo}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={f.titulo} destaque={f.destaque} />
          <p className="apoio">{f.apoio}</p>

          <section className="ferramenta" aria-labelledby="ferramenta-risco">
            <h2 id="ferramenta-risco" className="titulo titulo--h3">{t.calc.risco.titulo}</h2>
            <p className="ferramenta__uso">{f.usoRisco}</p>
            <Calculadora modo="risco" idioma={idioma} />
          </section>

          <section className="ferramenta" aria-labelledby="ferramenta-empate">
            <h2 id="ferramenta-empate" className="titulo titulo--h3">{t.calc.empate.titulo}</h2>
            <p className="ferramenta__uso">{f.usoEmpate}</p>
            <Calculadora modo="empate" idioma={idioma} />
          </section>

          <p className="ferramenta__links">
            {f.planilha && f.planilhaLink && (
              <>{f.planilha} <a href={planilha} target="_blank" rel="noopener">{f.planilhaLink}<span className="sr-only"> {t.novaAba}</span></a>.{" "}</>
            )}
            {f.glossarioTexto} <Link prefetch={false} href={FIXAS.glossario[idioma]}>{f.glossarioLink}</Link>.
          </p>
          <p className="aviso-fim">{t.artigo.risco}</p>
        </div>
      </main>
    </>
  );
}
