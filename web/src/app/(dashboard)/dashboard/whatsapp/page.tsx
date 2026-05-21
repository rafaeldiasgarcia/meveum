"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarConfigWhatsApp, salvarConfigWhatsApp } from "@/lib/api/whatsapp.api";
import type { ConfigWhatsApp } from "@/types";

const STATUS_LABELS: Record<keyof ConfigWhatsApp["mensagens"], string> = {
  recebido: "Pedido recebido",
  em_preparo: "Em preparo",
  saiu_entrega: "Saiu para entrega",
  finalizado: "Pedido finalizado",
};

const STATUS_HINTS: Record<keyof ConfigWhatsApp["mensagens"], string> = {
  recebido: "Enviada assim que o pedido é confirmado.",
  em_preparo: "Enviada quando o status muda para 'Em preparo'.",
  saiu_entrega: "Enviada quando o pedido sai para entrega.",
  finalizado: "Enviada quando o pedido é finalizado.",
};

const VARIAVEIS = ["{{nome}}", "{{numero}}", "{{total}}"];

export default function WhatsAppPage() {
  const [config, setConfig] = useState<ConfigWhatsApp>({
    numero: "",
    mensagens: { recebido: "", em_preparo: "", saiu_entrega: "", finalizado: "" },
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarConfigWhatsApp()
      .then(setConfig)
      .catch(() => toast.error("Erro ao carregar configurações."))
      .finally(() => setLoading(false));
  }, []);

  async function salvar() {
    setSalvando(true);
    try {
      await salvarConfigWhatsApp(config);
      toast.success("Configurações de WhatsApp salvas!");
    } catch {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="whatsapp-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">WhatsApp</h1>
        <p className="text-sm text-[var(--color-muted)]">Configure o número e as mensagens automáticas do checkout</p>
      </div>

      {/* Número */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[var(--color-green-wa)]" />
            Número do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Número com DDD</Label>
            <Input
              value={config.numero}
              onChange={(e) => setConfig((c) => ({ ...c, numero: e.target.value }))}
              placeholder="(11) 99999-9999"
              data-testid="whatsapp-numero-input"
            />
            <p className="text-xs text-[var(--color-muted)]">
              Este número será usado no checkout para abrir a conversa com o cliente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variáveis disponíveis */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase mb-2">Variáveis disponíveis nas mensagens</p>
          <div className="flex flex-wrap gap-2">
            {VARIAVEIS.map((v) => (
              <code key={v} className="rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-orange)] font-mono">
                {v}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Modelos de mensagem por status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5" data-testid="whatsapp-mensagens-form">
          {(Object.keys(STATUS_LABELS) as Array<keyof ConfigWhatsApp["mensagens"]>).map((status) => (
            <div key={status} className="space-y-1.5">
              <Label>
                {STATUS_LABELS[status]}
                <span className="ml-2 text-[10px] font-normal text-[var(--color-muted)]">{STATUS_HINTS[status]}</span>
              </Label>
              <textarea
                value={config.mensagens[status]}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    mensagens: { ...c.mensagens, [status]: e.target.value },
                  }))
                }
                rows={3}
                placeholder={`Mensagem para status: ${STATUS_LABELS[status]}`}
                data-testid={`whatsapp-mensagem-${status}-input`}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)] resize-none"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={salvar} loading={salvando} data-testid="whatsapp-salvar-button">
          <Save className="h-4 w-4" /> Salvar configurações
        </Button>
      </div>
    </div>
  );
}
