"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Layers, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  grupoComplementoSchema,
  opcaoComplementoSchema,
  type GrupoComplementoFormData,
  type GrupoComplementoFormInput,
  type OpcaoComplementoFormData,
  type OpcaoComplementoFormInput,
} from "@/lib/validations/complementos.schema";
import { listarProdutos } from "@/lib/api/cardapio.api";
import {
  listarGruposComplemento,
  listarGruposDoProduto,
  criarGrupoComplemento,
  atualizarGrupoComplemento,
  excluirGrupoComplemento,
  criarOpcaoComplemento,
  atualizarOpcaoComplemento,
  excluirOpcaoComplemento,
  vincularGrupoAoProduto,
  desvincularGrupoDoProduto,
} from "@/lib/api/complementos.api";
import { formatCurrency } from "@/lib/utils/format";
import type { Produto, GrupoComplementoAdmin, OpcaoComplementoAdmin } from "@/types";

function GrupoForm({
  grupo,
  produtoId,
  onSave,
  onClose,
}: {
  grupo: GrupoComplementoAdmin | null;
  produtoId: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GrupoComplementoFormInput, unknown, GrupoComplementoFormData>({
    resolver: zodResolver(grupoComplementoSchema),
    defaultValues: grupo
      ? { nome: grupo.nomeGrupoComplemento, quantidadeMinima: grupo.quantidadeMinima, quantidadeMaxima: grupo.quantidadeMaxima }
      : { quantidadeMinima: 0, quantidadeMaxima: 1 },
  });

  async function onSubmit(data: GrupoComplementoFormData) {
    try {
      if (grupo) {
        await atualizarGrupoComplemento(grupo.grupoComplementoId, { nome: data.nome, quantidadeMinima: data.quantidadeMinima, quantidadeMaxima: data.quantidadeMaxima });
      } else {
        await criarGrupoComplemento({
          produtoId,
          nome: data.nome,
          quantidadeMinima: data.quantidadeMinima,
          quantidadeMaxima: data.quantidadeMaxima,
        });
      }
      toast.success(grupo ? "Grupo atualizado!" : "Grupo criado!");
      onSave();
    } catch {
      toast.error("Erro ao salvar grupo.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="grupo-form" className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome do grupo</Label>
        <Input placeholder="Ex: Molhos, Adicionais" data-testid="grupo-nome-input" {...register("nome")} />
        {errors.nome && <p className="text-xs text-red-500" data-testid="grupo-nome-error">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Mínimo de opções</Label>
          <Input type="number" min="0" data-testid="grupo-minimo-input" {...register("quantidadeMinima")} />
          {errors.quantidadeMinima && <p className="text-xs text-red-500">{errors.quantidadeMinima.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Máximo de opções</Label>
          <Input type="number" min="1" data-testid="grupo-maximo-input" {...register("quantidadeMaxima")} />
          {errors.quantidadeMaxima && <p className="text-xs text-red-500">{errors.quantidadeMaxima.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} data-testid="grupo-cancelar-button">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} data-testid="grupo-salvar-button">
          {grupo ? "Salvar alterações" : "Criar grupo"}
        </Button>
      </div>
    </form>
  );
}

function OpcaoForm({
  opcao,
  grupoComplementoId,
  onSave,
  onClose,
}: {
  opcao: OpcaoComplementoAdmin | null;
  grupoComplementoId: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OpcaoComplementoFormInput, unknown, OpcaoComplementoFormData>({
    resolver: zodResolver(opcaoComplementoSchema),
    defaultValues: opcao
      ? { nome: opcao.nome, descricao: opcao.descricao ?? "", precoAdicional: opcao.precoAdicional }
      : { precoAdicional: 0 },
  });

  async function onSubmit(data: OpcaoComplementoFormData) {
    try {
      if (opcao) {
        await atualizarOpcaoComplemento(opcao.id, data);
      } else {
        await criarOpcaoComplemento({ grupoComplementoId, ...data });
      }
      toast.success(opcao ? "Opção atualizada!" : "Opção criada!");
      onSave();
    } catch {
      toast.error("Erro ao salvar opção.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="opcao-form" className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome da opção</Label>
        <Input placeholder="Ex: Bacon, Queijo extra" data-testid="opcao-nome-input" {...register("nome")} />
        {errors.nome && <p className="text-xs text-red-500" data-testid="opcao-nome-error">{errors.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Descrição <span className="text-[#78716C]">(opcional)</span></Label>
        <Input placeholder="Descrição breve" {...register("descricao")} />
      </div>

      <div className="space-y-1.5">
        <Label>Preço adicional (R$)</Label>
        <Input type="number" step="0.01" min="0" placeholder="0,00" data-testid="opcao-preco-input" {...register("precoAdicional")} />
        {errors.precoAdicional && <p className="text-xs text-red-500">{errors.precoAdicional.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} data-testid="opcao-cancelar-button">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} data-testid="opcao-salvar-button">
          {opcao ? "Salvar alterações" : "Criar opção"}
        </Button>
      </div>
    </form>
  );
}

type ModalState =
  | { tipo: "grupo-criar" }
  | { tipo: "grupo-editar"; grupo: GrupoComplementoAdmin }
  | { tipo: "grupo-excluir"; grupo: GrupoComplementoAdmin }
  | { tipo: "opcao-criar"; grupoComplementoId: string }
  | { tipo: "opcao-editar"; opcao: OpcaoComplementoAdmin; grupoComplementoId: string }
  | { tipo: "opcao-excluir"; opcao: OpcaoComplementoAdmin }
  | null;

export default function ComplementosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>("");
  const [todosGrupos, setTodosGrupos] = useState<GrupoComplementoAdmin[]>([]);
  const [grupos, setGrupos] = useState<GrupoComplementoAdmin[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [loadingGrupos, setLoadingGrupos] = useState(false);
  const [gruposExpandidos, setGruposExpandidos] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadingProdutos(true);
      Promise.all([listarProdutos(), listarGruposComplemento()])
        .then(([listaProdutos, listaGrupos]) => {
          setProdutos(listaProdutos);
          setTodosGrupos(listaGrupos);
        })
        .catch(() => toast.error("Erro ao carregar produtos."))
        .finally(() => setLoadingProdutos(false));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function carregarTodosGrupos() {
    const lista = await listarGruposComplemento();
    setTodosGrupos(lista);
  }

  async function carregarGrupos(produtoId: string) {
    if (!produtoId) return;
    setLoadingGrupos(true);
    try {
      const lista = await listarGruposDoProduto(produtoId);
      setGrupos(lista);
      setGruposExpandidos(new Set(lista.map((g) => g.grupoComplementoId)));
    } catch {
      toast.error("Erro ao carregar complementos.");
    } finally {
      setLoadingGrupos(false);
    }
  }

  async function recarregarComplementos(produtoId = produtoSelecionadoId) {
    await carregarTodosGrupos();
    if (produtoId) await carregarGrupos(produtoId);
  }

  function handleSelecionarProduto(id: string) {
    setProdutoSelecionadoId(id);
    carregarGrupos(id);
  }

  function toggleGrupo(grupoComplementoId: string) {
    setGruposExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(grupoComplementoId)) next.delete(grupoComplementoId);
      else next.add(grupoComplementoId);
      return next;
    });
  }

  async function handleExcluirGrupo(grupo: GrupoComplementoAdmin) {
    try {
      await excluirGrupoComplemento(grupo.grupoComplementoId);
      await recarregarComplementos();
      setModal(null);
      toast.success("Grupo removido.");
    } catch {
      toast.error("Erro ao remover grupo.");
    }
  }

  async function handleExcluirOpcao(opcao: OpcaoComplementoAdmin) {
    try {
      await excluirOpcaoComplemento(opcao.id);
      await recarregarComplementos();
      setModal(null);
      toast.success("Opção removida.");
    } catch {
      toast.error("Erro ao remover opção.");
    }
  }

  async function handleVincularGrupo(grupo: GrupoComplementoAdmin) {
    if (!produtoSelecionadoId) return;
    try {
      await vincularGrupoAoProduto(produtoSelecionadoId, {
        grupoComplementoId: grupo.grupoComplementoId,
        ordem: grupos.length,
      });
      await carregarGrupos(produtoSelecionadoId);
      toast.success("Grupo vinculado ao produto.");
    } catch {
      toast.error("Erro ao vincular grupo.");
    }
  }

  async function handleDesvincularGrupo(grupo: GrupoComplementoAdmin) {
    if (!produtoSelecionadoId) return;
    try {
      await desvincularGrupoDoProduto(produtoSelecionadoId, grupo.grupoComplementoId);
      await carregarGrupos(produtoSelecionadoId);
      toast.success("Grupo desvinculado do produto.");
    } catch {
      toast.error("Erro ao desvincular grupo.");
    }
  }

  const produtoSelecionado = produtos.find((p) => p.id === produtoSelecionadoId);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1C1917]">Complementos</h1>
        <p className="text-sm text-[#78716C]">Gerencie grupos de complementos e opções por produto</p>
      </div>

      {/* Seletor de produto */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1.5">
            <Label>Selecione um produto</Label>
            {loadingProdutos ? (
              <div className="h-10 rounded-md bg-[#F8F6F3] animate-pulse" data-testid="complementos-produtos-loading" />
            ) : (
              <Select value={produtoSelecionadoId} onValueChange={handleSelecionarProduto}>
                <SelectTrigger data-testid="complementos-produto-select">
                  <SelectValue placeholder="Escolha o produto para gerenciar complementos..." />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {produtoSelecionadoId && (
        <Card data-testid="grupos-biblioteca">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Biblioteca de grupos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {todosGrupos.length === 0 ? (
              <p className="text-sm text-[#78716C]">Nenhum grupo criado ainda.</p>
            ) : (
              todosGrupos.map((grupo) => {
                const vinculado = grupos.some((item) => item.grupoComplementoId === grupo.grupoComplementoId);
                return (
                  <div
                    key={grupo.grupoComplementoId}
                    className="flex items-center justify-between rounded-lg border border-[#E8E0D6] bg-[#F8F6F3] px-3 py-2"
                    data-testid={`grupo-biblioteca-${grupo.grupoComplementoId}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1C1917]">{grupo.nomeGrupoComplemento}</p>
                      <p className="text-xs text-[#78716C]">
                        mín {grupo.quantidadeMinima} / máx {grupo.quantidadeMaxima}
                      </p>
                    </div>
                    <Button
                      variant={vinculado ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => vinculado ? handleDesvincularGrupo(grupo) : handleVincularGrupo(grupo)}
                      data-testid={`${vinculado ? "grupo-desvincular" : "grupo-vincular"}-${grupo.grupoComplementoId}`}
                    >
                      {vinculado ? "Desvincular" : "Vincular"}
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Grupos de complementos */}
      {produtoSelecionadoId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#1C1917]">
              Grupos de complementos — <span className="text-[#78716C]">{produtoSelecionado?.nome}</span>
            </p>
            <Button
              size="sm"
              onClick={() => setModal({ tipo: "grupo-criar" })}
              data-testid="grupo-criar-button"
            >
              <Plus className="h-4 w-4" /> Novo grupo
            </Button>
          </div>

          {loadingGrupos ? (
            <div className="flex justify-center py-12" data-testid="grupos-loading">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
            </div>
          ) : grupos.length === 0 ? (
            <EmptyState
              icon={Layers}
              titulo="Nenhum grupo de complemento"
              descricao="Adicione grupos como Molhos, Adicionais ou Tamanhos para este produto."
              acao={
                <Button onClick={() => setModal({ tipo: "grupo-criar" })} data-testid="grupo-criar-empty-button">
                  <Plus className="h-4 w-4" /> Criar primeiro grupo
                </Button>
              }
              data-testid="grupos-empty-state"
            />
          ) : (
            <div className="space-y-3" data-testid="grupos-list">
              {grupos.map((grupo) => {
                const expandido = gruposExpandidos.has(grupo.grupoComplementoId);
                return (
                  <Card key={grupo.grupoComplementoId} data-testid={`grupo-card-${grupo.grupoComplementoId}`}>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleGrupo(grupo.grupoComplementoId)}
                          className="flex items-center gap-2 text-left flex-1"
                          data-testid={`grupo-toggle-${grupo.grupoComplementoId}`}
                        >
                          {expandido
                            ? <ChevronDown className="h-4 w-4 text-[#78716C]" />
                            : <ChevronRight className="h-4 w-4 text-[#78716C]" />}
                          <div>
                            <p className="font-semibold text-sm text-[#1C1917]">{grupo.nomeGrupoComplemento}</p>
                            <p className="text-xs text-[#78716C]">
                              {grupo.quantidadeMinima === 0 ? "Opcional" : "Obrigatório"} · mín {grupo.quantidadeMinima} / máx {grupo.quantidadeMaxima} · {grupo.opcoes.length} opções
                            </p>
                          </div>
                        </button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setModal({ tipo: "grupo-editar", grupo })}
                            data-testid={`grupo-editar-button-${grupo.grupoComplementoId}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setModal({ tipo: "grupo-excluir", grupo })}
                            data-testid={`grupo-excluir-button-${grupo.grupoComplementoId}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {expandido && (
                      <CardContent className="p-4 pt-3 space-y-2" data-testid={`grupo-opcoes-${grupo.grupoComplementoId}`}>
                        {grupo.opcoes.map((opcao) => (
                          <div
                            key={opcao.id}
                            className="flex items-center justify-between rounded-lg border border-[#E8E0D6] bg-[#F8F6F3] px-3 py-2"
                            data-testid={`opcao-card-${opcao.id}`}
                          >
                            <div>
                              <p className="text-sm font-medium text-[#1C1917]">{opcao.nome}</p>
                              {opcao.descricao && <p className="text-xs text-[#78716C]">{opcao.descricao}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#EA580C]">
                                {opcao.precoAdicional === 0 ? "Grátis" : `+ ${formatCurrency(opcao.precoAdicional)}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setModal({ tipo: "opcao-editar", opcao, grupoComplementoId: grupo.grupoComplementoId })}
                                data-testid={`opcao-editar-button-${opcao.id}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setModal({ tipo: "opcao-excluir", opcao })}
                                data-testid={`opcao-excluir-button-${opcao.id}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full border border-dashed border-[#E8E0D6] text-[#78716C] hover:text-[#1C1917]"
                          onClick={() => setModal({ tipo: "opcao-criar", grupoComplementoId: grupo.grupoComplementoId })}
                          data-testid={`opcao-criar-button-${grupo.grupoComplementoId}`}
                        >
                          <Plus className="h-3.5 w-3.5" /> Adicionar opção
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!produtoSelecionadoId && !loadingProdutos && (
        <EmptyState
          icon={Layers}
          titulo="Selecione um produto"
          descricao="Escolha um produto acima para gerenciar seus grupos de complementos."
          data-testid="complementos-sem-produto"
        />
      )}

      {/* Modais grupo */}
      <Dialog
        open={modal?.tipo === "grupo-criar" || modal?.tipo === "grupo-editar"}
        onOpenChange={(o) => { if (!o) setModal(null); }}
      >
        <DialogContent data-testid="grupo-modal">
          <DialogHeader>
            <DialogTitle>{modal?.tipo === "grupo-editar" ? "Editar grupo" : "Novo grupo"}</DialogTitle>
          </DialogHeader>
          <GrupoForm
            grupo={modal?.tipo === "grupo-editar" ? modal.grupo : null}
            produtoId={produtoSelecionadoId}
            onSave={async () => { await recarregarComplementos(); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.tipo === "grupo-excluir"} onOpenChange={(o) => { if (!o) setModal(null); }}>
        <DialogContent data-testid="grupo-excluir-modal">
          <DialogHeader><DialogTitle>Remover grupo</DialogTitle></DialogHeader>
          <p className="text-sm text-[#78716C]">
            Tem certeza que deseja remover o grupo{" "}
            <strong className="text-[#1C1917]">
              {modal?.tipo === "grupo-excluir" ? modal.grupo.nomeGrupoComplemento : ""}
            </strong>
            ? Todas as opções serão removidas.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModal(null)} data-testid="grupo-excluir-cancelar-button">Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => modal?.tipo === "grupo-excluir" && handleExcluirGrupo(modal.grupo)}
              data-testid="grupo-excluir-confirmar-button"
            >
              Remover grupo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais opção */}
      <Dialog
        open={modal?.tipo === "opcao-criar" || modal?.tipo === "opcao-editar"}
        onOpenChange={(o) => { if (!o) setModal(null); }}
      >
        <DialogContent data-testid="opcao-modal">
          <DialogHeader>
            <DialogTitle>{modal?.tipo === "opcao-editar" ? "Editar opção" : "Nova opção"}</DialogTitle>
          </DialogHeader>
          <OpcaoForm
            opcao={modal?.tipo === "opcao-editar" ? modal.opcao : null}
            grupoComplementoId={
              modal?.tipo === "opcao-criar" ? modal.grupoComplementoId
              : modal?.tipo === "opcao-editar" ? modal.grupoComplementoId
              : ""
            }
            onSave={async () => { await carregarGrupos(produtoSelecionadoId); setModal(null); }}
            onClose={() => setModal(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={modal?.tipo === "opcao-excluir"} onOpenChange={(o) => { if (!o) setModal(null); }}>
        <DialogContent data-testid="opcao-excluir-modal">
          <DialogHeader><DialogTitle>Remover opção</DialogTitle></DialogHeader>
          <p className="text-sm text-[#78716C]">
            Tem certeza que deseja remover a opção{" "}
            <strong className="text-[#1C1917]">
              {modal?.tipo === "opcao-excluir" ? modal.opcao.nome : ""}
            </strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModal(null)} data-testid="opcao-excluir-cancelar-button">Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => modal?.tipo === "opcao-excluir" && handleExcluirOpcao(modal.opcao)}
              data-testid="opcao-excluir-confirmar-button"
            >
              Remover opção
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
