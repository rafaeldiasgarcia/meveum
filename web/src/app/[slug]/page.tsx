import { notFound } from "next/navigation";
import { buscarLojaPorSlug, listarCategorias, listarProdutos } from "@/lib/api/cardapio-publico.api";
import { HeaderLoja } from "@/features/cardapio-publico/components/HeaderLoja";
import { NavCategorias } from "@/features/cardapio-publico/components/NavCategorias";
import { CardapioConteudo } from "@/features/cardapio-publico/components/CardapioConteudo";

type Props = { params: Promise<{ slug: string }> };

export default async function CardapioPublicoPage({ params }: Props) {
  const { slug } = await params;

  const loja = await buscarLojaPorSlug(slug).catch(() => null);
  if (!loja) notFound();

  const [categoriasLoja, produtosLoja] = await Promise.all([
    listarCategorias(loja.id),
    listarProdutos(loja.id),
  ]);

  const categoriasAtivas = categoriasLoja
    .filter((c) => c.ativo)
    .sort((a, b) => a.ordem - b.ordem);

  const produtosAtivos = produtosLoja.filter((p) => p.ativo);

  return (
    <div className="min-h-screen bg-[#FFF8F4]">
      <HeaderLoja loja={loja} />
      <NavCategorias categorias={categoriasAtivas} />
      <CardapioConteudo
        lojaId={loja.id}
        categorias={categoriasAtivas}
        produtos={produtosAtivos}
        loja={loja}
      />
    </div>
  );
}
