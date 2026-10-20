// Configuração de cada página migrada: tipo, título (H1), SEO, categoria, ficha da corretora…
// Títulos e descriptions: os da cópia da Builderall (sem o "Trader Binário |"), salvo onde está anotado.
// A ficha das análises usa SÓ os dados da "Principais Características" / texto da cópia.

export const CATEGORIAS = {
  "opcoes-binarias": { nome: "Opções binárias", href: "/c/opcoes-binarias" },
  forex: { nome: "Forex", href: "/c/forex" },
  "robos-traders": { nome: "Robôs traders", href: "/c/robos-traders" },
  metatrader: { nome: "MetaTrader", href: "/c/metatrader" },
  "gestao-de-risco": { nome: "Gestão de risco", href: "/c/gestao-de-risco" },
  corretoras: { nome: "Corretoras", href: "/c/corretoras" },
  dicas: { nome: "Dicas", href: "/c/-dicas" },
};

const OUTRAS_BINARIAS = ["deriv", "binomo", "quotex", "iq-option", "expert-option", "pocket-option", "olymp-trade", "exnova"];
const OUTRAS_FOREX = ["ebc", "ic-markets", "tickmill", "vantage", "topfx", "moneta-markets"];
const NOMES = {
  deriv: ["Deriv", "/analise-corretora-deriv"], binomo: ["Binomo", "/analise-corretora-binomo"], quotex: ["Quotex", "/analise-corretora-quotex"],
  "iq-option": ["IQ Option", "/analise-corretora-iq-option"], "expert-option": ["Expert Option", "/analise-corretora-expert-option"],
  "pocket-option": ["Pocket Option", "/analise-corretora-pocket-option"], "olymp-trade": ["Olymp Trade", "/analise-corretora-olymp-trade"],
  exnova: ["Exnova", "/analise-corretora-exnova"], ebc: ["EBC Financial Group", "/analise-corretora-forex-ebc-financial-group"],
  "ic-markets": ["IC Markets", "/analise-corretora-forex-ic-markets"], tickmill: ["Tickmill", "/analise-corretora-forex-tickmill"],
  vantage: ["Vantage Markets", "/analise-corretora-forex-vantage-markets"], topfx: ["TopFX", "/analise-corretora-forex-topfx"],
  "moneta-markets": ["Moneta Markets", "/analise-corretora-forex-moneta-markets"],
};
const outras = (lista, menos) => lista.filter((x) => x !== menos).slice(0, 4).map((x) => ({ nome: NOMES[x][0], href: NOMES[x][1] }));

// Análise de corretora: H1 "Análise da corretora X: prós e contras" (mesmo modelo da Deriv)
function analise(id, nome, { forex = false, linha, ficha, logo, cadastro, nota, ...resto }) {
  const desc = forex
    ? `Saiba por onde começar no Day Trade em Opções Binárias e Forex. Análise Corretora ${nome}.`
    : `Saiba por onde começar no Day Trade em Opções Binárias. Análise Corretora ${nome}.`;
  return {
    tipo: "analise",
    titulo: `Análise da corretora ${nome}: prós e contras`,
    tituloDestaque: "prós e contras",
    seo: { title: `Análise da corretora ${nome}: prós e contras`, description: desc },
    categoria: "corretoras",
    trilha: nome,
    corretora: { id, nome, ...(logo ? { logo } : {}), linha, ...(cadastro !== undefined ? { cadastro } : {}), ...(nota ? { nota } : {}) },
    ficha,
    outras: outras(forex ? OUTRAS_FOREX : OUTRAS_BINARIAS, id),
    ...resto,
  };
}

// Página da raiz com o modelo de artigo (guias e páginas fixas da Builderall)
const guia = (titulo, description, extra = {}) => ({ tipo: "guia", titulo, seo: { title: titulo, description }, categoria: "opcoes-binarias", ...extra });

export const PAGINAS = {
  // ---------- LOTE 1: análises ----------
  "analise-corretora-binomo": analise("binomo", "Binomo", {
    logo: "/imagens/corretoras/binomo.webp", linha: "Desde 2014 · sede em Seychelles",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 10" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação mínima", valor: "US$ 1" }, { rotulo: "Saque mínimo", valor: "US$ 10" },
      { rotulo: "Regulação", valor: "IFC (Comissão Financeira Internacional)" }, { rotulo: "Suporte", valor: "24h, 7 dias" },
    ],
    faqPerguntas: ["Como abrir uma conta na Binomo?", "A Binomo tem conta demo?", "Quais são as formas de depósito e saque na Binomo?", "Como funciona a negociação na Binomo?", "A Binomo é segura?"],
  }),
  "analise-corretora-quotex": analise("quotex", "Quotex", {
    logo: "/imagens/corretoras/quotex.webp", linha: "Desde 2020 · corretora offshore",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 10" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação", valor: "US$ 1 a US$ 1.000" }, { rotulo: "Expiração", valor: "60 s a 4 h" },
      { rotulo: "Taxas", valor: "Sem taxa de depósito e saque" }, { rotulo: "Suporte", valor: "24h, 7 dias" },
    ],
    faqPerguntas: ["A Quotex é confiável?", "A Quotex tem conta demo?", "Quanto tempo demora o saque na Quotex?", "Como funciona o suporte da Quotex?", "A Quotex tem sinais de negociação?"],
  }),
  "analise-corretora-iq-option": analise("iq-option", "IQ Option", {
    logo: "/imagens/corretoras/iq-option.webp", linha: "Desde 2013 · São Vicente e Granadinas",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 10" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Ativos", valor: "Opções, forex, ações, cripto, ETFs" }, { rotulo: "Saque", valor: "1º do mês grátis; depois, taxa de 2%" },
      { rotulo: "Alavancagem", valor: "até 1:1000" }, { rotulo: "Suporte", valor: "24h, 7 dias" },
    ],
    faqPerguntas: ["A IQ Option é confiável?", "Como abrir uma conta na IQ Option?", "Quanto tempo demora o saque na IQ Option?", "A IQ Option é regulamentada?", "A IQ Option tem aplicativo?"],
  }),
  // Depósito mínimo fora da ficha: a cópia diz US$ 10 nas características e US$ 50 no texto ([VERIFICAR])
  "analise-corretora-expert-option": analise("expert-option", "Expert Option", {
    logo: "/imagens/corretoras/expert-option.webp", linha: "Desde 2014 · regulada pelo VFSC (Vanuatu)",
    ficha: [
      { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" }, { rotulo: "Operação mínima", valor: "US$ 1" },
      { rotulo: "Expiração", valor: "60 s a 5 min" }, { rotulo: "Saque mínimo", valor: "US$ 10" },
      { rotulo: "Regulação", valor: "VFSC, licença nº 15014" }, { rotulo: "Suporte", valor: "24h, 7 dias" },
    ],
    faqPerguntas: ["Como funciona a Expert Option?", "A Expert Option é segura?", "A Expert Option tem aplicativo?", "A Expert Option tem conta demo?", "Como sacar na Expert Option?"],
  }),
  "analise-corretora-pocket-option": analise("pocket-option", "Pocket Option", {
    linha: "Costa Rica · licença da MISA (Mwali)",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 5" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação mínima", valor: "US$ 1" }, { rotulo: "Saque mínimo", valor: "US$ 10" },
      { rotulo: "Expiração", valor: "60 s a 4 h" }, { rotulo: "Regulação", valor: "MISA (Mwali)" },
    ],
    faqPerguntas: ["A Pocket Option é confiável?", "A Pocket Option tem conta demo?", "O que são os sinais da Pocket Option?", "Como depositar e sacar na Pocket Option?", "Quais formas de pagamento a Pocket Option aceita?"],
  }),
  "analise-corretora-olymp-trade": analise("olymp-trade", "Olymp Trade", {
    linha: "Desde 2014 · regulada pela IFC",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 10" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação", valor: "US$ 1 a US$ 2.000" }, { rotulo: "Alavancagem (forex)", valor: "até 1:500" },
      { rotulo: "Plataformas", valor: "Web, app e MT4" }, { rotulo: "Suporte", valor: "24h, 7 dias" },
    ],
    faqPerguntas: ["O que é a Olymp Trade?", "A Olymp Trade é confiável?", "Como depositar e sacar na Olymp Trade?", "A Olymp Trade tem conta demo?", "Quais são os tipos de conta da Olymp Trade?"],
  }),
  "analise-corretora-exnova": analise("exnova", "Exnova", {
    linha: "Opções binárias e digitais",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 10" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação mínima", valor: "US$ 1" }, { rotulo: "Plataformas", valor: "Web e app (iOS e Android)" },
      { rotulo: "MetaTrader", valor: "Não tem" }, { rotulo: "Ativos", valor: "Ações, forex, commodities, cripto" },
    ],
    faqPerguntas: ["A Exnova oferece sinais de negociação?", "A Exnova tem criptomoedas?", "A Exnova tem material educativo?"],
  }),
  // Decisão do Cristiano (20/10/2026): incorporada pela Deriv → botão da ficha = Deriv (deriv_click local "ficha") + nota no topo.
  // O texto todo fica marcado "reescrever no lote".
  "analise-corretora-binary": analise("binary", "Binary.com", {
    linha: "Desde 2000 · incorporada pela Deriv", cadastro: "deriv",
    nota: "A Binary.com foi incorporada pela Deriv. Hoje o cadastro é feito direto na Deriv.",
    ficha: [
      { rotulo: "Depósito mínimo", valor: "US$ 5" }, { rotulo: "Conta demo", valor: "US$ 10.000 virtuais" },
      { rotulo: "Operação mínima", valor: "US$ 1" }, { rotulo: "Cadastro hoje", valor: "Pela Deriv" },
    ],
  }),
  "analise-corretora-forex-ebc-financial-group": analise("ebc", "EBC Financial Group", {
    forex: true, linha: "Forex e CFDs · contas ECN",
    ficha: [
      { rotulo: "Plataformas", valor: "MT4 e MT5" }, { rotulo: "Mercados", valor: "Forex, índices, commodities, CFDs" },
      { rotulo: "Conta", valor: "ECN" }, { rotulo: "Robôs (EAs)", valor: "Suportados" },
    ],
    faqPerguntas: ["A EBC Financial Group é confiável?", "A EBC Financial Group é regulamentada?", "Brasileiros podem abrir conta na EBC?"],
  }),
  // Sem botão de cadastro até o Cristiano mandar o link (a cópia usava o da IC Markets) — decisão de 20/10/2026
  "analise-corretora-forex-topfx": analise("topfx", "TopFX", {
    forex: true, semBotao: true, linha: "Desde 2010 · Forex e CFDs",
    ficha: [
      { rotulo: "Conta", valor: "ECN/STP" }, { rotulo: "Plataformas", valor: "MT4 e MT5" },
      { rotulo: "Robôs (EAs)", valor: "Compatível" }, { rotulo: "Fundação", valor: "2010" },
    ],
    faqPerguntas: ["A TopFX é confiável?", "A TopFX funciona com robôs?", "Brasileiros podem usar a TopFX?"],
  }),
  "analise-corretora-forex-vantage-markets": analise("vantage", "Vantage Markets", {
    forex: true, linha: "Forex e CFDs · MT4, MT5 e app próprio",
    ficha: [
      { rotulo: "Instrumentos", valor: "Mais de 1.000" }, { rotulo: "Plataformas", valor: "MT4, MT5 e app" },
      { rotulo: "Conta demo", valor: "Ilimitada" }, { rotulo: "Suporte", valor: "Em português" },
    ],
    faqPerguntas: ["A Vantage Markets é boa?", "A Vantage Markets é regulamentada?", "Quais plataformas a Vantage Markets oferece?"],
  }),
  "analise-corretora-forex-ic-markets": analise("ic-markets", "IC Markets", {
    forex: true, linha: "Forex e CFDs · contas ECN",
    ficha: [
      { rotulo: "Plataformas", valor: "MT4, MT5 e cTrader" }, { rotulo: "Conta", valor: "ECN" },
      { rotulo: "Regulação", valor: "ASIC e CySEC" }, { rotulo: "Robôs (EAs)", valor: "Compatível" },
    ],
    faqPerguntas: ["A IC Markets é confiável?", "A IC Markets é regulamentada?", "A IC Markets funciona com robôs?"],
  }),
  "analise-corretora-forex-tickmill": analise("tickmill", "Tickmill", {
    forex: true, linha: "Forex e CFDs · contas ECN",
    ficha: [
      { rotulo: "Plataformas", valor: "MT4 e MT5" }, { rotulo: "Conta", valor: "ECN" },
      { rotulo: "Regulação", valor: "FCA e CySEC" }, { rotulo: "Robôs (EAs)", valor: "Compatível" },
    ],
    faqPerguntas: ["A Tickmill é confiável?", "Brasileiros podem usar a Tickmill?", "A Tickmill funciona com MT4 e MT5?"],
  }),
  // Sem botão de cadastro até o Cristiano mandar o link (a cópia usava o da IC Markets) — decisão de 20/10/2026
  "analise-corretora-forex-moneta-markets": analise("moneta-markets", "Moneta Markets", {
    forex: true, semBotao: true, linha: "Forex e CFDs · WebTrader",
    ficha: [
      { rotulo: "Plataformas", valor: "MT4, MT5 e WebTrader" }, { rotulo: "Gráficos", valor: "Integração com TradingView" },
    ],
    faqPerguntas: ["A Moneta Markets é confiável?", "Brasileiros podem usar a Moneta Markets?", "A Moneta Markets funciona com MT4 e MT5?"],
  }),

  // ---------- LOTE 1: páginas fixas ----------
  // SEO description: a cópia não tinha (texto novo, para aprovar)
  "o-que-sao-opcoes-binarias": guia("O que são opções binárias?", "O que são opções binárias, como funcionam, os tipos (high/low, toque, 60 segundos) e os riscos, explicado de forma simples para iniciantes.", { tituloDestaque: "opções binárias", trilha: "O que são opções binárias" }),
  "opcoes-binarias-para-iniciantes": guia("Opções binárias para iniciantes", "Saiba por onde começar no Day Trade em Opções Binárias. Opções Binárias para Iniciantes.", { tituloDestaque: "iniciantes" }),
  "primeiros-passos-nas-opcoes-binarias": guia("Primeiros passos nas opções binárias", "Saiba por onde começar no Day Trade em Opções Binárias. Primeiros Passos nas Opções Binárias.", { tituloDestaque: "Primeiros passos" }),
  "conta-demo-opcoes-binarias": guia("Conta demo em opções binárias", "Saiba por onde começar no Day Trade em Opções Binárias. Conta DEMO em Opções Binárias?", { tituloDestaque: "Conta demo" }),
  "melhores-corretoras-opcoes-binarias": guia("As melhores corretoras de opções binárias", "Saiba por onde começar no Day Trade em Opções Binárias. As Melhores Corretoras de Opções Binárias.", {
    tituloDestaque: "corretoras", categoria: "corretoras", trilha: "Corretoras de opções binárias",
    substituirSecao: [{ de: "## Melhores Corretoras de Opções Binárias no Brasil", ate: "## O que é uma Corretora", por: "## Corretoras de opções binárias analisadas\n\n:::corretoras deriv iq-option quotex binomo expert-option olymp-trade exnova pocket-option\n:::" }],
  }),
  "melhores-corretoras-forex": guia("As melhores corretoras de forex", "Saiba por onde começar no Day Trade em Forex. As Melhores Corretoras de Forex.", {
    tituloDestaque: "corretoras de forex", categoria: "corretoras", trilha: "Corretoras de forex",
    substituirSecao: [{ de: "## Melhores Corretoras de Forex no Brasil", ate: "### O Que é o Mercado Forex?", por: "## Corretoras de forex analisadas\n\n:::corretoras ebc vantage ic-markets tickmill moneta-markets topfx\n:::" }],
    faqPerguntas: ["Forex é legal no Brasil?", "Preciso declarar os ganhos no Forex?", "Dá para começar no Forex com pouco dinheiro?", "Operar Forex é seguro?"],
  }),
};

// Artigo do blog (/blog/<slug>): H1 da cópia (sem emoji) e SEO title ≤ 60 caracteres. Description: a da configuração
// ou o 1º parágrafo da cópia (se couber em 155 caracteres). "Continue lendo": 3 páginas do mesmo tema (montado abaixo).
// Descriptions do lote 2: a cópia não tinha e o 1º parágrafo passava de 155 → textos novos (descricoes-lote2.json, aprovar)
import DESCRICOES from "./descricoes-lote2.json" with { type: "json" };
const artigo = (titulo, tituloDestaque, categoria, seoTitle = titulo, extra = {}) => ({
  tipo: "artigo", titulo, tituloDestaque, categoria, seo: { title: seoTitle, description: extra.description ?? "" }, ...extra,
});

Object.assign(PAGINAS, {
  // ---------- LOTE 2: opções binárias ----------
  "como-declarar-imposto-de-renda-sobre-opcoes-binarias-no-brasil-guia-completo": artigo("Como declarar imposto de renda sobre opções binárias no Brasil", "imposto de renda", "opcoes-binarias", "Imposto de renda em opções binárias: como declarar", { trilha: "Imposto de renda" }),
  "5-estrategias-simples-de-opcoes-binarias-para-iniciantes-que-funcionam": artigo("5 estratégias simples de opções binárias para iniciantes", "estratégias simples", "opcoes-binarias", undefined, { trilha: "5 estratégias para iniciantes" }),
  "qual-a-diferenca-entre-opcoes-binarias-e-digitais": artigo("Qual a diferença entre opções binárias e digitais?", "digitais", "opcoes-binarias", undefined, { trilha: "Binárias × digitais" }),
  "opcoes-binarias-de-60-segundos-funcionam-ou-so-trazem-risco": artigo("Opções binárias de 60 segundos: funcionam ou só trazem risco?", "60 segundos", "opcoes-binarias", "Opções binárias de 60 segundos: funcionam ou só risco?", { trilha: "60 segundos" }),
  "riscos-das-opcoes-binarias-o-que-poucos-falam-e-como-reduzir": artigo("Riscos das opções binárias: o que poucos falam (e como reduzir)", "Riscos", "opcoes-binarias", "Riscos das opções binárias e como reduzir", { trilha: "Riscos" }),
  "qual-e-o-melhor-gerenciamento-para-opcoes-binarias": artigo("Qual é o melhor gerenciamento para opções binárias?", "gerenciamento", "gestao-de-risco", undefined, { trilha: "Gerenciamento" }),
  "o-que-significa-otc-em-opcoes-binarias": artigo("O que significa OTC em opções binárias?", "OTC", "opcoes-binarias", undefined, { trilha: "OTC" }),
  "glossario-de-termos-importantes-nas-opcoes-binarias": artigo("Glossário de termos importantes nas opções binárias", "Glossário", "opcoes-binarias", undefined, { trilha: "Glossário" }),
  // ---------- LOTE 2: robôs traders ----------
  "robo-de-opcoes-binarias-funciona-verdades-mitos-e-cuidados": artigo("Robô de opções binárias funciona? Verdades, mitos e cuidados", "funciona", "robos-traders", undefined, { trilha: "Robô funciona?" }),
  "o-que-e-um-robo-trader-e-como-funciona": artigo("O que é um robô trader e como funciona? Guia para iniciantes", "robô trader", "robos-traders", "O que é um robô trader e como funciona", { trilha: "O que é um robô trader" }),
  "introducao-robos-traders-deriv-investimento-automatizado": artigo("Introdução aos robôs traders da Deriv", "robôs traders", "robos-traders", undefined, { trilha: "Robôs na Deriv" }),
  "indicadores-mais-usados-por-robos-traders": artigo("Os indicadores mais usados por robôs traders (e como eles funcionam)", "indicadores", "robos-traders", "Os indicadores mais usados por robôs traders", { trilha: "Indicadores dos robôs" }),
  "o-que-e-backtest-e-como-testar-um-robo": artigo("O que é backtest e como testar um robô trader antes de usar", "backtest", "robos-traders", undefined, { trilha: "Backtest" }),
  "diferenca-entre-robo-manual-semi-automatico-e-automatico": artigo("Diferença entre robô manual, semi-automático e 100% automático", "semi-automático", "robos-traders", "Robô manual, semi-automático ou automático: diferenças", { trilha: "Manual × semi × automático" }),
  "riscos-dos-robos-traders-e-como-evitar-quebrar-a-banca": artigo("Riscos dos robôs traders (e como evitar quebrar a banca)", "Riscos", "robos-traders", undefined, { trilha: "Riscos dos robôs" }),
  "robo-trader-bom-nao-e-o-que-acerta-sempre-e-o-que-sabe-parar": artigo("Robô trader bom não é o que acerta sempre — é o que sabe parar", "sabe parar", "robos-traders", "Robô trader bom é o que sabe parar", { trilha: "Robô que sabe parar" }),
  // ---------- LOTE 2: artigos de corretoras ----------
  "negociacao-de-opcoes-binarias-na-deriv-guia-passo-a-passo-para-iniciantes": artigo("Negociação de opções binárias na Deriv: guia passo a passo para iniciantes", "passo a passo", "corretoras", "Opções binárias na Deriv: guia passo a passo", { trilha: "Passo a passo na Deriv" }),
  "guia-completo-deriv": artigo("O guia completo da Deriv: visão geral da plataforma de negociação", "Deriv", "corretoras", "Guia completo da Deriv: visão geral da plataforma", { trilha: "Guia da Deriv" }),
  "analise-ativos-deriv-como-negociar-forex-indices-commodities": artigo("Ativos na Deriv: como negociar forex, índices e commodities", "Ativos", "corretoras", "Ativos na Deriv: forex, índices e commodities", { trilha: "Ativos na Deriv" }),
});

for (const [slug, d] of Object.entries(DESCRICOES)) if (PAGINAS[slug] && !PAGINAS[slug].seo.description) PAGINAS[slug].seo.description = d;

// NÃO migram no lote 2 (descrevem recursos que a corretora não tem → 308 para a análise da corretora; reescrever se valer):
// /blog/analise-plataforma-negociacao-quotex, /blog/introducao-iq-option, /blog/o-guia-completo-da-exnova-uma-visao-geral-da-plataforma-de-negociacao

// "Continue lendo" automático: até 3 páginas do mesmo tema (artigos e guias já configurados)
for (const [slug, cfg] of Object.entries(PAGINAS)) {
  if (cfg.tipo !== "artigo" || cfg.relacionados) continue;
  cfg.relacionados = Object.entries(PAGINAS)
    .filter(([s, c]) => s !== slug && c.categoria === cfg.categoria && c.tipo !== "analise")
    .slice(0, 3).map(([s, c]) => ({ titulo: c.titulo, href: c.tipo === "artigo" ? `/blog/${s}` : `/${s}` }));
}

// NÃO migram no lote 1 (texto sem conserto sem reescrever → "reescrever no lote" + 308 para o guia do tema):
// /como-funcionam-as-opcoes-binarias, /ativos-financeiros-opcoes-binarias, /opcoes-binarias-legalizado-brasil (+ /opcoes-binarias-seguro)
export const LOTES = {
  1: Object.keys(PAGINAS).filter((s) => s.startsWith("analise-corretora-") || PAGINAS[s].tipo === "guia"),
  2: Object.keys(PAGINAS).filter((s) => PAGINAS[s].tipo === "artigo"),
};
