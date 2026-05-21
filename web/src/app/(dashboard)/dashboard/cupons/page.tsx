"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Ticket, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/EmptyState";
import { listarCupons, criarCupon, atualizarCupon, toggleCupon, excluirCupon } from "@/lib/api/cupons.api";
import { formatCurrency } from "@/lib/utils/format";
import type { Cupon, TipoCupon } from "@/types";

const cuponSchema = z.object({
  codigo: z.string().min(3, "Mínimo 3 caracteres").max(20, "Máximo 20 caracteres"),
  tipo: z.enum(["percentual", "fixo"]),
  valor: z.coerce.number().positive("Deve ser positivo"),
  valorMinimoPedido: z.coerce.number().min(0).optional(),
  limiteUsos: z.coerce.number().int().positive().optional(),
  expiracaoEm: z.string().optional(),
});

type CuponForm = z.infer<typeof cuponSchema>;

function CuponFormModal({
  cupon, onSave, onClose,
}: { cupon: Cupon | null; onSave: () => void; onClose: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CuponForm>({
    resolver: zodResolver(cuponSchema) as import("react-hook-form").Resolver<CuponForm>,
    defaultValues: cupon ? {
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      valor: cupon.valor,
      valorMinimoPedido: cupon.valorMinimoPedido,
      limiteUsos: cupon.limiteUsos,
      expiracaoEm: cupon.expiracaoEm ? cupon.expiracaoEm.slice(0, 10) : "",
    } : { tipo: "percentual" as TipoCupon },
  });

  const tipo = watch("tipo") as TipoCupon;

  async function onSubmit(data: CuponForm) {
    try {
      const payload = {
        codigo: data.codigo,
        tipo: data.tipo,
        valor: data.valor,
        valorMinimoPedido: data.valorMinimoPedido || undefined,
        limiteUsos: data.limiteUsos || undefined,
        expiracaoEm: data.expiracaoEm ? new Date(data.expiracaoEm).toISOString() : undefined,
      };
      if (cupon) await atualizarCupon(cupon.id, payload);
      else await criarCupon(payload);
      toast.success(cupon ? "Cupom atualizado!" : "Cupom criado!");
      onSave();
    } catch {
      toast.error("Erro ao salvar cupom.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="cupon-form" className="space-y-4">
      <div className="space-y-1.5">
        <Label>Código</Label>
        <Input
          placeholder="EX: BEMVINDO10"
          data-testid="cupon-codigo-input"
          {...register("codigo")}
          style={{ textTransform: "uppercase" }}
        />
        {errors.codigo && <p className="text-xs text-red-500" data-testid="cupon-codigo-error">{errors.codigo.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Tipo de desconto</Label>
          <Select onValueChange={(v) => setValue("tipo", v as TipoCupon)} defaultValue={cupon?.tipo ?? "percentual"}>
            <SelectTrigger data-testid="cupon-tipo-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentual">Percentual (%)</SelectItem>
              <SelectItem value="fixo">Valor fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{tipo === "percentual" ? "Desconto (%)" : "Desconto (R$)"}</Label>
          <Input
            type="number"
            step={tipo === "percentual" ? "1" : "0.01"}
            min="0"
            max={tipo === "percentual" ? "100" : undefined}
            placeholder={tipo === "percentual" ? "10" : "5,00"}
            data-testid="cupon-valor-input"
            {...register("valor")}
          />
          {errors.valor && <p className="text-xs text-red-500">{errors.valor.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Pedido mínimo (R$) <span className="text-[#78716C]">(opcional)</span></Label>
          <Input type="number" step="0.01" min="0" placeholder="0,00" data-testid="cupon-minimo-input" {...register("valorMinimoPedido")} />
        </div>
        <div className="space-y-1.5">
          <Label>Limite de usos <span className="text-[#78716C]">(opcional)</span></Label>
          <Input type="number" min="1" placeholder="Ilimitado" data-testid="cupon-limite-input" {...register("limiteUsos")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Validade <span className="text-[#78716C]">(opcional)</span></Label>
        <Input type="date" data-testid="cupon-expiracao-input" {...register("expiracaoEm")} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} data-testid="cupon-cancelar-button">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} data-testid="cupon-salvar-button">
          {cupon ? "Salvar alterações" : "Criar cupom"}
        </Button>
      </div>
    </form>
  );
}

export default function CuponsPage() {
  const [cupons, setCupons] = useState<Cupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [cuponEditando, setCuponEditando] = useState<Cupon | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Cupon | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      setCupons(await listarCupons());
    } catch {
      toast.error("Não foi possível carregar os cupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function handleToggle(cupon: Cupon) {
    try {
      const atualizado = await toggleCupon(cupon.id);
      setCupons((prev) => prev.map((c) => (c.id === cupon.id ? atualizado : c)));
      toast.success(atualizado.ativo ? "Cupom ativado!" : "Cupom desativado!");
    } catch {
      toast.error("Erro ao alterar cupom.");
    }
  }

  async function handleExcluir(cupon: Cupon) {
    try {
      await excluirCupon(cupon.id);
      setCupons((prev) => prev.filter((c) => c.id !== cupon.id));
      setModalExcluir(null);
      toast.success("Cupom removido.");
    } catch {
      toast.error("Erro ao remover cupom.");
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Cupons</h1>
          <p className="text-sm text-[var(--color-muted)]">{cupons.length} cupons cadastrados</p>
        </div>
        <Button
          onClick={() => { setCuponEditando(null); setModalAberto(true); }}
          data-testid="cupon-criar-button"
        >
          <Plus className="h-4 w-4" /> Novo cupom
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="cupons-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : cupons.length === 0 ? (
        <EmptyState
          icon={Ticket}
          titulo="Nenhum cupom cadastrado"
          descricao="Crie cupons de desconto para seus clientes."
          acao={
            <Button onClick={() => { setCuponEditando(null); setModalAberto(true); }} data-testid="cupon-criar-empty-button">
              <Plus className="h-4 w-4" /> Criar primeiro cupom
            </Button>
          }
          data-testid="cupons-empty-state"
        />
      ) : (
        <div className="space-y-2" data-testid="cupons-list">
          {cupons.map((cupon) => (
            <Card key={cupon.id} data-testid={`cupon-card-${cupon.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--color-orange)]/10 text-[var(--color-orange)]">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--color-foreground)] tracking-wide">{cupon.codigo}</span>
                        <Badge variant={cupon.ativo ? "success" : "secondary"}>
                          {cupon.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        {cupon.tipo === "percentual" ? `${cupon.valor}% de desconto` : `${formatCurrency(cupon.valor)} de desconto`}
                        {cupon.valorMinimoPedido ? ` · mínimo ${formatCurrency(cupon.valorMinimoPedido)}` : ""}
                        {cupon.limiteUsos ? ` · ${cupon.usosAtuais}/${cupon.limiteUsos} usos` : ` · ${cupon.usosAtuais} usos`}
                        {cupon.expiracaoEm ? ` · expira ${new Date(cupon.expiracaoEm).toLocaleDateString("pt-BR")}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggle(cupon)}
                      data-testid={`cupon-toggle-${cupon.id}`}
                      title={cupon.ativo ? "Desativar" : "Ativar"}
                    >
                      {cupon.ativo
                        ? <ToggleRight className="h-5 w-5 text-green-500" />
                        : <ToggleLeft className="h-5 w-5 text-[var(--color-muted)]" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setCuponEditando(cupon); setModalAberto(true); }}
                      data-testid={`cupon-editar-button-${cupon.id}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setModalExcluir(cupon)}
                      data-testid={`cupon-excluir-button-${cupon.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalAberto} onOpenChange={(o) => { if (!o) { setModalAberto(false); setCuponEditando(null); } }}>
        <DialogContent data-testid="cupon-modal">
          <DialogHeader>
            <DialogTitle>{cuponEditando ? "Editar cupom" : "Novo cupom"}</DialogTitle>
          </DialogHeader>
          <CuponFormModal
            cupon={cuponEditando}
            onSave={() => { void carregar(); setModalAberto(false); setCuponEditando(null); }}
            onClose={() => { setModalAberto(false); setCuponEditando(null); }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!modalExcluir} onOpenChange={(o) => { if (!o) setModalExcluir(null); }}>
        <DialogContent data-testid="cupon-excluir-modal">
          <DialogHeader>
            <DialogTitle>Remover cupom</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--color-muted)]">
            Tem certeza que deseja remover o cupom <strong className="text-[var(--color-foreground)]">{modalExcluir?.codigo}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModalExcluir(null)} data-testid="cupon-excluir-cancelar-button">Cancelar</Button>
            <Button variant="destructive" onClick={() => modalExcluir && handleExcluir(modalExcluir)} data-testid="cupon-excluir-confirmar-button">
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
