// Configuração de cada página migrada: tipo, título (H1), SEO, categoria, ficha da corretora…
// Títulos e descriptions: os da cópia da Builderall (sem o "Trader Binário |"), salvo onde está anotado.
// A ficha das análises usa SÓ os dados da "Principais Características" / texto da cópia.

// Textos REESCRITOS À MÃO e aprovados (fonte única: lib/reescritos.json, também usada pela home). O migrar.mjs pula
// estes slugs ("pulado: reescrito à mão") para não apagar a reescrita. Cada texto reescrito entra no JSON.
import REESCRITOS_JSON from "../../lib/reescritos.json" with { type: "json" };
export const REESCRITOS = REESCRITOS_JSON.slugs.map((r) => r.slug);

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
  "o-que-sao-opcoes-binarias": guia("Opções binárias: o que são, como funcionam e os riscos", "O que são opções binárias, como funcionam, os tipos (high/low, toque, 60 segundos) e os riscos, explicado de forma simples para iniciantes.", { tituloDestaque: "opções binárias", trilha: "O que são opções binárias" }),
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

const SLUGS_LOTE2 = Object.keys(PAGINAS).filter((s) => PAGINAS[s].tipo === "artigo");

// ---------- LOTE 3: forex, MetaTrader, posicionamento, análise técnica ----------
// Descriptions: a cópia não tinha e a linha de abertura passava de 155 → textos novos (descricoes-lote3.json, aprovar)
import DESCRICOES3 from "./descricoes-lote3.json" with { type: "json" };
const LOTE3 = {
  // Forex
  "forex-o-que-e-como-funciona-guia-completo-para-iniciantes": artigo("Forex: o que é e como funciona? Guia completo para iniciantes", "como funciona", "forex", "Forex: o que é e como funciona? Guia para iniciantes", { trilha: "O que é forex" }),
  "como-operar-forex-no-brasil-passo-a-passo-simples-e-atualizado": artigo("Como operar forex no Brasil: passo a passo simples e atualizado", "passo a passo", "forex", "Como operar forex no Brasil: passo a passo", { trilha: "Como operar forex" }),
  "forex-e-legal-no-brasil-entenda-a-regulamentacao-e-os-riscos": artigo("Forex é legal no Brasil? Entenda a regulamentação e os riscos", "legal", "forex", "Forex é legal no Brasil? Regulamentação e riscos", { trilha: "Forex é legal?" }),
  "qual-a-diferenca-entre-opcoes-binarias-e-forex": artigo("Qual a diferença entre opções binárias e forex?", "diferença", "forex", undefined, { trilha: "Binárias × forex" }),
  "melhores-horarios-para-operar-forex-no-brasil": artigo("Melhores horários para operar forex no Brasil", "horários", "forex", undefined, { trilha: "Horários do forex" }),
  "alavancagem-no-forex-o-que-e-como-funciona-e-como-usar-com-seguranca": artigo("Alavancagem no forex: o que é, como funciona e como usar com segurança", "Alavancagem", "forex", "Alavancagem no forex: o que é e como usar com segurança", { trilha: "Alavancagem" }),
  "psicologia-no-forex-o-fator-que-separa-ganhar-de-perder": artigo("Psicologia no forex: o fator que separa ganhar de perder", "Psicologia", "forex", undefined, { trilha: "Psicologia no forex" }),
  "os-indicadores-mais-usados-no-forex-e-como-utilizar-cada-um": artigo("Os indicadores mais usados no forex (e como utilizar cada um)", "indicadores", "forex", "Os indicadores mais usados no forex e como usar cada um", { trilha: "Indicadores do forex" }),
  "pares-de-moedas-mais-negociados-no-forex": artigo("Pares de moedas mais negociados no forex: as escolhas dos traders", "Pares de moedas", "forex", "Pares de moedas mais negociados no forex", { trilha: "Pares de moedas" }),
  "5-estrategias-simples-de-forex-para-iniciantes-que-funcionam": artigo("5 estratégias simples de forex para iniciantes", "estratégias simples", "forex", undefined, { trilha: "5 estratégias de forex" }),
  // MetaTrader
  "metatrader-5-mt5-guia-completo": artigo("MetaTrader 5 (MT5): guia completo para iniciantes e como ele funciona", "MetaTrader 5", "metatrader", "MetaTrader 5 (MT5): guia completo para iniciantes", { trilha: "Guia do MT5" }),
  "metatrader-4-mt4-o-que-e-como-funciona": artigo("MetaTrader 4 (MT4): o que é, como funciona e como começar a operar", "MetaTrader 4", "metatrader", "MetaTrader 4 (MT4): o que é e como funciona", { trilha: "O que é o MT4" }),
  "mt4-vs-mt5-diferenca-completa": artigo("MT4 vs MT5: diferença completa e qual plataforma vale mais a pena", "MT4 vs MT5", "metatrader", "MT4 vs MT5: diferenças e qual plataforma escolher", { trilha: "MT4 × MT5" }),
  "como-instalar-indicadores-no-metatrader": artigo("Como instalar indicadores no MetaTrader (MT4 e MT5): guia rápido e completo", "indicadores", "metatrader", "Como instalar indicadores no MetaTrader (MT4 e MT5)", { trilha: "Instalar indicadores" }),
  "o-que-e-um-ea-expert-advisor-no-metatrader": artigo("O que é um EA (Expert Advisor) no MetaTrader? Como funciona a automação no MT4 e MT5", "Expert Advisor", "metatrader", "O que é um EA (Expert Advisor) no MetaTrader", { trilha: "O que é um EA" }),
  "como-instalar-metatrader-no-pc-passo-a-passo": artigo("Como instalar o MetaTrader no PC: guia passo a passo (MT4 e MT5)", "no PC", "metatrader", "Como instalar o MetaTrader no PC (MT4 e MT5)", { trilha: "Instalar no PC" }),
  "como-instalar-metatrader-no-celular-android-iphone": artigo("Como instalar o MetaTrader no celular (Android e iPhone): guia rápido", "no celular", "metatrader", "Como instalar o MetaTrader no celular (Android e iPhone)", { trilha: "Instalar no celular" }),
  "como-usar-o-metatrader-pela-primeira-vez": artigo("Como usar o MetaTrader pela primeira vez: tutorial completo para iniciantes", "primeira vez", "metatrader", "Como usar o MetaTrader pela primeira vez", { trilha: "Primeiro uso" }),
  // Posicionamento (gestão de risco e mentalidade)
  "por-que-todo-trader-deveria-investir": artigo("Por que todo trader deveria investir (e o erro que pode estar te travando)", "investir", "gestao-de-risco", "Por que todo trader deveria investir", { trilha: "Todo trader deveria investir" }),
  "o-erro-silencioso-que-esta-sabotando-sua-evolucao-no-trade": artigo("O erro silencioso que está sabotando sua evolução no trade", "erro silencioso", "gestao-de-risco", undefined, { trilha: "O erro silencioso" }),
  "porque-2-3-operacoes-por-semana-sao-suficientes": artigo("Por que 2–3 operações por semana são suficientes (e por que operar todo dia atrapalha)", "2–3 operações", "gestao-de-risco", "Por que 2–3 operações por semana são suficientes", { trilha: "2–3 operações por semana" }),
  "os-5-sinais-claros-de-que-voce-esta-operando-por-impulso-e-colocando-sua-banca-em-risco": artigo("Os 5 sinais claros de que você está operando por impulso (e colocando sua banca em risco)", "impulso", "gestao-de-risco", "5 sinais de que você está operando por impulso", { trilha: "Operar por impulso" }),
  "a-diferenca-entre-o-trader-amador-e-o-profissional-voce-e-qual-deles": artigo("A diferença entre o trader amador e o profissional — você é qual deles?", "amador", "gestao-de-risco", "Trader amador × profissional: você é qual deles?", { trilha: "Amador × profissional" }),
  "o-setup-nao-e-o-que-te-faz-ganhar-dinheiro-entenda-o-verdadeiro-segredo-do-trader-consistente": artigo("O setup não é o que te faz ganhar dinheiro — entenda o que faz o trader consistente", "setup", "gestao-de-risco", "O setup não é o que te faz ganhar dinheiro", { trilha: "O setup não é tudo" }),
  "trader-investidor-por-que-o-equil-brio-o-verdadeiro-segredo-da-consistencia": artigo("Trader x investidor: por que o equilíbrio é a base da consistência?", "equilíbrio", "gestao-de-risco", "Trader x investidor: por que o equilíbrio importa", { trilha: "Trader × investidor" }),
  "day-trade-e-simples-o-dificil-e-voce-parar-de-inventar": artigo("Day trade é simples. O difícil é você parar de inventar.", "parar de inventar", "gestao-de-risco", undefined, { trilha: "Parar de inventar" }),
  "voce-nao-vive-de-lucro-voce-vive-de-constancia": artigo("Você não vive de lucro. Você vive de constância!", "constância", "gestao-de-risco", undefined, { trilha: "Constância" }),
  "o-maior-erro-de-quem-come-a-no-day-trade-operar-todo-dia": artigo("O maior erro de quem começa no day trade: operar todo dia", "operar todo dia", "gestao-de-risco", undefined, { trilha: "Operar todo dia" }),
  // Análise técnica
  "o-que-e-pullback-no-day-trade-entenda-de-uma-vez-por-todas": artigo("O que é pullback no day trade? Entenda de uma vez por todas", "pullback", "gestao-de-risco", undefined, { trilha: "Pullback" }),
  "dominando-o-macd-estrategias-e-insights-para-traders": artigo("Dominando o MACD: estratégias e insights para traders", "MACD", "gestao-de-risco", undefined, { trilha: "MACD" }),
  "bandas-de-bollinger-um-guia-completo-para-traders": artigo("Bandas de Bollinger: um guia completo para traders", "Bandas de Bollinger", "gestao-de-risco", undefined, { trilha: "Bandas de Bollinger" }),
  "rsi-desvendado-como-utilizar-o-indice-de-for-a-relativa-no-day-trade": artigo("RSI desvendado: como utilizar o índice de força relativa no day trade", "RSI", "gestao-de-risco", "RSI: como usar o índice de força relativa no day trade", { trilha: "RSI" }),
  "estrategias-avancadas-com-medias-moveis-no-day-trading": artigo("Estratégias avançadas com médias móveis no day trading", "médias móveis", "gestao-de-risco", undefined, { trilha: "Médias móveis" }),
  "fibonacci-no-day-trade-aplicacoes-e-taticas-de-sucesso": artigo("Fibonacci no day trade: aplicações e táticas", "Fibonacci", "gestao-de-risco", undefined, { trilha: "Fibonacci" }),
};
Object.assign(PAGINAS, LOTE3);

for (const [slug, d] of Object.entries({ ...DESCRICOES, ...DESCRICOES3 })) if (PAGINAS[slug] && !PAGINAS[slug].seo.description) PAGINAS[slug].seo.description = d;

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
  2: SLUGS_LOTE2,
  3: Object.keys(LOTE3),
};
