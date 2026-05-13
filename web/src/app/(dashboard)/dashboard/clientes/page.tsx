"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { listarClientes } from "@/lib/api/clientes.api";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Cliente } from "@/types";

function FrequenciaBadge({ total }: { total: number }) {
  if (total >= 20) return <Badge variant="warning">VIP</Badge>;
  if (total >= 10) return <Badge variant="success">Frequente</Badge>;
  if (total >= 5) return <Badge variant="info">Regular</Badge>;
  return <Badge variant="secondary">Novo</Badge>;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);

  useEffect(() => {
    listarClientes().then(setClientes).finally(() => setLoading(false));
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1C1917]">Clientes</h1>
        <p className="text-sm text-[#78716C]">{clientes.length} clientes cadastrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-9"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          data-testid="clientes-busca-input"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-16" data-testid="clientes-loading">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <EmptyState
              icon={Users}
              titulo="Nenhum cliente encontrado"
              descricao={busca ? "Tente buscar por outro nome ou telefone." : "Os clientes aparecerão aqui após o primeiro pedido."}
              data-testid="clientes-empty-state"
            />
          ) : (
            <div className="space-y-2" data-testid="clientes-list">
              {clientesFiltrados.map((cliente) => (
                <button
                  key={cliente.id}
                  onClick={() => setSelecionado(selecionado?.id === cliente.id ? null : cliente)}
                  className={`w-full text-left rounded-xl border transition-colors p-4 ${
                    selecionado?.id === cliente.id
                      ? "border-[#EA580C]/40 bg-[#EA580C]/8"
                      : "border-[#E8E0D6] bg-white hover:bg-[#F8F6F3]"
                  }`}
                  data-testid={`cliente-card-${cliente.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F6F3] border border-[#E8E0D6] text-sm font-bold text-[#EA580C]">
                        {cliente.nome[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1C1917]">{cliente.nome}</p>
                        <p className="text-xs text-[#78716C]">{cliente.telefone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FrequenciaBadge total={cliente.totalPedidos} />
                      <span className="text-sm font-semibold text-[#1C1917]">
                        {formatCurrency(cliente.totalGasto)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhe cliente */}
        {selecionado && (
          <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 space-y-4" data-testid="cliente-detalhe">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EA580C] text-lg font-bold text-white">
                {selecionado.nome[0]}
              </div>
              <div>
                <p className="font-bold text-[#1C1917]">{selecionado.nome}</p>
                <p className="text-sm text-[#78716C]">{selecionado.telefone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total de pedidos", val: String(selecionado.totalPedidos) },
                { label: "Total gasto", val: formatCurrency(selecionado.totalGasto) },
                { label: "Ticket médio", val: formatCurrency(selecionado.totalGasto / selecionado.totalPedidos) },
                { label: "Último pedido", val: formatDate(selecionado.ultimoPedido) },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-lg bg-[#F8F6F3] border border-[#E8E0D6] p-3">
                  <p className="text-xs text-[#78716C]">{label}</p>
                  <p className="text-sm font-semibold text-[#1C1917]">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#78716C]">Cliente desde {formatDate(selecionado.criadoEm)}</span>
              <FrequenciaBadge total={selecionado.totalPedidos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
