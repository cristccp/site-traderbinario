// Outras corretoras (não a Deriv): links de afiliado EXATAMENTE como estavam na home da Builderall (../_copia/home, 20/10/2026).
// Decisão de 20/10/2026: a 1ª versão migra todas como estão; revisão corretora por corretora depois da virada.
// IQ Option: link direto de afiliado (trocado em 20/10/2026, era bit.ly).
// Expert Option: encurtador (r.shortlify.com) conferido pelo Cristiano em 20/10/2026 e MANTIDO.
// Todo clique passa por components/LinkCorretora (broker_click { corretora }).
export type Corretora = { id: string; nome: string; logo: string; analise: string; cadastro: string };

export const CORRETORAS: Record<string, Corretora> = {
  "iq-option": { id: "iq-option", nome: "IQ Option", logo: "/imagens/corretoras/iq-option.webp", analise: "/analise-corretora-iq-option", cadastro: "https://affiliate.iqoption.net/redir/?aff=159333&aff_model=revenue&afftrack=traderbinario" },
  quotex: { id: "quotex", nome: "Quotex", logo: "/imagens/corretoras/quotex.webp", analise: "/analise-corretora-quotex", cadastro: "https://broker-qx.pro/sign-up/?lid=172595" },
  binomo: { id: "binomo", nome: "Binomo", logo: "/imagens/corretoras/binomo.webp", analise: "/analise-corretora-binomo", cadastro: "https://binomo.com/pt/promo/l28?a=fb91955b2ff5&ac=BRBinomo" },
  "expert-option": { id: "expert-option", nome: "Expert Option", logo: "/imagens/corretoras/expert-option.webp", analise: "/analise-corretora-expert-option", cadastro: "https://r.shortlify.com/?prefid=1001870" },
};
