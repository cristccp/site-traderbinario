import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parse as lerYaml } from "yaml";
import { IDIOMAS, type Idioma } from "@/lib/i18n/tipos";
import { blocos, type Bloco, type ItemIndice } from "@/lib/markdown";

// CAMADA ÚNICA DE CONTEÚDO do site. Hoje lê os arquivos de content/ (Markdown + frontmatter YAML);
// amanhã lê a tabela `artigos` do Supabase (docs/tabela-artigos.md) — só ESTE arquivo muda, as páginas não.
// Regra de ouro: o site só mostra status "publicado" (rascunho e aprovado ficam fora, como no Painel CPT).
// Arquivo: content/<pasta>/<slug>.<idioma>.md   (pasta: artigos | analises | paginas)

export type Tipo = "artigo" | "analise" | "pagina";
export type Status = "rascunho" | "aprovado" | "publicado" | "arquivado";

const PASTA: Record<Tipo, string> = { artigo: "artigos", analise: "analises", pagina: "paginas" };
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
  faq?: Pergunta[];
  // Só nas análises
  corretora?: { nome: string; logo: string; linha: string; rotulo: string };
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
  "publicadoEm", "atualizadoEm", "capa", "relacionados", "faq", "corretora", "ficha", "pros", "contras", "outras"]);

function ler(arquivo: string): Conteudo {
  const bruto = readFileSync(arquivo, "utf8").replace(/\r\n/g, "\n");
  const m = bruto.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Sem frontmatter: ${arquivo}`);
  const dados = (lerYaml(m[1]) ?? {}) as Record<string, unknown>;
  const corpo = m[2].trim();
  const { lista, indice } = blocos(corpo);
  const palavras = corpo.split(/\s+/).filter(Boolean).length;
  const extra = Object.fromEntries(Object.entries(dados).filter(([k]) => !CAMPOS.has(k)));
  const c = { ...dados, minutos: Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO)), blocos: lista, indice, extra } as Conteudo;
  conferirSeo(c, arquivo);
  return c;
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
  const base = tipo === "artigo" ? `/blog/${slug}` : tipo === "analise" ? `/${slug}` : slug === "home" ? "" : `/${slug}`;
  return `${PREFIXO[idioma]}${base}` || "/";
}
