"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { track } from "@/lib/medicao";
import "./tutor.css";

// Botão do Tutor IA (mesmo desenho do site principal): pílula "Tutor IA" no canto inferior direito, acima do banner
// de cookies. Com a janela aberta, o botão some e a janela tem o próprio botão de fechar (X).
// A janela só é baixada quando a pessoa abre o tutor (o site não fica mais pesado). Em todas as páginas PT (RaizSite).
const TutorJanela = dynamic(() => import("./TutorJanela"), { ssr: false });

export default function TutorBotao() {
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const fechar = () => {
    setAberto(false);
    requestAnimationFrame(() => botaoRef.current?.focus());   // o foco volta para o botão
  };

  return (
    <>
      {!aberto && (
        <button ref={botaoRef} type="button" className="tutor__botao" onClick={() => { setAberto(true); track("tutor_open"); }} aria-label="Abrir o Tutor IA do blog" aria-haspopup="dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" /><path d="M8.5 9.5h7M8.5 12.5h4" /></svg>
          <span aria-hidden="true">Tutor IA</span>
        </button>
      )}
      {aberto && <TutorJanela onFechar={fechar} />}
    </>
  );
}
