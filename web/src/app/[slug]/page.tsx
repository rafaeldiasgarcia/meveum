import { notFound } from "next/navigation";
import { buscarLojaPorSlug, listarCategorias, listarProdutos } from "@/lib/api/cardapio-publico.api";
import { HeaderLoja } from "@/features/cardapio-publico/components/HeaderLoja";
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
    <div className="flex min-h-screen w-full justify-center bg-[#FDF6F0] py-0 font-sans text-[#1C1917] md:px-6 md:py-10">
      <div className="relative flex min-h-screen w-full max-w-md flex-col gap-6 bg-[#FBF7F4] pb-24 md:min-h-[calc(100vh-5rem)] md:max-w-4xl md:overflow-hidden md:rounded-[2.5rem] md:ring-1 md:ring-[#E8E0D6]/70 lg:max-w-5xl">
        <HeaderLoja loja={loja} />
        <CardapioConteudo
          lojaId={loja.id}
          categorias={categoriasAtivas}
          produtos={produtosAtivos}
          loja={loja}
        />
      </div>
    </div>
  );
}
