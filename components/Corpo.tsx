import CaixaEbook from "@/components/CaixaEbook";
import Calculadora from "@/components/Calculadora";
import CardsCorretoras from "@/components/CardsCorretoras";
import LinkCorretora from "@/components/LinkCorretora";
import LinkDeriv from "@/components/LinkDeriv";
import { CORRETORAS } from "@/lib/corretoras";
import VideoClique from "@/components/VideoClique";
import { textos } from "@/lib/i18n";
import type { Idioma } from "@/lib/i18n/tipos";
import type { Ebook } from "@/lib/ebooks";
import type { Bloco } from "@/lib/markdown";

// O texto do artigo/análise: HTML do Markdown (gerado no servidor) + os blocos especiais do design.
// `ebook`: e-book recomendado (lib/ebooks.ts) para o bloco "ebook" que lib/conteudo.ts marca no meio do texto.
export default function Corpo({ blocos, idioma, pagina, ebook }: { blocos: Bloco[]; idioma: Idioma; pagina: string; ebook?: Ebook }) {
  const t = textos(idioma);
  return (
    <>
      {blocos.map((b, i) => {
        switch (b.tipo) {
          case "html":
            return <div key={i} className="prose" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "sessoes":
            return (
              <div key={i} className="sessoes">
                {b.itens.map((s) => (
                  <div key={s.nome} className={s.destaque ? "cartao sessao sessao--destaque" : "cartao sessao"}>
                    <div className="rotulo">{s.nome}</div>
                    <div className="sessao__horario">{s.horario}</div>
                    <div className="sessao__texto">{s.texto}</div>
                  </div>
                ))}
              </div>
            );
          case "naPratica":
            return (
              <div key={i} className="na-pratica">
                <div className="rotulo rotulo--ciano">{t.artigo.naPratica}</div>
                <div className="prose prose--caixa" dangerouslySetInnerHTML={{ __html: b.html }} />
              </div>
            );
          case "aviso":
            return <div key={i} className="aviso-texto prose prose--caixa" role="note" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "selos":
            return <div key={i} className="selos" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "deriv":
            return (
              <p key={i} className="cta-texto">
                <LinkDeriv local={b.local} pagina={pagina} className="botao" novaAba={t.novaAba}>{b.texto}</LinkDeriv>
                <span className="aviso-curto">{t.deriv.lateralRisco}</span>
              </p>
            );
          case "corretora": {
            const k = CORRETORAS[b.id];
            if (!k) throw new Error(`Corretora desconhecida: ${b.id}`);
            if (!k.cadastro) return null;   // sem link de cadastro confirmado
            return (
              <p key={i} className="cta-texto">
                <LinkCorretora id={k.id} href={k.cadastro} className="botao" novaAba={t.novaAba}>{b.texto}</LinkCorretora>
                <span className="aviso-curto">{t.deriv.lateralRisco}</span>
              </p>
            );
          }
          case "corretoras":
            return <CardsCorretoras key={i} ids={b.ids} idioma={idioma} pagina={pagina} />;
          case "video":
            return <VideoClique key={i} id={b.id} titulo={b.titulo} play={t.video.play} aria={t.video.aria} />;
          case "ebook":
            return ebook ? <CaixaEbook key={i} ebook={ebook} idioma={idioma} pagina={pagina} local="meio" /> : null;
          case "calculadora":
            return <Calculadora key={i} modo={b.modo} idioma={idioma} />;
        }
      })}
    </>
  );
}
