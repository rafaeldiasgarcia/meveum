import type {
  AtualizarClienteRequest,
  AtualizarEnderecoClienteRequest,
  Cliente,
  CriarClienteRequest,
  CriarEnderecoClienteRequest,
  EnderecoCliente,
} from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

type ClienteApi = {
  id: string;
  lojaId: string;
  nome: string;
  telefone: string;
  totalPedidos?: number;
  totalGasto?: number;
  ultimoPedido?: string | null;
  criadoEm?: string | null;
};

type EnderecoClienteApi = {
  id: string;
  clienteId: string;
  rotulo?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  referencia?: string;
  latitude?: number;
  longitude?: number;
};

function toCliente(cliente: ClienteApi): Cliente {
  const criadoEm = cliente.criadoEm ?? new Date().toISOString();
  return {
    id: cliente.id,
    nome: cliente.nome,
    telefone: cliente.telefone,
    totalPedidos: Number(cliente.totalPedidos ?? 0),
    totalGasto: Number(cliente.totalGasto ?? 0),
    ultimoPedido: cliente.ultimoPedido ?? criadoEm,
    criadoEm,
  };
}

function toEndereco(endereco: EnderecoClienteApi): EnderecoCliente {
  return {
    id: endereco.id,
    clienteId: endereco.clienteId,
    rotulo: endereco.rotulo,
    rua: endereco.rua,
    numero: endereco.numero,
    complemento: endereco.complemento,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
    cep: endereco.cep,
    referencia: endereco.referencia,
    latitude: endereco.latitude == null ? undefined : Number(endereco.latitude),
    longitude: endereco.longitude == null ? undefined : Number(endereco.longitude),
  };
}

export async function listarClientes(search?: string): Promise<Cliente[]> {
  const lojaId = obterLojaId();
  const termo = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";
  const clientes = await requestAutenticada<ClienteApi[]>(`/clientes?lojaId=${lojaId}${termo}`, { method: "GET" });
  return clientes.map(toCliente);
}

export async function buscarCliente(id: string): Promise<Cliente> {
  const cliente = await requestAutenticada<ClienteApi>(`/clientes/${id}`, { method: "GET" });
  return toCliente(cliente);
}

export async function criarCliente(data: CriarClienteRequest): Promise<Cliente> {
  const lojaId = obterLojaId();
  const cliente = await requestAutenticada<ClienteApi>("/clientes", {
    method: "POST",
    body: JSON.stringify({ lojaId, nome: data.nome, telefone: data.telefone }),
  });
  return toCliente(cliente);
}

export async function atualizarCliente(id: string, data: AtualizarClienteRequest): Promise<Cliente> {
  const cliente = await requestAutenticada<ClienteApi>(`/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nome: data.nome, telefone: data.telefone }),
  });
  return toCliente(cliente);
}

export async function listarEnderecosCliente(clienteId: string): Promise<EnderecoCliente[]> {
  const enderecos = await requestAutenticada<EnderecoClienteApi[]>(`/clientes/${clienteId}/enderecos`, {
    method: "GET",
  });
  return enderecos.map(toEndereco);
}

export async function criarEnderecoCliente(
  clienteId: string,
  data: CriarEnderecoClienteRequest
): Promise<EnderecoCliente> {
  const endereco = await requestAutenticada<EnderecoClienteApi>(`/clientes/${clienteId}/enderecos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return toEndereco(endereco);
}

export async function atualizarEnderecoCliente(
  clienteId: string,
  enderecoId: string,
  data: AtualizarEnderecoClienteRequest
): Promise<EnderecoCliente> {
  const endereco = await requestAutenticada<EnderecoClienteApi>(`/clientes/${clienteId}/enderecos/${enderecoId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return toEndereco(endereco);
}

export async function excluirEnderecoCliente(clienteId: string, enderecoId: string): Promise<void> {
  await requestAutenticada(`/clientes/${clienteId}/enderecos/${enderecoId}`, { method: "DELETE" });
}
