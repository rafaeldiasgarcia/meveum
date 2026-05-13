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
    setLoading(true);
    listarClientes(busca).then(setClientes).finally(() => setLoading(false));
  }, [busca]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Clientes</h1>
        <p className="text-sm text-[var(--color-muted)]">{clientes.length} clientes cadastrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
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
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
            </div>
          ) : clientes.length === 0 ? (
            <EmptyState
              icon={Users}
              titulo="Nenhum cliente encontrado"
              descricao={busca ? "Tente buscar por outro nome ou telefone." : "Os clientes aparecerão aqui após o primeiro pedido."}
              data-testid="clientes-empty-state"
            />
          ) : (
            <div className="space-y-2" data-testid="clientes-list">
              {clientes.map((cliente) => (
                <button
                  key={cliente.id}
                  onClick={() => setSelecionado(selecionado?.id === cliente.id ? null : cliente)}
                  className={`w-full text-left rounded-[var(--radius-lg)] border transition-colors p-4 ${
                    selecionado?.id === cliente.id
                      ? "border-[var(--color-orange)]/40 bg-[var(--color-orange-dim)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]"
                  }`}
                  data-testid={`cliente-card-${cliente.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm font-bold text-[var(--color-orange)]">
                        {cliente.nome[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[var(--color-foreground)]">{cliente.nome}</p>
                        <p className="text-xs text-[var(--color-muted)]">{cliente.telefone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FrequenciaBadge total={cliente.totalPedidos} />
                      <span className="text-sm font-semibold text-[var(--color-foreground)]">
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
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4" data-testid="cliente-detalhe">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-orange)] text-lg font-bold text-white">
                {selecionado.nome[0]}
              </div>
              <div>
                <p className="font-bold text-[var(--color-foreground)]">{selecionado.nome}</p>
                <p className="text-sm text-[var(--color-muted)]">{selecionado.telefone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total de pedidos", val: String(selecionado.totalPedidos) },
                { label: "Total gasto", val: formatCurrency(selecionado.totalGasto) },
                { label: "Ticket médio", val: formatCurrency(selecionado.totalGasto / selecionado.totalPedidos) },
                { label: "Último pedido", val: formatDate(selecionado.ultimoPedido) },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-muted)]">{label}</p>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted)]">Cliente desde {formatDate(selecionado.criadoEm)}</span>
              <FrequenciaBadge total={selecionado.totalPedidos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
