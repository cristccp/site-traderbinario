import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Conexão com o Supabase (projeto cpt-site, o mesmo do site principal) usando a CHAVE SECRETA — SÓ no servidor.
// "server-only": se algum componente do navegador importar este arquivo, o build falha.
// As variáveis ficam no .env.local (computador) e nas Environment Variables da Vercel.
// NUNCA usar o prefixo NEXT_PUBLIC_ nelas (isso mandaria a chave para o navegador).

let cliente: SupabaseClient | null = null;

export function supabaseServidor(): SupabaseClient {
  if (cliente) return cliente;
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SECRET_KEY;
  // Erro claro com o NOME da variável que falta (nunca com o valor)
  if (!url) throw new Error("Falta a variável SUPABASE_URL (.env.local ou Vercel).");
  if (!chave) throw new Error("Falta a variável SUPABASE_SECRET_KEY (.env.local ou Vercel).");
  cliente = createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cliente;
}

// Registro de cada passo do tutor no log da Vercel, SEM dado pessoal:
// só a caixa, o assunto e se deu certo (e o código do erro, nunca a mensagem nem a pergunta).
export function registrar(caixa: string, material: string, ok: boolean, codigo?: string) {
  const linha = JSON.stringify({ caixa, material, ok, ...(codigo ? { codigo } : {}) });
  if (ok) console.log(linha);
  else console.error(linha);
}
