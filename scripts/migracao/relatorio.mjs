// Gera a seção de trocas da migração no docs/revisao-conteudo.md, agrupada por página, a partir de trocas.mjs.
// Uso: node scripts/migracao/relatorio.mjs --lote 1   (reescreve só o bloco entre os marcadores do lote)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOTES, PAGINAS } from "./paginas.mjs";
import { TROCAS } from "./trocas.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DOC = path.join(RAIZ, "docs", "revisao-conteudo.md");
const lote = process.argv[process.argv.indexOf("--lote") + 1];
const slugs = LOTES[lote];
if (!slugs) throw new Error("Uso: node scripts/migracao/relatorio.mjs --lote <n>");

const cel = (s) => (s === "" ? "*(removido)*" : s.replace(/\|/g, "\\|").replace(/\n+/g, " ⏎ ").trim());
const url = (s) => (PAGINAS[s].tipo === "artigo" ? `/blog/${s}` : `/${s}`);

let md = `<!-- lote-${lote}:inicio (gerado por scripts/migracao/relatorio.mjs — não editar à mão) -->\n`;
let total = 0;
for (const s of slugs) {
  const lista = TROCAS.filter((t) => t.pagina === s);
  total += lista.length;
  md += `\n#### \`${url(s)}\` — ${lista.length} troca(s)\n`;
  if (!lista.length) { md += "Sem trocas de texto (só a organização automática).\n"; continue; }
  md += "| # | Antes (cópia) | Depois | Motivo |\n|---|---|---|---|\n";
  lista.forEach((t, i) => { md += `| ${i + 1} | ${cel(t.antes)} | ${cel(t.depois)} | ${cel(t.motivo)} |\n`; });
}
md += `\n**Total do lote ${lote}: ${total} trocas em ${slugs.length} páginas.**\n<!-- lote-${lote}:fim -->`;

let doc = readFileSync(DOC, "utf8");
const re = new RegExp(`<!-- lote-${lote}:inicio[\\s\\S]*?<!-- lote-${lote}:fim -->`);
doc = re.test(doc) ? doc.replace(re, md) : doc.replace("<!-- trocas-por-lote -->", `<!-- trocas-por-lote -->\n\n${md}`);
writeFileSync(DOC, doc);
console.log(`ok — ${total} trocas em ${slugs.length} páginas (lote ${lote})`);
