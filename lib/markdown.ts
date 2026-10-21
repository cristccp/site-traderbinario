import { Marked, type Tokens } from "marked";

// Markdown → blocos da página, tudo no SERVIDOR (nenhum JavaScript vai para o navegador por causa disso).
// Markdown normal vira HTML; os blocos especiais ":::nome … :::" viram componentes do design:
//   :::sessoes        → cards das sessões (uma linha por card: NOME | horário | texto | destaque?)
//   :::na-pratica     → caixa "Na prática"
//   :::aviso          → aviso de risco dentro do texto
//   :::selos          → imagens pequenas lado a lado (selos de regulação)
//   :::deriv <local>  → botão da Deriv (local = texto | final), com o texto do botão dentro
//   :::video <id>     → vídeo do YouTube que só carrega no clique (título dentro)
//   :::corretora <id> → botão de cadastro de UMA corretora (lib/corretoras.ts), com o texto do botão dentro
//   :::corretoras <ids> → cards das corretoras (logo, Análise, Cadastre-se e aviso de risco) — ids de lib/corretoras.ts ou "deriv"
// Imagem: ![alt](/imagens/...webp "LARGURAxALTURA") — a medida evita a página "pular" enquanto carrega.

export type Sessao = { nome: string; horario: string; texto: string; destaque: boolean };
export type Bloco =
  | { tipo: "html"; html: string }
  | { tipo: "sessoes"; itens: Sessao[] }
  | { tipo: "naPratica"; html: string }
  | { tipo: "aviso"; html: string }
  | { tipo: "selos"; html: string }
  | { tipo: "deriv"; local: "texto" | "final"; texto: string }
  | { tipo: "video"; id: string; titulo: string }
  | { tipo: "corretoras"; ids: string[] }
  | { tipo: "corretora"; id: string; texto: string }
  | { tipo: "ebook" }                                   // caixa do e-book recomendado (marcada por lib/conteudo.ts)
  | { tipo: "calculadora"; modo: "risco" | "empate" };   // :::calculadora risco | empate
export type ItemIndice = { id: string; texto: string };

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const textoPuro = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&gt;/g, ">").replace(/&lt;/g, "<").trim();

export function blocos(corpo: string): { lista: Bloco[]; indice: ItemIndice[] } {
  const indice: ItemIndice[] = [];
  const usados = new Set<string>();

  const md = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { tokens, depth }: Tokens.Heading) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(textoPuro(html)) || "secao";
        while (usados.has(id)) id += "-2";
        usados.add(id);
        if (depth === 2) indice.push({ id, texto: textoPuro(html) });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      image({ href, title, text }: Tokens.Image) {
        const [w, h] = (title ?? "").split("x").map(Number);
        const medida = w && h ? ` width="${w}" height="${h}"` : "";
        return `<img src="${href}" alt="${text.replace(/"/g, "&quot;")}"${medida} loading="lazy" decoding="async">`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { href, tokens }: Tokens.Link) {
        const texto = this.parser.parseInline(tokens);
        const externo = /^https?:\/\//.test(href);
        return externo
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${texto}</a>`
          : `<a href="${href}">${texto}</a>`;
      },
    },
  });
  // Toda tabela vai numa caixa com rolagem própria (.tabela): no celular ela rola dentro dela, e a página não rola de lado.
  const html = (s: string) => (md.parse(s, { async: false }) as string)
    .replace(/<table>/g, "<div class=\"tabela\"><table>").replace(/<\/table>/g, "</table></div>");

  const lista: Bloco[] = [];
  const partes = corpo.split(/^:::([a-z-]+)[ \t]*([^\n]*)\n([\s\S]*?)^:::[ \t]*$/m);
  // split com 3 grupos: [texto, nome, argumento, conteúdo, texto, nome, …]
  for (let i = 0; i < partes.length; i += 4) {
    const solto = partes[i]?.trim();
    if (solto) lista.push({ tipo: "html", html: html(solto) });
    const nome = partes[i + 1];
    if (!nome) continue;
    const arg = partes[i + 2].trim();
    const dentro = partes[i + 3].trim();
    switch (nome) {
      case "sessoes":
        lista.push({
          tipo: "sessoes",
          itens: dentro.split("\n").map((l) => {
            const [nomeS, horario, texto, marca] = l.split("|").map((x) => x.trim());
            return { nome: nomeS, horario, texto, destaque: marca === "destaque" };
          }),
        });
        break;
      case "na-pratica": lista.push({ tipo: "naPratica", html: html(dentro) }); break;
      case "aviso": lista.push({ tipo: "aviso", html: html(dentro) }); break;
      case "selos": lista.push({ tipo: "selos", html: html(dentro) }); break;
      case "deriv": lista.push({ tipo: "deriv", local: arg === "final" ? "final" : "texto", texto: dentro }); break;
      case "video": lista.push({ tipo: "video", id: arg, titulo: dentro }); break;
      case "corretora": lista.push({ tipo: "corretora", id: arg, texto: dentro }); break;
      case "corretoras": lista.push({ tipo: "corretoras", ids: arg.split(/\s+/).filter(Boolean) }); break;
      case "ebook": lista.push({ tipo: "ebook" }); break;
      case "calculadora":
        if (arg !== "risco" && arg !== "empate") throw new Error(`Calculadora desconhecida: :::calculadora ${arg}`);
        lista.push({ tipo: "calculadora", modo: arg });
        break;
      default: throw new Error(`Bloco desconhecido: :::${nome}`);
    }
  }
  return { lista, indice };
}

// Destaque do DLS num título: "Melhores horários para operar opções binárias" + "opções binárias"
// → partes para o componente pôr a palavra em itálico ciano.
export function partesTitulo(titulo: string, destaque?: string): { antes: string; em: string; depois: string } {
  const i = destaque ? titulo.toLowerCase().indexOf(destaque.toLowerCase()) : -1;
  if (!destaque || i < 0) return { antes: titulo, em: "", depois: "" };
  return { antes: titulo.slice(0, i), em: titulo.slice(i, i + destaque.length), depois: titulo.slice(i + destaque.length) };
}
