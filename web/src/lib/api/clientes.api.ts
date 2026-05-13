import type { Cliente } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type ClienteApi = {
  id: string;
  lojaId: string;
  nome: string;
  telefone: string;
  criadoEm?: string;
};

function toCliente(cliente: ClienteApi): Cliente {
  return {
    id: cliente.id,
    nome: cliente.nome,
    telefone: cliente.telefone,
    totalPedidos: 0,
    totalGasto: 0,
    ultimoPedido: cliente.criadoEm ?? new Date().toISOString(),
    criadoEm: cliente.criadoEm ?? new Date().toISOString(),
  };
}

export async function listarClientes(search?: string): Promise<Cliente[]> {
  const lojaId = obterLojaId();
  const termo = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
  const clientes = await requestAutenticada<ClienteApi[]>(`/clientes?lojaId=${lojaId}${termo}`, { method: "GET" });
  return clientes.map(toCliente);
}

export async function buscarCliente(id: string): Promise<Cliente | undefined> {
  const cliente = await requestAutenticada<ClienteApi>(`/clientes/${id}`, { method: "GET" });
  return toCliente(cliente);
}
