import { HOSTS_OFICIAIS } from "@/lib/site";

// Medição: UMA função para todos os eventos do site (track). Vai para o dataLayer do GTM;
// quem decide se o GA4 grava cookie é o consentimento do banner (Consent Mode v2).
// NUNCA nome, e-mail nem nada pessoal: só textos curtos (ids) e números passam.
// Fora do domínio oficial (localhost, vercel.app) nada é enviado: o evento aparece no console para teste.
// Mesmo padrão do site principal e do forexbots. Eventos: deriv_click { local, pagina, idioma } · telegram_click { idioma } · broker_click { corretora }
// · search { search_term } (trackBusca) · ebook_click { material, local: meio|fim } · calc_use { calc: risco|empate } · glossario_dica { termo }
// · tutor_open (abriu o Tutor IA) · tutor_cta { destino: ebook|ferramentas|venda|deriv|telegram|artigo } (link dentro de uma resposta).
// Todo push leva os 9 parâmetros; os que o evento não usa vão como undefined, o que zera a variável do GTM
// (sem isso um deriv_click depois de um calc_use saía com calc="risco" — Visualizar do GTM, 21/10/2026).
const PARAMETROS = ["idioma", "local", "pagina", "corretora", "search_term", "material", "calc", "termo", "destino"] as const;
const LIMPOS = Object.fromEntries(PARAMETROS.map((k) => [k, undefined]));

export type Evento = "telegram_click" | "deriv_click" | "broker_click" | "search" | "ebook_click" | "calc_use" | "glossario_dica"
  | "tutor_open" | "tutor_cta";
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

// Busca (evento "search", padrão do GA4): o termo pode ter espaço, mas nunca dado pessoal.
// Minúsculas, máx. 60 caracteres, tira palavras com "@" e sequências de 5+ dígitos (telefone, CPF).
export function trackBusca(termo: string) {
  const search_term = termo.toLowerCase().split(/\s+/).filter((w) => w && !w.includes("@") && !/\d{5,}/.test(w))
    .join(" ").slice(0, 60).trim();
  if (!search_term) return;
  enviar("search", { search_term });
}

export function track(evento: Evento, params: Params = {}) {
  enviar(evento, seguro(params));
}

// O mesmo objeto vai para o dataLayer (domínio oficial) ou para o console (teste), com os 9 parâmetros
function enviar(evento: Evento, params: Params) {
  const dados = { event: evento, ...LIMPOS, ...params };
  if (!ehHostOficial()) {
    console.info("[medição]", evento, dados);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(dados);
}
