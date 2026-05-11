import type { Cliente } from "@/types";
import { mockClientes } from "@/lib/mocks/clientes.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function listarClientes(): Promise<Cliente[]> {
  await delay();
  return [...mockClientes].sort((a, b) => b.totalGasto - a.totalGasto);
}

export async function buscarCliente(id: string): Promise<Cliente | undefined> {
  await delay(200);
  return mockClientes.find((c) => c.id === id);
}
