import Image from "next/image";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";

const FOTO = "/fotos/cristiano-cafe.webp";   // 03-instagram-redes/assets/cristiano-realista/foto-home-cafe.png (convertida)

// AAAA-MM-DD → 20/10/2026 (en: 10/20/2026)
export function formatarData(iso: string, idioma: Idioma) {
  const [a, m, d] = iso.split("-");
  return idioma === "en" ? [m, d, a].join("/") : [d, m, a].join("/");
}

// Linha do autor (abaixo do título): foto, nome, "No mercado desde 2017 · atualizado em …".
export function LinhaAutor({ idioma, atualizadoEm, prefixo }: { idioma: Idioma; atualizadoEm?: string | null; prefixo?: boolean }) {
  const t = textos(idioma).autor;
  const data = atualizadoEm ? " · " + t.atualizado + " " + formatarData(atualizadoEm, idioma) : "";
  return (
    <div className="linha-autor">
      <Image className="foto-redonda" src={FOTO} alt="" width={48} height={48} />
      <div>
        <span className="linha-autor__nome">{prefixo ? t.por + " " : ""}{t.nome}</span>
        <span className="linha-autor__info">{t.linha}{data}</span>
      </div>
    </div>
  );
}

// Caixa do autor (fim do artigo): foto do café, bio e link para o site do Cristiano.
export function CaixaAutor({ idioma }: { idioma: Idioma }) {
  const t = textos(idioma);
  return (
    <div className="caixa-autor">
      <Image className="foto-redonda foto-redonda--grande" src={FOTO} alt={t.autor.fotoAlt} width={72} height={72} />
      <div className="caixa-autor__texto">
        <div className="caixa-autor__nome">{t.autor.nome}</div>
        <p>{t.autor.bio}</p>
        <a href={`https://cristianopereira.com.br${idioma === "pt" ? "" : `/${idioma}`}`} target="_blank" rel="noopener noreferrer">{t.autor.link}<span className="sr-only"> {t.novaAba}</span></a>
      </div>
    </div>
  );
}
