"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

const CREAM = "#f5ede3";
const DARK = "#111111";
const ORANGE = "#f97316";
const BORDER = "#ddd5c8";

// ── Header ────────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: CREAM, borderColor: BORDER }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="MeVêUm"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-black text-xl" style={{ color: DARK }}>
            Me<span style={{ color: ORANGE }}>Vê</span>Um
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#555" }}>
          <a href="#funcionalidades" className="hover:text-black transition-colors">Funcionalidades</a>
          <a href="#cardapio" className="hover:text-black transition-colors">Cardápio digital</a>
          <a href="#dashboard" className="hover:text-black transition-colors">Dashboard</a>
          <a href="#precos" className="hover:text-black transition-colors">Preços</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm" style={{ color: "#444" }}>
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: DARK }}
          >
            Teste grátis →
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Lead Form ─────────────────────────────────────────────────────────────────
function LeadForm() {
  const [aceito, setAceito] = useState(false);
  const inputCls = "w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-colors";
  const inputStyle = { borderColor: BORDER, backgroundColor: "#faf8f5", color: DARK };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {[
        { label: "Nome", type: "text", placeholder: "Seu nome" },
        { label: "Empresa", type: "text", placeholder: "Nome do seu restaurante" },
        { label: "E-mail", type: "email", placeholder: "voce@restaurante.com" },
        { label: "WhatsApp", type: "tel", placeholder: "(11) 90000-0000" },
      ].map((f) => (
        <div key={f.label}>
          <label className="block text-sm font-medium mb-1" style={{ color: DARK }}>
            {f.label}
          </label>
          <input type={f.type} placeholder={f.placeholder} className={inputCls} style={inputStyle} />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: DARK }}>
            Faturamento mensal
          </label>
          <select className={inputCls} style={inputStyle}>
            <option value="">Selecionar</option>
            <option>Até R$ 10 mil</option>
            <option>R$ 10k – R$ 50k</option>
            <option>Acima de R$ 50k</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: DARK }}>
            Segmento
          </label>
          <select className={inputCls} style={inputStyle}>
            <option value="">Selecionar</option>
            <option>Hamburgueria</option>
            <option>Pizzaria</option>
            <option>Restaurante</option>
            <option>Lanchonete</option>
          </select>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <input
          id="privacidade"
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
          className="mt-0.5 flex-shrink-0"
        />
        <label htmlFor="privacidade" className="text-xs" style={{ color: "#666" }}>
          Declaro que li e aceito a{" "}
          <span className="underline cursor-pointer" style={{ color: ORANGE }}>
            Política de Privacidade
          </span>
          .
        </label>
      </div>
      <button
        type="submit"
        className="w-full text-white font-bold py-3 rounded-lg tracking-wider text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: ORANGE }}
      >
        TESTAR AGORA →
      </button>
    </form>
  );
}

// ── Device Mockups ────────────────────────────────────────────────────────────
function DeviceMockups() {
  return (
    <div className="relative mt-8" style={{ height: 220 }}>
      {/* Laptop */}
      <div className="absolute left-0 bottom-0" style={{ width: 260 }}>
        <div
          className="rounded-t-xl overflow-hidden border-4 shadow-2xl"
          style={{ borderColor: "#2a2a2a", backgroundColor: "#1a1a1a" }}
        >
          <div className="p-1.5" style={{ backgroundColor: "#fff8f2" }}>
            <div className="flex gap-1" style={{ height: 130 }}>
              <div className="w-10 rounded flex flex-col gap-1 p-1.5" style={{ backgroundColor: "#111" }}>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: ORANGE }}></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-2 w-full rounded-sm" style={{ backgroundColor: "#2a2a2a" }}></div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "FAT", value: "R$8.640" },
                    { label: "TICKET", value: "R$47,80" },
                    { label: "PEDIDOS", value: "182" },
                    { label: "TEMPO", value: "23min" },
                  ].map((m) => (
                    <div key={m.label} className="rounded p-1 border" style={{ backgroundColor: "#fff", borderColor: "#f0ebe5" }}>
                      <div className="text-[5px] font-medium" style={{ color: "#aaa" }}>{m.label}</div>
                      <div className="text-[8px] font-black" style={{ color: DARK }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded border p-1 overflow-hidden" style={{ backgroundColor: "#fff", borderColor: "#f0ebe5" }}>
                  {[
                    { name: "Smash Bacon Duplo", status: "EM PREPARO", bg: "#fef3e2", color: "#c2410c" },
                    { name: "Combo Família", status: "SAIU", bg: "#dbeafe", color: "#1d4ed8" },
                    { name: "Pizza Calabresa", status: "PAGO PIX", bg: "#dcfce7", color: "#15803d" },
                  ].map((o) => (
                    <div key={o.name} className="flex items-center justify-between border-b py-0.5 last:border-0" style={{ borderColor: "#f5f5f5" }}>
                      <span className="text-[5px]" style={{ color: "#333" }}>{o.name}</span>
                      <span className="text-[4px] px-1 rounded" style={{ backgroundColor: o.bg, color: o.color }}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2 rounded-b" style={{ backgroundColor: "#2a2a2a" }}></div>
      </div>

      {/* Phone */}
      <div
        className="absolute right-4 bottom-4 rounded-3xl border-4 shadow-2xl overflow-hidden"
        style={{ width: 120, borderColor: "#1a1a1a", backgroundColor: "#111" }}
      >
        <div className="p-2" style={{ background: "linear-gradient(to bottom, #f97316, #ea580c)" }}>
          <div className="text-[5px] font-medium mb-0.5" style={{ color: "#fed7aa" }}>CARDÁPIO · ABERTO</div>
          <div className="text-[9px] font-black text-white leading-tight">Burger do Bairro</div>
          <div className="flex gap-1 mt-1 overflow-hidden">
            {["Mais pedidos", "Burgers", "Pizzas"].map((t, i) => (
              <span
                key={t}
                className="text-[5px] px-1 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                style={{ backgroundColor: i === 0 ? "#fff" : "rgba(255,255,255,0.25)", color: i === 0 ? ORANGE : "#fff" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="p-1.5 space-y-1.5" style={{ backgroundColor: "#fff" }}>
          {[
            { name: "Smash Bacon Duplo", price: "R$ 38,90", tag: "MAIS PEDIDO" },
            { name: "Pizza Calabresa Artesanal", price: "R$ 52,00" },
            { name: "Combo Família", price: "R$ 119,90", tag: "COMBO" },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-1 border-b pb-1 last:border-0" style={{ borderColor: "#f5f5f5" }}>
              <div className="w-7 h-7 rounded flex-shrink-0" style={{ backgroundColor: ORANGE }}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-0.5 flex-wrap">
                  <span className="text-[5px] font-semibold" style={{ color: DARK }}>{item.name}</span>
                  {item.tag && (
                    <span className="text-[4px] px-0.5 rounded" style={{ backgroundColor: "#fef3e2", color: "#c2410c" }}>{item.tag}</span>
                  )}
                </div>
                <div className="text-[6px] font-bold" style={{ color: ORANGE }}>{item.price}</div>
              </div>
            </div>
          ))}
          <button className="w-full text-white text-[5px] font-bold py-1.5 rounded-full" style={{ backgroundColor: ORANGE }}>
            Finalizar pedido · R$ 92,80
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ backgroundColor: CREAM }} className="pt-12 pb-20 px-6" id="inicio">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div
            className="inline-flex items-center gap-2 text-sm rounded-full px-4 py-1.5 mb-6 border"
            style={{ backgroundColor: "#fff", borderColor: BORDER, color: "#555" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }}></span>
            Sistema para Delivery e Restaurante
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-5" style={{ color: DARK }}>
            O Cardápio Digital{" "}
            <span style={{ color: ORANGE }}>
              mais
              <br />
              completo
            </span>{" "}
            do Brasil.
          </h1>
          <p className="text-lg leading-relaxed max-w-lg" style={{ color: "#555" }}>
            Experimente a ferramenta que vai automatizar seus pedidos de WhatsApp, aumentar suas
            vendas com marketing e profissionalizar a gestão do seu negócio de uma vez por todas.
          </p>
          <DeviceMockups />
        </div>
        <div className="rounded-2xl shadow-xl p-8 border" style={{ backgroundColor: "#fff", borderColor: BORDER }}>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

// ── Logos Strip ───────────────────────────────────────────────────────────────
function LogosStrip() {
  return (
    <section
      className="py-8 px-6"
      style={{ backgroundColor: CREAM, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest mb-4" style={{ color: "#aaa" }}>
          INTEGRAÇÕES NATIVAS
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-12 gap-y-2">
          {["Rappi", "Uber Eats", "PagSeguro", "Getnet", "Ame Digital", "iFood", "Mercado Pago"].map((logo) => (
            <span key={logo} className="text-base font-semibold" style={{ color: "#999" }}>
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Problema Section ──────────────────────────────────────────────────────────
function ProblemaSection() {
  const problemas = [
    { num: "01", titulo: "Áudio de 4 minutos", descricao: "para confirmar 2 hambúrgueres." },
    { num: "02", titulo: "Print perdido", descricao: "no meio de 80 conversas no WhatsApp." },
    { num: "03", titulo: "Anotação errada", descricao: "vira reclamação e pedido refeito." },
    { num: "04", titulo: "Cozinha sem fila", descricao: "sai pedido frio, cliente reclama." },
  ];

  return (
    <section style={{ backgroundColor: DARK }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest mb-4" style={{ color: ORANGE }}>
            O PROBLEMA
          </p>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6 text-white">
            WhatsApp desorganizado custa caro.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#888" }}>
            A maioria dos restaurantes brasileiros perde de 8% a 15% dos pedidos por bagunça
            operacional. Não é falta de cliente — é falta de sistema.
          </p>
        </div>
        <div>
          {problemas.map((p) => (
            <div key={p.num} className="flex items-start gap-6 py-5 border-b" style={{ borderColor: "#2a2a2a" }}>
              <span className="text-sm font-mono flex-shrink-0 mt-0.5" style={{ color: "#555" }}>
                {p.num}
              </span>
              <div>
                <p className="font-bold text-white text-base">{p.titulo}</p>
                <p className="text-sm mt-0.5" style={{ color: "#777" }}>{p.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Funcionalidades Section ───────────────────────────────────────────────────
function FuncionalidadesSection() {
  const cards = [
    { num: "01", titulo: "Pedido entrou, cozinha viu.", descricao: "Cada pedido cai direto na tela da cozinha, com tempo, status e prioridade. Sem print, sem dúvida." },
    { num: "02", titulo: "Cardápio digital que vende.", descricao: "Fotos, combos, adicionais e cupons. Cliente escolhe pelo celular e finaliza no PIX em segundos." },
    { num: "03", titulo: "QR Code na mesa.", descricao: "Cada mesa tem seu próprio QR. Cliente abre, pede, paga. Garçom só leva e fecha." },
    { num: "04", titulo: "WhatsApp organizado.", descricao: "Mensagens viram pedidos formais. Atalhos, automações e disparo de campanhas para a sua base." },
  ];

  return (
    <section id="funcionalidades" style={{ backgroundColor: CREAM }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: ORANGE }}>
              COMO O MEVÊUM RESOLVE
            </p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight" style={{ color: DARK }}>
              Tudo que sua operação precisa.{" "}
              <span style={{ color: ORANGE }}>Em uma tela só.</span>
            </h2>
          </div>
          <a href="/register" className="text-sm font-semibold" style={{ color: ORANGE }}>
            Quero testar no meu restaurante →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: BORDER }}>
          {cards.map((card) => (
            <div key={card.num} className="p-8" style={{ backgroundColor: "#fff" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black px-2.5 py-1.5 rounded-xl text-white" style={{ backgroundColor: DARK }}>
                  {card.num}
                </span>
                <span className="text-xs font-semibold tracking-widest" style={{ color: "#aaa" }}>
                  FUNCIONALIDADE
                </span>
              </div>
              <h3 className="text-xl font-black mb-2" style={{ color: DARK }}>{card.titulo}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{card.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Phone Mockup ──────────────────────────────────────────────────────────────
function PhoneMockupCardapio() {
  return (
    <div className="relative">
      <div
        className="absolute -left-8 top-16 z-10 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg border"
        style={{ backgroundColor: "#fff", borderColor: BORDER, color: DARK }}
      >
        PAGAMENTO PIX ✓
      </div>
      <div
        className="rounded-[2.5rem] border-4 shadow-2xl overflow-hidden"
        style={{ width: 280, borderColor: DARK, backgroundColor: DARK }}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-20 h-4 rounded-full" style={{ backgroundColor: "#222" }}></div>
        </div>
        <div className="px-4 pb-3" style={{ background: "linear-gradient(to bottom, #f97316, #ea580c)" }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: "#fed7aa" }}>CARDÁPIO · ABERTO</div>
          <div className="text-lg font-black text-white">Burger do Bairro</div>
          <div className="flex gap-2 mt-2 overflow-hidden">
            {["Mais pedidos", "Burgers", "Pizzas", "Bebidas", "Sobrem."].map((cat, i) => (
              <span
                key={cat}
                className="text-[9px] px-2 py-1 rounded-full flex-shrink-0 font-medium whitespace-nowrap"
                style={{ backgroundColor: i === 0 ? "#fff" : "rgba(255,255,255,0.2)", color: i === 0 ? ORANGE : "#fff" }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-3 space-y-3">
          {[
            { name: "Smash Bacon Duplo", desc: "Dois blends 90g, cheddar, bacon crocante, molho da casa.", price: "R$ 38,90", tag: "MAIS PEDIDO" },
            { name: "Pizza Calabresa Artesanal", desc: "Massa fermentada 48h, mussarela e calabresa premium.", price: "R$ 52,00" },
            { name: "Combo Família", desc: "4 burgers, 2 fritas grandes e 2 refris 600ml.", price: "R$ 119,90", tag: "COMBO" },
          ].map((item) => (
            <div key={item.name} className="flex gap-3 border-b pb-3 last:border-0" style={{ borderColor: "#f5f5f5" }}>
              <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: ORANGE }}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-xs font-bold" style={{ color: DARK }}>{item.name}</span>
                  {item.tag && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: "#fef3e2", color: "#c2410c" }}>
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-[10px] leading-tight mb-1" style={{ color: "#888" }}>{item.desc}</p>
                <span className="text-xs font-bold" style={{ color: ORANGE }}>{item.price}</span>
              </div>
            </div>
          ))}
          <button className="w-full text-white text-xs font-bold py-3 rounded-full" style={{ backgroundColor: ORANGE }}>
            Finalizar pedido · R$ 92,80
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cardápio Section ──────────────────────────────────────────────────────────
function CardapioSection() {
  return (
    <section id="cardapio" style={{ backgroundColor: CREAM, borderTop: `1px solid ${BORDER}` }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest mb-4" style={{ color: ORANGE }}>
            CARDÁPIO DIGITAL
          </p>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5" style={{ color: DARK }}>
            Seu cardápio online pronto para vender.
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#555" }}>
            Personalize cores, fotos, combos e adicionais. Funciona em qualquer celular, sem
            instalação. Compartilhe um link, cole um QR Code — e está vendendo.
          </p>
          <ul className="space-y-3">
            {[
              "Fotos profissionais com IA de realce",
              "Combos, adicionais e variações ilimitadas",
              "Cupom, frete por bairro e horário de funcionamento",
              "Pagamento PIX, cartão e dinheiro na entrega",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "#444" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: ORANGE }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <PhoneMockupCardapio />
        </div>
      </div>
    </section>
  );
}

// ── Dashboard Section ─────────────────────────────────────────────────────────
function DashboardSection() {
  const metrics = [
    { label: "PEDIDOS HOJE", value: "182", delta: "+24% vs ontem", positive: true },
    { label: "FATURAMENTO", value: "R$ 8.640", delta: "+18% vs ontem", positive: true },
    { label: "TICKET MÉDIO", value: "R$ 47,80", delta: "+R$ 3,20 vs ontem", positive: true },
    { label: "TEMPO MÉDIO", value: "23 min", delta: "−4 min vs ontem", positive: false },
  ];
  const orders = [
    { id: "#1024", name: "Smash Bacon Duplo", sub: "Marina Alves · Mesa 08", status: "EM PREPARO", valor: "R$ 52,80", cor: "#f97316" },
    { id: "#1023", name: "Combo Família", sub: "João Pedro · Delivery", status: "SAIU P/ ENTREGA", valor: "R$ 119,90", cor: "#3b82f6" },
    { id: "#1022", name: "Pizza Calabresa", sub: "Bruno C. · Mesa 03", status: "PAGO PIX", valor: "R$ 64,00", cor: "#22c55e" },
    { id: "#1021", name: "Açaí 500ml + Granola", sub: "Patrícia B. · Balcão", status: "PRONTO", valor: "R$ 24,90", cor: "#22c55e" },
    { id: "#1020", name: "Hambúrguer Clássico + Coca", sub: "Lucas M. · Delivery", status: "ACEITO", valor: "R$ 38,90", cor: "#666" },
  ];
  const clientes = [
    { initials: "MA", name: "Marina Alves", pedidos: "12 pedidos", badge: "VIP", cor: "#f97316" },
    { initials: "JP", name: "João Pedro", pedidos: "8 pedidos", badge: "RECORRENTE", cor: "#3b82f6" },
    { initials: "PB", name: "Patrícia Bento", pedidos: "6 pedidos", badge: "RECORRENTE", cor: "#3b82f6" },
    { initials: "BC", name: "Bruno Carmo", pedidos: "4 pedidos", badge: "NOVO", cor: "#666" },
  ];

  return (
    <section id="dashboard" style={{ backgroundColor: "#111" }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: ORANGE }}>
              DASHBOARD OPERACIONAL
            </p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight text-white">
              Você enxerga tudo. Em tempo real.
            </h2>
            <p className="mt-3 text-base max-w-lg" style={{ color: "#888" }}>
              Pedidos, faturamento, ticket médio, fila da cozinha, clientes recorrentes. Decisões
              na hora — sem planilha, sem achismo.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold self-end px-4 py-2 rounded-lg border"
            style={{ borderColor: "#333", color: "#ddd" }}
          >
            Abrir demo do dashboard →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl p-4" style={{ backgroundColor: "#1e1e1e", border: "1px solid #2a2a2a" }}>
              <p className="text-[10px] font-semibold tracking-widest mb-2" style={{ color: "#666" }}>{m.label}</p>
              <p className="text-2xl font-black text-white">{m.value}</p>
              <p className="text-xs mt-1" style={{ color: m.positive ? "#4ade80" : "#888" }}>{m.delta}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#2a2a2a" }}>
              <span className="font-bold text-white text-sm">Pedidos · Live</span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#4ade80" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                conectado
              </span>
            </div>
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-4 px-5 py-3 border-b last:border-0" style={{ borderColor: "#2a2a2a" }}>
                <span className="text-xs w-12 flex-shrink-0" style={{ color: "#555" }}>{o.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{o.name}</p>
                  <p className="text-xs" style={{ color: "#666" }}>{o.sub}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: `${o.cor}22`, color: o.cor }}>
                  {o.status}
                </span>
                <span className="text-sm font-bold text-white flex-shrink-0">{o.valor}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "#2a2a2a" }}>
              <span className="font-bold text-white text-sm">Clientes recorrentes</span>
            </div>
            <div className="p-4 space-y-3">
              {clientes.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: c.cor }}
                  >
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs" style={{ color: "#666" }}>{c.pedidos}</p>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${c.cor}22`, color: c.cor }}>
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t p-4" style={{ borderColor: "#2a2a2a", backgroundColor: "#141414" }}>
              <p className="text-[10px] font-semibold tracking-widest mb-1" style={{ color: "#555" }}>TOP DO DIA</p>
              <p className="text-base font-black text-white">Smash Bacon Duplo</p>
              <p className="text-xs" style={{ color: "#888" }}>38 unidades · R$ 1.478</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WhatsApp + QR Section ─────────────────────────────────────────────────────
function WhatsAppQRSection() {
  return (
    <section style={{ backgroundColor: CREAM, borderTop: `1px solid ${BORDER}` }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: "#fff", borderColor: BORDER }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: "#25d366" }}>
              W
            </div>
            <span className="text-xs font-semibold tracking-widest" style={{ color: "#888" }}>INTEGRAÇÃO WHATSAPP</span>
          </div>
          <h3 className="text-3xl font-black leading-tight mb-3" style={{ color: DARK }}>
            Menos áudio.<br />Mais venda.
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#666" }}>
            Mensagens viram pedidos formais. Confirmação automática, atualizações de status e
            campanhas para sua base de clientes — tudo dentro do WhatsApp oficial.
          </p>
          <div className="space-y-2">
            {[
              { text: "Quero 2 smash bacon e uma coca 2L", side: "right", bg: "#dcfce7", color: "#166534" },
              { text: "Pedido #1024 confirmado · R$ 92,80 · entrega em 35min", side: "left", bg: "#f5f5f5", color: "#333" },
              { text: "PIX já fiz", side: "right", bg: "#dcfce7", color: "#166534" },
              { text: "Recebido ✅ Cozinha já está preparando.", side: "left", bg: "#f5f5f5", color: "#333" },
            ].map((b, i) => (
              <div key={i} className={`flex ${b.side === "right" ? "justify-end" : "justify-start"}`}>
                <span className="text-xs px-3 py-2 rounded-2xl max-w-[80%]" style={{ backgroundColor: b.bg, color: b.color }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: ORANGE }}>
              QR
            </div>
            <span className="text-xs font-semibold tracking-widest" style={{ color: "#666" }}>QR CODE PARA MESAS</span>
          </div>
          <h3 className="text-3xl font-black leading-tight mb-3 text-white">
            Cliente pede sem chamar garçom.
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#888" }}>
            Cada mesa tem seu próprio QR. O cliente abre o cardápio, monta o pedido, paga no PIX
            — e o garçom só leva.
          </p>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Mesa 01", highlight: false },
              { label: "Mesa 02", highlight: false },
              { label: "Mesa 03", highlight: false },
              { label: "Mesa 08", highlight: true },
              { label: "Balcão", highlight: false },
            ].map((mesa) => (
              <div key={mesa.label} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-full aspect-square rounded-xl p-2 flex items-center justify-center"
                  style={{ backgroundColor: mesa.highlight ? ORANGE : "#2a2a2a", border: `2px solid ${mesa.highlight ? ORANGE : "#333"}` }}
                >
                  <div className="w-full h-full grid grid-cols-4 gap-[2px]">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-[1px]"
                        style={{
                          backgroundColor: [0, 1, 4, 5, 3, 7, 8, 10, 12, 13, 15].includes(i)
                            ? mesa.highlight ? "#fff" : ORANGE
                            : "transparent",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-medium text-center" style={{ color: "#888" }}>
                  {mesa.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Depoimentos + Stats ───────────────────────────────────────────────────────
function DepoimentosSection() {
  const depoimentos = [
    { initials: "PB", nome: "Patrick Bartholzai", cargo: "Dono · BBB Burger", receita: "+R$ 60 MIL/MÊS", texto: '"Saímos do caos do WhatsApp. Hoje a cozinha enxerga tudo, e os pedidos saem no tempo certo. Cresci 40% em 3 meses."' },
    { initials: "JM", nome: "Júlia Martins", cargo: "Pizzaria da Júlia", receita: "+R$ 100 MIL/MÊS", texto: '"Atendia 1 cliente por vez no atendimento. Hoje atendo 12. O MeVêUm pagou ele mesmo na primeira semana."' },
    { initials: "BF", nome: "Bruno Felipe", cargo: "Open Burger", receita: "+R$ 30 MIL/MÊS", texto: '"Sou de cidade pequena. Achava que tecnologia não era pra mim. Em uma noite de 40 pedidos, 3 manuais e 37 no app."' },
  ];

  return (
    <section style={{ backgroundColor: CREAM, borderTop: `1px solid ${BORDER}` }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: ORANGE }}>
          QUEM USA, VENDE MAIS
        </p>
        <h2 className="text-4xl lg:text-5xl font-black mb-12" style={{ color: DARK }}>
          Restaurantes brasileiros
          <br />
          que viraram a chave.
        </h2>
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {depoimentos.map((d) => (
            <div key={d.nome} className="rounded-2xl p-6 border" style={{ backgroundColor: "#fff", borderColor: BORDER }}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: ORANGE }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#333" }}>{d.texto}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ backgroundColor: "#f0ebe5", color: "#666" }}>
                    {d.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: DARK }}>{d.nome}</p>
                    <p className="text-xs" style={{ color: "#888" }}>{d.cargo}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white flex-shrink-0" style={{ backgroundColor: DARK }}>
                  {d.receita}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b" style={{ borderColor: BORDER }}>
          {[
            { value: "+2.400", label: "RESTAURANTES ATIVOS" },
            { value: "30M", label: "PEDIDOS PROCESSADOS" },
            { value: "R$ 5bi", label: "TRANSACIONADOS" },
            { value: "20%", label: "AUMENTO MÉDIO EM VENDAS" },
          ].map((s, i) => (
            <div key={s.label} className={`py-10 text-center ${i > 0 ? "border-l" : ""}`} style={{ borderColor: BORDER }}>
              <p className="text-4xl font-black mb-1" style={{ color: DARK }}>{s.value}</p>
              <p className="text-[10px] font-semibold tracking-widest" style={{ color: "#aaa" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Como funciona o suporte?", a: "Suporte humano de segunda a domingo, das 8h às 23h via WhatsApp e e-mail. Sem bot na primeira resposta." },
  { q: "Funciona no celular do garçom?", a: "Sim. O painel funciona em qualquer celular com navegador. Sem necessidade de instalar app." },
  { q: "Quanto custa?", a: "Planos a partir de R$ 149/mês. Teste grátis por 30 dias sem cartão de crédito." },
  { q: "Preciso de maquininha?", a: "Não. O pagamento via PIX é nativo. Se quiser aceitar cartão, integra com qualquer adquirente." },
  { q: "Consigo imprimir comanda?", a: "Sim. Compatível com impressoras térmicas via USB, Bluetooth ou rede Wi-Fi." },
  { q: "Meu cliente precisa baixar app?", a: "Não. O cardápio digital funciona pelo navegador do celular. Acesso via link ou QR Code." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ backgroundColor: CREAM, borderTop: `1px solid ${BORDER}` }} className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: ORANGE }}>FAQ</p>
          <h2 className="text-4xl font-black mb-4" style={{ color: DARK }}>Ficou com dúvida?</h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#666" }}>
            Fale direto com um consultor. Sem formulário longo, sem agendamento de meia hora.
          </p>
          <a
            href="/register"
            className="inline-block text-white text-sm font-bold px-5 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: ORANGE }}
          >
            Falar com consultor
          </a>
        </div>
        <div>
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="border-b" style={{ borderColor: BORDER }}>
              <button
                className="w-full flex items-center justify-between py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold" style={{ color: DARK }}>{faq.q}</span>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ml-4 font-bold"
                  style={{ backgroundColor: open === i ? DARK : BORDER }}
                >
                  {open === i ? "×" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="pb-4 text-sm leading-relaxed" style={{ color: "#666" }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "PRODUTO", links: ["Cardápio digital", "QR Code para mesas", "WhatsApp", "Cozinha", "Dashboard", "Cupons"] },
    { title: "MEVÊUM", links: ["Sobre", "Blog", "Parceiros", "Trabalhe conosco", "Central de ajuda"] },
    { title: "SUPORTE", links: ["Seg a sáb · 8h–23h", "Domingos · 14h–22h", "WhatsApp", "E-mail", "Status"] },
    { title: "COMUNIDADE", links: ["Grupo de donos", "Mentoria gratuita", "Eventos"] },
  ];

  return (
    <footer style={{ backgroundColor: "#0f0f0f" }} className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="MeVêUm" width={48} height={48} className="object-contain" />
              <span className="font-black text-lg text-white">
                Me<span style={{ color: ORANGE }}>Vê</span>Um
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#666" }}>
              Sistema de pedidos, cardápio digital e gestão para restaurantes brasileiros.
            </p>
            <p className="text-xs" style={{ color: "#555" }}>
              Av. Paulista, 1000 · São Paulo, SP
              <br />
              contato@mevenum.com.br
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-bold tracking-widest mb-4" style={{ color: "#555" }}>{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs transition-colors" style={{ color: "#888" }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex items-center justify-between flex-wrap gap-4" style={{ borderColor: "#1e1e1e" }}>
          <p className="text-xs" style={{ color: "#555" }}>© 2025 MeVêUm. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            {["Privacidade", "Termos", "Cookies"].map((l) => (
              <a key={l} href="#" className="text-xs" style={{ color: "#555" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <LogosStrip />
      <ProblemaSection />
      <FuncionalidadesSection />
      <CardapioSection />
      <DashboardSection />
      <WhatsAppQRSection />
      <DepoimentosSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
