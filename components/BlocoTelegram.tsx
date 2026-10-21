import { IconeTelegram } from "@/components/Icones";
import LinkTelegram from "@/components/LinkTelegram";
import Titulo from "@/components/Titulo";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

// Bloco do grupo do Telegram do idioma (EN/ES — copy aprovada, seção 4.3): completo na home e no fim do artigo;
// compacto antes do FAQ, no lugar da caixa de e-book (os e-books são só em PT). Nunca fala em "binary options".
export default function BlocoTelegram({ idioma, compacto = false }: { idioma: Idioma; compacto?: boolean }) {
  const t = textos(idioma);
  const b = t.telegramBloco;
  if (!b) return null;
  if (compacto) {
    return (
      <aside className="telegram-bloco telegram-bloco--compacto cartao" aria-label={b.aria}>
        <LinkTelegram idioma={idioma} className="telegram-bloco__link" novaAba={t.novaAba}><IconeTelegram />{b.compacto}</LinkTelegram>
      </aside>
    );
  }
  return (
    <aside className="telegram-bloco cartao cartao--brilho" aria-label={b.aria}>
      <span className="rotulo rotulo--ciano">{b.rotulo}</span>
      <Titulo nivel="h2" className="titulo titulo--h3" texto={b.titulo} destaque={b.destaque} />
      <p className="telegram-bloco__texto">{b.texto}</p>
      <LinkTelegram idioma={idioma} className="botao" novaAba={t.novaAba}><IconeTelegram />{b.botao}</LinkTelegram>
    </aside>
  );
}
