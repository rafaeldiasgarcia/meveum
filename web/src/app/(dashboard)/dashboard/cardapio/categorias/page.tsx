"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { categoriaSchema, type CategoriaFormData, type CategoriaFormInput } from "@/lib/validations/cardapio.schema";
import {
  listarTodasCategorias,
  criarCategoria,
  atualizarCategoria,
  excluirCategoria,
} from "@/lib/api/cardapio.api";
import type { Categoria } from "@/types";

function CategoriaForm({
  categoria,
  onSave,
  onClose,
}: {
  categoria: Categoria | null;
  onSave: () => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormInput, unknown, CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: categoria
      ? { nome: categoria.nome, ordem: categoria.ordem }
      : { ordem: 0 },
  });

  async function onSubmit(data: CategoriaFormData) {
    try {
      if (categoria) await atualizarCategoria(categoria.id, data);
      else await criarCategoria(data);
      toast.success(categoria ? "Categoria atualizada!" : "Categoria criada!");
      onSave();
    } catch {
      toast.error("Erro ao salvar categoria.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="categoria-form" className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome da categoria</Label>
        <Input
          placeholder="Ex: Hambúrgueres"
          data-testid="categoria-nome-input"
          {...register("nome")}
        />
        {errors.nome && (
          <p className="text-xs text-red-500" data-testid="categoria-nome-error">
            {errors.nome.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>
          Descrição <span className="text-[#78716C]">(opcional)</span>
        </Label>
        <Input placeholder="Descrição breve da categoria" {...register("descricao")} />
      </div>

      <div className="space-y-1.5">
        <Label>Ordem</Label>
        <Input
          type="number"
          min="0"
          placeholder="0"
          data-testid="categoria-ordem-input"
          {...register("ordem")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} data-testid="categoria-cancelar-button">
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} data-testid="categoria-salvar-button">
          {categoria ? "Salvar alterações" : "Criar categoria"}
        </Button>
      </div>
    </form>
  );
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Categoria | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const lista = await listarTodasCategorias();
      setCategorias(lista.sort((a, b) => a.ordem - b.ordem));
    } catch {
      toast.error("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleExcluir(categoria: Categoria) {
    try {
      await excluirCategoria(categoria.id);
      await carregar();
      setModalExcluir(null);
      toast.success("Categoria removida.");
    } catch {
      toast.error("Erro ao remover categoria.");
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1C1917]">Categorias</h1>
          <p className="text-sm text-[#78716C]">{categorias.length} categorias cadastradas</p>
        </div>
        <Button
          onClick={() => { setCategoriaEditando(null); setModalAberto(true); }}
          data-testid="categoria-criar-button"
        >
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="categorias-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
        </div>
      ) : categorias.length === 0 ? (
        <EmptyState
          icon={Tag}
          titulo="Nenhuma categoria cadastrada"
          descricao="Crie categorias para organizar os produtos do cardápio."
          acao={
            <Button
              onClick={() => { setCategoriaEditando(null); setModalAberto(true); }}
              data-testid="categoria-criar-empty-button"
            >
              <Plus className="h-4 w-4" /> Criar primeira categoria
            </Button>
          }
          data-testid="categorias-empty-state"
        />
      ) : (
        <div className="space-y-2" data-testid="categorias-list">
          {categorias.map((categoria) => (
            <Card
              key={categoria.id}
              className={!categoria.ativa ? "opacity-60" : ""}
              data-testid={`categoria-card-${categoria.id}`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EA580C]/10 border border-[#EA580C]/20">
                    <Tag className="h-4 w-4 text-[#EA580C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1C1917]">{categoria.nome}</p>
                    <p className="text-xs text-[#78716C]">Ordem: {categoria.ordem}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={categoria.ativa ? "success" : "secondary"}>
                    {categoria.ativa ? "Ativa" : "Inativa"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setCategoriaEditando(categoria); setModalAberto(true); }}
                    data-testid={`categoria-editar-button-${categoria.id}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setModalExcluir(categoria)}
                    data-testid={`categoria-excluir-button-${categoria.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={modalAberto}
        onOpenChange={(o) => { if (!o) { setModalAberto(false); setCategoriaEditando(null); } }}
      >
        <DialogContent data-testid="categoria-modal">
          <DialogHeader>
            <DialogTitle>{categoriaEditando ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          <CategoriaForm
            categoria={categoriaEditando}
            onSave={async () => { await carregar(); setModalAberto(false); setCategoriaEditando(null); }}
            onClose={() => { setModalAberto(false); setCategoriaEditando(null); }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!modalExcluir} onOpenChange={(o) => { if (!o) setModalExcluir(null); }}>
        <DialogContent data-testid="categoria-excluir-modal">
          <DialogHeader>
            <DialogTitle>Remover categoria</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#78716C]">
            Tem certeza que deseja remover{" "}
            <strong className="text-[#1C1917]">{modalExcluir?.nome}</strong>? Os produtos vinculados
            perderão a categoria.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setModalExcluir(null)}
              data-testid="categoria-excluir-cancelar-button"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => modalExcluir && handleExcluir(modalExcluir)}
              data-testid="categoria-excluir-confirmar-button"
            >
              Remover categoria
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
