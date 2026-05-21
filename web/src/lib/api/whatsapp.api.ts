import type { ConfigWhatsApp } from "@/types";
import { obterLojaId, requestAutenticada } from "@/lib/api/client";

const DEFAULT_CONFIG: ConfigWhatsApp = {
  numero: "",
  mensagens: {
    recebido: "Olá, {{nome}}! Recebemos seu pedido #{{numero}}. Em breve iniciaremos o preparo. 🍽️",
    em_preparo: "Boa notícia, {{nome}}! Seu pedido #{{numero}} está sendo preparado agora. ⏳",
    saiu_entrega: "{{nome}}, seu pedido #{{numero}} saiu para entrega! Fique de olho. 🛵",
    finalizado: "Obrigado pela preferência, {{nome}}! Seu pedido #{{numero}} foi entregue. Bom apetite! 😊",
  },
};

let mockConfig: ConfigWhatsApp = { ...DEFAULT_CONFIG };

export async function buscarConfigWhatsApp(): Promise<ConfigWhatsApp> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<ConfigWhatsApp>(`/whatsapp/config?lojaId=${lojaId}`, { method: "GET" });
  } catch {
    return mockConfig;
  }
}

export async function salvarConfigWhatsApp(data: ConfigWhatsApp): Promise<ConfigWhatsApp> {
  try {
    const lojaId = obterLojaId();
    return await requestAutenticada<ConfigWhatsApp>(`/whatsapp/config?lojaId=${lojaId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    mockConfig = { ...data };
    return mockConfig;
  }
}
