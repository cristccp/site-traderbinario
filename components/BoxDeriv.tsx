import Image from "next/image";
import Link from "next/link";
import LinkDeriv from "@/components/LinkDeriv";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Box "A corretora que eu uso" (home, ao lado do título). Sempre com o aviso de risco (EN/ES: + "não disponível em todos os países").
export default function BoxDeriv({ idioma, pagina }: { idioma: Idioma; pagina: string }) {
  const t = textos(idioma);
  const d = t.deriv;
  return (
    <aside className="box-deriv cartao cartao--brilho" aria-label={t.home.corretoraAria}>
      <span className="rotulo">{d.rotulo}</span>
      <div className="box-deriv__marca">
        <Image className="box-deriv__logo" src="/imagens/corretoras/deriv.webp" alt="" width={48} height={48} />
        <div>
          <span className="box-deriv__nome">{d.nome}</span>
          <span className="box-deriv__sub">{d.sub}</span>
        </div>
      </div>
      <ul className="box-deriv__itens">
        {d.itens.map((i) => <li key={i}>{i}</li>)}
      </ul>
      <LinkDeriv local="box-home" pagina={pagina} idioma={idioma} className="botao" novaAba={t.novaAba}>{d.botao}</LinkDeriv>
      {idioma === "pt" && <Link className="box-deriv__analise" href="/analise-corretora-deriv">{d.analise}</Link>}   {/* análises só em PT */}
      <p className="aviso-curto">{d.risco}</p>
    </aside>
  );
}
