import { Fraunces, Poppins } from "next/font/google";

// Fontes da marca (DLS v1.2): Fraunces 600 nos títulos (com itálico para a palavra em ciano) + Poppins no texto.
// O next/font baixa os arquivos na hora do build e serve do próprio site (nada é pedido ao Google pelo visitante).
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "600",
  style: ["normal", "italic"],
  display: "swap",
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
