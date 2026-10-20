import LinkDeriv from "@/components/LinkDeriv";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Lateral FIXA do artigo (no computador acompanha a leitura; no celular vai para o fim):
// Deriv (com aviso de risco) · Trader Bots Club · Ideal Trade · e-book Gestão de Risco.
export default function LateralArtigo({ idioma, pagina }: { idioma: Idioma; pagina: string }) {
  const t = textos(idioma);
  const d = t.deriv;
  return (
    <aside className="lateral" aria-label={t.lateral.aria}>
      <div className="lateral__fixa">
        <div className="cartao cartao--brilho lateral__deriv">
          <span className="rotulo">{d.rotulo}</span>
          <span className="lateral__nome">{d.nome}</span>
          <span className="lateral__texto">{d.lateralTexto}</span>
          <LinkDeriv local="lateral" pagina={pagina} className="botao botao--pequeno" novaAba={t.novaAba}>{d.lateralBotao}</LinkDeriv>
          <span className="aviso-curto">{d.lateralRisco}</span>
        </div>
        {t.lateral.cards.map((c) => (
          <a key={c.titulo} className="cartao lateral__card" href={c.href} target="_blank" rel="noopener noreferrer">
            <span className="rotulo rotulo--ciano">{c.rotulo}</span>
            <span className="lateral__titulo">{c.titulo}</span>
            <span className="lateral__texto">{c.texto}</span>
            <span className="sr-only">{t.novaAba}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
