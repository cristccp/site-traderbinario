import Link from "next/link";
import type { Link as LinkConteudo } from "@/lib/conteudo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// "Continue lendo": 3 cards com links internos (do campo `relacionados` do conteúdo).
export default function ContinueLendo({ idioma, itens }: { idioma: Idioma; itens?: LinkConteudo[] }) {
  if (!itens?.length) return null;
  const t = textos(idioma).artigo;
  return (
    <section className="secao-linha" aria-labelledby="continue-lendo">
      <div className="wrap continue">
        <h2 id="continue-lendo" className="titulo titulo--h3">{t.continue} <em>{t.continueDestaque}</em></h2>
        <div className="grade-3">
          {itens.map((it) => <Link key={it.href} prefetch={false} className="cartao continue__card" href={it.href}>{it.titulo}</Link>)}
        </div>
      </div>
    </section>
  );
}
