// Gera lib/tutor/base.md: a base de conhecimento do Tutor IA do blog (vai no cache da Anthropic, em /api/tutor).
// Roda sozinho antes de cada build (prebuild) e com: npm run base-tutor
// Fontes (todas do repositório, então a Vercel gera igual): content/{artigos,guias,analises,categorias}/*.pt.md publicados
// (título, endereço, categoria, resumo, "Em 30 segundos" e FAQ), lib/ebooks-dados.ts, lib/produtos-dados.ts
// (gerado por scripts/gerar-produtos.mjs), lib/glossario-dados.ts, lib/telegram.ts e lib/deriv.ts.
// Também confere se lib/tutor/regras.md e lib/tutor/conferencia.md são iguais aos textos aprovados em blog/tutor/, quando a pasta existe.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as lerYaml } from "yaml";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ler = (...p) => readFileSync(path.join(RAIZ, ...p), "utf8").replace(/\r\n/g, "\n");

// ---------- Textos aprovados: a cópia do site tem que ser igual à fonte (quando a pasta blog/tutor/ existe) ----------
const APROVADOS = [
  ["regras.md", "regras-tutor-blog-v1.1.md"],                   // regras do tutor
  ["conferencia.md", "conferencia-final-tutor-blog-v1.md"],     // conferência final (vai depois das regras)
];
for (const [copia, original] of APROVADOS) {
  const fonte = path.resolve(RAIZ, "..", "tutor", original);
  if (!existsSync(fonte)) continue;
  if (readFileSync(fonte, "utf8").replace(/\r\n/g, "\n") !== ler("lib", "tutor", copia)) {
    console.error(`[base-tutor] lib/tutor/${copia} está diferente de blog/tutor/${original} (texto aprovado). Copie a versão aprovada e rode de novo.`);
    process.exit(1);
  }
}

// ---------- Dados gerados em TypeScript (JSON depois do "=") ----------
const json = (arquivo, nome) => {
  const m = ler("lib", arquivo).match(new RegExp(`export const ${nome}[^=]*= ([\\s\\S]*?);?\\s*$`));
  if (!m) throw new Error(`[base-tutor] não achei ${nome} em lib/${arquivo}`);
  return JSON.parse(m[1]);
};
const EBOOKS = json("ebooks-dados.ts", "EBOOKS");
const PRODUTOS = json("produtos-dados.ts", "PRODUTOS");
const TERMOS = json("glossario-dados.ts", "TERMOS");
const texto1 = (arquivo, re) => { const m = ler("lib", arquivo).match(re); if (!m) throw new Error(`[base-tutor] link não achado em lib/${arquivo}`); return m[1]; };
const TELEGRAM = texto1("telegram.ts", /pt: "([^"]+)"/);
const DERIV = texto1("deriv.ts", /DERIV_AFILIADO = "([^"]+)"/);

// ---------- Conteúdo publicado em português ----------
function pasta(nome) {
  return readdirSync(path.join(RAIZ, "content", nome)).filter((f) => f.endsWith(".pt.md")).map((f) => {
    const m = ler("content", nome, f).match(/^---\n([\s\S]*?)\n---/);
    return m ? lerYaml(m[1]) : null;
  }).filter((c) => c && c.status === "publicado");
}
const porTitulo = (a, b) => a.titulo.localeCompare(b.titulo, "pt");
const artigos = pasta("artigos").sort(porTitulo);
const guias = pasta("guias").sort(porTitulo);
const analises = pasta("analises").sort(porTitulo);
const categorias = pasta("categorias").sort(porTitulo);

const limpa = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
function ficha(c, url) {
  const l = [`### ${limpa(c.titulo)}`, `Endereço: ${url}${c.categoria ? ` · Categoria: ${c.categoria.nome}` : ""}`];
  const resumo = limpa(c.resumo || c.seo?.description);
  if (resumo) l.push(`Resumo: ${resumo}`);
  if (c.corretora) l.push(`Corretora: ${limpa(c.corretora.nome)} (${limpa(c.corretora.linha)})${c.corretora.nota ? `. ${limpa(c.corretora.nota)}` : ""}`);
  if (c.ficha?.length) l.push(`Ficha: ${c.ficha.map((f) => `${limpa(f.rotulo)}: ${limpa(f.valor)}`).join(" · ")}`);
  if (c.emResumo?.length) l.push("Em 30 segundos:", ...c.emResumo.map((x) => `- ${limpa(x)}`));
  if (c.faq?.length) l.push("Perguntas frequentes:", ...c.faq.map((f) => `P: ${limpa(f.p)}\nR: ${limpa(f.r)}`));
  return l.join("\n");
}

const NOMES_CATEGORIA = [...new Set(artigos.map((a) => a.categoria?.nome).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt"));

const base = [
  "# Base de conhecimento do Tutor do Trader Binário",
  "(Gerada automaticamente das páginas publicadas do blog traderbinario.com.br e dos catálogos do site cristianopereira.com.br. Use só o que está aqui.)",
  "",
  "## Links fixos",
  `- Grupo do Telegram (gratuito): ${TELEGRAM}`,
  `- Link do Cristiano para a Deriv (a corretora que o Cristiano usa; começar pela conta demo): ${DERIV}`,
  "- Ferramentas grátis do blog (calculadora de risco por operação e calculadora de acertos para empatar, sem projeção de ganho): /ferramentas",
  "- Glossário de day trade (100 termos de A a Z): /glossario",
  "- Busca do blog: /busca",
  "- Site do Cristiano (cursos, materiais e produtos): https://cristianopereira.com.br",
  "",
  "## E-books e materiais grátis (oferta principal)",
  "Cada um tem uma página de captura gratuita no site do Cristiano. Indique o do tema da dúvida, com o endereço.",
  ...Object.values(EBOOKS).map((e) => `- ${e.nome} (${e.tipo === "planilha" ? "planilha grátis" : "e-book grátis"}): ${limpa(e.linha)} Endereço: ${e.url}`),
  "",
  "Qual indicar por tema (a mesma tabela da caixa de e-book do blog):",
  `- Quanto arriscar, stop, gestão de risco, gerenciamento, corretoras → ${EBOOKS["gestao-de-risco"].nome}`,
  `- Velas, candles, padrões de candle → ${EBOOKS.candlesticks.nome}`,
  `- Termos, iniciante, MetaTrader → ${EBOOKS.glossario.nome}`,
  `- Impulso, psicologia, emoção, quebra de banca, opções binárias em geral → ${EBOOKS["quebram-banca"].nome}`,
  `- Registro de operações, planilha, robôs traders, imposto → ${EBOOKS.planilha.nome}`,
  `- Boom e Crash, índices sintéticos, Deriv → ${EBOOKS["boom-crash"].nome}`,
  `- Price action, forex, leitura de gráfico → ${EBOOKS["price-action"].nome}`,
  `- Suporte e resistência, indicadores, análise técnica → ${EBOOKS["suporte-resistencia"].nome}`,
  "",
  "## Produtos pagos (low tickets) — indicar só pela página de vendas, nunca pelo checkout",
  ...PRODUTOS.map((p) => `- ${p.nome} — ${p.preco}. ${limpa(p.descricao)} Página de vendas: ${p.url}`),
  "",
  "## Categorias do blog",
  ...categorias.map((c) => `- ${limpa(c.nome ?? c.titulo)}: /c/${c.slug}${c.chamada ? ` — ${limpa(c.chamada)}` : ""}`),
  "",
  "## Guias (páginas principais de cada tema)",
  "",
  ...guias.map((c) => ficha(c, `/${c.slug}`) + "\n"),
  "## Artigos do blog",
  "",
  ...NOMES_CATEGORIA.flatMap((nome) => [
    `## Artigos — ${nome}`, "",
    ...artigos.filter((a) => a.categoria?.nome === nome).map((c) => ficha(c, `/blog/${c.slug}`) + "\n"),
  ]),
  ...artigos.filter((a) => !a.categoria).map((c) => ficha(c, `/blog/${c.slug}`) + "\n"),
  "## Análises de corretoras",
  "",
  ...analises.map((c) => ficha(c, `/${c.slug}`) + "\n"),
  "## Glossário (termo: definição) — página completa em /glossario",
  ...TERMOS.map((t) => `- ${t.termo}: ${limpa(t.definicao)}`),
  "",
].join("\n");

writeFileSync(path.join(RAIZ, "lib", "tutor", "base.md"), base);
console.log(`ok — lib/tutor/base.md: ${guias.length} guias, ${artigos.length} artigos, ${analises.length} análises, ${Object.keys(EBOOKS).length} e-books, ${PRODUTOS.length} produtos, ${TERMOS.length} termos (${Math.round(base.length / 1024)} KB)`);
