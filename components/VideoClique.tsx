"use client";

import { useState } from "react";
import { IconePlay } from "@/components/Icones";

// Vídeo do YouTube que SÓ carrega no clique (nada do YouTube pesa na abertura da página — Lighthouse).
// Antes do clique: uma capa simples com o título; depois, o player (youtube-nocookie, sem cookie antes de dar play).
export default function VideoClique({ id, titulo, play, aria }: { id: string; titulo: string; play: string; aria: string }) {
  const [ligado, setLigado] = useState(false);
  return (
    <div className="video" aria-label={aria} role="region">
      {ligado ? (
        <iframe className="video__player" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" className="video__capa" onClick={() => setLigado(true)}>
          <span className="video__play"><IconePlay /></span>
          <span className="video__titulo">{titulo}</span>
          <span className="video__acao">{play}</span>
        </button>
      )}
    </div>
  );
}
