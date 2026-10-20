import { NextResponse, type NextRequest } from "next/server";
import { HOSTS_OFICIAIS } from "@/lib/site";

// Fora do Google em todo endereço que NÃO é o domínio oficial (prévias da Vercel, localhost):
// cabeçalho X-Robots-Tag em toda resposta + robots.txt "Disallow: /".
// No domínio oficial (traderbinario.com.br e www) nada muda. Cópia do site principal.
const OFICIAIS = new Set(HOSTS_OFICIAIS);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (OFICIAIS.has(host)) return NextResponse.next();

  const resposta = request.nextUrl.pathname === "/robots.txt"
    ? new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain; charset=utf-8" } })
    : NextResponse.next();
  resposta.headers.set("X-Robots-Tag", "noindex, nofollow");
  return resposta;
}

export const config = {
  matcher: ["/((?!_next/static).*)"],
};
