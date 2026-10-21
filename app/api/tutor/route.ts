import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { anthropicServidor, custoUsd, MODELO_TUTOR } from "@/lib/anthropic-servidor";
import { registrarPasso, type Motivo, type Status } from "@/lib/execucoes";
import { registrar, supabaseServidor } from "@/lib/supabase-servidor";
import { SAIDA_DESCANSANDO, SAIDA_NAO_SABE, TAMANHO_MAX_PERGUNTA, type StatusTutor } from "@/lib/tutor/mensagens";
import { corrigirLinks } from "@/lib/tutor/links";
import { contextoDaPagina } from "@/lib/tutor/pagina";

// POST /api/tutor (Tutor IA do blog) — [3] conferir-limites, [4] responder e [5] guardar-conversa, como no site principal
// (site-cristianopereira/app/api/tutor/route.ts). Regras aprovadas em lib/tutor/regras.md (cópia exata de
// blog/tutor/regras-tutor-blog-v1.1.md); base gerada no build em lib/tutor/base.md (scripts/gerar-base-tutor.mjs).
// Tudo que é gravado leva site = 'traderbinario': limite diário e teto do mês contam SÓ o blog.

const SITE_ID = "traderbinario";
const LIMITE_DIA = Number(process.env.TUTOR_LIMITE_DIA ?? 15);   // perguntas por visitante em 24 h
const TETO_USD = Number(process.env.TUTOR_TETO_USD ?? 10);       // gasto máximo do mês do blog (US$) — 21/10/2026
const MAX_TOKENS = 1200;         // inclui o "pensamento"; as regras pedem ~120 palavras. Se estourar, corta no último parágrafo completo
const MENSAGENS_NA_CONVERSA = 6; // manda só as últimas 6 mensagens (inclui a pergunta nova)

// Linha técnica de formato (a mesma do site principal): fora das regras, só para a janela mostrar o texto limpo
const FORMATO =
  "Formato (técnico): responda em texto simples, sem markdown (sem asteriscos, sem # e sem listas com marcadores). " +
  "Quando indicar uma página, escreva a URL completa ou o caminho do site (ex.: /ferramentas).";

// Regras + conferência final + base lidas uma vez por servidor (o system fica sempre igual → o cache funciona).
// lib/tutor/conferencia.md: cópia exata de blog/tutor/conferencia-final-tutor-blog-v1.md (aprovada pelo Cowork em 21/10/2026),
// depois das regras — corrige desvios vistos nos testes. O build confere as duas cópias (scripts/gerar-base-tutor.mjs).
let instrucoes: { regras: string; base: string } | null = null;
function lerInstrucoes() {
  if (!instrucoes) {
    const pasta = path.join(process.cwd(), "lib", "tutor");
    instrucoes = {
      regras: readFileSync(path.join(pasta, "regras.md"), "utf8") + "\n\n" + readFileSync(path.join(pasta, "conferencia.md"), "utf8"),
      base: readFileSync(path.join(pasta, "base.md"), "utf8"),
    };
  }
  return instrucoes;
}

const idValido = (v: unknown) => (typeof v === "string" && /^[A-Za-z0-9-]{8,64}$/.test(v) ? v : null);

// ---------- Teto do mês (só o blog) ----------
// Soma custo_usd das linhas do blog desde o dia 1º do mês no horário de São Paulo (UTC-3, sem horário de verão desde 2019).
// A soma direta pela API está desligada no banco (PGRST123): soma em páginas de 1000 linhas e para assim que passa do teto.
// O total fica 60 s na memória do servidor (o teto é uma trava de segurança; 1 minuto de atraso não pesa).
let gastoGuardado: { valor: number; ate: number } | null = null;
async function gastoDoMes(sb: SupabaseClient): Promise<number> {
  if (gastoGuardado && gastoGuardado.ate > Date.now()) return gastoGuardado.valor;
  const agoraSP = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const inicio = new Date(Date.UTC(agoraSP.getUTCFullYear(), agoraSP.getUTCMonth(), 1, 3)).toISOString();
  const PAGINA = 1000;
  let soma = 0;
  for (let de = 0; soma < TETO_USD; de += PAGINA) {
    const { data, error } = await sb.from("tutor_conversas").select("custo_usd")
      .eq("site", SITE_ID).gte("criado_em", inicio).order("id").range(de, de + PAGINA - 1);
    if (error) throw new Error(error.code || "consulta");
    soma += (data ?? []).reduce((t, l) => t + Number(l.custo_usd ?? 0), 0);
    if (!data || data.length < PAGINA) break;
  }
  gastoGuardado = { valor: soma, ate: Date.now() + 60_000 };
  return soma;
}

type Guardar = {
  sessao: string; visitante_hash: string; pergunta: string; resposta: string; pagina: string | null;
  modelo: string | null; tokens_entrada: number; tokens_saida: number; custo_usd: number; status: StatusTutor;
};

// ---------- [5] guardar-conversa ----------
// Se o Supabase falhar, a resposta aparece mesmo assim (só não fica guardada). A pergunta NUNCA vai para o log
// nem para o histórico (execucoes): lá entra só o passo e o status.
async function guardarConversa(linha: Guardar, execucaoId: string) {
  const passo = (status: Status, motivo?: Motivo) => registrarPasso({ fluxo: "tutor-ia", execucaoId, passo: "guardar-conversa", status, motivo });
  try {
    const { error } = await supabaseServidor().from("tutor_conversas").insert({ ...linha, site: SITE_ID });
    if (error) { registrar("guardar-conversa", "tutor", false, error.code || "insert"); passo("falha", "erro ao gravar no banco"); }
    else {
      registrar("guardar-conversa", "tutor", true, linha.status);
      passo("ok");
      if (gastoGuardado) gastoGuardado.valor += linha.custo_usd;   // o total guardado acompanha o gasto deste servidor
    }
  } catch {
    registrar("guardar-conversa", "tutor", false, "excecao");
    passo("falha", "Supabase indisponível");
  }
}

export async function POST(request: Request) {
  let corpo: Record<string, unknown>;
  try { corpo = await request.json(); } catch { return NextResponse.json({ ok: false, mensagem: "Pergunta inválida." }, { status: 400 }); }

  const pergunta = typeof corpo.pergunta === "string" ? corpo.pergunta.trim() : "";
  if (pergunta.length < 1 || pergunta.length > TAMANHO_MAX_PERGUNTA) {
    return NextResponse.json({ ok: false, mensagem: `Escreva sua pergunta (até ${TAMANHO_MAX_PERGUNTA} caracteres).` }, { status: 400 });
  }
  // Histórico (tabela execucoes): uma execução por pergunta válida
  const execucaoId = crypto.randomUUID();
  const passo = (nome: "conferir-limites" | "responder", status: Status, motivo?: Motivo) =>
    registrarPasso({ fluxo: "tutor-ia", execucaoId, passo: nome, status, motivo });
  const sessao = idValido(corpo.sessao) ?? crypto.randomUUID();
  const visitante = idValido(corpo.visitante) ?? "sem-id";
  const pagina = typeof corpo.pagina === "string" && corpo.pagina.startsWith("/") ? corpo.pagina.slice(0, 200) : null;

  // Histórico: só as últimas mensagens, só papéis e tamanhos válidos, começando pela pessoa
  const historico: Anthropic.MessageParam[] = (Array.isArray(corpo.historico) ? corpo.historico : [])
    .filter((m): m is { role: "user" | "assistant"; content: string } =>
      !!m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length <= 2000)
    .map((m) => ({ role: m.role, content: m.content }));
  const mensagens = [...historico, { role: "user" as const, content: pergunta }].slice(-MENSAGENS_NA_CONVERSA);
  while (mensagens.length && mensagens[0].role !== "user") mensagens.shift();

  const base: Omit<Guardar, "resposta" | "status"> = {
    sessao, visitante_hash: "", pergunta, pagina, modelo: null, tokens_entrada: 0, tokens_saida: 0, custo_usd: 0,
  };
  // Saída antes da IA (caixa [3]): limite/teto = "ignorado" (proteção, não erro); sem conferir = "falha"
  const saida = async (status: StatusTutor, codigo: string, guardar = true, motivo: Motivo = "Supabase indisponível") => {
    registrar(status === "nao_sabe" ? "responder" : "conferir-limites", "tutor", false, codigo);
    if (status === "limite_pessoa" || status === "teto_mes") passo("conferir-limites", "ignorado", status);
    else passo("conferir-limites", "falha", motivo);
    if (guardar) await guardarConversa({ ...base, resposta: status === "nao_sabe" ? SAIDA_NAO_SABE : SAIDA_DESCANSANDO, status }, execucaoId);
    return NextResponse.json({ ok: true, status, resposta: null });
  };

  // ---------- [3] conferir-limites ----------
  const sal = process.env.TUTOR_SAL;
  if (!sal) return saida("erro_ia", "sem-TUTOR_SAL", false, "configuração ausente");
  // IP só entra no hash (com o id do navegador e o sal) — o IP puro nunca é guardado
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
  base.visitante_hash = createHash("sha256").update(`${visitante}|${ip}|${sal}`).digest("hex");

  try {
    const sb = supabaseServidor();
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: erroConta } = await sb.from("tutor_conversas")
      .select("*", { count: "exact", head: true })
      .eq("site", SITE_ID).eq("visitante_hash", base.visitante_hash).in("status", ["ok", "nao_sabe"]).gte("criado_em", desde);
    if (erroConta) return saida("erro_ia", `limite-${erroConta.code || "consulta"}`, false);
    if ((count ?? 0) >= LIMITE_DIA) return saida("limite_pessoa", "limite-pessoa");

    if ((await gastoDoMes(sb)) >= TETO_USD) return saida("teto_mes", "teto-mes");
  } catch {
    // Sem como conferir os limites (Supabase fora) → por segurança o tutor descansa
    return saida("erro_ia", "limites-excecao", false);
  }
  registrar("conferir-limites", "tutor", true);
  passo("conferir-limites", "ok");

  // ---------- [4] responder ----------
  let texto = "";
  let status: StatusTutor = "ok";
  try {
    const { regras, base: baseConhecimento } = lerInstrucoes();
    const contexto = contextoDaPagina(pagina);   // texto da página atual, lido de content/ (nunca do navegador)
    const resposta = await anthropicServidor().messages.create({
      model: MODELO_TUTOR,
      max_tokens: MAX_TOKENS,
      thinking: { type: "adaptive" },        // pensa antes de responder: aplica a conferência final (testes de 21/10/2026)
      output_config: { effort: "low" },      // conversa curta e barata ("medium" não seguiu melhor as regras nos testes de 21/10/2026)
      system: [
        // Base primeiro e regras DEPOIS, mais perto da pergunta: o modelo segue melhor (testes de 21/10/2026). As duas no cache.
        { type: "text", text: baseConhecimento, cache_control: { type: "ephemeral" } },
        { type: "text", text: `${regras}\n\n${FORMATO}`, cache_control: { type: "ephemeral" } },
        ...(contexto ? [{ type: "text" as const, text: contexto }] : []),                  // depois do cache: não o estraga
      ],
      messages: mensagens,
    });
    base.modelo = MODELO_TUTOR;
    const u = resposta.usage;
    base.tokens_entrada = u.input_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
    base.tokens_saida = u.output_tokens;
    base.custo_usd = custoUsd(u);
    texto = resposta.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    // Estourou o limite: mostra só até o último parágrafo completo (nunca meia frase nem link cortado)
    if (resposta.stop_reason === "max_tokens") {
      const corte = texto.lastIndexOf("\n\n");
      texto = corte > 0 ? texto.slice(0, corte).trim() : "";
    }
    texto = corrigirLinks(texto);   // endereço do blog que não existe vira /busca (lib/tutor/links.ts)

    if (resposta.stop_reason === "refusal" || !texto) status = "nao_sabe";
    else if (/prefiro n[aã]o chutar/i.test(texto)) status = "nao_sabe";
    passo("responder", status === "ok" ? "ok" : "ignorado", status === "ok" ? undefined : "nao_sabe");
    registrar("responder", "tutor", true, `${status}|cache-lido:${u.cache_read_input_tokens ?? 0}|cache-escrito:${u.cache_creation_input_tokens ?? 0}`);
  } catch (e) {
    const codigo = e instanceof Anthropic.AuthenticationError ? "chave"
      : e instanceof Anthropic.RateLimitError ? "limite-anthropic"
      : e instanceof Anthropic.APIError ? `api-${e.status ?? "?"}`
      : "excecao";
    registrar("responder", "tutor", false, codigo);
    passo("responder", "falha", "erro_ia");
    await guardarConversa({ ...base, resposta: SAIDA_DESCANSANDO, status: "erro_ia" }, execucaoId);
    return NextResponse.json({ ok: true, status: "erro_ia", resposta: null });
  }

  // ---------- [5] guardar-conversa → [6] mostrar-resposta (na janela) ----------
  await guardarConversa({ ...base, resposta: status === "nao_sabe" ? SAIDA_NAO_SABE : texto, status }, execucaoId);
  return NextResponse.json({ ok: true, status, resposta: status === "ok" ? texto : null });
}
