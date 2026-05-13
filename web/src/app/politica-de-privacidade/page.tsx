import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#FBF7F4] px-4 py-8 text-[#1C1917]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <Logo size="md" />
          <Link href="/register" className="text-sm font-medium text-[#EA580C] hover:underline">Voltar</Link>
        </div>

        <h1 className="text-3xl font-bold">Politica de Privacidade</h1>
        <p className="mt-3 text-sm text-[#78716C]">Ultima atualizacao: 13 de maio de 2026.</p>

        <section className="mt-8 space-y-5 text-sm leading-6 text-[#57534E]">
          <p>
            Coletamos dados necessarios para autenticar usuarios, operar lojas,
            registrar pedidos e melhorar a experiencia do restaurante.
          </p>
          <p>
            As informacoes de clientes e pedidos devem ser usadas apenas para
            atendimento, entrega, suporte e operacao legitima do estabelecimento.
          </p>
          <p>
            O acesso aos dados administrativos deve respeitar os perfis de usuario
            e as politicas de seguranca definidas pela loja.
          </p>
        </section>
      </div>
    </main>
  );
}
