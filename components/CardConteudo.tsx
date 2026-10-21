import Image from "next/image";
import Link from "next/link";

// Card de conteúdo (capa 16:9, rótulo, título, resumo) — o mesmo na home, nas categorias e na busca.
// A capa também é link, mas fica fora do teclado/leitor de tela (aria-hidden) para não repetir o mesmo link duas vezes.
// `aviso`: texto de risco curto (busca: análises de corretora, cuja capa leva o nome da corretora).
export type ItemCard = {
  titulo: string;
  href: string;
  capa?: { src: string; alt: string };
  rotulo?: string;
  resumo?: string;
  aviso?: string;
};

export default function CardConteudo({ item, capaFalta }: { item: ItemCard; capaFalta: string }) {
  return (
    <article className="card-conteudo cartao">
      <Link prefetch={false} className="card-conteudo__capa" href={item.href} tabIndex={-1} aria-hidden="true">
        {item.capa ? (
          <Image src={item.capa.src} alt="" width={640} height={360} sizes="(min-width: 64rem) 380px, (min-width: 40rem) 50vw, 100vw" />
        ) : (
          <span className="card-conteudo__falta">{capaFalta}</span>
        )}
      </Link>
      <div className="card-conteudo__texto">
        {item.rotulo && <span className="rotulo">{item.rotulo}</span>}
        <Link prefetch={false} className="card-conteudo__titulo" href={item.href}>{item.titulo}</Link>
        {item.resumo && <p className="card-conteudo__resumo">{item.resumo}</p>}
        {item.aviso && <span className="aviso-curto">{item.aviso}</span>}
      </div>
    </article>
  );
}
