import { Suspense } from "react";
import PedidoPublicoConteudo from "./PedidoPublicoConteudo";

export default function PedidoPublicoPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-[#FBF7F4] flex flex-col">
      <header className="bg-[#17100C] px-4 py-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#EA580C] text-sm font-bold text-white">M</span>
        <span className="text-white font-semibold">MeVêUm</span>
      </header>
      <main className="flex-1 flex items-start justify-center p-4 pt-8">
        <Suspense fallback={
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
          </div>
        }>
          <PedidoPublicoConteudo token={params.token} />
        </Suspense>
      </main>
    </div>
  );
}
