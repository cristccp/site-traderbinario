// Dados estruturados (schema.org) no HTML do servidor. `<` escapado para não fechar o <script> por acidente.
export default function JsonLd({ dados }: { dados: object | null }) {
  if (!dados) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\u003c") }} />;
}
