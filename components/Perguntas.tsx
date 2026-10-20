import type { Pergunta } from "@/lib/conteudo";

// FAQ com <details> nativo (abre sem JavaScript, funciona no teclado). A 1ª pergunta já vem aberta, como no design.
// Os MESMOS textos vão no JSON-LD FAQPage (lib/seo.ts). Sem perguntas → não aparece.
export default function Perguntas({ titulo, itens, id = "perguntas-frequentes" }: { titulo: string; itens?: Pergunta[]; id?: string }) {
  if (!itens?.length) return null;
  return (
    <section className="faq" aria-labelledby={id}>
      <h2 id={id}>{titulo}</h2>
      <div className="faq__lista">
        {itens.map((f, i) => (
          <details key={f.p} className="cartao faq__item" open={i === 0}>
            <summary>{f.p}</summary>
            <p>{f.r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
