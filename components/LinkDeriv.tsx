"use client";

import type { ReactNode } from "react";
import { DERIV_AFILIADO, type LocalDeriv } from "@/lib/deriv";
import { track } from "@/lib/medicao";

// TODO link da Deriv passa por aqui: endereço SÓ em lib/deriv.ts (nunca escrito na tela), nova aba,
// rel "sponsored" (link de afiliado, regra do Google) e o evento deriv_click { local, pagina }.
export default function LinkDeriv({ local, pagina, className, novaAba, children }:
  { local: LocalDeriv; pagina: string; className?: string; novaAba: string; children: ReactNode }) {
  return (
    <a className={className} href={DERIV_AFILIADO} target="_blank" rel="noopener noreferrer sponsored"
      onClick={() => track("deriv_click", { local, pagina: pagina.slice(0, 60) })}>
      {children}<span className="sr-only"> {novaAba}</span>
    </a>
  );
}
