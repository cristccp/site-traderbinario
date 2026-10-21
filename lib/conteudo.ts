import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse as lerYaml } from "yaml";
import { IDIOMAS, type Idioma } from "@/lib/i18n/tipos";
import { aplicarGlossario } from "@/lib/glossario";
import { blocos, type Bloco, type ItemIndice } from "@/lib/markdown";

// CAMADA ÚNICA DE CONTEÚDO do site. Hoje lê os arquivos de content/ (Markdown + frontmatter YAML);
// amanhã lê a tabela `artigos` do Supabase (docs/tabela-artigos.md) — só ESTE arquivo muda, as páginas não.
// Regra de ouro: o site só mostra status "publicado" (rascunho e aprovado ficam fora, como no Painel CPT).
// Arquivo: content/<pasta>/<slug>.<idioma>.md   (pasta: artigos | analises | guias | paginas | categorias)

export type Tipo = "artigo" | "analise" | "guia" | "pagina" | "categoria";   // guia = página da raiz com o modelo de artigo; categoria = /c/<slug>
export type Status = "rascunho" | "aprovado" | "publicado" | "arquivado";

const PASTA: Record<Tipo, string> = { artigo: "artigos", analise: "analises", guia: "guias", pagina: "paginas", categoria: "categorias" };
const RAIZ = path.join(process.cwd(), "content");
const PALAVRAS_POR_MINUTO = 200;

export type Link = { titulo: string; href: string };
export type Pergunta = { p: string; r: string };

export type Conteudo = {
  tipo: Tipo;
  idioma: Idioma;
  slug: string;
  status: Status;
  titulo: string;
  tituloDestaque?: string;            // trecho do título em itálico ciano (DLS)
  resumo?: string;
  seo: { title: string; description: string };
  categoria?: { nome: string; href: string };
  trilha?: string;                    // último item da trilha (breadcrumb)
  autor?: string;
  publicadoEm?: string | null;        // AAAA-MM-DD
  atualizadoEm?: string | null;
  capa?: { src: string; alt: string; largura: number; altura: number };
  relacionados?: Link[];
  emResumo?: string[];                // "Em 30 segundos" abaixo do título (opcional; textos do Cowork)
  ebook?: string;                     // e-book recomendado (opcional; sobrepõe a regra de lib/ebooks.ts)
  faq?: Pergunta[];
  // Só nas análises
  corretora?: { id?: string; nome: string; logo?: string; linha: string; rotulo?: string; cadastro?: string; nota?: string };
  ficha?: { rotulo: string; valor: string }[];
  pros?: string[];
  contras?: string[];
  outras?: { nome: string; href: string }[];
  // Calculados
  minutos: number;
  blocos: Bloco[];
  indice: ItemIndice[];
  extra: Record<string, unknown>;     // campos próprios de uma página (ex.: home)
};

const CAMPOS = new Set(["tipo", "idioma", "slug", "status", "titulo", "tituloDestaque", "resumo", "seo", "categoria", "trilha", "autor",
  "publicadoEm", "atualizadoEm", "capa", "relacionados", "faq", "corretora", "ficha", "pros", "contras", "outras", "emResumo", "ebook"]);

function ler(arquivo: string): Conteudo {
  const bruto = readFileSync(arquivo, "utf8").replace(/\r\n/g, "\n");
  const m = bruto.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Sem frontmatter: ${arquivo}`);
  const dados = (lerYaml(m[1]) ?? {}) as Record<string, unknown>;
  const corpo = m[2].trim();
  const comTexto = dados.tipo === "artigo" || dados.tipo === "guia";   // caixa de e-book e dicas do glossário: só artigo e guia
  const { lista: listaBase, indice } = blocos(comTexto ? marcarEbook(corpo) : corpo);
  const lista = comTexto ? aplicarGlossario(listaBase) : listaBase;
  const palavras = corpo.split(/\s+/).filter(Boolean).length;
  const extra = Object.fromEntries(Object.entries(dados).filter(([k]) => !CAMPOS.has(k)));
  const c = { ...dados, minutos: Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO)), blocos: lista, indice, extra } as Conteudo;
  conferirSeo(c, arquivo);
  return c;
}

// Caixa do e-book no meio do texto: no fim da seção do 2º título (logo antes do 3º "## "), para não separar um título
// do texto dele. Com menos de 3 títulos: no fim do texto, antes do aviso final (:::aviso) se houver.
function marcarEbook(corpo: string): string {
  const MARCA = "\n\n:::ebook meio\n:::\n";
  const linhas = corpo.split("\n");
  let dentro = false, h2 = 0;
  for (let i = 0; i < linhas.length; i++) {
    if (/^:::[a-z-]/.test(linhas[i])) dentro = true;
    else if (/^:::\s*$/.test(linhas[i])) dentro = false;
    else if (!dentro && /^## /.test(linhas[i]) && ++h2 === 3) {
      linhas.splice(i, 0, ":::ebook meio", ":::", "");
      return linhas.join("\n");
    }
  }
  const aviso = corpo.match(/\n:::aviso\n[\s\S]*?\n:::\s*$/);
  return aviso ? corpo.slice(0, aviso.index) + MARCA + corpo.slice(aviso.index) : corpo + MARCA;
}

// Em desenvolvimento: avisa no terminal se o SEO passar dos limites do blog (title ≤ 60, description ≤ 155).
function conferirSeo(c: Conteudo, arquivo: string) {
  if (process.env.NODE_ENV === "production") return;
  if (c.seo.title.length > 60) console.warn(`[seo] title com ${c.seo.title.length} caracteres (máx. 60): ${arquivo}`);
  if (c.seo.description.length > 155) console.warn(`[seo] description com ${c.seo.description.length} caracteres (máx. 155): ${arquivo}`);
}

// Todos os arquivos (lidos uma vez por build/requisição)
const todos = cache((): Conteudo[] =>
  (Object.keys(PASTA) as Tipo[]).flatMap((tipo) => {
    const pasta = path.join(RAIZ, PASTA[tipo]);
    return readdirSync(pasta).filter((f) => f.endsWith(".md")).map((f) => ler(path.join(pasta, f)));
  }),
);

const publicados = () => todos().filter((c) => c.status === "publicado");

export function listar({ tipo, idioma }: { tipo: Tipo; idioma: Idioma }): Conteudo[] {
  return publicados()
    .filter((c) => c.tipo === tipo && c.idioma === idioma)
    .sort((a, b) => (b.atualizadoEm ?? b.publicadoEm ?? "").localeCompare(a.atualizadoEm ?? a.publicadoEm ?? ""));
}

export function buscar(tipo: Tipo, slug: string, idioma: Idioma): Conteudo | null {
  return publicados().find((c) => c.tipo === tipo && c.slug === slug && c.idioma === idioma) ?? null;
}

// Em quais idiomas esta página existe (publicada) — hreflang, sitemap e seletor só usam estes.
export function idiomasDisponiveis(tipo: Tipo, slug: string): Idioma[] {
  return IDIOMAS.filter((i) => buscar(tipo, slug, i));
}

// Endereço de cada conteúdo, com o prefixo do idioma (PT na raiz, /en e /es).
export const PREFIXO: Record<Idioma, string> = { pt: "", en: "/en", es: "/es" };
export function caminho(tipo: Tipo, slug: string, idioma: Idioma): string {
  const base = tipo === "artigo" ? `/blog/${slug}` : tipo === "categoria" ? `/c/${slug}` : tipo === "pagina" && slug === "home" ? "" : `/${slug}`;
  return `${PREFIXO[idioma]}${base}` || "/";
}

// Páginas de uma categoria (/c/<slug>): artigos, guias e análises cujo "categoria.nome" é o nome da categoria.
export function daCategoria(nome: string, idioma: Idioma): Conteudo[] {
  return publicados()
    .filter((c) => c.idioma === idioma && c.categoria?.nome === nome && ["artigo", "guia", "analise"].includes(c.tipo))
    .sort((a, b) => (b.atualizadoEm ?? b.publicadoEm ?? "").localeCompare(a.atualizadoEm ?? a.publicadoEm ?? "") || a.titulo.localeCompare(b.titulo));
}
