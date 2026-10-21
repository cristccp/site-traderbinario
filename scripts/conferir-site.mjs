// Conferência automática do site (rodar com o npm run dev ligado): node scripts/conferir-site.mjs [http://localhost:3010]
// Para CADA página do sitemap:
//  - frases proibidas (promessa, % de retorno, "melhor corretora", palavras proibidas da voz da marca, aposta/jogo, emoji no texto);
//  - links antigos de afiliado (1sh.co, bit.ly, track.deriv.com, iqbroker);
//  - links internos: página que existe (200), redirecionamento 308 da lista, página de um lote futuro (pendente) ou QUEBRADO;
//  - imagens do próprio site que não abrem;
//  - CELULAR (390 px), num Chrome de verdade: rolagem lateral (página mais larga que a tela), erro no console e status.
//    Usa o Chrome instalado (puppeteer-core, só desenvolvimento). Outro caminho: CHROME_PATH=… node scripts/conferir-site.mjs
// "investimento/investir" e superlativos entram como AVISO (exigem leitura humana: "investir tempo" é ok).
import { existsSync, readFileSync } from "node:fs";
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
  [/:::/, "marcador de bloco (:::) aparecendo no texto — bloco não fechou"],
];
// Páginas EN/ES (/en, /es): a mesma voz da marca, traduzida (padrao-idiomas.md, regra 7). As 3 últimas regras do PT
// (emoji, link antigo, :::) valem para todos os idiomas.
const ERROS_IDIOMA = [
  [/guarantee|garantizad|garantiza/i, "garantia (guaranteed/garantizado)"],
  [/\d+ ?% (a|per) (day|month)|\d+ ?% al (d[ií]a|mes)/i, "% ao dia/mês"],
  [/daily profits?|ganancias? diarias?|passive income|ingresos? pasivos?|autopilot|en autom[aá]tico|make money|ganar dinero/i, "promessa de ganho"],
  [/without risk(?! management)|risk[- ]free|\bno risk\b|sin riesgo|sin arriesgar/i, "\"sem risco\" (without risk/sin riesgo)"],
  [/(payout|return|profit|retorno|ganancia|rendimiento|rentabilidad)s?[^.<]{0,50}\d{2,3} ?%/i, "retorno em %"],
  [/best broker|mejor br[oó]ker/i, "\"melhor corretora\""],
  [/financial freedom|libertad financiera|secret setup|setup secreto|miracle robot|robot milagroso|\bsuccess|[ée]xito|prosperity|prosperidad/i, "palavra proibida da voz da marca"],
  [/\bgames?\b|\bjuegos?\b|\bcasino\b|gambling|\bbets?\b|\bbetting\b|\bapuestas?\b|\bapostar\b/i, "aposta/jogo (bet/gambling/apuesta/juego)"],
  [/binary options?|opci[oó]n(es)? binarias?/i, "\"binary options/opciones binarias\" fora dos 3 artigos"],
];
const AVISOS = [
  [/\binvest(e|ir|imento|imentos|ido|indo|idor|idores)\b/i, "investir/investimento (conferir: opção binária não é investimento)"],
  [/n[uú]mero um|l[ií]der do mercado|melhores? do mercado|mais segur[ao]s? do|mais confi[aá]ve(l|is) do/i, "superlativo"],
];

// Só o texto visível: tira <script>, <style>, atributos e tags
// Frases revisadas que o padrão pegaria por engano (alerta ou negação, não promessa)
const EXCECOES = [/n[ãa]o [ée] o que te faz ganhar dinheiro/gi, /\d+% do lucro/gi, /ganhar dinheiro e continuar vulner[aá]vel/gi, /n[ãa]o precisa escolher .a melhor corretora do mundo./gi];
// EN/ES (copy aprovada pelo Cristiano em 21/10/2026): negações, não promessa — rodapé (textos-padrao), bio, bloco do Telegram e avisos
EXCECOES.push(/past results do not guarantee future results/gi, /los resultados pasados no garantizan resultados futuros/gi,
  /no guaranteed signals/gi, /sin se[ñn]ales garantizadas/gi, /does not sell daily profits/gi, /no vende ganancias diarias/gi,
  /risk management does not guarantee results/gi, /la gesti[óo]n de riesgo no garantiza resultados/gi,
  /what does not exist is a guaranteed way to win/gi, /lo que no existe es una forma garantizada de ganar/gi);
const textoVisivel = (html) => EXCECOES.reduce((h, re) => h.replace(re, " "), html).replace(/⚠️|⚠/g, " ")   // o ⚠️ dos avisos de risco é do design
  .replace(/recomenda[çc][ãa]o de investimento|prote[çc][ãa]o ao investidor|Plataforma de Investimento Online/gi, " ").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#x27;|&quot;|&amp;/g, " ").replace(/\s+/g, " ");
// Exceções SÓ DESTAS PÁGINAS, frase exata (no texto visível). A regra continua valendo no resto do site.
const EXCECOES_PAGINA = {
  "/o-que-sao-opcoes-binarias": [
    "não é renda", "não substitui renda",                        // negação, não promessa — 20/10/2026, aprovado pelo Cristiano
    "payout de 85%",                                              // uso educativo: a conta joga contra o trader — 20/10/2026, aprovado pelo Cristiano
    "Payout Acertos necessários só para empatar 90% cerca de 53% 85% cerca de 54% 80% cerca de 56%",   // a tabela do "só para empatar" — idem
    "robô milagroso",                                             // lista de golpes (alerta) — 20/10/2026, aprovado pelo Cristiano
    "É aposta?", "vira aposta na prática", "Opções binárias é aposta?", "A estrutura lembra uma aposta",   // responde à busca "é aposta" ("jogo" segue proibido) — 20/10/2026, aprovado pelo Cristiano
  ],
  "/blog/melhores-horarios-para-operar-opcoes-binarias-no-brasil": [
    "Horário não é setup secreto.",                               // negação, não promessa — 20/10/2026, aprovado pelo Cristiano
  ],
  "/blog/opcoes-binarias-e-legal-e-seguro-no-brasil": [
    "Opções binárias é aposta ou jogo de azar?", "É aposta?", "É aposta ?",   // responde à busca, negando — 20/10/2026, aprovado pelo Cristiano
    "não um jogo de azar", "não jogo de azar", "vira aposta",     // "derivativo, não jogo de azar"; "sem método... vira aposta" (alerta) — 20/10/2026, aprovado pelo Cristiano
    "grupo de sinal pago com resultado garantido", "robô milagroso",   // lista de golpes (alerta) — 20/10/2026, aprovado pelo Cristiano (regra "negação ou alerta")
  ],
  // EN/ES (copy aprovada pelo Cristiano em 21/10/2026, mesmas exceções do guia PT): payout em % só na conta educativa,
  // "bet/gambling/apuesta" só respondendo à busca "é aposta" (alerta), lista de golpes. "game/juego" segue proibido.
  "/en/what-are-binary-options": [
    "an 85% payout", "Payout Win rate needed just to break even 90% about 53% 85% about 54% 80% about 56%",
    "Is it gambling?", "Are binary options gambling?", "The structure looks like a bet", "it becomes a bet in practice",
    "\"Guaranteed\" signal groups, miracle robots", "Guaranteed signal groups, miracle robots",
  ],
  "/es/que-son-las-opciones-binarias": [
    "un payout del 85%", "payout del 85%", "Payout Aciertos necesarios solo para empatar 90% cerca del 53% 85% cerca del 54% 80% cerca del 56%",
    "¿Son una apuesta?", "¿Las opciones binarias son una apuesta?", "La estructura se parece a una apuesta", "se vuelve una apuesta",
    "Grupos de señales \"garantizadas\"", "Grupos de señales garantizadas",
  ],
  // Home EN/ES: aprovado 21/10/2026: título do artigo no card (é o nome do artigo, não chamada)
  "/en": ["Binary options: what they are, how they work and the risks", "What is the best money management for binary options?", "What is the difference between binary and digital options?"],
  "/es": ["Opciones binarias: qué son, cómo funcionan y sus riesgos", "¿Cuál es la mejor gestión de capital para opciones binarias?", "¿Cuál es la diferencia entre opciones binarias y digitales?"],
  "/blog/forex-e-legal-no-brasil-entenda-a-regulamentacao-e-os-riscos": [
    "Robô milagroso",                                             // lista de golpes (alerta): "Robô milagroso que nunca perde" — 20/10/2026, aprovado pelo Cristiano
  ],
};
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// "binary options/opciones binarias" só nos 3 artigos (decisão do Cristiano, 21/10/2026, copy EN/ES seção 0.2), sempre com o aviso de país
const ARTIGOS_COM_O_TERMO = new Set(["/en/what-are-binary-options", "/en/blog/binary-options-money-management", "/en/blog/binary-vs-digital-options",
  "/es/que-son-las-opciones-binarias", "/es/blog/gestion-de-capital-opciones-binarias", "/es/blog/opciones-binarias-vs-digitales"]);
const ehIdioma = (p) => /^\/(en|es)(\/|$)/.test(p);
const regrasDe = (p) => ehIdioma(p)
  ? [...ERROS_IDIOMA.filter(([, nome]) => !(nome.startsWith("\"binary") && ARTIGOS_COM_O_TERMO.has(p))), ...ERROS.slice(-3)]
  : ERROS;
const tirarExcecoesDaPagina = (texto, p) => (EXCECOES_PAGINA[p] ?? []).reduce((t, f) => t.replace(new RegExp(escapar(f), "g"), " "), texto);
const frase = (texto, re) => { const m = texto.match(re); if (!m) return ""; const i = Math.max(0, m.index - 50); return "…" + texto.slice(i, m.index + m[0].length + 50).trim() + "…"; };

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paginas = [...sitemap.matchAll(/<loc>https:\/\/traderbinario\.com\.br([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
// Páginas que existem mas ficam FORA do sitemap de propósito (noindex): /busca
const FORA_DO_SITEMAP = ["/busca"];
const existentes = new Set([...paginas, ...FORA_DO_SITEMAP]);
let nErros = 0, nAvisos = 0;
const pendentes = new Map(), quebrados = new Map(), imagensRuins = new Set();
const imagensVistas = new Set();

for (const p of paginas) {
  const resp = await fetch(BASE + p);
  if (resp.status !== 200) { console.log(`✗ ${p}
  ERRO  página respondeu ${resp.status}`); nErros++; continue; }
  const html = await resp.text();
  const texto = tirarExcecoesDaPagina(textoVisivel(html), p);
  const linhas = [];
  for (const [re, nome] of regrasDe(p)) if (re.test(nome === "link antigo de afiliado" ? html : texto)) { linhas.push(`  ERRO  ${nome}: ${frase(texto, re) || "(no HTML)"}`); nErros++; }
  for (const [re, nome] of AVISOS) if (!ehIdioma(p) && re.test(texto)) { linhas.push(`  aviso ${nome}: ${frase(texto, re)}`); nAvisos++; }

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

// ---- Celular (390 px): nenhuma página pode rolar de lado (regra fixa desde 20/10/2026, depois da tabela de horários) ----
const CHROME = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const celular = [];
if (!existsSync(CHROME)) {
  celular.push("teste de 390 px NÃO RODOU: Chrome não encontrado (defina CHROME_PATH)");
} else {
  const { default: puppeteer } = await import("puppeteer-core");
  const navegador = await puppeteer.launch({ executablePath: CHROME, headless: true });
  // + a página de busca (fora do sitemap, noindex), com e sem resultado
  for (const p of [...paginas, "/busca?q=deriv", "/busca?q=zzzzz"]) {
    const aba = await navegador.newPage();
    await aba.setViewport({ width: 390, height: 844 });
    const erros = [];
    aba.on("pageerror", (e) => erros.push(String(e)));
    aba.on("console", (m) => { if (m.type() === "error") erros.push(m.text()); });
    const r = await aba.goto(BASE + p, { waitUntil: "networkidle0" });
    const sobra = await aba.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const largo = sobra > 0 ? await aba.evaluate(() => [...document.querySelectorAll("body *")]
      .find((e) => e.getBoundingClientRect().right > window.innerWidth + 1)?.tagName.toLowerCase() ?? "?") : "";
    const falhas = [];
    if (r.status() !== 200) falhas.push(`status ${r.status()}`);
    if (sobra > 0) falhas.push(`rolagem lateral de ${sobra}px (elemento largo: <${largo}>)`);
    if (erros.length) falhas.push(`erro no console: ${erros.join(" | ")}`);
    if (falhas.length) celular.push(`${p}: ${falhas.join(", ")}`);
    await aba.close();
  }
  await navegador.close();
}

console.log(`\n${paginas.length} páginas · ${nErros} erro(s) · ${nAvisos} aviso(s)`);
console.log(`Links internos QUEBRADOS: ${quebrados.size}`);
for (const [a, de] of quebrados) console.log(`  ${a}  ← ${[...de].join(", ")}`);
console.log(`Links para páginas de lotes futuros (pendentes, não são erro agora): ${pendentes.size}`);
for (const [a, de] of [...pendentes].slice(0, 80)) console.log(`  ${a}  ← ${de.size} página(s)`);
console.log(`Imagens do site que não abrem: ${imagensRuins.size}`);
for (const i of imagensRuins) console.log(`  ${i}`);
console.log(`Celular (390 px) com rolagem lateral, erro no console ou status ≠ 200: ${celular.length}`);
for (const c of celular) console.log(`  ${c}`);
process.exitCode = nErros || quebrados.size || imagensRuins.size || celular.length ? 1 : 0;
