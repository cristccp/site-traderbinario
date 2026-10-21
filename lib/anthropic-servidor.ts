import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Conexão com a API do Claude (Tutor IA do blog) — SÓ no servidor. Cópia de site-cristianopereira/lib/anthropic-servidor.ts.
// A chave fica em ANTHROPIC_API_KEY (.env.local e Vercel). NUNCA usar o prefixo NEXT_PUBLIC_.

export const MODELO_TUTOR = "claude-haiku-5-5";

// Preços em US$ por MILHÃO de tokens (Claude Haiku 5.5, prompts até 100 mil tokens).
// Escrita no cache = 1,25 × a entrada (primeira vez que a base entra no cache em cada janela de 5 min).
export const PRECO_USD_POR_MILHAO = {
  entrada: 0.10,
  saida: 0.50,
  leituraCache: 0.01,
  escritaCache: 0.125,
} as const;

let cliente: Anthropic | null = null;

export function anthropicServidor(): Anthropic {
  if (cliente) return cliente;
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) throw new Error("Falta a variável ANTHROPIC_API_KEY (.env.local ou Vercel).");
  // maxRetries 1: se a API falhar, a pessoa não fica esperando — cai na saída do Telegram
  cliente = new Anthropic({ apiKey: chave, maxRetries: 1, timeout: 30_000 });
  return cliente;
}

// Custo estimado de UMA resposta, a partir do "usage" que a API devolve
export function custoUsd(u: {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}): number {
  const p = PRECO_USD_POR_MILHAO;
  const total =
    u.input_tokens * p.entrada +
    u.output_tokens * p.saida +
    (u.cache_read_input_tokens ?? 0) * p.leituraCache +
    (u.cache_creation_input_tokens ?? 0) * p.escritaCache;
  return total / 1_000_000;
}
