"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/medicao";

// Link para a página de captura do e-book no site principal (com UTM do artigo): nova aba e o evento
// ebook_click { material, local: meio|fim }. Não é afiliado → sem "sponsored".
export default function LinkEbook({ material, local, href, className, novaAba, children }:
  { material: string; local: "meio" | "fim"; href: string; className?: string; novaAba: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener"
      onClick={() => track("ebook_click", { material, local })}>
      {children}<span className="sr-only"> {novaAba}</span>
    </a>
  );
}
