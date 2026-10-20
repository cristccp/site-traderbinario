// Converte as imagens copiadas da Builderall (../_copia/<página>/imagens) e a foto do Cristiano para WebP leve em public/.
// Rodar com: npm run imagens  (só quando entrar imagem nova; o resultado em public/ é o que vai para o site).
// Nome novo e legível para cada arquivo (o nome antigo da Builderall era só um número).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const COPIA = path.join(RAIZ, "..", "_copia");
const FOTOS = path.join(RAIZ, "..", "..", "..", "03-instagram-redes", "assets", "cristiano-realista");

// [origem, destino em public/, largura máxima]
const LISTA = [
  // Logos das corretoras (home e ficha)
  [path.join(COPIA, "home/imagens/dcc1a470d6239c28ef9b1e9db17a56673525f9846293dbf7ac112f95133bf7b8.jpg"), "imagens/corretoras/deriv.webp", 160],
  [path.join(COPIA, "home/imagens/12091442.png"), "imagens/corretoras/iq-option.webp", 160],
  [path.join(COPIA, "home/imagens/12091448.jpg"), "imagens/corretoras/quotex.webp", 160],
  [path.join(COPIA, "home/imagens/12091446.png"), "imagens/corretoras/binomo.webp", 160],
  [path.join(COPIA, "home/imagens/12091447.png"), "imagens/corretoras/expert-option.webp", 160],

  // Artigo: melhores horários (a imagem do artigo vira a capa)
  [path.join(COPIA, "melhores-horarios-para-operar-opcoes-binarias-no-brasil/imagens/12830069.jpg"), "imagens/melhores-horarios-para-operar-opcoes-binarias-no-brasil/capa.webp", 1280],

  // Análise da Deriv (prints e selos de regulação)
  ...[
    ["12550465.png", "site-deriv"],
    ["12550607.png", "selo-mfsa"],
    ["12550608.png", "selo-fsc-vanuatu"],
    ["12550647.png", "plataformas"],
    ["12550666.png", "dtrader"],
    ["12550676.png", "deriv-bot"],
    ["12550682.png", "smarttrader"],
    ["12550690.png", "binary-bot"],
    ["12550730.png", "deriv-go"],
    ["12550738.png", "deriv-mt5"],
    ["12550816.png", "deriv-x"],
    ["12550867.png", "criar-conta-demo"],
    ["12550875.png", "criar-conta-real"],
    ["12550888.png", "metodos-pagamento"],
    ["12550902.png", "caixa-deposito"],
    ["12550938.png", "suporte"],
  ].map(([de, para]) => [path.join(COPIA, "analise-corretora-deriv/imagens", de), `imagens/analise-corretora-deriv/${para}.webp`, 1200]),

  // Foto do Cristiano (caixa do autor e linha do autor)
  [path.join(FOTOS, "foto-home-cafe.png"), "fotos/cristiano-cafe.webp", 480],
];

for (const [origem, destino, largura] of LISTA) {
  const saida = path.join(RAIZ, "public", destino);
  await mkdir(path.dirname(saida), { recursive: true });
  const info = await sharp(origem).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 80 }).toFile(saida);
  console.log(`${destino}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
