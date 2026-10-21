import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// "Em 30 segundos": resumo de 3–4 frases logo abaixo do título (campo opcional `emResumo` do frontmatter).
// Ajuda o leitor apressado e as IAs que resumem a página. Sem o campo, não aparece nada.
export default function EmResumo({ itens, idioma }: { itens?: string[]; idioma: Idioma }) {
  if (!itens?.length) return null;
  const t = textos(idioma);
  return (
    <section className="em-resumo cartao" aria-labelledby="em-resumo-titulo">
      <h2 id="em-resumo-titulo" className="rotulo rotulo--ciano">{t.resumo.titulo}</h2>
      <ul>{itens.map((i) => <li key={i}>{i}</li>)}</ul>
    </section>
  );
}
