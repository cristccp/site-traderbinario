import { HOSTS_OFICIAIS } from "@/lib/site";

// Medição: UMA função para todos os eventos do site (track). Vai para o dataLayer do GTM;
// quem decide se o GA4 grava cookie é o consentimento do banner (Consent Mode v2).
// NUNCA nome, e-mail nem nada pessoal: só textos curtos (ids) e números passam.
// Fora do domínio oficial (localhost, vercel.app) nada é enviado: o evento aparece no console para teste.
// Mesmo padrão do site principal e do forexbots. Eventos: deriv_click { local, pagina } · telegram_click { idioma } · broker_click { corretora }.

export type Evento = "telegram_click" | "deriv_click" | "broker_click";
type Params = Record<string, string | number>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const ehHostOficial = () => typeof window !== "undefined" && HOSTS_OFICIAIS.includes(window.location.hostname);

// Só ids curtos e números: nada com "@", espaço ou texto grande passa
const seguro = (params: Params): Params =>
  Object.fromEntries(Object.entries(params).filter(([, v]) =>
    typeof v === "number" ? Number.isFinite(v) : typeof v === "string" && v.length <= 60 && !v.includes("@") && !/\s/.test(v)));

export function track(evento: Evento, params: Params = {}) {
  const p = seguro(params);
  if (!ehHostOficial()) {
    console.info("[medição]", evento, p);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...p });
}
