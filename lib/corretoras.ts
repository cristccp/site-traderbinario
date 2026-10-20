// Outras corretoras (não a Deriv): links de afiliado EXATAMENTE como estavam na home da Builderall (../_copia/home, 20/10/2026).
// Decisão de 20/10/2026: a 1ª versão migra todas como estão; revisão corretora por corretora depois da virada.
// Encurtadores (bit.ly, shortlify): destino a conferir no painel de cada corretora — ver docs/revisao-conteudo.md.
// Todo clique passa por components/LinkCorretora (broker_click { corretora }).
export type Corretora = { id: string; nome: string; logo: string; analise: string; cadastro: string };

export const CORRETORAS: Record<string, Corretora> = {
  "iq-option": { id: "iq-option", nome: "IQ Option", logo: "/imagens/corretoras/iq-option.webp", analise: "/analise-corretora-iq-option", cadastro: "https://bit.ly/TraderBinarioIQ" },
  quotex: { id: "quotex", nome: "Quotex", logo: "/imagens/corretoras/quotex.webp", analise: "/analise-corretora-quotex", cadastro: "https://broker-qx.pro/sign-up/?lid=172595" },
  binomo: { id: "binomo", nome: "Binomo", logo: "/imagens/corretoras/binomo.webp", analise: "/analise-corretora-binomo", cadastro: "https://binomo.com/pt/promo/l28?a=fb91955b2ff5&ac=BRBinomo" },
  "expert-option": { id: "expert-option", nome: "Expert Option", logo: "/imagens/corretoras/expert-option.webp", analise: "/analise-corretora-expert-option", cadastro: "https://r.shortlify.com/?prefid=1001870" },
};
