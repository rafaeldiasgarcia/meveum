import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const cadastroSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  nomeLoja: z.string().min(2, "Nome da loja deve ter ao menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone inválido").max(15),
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirmacao de senha obrigatoria"),
}).refine((d) => d.senha === d.confirmarSenha, {
  message: "As senhas não conferem",
  path: ["confirmarSenha"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CadastroFormData = z.infer<typeof cadastroSchema>;
