// Corretoras (menos a Deriv, que fica em lib/deriv.ts): link de afiliado NUM LUGAR SÓ.
// Todo clique de cadastro passa por components/LinkCorretora (nova aba, rel "sponsored", broker_click { corretora }).
// Decisões do Cristiano (20/10/2026):
// - IQ Option: link direto de afiliado (era bit.ly).
// - Expert Option: encurtador (r.shortlify.com) conferido e MANTIDO.
// - Pocket Option: encurtador (pocket1.click) conferido e MANTIDO.
// - Binomo, Quotex: o link da home da Builderall (a análise tinha outra versão). Exnova: .com com afftrack=traderbinario.
// - Moneta Markets e TopFX: SEM botão de cadastro até o Cristiano mandar os links (a cópia usava o da IC Markets).
// - Olymp Trade (trkmad.com), Vantage (vigco.co), EBC (toebc.com), IC Markets (icmarkets.com) e Tickmill (my.tickmill.com):
//   conferidos pelo Cristiano e MANTIDOS (20/10/2026).
// - Binary: incorporada pela Deriv → cadastro pela Deriv (lib/deriv.ts).
export type Corretora = { id: string; nome: string; logo?: string; analise: string; cadastro?: string };

export const CORRETORAS: Record<string, Corretora> = {
  "iq-option": { id: "iq-option", nome: "IQ Option", logo: "/imagens/corretoras/iq-option.webp", analise: "/analise-corretora-iq-option", cadastro: "https://affiliate.iqoption.net/redir/?aff=159333&aff_model=revenue&afftrack=traderbinario" },
  quotex: { id: "quotex", nome: "Quotex", logo: "/imagens/corretoras/quotex.webp", analise: "/analise-corretora-quotex", cadastro: "https://broker-qx.pro/sign-up/?lid=172595" },
  binomo: { id: "binomo", nome: "Binomo", logo: "/imagens/corretoras/binomo.webp", analise: "/analise-corretora-binomo", cadastro: "https://binomo.com/pt/promo/l28?a=fb91955b2ff5&ac=BRBinomo" },
  "expert-option": { id: "expert-option", nome: "Expert Option", logo: "/imagens/corretoras/expert-option.webp", analise: "/analise-corretora-expert-option", cadastro: "https://r.shortlify.com/?prefid=1001870" },
  "pocket-option": { id: "pocket-option", nome: "Pocket Option", analise: "/analise-corretora-pocket-option", cadastro: "https://pocket1.click/smart/AW3ss0J7FdQJS2" },
  exnova: { id: "exnova", nome: "Exnova", analise: "/analise-corretora-exnova", cadastro: "https://exnova.com/lp/start-trading/?aff=159333&aff_model=revenue&afftrack=traderbinario" },
  "olymp-trade": { id: "olymp-trade", nome: "Olymp Trade", analise: "/analise-corretora-olymp-trade", cadastro: "https://trkmad.com/382844/" },
  binary: { id: "binary", nome: "Binary.com", analise: "/analise-corretora-binary" },
  ebc: { id: "ebc", nome: "EBC Financial Group", analise: "/analise-corretora-forex-ebc-financial-group", cadastro: "https://www.toebc.com/RegistroEBC" },
  "ic-markets": { id: "ic-markets", nome: "IC Markets", analise: "/analise-corretora-forex-ic-markets", cadastro: "https://icmarkets.com/?camp=54767" },
  tickmill: { id: "tickmill", nome: "Tickmill", analise: "/analise-corretora-forex-tickmill", cadastro: "https://my.tickmill.com/?utm_campaign=ib_link&utm_content=IB70660166&utm_medium=Open+Account&utm_source=link&lp=https://my.tickmill.com/pt/sign-up/" },
  topfx: { id: "topfx", nome: "TopFX", analise: "/analise-corretora-forex-topfx" },
  vantage: { id: "vantage", nome: "Vantage Markets", analise: "/analise-corretora-forex-vantage-markets", cadastro: "https://vigco.co/la-com/UkshU7eW" },
  "moneta-markets": { id: "moneta-markets", nome: "Moneta Markets", analise: "/analise-corretora-forex-moneta-markets" },
};
