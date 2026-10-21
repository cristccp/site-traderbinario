import "server-only";
import { caminho, listar, type Tipo } from "@/lib/conteudo";
import REDIRECIONAMENTOS from "@/lib/redirecionamentos.json";

// Trava dos links da resposta do tutor: o modelo às vezes inventa um endereço do blog que não existe (404 nos testes de
// 21/10/2026). Todo caminho interno da resposta é conferido contra as páginas publicadas; o que não existe vira /busca.
// Endereço antigo da tabela de redirecionamentos vira o destino dele. Links de fora do blog não são mexidos.

const FIXAS = ["/", "/ferramentas", "/glossario", "/busca", "/politica-de-privacidade"];
const TIPOS: Tipo[] = ["artigo", "guia", "analise", "categoria"];

let validos: Set<string> | null = null;
let redirecionar: Map<string, string> | null = null;
let guias: Set<string> | null = null;
function carregar() {
  if (validos) return;
  validos = new Set([...FIXAS, ...TIPOS.flatMap((tipo) => listar({ tipo, idioma: "pt" }).map((c) => caminho(tipo, c.slug, "pt")))]);
  redirecionar = new Map(REDIRECIONAMENTOS.filter((r) => !r.de.includes(":")).map((r) => [r.de, r.para]));
  guias = new Set(listar({ tipo: "guia", idioma: "pt" }).map((c) => c.slug));
}

function corrigir(caminhoBruto: string): string {
  carregar();
  const limpo = caminhoBruto.replace(/\/+$/, "") || "/";
  if (validos!.has(limpo)) return caminhoBruto;
  const destino = redirecionar!.get(limpo);
  if (destino) return destino;
  const blog = limpo.match(/^\/blog\/([a-z0-9-]+)$/);   // guia citado como artigo (/blog/<guia>) → /<guia>
  if (blog && guias!.has(blog[1])) return `/${blog[1]}`;
  return "/busca";
}

// Caminho solto (/pagina) ou endereço completo do blog (https://traderbinario.com.br/pagina)
// (o caminho solto só conta depois de início, espaço ou "(": não pega o caminho de um link de outro site)
const PADRAO = /(https?:\/\/(?:www\.)?traderbinario\.com\.br)(\/[a-z0-9][a-z0-9\/-]*)?|(?<=^|[\s(])(\/[a-z0-9][a-z0-9\/-]*)/gi;

export function corrigirLinks(texto: string): string {
  return texto.replace(PADRAO, (achado, dominio?: string, doDominio?: string, solto?: string) => {
    if (dominio) return doDominio ? dominio + corrigir(doDominio) : achado;   // só o domínio = página inicial
    return solto ? corrigir(solto) : achado;
  });
}
