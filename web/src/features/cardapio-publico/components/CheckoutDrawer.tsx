"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { useCarrinho } from "../context/CarrinhoContext";
import { formatCurrency } from "@/lib/utils/format";
import {
  listarAreasEntrega,
  listarFormasPagamento,
  criarCliente,
  criarEndereco,
  criarPedido,
  buscarMensagemWhatsapp,
} from "@/lib/api/cardapio-publico.api";
import type {
  AreaEntrega,
  FormaPagamentoLoja,
  DadosCheckout,
  LojaPublica,
} from "@/types/cardapio-publico";

type Etapa = "tipo" | "dados" | "endereco" | "pagamento" | "resumo";

type Props = {
  lojaId: string;
  loja: LojaPublica;
  onFechar: () => void;
  onVoltarCarrinho: () => void;
};

const LABELS_PAGAMENTO: Record<string, string> = {
  PIX: "Pix",
  CASH: "Dinheiro",
  CREDIT_CARD_DELIVERY: "Cartão de Crédito (na entrega)",
  DEBIT_CARD_DELIVERY: "Cartão de Débito (na entrega)",
};

const dadosIniciais: DadosCheckout = {
  tipo: null,
  nome: "",
  telefone: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  referencia: "",
  areaEntregaId: null,
  taxaEntrega: 0,
  formaPagamento: null,
  precisaTroco: false,
  trocoPara: "",
  observacao: "",
};

export function CheckoutDrawer({ lojaId, onFechar, onVoltarCarrinho }: Props) {
  const { itens, total, limpar } = useCarrinho();
  const [etapa, setEtapa] = useState<Etapa>("tipo");
  const [dados, setDados] = useState<DadosCheckout>(dadosIniciais);
  const [areas, setAreas] = useState<AreaEntrega[]>([]);
  const [formas, setFormas] = useState<FormaPagamentoLoja[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  useEffect(() => {
    listarAreasEntrega(lojaId).then(setAreas).catch(() => []);
    listarFormasPagamento(lojaId).then(setFormas).catch(() => []);
  }, [lojaId]);

  function set<K extends keyof DadosCheckout>(campo: K, valor: DadosCheckout[K]) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function avancar() {
    if (etapa === "tipo") setEtapa("dados");
    else if (etapa === "dados") setEtapa(dados.tipo === "DELIVERY" ? "endereco" : "pagamento");
    else if (etapa === "endereco") setEtapa("pagamento");
    else if (etapa === "pagamento") setEtapa("resumo");
  }

  function voltar() {
    if (etapa === "tipo") { onVoltarCarrinho(); return; }
    if (etapa === "dados") setEtapa("tipo");
    else if (etapa === "endereco") setEtapa("dados");
    else if (etapa === "pagamento") setEtapa(dados.tipo === "DELIVERY" ? "endereco" : "dados");
    else if (etapa === "resumo") setEtapa("pagamento");
  }

  async function finalizar() {
    setEnviando(true);
    try {
      const cliente = await criarCliente({ lojaId, nome: dados.nome, telefone: dados.telefone });

      let enderecoId: string | undefined;
      if (dados.tipo === "DELIVERY") {
        const end = await criarEndereco(cliente.id, {
          rua: dados.rua,
          numero: dados.numero,
          complemento: dados.complemento || undefined,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          cep: dados.cep || undefined,
          referencia: dados.referencia || undefined,
        });
        enderecoId = end.id;
      }

      const pedido = await criarPedido({
        lojaId,
        clienteId: cliente.id,
        enderecoClienteId: enderecoId,
        nomeCliente: dados.nome,
        telefoneCliente: dados.telefone,
        tipoRecebimento: dados.tipo!,
        formaPagamento: dados.formaPagamento!,
        precisaTroco: dados.precisaTroco || undefined,
        trocoPara: dados.trocoPara ? parseFloat(dados.trocoPara) : undefined,
        observacaoCliente: dados.observacao || undefined,
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          complementos: i.complementosSelecionados.map((c) => ({
            opcaoComplementoId: c.opcaoComplementoId,
            quantidade: c.quantidade,
          })),
        })),
      });

      setPedidoId(pedido.id);

      const msg = await buscarMensagemWhatsapp(pedido.id);
      window.open(msg.urlEnvio, "_blank");

      limpar();
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  const areaSelected = areas.find((a) => a.id === dados.areaEntregaId);
  const totalFinal = total + dados.taxaEntrega;

  if (pedidoId) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-bold text-gray-900 text-lg">Pedido enviado!</h2>
          <p className="text-sm text-gray-500">
            Seu pedido foi aberto no WhatsApp. Aguarde a confirmação da loja.
          </p>
          <button
            onClick={onFechar}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            Voltar ao cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onFechar} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />

        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 mt-1">
          <button onClick={voltar} className="p-1 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="font-semibold text-gray-900 text-base flex-1 text-center pr-7">
            {etapa === "tipo" && "Como deseja receber?"}
            {etapa === "dados" && "Seus dados"}
            {etapa === "endereco" && "Endereço de entrega"}
            {etapa === "pagamento" && "Forma de pagamento"}
            {etapa === "resumo" && "Resumo do pedido"}
          </h2>
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
          {etapa === "tipo" && (
            <div className="space-y-3">
              {(["DELIVERY", "PICKUP"] as const).map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    dados.tipo === t
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo-recebimento"
                    checked={dados.tipo === t}
                    onChange={() => set("tipo", t)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t === "DELIVERY" ? "Delivery" : "Retirada"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {t === "DELIVERY" ? "Entregamos na sua casa" : "Busque no balcão"}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {etapa === "dados" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Nome *</label>
                <input
                  value={dados.nome}
                  onChange={(e) => set("nome", e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Telefone / WhatsApp *</label>
                <input
                  value={dados.telefone}
                  onChange={(e) => set("telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  type="tel"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Observação (opcional)</label>
                <textarea
                  value={dados.observacao}
                  onChange={(e) => set("observacao", e.target.value)}
                  placeholder="Ex: Tocar a campainha, cachorro bravo"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </div>
          )}

          {etapa === "endereco" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Rua *</label>
                  <input
                    value={dados.rua}
                    onChange={(e) => set("rua", e.target.value)}
                    placeholder="Rua das Flores"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Número *</label>
                  <input
                    value={dados.numero}
                    onChange={(e) => set("numero", e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Complemento</label>
                <input
                  value={dados.complemento}
                  onChange={(e) => set("complemento", e.target.value)}
                  placeholder="Apto 12, Bloco B"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Bairro *</label>
                  <input
                    value={dados.bairro}
                    onChange={(e) => set("bairro", e.target.value)}
                    placeholder="Centro"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">CEP</label>
                  <input
                    value={dados.cep}
                    onChange={(e) => set("cep", e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Cidade *</label>
                  <input
                    value={dados.cidade}
                    onChange={(e) => set("cidade", e.target.value)}
                    placeholder="São Paulo"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">UF *</label>
                  <input
                    value={dados.estado}
                    onChange={(e) => set("estado", e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {areas.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Área de entrega</label>
                  <div className="space-y-1.5">
                    {areas.filter((a) => a.ativo).map((area) => (
                      <label
                        key={area.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-300 cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-colors"
                      >
                        <input
                          type="radio"
                          name="area-entrega"
                          checked={dados.areaEntregaId === area.id}
                          onChange={() => {
                            set("areaEntregaId", area.id);
                            set("taxaEntrega", area.taxa);
                          }}
                          className="accent-orange-500"
                        />
                        <span className="flex-1 text-sm font-medium text-gray-900">{area.nome}</span>
                        <span className="text-sm font-medium text-gray-500">
                          {area.taxa === 0 ? "Grátis" : `+${formatCurrency(area.taxa)}`}
                          {" · "}
                          <span className="text-xs text-gray-400">{area.tempoEstimadoMinutos} min</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {etapa === "pagamento" && (
            <div className="space-y-2">
              {formas.filter((f) => f.ativo).map((forma) => (
                <label
                  key={forma.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-300 cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-colors"
                >
                  <input
                    type="radio"
                    name="forma-pagamento"
                    checked={dados.formaPagamento === forma.formaPagamento}
                    onChange={() => set("formaPagamento", forma.formaPagamento)}
                    className="accent-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {LABELS_PAGAMENTO[forma.formaPagamento] ?? forma.formaPagamento}
                  </span>
                </label>
              ))}

              {dados.formaPagamento === "CASH" && (
                <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dados.precisaTroco}
                      onChange={(e) => set("precisaTroco", e.target.checked)}
                      className="accent-orange-500"
                    />
                    Preciso de troco
                  </label>
                  {dados.precisaTroco && (
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Troco para quanto?</label>
                      <input
                        value={dados.trocoPara}
                        onChange={(e) => set("trocoPara", e.target.value)}
                        placeholder="Ex: 50,00"
                        type="number"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {etapa === "resumo" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                {itens.map((i) => (
                  <div key={i.uid} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {i.quantidade}× {i.nomeProduto}
                    </span>
                    <span className="font-medium">{formatCurrency(i.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{formatCurrency(total)}</span>
                </div>
                {dados.tipo === "DELIVERY" && (
                  <div className="flex justify-between text-gray-500">
                    <span>Taxa de entrega</span>
                    <span>{dados.taxaEntrega === 0 ? "Grátis" : formatCurrency(dados.taxaEntrega)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                  <span>Total</span>
                  <span className="text-orange-600">{formatCurrency(dados.tipo === "DELIVERY" ? totalFinal : total)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo</span>
                  <span>{dados.tipo === "DELIVERY" ? "Delivery" : "Retirada"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pagamento</span>
                  <span>{LABELS_PAGAMENTO[dados.formaPagamento ?? ""] ?? ""}</span>
                </div>
                {dados.tipo === "DELIVERY" && areaSelected && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Área</span>
                    <span>{areaSelected.nome} · {areaSelected.tempoEstimadoMinutos} min</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-4 border-t border-gray-100">
          {etapa === "resumo" ? (
            <button
              onClick={finalizar}
              disabled={enviando}
              className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {enviando ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
              ) : (
                "Confirmar e abrir WhatsApp"
              )}
            </button>
          ) : (
            <button
              onClick={avancar}
              disabled={
                (etapa === "tipo" && !dados.tipo) ||
                (etapa === "dados" && (!dados.nome.trim() || !dados.telefone.trim())) ||
                (etapa === "endereco" && (!dados.rua.trim() || !dados.numero.trim() || !dados.bairro.trim() || !dados.cidade.trim() || !dados.estado.trim())) ||
                (etapa === "pagamento" && !dados.formaPagamento)
              }
              className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
