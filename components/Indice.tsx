import type { ItemIndice } from "@/lib/markdown";

// "Neste artigo": sai sozinho dos H2 do texto (+ "Perguntas frequentes" quando a página tem FAQ).
export default function Indice({ titulo, itens }: { titulo: string; itens: ItemIndice[] }) {
  if (itens.length < 2) return null;
  return (
    <nav className="cartao indice" aria-label={titulo}>
      <span className="rotulo">{titulo}</span>
      <ol>
        {itens.map((it) => <li key={it.id}><a href={"#" + it.id}>{it.texto}</a></li>)}
      </ol>
    </nav>
  );
}
