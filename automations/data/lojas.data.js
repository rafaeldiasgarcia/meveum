export function atualizarLojaPayload(loja) {
  return {
    nome: `${loja.nome} Atualizada`,
    slug: `${loja.slug}-atualizada`,
    logoUrl: loja.logoUrl ?? 'https://images.example.test/logo.png',
    whatsappNumber: loja.whatsappNumber ?? '5511999999999',
  };
}

export function atualizarPausaManualPayload(pausadaManualmente) {
  return {
    pausadaManualmente,
  };
}

export function atualizarStatusLojaPayload(status) {
  return {
    status,
  };
}
