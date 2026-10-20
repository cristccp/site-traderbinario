// Endereço oficial do blog (sem www): metadataBase, canonical, robots.txt e sitemap.xml.
export const SITE = "https://traderbinario.com.br";
export const NOME_SITE = "Trader Binário";

// Endereços oficiais: só neles o GTM carrega e o Google pode indexar (proxy.ts).
export const HOSTS_OFICIAIS = ["traderbinario.com.br", "www.traderbinario.com.br"];

// Medição (não é segredo). VAZIO de propósito: o contêiner novo do traderbinario o Cristiano cria depois.
// O GA4 (propriedade 310528845) fica DENTRO do GTM — o ID dele não entra no código e nunca gtag direto.
// O GTM só carrega com GTM_ID preenchido E nos HOSTS_OFICIAIS, depois do Consent Mode padrão (components/cookies/ConsentimentoHead).
export const GTM_ID = "";
