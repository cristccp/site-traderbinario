import type { Metadata } from "next";
import Link from "next/link";
import Calculadora from "@/components/Calculadora";
import Titulo from "@/components/Titulo";
import Topo from "@/components/Topo";
import Trilha from "@/components/Trilha";
import { EBOOKS } from "@/lib/ebooks-dados";
import { textos } from "@/lib/i18n";

// Ferramentas (PORTUGUÊS) → /ferramentas, indexável e no sitemap: as duas calculadoras de gestão de risco
// (sem projeção de ganho; tudo no navegador), link para a planilha grátis e o glossário, e o aviso de risco.
const t = textos("pt");
export const metadata: Metadata = {
  title: t.ferramentas.seoTitle,
  description: t.ferramentas.meta,
  alternates: { canonical: "/ferramentas" },
  openGraph: { title: t.ferramentas.seoTitle, description: t.ferramentas.meta, url: "/ferramentas", type: "website" },
};

export default function Page() {
  const f = t.ferramentas;
  const planilha = `${EBOOKS.planilha.url}?utm_source=traderbinario&utm_medium=ferramentas&utm_campaign=ferramentas`;
  return (
    <>
      <Topo idioma="pt" atual="/ferramentas" />
      <main id="conteudo">
        <div className="wrap cabeca-artigo ferramentas">
          <Trilha idioma="pt" atual={f.titulo} />
          <span className="rotulo rotulo--ciano">{f.rotulo}</span>
          <Titulo nivel="h1" className="titulo titulo--artigo" texto={f.titulo} destaque={f.destaque} />
          <p className="apoio">{f.apoio}</p>

          <section className="ferramenta" aria-labelledby="ferramenta-risco">
            <h2 id="ferramenta-risco" className="titulo titulo--h3">{t.calc.risco.titulo}</h2>
            <p className="ferramenta__uso">{f.usoRisco}</p>
            <Calculadora modo="risco" />
          </section>

          <section className="ferramenta" aria-labelledby="ferramenta-empate">
            <h2 id="ferramenta-empate" className="titulo titulo--h3">{t.calc.empate.titulo}</h2>
            <p className="ferramenta__uso">{f.usoEmpate}</p>
            <Calculadora modo="empate" />
          </section>

          <p className="ferramenta__links">
            {f.planilha} <a href={planilha} target="_blank" rel="noopener">{f.planilhaLink}<span className="sr-only"> {t.novaAba}</span></a>.{" "}
            {f.glossarioTexto} <Link prefetch={false} href="/glossario">{f.glossarioLink}</Link>.
          </p>
          <p className="aviso-fim">{t.artigo.risco}</p>
        </div>
      </main>
    </>
  );
}
