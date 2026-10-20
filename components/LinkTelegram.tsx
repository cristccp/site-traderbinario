"use client";

import type { ReactNode } from "react";
import type { Idioma } from "@/lib/i18n/tipos";
import { track } from "@/lib/medicao";
import { TELEGRAM } from "@/lib/telegram";

// TODO link de Telegram passa por aqui: grupo do idioma (lib/telegram.ts), nova aba e o evento telegram_click { idioma }.
export default function LinkTelegram({ idioma, className, novaAba, children }:
  { idioma: Idioma; className?: string; novaAba: string; children: ReactNode }) {
  return (
    <a className={className} href={TELEGRAM[idioma]} target="_blank" rel="noopener noreferrer"
      onClick={() => track("telegram_click", { idioma })}>
      {children}<span className="sr-only"> {novaAba}</span>
    </a>
  );
}
