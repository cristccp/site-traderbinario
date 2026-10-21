import "server-only";
import { after } from "next/server";
import { supabaseServidor } from "@/lib/supabase-servidor";

// Histórico de execuções do blog (mesma tabela "execucoes" do site principal, Supabase cpt-site): cada passo do
// Tutor IA vira UMA linha, com site = 'traderbinario' (o Painel CPT separa os sites por essa coluna).
// Cópia adaptada de site-cristianopereira/lib/execucoes.ts.
// Regra de ouro: o registro NUNCA trava nem atrasa o site — grava depois da resposta e nunca lança erro.
// Sem dado pessoal: só fluxo, passo, status e um MOTIVO da lista fixa abaixo (a pergunta nunca entra aqui).

const TABELA = "execucoes";
const SITE_ID = "traderbinario";

export type Fluxo = "tutor-ia";
export type Status = "ok" | "falha" | "ignorado";

// Motivos permitidos (textos fixos e curtos — não há como entrar pergunta, IP ou chave)
export type Motivo =
  | "Supabase indisponível"
  | "erro ao gravar no banco"
  | "limite_pessoa"
  | "teto_mes"
  | "configuração ausente"
  | "nao_sabe"
  | "erro_ia";

export type Passo = {
  fluxo: Fluxo;
  execucaoId: string;   // crypto.randomUUID() — junta os passos de uma mesma execução
  passo: string;
  status: Status;
  motivo?: Motivo;
  quando?: string;      // hora em que o passo ACONTECEU (as gravações correm em paralelo depois da resposta)
};

// Grava agora. Nunca lança erro.
export async function gravarPasso(p: Passo): Promise<void> {
  try {
    const { error } = await supabaseServidor().from(TABELA).insert({
      site: SITE_ID,
      fluxo: p.fluxo,
      execucao_id: p.execucaoId,
      passo: p.passo,
      status: p.status,
      motivo: p.motivo ? p.motivo.slice(0, 300) : null,
      lead_id: null,
      criado_em: p.quando ?? new Date().toISOString(),
    });
    if (error) console.warn(`[execucoes] falha ao registrar ${p.fluxo}/${p.passo}: ${error.code || "erro"}`);
  } catch {
    console.warn(`[execucoes] falha ao registrar ${p.fluxo}/${p.passo}: excecao`);
  }
}

// Agenda a gravação para DEPOIS da resposta (after). Fora de uma requisição, grava solto, sem esperar.
// A hora é tirada AGORA, no momento do passo — assim o histórico mostra os passos na ordem em que aconteceram.
export function registrarPasso(p: Passo): void {
  const comHora = { ...p, quando: p.quando ?? new Date().toISOString() };
  try {
    after(() => gravarPasso(comHora));
  } catch {
    void gravarPasso(comHora);
  }
}
