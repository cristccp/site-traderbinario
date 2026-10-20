"use client";

import { EVENTO_ABRIR } from "@/lib/consentimento-cookies";

// Link "Preferências de cookies" do rodapé: reabre o banner. Cópia do site principal.
export default function PreferenciasCookies({ label }: { label: string }) {
  return (
    <button type="button" className="footer__policy footer__cookies" onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))}>
      {label}
    </button>
  );
}
