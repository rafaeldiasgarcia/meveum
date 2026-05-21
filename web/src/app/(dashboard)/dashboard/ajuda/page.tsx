"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Mail, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FaqItem = { pergunta: string; resposta: string };

const FAQ: { categoria: string; itens: FaqItem[] }[] = [
  {
    categoria: "Cardápio e Produtos",
    itens: [
      {
        pergunta: "Como adiciono um novo produto ao cardápio?",
        resposta:
          "Acesse Cardápio no menu lateral, clique em 'Novo produto', preencha nome, preço, categoria e salve. O produto aparece imediatamente no seu cardápio público.",
      },
      {
        pergunta: "Como deixo um produto indisponível temporariamente?",
        resposta:
          "No card do produto, use o switch de disponibilidade. O produto ficará visível mas marcado como indisponível, impedindo pedidos.",
      },
      {
        pergunta: "Como crio categorias para organizar o cardápio?",
        resposta: "Acesse Cardápio → Categorias. Lá você pode criar, renomear, reordenar e ativar/desativar categorias.",
      },
    ],
  },
  {
    categoria: "Pedidos",
    itens: [
      {
        pergunta: "Como recebo notificação de novos pedidos?",
        resposta:
          "Novos pedidos aparecem em tempo real na página Pedidos. Certifique-se de manter o painel aberto ou configure notificações do navegador.",
      },
      {
        pergunta: "Como cancelo um pedido?",
        resposta:
          "Na página Pedidos, clique no pedido e use o botão 'Cancelar'. Pedidos finalizados ou já cancelados não podem ter o status alterado.",
      },
      {
        pergunta: "O cliente consegue acompanhar o pedido?",
        resposta:
          "Sim! Após o checkout, o cliente recebe um link para acompanhar o status do pedido em tempo real.",
      },
    ],
  },
  {
    categoria: "QR Code e Cardápio Público",
    itens: [
      {
        pergunta: "Como compartilho o link do meu cardápio?",
        resposta:
          "Seu cardápio está disponível em meveum.com/[seu-slug]. Você pode alterar o slug em Configurações → Aparência.",
      },
      {
        pergunta: "Como gero o QR Code da minha loja?",
        resposta: "Acesse Mesas / QR no menu lateral para gerar e baixar o QR Code do seu cardápio.",
      },
    ],
  },
  {
    categoria: "Pagamentos",
    itens: [
      {
        pergunta: "Quais formas de pagamento posso aceitar?",
        resposta:
          "PIX, cartão de crédito, cartão de débito e dinheiro. Configure as formas aceitas em Configurações → Pagamentos.",
      },
      {
        pergunta: "Como configuro o PIX?",
        resposta: "Em Configurações, informe sua Chave PIX (CPF, CNPJ, e-mail ou chave aleatória). O cliente verá essa chave no checkout.",
      },
    ],
  },
];

function FaqItemComponent({ item }: { item: FaqItem }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div
      className="border-b border-[var(--color-border)] last:border-0"
      data-testid="ajuda-faq-item"
    >
      <button
        onClick={() => setAberto((a) => !a)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-orange)] transition-colors"
        data-testid="ajuda-faq-toggle"
      >
        {item.pergunta}
        {aberto ? <ChevronUp className="h-4 w-4 shrink-0 text-[var(--color-muted)]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />}
      </button>
      {aberto && (
        <p className="pb-3 text-sm text-[var(--color-muted)] leading-relaxed" data-testid="ajuda-faq-resposta">
          {item.resposta}
        </p>
      )}
    </div>
  );
}

export default function AjudaPage() {
  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Central de Ajuda</h1>
        <p className="text-sm text-[var(--color-muted)]">Encontre respostas e entre em contato com o suporte</p>
      </div>

      {/* Contatos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="ajuda-contatos">
        <Card>
          <CardContent className="p-4">
            <a
              href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20o%20MeVêUm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
              data-testid="ajuda-whatsapp-link"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-500/10 text-green-500">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-green-500 transition-colors">
                  WhatsApp
                </p>
                <p className="text-xs text-[var(--color-muted)]">Resposta em até 2h úteis</p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <a
              href="mailto:suporte@meveum.com"
              className="flex items-center gap-3 group"
              data-testid="ajuda-email-link"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-blue-500 transition-colors">
                  E-mail
                </p>
                <p className="text-xs text-[var(--color-muted)]">suporte@meveum.com</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* FAQ por categoria */}
      <div className="space-y-4" data-testid="ajuda-faq">
        {FAQ.map((secao) => (
          <Card key={secao.categoria} data-testid={`ajuda-secao-${secao.categoria.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="pb-0">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[var(--color-muted)]" />
                {secao.categoria}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {secao.itens.map((item, i) => (
                <FaqItemComponent key={i} item={item} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
