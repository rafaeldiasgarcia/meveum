"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Store, Clock, MapPin, MessageCircle, CreditCard, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { buscarLoja, atualizarLoja, toggleAberta, atualizarHorarios } from "@/lib/api/configuracoes.api";
import type { Loja, HorarioFuncionamento } from "@/types";

const DIA_LABELS: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta", qui: "Quinta",
  sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

export default function ConfiguracoesPage() {
  const [loja, setLoja] = useState<Loja | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [horarios, setHorarios] = useState<HorarioFuncionamento[]>([]);
  const [form, setForm] = useState({ nome: "", descricao: "", telefone: "", endereco: "", pixKey: "", whatsapp: "" });

  useEffect(() => {
    buscarLoja().then((l) => {
      setLoja(l);
      setHorarios(l.horarios);
      setForm({ nome: l.nome, descricao: l.descricao ?? "", telefone: l.telefone, endereco: l.endereco, pixKey: l.pixKey ?? "", whatsapp: l.whatsapp ?? "" });
    }).finally(() => setLoading(false));
  }, []);

  async function salvarDados() {
    setSalvando(true);
    try {
      const atualizada = await atualizarLoja(form);
      setLoja(atualizada);
      toast.success("Dados da loja atualizados!");
    } catch { toast.error("Erro ao salvar."); }
    finally { setSalvando(false); }
  }

  async function salvarHorarios() {
    setSalvando(true);
    try {
      await atualizarHorarios(horarios);
      toast.success("Horários atualizados!");
    } catch { toast.error("Erro ao salvar horários."); }
    finally { setSalvando(false); }
  }

  async function handleToggleAberta() {
    const atualizada = await toggleAberta();
    setLoja(atualizada);
    toast.success(atualizada.aberta ? "Loja aberta!" : "Loja fechada.");
  }

  if (loading) {
    return <div className="p-6 flex justify-center py-16" data-testid="configuracoes-loading">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
    </div>;
  }

  return (
    <div className="p-6 overflow-y-auto h-full space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Configurações</h1>
        <p className="text-sm text-[var(--color-muted)]">Gerencie os dados e preferências da sua loja</p>
      </div>

      {/* Status da loja */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Status da loja</p>
              <p className="text-sm text-[var(--color-muted)]">{loja?.aberta ? "Aceitando pedidos agora" : "Não está aceitando pedidos"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${loja?.aberta ? "text-green-400" : "text-[var(--color-muted)]"}`}>
                {loja?.aberta ? "Aberta" : "Fechada"}
              </span>
              <Switch
                checked={loja?.aberta ?? false}
                onCheckedChange={handleToggleAberta}
                data-testid="loja-aberta-switch"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados da loja */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Store className="h-4 w-4 text-[var(--color-muted)]" />
            Dados da loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="dados-loja-form">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nome da loja</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                data-testid="loja-nome-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                data-testid="loja-telefone-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              data-testid="loja-descricao-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>
              <MapPin className="inline h-3.5 w-3.5 mr-1 text-[var(--color-muted)]" />
              Endereço
            </Label>
            <Input
              value={form.endereco}
              onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))}
              data-testid="loja-endereco-input"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>
                <CreditCard className="inline h-3.5 w-3.5 mr-1 text-[var(--color-muted)]" />
                Chave PIX
              </Label>
              <Input
                value={form.pixKey}
                onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))}
                placeholder="email, CPF, CNPJ ou chave aleatória"
                data-testid="loja-pix-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                <MessageCircle className="inline h-3.5 w-3.5 mr-1 text-[var(--color-green-wa)]" />
                WhatsApp
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                placeholder="(11) 99999-9999"
                data-testid="loja-whatsapp-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={salvarDados} loading={salvando} data-testid="salvar-dados-button">
              Salvar dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Horários */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--color-muted)]" />
            Horário de funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2" data-testid="horarios-form">
          {horarios.map((h, idx) => (
            <div key={h.id} className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0">
              <Switch
                checked={h.ativo}
                onCheckedChange={(v) => setHorarios((prev) => prev.map((x, i) => i === idx ? { ...x, ativo: v } : x))}
                data-testid={`horario-${h.diaSemana}-switch`}
              />
              <span className="w-20 text-sm font-medium text-[var(--color-foreground)]">{DIA_LABELS[h.diaSemana]}</span>
              <div className={`flex items-center gap-2 flex-1 ${!h.ativo ? "opacity-40" : ""}`}>
                <Input
                  type="time"
                  value={h.abertura}
                  disabled={!h.ativo}
                  onChange={(e) => setHorarios((prev) => prev.map((x, i) => i === idx ? { ...x, abertura: e.target.value } : x))}
                  className="w-28 text-xs"
                  data-testid={`horario-${h.diaSemana}-abertura`}
                />
                <span className="text-xs text-[var(--color-muted)]">até</span>
                <Input
                  type="time"
                  value={h.fechamento}
                  disabled={!h.ativo}
                  onChange={(e) => setHorarios((prev) => prev.map((x, i) => i === idx ? { ...x, fechamento: e.target.value } : x))}
                  className="w-28 text-xs"
                  data-testid={`horario-${h.diaSemana}-fechamento`}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={salvarHorarios} loading={salvando} variant="secondary" data-testid="salvar-horarios-button">
              Salvar horários
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Taxas de entrega */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-muted)]" />
              Taxas de entrega
            </CardTitle>
            <Button variant="ghost" size="sm" data-testid="adicionar-taxa-button">
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent data-testid="taxas-list">
          <div className="space-y-2">
            {loja?.taxasEntrega.map((taxa) => (
              <div key={taxa.id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3" data-testid={`taxa-${taxa.id}`}>
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{taxa.bairro}</p>
                  <p className="text-xs text-[var(--color-muted)]">{taxa.tempoMin} min estimado</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[var(--color-foreground)]">
                    {taxa.taxa === 0 ? "Grátis" : `R$ ${taxa.taxa.toFixed(2)}`}
                  </span>
                  <Button variant="ghost" size="icon" data-testid={`taxa-remover-${taxa.id}`}>
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
