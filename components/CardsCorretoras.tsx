import Image from "next/image";
import Link from "next/link";
import LinkCorretora from "@/components/LinkCorretora";
import LinkDeriv from "@/components/LinkDeriv";
import { CORRETORAS } from "@/lib/corretoras";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Cards de corretoras (bloco :::corretoras do texto e a faixa da home): logo, nome, "Análise" e "Cadastre-se",
// sempre com o aviso de risco na própria faixa. Deriv pelo LinkDeriv (lib/deriv.ts); as outras pelo LinkCorretora
// (lib/corretoras.ts). Corretora sem link de cadastro confirmado (ex.: Moneta Markets, TopFX) mostra só "Análise".
const DERIV = { id: "deriv", nome: "Deriv", logo: "/imagens/corretoras/deriv.webp", analise: "/analise-corretora-deriv" };

export default function CardsCorretoras({ ids, idioma, pagina }: { ids: string[]; idioma: Idioma; pagina: string }) {
  const t = textos(idioma);
  return (
    <div className="cards-corretoras">
      <ul className="corretoras__lista">
        {ids.map((id) => {
          const k = id === "deriv" ? DERIV : CORRETORAS[id];
          if (!k) throw new Error(`Corretora desconhecida no bloco :::corretoras: ${id}`);
          return (
            <li key={id} className="cartao corretora">
              {k.logo ? (
                <Image className="corretora__logo" src={k.logo} alt={t.analise.logoAlt + " " + k.nome} width={40} height={40} />
              ) : (
                <span className="corretora__logo corretora__logo--letra" aria-hidden="true">{k.nome.charAt(0)}</span>
              )}
              <span className="corretora__nome">{k.nome}{id === "deriv" && <span className="corretora__selo">{t.deriv.rotulo}</span>}</span>
              <span className="corretora__acoes">
                <Link prefetch={false} href={k.analise}>{t.corretoras.analise}</Link>
                {id === "deriv" ? (
                  <LinkDeriv local="texto" pagina={pagina} idioma={idioma} className="corretora__cadastro" novaAba={t.novaAba}>{t.corretoras.cadastro}</LinkDeriv>
                ) : "cadastro" in k && k.cadastro ? (
                  <LinkCorretora id={id} href={k.cadastro} className="corretora__cadastro" novaAba={t.novaAba}>{t.corretoras.cadastro}</LinkCorretora>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="aviso-curto corretoras__aviso">{t.corretoras.aviso}</p>
    </div>
  );
}
