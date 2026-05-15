import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  descricao: z.string().optional(),
  ordem: z.coerce.number().min(0).optional(),
});

export type CategoriaFormInput = z.input<typeof categoriaSchema>;
export type CategoriaFormData = z.output<typeof categoriaSchema>;

export const produtoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  categoriaId: z.string().min(1, "Selecione uma categoria"),
  disponivel: z.boolean().default(true),
  destaque: z.boolean().default(false),
});

export type ProdutoFormInput = z.input<typeof produtoSchema>;
export type ProdutoFormData = z.output<typeof produtoSchema>;
