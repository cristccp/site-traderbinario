"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/medicao";

// Cadastro nas OUTRAS corretoras (link de afiliado da cópia, lib/corretoras.ts): nova aba, rel "sponsored"
// e o evento broker_click { corretora }.
export default function LinkCorretora({ id, href, className, novaAba, children }:
  { id: string; href: string; className?: string; novaAba: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer sponsored"
      onClick={() => track("broker_click", { corretora: id })}>
      {children}<span className="sr-only"> {novaAba}</span>
    </a>
  );
}
