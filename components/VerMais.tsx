"use client";

import { useState, type ReactNode } from "react";

// Grade com "Ver mais": TODOS os cards já estão no HTML (o Google vê todos os links); o CSS esconde do 13º em diante
// (.grade-cards--limitada) até o clique. Sem /page/N: essas URLs antigas da Builderall redirecionam.
export default function VerMais({ total, limite, rotulo, children }: { total: number; limite: number; rotulo: string; children: ReactNode }) {
  const [todos, setTodos] = useState(false);
  return (
    <>
      <div id="grade-textos" className={todos || total <= limite ? "grade-cards" : "grade-cards grade-cards--limitada"}>{children}</div>
      {total > limite && !todos && (
        <button type="button" className="botao botao--contorno ver-mais" aria-controls="grade-textos" aria-expanded={todos} onClick={() => setTodos(true)}>
          {rotulo} ({total - limite})
        </button>
      )}
    </>
  );
}
