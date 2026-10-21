// Gera lib/produtos-dados.ts (low tickets do tutor) a partir da FONTE ÚNICA: o site principal
// (04-funis-captura/site-novo/site-cristianopereira): preços em lib/precos.ts e páginas de vendas em app/(vendas)/vendas.ts.
// Só a PÁGINA DE VENDAS entra (nunca o checkout). Rodar de novo sempre que um preço ou página mudar lá:
// node scripts/gerar-produtos.mjs   (o arquivo gerado é versionado: a Vercel não tem o repositório do site principal)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_PRINCIPAL = path.resolve(RAIZ, "..", "..", "site-novo", "site-cristianopereira");
const precosTs = readFileSync(path.join(SITE_PRINCIPAL, "lib", "precos.ts"), "utf8");
const vendasTs = readFileSync(path.join(SITE_PRINCIPAL, "app", "(vendas)", "vendas.ts"), "utf8");

const PRECO = Object.fromEntries([...precosTs.matchAll(/^\s+(\w+): "(R\$[\d.,]+)"/gm)].map((m) => [m[1], m[2]]));
const resolver = (s) => s.replace(/\$\{PRECO\.(\w+)\}/g, (_, k) => { if (!PRECO[k]) throw new Error(`preço sem valor: ${k}`); return PRECO[k]; });

// Produto → chave em vendas.ts e preço (texto) montado de lib/precos.ts
const PRODUTOS = [
  { id: "fundamentos", preco: `${PRECO.fundamentos} (acesso vitalício)` },
  { id: "checklist", preco: `${PRECO.checklist} por ano` },
  { id: "agentes", preco: `${PRECO.agentesTrimestral} (trimestral), ${PRECO.agentesSemestral} (semestral) ou ${PRECO.agentesAnual} (anual)` },
  { id: "expertDeriv", preco: `${PRECO.expertDeriv} por ano` },
  { id: "acessoPremium", preco: `${PRECO.acessoPremium} por ano` },
];

const itens = PRODUTOS.map(({ id, preco }, i) => {
  const ini = vendasTs.indexOf(`\n  ${id}: {`);
  if (ini < 0) throw new Error(`produto não encontrado em vendas.ts: ${id}`);
  const prox = PRODUTOS.slice(i + 1).map((p) => vendasTs.indexOf(`\n  ${p.id}: {`)).find((x) => x > ini) ?? vendasTs.length;
  const bloco = vendasTs.slice(ini, prox);
  const pega = (re, nome) => { const m = bloco.match(re); if (!m) throw new Error(`[${id}] sem ${nome}`); return m[1]; };
  const caminhoVenda = pega(/path: "([^"]+)"/, "path");
  const titulo = pega(/title: "([^"]+)"/, "seo.title");
  const descricao = pega(/description: [`"]([^`"]+)[`"]/, "seo.description");
  return {
    id,
    nome: titulo.split(/\s+[|·]\s+/)[0].trim(),
    descricao: resolver(descricao),
    preco,
    url: "https://cristianopereira.com.br" + caminhoVenda,
  };
});

const saida = `// GERADO por scripts/gerar-produtos.mjs — NÃO EDITAR À MÃO.
// Fonte única: site-cristianopereira/lib/precos.ts (preços) e app/(vendas)/vendas.ts (página de vendas, título e descrição).
// Usado pela base do tutor (scripts/gerar-base-tutor.mjs) e pela medição tutor_cta (destino "venda").
export type Produto = { id: string; nome: string; descricao: string; preco: string; url: string };
export const PRODUTOS: Produto[] = ${JSON.stringify(itens, null, 2)};
`;
writeFileSync(path.join(RAIZ, "lib", "produtos-dados.ts"), saida);
console.log(`ok — ${itens.length} produtos em lib/produtos-dados.ts`);
