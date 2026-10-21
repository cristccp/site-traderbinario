import Link from "next/link";
import PreferenciasCookies from "@/components/cookies/PreferenciasCookies";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import { FIXAS } from "@/lib/rotas-idiomas";

// Rodapé de todas as páginas: aviso de risco COMPLETO e legível, links de afiliado, "não somos corretora",
// conteúdo educativo, política do próprio blog (no idioma), preferências de cookies e o glossário do idioma.
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
          {t.politicaHref.startsWith("/")   // política do próprio blog (mesma aba); link externo abre em nova aba
            ? <Link prefetch={false} href={t.politicaHref}>{t.politica}</Link>
            : <a href={t.politicaHref} target="_blank" rel="noopener noreferrer">{t.politica}<span className="sr-only"> {novaAba}</span></a>}
          <PreferenciasCookies label={t.preferencias} />
          <Link prefetch={false} href={FIXAS.glossario[idioma]}>{t.glossario}</Link>
          <a href={`https://cristianopereira.com.br${idioma === "pt" ? "" : `/${idioma}`}`} target="_blank" rel="noopener noreferrer">{t.siteCristiano}<span className="sr-only"> {novaAba}</span></a>
        </div>
      </div>
    </footer>
  );
}
