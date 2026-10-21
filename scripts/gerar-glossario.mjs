// Gera lib/glossario-dados.ts a partir do e-book Glossário (fonte única, texto como está):
// 04-funis-captura/skills/ebook-premium/references/conteudo-termos-tecnicos.json (capítulos com blocos ["termos", [[nº, termo, definição], …]]).
// Rodar de novo se o e-book mudar: node scripts/gerar-glossario.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONTE = path.resolve(RAIZ, "..", "..", "skills", "ebook-premium", "references", "conteudo-termos-tecnicos.json");
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const ebook = JSON.parse(readFileSync(FONTE, "utf8"));
const usados = new Map();
const termos = [];
for (const cap of ebook.capitulos) {
  const capitulo = cap.titulo.replace(/\*/g, "");
  for (const bloco of cap.blocos) {
    if (bloco[0] !== "termos") continue;
    for (const [numero, termo, definicao] of bloco[1]) {
      let s = slug(termo);
      const n = (usados.get(s) ?? 0) + 1;
      usados.set(s, n);
      if (n > 1) s = `${s}-${n}`;   // "Consistência" aparece 2 vezes no e-book
      termos.push({ numero: Number(numero), termo, slug: s, definicao, capitulo });
    }
  }
}
if (termos.length !== 100) throw new Error(`esperava 100 termos, achei ${termos.length}`);

const saida = `// GERADO por scripts/gerar-glossario.mjs — NÃO EDITAR À MÃO.
// Fonte única: skills/ebook-premium/references/conteudo-termos-tecnicos.json (e-book "Glossário Essencial de Day Trade"), texto como está.
export type Termo = { numero: number; termo: string; slug: string; definicao: string; capitulo: string };
export const TERMOS: Termo[] = ${JSON.stringify(termos, null, 2)};
`;
writeFileSync(path.join(RAIZ, "lib", "glossario-dados.ts"), saida);
console.log(`ok — ${termos.length} termos em lib/glossario-dados.ts (${[...usados].filter(([, n]) => n > 1).map(([s]) => s).join(", ") || "sem repetidos"} repetido)`);
