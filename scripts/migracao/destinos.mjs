// Destinos da migração: para onde vai cada link antigo encontrado no texto da cópia.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
// Tabela ÚNICA de redirecionamentos 308 (a mesma que o next.config.ts lê): [{ de, para, motivo }]
const REDIRECIONAMENTOS = JSON.parse(readFileSync(path.join(RAIZ, "lib", "redirecionamentos.json"), "utf8"));
const MAPA = new Map(REDIRECIONAMENTOS.map((r) => [r.de, r.para]));

// Link interno antigo (traderbinario.com.br/…) → endereço novo (relativo). Externo → null.
export function destinoInterno(url) {
  const m = url.match(/^https?:\/\/(?:www\.)?traderbinario\.com\.br(\/[^?#]*)?/i);
  if (!m) return null;
  let p = (m[1] || "/").replace(/\/+$/, "") || "/";
  for (let i = 0; i < 3 && MAPA.has(p); i++) p = MAPA.get(p);    // segue até o destino final
  return p;
}

// Link de afiliado da cópia → id da corretora em lib/corretoras.ts ("deriv" = lib/deriv.ts). Outros → null.
const AFILIADOS = [
  [/1sh\.co\/DerivPremium|track\.deriv\.com|t\.deriv\.link|bit\.ly\/2i2HCJi/i, "deriv"],   // bit.ly/2i2HCJi = Binary (incorporada pela Deriv)
  [/bit\.ly\/TraderBinarioIQ|iqbroker\.com\/redir|iqoption\.(com|net)\/(redir|lp)|affiliate\.iqoption/i, "iq-option"],
  [/binomo\.com\/.*[?&]a=fb91955b2ff5/i, "binomo"],
  [/quotex\.io\/sign-up|broker-qx\.pro\/sign-up/i, "quotex"],
  [/r\.shortlify\.com\/\?prefid=1001870/i, "expert-option"],
  [/pocket1\.click\//i, "pocket-option"],
  [/exnova\.(com|org)\/lp\//i, "exnova"],
  [/trkmad\.com\/382844/i, "olymp-trade"],
  [/toebc\.com\/RegistroEBC/i, "ebc"],
  [/icmarkets\.com\/\?camp=54767/i, "ic-markets"],
  [/my\.tickmill\.com\/.*IB70660166/i, "tickmill"],
  [/vigco\.co\/la-com\/UkshU7eW/i, "vantage"],
];
export function corretoraDoLink(url) {
  const a = AFILIADOS.find(([re]) => re.test(url));
  return a ? a[1] : null;
}
