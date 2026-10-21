"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import LinkTelegram from "@/components/LinkTelegram";
import { EBOOKS } from "@/lib/ebooks-dados";
import { track } from "@/lib/medicao";
import { PRODUTOS } from "@/lib/produtos-dados";
import { SAIDA_DESCANSANDO, SAIDA_NAO_SABE, TAMANHO_MAX_PERGUNTA, TELEGRAM_BOTAO, type StatusTutor } from "@/lib/tutor/mensagens";

// Janela do Tutor IA do blog (cópia adaptada de site-cristianopereira/components/tutor/TutorJanela.tsx).
// A conversa vive só nesta aba (sessionStorage): fechou a aba, some. O id do navegador (aleatório, sem dado
// pessoal) fica no localStorage para o limite diário valer entre abas.
// Em artigo, guia ou análise (main[data-tutor="pagina"]) abre com "Pergunte sobre este artigo": o servidor lê o texto
// da página pelo endereço (lib/tutor/pagina.ts) — o navegador nunca manda o texto.

type Msg = { role: "user" | "assistant"; content: string; status?: StatusTutor };

const PERGUNTAS_GERAIS = ["Por onde eu começo?", "Quanto arriscar por operação?", "Opções binárias são legais no Brasil?"];
const PERGUNTAS_PAGINA = ["Resuma esta página em 3 pontos", "Qual o principal cuidado aqui?", "Por onde eu começo?"];
const CHAVE_CONVERSA = "tb-tutor-conversa";
const CHAVE_SESSAO = "tb-tutor-sessao";
const CHAVE_VISITANTE = "tb-tutor-visitante";

// sessionStorage/localStorage podem falhar (aba anônima, bloqueio): o chat funciona mesmo assim
function ler(armazem: "local" | "session", chave: string): string | null {
  try { return (armazem === "local" ? localStorage : sessionStorage).getItem(chave); } catch { return null; }
}
function gravar(armazem: "local" | "session", chave: string, valor: string) {
  try { (armazem === "local" ? localStorage : sessionStorage).setItem(chave, valor); } catch { /* sem armazenamento */ }
}
function idDe(armazem: "local" | "session", chave: string): string {
  const atual = ler(armazem, chave);
  if (atual) return atual;
  const novo = crypto.randomUUID();
  gravar(armazem, chave, novo);
  return novo;
}

// ---------- Medição: para onde leva o link da resposta (tutor_cta { destino }) ----------
const sem = (u: string) => u.split(/[?#]/)[0].replace(/\/+$/, "");
const VENDAS = new Set(PRODUTOS.map((p) => sem(p.url)));
const MATERIAIS = new Set(Object.values(EBOOKS).map((e) => sem(e.url)));
type Destino = "ebook" | "ferramentas" | "venda" | "deriv" | "telegram" | "artigo";
function destinoCta(href: string, interno: boolean): Destino | null {
  if (interno) return sem(href) === "/ferramentas" ? "ferramentas" : "artigo";
  if (/^https?:\/\/t\.me\//i.test(href)) return "telegram";
  if (/^https?:\/\/([\w-]+\.)*deriv\.(link|com)/i.test(href)) return "deriv";
  const limpo = sem(href).replace(/^http:/, "https:").replace("://www.", "://");
  if (VENDAS.has(limpo)) return "venda";
  if (MATERIAIS.has(limpo) || /cristianopereira\.com\.br\/(ebook-|planilha)/i.test(limpo)) return "ebook";
  return null;
}

// ---------- Links da resposta ----------
// Aceita, nesta ordem: [texto](url) do markdown · e-mail · URL solta (https://…) · domínio solto
// (cristianopereira.com.br/…, t.me/…, t.deriv.link?t=…) · caminho do site (/pagina).
// Mostra só o texto limpo: nada de colchetes, parênteses ou asteriscos do markdown.
// E-mail → mailto · páginas do blog → mesma aba · sites de fora → nova aba, com o aviso SÓ para o leitor de tela.
const PADRAO_LINK = new RegExp(
  [
    String.raw`\[([^\]\n]+)\]\(\s*([^)\s]+)\s*\)`,                                    // 1-2: [texto](url)
    String.raw`([\w.+-]+@[\w-]+(?:\.[\w-]+)+)`,                                       // 3: e-mail
    String.raw`(https?:\/\/[^\s<>()\[\]]+)`,                                          // 4: URL solta
    String.raw`((?<![@\w.\/-])(?:[a-z0-9-]+\.)+(?:com\.br|com|net|ai|co|me|link)(?:[\/?][^\s<>()\[\]]*)?)`,   // 5: domínio solto
    String.raw`((?<=^|[\s(])\/[a-z0-9][a-z0-9\/-]*)`,                                // 6: caminho do site
  ].join("|"),
  "gi",
);
const SITE = /^https?:\/\/(www\.)?traderbinario\.com\.br/i;

// Destino de um link: caminho interno (mesma aba) ou URL externa (nova aba)
function destino(alvo: string): { href: string; interno: boolean } {
  if (alvo.startsWith("/")) return { href: alvo, interno: true };
  const url = /^https?:\/\//i.test(alvo) ? alvo : `https://${alvo}`;
  if (SITE.test(url)) return { href: url.replace(SITE, "") || "/", interno: true };
  return { href: url, interno: false };
}

function Ligacao({ texto, alvo, chave }: { texto: string; alvo: string; chave: number }) {
  const { href, interno } = destino(alvo);
  const cta = destinoCta(href, interno);
  const clique = () => {
    if (cta) track("tutor_cta", { destino: cta });
    if (cta === "telegram") track("telegram_click", { idioma: "pt" });
  };
  if (interno) return <Link key={chave} href={href} onClick={clique}>{texto}</Link>;
  return (
    <a key={chave} href={href} target="_blank" rel="noopener noreferrer" onClick={clique}>
      {texto}<span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

function comLinks(bruto: string): ReactNode[] {
  // tira sobras de markdown que não são links (negrito, itálico, código, títulos)
  const texto = bruto.replace(/\*\*|__|`/g, "").replace(/^#{1,6}\s+/gm, "");
  const partes: ReactNode[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(PADRAO_LINK)) {
    const inicio = m.index ?? 0;
    partes.push(texto.slice(ultimo, inicio));
    let sobra = "";
    if (m[1] && m[2]) {
      partes.push(<Ligacao key={inicio} chave={inicio} texto={m[1].trim()} alvo={m[2]} />);
    } else {
      let achado = m[0];
      sobra = achado.match(/[.,;:!?)]+$/)?.[0] ?? "";   // pontuação no fim não faz parte do link
      achado = achado.slice(0, achado.length - sobra.length);
      if (m[3]) partes.push(<a key={inicio} href={`mailto:${achado}`}>{achado}</a>);
      else partes.push(<Ligacao key={inicio} chave={inicio} texto={achado} alvo={achado} />);
    }
    partes.push(sobra);
    ultimo = inicio + m[0].length;
  }
  partes.push(texto.slice(ultimo));
  return partes;
}

function SaidaTelegram({ status }: { status?: StatusTutor }) {
  return (
    <p onClickCapture={(e) => { if ((e.target as HTMLElement).closest("a")) track("tutor_cta", { destino: "telegram" }); }}>
      {status === "nao_sabe" ? SAIDA_NAO_SABE : SAIDA_DESCANSANDO}{" "}
      <LinkTelegram idioma="pt" className="tutor__tg" novaAba="(abre em nova aba)">{TELEGRAM_BOTAO}</LinkTelegram>
    </p>
  );
}

// Título da página de conteúdo aberta (artigo, guia ou análise) — null nas outras páginas
function tituloDaPagina(): string | null {
  const h1 = document.querySelector('main[data-tutor="pagina"] h1');
  return h1?.textContent?.trim() || null;
}

export default function TutorJanela({ onFechar }: { onFechar: () => void }) {
  const uid = useId();
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try { return JSON.parse(ler("session", CHAVE_CONVERSA) ?? "[]") as Msg[]; } catch { return []; }
  });
  const [pagina] = useState(tituloDaPagina);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState("");
  const janelaRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLTextAreaElement>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => { gravar("session", CHAVE_CONVERSA, JSON.stringify(msgs)); fimRef.current?.scrollIntoView({ block: "end" }); }, [msgs]);
  useEffect(() => { campoRef.current?.focus(); }, []);

  const enviar = useCallback(async (pergunta: string) => {
    const p = pergunta.trim();
    if (!p || enviando) return;
    if (p.length > TAMANHO_MAX_PERGUNTA) { setAviso(`Escreva até ${TAMANHO_MAX_PERGUNTA} caracteres.`); return; }
    setAviso("");
    // O histórico que vai para o servidor: só as trocas respondidas (sem as mensagens de saída do Telegram)
    const historico = msgs.filter((m) => m.role === "user" || m.status === "ok").map(({ role, content }) => ({ role, content }));
    setMsgs((atual) => [...atual, { role: "user", content: p }]);
    setTexto("");
    setEnviando(true);
    let nova: Msg;
    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: p, historico,
          sessao: idDe("session", CHAVE_SESSAO), visitante: idDe("local", CHAVE_VISITANTE),
          pagina: window.location.pathname,
        }),
      });
      const d = await r.json().catch(() => null);
      if (r.status === 400 && typeof d?.mensagem === "string") { setAviso(d.mensagem); nova = { role: "assistant", content: "", status: "erro_ia" }; }
      else if (d?.status === "ok" && typeof d.resposta === "string") nova = { role: "assistant", content: d.resposta, status: "ok" };
      else nova = { role: "assistant", content: "", status: (d?.status as StatusTutor) ?? "erro_ia" };
    } catch {
      nova = { role: "assistant", content: "", status: "erro_ia" };
    }
    setMsgs((atual) => [...atual, nova]);
    setEnviando(false);
    campoRef.current?.focus();
  }, [enviando, msgs]);

  // Esc fecha; Tab fica dentro da janela (ela cobre a tela no celular)
  const onTeclado = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { e.stopPropagation(); onFechar(); return; }
    if (e.key !== "Tab" || !janelaRef.current) return;
    const focaveis = janelaRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea:not([disabled])");
    if (!focaveis.length) return;
    const primeiro = focaveis[0], ultimoEl = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimoEl.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimoEl) { e.preventDefault(); primeiro.focus(); }
  };

  return (
    <div ref={janelaRef} className="tutor__janela" role="dialog" aria-modal="true" aria-labelledby={`${uid}-titulo`} onKeyDown={onTeclado}>
      <header className="tutor__topo">
        <h2 className="tutor__titulo" id={`${uid}-titulo`}>Tutor do <em>Trader Binário</em></h2>
        <button type="button" className="tutor__fechar" onClick={onFechar} aria-label="Fechar o tutor">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </header>

      <div className="tutor__conversa" aria-live="polite">
        <div className="tutor__msg tutor__msg--ia">
          <p>Oi! Sou o tutor do blog, uma IA. Tiro dúvidas sobre opções binárias, forex, robôs traders, MetaTrader, gestão de risco e corretoras.</p>
          {pagina && <p className="tutor__pagina"><strong>Pergunte sobre este artigo:</strong> {pagina}</p>}
        </div>
        {msgs.length === 0 && (
          <div className="tutor__prontas">
            {(pagina ? PERGUNTAS_PAGINA : PERGUNTAS_GERAIS).map((q) => (
              <button key={q} type="button" className="tutor__pronta" onClick={() => enviar(q)}>{q}</button>
            ))}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "tutor__msg tutor__msg--voce" : "tutor__msg tutor__msg--ia"}>
            {m.role === "user" ? <p>{m.content}</p>
              : m.status === "ok" ? m.content.split(/\n{2,}/).map((par, j) => <p key={j}>{comLinks(par)}</p>)
              : <SaidaTelegram status={m.status} />}
          </div>
        ))}
        {enviando && <div className="tutor__msg tutor__msg--ia tutor__pensando"><p>Pensando…</p></div>}
        <div ref={fimRef} />
      </div>

      <form className="tutor__form" onSubmit={(e) => { e.preventDefault(); enviar(texto); }}>
        <label className="sr-only" htmlFor={`${uid}-campo`}>Sua pergunta</label>
        <textarea
          ref={campoRef} id={`${uid}-campo`} className="tutor__campo" rows={2} maxLength={TAMANHO_MAX_PERGUNTA}
          placeholder={pagina ? "Pergunte sobre este artigo" : "Escreva sua pergunta"} value={texto} disabled={enviando}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(texto); } }}
          aria-describedby={`${uid}-contador`}
        />
        <div className="tutor__acoes">
          <span className="tutor__contador" id={`${uid}-contador`}>{texto.length}/{TAMANHO_MAX_PERGUNTA}</span>
          <button type="submit" className="tutor__enviar" disabled={enviando || !texto.trim()}>Enviar</button>
        </div>
        {aviso && <p className="tutor__aviso-erro" role="alert">{aviso}</p>}
        <p className="tutor__privacidade">
          Não compartilhe dados pessoais. As conversas ficam salvas por 6 meses. <Link href="/politica-de-privacidade">Política de privacidade</Link>
        </p>
      </form>
    </div>
  );
}
