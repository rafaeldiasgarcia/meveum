"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { produtoSchema, type ProdutoFormData } from "@/lib/validations/cardapio.schema";
import { listarCategorias, listarProdutos, criarProduto, atualizarProduto, toggleDisponibilidade, excluirProduto } from "@/lib/api/cardapio.api";
import { formatCurrency } from "@/lib/utils/format";
import type { Produto, Categoria } from "@/types";

function ProdutoForm({
  produto, categorias, onSave, onClose,
}: {
  produto: Produto | null;
  categorias: Categoria[];
  onSave: () => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: produto ? {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoriaId: produto.categoriaId,
      disponivel: produto.disponivel,
      destaque: produto.destaque,
    } : { disponivel: true, destaque: false },
  });

  async function onSubmit(data: ProdutoFormData) {
    try {
      if (produto) await atualizarProduto(produto.id, data);
      else await criarProduto(data);
      toast.success(produto ? "Produto atualizado!" : "Produto criado!");
      onSave();
    } catch {
      toast.error("Erro ao salvar produto.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="produto-form" className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome do produto</Label>
        <Input placeholder="Ex: Smash Clássico" data-testid="produto-nome-input" {...register("nome")} error={errors.nome?.message} />
        {errors.nome && <p className="text-xs text-red-400" data-testid="produto-nome-error">{errors.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Descrição <span className="text-[var(--color-muted)]">(opcional)</span></Label>
        <Input placeholder="Ingredientes, preparo..." {...register("descricao")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Preço (R$)</Label>
          <Input type="number" step="0.01" min="0" placeholder="0,00" data-testid="produto-preco-input" {...register("preco")} error={errors.preco?.message} />
          {errors.preco && <p className="text-xs text-red-400">{errors.preco.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select onValueChange={(v) => setValue("categoriaId", v)} defaultValue={produto?.categoriaId}>
            <SelectTrigger data-testid="produto-categoria-select">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoriaId && <p className="text-xs text-red-400">{errors.categoriaId.message}</p>}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="disponivel"
            checked={watch("disponivel")}
            onCheckedChange={(v) => setValue("disponivel", v)}
            data-testid="produto-disponivel-switch"
          />
          <Label htmlFor="disponivel">Disponível</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="destaque"
            checked={watch("destaque")}
            onCheckedChange={(v) => setValue("destaque", v)}
            data-testid="produto-destaque-switch"
          />
          <Label htmlFor="destaque">Destaque</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} data-testid="produto-cancelar-button">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} data-testid="produto-salvar-button">
          {produto ? "Salvar alterações" : "Criar produto"}
        </Button>
      </div>
    </form>
  );
}

export default function CardapioPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [modalExcluir, setModalExcluir] = useState<Produto | null>(null);

  async function carregar() {
    setLoading(true);
    const [p, c] = await Promise.all([listarProdutos(), listarCategorias()]);
    setProdutos(p); setCategorias(c);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  const produtosFiltrados = filtroCategoria === "todas"
    ? produtos
    : produtos.filter((p) => p.categoriaId === filtroCategoria);

  async function handleToggle(id: string) {
    await toggleDisponibilidade(id);
    await carregar();
    toast.success("Disponibilidade atualizada");
  }

  async function handleExcluir(produto: Produto) {
    await excluirProduto(produto.id);
    await carregar();
    setModalExcluir(null);
    toast.success("Produto removido do cardápio");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Cardápio</h1>
          <p className="text-sm text-[var(--color-muted)]">{produtos.length} produtos cadastrados</p>
        </div>
        <Button
          onClick={() => { setProdutoEditando(null); setModalAberto(true); }}
          data-testid="produto-criar-button"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </div>

      {/* Filtro por categoria */}
      <div className="flex gap-2 flex-wrap" data-testid="categoria-filtros">
        <button
          onClick={() => setFiltroCategoria("todas")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filtroCategoria === "todas"
              ? "bg-[var(--color-orange)] text-white"
              : "border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          }`}
          data-testid="filtro-todas"
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setFiltroCategoria(c.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filtroCategoria === c.id
                ? "bg-[var(--color-orange)] text-white"
                : "border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
            data-testid={`filtro-categoria-${c.id}`}
          >
            {c.nome}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16" data-testid="cardapio-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          titulo="Nenhum produto aqui"
          descricao="Adicione produtos ao cardápio para que os clientes possam pedir."
          acao={
            <Button onClick={() => { setProdutoEditando(null); setModalAberto(true); }} data-testid="produto-criar-empty-button">
              <Plus className="h-4 w-4" /> Criar primeiro produto
            </Button>
          }
          data-testid="cardapio-empty-state"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="produtos-list">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className={`relative ${!produto.disponivel ? "opacity-60" : ""}`} data-testid={`produto-card-${produto.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-[var(--color-foreground)] truncate text-sm">{produto.nome}</h3>
                      {produto.destaque && <Star className="h-3.5 w-3.5 text-[var(--color-amber)] shrink-0 fill-current" />}
                    </div>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2">{produto.descricao}</p>
                  </div>
                  <Badge variant={produto.disponivel ? "success" : "secondary"} className="shrink-0 ml-2">
                    {produto.disponivel ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[var(--color-orange)]">{formatCurrency(produto.preco)}</span>
                  <span className="text-xs text-[var(--color-muted)]">{produto.categoria?.nome}</span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={produto.disponivel}
                      onCheckedChange={() => handleToggle(produto.id)}
                      data-testid={`produto-disponivel-toggle-${produto.id}`}
                    />
                    <span className="text-xs text-[var(--color-muted)]">
                      {produto.disponivel ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setProdutoEditando(produto); setModalAberto(true); }}
                      data-testid={`produto-editar-button-${produto.id}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setModalExcluir(produto)}
                      data-testid={`produto-excluir-button-${produto.id}`}
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

      {/* Modal criar/editar */}
      <Dialog open={modalAberto} onOpenChange={(o) => { if (!o) { setModalAberto(false); setProdutoEditando(null); } }}>
        <DialogContent data-testid="produto-modal">
          <DialogHeader>
            <DialogTitle>{produtoEditando ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <ProdutoForm
            produto={produtoEditando}
            categorias={categorias}
            onSave={async () => { await carregar(); setModalAberto(false); setProdutoEditando(null); }}
            onClose={() => { setModalAberto(false); setProdutoEditando(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal excluir */}
      <Dialog open={!!modalExcluir} onOpenChange={(o) => { if (!o) setModalExcluir(null); }}>
        <DialogContent data-testid="produto-excluir-modal">
          <DialogHeader>
            <DialogTitle>Remover produto</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--color-muted)]">
            Tem certeza que deseja remover <strong className="text-[var(--color-foreground)]">{modalExcluir?.nome}</strong> do cardápio? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setModalExcluir(null)} data-testid="produto-excluir-cancelar-button">Cancelar</Button>
            <Button variant="destructive" onClick={() => modalExcluir && handleExcluir(modalExcluir)} data-testid="produto-excluir-confirmar-button">
              Remover produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
