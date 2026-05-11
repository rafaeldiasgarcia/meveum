import type { Loja } from "@/types";

export const mockLoja: Loja = {
  id: "loja-1",
  nome: "Smash Burguer do Centro",
  descricao: "Os melhores smash burgers da cidade. Feitos na hora, com ingredientes selecionados.",
  telefone: "11987654321",
  endereco: "Rua das Flores, 142 - Centro - São Paulo/SP",
  pixKey: "smashburger@pix.com",
  whatsapp: "11987654321",
  ativa: true,
  aberta: true,
  horarios: [
    { id: "h-1", diaSemana: "seg", abertura: "11:00", fechamento: "22:00", ativo: true },
    { id: "h-2", diaSemana: "ter", abertura: "11:00", fechamento: "22:00", ativo: true },
    { id: "h-3", diaSemana: "qua", abertura: "11:00", fechamento: "22:00", ativo: true },
    { id: "h-4", diaSemana: "qui", abertura: "11:00", fechamento: "22:00", ativo: true },
    { id: "h-5", diaSemana: "sex", abertura: "11:00", fechamento: "23:00", ativo: true },
    { id: "h-6", diaSemana: "sab", abertura: "12:00", fechamento: "23:00", ativo: true },
    { id: "h-7", diaSemana: "dom", abertura: "12:00", fechamento: "21:00", ativo: false },
  ],
  taxasEntrega: [
    { id: "tx-1", bairro: "Centro", taxa: 0, tempoMin: 20 },
    { id: "tx-2", bairro: "Vila Mariana", taxa: 5.0, tempoMin: 35 },
    { id: "tx-3", bairro: "Bela Vista", taxa: 6.0, tempoMin: 40 },
    { id: "tx-4", bairro: "Consolação", taxa: 5.0, tempoMin: 30 },
    { id: "tx-5", bairro: "Jardins", taxa: 8.0, tempoMin: 45 },
  ],
};
