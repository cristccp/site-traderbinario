// Gera lib/glossario-dados-idiomas.ts (glossário EN e ES) a partir do arquivo APROVADO pelo Cristiano (21/10/2026):
// 04-funis-captura/entregas/traderbinario-glossario-en-es-2026-10-21.md (tabela "Termos" + tabela "Capítulos").
// Mesma numeração e capítulos do PT (lib/glossario-dados.ts) e MESMA regra de slug do scripts/gerar-glossario.mjs
// (sem acento, minúsculas, repetido ganha -2). Rodar de novo se o arquivo aprovado mudar: node scripts/gerar-glossario-idiomas.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.resolve(RAIZ, "..", "..", "entregas", "traderbinario-glossario-en-es-2026-10-21.md");
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const md = readFileSync(FONTE, "utf8").replace(/\r\n/g, "\n");
const celulas = (linha) => linha.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
const tabela = (titulo) => {
  const i = md.indexOf(`## ${titulo}`);
  if (i < 0) throw new Error(`sem a seção "## ${titulo}"`);
  return md.slice(i).split("\n").slice(1).filter((l) => l.startsWith("|")).slice(2).map(celulas);
};

// Capítulos: PT → EN, ES
const capitulos = new Map(tabela("Capítulos").map(([pt, en, es]) => [pt, { en, es }]));
// Capítulo de cada número, pelo PT (fonte do e-book)
const pt = readFileSync(path.join(RAIZ, "lib", "glossario-dados.ts"), "utf8");
const ptTermos = JSON.parse(pt.slice(pt.indexOf("= [") + 2, pt.lastIndexOf("];") + 1));
const capDe = new Map(ptTermos.map((t) => [t.numero, t.capitulo]));

const linhas = tabela("Termos").filter((c) => /^\d+$/.test(c[0]));
const saida = {};
for (const idioma of ["en", "es"]) {
  const usados = new Map();
  saida[idioma] = linhas.map(([n, enT, enD, esT, esD]) => {
    const numero = Number(n);
    const [termo, definicao] = idioma === "en" ? [enT, enD] : [esT, esD];
    let s = slug(termo);
    const k = (usados.get(s) ?? 0) + 1;
    usados.set(s, k);
    if (k > 1) s = `${s}-${k}`;
    const cap = capitulos.get(capDe.get(numero));
    if (!cap) throw new Error(`termo ${numero}: capítulo sem tradução`);
    return { numero, termo, slug: s, definicao, capitulo: cap[idioma] };
  });
  if (saida[idioma].length !== 100) throw new Error(`${idioma}: esperava 100 termos, achei ${saida[idioma].length}`);
}

writeFileSync(path.join(RAIZ, "lib", "glossario-dados-idiomas.ts"), `// GERADO por scripts/gerar-glossario-idiomas.mjs — NÃO EDITAR À MÃO.
// Fonte: entregas/traderbinario-glossario-en-es-2026-10-21.md (aprovado pelo Cristiano em 21/10/2026). Mesma numeração do PT.
import type { Termo } from "@/lib/glossario-dados";
export const TERMOS_EN: Termo[] = ${JSON.stringify(saida.en, null, 2)};
export const TERMOS_ES: Termo[] = ${JSON.stringify(saida.es, null, 2)};
`);
console.log(`ok — EN ${saida.en.length} e ES ${saida.es.length} termos em lib/glossario-dados-idiomas.ts`);
