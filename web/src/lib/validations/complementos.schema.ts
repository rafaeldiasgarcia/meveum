import { z } from "zod";

export const grupoComplementoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  quantidadeMinima: z.coerce.number().min(0, "Mínimo deve ser 0 ou maior"),
  quantidadeMaxima: z.coerce.number().min(1, "Máximo deve ser ao menos 1"),
}).refine((d) => d.quantidadeMaxima >= d.quantidadeMinima, {
  message: "Máximo deve ser maior ou igual ao mínimo",
  path: ["quantidadeMaxima"],
});

export type GrupoComplementoFormData = z.output<typeof grupoComplementoSchema>;

export const opcaoComplementoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  descricao: z.string().optional(),
  precoAdicional: z.coerce.number().min(0, "Preço não pode ser negativo"),
});

export type OpcaoComplementoFormData = z.output<typeof opcaoComplementoSchema>;
