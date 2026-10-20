import type { Metadata } from "next";
import Link from "next/link";
import RaizSite from "@/components/RaizSite";
import Topo from "@/components/Topo";
import { textos } from "@/lib/i18n";

// 404 do site todo. Com um layout raiz por idioma (app/(pt), app/en, app/es) o Next pede este arquivo único
// (experimental.globalNotFound no next.config.ts). Em português (idioma padrão), fora do Google.
// Enquanto os outros artigos não migram, os links do menu e da home para eles caem aqui.
const t = textos("pt");

export const metadata: Metadata = {
  title: t.naoEncontrada.title,
  robots: { index: false, follow: false },
};

export default function PaginaNaoEncontrada() {
  return (
    <RaizSite idioma="pt">
      <Topo idioma="pt" />
      <main id="conteudo" className="wrap nao-encontrada">
        <h1 className="titulo titulo--h2">{t.naoEncontrada.titulo} <em>{t.naoEncontrada.destaque}</em></h1>
        <p className="apoio">{t.naoEncontrada.texto}</p>
        <p><Link className="botao" href="/">{t.naoEncontrada.voltar}</Link></p>
      </main>
    </RaizSite>
  );
}
