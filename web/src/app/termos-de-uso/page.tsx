import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-[#FBF7F4] px-4 py-8 text-[#1C1917]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <Logo size="md" />
          <Link href="/register" className="text-sm font-medium text-[#EA580C] hover:underline">Voltar</Link>
        </div>

        <h1 className="text-3xl font-bold">Termos de Uso</h1>
        <p className="mt-3 text-sm text-[#78716C]">Ultima atualizacao: 13 de maio de 2026.</p>

        <section className="mt-8 space-y-5 text-sm leading-6 text-[#57534E]">
          <p>
            O MeVeUm oferece ferramentas para restaurantes gerenciarem cardapio,
            pedidos, clientes, entregas e metricas operacionais.
          </p>
          <p>
            Ao criar uma conta, voce se responsabiliza por manter dados corretos,
            proteger suas credenciais e usar a plataforma de acordo com a lei.
          </p>
          <p>
            Podemos evoluir funcionalidades, suspender acessos abusivos e ajustar
            estes termos conforme o produto amadurecer.
          </p>
        </section>
      </div>
    </main>
  );
}
