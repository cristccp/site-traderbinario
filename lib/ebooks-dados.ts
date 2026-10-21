// GERADO por scripts/gerar-ebooks.mjs — NÃO EDITAR À MÃO.
// Fonte única: site-cristianopereira/app/(captura)/materiais-captura.ts (nome = email.nome, linha = hero.subtitle).
export type EbookId = "quebram-banca" | "gestao-de-risco" | "planilha" | "price-action" | "suporte-resistencia" | "candlesticks" | "boom-crash" | "glossario";
export type Ebook = { id: EbookId; nome: string; tipo: "ebook" | "planilha"; linha: string; capa: string; capaAlt: string; url: string };
export const EBOOKS: Record<EbookId, Ebook> = {
  "quebram-banca": {
    "id": "quebram-banca",
    "nome": "Por que Traders Quebram Banca",
    "tipo": "ebook",
    "linha": "Um e-book direto para quem já sabe operar e mesmo assim devolve semanas de lucro em um dia.",
    "capa": "/imagens/ebooks/quebram-banca.webp",
    "capaAlt": "Capa do e-book Por que Traders Quebram Banca (Mesmo Sabendo Operar)",
    "url": "https://cristianopereira.com.br/ebook-por-que-traders-quebram-banca"
  },
  "gestao-de-risco": {
    "id": "gestao-de-risco",
    "nome": "Gestão de Risco no Day Trade",
    "tipo": "ebook",
    "linha": "Um e-book direto para quem quer parar de quebrar banca: quanto arriscar, onde colocar o stop e quando parar no dia.",
    "capa": "/imagens/ebooks/gestao-de-risco.webp",
    "capaAlt": "Capa do e-book Gestão de Risco no Day Trade",
    "url": "https://cristianopereira.com.br/ebook-gerenciamento-de-risco"
  },
  "planilha": {
    "id": "planilha",
    "nome": "Planilha de Gerenciamento",
    "tipo": "planilha",
    "linha": "Uma planilha gratuita para registrar cada dia de operação, acompanhar a banca mês a mês e parar de operar no escuro.",
    "capa": "/imagens/ebooks/planilha.webp",
    "capaAlt": "Capa da Planilha de Gerenciamento",
    "url": "https://cristianopereira.com.br/planilha-de-gerenciamento-daytrade"
  },
  "price-action": {
    "id": "price-action",
    "nome": "Price Action no Day Trade",
    "tipo": "ebook",
    "linha": "Um e-book direto para aprender a ler o preço puro — estrutura, candles e contexto — sem depender de indicadores.",
    "capa": "/imagens/ebooks/price-action.webp",
    "capaAlt": "Capa do e-book Price Action no Day Trade",
    "url": "https://cristianopereira.com.br/ebook-price-action-daytrade"
  },
  "suporte-resistencia": {
    "id": "suporte-resistencia",
    "nome": "Suporte e Resistência no Day Trade",
    "tipo": "ebook",
    "linha": "Um e-book direto para marcar as zonas que importam, ler a reação do preço e parar de entrar no meio do nada.",
    "capa": "/imagens/ebooks/suporte-resistencia.webp",
    "capaAlt": "Capa do e-book Suporte e Resistência no Day Trade",
    "url": "https://cristianopereira.com.br/ebook-suporte-resistencia-daytrade"
  },
  "candlesticks": {
    "id": "candlesticks",
    "nome": "Candlesticks no Day Trade",
    "tipo": "ebook",
    "linha": "Um e-book direto com os 17 padrões de candle mais usados — como identificar cada um e por que nenhum funciona sem contexto.",
    "capa": "/imagens/ebooks/candlesticks.webp",
    "capaAlt": "Capa do e-book Candlesticks no Day Trade",
    "url": "https://cristianopereira.com.br/ebook-candlesticks-daytrade"
  },
  "boom-crash": {
    "id": "boom-crash",
    "nome": "Boom & Crash Market",
    "tipo": "ebook",
    "linha": "Um e-book direto para entender como os mercados Boom & Crash funcionam, ler o gráfico com lógica e operar com consciência — não por impulso.",
    "capa": "/imagens/ebooks/boom-crash.webp",
    "capaAlt": "Capa do e-book Boom & Crash Market",
    "url": "https://cristianopereira.com.br/ebook-boom-crash-market"
  },
  "glossario": {
    "id": "glossario",
    "nome": "Glossário Essencial de Day Trade",
    "tipo": "ebook",
    "linha": "Um glossário direto com os 100 termos técnicos mais usados no day trade, explicados sem linguagem complicada.",
    "capa": "/imagens/ebooks/glossario.webp",
    "capaAlt": "Capa do e-book Glossário Essencial de Day Trade",
    "url": "https://cristianopereira.com.br/ebook-glossario-termos-tecnicos"
  }
};
