"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Users, Trash2, Crown, Shield, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { listarEquipe, convidarMembro, atualizarCargo, removerMembro } from "@/lib/api/equipe.api";
import type { MembroEquipe, CargoEquipe } from "@/types";

const CARGO_LABEL: Record<CargoEquipe, string> = {
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  STAFF: "Atendente / Cozinha",
};

const CARGO_ICON: Record<CargoEquipe, React.ElementType> = {
  OWNER: Crown,
  MANAGER: Shield,
  STAFF: ChefHat,
};

const CARGO_COLOR: Record<CargoEquipe, string> = {
  OWNER: "text-amber-500 bg-amber-500/10",
  MANAGER: "text-blue-500 bg-blue-500/10",
  STAFF: "text-green-500 bg-green-500/10",
};

const convidarSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  cargo: z.enum(["OWNER", "MANAGER", "STAFF"]),
});

type ConvidarForm = z.infer<typeof convidarSchema>;

export default function EquipePage() {
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalRemover, setModalRemover] = useState<MembroEquipe | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<ConvidarForm>({
    resolver: zodResolver(convidarSchema),
    defaultValues: { cargo: "STAFF" },
  });

  async function carregar() {
    setLoading(true);
    try {
      setMembros(await listarEquipe());
    } catch {
      toast.error("Não foi possível carregar a equipe.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function onConvidar(data: ConvidarForm) {
    try {
      const novo = await convidarMembro(data);
      setMembros((prev) => [...prev, novo]);
      toast.success(`Convite enviado para ${data.email}!`);
      reset();
      setModalAberto(false);
    } catch {
      toast.error("Erro ao convidar membro.");
    }
  }

  async function handleAlterarCargo(membro: MembroEquipe, cargo: CargoEquipe) {
    try {
      const atualizado = await atualizarCargo(membro.id, cargo);
      setMembros((prev) => prev.map((m) => (m.id === membro.id ? atualizado : m)));
      toast.success("Cargo atualizado!");
    } catch {
      toast.error("Erro ao atualizar cargo.");
    }
  }

  async function handleRemover(membro: MembroEquipe) {
    try {
      await removerMembro(membro.id);
      setMembros((prev) => prev.filter((m) => m.id !== membro.id));
      setModalRemover(null);
      toast.success("Membro removido.");
    } catch {
      toast.error("Erro ao remover membro.");
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Equipe</h1>
          <p className="text-sm text-[var(--color-muted)]">{membros.length} membro{membros.length !== 1 ? "s" : ""} na equipe</p>
        </div>
        <Button onClick={() => setModalAberto(true)} data-testid="equipe-convidar-button">
          <Plus className="h-4 w-4" /> Convidar membro
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="equipe-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : membros.length === 0 ? (
        <EmptyState
          icon={Users}
          titulo="Nenhum membro na equipe"
          descricao="Convide colaboradores para gerenciar pedidos e cardápio."
          acao={
            <Button onClick={() => setModalAberto(true)} data-testid="equipe-convidar-empty-button">
              <Plus className="h-4 w-4" /> Convidar primeiro membro
            </Button>
          }
          data-testid="equipe-empty-state"
        />
      ) : (
        <div className="space-y-2" data-testid="equipe-list">
          {membros.map((membro) => {
            const Icon = CARGO_ICON[membro.cargo];
            const cor = CARGO_COLOR[membro.cargo];
            return (
              <Card key={membro.id} data-testid={`equipe-membro-${membro.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${cor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{membro.nome}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">{membro.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={membro.cargo}
                        onValueChange={(v) => handleAlterarCargo(membro, v as CargoEquipe)}
                        disabled={membro.cargo === "OWNER"}
                      >
                        <SelectTrigger className="w-40 text-xs" data-testid={`equipe-cargo-select-${membro.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MANAGER">{CARGO_LABEL.MANAGER}</SelectItem>
                          <SelectItem value="STAFF">{CARGO_LABEL.STAFF}</SelectItem>
                        </SelectContent>
                      </Select>
                      {membro.cargo !== "OWNER" && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setModalRemover(membro)}
                          data-testid={`equipe-remover-button-${membro.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Legenda de cargos */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-3">Permissões por cargo</p>
          <div className="space-y-2 text-xs text-[var(--color-muted)]">
            <div className="flex gap-2">
              <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span><strong className="text-[var(--color-foreground)]">Proprietário:</strong> Acesso total — configurações, financeiro, equipe e todas as seções.</span>
            </div>
            <div className="flex gap-2">
              <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong className="text-[var(--color-foreground)]">Gerente:</strong> Pedidos, cardápio, clientes e relatórios. Sem acesso a configurações e financeiro.</span>
            </div>
            <div className="flex gap-2">
              <ChefHat className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
              <span><strong className="text-[var(--color-foreground)]">Atendente / Cozinha:</strong> Apenas pedidos e cozinha (KDS).</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal convidar */}
      <Dialog open={modalAberto} onOpenChange={(o) => { if (!o) { setModalAberto(false); reset(); } }}>
        <DialogContent data-testid="equipe-convidar-modal">
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onConvidar)} data-testid="equipe-convidar-form" className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input placeholder="Nome completo" data-testid="equipe-nome-input" {...register("nome")} />
              {errors.nome && <p className="text-xs text-red-500" data-testid="equipe-nome-error">{errors.nome.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input type="email" placeholder="email@exemplo.com" data-testid="equipe-email-input" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500" data-testid="equipe-email-error">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Cargo</Label>
              <Select onValueChange={(v) => setValue("cargo", v as CargoEquipe)} defaultValue="STAFF">
                <SelectTrigger data-testid="equipe-cargo-novo-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">{CARGO_LABEL.MANAGER}</SelectItem>
                  <SelectItem value="STAFF">{CARGO_LABEL.STAFF}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setModalAberto(false); reset(); }} data-testid="equipe-convidar-cancelar-button">
                Cancelar
              </Button>
              <Button type="submit" loading={isSubmitting} data-testid="equipe-convidar-salvar-button">
                Enviar convite
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal remover */}
      <Dialog open={!!modalRemover} onOpenChange={(o) => { if (!o) setModalRemover(null); }}>
        <DialogContent data-testid="equipe-remover-modal">
          <DialogHeader>
            <DialogTitle>Remover membro</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--color-muted)]">
            Tem certeza que deseja remover <strong className="text-[var(--color-foreground)]">{modalRemover?.nome}</strong> da equipe?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModalRemover(null)} data-testid="equipe-remover-cancelar-button">Cancelar</Button>
            <Button variant="destructive" onClick={() => modalRemover && handleRemover(modalRemover)} data-testid="equipe-remover-confirmar-button">
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
