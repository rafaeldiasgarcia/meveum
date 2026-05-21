import type { RelatorioOperacional, PeriodoRelatorio, HorarioPico, TopProduto } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";
import { listarPedidos } from "@/lib/api/pedidos.api";

function diasDoPeriodo(periodo: PeriodoRelatorio): number {
  return periodo === "7dias" ? 7 : periodo === "30dias" ? 30 : 90;
}

export async function buscarRelatorioOperacional(periodo: PeriodoRelatorio): Promise<RelatorioOperacional> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<RelatorioOperacional>(
      `/relatorios/operacional?lojaId=${lojaId}&periodo=${periodo}`,
      { method: "GET" },
    );
  } catch {
    return buildRelatorioFromPedidos(periodo);
  }
}

async function buildRelatorioFromPedidos(periodo: PeriodoRelatorio): Promise<RelatorioOperacional> {
  const dias = diasDoPeriodo(periodo);
  const inicio = new Date();
  inicio.setDate(inicio.getDate() - dias + 1);
  inicio.setHours(0, 0, 0, 0);

  const pedidos = await listarPedidos().catch(() => []);
  const filtrados = pedidos.filter((p) => new Date(p.criadoEm) >= inicio && p.status !== "cancelado");

  // Top produtos
  const prodMap = new Map<string, { nome: string; unidades: number; faturamento: number }>();
  filtrados.forEach((p) =>
    p.itens.forEach((item) => {
      const atual = prodMap.get(item.produtoId) ?? { nome: item.nomeProduto, unidades: 0, faturamento: 0 };
      prodMap.set(item.produtoId, { nome: atual.nome, unidades: atual.unidades + item.quantidade, faturamento: atual.faturamento + item.subtotal });
    }),
  );
  const topProdutos: TopProduto[] = [...prodMap.values()]
    .sort((a, b) => b.faturamento - a.faturamento)
    .slice(0, 10)
    .map((p, i) => ({ posicao: i + 1, ...p }));

  // Horários de pico
  const horaMap = new Map<number, number>();
  filtrados.forEach((p) => {
    const hora = new Date(p.criadoEm).getHours();
    horaMap.set(hora, (horaMap.get(hora) ?? 0) + 1);
  });
  const horariosPico: HorarioPico[] = Array.from({ length: 24 }, (_, h) => ({
    hora: `${String(h).padStart(2, "0")}:00`,
    pedidos: horaMap.get(h) ?? 0,
  }));

  // Clientes
  const clienteMap = new Map<string, Set<string>>();
  filtrados.forEach((p) => {
    if (!clienteMap.has(p.clienteId)) clienteMap.set(p.clienteId, new Set());
    clienteMap.get(p.clienteId)!.add(p.id);
  });
  const clientesRecorrentes = [...clienteMap.values()].filter((v) => v.size > 1).length;
  const totalClientes = clienteMap.size;
  const clientesNovos = totalClientes - clientesRecorrentes;

  // Vendas por dia
  const vendasPorDia = Array.from({ length: Math.min(dias, 30) }, (_, i) => {
    const dia = new Date();
    dia.setDate(dia.getDate() - (Math.min(dias, 30) - 1 - i));
    dia.setHours(0, 0, 0, 0);
    const valor = filtrados
      .filter((p) => {
        const d = new Date(p.criadoEm);
        return d.getFullYear() === dia.getFullYear() && d.getMonth() === dia.getMonth() && d.getDate() === dia.getDate();
      })
      .reduce((acc, p) => acc + p.total, 0);
    const label = dia.toLocaleDateString("pt-BR", dias <= 7 ? { weekday: "short" } : { day: "2-digit", month: "2-digit" });
    return { label: label.replace(".", ""), valor };
  });

  return { topProdutos, horariosPico, clientesNovos, clientesRecorrentes, totalClientes, vendasPorDia };
}
