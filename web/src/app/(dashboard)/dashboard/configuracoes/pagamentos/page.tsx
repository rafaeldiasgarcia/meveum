"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Banknote, Smartphone, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { listarFormasPagamento, criarFormaPagamento, excluirFormaPagamento } from "@/lib/api/pagamentos.api";
import type { FormaPagamento, TipoFormaPagamento } from "@/types";

type ConfigFormaPagamento = {
  tipo: TipoFormaPagamento;
  label: string;
  descricao: string;
  icon: React.ElementType;
};

const FORMAS_DISPONIVEIS: ConfigFormaPagamento[] = [
  {
    tipo: "PIX",
    label: "PIX",
    descricao: "Pagamento instantâneo via chave PIX",
    icon: Smartphone,
  },
  {
    tipo: "CREDIT_CARD_DELIVERY",
    label: "Cartão de crédito (na entrega)",
    descricao: "Maquininha levada pelo entregador",
    icon: CreditCard,
  },
  {
    tipo: "DEBIT_CARD_DELIVERY",
    label: "Cartão de débito (na entrega)",
    descricao: "Maquininha levada pelo entregador",
    icon: Wallet,
  },
  {
    tipo: "CASH",
    label: "Dinheiro",
    descricao: "Pagamento em espécie na entrega",
    icon: Banknote,
  },
];

export default function PagamentosPage() {
  const [formasAtivas, setFormasAtivas] = useState<FormaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState<TipoFormaPagamento | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await listarFormasPagamento();
      setFormasAtivas(lista);
    } catch {
      toast.error("Erro ao carregar formas de pagamento.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function isAtiva(tipo: TipoFormaPagamento): boolean {
    return formasAtivas.some((f) => f.tipo === tipo && f.ativo);
  }

  function encontrarForma(tipo: TipoFormaPagamento): FormaPagamento | undefined {
    return formasAtivas.find((f) => f.tipo === tipo);
  }

  async function handleToggle(tipo: TipoFormaPagamento) {
    setSalvando(tipo);
    const forma = encontrarForma(tipo);

    try {
      if (!forma) {
        await criarFormaPagamento(tipo);
        toast.success("Forma de pagamento ativada!");
      } else {
        await excluirFormaPagamento(forma.id);
        toast.success("Forma de pagamento desativada.");
      }
      await carregar();
    } catch {
      toast.error("Erro ao atualizar forma de pagamento.");
    } finally {
      setSalvando(null);
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Formas de pagamento</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Escolha quais formas de pagamento seus clientes podem usar no checkout
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="pagamentos-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : (
        <Card data-testid="pagamentos-list">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[var(--color-muted)]" />
              Métodos aceitos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            {FORMAS_DISPONIVEIS.map(({ tipo, label, descricao, icon: Icon }, idx) => {
              const ativa = isAtiva(tipo);
              const carregando = salvando === tipo;

              return (
                <div
                  key={tipo}
                  className={`flex items-center justify-between py-4 ${
                    idx < FORMAS_DISPONIVEIS.length - 1 ? "border-b border-[var(--color-border)]" : ""
                  }`}
                  data-testid={`pagamento-${tipo.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                      ativa
                        ? "bg-[var(--color-orange)]/10 border-[var(--color-orange)]/20"
                        : "bg-[var(--color-surface-2)] border-[var(--color-border)]"
                    }`}>
                      <Icon className={`h-5 w-5 ${ativa ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
                      <p className="text-xs text-[var(--color-muted)]">{descricao}</p>
                    </div>
                  </div>

                  <Switch
                    checked={ativa}
                    disabled={carregando}
                    onCheckedChange={() => handleToggle(tipo)}
                    data-testid={`pagamento-toggle-${tipo.toLowerCase()}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <p className="text-xs text-[var(--color-muted)]">
          <strong className="text-[var(--color-foreground)]">Atenção:</strong> as formas de pagamento ativas
          ficam disponíveis no checkout do cardápio público. Garanta que sua loja consiga processar cada
          método antes de ativá-lo.
        </p>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={carregar} data-testid="pagamentos-recarregar-button">
          Atualizar
        </Button>
      </div>
    </div>
  );
}
