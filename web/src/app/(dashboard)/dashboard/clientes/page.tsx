"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MapPin, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  atualizarCliente,
  atualizarEnderecoCliente,
  buscarCliente,
  criarCliente,
  criarEnderecoCliente,
  excluirEnderecoCliente,
  listarClientes,
  listarEnderecosCliente,
} from "@/lib/api/clientes.api";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Cliente, EnderecoCliente } from "@/types";

type ClienteForm = {
  nome: string;
  telefone: string;
};

type EnderecoForm = {
  rotulo: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  referencia: string;
};

const clienteInicial: ClienteForm = { nome: "", telefone: "" };
const enderecoInicial: EnderecoForm = {
  rotulo: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "SP",
  cep: "",
  referencia: "",
};

function FrequenciaBadge({ total }: { total: number }) {
  if (total >= 20) return <Badge variant="warning">VIP</Badge>;
  if (total >= 10) return <Badge variant="success">Frequente</Badge>;
  if (total >= 5) return <Badge variant="info">Regular</Badge>;
  return <Badge variant="secondary">Novo</Badge>;
}

function toEnderecoForm(endereco: EnderecoCliente | null): EnderecoForm {
  if (!endereco) return enderecoInicial;
  return {
    rotulo: endereco.rotulo ?? "",
    rua: endereco.rua,
    numero: endereco.numero,
    complemento: endereco.complemento ?? "",
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
    cep: endereco.cep ?? "",
    referencia: endereco.referencia ?? "",
  };
}

function toEnderecoPayload(form: EnderecoForm) {
  return {
    rotulo: form.rotulo.trim() || undefined,
    rua: form.rua.trim(),
    numero: form.numero.trim(),
    complemento: form.complemento.trim() || undefined,
    bairro: form.bairro.trim(),
    cidade: form.cidade.trim(),
    estado: form.estado.trim().toUpperCase(),
    cep: form.cep.trim() || undefined,
    referencia: form.referencia.trim() || undefined,
  };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [enderecos, setEnderecos] = useState<EnderecoCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [clienteForm, setClienteForm] = useState<ClienteForm>(clienteInicial);
  const [enderecoEditando, setEnderecoEditando] = useState<EnderecoCliente | null>(null);
  const [enderecoExcluindo, setEnderecoExcluindo] = useState<EnderecoCliente | null>(null);
  const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);
  const [enderecoForm, setEnderecoForm] = useState<EnderecoForm>(enderecoInicial);

  async function carregarClientes() {
    setLoading(true);
    try {
      const lista = await listarClientes(busca);
      setClientes(lista);
      if (selecionado && !lista.some((cliente) => cliente.id === selecionado.id)) {
        setSelecionado(null);
        setEnderecos([]);
      }
    } catch {
      toast.error("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void carregarClientes();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [busca]);

  async function abrirCliente(cliente: Cliente) {
    setLoadingDetalhe(true);
    try {
      const [detalhe, listaEnderecos] = await Promise.all([
        buscarCliente(cliente.id),
        listarEnderecosCliente(cliente.id),
      ]);
      setSelecionado({ ...cliente, ...detalhe, totalPedidos: cliente.totalPedidos, totalGasto: cliente.totalGasto, ultimoPedido: cliente.ultimoPedido });
      setEnderecos(listaEnderecos);
    } catch {
      toast.error("Erro ao detalhar cliente.");
    } finally {
      setLoadingDetalhe(false);
    }
  }

  function abrirCriacaoCliente() {
    setClienteEditando(null);
    setClienteForm(clienteInicial);
    setModalClienteAberto(true);
  }

  function abrirEdicaoCliente(cliente: Cliente) {
    setClienteEditando(cliente);
    setClienteForm({ nome: cliente.nome, telefone: cliente.telefone });
    setModalClienteAberto(true);
  }

  async function salvarCliente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clienteForm.nome.trim() || !clienteForm.telefone.trim()) {
      toast.error("Informe nome e telefone.");
      return;
    }

    setSalvando(true);
    try {
      const payload = { nome: clienteForm.nome.trim(), telefone: clienteForm.telefone.trim() };
      const cliente = clienteEditando
        ? await atualizarCliente(clienteEditando.id, payload)
        : await criarCliente(payload);
      toast.success(clienteEditando ? "Cliente atualizado." : "Cliente criado.");
      setModalClienteAberto(false);
      await carregarClientes();
      await abrirCliente({ ...cliente, totalPedidos: cliente.totalPedidos, totalGasto: cliente.totalGasto, ultimoPedido: cliente.ultimoPedido });
    } catch {
      toast.error("Erro ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  }

  function abrirCriacaoEndereco() {
    if (!selecionado) return;
    setEnderecoEditando(null);
    setEnderecoForm(enderecoInicial);
    setModalEnderecoAberto(true);
  }

  function abrirEdicaoEndereco(endereco: EnderecoCliente) {
    setEnderecoEditando(endereco);
    setEnderecoForm(toEnderecoForm(endereco));
    setModalEnderecoAberto(true);
  }

  async function recarregarEnderecos(clienteId: string) {
    setEnderecos(await listarEnderecosCliente(clienteId));
  }

  async function salvarEndereco(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selecionado) return;
    const payload = toEnderecoPayload(enderecoForm);
    if (!payload.rua || !payload.numero || !payload.bairro || !payload.cidade || payload.estado.length !== 2) {
      toast.error("Preencha rua, numero, bairro, cidade e UF.");
      return;
    }

    setSalvando(true);
    try {
      if (enderecoEditando) {
        await atualizarEnderecoCliente(selecionado.id, enderecoEditando.id, payload);
        toast.success("Endereco atualizado.");
      } else {
        await criarEnderecoCliente(selecionado.id, payload);
        toast.success("Endereco criado.");
      }
      setModalEnderecoAberto(false);
      await recarregarEnderecos(selecionado.id);
    } catch {
      toast.error("Erro ao salvar endereco.");
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusaoEndereco() {
    if (!selecionado || !enderecoExcluindo) return;
    setSalvando(true);
    try {
      await excluirEnderecoCliente(selecionado.id, enderecoExcluindo.id);
      setEnderecoExcluindo(null);
      await recarregarEnderecos(selecionado.id);
      toast.success("Endereco removido.");
    } catch {
      toast.error("Erro ao remover endereco.");
    } finally {
      setSalvando(false);
    }
  }

  const ticketMedio = selecionado && selecionado.totalPedidos > 0
    ? selecionado.totalGasto / selecionado.totalPedidos
    : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1C1917]">Clientes</h1>
          <p className="text-sm text-[#78716C]">{clientes.length} clientes cadastrados</p>
        </div>
        <Button onClick={abrirCriacaoCliente} data-testid="cliente-criar-button">
          <Plus className="h-4 w-4" /> Novo cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#78716C]" />
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
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EA580C] border-t-transparent" />
            </div>
          ) : clientes.length === 0 ? (
            <EmptyState
              icon={Users}
              titulo="Nenhum cliente encontrado"
              descricao={busca ? "Tente buscar por outro nome ou telefone." : "Cadastre clientes ou aguarde o primeiro pedido."}
              data-testid="clientes-empty-state"
            />
          ) : (
            <div className="space-y-2" data-testid="clientes-list">
              {clientes.map((cliente) => (
                <button
                  key={cliente.id}
                  onClick={() => abrirCliente(cliente)}
                  className={`w-full text-left rounded-xl border transition-colors p-4 ${
                    selecionado?.id === cliente.id
                      ? "border-[#EA580C]/40 bg-[#EA580C]/8"
                      : "border-[#E8E0D6] bg-white hover:bg-[#F8F6F3]"
                  }`}
                  data-testid={`cliente-card-${cliente.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F6F3] border border-[#E8E0D6] text-sm font-bold text-[#EA580C]">
                        {cliente.nome[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-sm text-[#1C1917]">{cliente.nome}</p>
                        <p className="text-xs text-[#78716C]">{cliente.telefone}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <FrequenciaBadge total={cliente.totalPedidos} />
                      <span className="text-sm font-semibold text-[#1C1917]">
                        {formatCurrency(cliente.totalGasto)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selecionado && (
          <div className="rounded-xl border border-[#E8E0D6] bg-white p-5 space-y-4" data-testid="cliente-detalhe">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EA580C] text-lg font-bold text-white">
                  {selecionado.nome[0]}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#1C1917]">{selecionado.nome}</p>
                  <p className="text-sm text-[#78716C]">{selecionado.telefone}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => abrirEdicaoCliente(selecionado)} data-testid="cliente-editar-button">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total de pedidos", val: String(selecionado.totalPedidos) },
                { label: "Total gasto", val: formatCurrency(selecionado.totalGasto) },
                { label: "Ticket medio", val: formatCurrency(ticketMedio) },
                { label: "Ultimo pedido", val: formatDate(selecionado.ultimoPedido) },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-lg bg-[#F8F6F3] border border-[#E8E0D6] p-3">
                  <p className="text-xs text-[#78716C]">{label}</p>
                  <p className="text-sm font-semibold text-[#1C1917]">{val}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#78716C]">Cliente desde {formatDate(selecionado.criadoEm)}</span>
              <FrequenciaBadge total={selecionado.totalPedidos} />
            </div>

            <div className="border-t border-[#E8E0D6] pt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#1C1917]">Enderecos</p>
                <Button variant="secondary" size="sm" onClick={abrirCriacaoEndereco} data-testid="endereco-criar-button">
                  <Plus className="h-3.5 w-3.5" /> Novo
                </Button>
              </div>

              {loadingDetalhe ? (
                <p className="mt-3 text-xs text-[#78716C]">Carregando...</p>
              ) : enderecos.length === 0 ? (
                <p className="mt-3 text-xs text-[#78716C]" data-testid="enderecos-empty-state">
                  Nenhum endereco cadastrado.
                </p>
              ) : (
                <div className="mt-3 space-y-2" data-testid="enderecos-list">
                  {enderecos.map((endereco) => (
                    <div key={endereco.id} className="rounded-lg border border-[#E8E0D6] bg-[#F8F6F3] p-3" data-testid={`endereco-card-${endereco.id}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="flex items-center gap-1 text-sm font-medium text-[#1C1917]">
                            <MapPin className="h-3.5 w-3.5 text-[#EA580C]" />
                            {endereco.rotulo || endereco.bairro}
                          </p>
                          <p className="mt-1 text-xs text-[#78716C]">
                            {endereco.rua}, {endereco.numero} - {endereco.bairro}
                          </p>
                          <p className="text-xs text-[#78716C]">{endereco.cidade}/{endereco.estado}</p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="ghost" size="icon" onClick={() => abrirEdicaoEndereco(endereco)} data-testid={`endereco-editar-${endereco.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => setEnderecoExcluindo(endereco)} data-testid={`endereco-remover-${endereco.id}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={modalClienteAberto} onOpenChange={setModalClienteAberto}>
        <DialogContent data-testid="cliente-modal">
          <DialogHeader>
            <DialogTitle>{clienteEditando ? "Editar cliente" : "Novo cliente"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvarCliente} className="space-y-4" data-testid="cliente-form">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={clienteForm.nome}
                onChange={(e) => setClienteForm((atual) => ({ ...atual, nome: e.target.value }))}
                data-testid="cliente-nome-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone</Label>
              <Input
                value={clienteForm.telefone}
                onChange={(e) => setClienteForm((atual) => ({ ...atual, telefone: e.target.value }))}
                data-testid="cliente-telefone-input"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModalClienteAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={salvando} data-testid="cliente-salvar-button">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modalEnderecoAberto} onOpenChange={setModalEnderecoAberto}>
        <DialogContent data-testid="endereco-modal" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{enderecoEditando ? "Editar endereco" : "Novo endereco"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvarEndereco} className="space-y-4" data-testid="endereco-form">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Rotulo</Label>
                <Input value={enderecoForm.rotulo} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, rotulo: e.target.value }))} data-testid="endereco-rotulo-input" />
              </div>
              <div className="space-y-1.5">
                <Label>CEP</Label>
                <Input value={enderecoForm.cep} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, cep: e.target.value }))} data-testid="endereco-cep-input" />
              </div>
              <div className="space-y-1.5">
                <Label>Rua</Label>
                <Input value={enderecoForm.rua} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, rua: e.target.value }))} data-testid="endereco-rua-input" />
              </div>
              <div className="space-y-1.5">
                <Label>Numero</Label>
                <Input value={enderecoForm.numero} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, numero: e.target.value }))} data-testid="endereco-numero-input" />
              </div>
              <div className="space-y-1.5">
                <Label>Bairro</Label>
                <Input value={enderecoForm.bairro} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, bairro: e.target.value }))} data-testid="endereco-bairro-input" />
              </div>
              <div className="space-y-1.5">
                <Label>Cidade</Label>
                <Input value={enderecoForm.cidade} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, cidade: e.target.value }))} data-testid="endereco-cidade-input" />
              </div>
              <div className="space-y-1.5">
                <Label>UF</Label>
                <Input maxLength={2} value={enderecoForm.estado} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, estado: e.target.value }))} data-testid="endereco-estado-input" />
              </div>
              <div className="space-y-1.5">
                <Label>Complemento</Label>
                <Input value={enderecoForm.complemento} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, complemento: e.target.value }))} data-testid="endereco-complemento-input" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Referencia</Label>
              <Input value={enderecoForm.referencia} onChange={(e) => setEnderecoForm((atual) => ({ ...atual, referencia: e.target.value }))} data-testid="endereco-referencia-input" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setModalEnderecoAberto(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={salvando} data-testid="endereco-salvar-button">
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!enderecoExcluindo} onOpenChange={(aberto) => !aberto && setEnderecoExcluindo(null)}>
        <DialogContent data-testid="endereco-excluir-modal">
          <DialogHeader>
            <DialogTitle>Remover endereco</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#78716C]">Tem certeza que deseja remover este endereco?</p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEnderecoExcluindo(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" loading={salvando} onClick={confirmarExclusaoEndereco} data-testid="endereco-excluir-confirmar-button">
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
