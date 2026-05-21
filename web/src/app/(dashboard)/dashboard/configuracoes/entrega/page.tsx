"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  atualizarTaxaEntrega,
  criarTaxaEntrega,
  listarTaxasEntrega,
  removerTaxaEntrega,
} from "@/lib/api/configuracoes.api";
import type { AreaEntregaRequest, TaxaEntrega, TipoAreaEntrega } from "@/types";

type FormArea = {
  nome: string;
  tipo: TipoAreaEntrega;
  bairro: string;
  cepInicial: string;
  cepFinal: string;
  raioKm: string;
  taxa: string;
  pedidoMinimo: string;
  tempoEstimadoMinutos: string;
};

const TIPO_LABEL: Record<TipoAreaEntrega, string> = {
  NEIGHBORHOOD: "Bairro",
  ZIP_RANGE: "Faixa de CEP",
  RADIUS: "Raio",
};

const formInicial: FormArea = {
  nome: "",
  tipo: "NEIGHBORHOOD",
  bairro: "",
  cepInicial: "",
  cepFinal: "",
  raioKm: "",
  taxa: "",
  pedidoMinimo: "0",
  tempoEstimadoMinutos: "45",
};

function toForm(area: TaxaEntrega | null): FormArea {
  if (!area) return formInicial;
  return {
    nome: area.nome,
    tipo: area.tipo,
    bairro: area.bairro ?? "",
    cepInicial: area.cepInicial ?? "",
    cepFinal: area.cepFinal ?? "",
    raioKm: area.raioKm == null ? "" : String(area.raioKm),
    taxa: String(area.taxa),
    pedidoMinimo: String(area.pedidoMinimo ?? 0),
    tempoEstimadoMinutos: String(area.tempoEstimadoMinutos ?? area.tempoMin ?? 45),
  };
}

function toPayload(form: FormArea): AreaEntregaRequest {
  return {
    nome: form.nome.trim(),
    tipo: form.tipo,
    bairro: form.bairro.trim() || undefined,
    cepInicial: form.cepInicial.trim() || undefined,
    cepFinal: form.cepFinal.trim() || undefined,
    raioKm: form.raioKm ? Number(form.raioKm) : undefined,
    taxa: Number(form.taxa || 0),
    pedidoMinimo: Number(form.pedidoMinimo || 0),
    tempoEstimadoMinutos: Number(form.tempoEstimadoMinutos || 45),
    ativo: true,
  };
}

function validar(form: FormArea): string | null {
  if (!form.nome.trim()) return "Informe o nome da area.";
  if (Number(form.taxa || 0) < 0) return "A taxa nao pode ser negativa.";
  if (Number(form.pedidoMinimo || 0) < 0) return "O pedido minimo nao pode ser negativo.";
  if (Number(form.tempoEstimadoMinutos || 0) <= 0) return "Informe um tempo estimado valido.";
  if (form.tipo === "NEIGHBORHOOD" && !form.bairro.trim()) return "Informe o bairro.";
  if (form.tipo === "ZIP_RANGE" && (!form.cepInicial.trim() || !form.cepFinal.trim())) {
    return "Informe a faixa de CEP.";
  }
  if (form.tipo === "RADIUS" && Number(form.raioKm || 0) <= 0) return "Informe o raio em km.";
  return null;
}

function detalheArea(area: TaxaEntrega) {
  if (area.tipo === "ZIP_RANGE") return `${area.cepInicial ?? "-"} ate ${area.cepFinal ?? "-"}`;
  if (area.tipo === "RADIUS") return `${area.raioKm ?? 0} km de raio`;
  return area.bairro;
}

export default function EntregaPage() {
  const [areas, setAreas] = useState<TaxaEntrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [areaEditando, setAreaEditando] = useState<TaxaEntrega | null>(null);
  const [areaExcluindo, setAreaExcluindo] = useState<TaxaEntrega | null>(null);
  const [form, setForm] = useState<FormArea>(formInicial);

  async function carregar() {
    setLoading(true);
    try {
      setAreas(await listarTaxasEntrega());
    } catch {
      toast.error("Erro ao carregar areas de entrega.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregar();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function abrirCriacao() {
    setAreaEditando(null);
    setForm(formInicial);
    setModalAberto(true);
  }

  function abrirEdicao(area: TaxaEntrega) {
    setAreaEditando(area);
    setForm(toForm(area));
    setModalAberto(true);
  }

  async function salvarArea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const erro = validar(form);
    if (erro) {
      toast.error(erro);
      return;
    }

    setSalvando(true);
    try {
      const payload = toPayload(form);
      if (areaEditando) {
        await atualizarTaxaEntrega(areaEditando.id, payload);
        toast.success("Area de entrega atualizada.");
      } else {
        await criarTaxaEntrega(payload);
        toast.success("Area de entrega adicionada.");
      }
      setModalAberto(false);
      await carregar();
    } catch {
      toast.error("Erro ao salvar area de entrega.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!areaExcluindo) return;
    setSalvando(true);
    try {
      await removerTaxaEntrega(areaExcluindo.id);
      setAreaExcluindo(null);
      await carregar();
      toast.success("Area removida.");
    } catch {
      toast.error("Erro ao remover area.");
    } finally {
      setSalvando(false);
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
    <div className="p-6 space-y-5 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Entrega e retirada</h1>
          <p className="text-sm text-[var(--color-muted)]">Gerencie areas, taxas e tempo estimado de entrega</p>
        </div>
        <Button onClick={abrirCriacao} data-testid="entrega-adicionar-taxa-button">
          <Plus className="h-4 w-4" /> Nova area
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Truck className="h-4 w-4 text-[var(--color-muted)]" />
            Areas de entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3" data-testid="entrega-taxas-list">
          {areas.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]" data-testid="entrega-taxas-vazio">
              Nenhuma area cadastrada.
            </p>
          ) : (
            areas.map((area) => (
              <div
                key={area.id}
                className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                data-testid={`entrega-taxa-${area.id}`}
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{area.nome}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {TIPO_LABEL[area.tipo]}: {detalheArea(area)} · pedido minimo R$ {area.pedidoMinimo.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">{area.tempoEstimadoMinutos} min estimado</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-sm font-semibold text-[var(--color-foreground)]">
                    {area.taxa === 0 ? "Gratis" : `R$ ${area.taxa.toFixed(2)}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => abrirEdicao(area)}
                    data-testid={`entrega-taxa-editar-${area.id}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setAreaExcluindo(area)}
                    data-testid={`entrega-taxa-remover-${area.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent data-testid="entrega-area-modal" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{areaEditando ? "Editar area" : "Nova area de entrega"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={salvarArea} className="space-y-4" data-testid="entrega-area-form">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm((atual) => ({ ...atual, nome: e.target.value }))}
                  placeholder="Centro"
                  data-testid="entrega-area-nome-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(tipo) => setForm((atual) => ({ ...atual, tipo: tipo as TipoAreaEntrega }))}
                >
                  <SelectTrigger data-testid="entrega-area-tipo-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEIGHBORHOOD">Bairro</SelectItem>
                    <SelectItem value="ZIP_RANGE">Faixa de CEP</SelectItem>
                    <SelectItem value="RADIUS">Raio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.tipo === "NEIGHBORHOOD" && (
              <div className="space-y-1.5">
                <Label>Bairro</Label>
                <Input
                  value={form.bairro}
                  onChange={(e) => setForm((atual) => ({ ...atual, bairro: e.target.value }))}
                  placeholder="Vila Madalena"
                  data-testid="entrega-nova-bairro-input"
                />
              </div>
            )}

            {form.tipo === "ZIP_RANGE" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>CEP inicial</Label>
                  <Input
                    value={form.cepInicial}
                    onChange={(e) => setForm((atual) => ({ ...atual, cepInicial: e.target.value }))}
                    placeholder="01000-000"
                    data-testid="entrega-cep-inicial-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>CEP final</Label>
                  <Input
                    value={form.cepFinal}
                    onChange={(e) => setForm((atual) => ({ ...atual, cepFinal: e.target.value }))}
                    placeholder="01999-999"
                    data-testid="entrega-cep-final-input"
                  />
                </div>
              </div>
            )}

            {form.tipo === "RADIUS" && (
              <div className="space-y-1.5">
                <Label>Raio (km)</Label>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.raioKm}
                  onChange={(e) => setForm((atual) => ({ ...atual, raioKm: e.target.value }))}
                  data-testid="entrega-raio-input"
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Taxa (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.taxa}
                  onChange={(e) => setForm((atual) => ({ ...atual, taxa: e.target.value }))}
                  placeholder="0,00"
                  data-testid="entrega-nova-taxa-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Pedido minimo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.pedidoMinimo}
                  onChange={(e) => setForm((atual) => ({ ...atual, pedidoMinimo: e.target.value }))}
                  data-testid="entrega-pedido-minimo-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tempo (min)</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.tempoEstimadoMinutos}
                  onChange={(e) => setForm((atual) => ({ ...atual, tempoEstimadoMinutos: e.target.value }))}
                  data-testid="entrega-nova-tempo-input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={salvando} data-testid="entrega-area-salvar-button">
                {areaEditando ? "Salvar alteracoes" : "Adicionar area"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!areaExcluindo} onOpenChange={(aberto) => !aberto && setAreaExcluindo(null)}>
        <DialogContent data-testid="entrega-excluir-modal">
          <DialogHeader>
            <DialogTitle>Remover area</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--color-muted)]">
            Tem certeza que deseja remover {areaExcluindo?.nome}?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setAreaExcluindo(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" loading={salvando} onClick={confirmarExclusao} data-testid="entrega-excluir-confirmar-button">
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
