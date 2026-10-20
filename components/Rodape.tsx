import PreferenciasCookies from "@/components/cookies/PreferenciasCookies";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Rodapé de todas as páginas: aviso de risco COMPLETO e legível, links de afiliado, "não somos corretora",
// conteúdo educativo, política (do site principal, no idioma) e preferências de cookies.
export default function Rodape({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma).rodape;
  const novaAba = textos(idioma).novaAba;
  return (
    <footer className="rodape">
      <div className="wrap rodape__wrap">
        <p className="rodape__risco">⚠️ {t.risco}</p>
        <p className="rodape__texto">{t.afiliado} {t.corretora} {t.educativo}</p>
        <div className="rodape__links">
          <span>{t.copyright}</span>
          <a href={t.politicaHref} target="_blank" rel="noopener noreferrer">{t.politica}<span className="sr-only"> {novaAba}</span></a>
          <PreferenciasCookies label={t.preferencias} />
          <a href="https://cristianopereira.com.br" target="_blank" rel="noopener noreferrer">{t.siteCristiano}<span className="sr-only"> {novaAba}</span></a>
        </div>
      </div>
    </footer>
  );
}
