"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Truck, Store } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { buscarConfigEntrega, salvarConfigEntrega, criarTaxaEntregaDetalhada, removerTaxaEntrega } from "@/lib/api/configuracoes.api";
import type { ConfigEntregaRetirada, TaxaEntrega } from "@/types";

export default function EntregaPage() {
  const [config, setConfig] = useState<ConfigEntregaRetirada>({
    deliveryAtivo: true,
    retiradaAtivo: true,
    pedidoMinimo: 0,
    tempoMedioEntregaMin: 45,
    tempoMedioRetiradaMin: 20,
    taxasEntrega: [],
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [novaTaxa, setNovaTaxa] = useState({ bairro: "", taxa: "", tempoMin: "45" });
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    buscarConfigEntrega()
      .then(setConfig)
      .catch(() => toast.error("Erro ao carregar configurações."))
      .finally(() => setLoading(false));
  }, []);

  async function salvar() {
    setSalvando(true);
    try {
      await salvarConfigEntrega({
        deliveryAtivo: config.deliveryAtivo,
        retiradaAtivo: config.retiradaAtivo,
        pedidoMinimo: config.pedidoMinimo,
        tempoMedioEntregaMin: config.tempoMedioEntregaMin,
        tempoMedioRetiradaMin: config.tempoMedioRetiradaMin,
      });
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setSalvando(false);
    }
  }

  async function adicionarTaxa() {
    if (!novaTaxa.bairro.trim()) {
      toast.error("Informe o nome do bairro.");
      return;
    }
    setAdicionando(true);
    try {
      const loja = await criarTaxaEntregaDetalhada({
        bairro: novaTaxa.bairro,
        taxa: parseFloat(novaTaxa.taxa) || 0,
        tempoMin: parseInt(novaTaxa.tempoMin) || 45,
      });
      setConfig((c) => ({ ...c, taxasEntrega: loja.taxasEntrega }));
      setNovaTaxa({ bairro: "", taxa: "", tempoMin: "45" });
      toast.success("Área de entrega adicionada.");
    } catch {
      toast.error("Erro ao adicionar área.");
    } finally {
      setAdicionando(false);
    }
  }

  async function removerTaxa(taxa: TaxaEntrega) {
    try {
      const loja = await removerTaxaEntrega(taxa.id);
      setConfig((c) => ({ ...c, taxasEntrega: loja.taxasEntrega }));
      toast.success("Área removida.");
    } catch {
      toast.error("Erro ao remover área.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="entrega-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Entrega e Retirada</h1>
        <p className="text-sm text-[var(--color-muted)]">Configure as regras operacionais do seu cardápio</p>
      </div>

      {/* Ativar/desativar modalidades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Modalidades de entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="entrega-modalidades-form">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[var(--color-muted)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Delivery</p>
                <p className="text-xs text-[var(--color-muted)]">Entrega no endereço do cliente</p>
              </div>
            </div>
            <Switch
              checked={config.deliveryAtivo}
              onCheckedChange={(v) => setConfig((c) => ({ ...c, deliveryAtivo: v }))}
              data-testid="entrega-delivery-switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-4 w-4 text-[var(--color-muted)]" />
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Retirada no local</p>
                <p className="text-xs text-[var(--color-muted)]">Cliente retira no estabelecimento</p>
              </div>
            </div>
            <Switch
              checked={config.retiradaAtivo}
              onCheckedChange={(v) => setConfig((c) => ({ ...c, retiradaAtivo: v }))}
              data-testid="entrega-retirada-switch"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configurações gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="entrega-config-form">
          <div className="space-y-1.5">
            <Label>Pedido mínimo (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={config.pedidoMinimo}
              onChange={(e) => setConfig((c) => ({ ...c, pedidoMinimo: parseFloat(e.target.value) || 0 }))}
              data-testid="entrega-pedido-minimo-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tempo médio entrega (min)</Label>
              <Input
                type="number"
                min="1"
                value={config.tempoMedioEntregaMin}
                onChange={(e) => setConfig((c) => ({ ...c, tempoMedioEntregaMin: parseInt(e.target.value) || 45 }))}
                data-testid="entrega-tempo-delivery-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tempo médio retirada (min)</Label>
              <Input
                type="number"
                min="1"
                value={config.tempoMedioRetiradaMin}
                onChange={(e) => setConfig((c) => ({ ...c, tempoMedioRetiradaMin: parseInt(e.target.value) || 20 }))}
                data-testid="entrega-tempo-retirada-input"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={salvar} loading={salvando} data-testid="entrega-salvar-button">
              Salvar configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Taxas por área */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Áreas e taxas de entrega</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3" data-testid="entrega-taxas-list">
          {config.taxasEntrega.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]" data-testid="entrega-taxas-vazio">
              Nenhuma área cadastrada. Adicione abaixo.
            </p>
          )}
          {config.taxasEntrega.map((taxa) => (
            <div
              key={taxa.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3"
              data-testid={`entrega-taxa-${taxa.id}`}
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">{taxa.bairro}</p>
                <p className="text-xs text-[var(--color-muted)]">{taxa.tempoMin} min estimado</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--color-foreground)]">
                  {taxa.taxa === 0 ? "Grátis" : `R$ ${taxa.taxa.toFixed(2)}`}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerTaxa(taxa)}
                  data-testid={`entrega-taxa-remover-${taxa.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </Button>
              </div>
            </div>
          ))}

          {/* Adicionar nova taxa */}
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-3 space-y-3" data-testid="entrega-nova-taxa-form">
            <p className="text-xs font-medium text-[var(--color-muted)]">Adicionar área</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 sm:col-span-1 space-y-1">
                <Label className="text-xs">Bairro</Label>
                <Input
                  value={novaTaxa.bairro}
                  onChange={(e) => setNovaTaxa((n) => ({ ...n, bairro: e.target.value }))}
                  placeholder="Vila Madalena"
                  data-testid="entrega-nova-bairro-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Taxa (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={novaTaxa.taxa}
                  onChange={(e) => setNovaTaxa((n) => ({ ...n, taxa: e.target.value }))}
                  placeholder="0,00"
                  data-testid="entrega-nova-taxa-input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tempo (min)</Label>
                <Input
                  type="number"
                  min="1"
                  value={novaTaxa.tempoMin}
                  onChange={(e) => setNovaTaxa((n) => ({ ...n, tempoMin: e.target.value }))}
                  data-testid="entrega-nova-tempo-input"
                />
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={adicionarTaxa}
              loading={adicionando}
              data-testid="entrega-adicionar-taxa-button"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar área
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
