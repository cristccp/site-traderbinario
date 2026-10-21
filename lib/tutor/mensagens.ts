// Textos fixos do Tutor IA do blog (mesmos do site principal: saída para o grupo do Telegram).
// Usados no servidor (o que fica gravado) e na janela do chat (o que aparece, com o botão do grupo).

import { TELEGRAM } from "@/lib/telegram";

export const TELEGRAM_URL = TELEGRAM.pt;   // grupo PT (lib/telegram.ts, um lugar só)
export const TELEGRAM_BOTAO = "Entrar no grupo";

// Limite estourado, teto do mês, erro da IA
export const SAIDA_DESCANSANDO = "Nosso tutor está descansando agora. Tire sua dúvida no grupo do Telegram →";
// O tutor não sabe responder
export const SAIDA_NAO_SABE = "Essa eu prefiro não chutar. Pergunta lá no grupo do Telegram que a gente te ajuda →";

export type StatusTutor = "ok" | "limite_pessoa" | "teto_mes" | "erro_ia" | "nao_sabe";

export const TAMANHO_MAX_PERGUNTA = 500;
