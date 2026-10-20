// Escolha do banner de cookies (Consent Mode v2). Cookie de primeira parte NECESSÁRIO: cpt_consent=granted|denied, 12 meses.
// "Aceitar" libera SÓ analytics_storage; os 3 de anúncios ficam sempre "denied" (não existe pixel).
// O valor padrão (tudo negado) e a escolha salva são aplicados antes do GTM pelo script do <head> (ConsentimentoHead).
// Cópia do site principal (site-cristianopereira/lib/consentimento-cookies.ts).

export const COOKIE_CONSENTIMENTO = "cpt_consent";
const DOZE_MESES = 365 * 24 * 60 * 60;
export const EVENTO_MUDOU = "cpt:consent";            // a escolha mudou (o banner relê)
export const EVENTO_ABRIR = "cpt:cookies-abrir";      // "Preferências de cookies" no rodapé

export type Escolha = "granted" | "denied";

export function lerEscolha(): Escolha | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_CONSENTIMENTO}=(granted|denied)`));
  return m ? (m[1] as Escolha) : null;
}

export function salvarEscolha(escolha: Escolha) {
  const seguro = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENTIMENTO}=${escolha}; Max-Age=${DOZE_MESES}; Path=/; SameSite=Lax${seguro}`;
  window.gtag?.("consent", "update", { analytics_storage: escolha });
  if (escolha === "denied") apagarCookiesGA();
  window.dispatchEvent(new Event(EVENTO_MUDOU));
}

// Recusou depois de aceitar: apaga _ga e _ga_* em todos os domínios possíveis (ex.: .traderbinario.com.br)
function apagarCookiesGA() {
  const nomes = document.cookie.split("; ").map((c) => c.split("=")[0]).filter((n) => n === "_ga" || n.startsWith("_ga_"));
  const partes = window.location.hostname.split(".");
  const dominios = [""];
  for (let i = 0; i < partes.length - 1; i++) {
    const d = partes.slice(i).join(".");
    dominios.push(`; Domain=${d}`, `; Domain=.${d}`);
  }
  for (const n of nomes) for (const d of dominios) document.cookie = `${n}=; Max-Age=0; Path=/${d}`;
}
