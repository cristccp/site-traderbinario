// Conferência automática do site (rodar com o npm run dev ligado): node scripts/conferir-site.mjs [http://localhost:3010]
// Para CADA página do sitemap:
//  - frases proibidas (promessa, % de retorno, "melhor corretora", palavras proibidas da voz da marca, aposta/jogo, emoji no texto);
//  - links antigos de afiliado (1sh.co, bit.ly, track.deriv.com, iqbroker);
//  - links internos: página que existe (200), redirecionamento 308 da lista, página de um lote futuro (pendente) ou QUEBRADO;
//  - imagens do próprio site que não abrem.
// "investimento/investir" e superlativos entram como AVISO (exigem leitura humana: "investir tempo" é ok).
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:3010";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REDIR = new Map(JSON.parse(readFileSync(path.join(RAIZ, "lib", "redirecionamentos.json"), "utf8")).map((r) => [r.de, r.para]));
// Lista de URLs mantidas no mapa (lotes 2–4 ainda vão migrar): ../urls-copiar.txt
const MANTIDAS = new Set(readFileSync(path.join(RAIZ, "..", "urls-copiar.txt"), "utf8").split("\n")
  .filter((l) => l.startsWith("http")).map((l) => new URL(l.trim()).pathname.replace(/\/$/, "") || "/"));

const ERROS = [
  [/lucro garantido|resultado garantido|retorno garantido(?! —)/i, "garantia de lucro/resultado"],
  [/\d+ ?% ao (dia|m[eê]s)/i, "% ao dia/mês"],
  [/(?<!imposto de |declara[çc][ãa]o de |declarar o imposto de )\brenda\b(?! fixa| vari[aá]vel)/i, "renda"],
  [/ganhe dinheiro|ganhar dinheiro|\blucre\b|lucrar|lucrativ|no autom[aá]tico/i, "promessa de ganho"],
  [/\bsem riscos?\b/i, "\"sem risco\""],
  [/(retorno|rendimento|lucro|lucratividade|rentabilidade|payout)s?[^.<]{0,50}\d{2,3} ?%/i, "retorno em %"],
  [/melhor corretora/i, "\"melhor corretora\""],
  [/liberdade financeira|10% ao dia|sem esfor[çc]o|setup secreto|rob[oô] milagroso|nunca mais perca|\bsucesso\b|bem-sucedid|prosperidade/i, "palavra proibida da voz da marca"],
  [/\baposta|\bapostar|\bjogo\b|\bjogos\b|cassino/i, "aposta/jogo"],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u, "emoji no texto"],
  [/1sh\.co|bit\.ly\/TraderBinarioIQ|track\.deriv\.com|iqbroker\.com/i, "link antigo de afiliado"],
];
const AVISOS = [
  [/\binvest(e|ir|imento|imentos|ido|indo|idor|idores)\b/i, "investir/investimento (conferir: opção binária não é investimento)"],
  [/n[uú]mero um|l[ií]der do mercado|melhores? do mercado|mais segur[ao]s? do|mais confi[aá]ve(l|is) do/i, "superlativo"],
];

// Só o texto visível: tira <script>, <style>, atributos e tags
// Frases revisadas que o padrão pegaria por engano (alerta ou negação, não promessa)
const EXCECOES = [/ganhar dinheiro e continuar vulner[aá]vel/gi, /n[ãa]o precisa escolher .a melhor corretora do mundo./gi];
const textoVisivel = (html) => EXCECOES.reduce((h, re) => h.replace(re, " "), html).replace(/⚠️|⚠/g, " ")   // o ⚠️ dos avisos de risco é do design
  .replace(/recomenda[çc][ãa]o de investimento|prote[çc][ãa]o ao investidor|Plataforma de Investimento Online/gi, " ").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#x27;|&quot;|&amp;/g, " ").replace(/\s+/g, " ");
const frase = (texto, re) => { const m = texto.match(re); if (!m) return ""; const i = Math.max(0, m.index - 50); return "…" + texto.slice(i, m.index + m[0].length + 50).trim() + "…"; };

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paginas = [...sitemap.matchAll(/<loc>https:\/\/traderbinario\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
const existentes = new Set(paginas);
let nErros = 0, nAvisos = 0;
const pendentes = new Map(), quebrados = new Map(), imagensRuins = new Set();
const imagensVistas = new Set();

for (const p of paginas) {
  const resp = await fetch(BASE + p);
  if (resp.status !== 200) { console.log(`✗ ${p}
  ERRO  página respondeu ${resp.status}`); nErros++; continue; }
  const html = await resp.text();
  const texto = textoVisivel(html);
  const linhas = [];
  for (const [re, nome] of ERROS) if (re.test(nome === "link antigo de afiliado" ? html : texto)) { linhas.push(`  ERRO  ${nome}: ${frase(texto, re) || "(no HTML)"}`); nErros++; }
  for (const [re, nome] of AVISOS) if (re.test(texto)) { linhas.push(`  aviso ${nome}: ${frase(texto, re)}`); nAvisos++; }

  for (const m of html.matchAll(/href="((?:https?:\/\/(?:www\.)?traderbinario\.com\.br)?\/[^"#?]*)/g)) {
    let alvo = m[1].replace(/^https?:\/\/(?:www\.)?traderbinario\.com\.br/, "").replace(/\/$/, "") || "/";
    if (alvo.startsWith("/_next") || /\.(webp|png|svg|ico|xml|txt)$/.test(alvo)) continue;
    if (existentes.has(alvo)) continue;
    if (REDIR.has(alvo)) continue;
    if (MANTIDAS.has(alvo) || alvo.startsWith("/c/")) { if (!pendentes.has(alvo)) pendentes.set(alvo, new Set()); pendentes.get(alvo).add(p); continue; }
    if (!quebrados.has(alvo)) quebrados.set(alvo, new Set()); quebrados.get(alvo).add(p);
  }
  for (const m of html.matchAll(/(?:src|srcSet|srcset)="(\/imagens\/[^"\s]+|\/fotos\/[^"\s]+)/g)) imagensVistas.add(m[1]);
  console.log(`${linhas.length ? "✗" : "✓"} ${p}`);
  for (const l of linhas) console.log(l);
}

for (const img of imagensVistas) {
  const r = await fetch(BASE + img, { method: "HEAD" });
  if (r.status !== 200) imagensRuins.add(`${img} (${r.status})`);
}

console.log(`\n${paginas.length} páginas · ${nErros} erro(s) · ${nAvisos} aviso(s)`);
console.log(`Links internos QUEBRADOS: ${quebrados.size}`);
for (const [a, de] of quebrados) console.log(`  ${a}  ← ${[...de].join(", ")}`);
console.log(`Links para páginas de lotes futuros (pendentes, não são erro agora): ${pendentes.size}`);
for (const [a, de] of [...pendentes].slice(0, 80)) console.log(`  ${a}  ← ${de.size} página(s)`);
console.log(`Imagens do site que não abrem: ${imagensRuins.size}`);
for (const i of imagensRuins) console.log(`  ${i}`);
process.exitCode = nErros || quebrados.size || imagensRuins.size ? 1 : 0;
