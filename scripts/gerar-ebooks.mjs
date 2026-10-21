// Gera lib/ebooks.ts a partir da FONTE ÚNICA dos materiais grátis: o site principal
// (04-funis-captura/site-novo/site-cristianopereira/app/(captura)/materiais-captura.ts) e copia as capas para public/imagens/ebooks/.
// Rodar de novo sempre que um material mudar lá: node scripts/gerar-ebooks.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_PRINCIPAL = path.resolve(RAIZ, "..", "..", "site-novo", "site-cristianopereira");
const FONTE = path.join(SITE_PRINCIPAL, "app", "(captura)", "materiais-captura.ts");
const IDS = ["quebram-banca", "gestao-de-risco", "planilha", "price-action", "suporte-resistencia", "candlesticks", "boom-crash", "glossario"];

const ts = readFileSync(FONTE, "utf8");
const campo = (bloco, re, id, nome) => { const m = bloco.match(re); if (!m) throw new Error(`[${id}] sem ${nome}`); return m[1]; };
mkdirSync(path.join(RAIZ, "public", "imagens", "ebooks"), { recursive: true });

const itens = IDS.map((id, i) => {
  const ini = ts.indexOf(`  "${id}": {`);
  if (ini < 0) throw new Error(`material não encontrado: ${id}`);
  const prox = IDS.slice(i + 1).map((x) => ts.indexOf(`  "${x}": {`)).find((x) => x > ini) ?? ts.length;
  const bloco = ts.slice(ini, prox);
  const capa = campo(bloco, /cover: "([^"]+)"/, id, "cover");
  copyFileSync(path.join(SITE_PRINCIPAL, "public", capa), path.join(RAIZ, "public", "imagens", "ebooks", `${id}.webp`));
  return {
    id,
    nome: campo(bloco, /email: \{ nome: "([^"]+)"/, id, "email.nome"),
    tipo: campo(bloco, /email: \{ nome: "[^"]+", tipo: "([^"]+)"/, id, "email.tipo"),
    linha: campo(bloco, /subtitle: "([^"]+)"/, id, "hero.subtitle"),
    capa: `/imagens/ebooks/${id}.webp`,
    capaAlt: campo(bloco, /coverAlt: "([^"]+)"/, id, "coverAlt"),
    url: "https://cristianopereira.com.br" + campo(bloco, /capturaPath: "([^"]+)"/, id, "capturaPath"),
  };
});

const saida = `// GERADO por scripts/gerar-ebooks.mjs — NÃO EDITAR À MÃO.
// Fonte única: site-cristianopereira/app/(captura)/materiais-captura.ts (nome = email.nome, linha = hero.subtitle).
export type EbookId = ${IDS.map((x) => JSON.stringify(x)).join(" | ")};
export type Ebook = { id: EbookId; nome: string; tipo: "ebook" | "planilha"; linha: string; capa: string; capaAlt: string; url: string };
export const EBOOKS: Record<EbookId, Ebook> = ${JSON.stringify(Object.fromEntries(itens.map((x) => [x.id, x])), null, 2)};
`;
writeFileSync(path.join(RAIZ, "lib", "ebooks-dados.ts"), saida);
console.log(`ok — ${itens.length} materiais em lib/ebooks-dados.ts e capas em public/imagens/ebooks/`);
