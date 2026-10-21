import Image from "next/image";
import LinkEbook from "@/components/LinkEbook";
import { urlEbook, type Ebook } from "@/lib/ebooks";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Caixa do e-book recomendado (lib/ebooks.ts): completa no meio do texto (capa, nome, linha, botão)
// e compacta antes do FAQ. Só em artigo e guia.
export default function CaixaEbook({ ebook, idioma, pagina, local }: { ebook: Ebook; idioma: Idioma; pagina: string; local: "meio" | "fim" }) {
  const t = textos(idioma);
  const href = urlEbook(ebook, pagina);
  if (local === "fim") {
    return (
      <aside className="ebook ebook--compacto cartao" aria-label={t.ebook.compacto}>
        <Image className="ebook__capa" src={ebook.capa} alt={ebook.capaAlt} width={64} height={115} sizes="64px" />
        <div className="ebook__texto">
          <span className="rotulo rotulo--ciano">{t.ebook.rotulo}</span>
          <span className="ebook__nome">{ebook.nome}</span>
        </div>
        <LinkEbook material={ebook.id} local="fim" href={href} className="botao botao--pequeno" novaAba={t.novaAba}>{t.ebook.botao}</LinkEbook>
      </aside>
    );
  }
  return (
    <aside className="ebook cartao cartao--brilho" aria-label={t.ebook.rotulo}>
      <Image className="ebook__capa" src={ebook.capa} alt={ebook.capaAlt} width={128} height={230} sizes="128px" />
      <div className="ebook__texto">
        <span className="rotulo rotulo--ciano">{t.ebook.rotulo}</span>
        <span className="ebook__nome">{ebook.nome}</span>
        <p className="ebook__linha">{ebook.linha}</p>
        <LinkEbook material={ebook.id} local="meio" href={href} className="botao botao--pequeno" novaAba={t.novaAba}>{t.ebook.botao}</LinkEbook>
      </div>
    </aside>
  );
}
