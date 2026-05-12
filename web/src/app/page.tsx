"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

// ── Header ────────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-lborder/60 backdrop-blur-md"
      style={{ backgroundColor: "rgba(251,247,244,0.85)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MeVêUm"
            width={130}
            height={52}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-lmuted md:flex">
          <a href="#funcionalidades" className="hover:text-charcoal transition-colors">Funcionalidades</a>
          <a href="#cardapio" className="hover:text-charcoal transition-colors">Cardápio digital</a>
          <a href="#dashboard" className="hover:text-charcoal transition-colors">Dashboard</a>
          <a href="#precos" className="hover:text-charcoal transition-colors">Preços</a>
          <a href="#faq" className="hover:text-charcoal transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-charcoal/80 hover:text-charcoal sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            href="#cta"
            className="inline-flex items-center gap-2 rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-cream shadow-soft transition hover:bg-graphite"
          >
            Teste grátis<span className="text-ember">→</span>
          </Link>
          <button
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-lborder md:hidden"
          >
            <span className="block h-px w-4 bg-charcoal" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ── Lead Form ─────────────────────────────────────────────────────────────────
function LeadForm() {
  const [aceito, setAceito] = useState(false);

  return (
    <form
      className="rounded-2xl border border-lborder bg-white p-6 shadow-lift md:p-7"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-3.5">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-charcoal/80">Nome</span>
          <input required maxLength={100} placeholder="Seu nome" className="input-base" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-charcoal/80">Empresa</span>
          <input required maxLength={120} placeholder="Nome do seu restaurante" className="input-base" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-charcoal/80">E-mail</span>
          <input required type="email" maxLength={160} placeholder="voce@restaurante.com" className="input-base" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-charcoal/80">WhatsApp</span>
          <input required maxLength={20} placeholder="(11) 90000-0000" className="input-base" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-charcoal/80">Faturamento mensal</span>
            <select className="input-base">
              <option>Selecionar</option>
              <option>Até R$ 10 mil</option>
              <option>R$ 10 a 30 mil</option>
              <option>R$ 30 a 80 mil</option>
              <option>Acima de R$ 80 mil</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-charcoal/80">Segmento</span>
            <select className="input-base">
              <option>Selecionar</option>
              <option>Hamburgueria</option>
              <option>Pizzaria</option>
              <option>Restaurante</option>
              <option>Delivery</option>
              <option>Açaiteria</option>
            </select>
          </label>
        </div>
        <label className="mt-2 flex items-start gap-2 text-xs text-lmuted">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-0.5 h-4 w-4"
            style={{ accentColor: "#EA580C" }}
          />
          <span>
            Declaro que li e aceito a{" "}
            <a href="#" className="text-ember underline underline-offset-2">
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        <button
          type="submit"
          disabled={!aceito}
          className="mt-2 w-full rounded-md bg-ember py-3 text-sm font-bold uppercase tracking-wider text-white shadow-ember transition hover:bg-ember-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Testar agora →
        </button>
      </div>
    </form>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-lborder bg-cream">
      <div className="bg-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-5 pb-16 pt-12 md:grid-cols-12 md:gap-12 md:pb-20 md:pt-16">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-lborder bg-white px-3 py-1 text-xs font-medium text-lmuted">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Sistema para Delivery e Restaurante
          </div>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-charcoal md:text-5xl lg:text-[52px]">
            O Cardápio Digital
            <span className="text-ember"> mais completo</span> do Brasil.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-charcoal/70 md:text-lg">
            Experimente a ferramenta que vai automatizar seus pedidos de WhatsApp, aumentar suas
            vendas com marketing e profissionalizar a gestão do seu negócio de uma vez por todas.
          </p>
          <div className="relative mt-8">
            <Image
              src="/mock-hero.png"
              alt="MeVêUm exibido em notebook, celular e tablet com cardápio digital de hamburgueria"
              width={1280}
              height={896}
              className="w-full"
              style={{ filter: "drop-shadow(0 30px 40px rgba(40,25,10,0.18))" }}
              priority
            />
          </div>
        </div>
        <div className="md:col-span-5 md:sticky md:top-24">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

// ── Integrations Marquee ──────────────────────────────────────────────────────
const INTEGRACOES = [
  { nome: "iFood",        arquivo: "ifood",       w: 80,  h: 24 },
  { nome: "PIX",          arquivo: "pix",         w: 24,  h: 24 },
  { nome: "Mercado Pago", arquivo: "mercadopago", w: 24,  h: 24 },
  { nome: "WhatsApp",     arquivo: "whatsapp",    w: 24,  h: 24 },
  { nome: "Cielo",        arquivo: "cielo",       w: 64,  h: 24 },
  { nome: "Loggi",        arquivo: "loggi",       w: 64,  h: 24 },
  { nome: "Stone",        arquivo: "stone",       w: 72,  h: 24 },
  { nome: "Rappi",        arquivo: "rappi",       w: 72,  h: 24 },
  { nome: "Uber Eats",    arquivo: "ubereats",    w: 24,  h: 24 },
  { nome: "PagSeguro",    arquivo: "pagseguro",   w: 24,  h: 24 },
  { nome: "Nubank",       arquivo: "nubank",      w: 24,  h: 24 },
  { nome: "PicPay",       arquivo: "picpay",      w: 24,  h: 24 },
  { nome: "Visa",         arquivo: "visa",        w: 24,  h: 24 },
  { nome: "Mastercard",   arquivo: "mastercard",  w: 24,  h: 24 },
  { nome: "Getnet",       arquivo: "getnet",      w: 80,  h: 24 },
  { nome: "Ame",          arquivo: "ame",         w: 48,  h: 24 },
];

function IntegracoesMaquee() {
  const items = [...INTEGRACOES, ...INTEGRACOES];
  return (
    <section className="border-y border-lborder bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-lmuted">
          Integrações nativas
        </p>
        <div
          className="group relative overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <div className="flex w-max animate-marquee items-center gap-14 whitespace-nowrap">
            {items.map((integ, i) => (
              <Image
                key={i}
                src={`/integracoes/${integ.arquivo}.svg`}
                alt={integ.nome}
                width={integ.w * 1.5}
                height={integ.h * 1.5}
                className="h-7 w-auto opacity-55 transition-opacity hover:opacity-90"
                unoptimized
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Problema Section ──────────────────────────────────────────────────────────
const PROBLEMAS = [
  { num: "01", titulo: "Áudio de 4 minutos", descricao: "para confirmar 2 hambúrgueres." },
  { num: "02", titulo: "Print perdido", descricao: "no meio de 80 conversas no WhatsApp." },
  { num: "03", titulo: "Anotação errada", descricao: "vira reclamação e pedido refeito." },
  { num: "04", titulo: "Cozinha sem fila", descricao: "sai pedido frio, cliente reclama." },
];

function ProblemaSection() {
  return (
    <section className="border-b border-white/10 bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember">O problema</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-5xl">
              WhatsApp desorganizado custa caro.
            </h2>
            <p className="mt-4 max-w-md text-cream/70">
              A maioria dos restaurantes brasileiros perde de 8% a 15% dos pedidos por bagunça
              operacional. Não é falta de cliente — é falta de sistema.
            </p>
          </div>
          <ul className="divide-y divide-cream/10 md:col-span-7">
            {PROBLEMAS.map((p) => (
              <li key={p.num} className="flex items-start gap-5 py-5">
                <span className="font-mono text-xs text-cream/40">{p.num}</span>
                <div>
                  <p className="font-display text-xl font-semibold">{p.titulo}</p>
                  <p className="text-cream/60">{p.descricao}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Funcionalidades Section ───────────────────────────────────────────────────
const FUNCIONALIDADES = [
  { num: "01", titulo: "Pedido entrou, cozinha viu.", descricao: "Cada pedido cai direto na tela da cozinha, com tempo, status e prioridade. Sem print, sem dúvida." },
  { num: "02", titulo: "Cardápio digital que vende.", descricao: "Fotos, combos, adicionais e cupons. Cliente escolhe pelo celular e finaliza no PIX em segundos." },
  { num: "03", titulo: "QR Code na mesa.", descricao: "Cada mesa tem seu QR. Cliente abre, pede, paga. Garçom só leva e fecha." },
  { num: "04", titulo: "WhatsApp organizado.", descricao: "Mensagens viram pedidos formais. Atalhos, automações e disparo de campanhas para a sua base." },
];

function FuncionalidadesSection() {
  return (
    <section id="funcionalidades" className="border-b border-lborder bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember">
              Como o MeVêUm resolve
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-charcoal md:text-5xl">
              Tudo que sua operação precisa
              <span className="text-ember">. Em uma tela só.</span>
            </h2>
          </div>
          <a href="#cta" className="text-sm font-semibold text-ember hover:underline">
            Quero testar no meu restaurante →
          </a>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-lborder bg-lborder md:grid-cols-2">
          {FUNCIONALIDADES.map((f) => (
            <div key={f.num} className="bg-white p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-charcoal font-mono text-xs text-cream">
                  {f.num}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-lmuted">
                  Funcionalidade
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold leading-tight text-charcoal">
                {f.titulo}
              </h3>
              <p className="mt-2 text-charcoal/70">{f.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Phone Mockup (Cardápio) ───────────────────────────────────────────────────
function PhoneMockupCardapio() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute -left-10 top-10 hidden rotate-[-8deg] rounded-2xl bg-white p-3 shadow-lift md:block">
        <p className="text-[10px] font-medium uppercase text-lmuted">Pagamento</p>
        <p className="font-display text-lg font-semibold text-charcoal">PIX em 3s</p>
        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-lborder">
          <div className="h-full w-2/3 bg-whatsapp" />
        </div>
      </div>
      <div className="rounded-[2.2rem] border border-charcoal/15 bg-charcoal p-2 shadow-lift">
        <div className="overflow-hidden rounded-[1.8rem] bg-cream">
          <div
            className="relative h-32"
            style={{ background: "linear-gradient(to bottom right, #EA580C, #F59E0B)" }}
          >
            <div className="absolute bottom-3 left-4 text-cream">
              <p className="text-[11px] uppercase tracking-wider opacity-80">Cardápio · Aberto</p>
              <p className="font-display text-xl font-semibold">Burger do Bairro</p>
            </div>
          </div>
          <div className="flex gap-2 overflow-hidden border-b border-lborder px-4 py-3 text-xs">
            {["Mais pedidos", "Burgers", "Pizzas", "Bebidas", "Sobremesas"].map((cat, i) => (
              <span
                key={cat}
                className="whitespace-nowrap rounded-full px-3 py-1"
                style={{
                  background: i === 0 ? "#1C1917" : "#F5F0EC",
                  color: i === 0 ? "#FBF7F4" : "#78716C",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-lborder">
            {[
              { nome: "Smash Bacon Duplo", desc: "Dois blends 90g, cheddar, bacon crocante, molho da casa.", preco: "R$ 38,90", tag: "Mais pedido" },
              { nome: "Pizza Calabresa Artesanal", desc: "Massa fermentada 48h, mussarela e calabresa premium.", preco: "R$ 52,00" },
              { nome: "Combo Família", desc: "4 burgers, 2 fritas grandes e 2 refris 600ml.", preco: "R$ 119,90", tag: "Combo" },
            ].map((item) => (
              <li key={item.nome} className="flex gap-3 p-4">
                <div
                  className="h-16 w-16 shrink-0 rounded-lg"
                  style={{ background: "linear-gradient(to bottom right, #F59E0B, #C2410C)" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-charcoal">{item.nome}</p>
                    {item.tag && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-ember"
                        style={{ background: "rgba(234,88,12,0.12)" }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-lmuted">{item.desc}</p>
                  <p className="mt-1 text-sm font-semibold text-ember">{item.preco}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-lborder bg-cream p-3">
            <button className="w-full rounded-lg bg-ember py-3 text-sm font-semibold text-white">
              Finalizar pedido · R$ 92,80
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cardápio Section ──────────────────────────────────────────────────────────
function CardapioSection() {
  return (
    <section id="cardapio" className="border-b border-lborder bg-sand">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember-deep">
              Cardápio digital
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-charcoal md:text-5xl">
              Seu cardápio online pronto para vender.
            </h2>
            <p className="mt-4 max-w-md text-charcoal/70">
              Personalize cores, fotos, combos e adicionais. Funciona em qualquer celular, sem
              instalação. Compartilhe um link, cole um QR Code — e está vendendo.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-charcoal">
              {[
                "Fotos profissionais com IA de realce",
                "Combos, adicionais e variações ilimitadas",
                "Cupom, frete por bairro e horário de funcionamento",
                "Pagamento PIX, cartão e dinheiro na entrega",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-ember text-[10px] text-white">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-7">
            <PhoneMockupCardapio />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Dashboard Section ─────────────────────────────────────────────────────────
const METRICAS = [
  { label: "Pedidos hoje", value: "182", delta: "+24% vs ontem", cor: "#F59E0B" },
  { label: "Faturamento", value: "R$ 8.640", delta: "+18% vs ontem", cor: "#F59E0B" },
  { label: "Ticket médio", value: "R$ 47,80", delta: "+R$ 3,20 vs ontem", cor: "#F59E0B" },
  { label: "Tempo médio", value: "23 min", delta: "−4 min vs ontem", cor: "#F59E0B" },
];

const PEDIDOS_LIVE = [
  { id: "#1024", nome: "Smash Bacon Duplo", sub: "Marina Alves · Mesa 08", status: "Em preparo", valor: "R$ 52,80", bg: "rgba(234,88,12,0.15)", cor: "#EA580C" },
  { id: "#1023", nome: "Combo Família", sub: "João Pedro · Delivery", status: "Saiu p/ entrega", valor: "R$ 119,90", bg: "rgba(37,211,102,0.15)", cor: "#4ade80" },
  { id: "#1022", nome: "Pizza Calabresa", sub: "Bruno C. · Mesa 03", status: "Pago PIX", valor: "R$ 64,00", bg: "rgba(245,158,11,0.2)", cor: "#F59E0B" },
  { id: "#1021", nome: "Açaí 500ml + Granola", sub: "Patrícia B. · Balcão", status: "Pronto", valor: "R$ 24,90", bg: "rgba(37,211,102,0.15)", cor: "#4ade80" },
  { id: "#1020", nome: "Hambúrguer Clássico + Coca", sub: "Lucas M. · Delivery", status: "Aceito", valor: "R$ 38,90", bg: "rgba(234,88,12,0.15)", cor: "#EA580C" },
];

const CLIENTES = [
  { initials: "MA", nome: "Marina Alves", pedidos: "12 pedidos", badge: "VIP" },
  { initials: "JP", nome: "João Pedro", pedidos: "8 pedidos", badge: "Recorrente" },
  { initials: "PB", nome: "Patrícia Bento", pedidos: "6 pedidos", badge: "Recorrente" },
  { initials: "BC", nome: "Bruno Carmo", pedidos: "4 pedidos", badge: "Novo" },
];

function DashboardSection() {
  return (
    <section id="dashboard" className="border-b border-white/10 bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-warm">
              Dashboard operacional
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-5xl">
              Você enxerga tudo. Em tempo real.
            </h2>
            <p className="mt-4 text-cream/70">
              Pedidos, faturamento, ticket médio, fila da cozinha, clientes recorrentes. Decisões
              na hora — sem planilha, sem achismo.
            </p>
          </div>
          <a
            href="/login"
            className="rounded-md border border-cream/20 px-4 py-2 text-sm font-semibold hover:bg-cream/10"
          >
            Abrir demo do dashboard →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICAS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-cream/10 bg-graphite p-5"
            >
              <p className="text-[10px] uppercase tracking-wider text-cream/50">{m.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold">{m.value}</p>
              <p className="mt-1 text-xs text-amber-warm">{m.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-cream/10 bg-graphite shadow-lift">
          <div className="grid grid-cols-12">
            <div className="col-span-12 border-b border-cream/10 p-5 md:col-span-8 md:border-b-0 md:border-r">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Pedidos · Live</p>
                <div className="flex items-center gap-2 text-[11px] text-cream/60">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
                  conectado
                </div>
              </div>
              <ul className="mt-4 divide-y divide-cream/10 text-sm">
                {PEDIDOS_LIVE.map((o) => (
                  <li key={o.id} className="grid grid-cols-12 gap-3 py-3">
                    <span className="col-span-2 font-mono text-xs text-cream/50">{o.id}</span>
                    <div className="col-span-5">
                      <p className="font-medium">{o.nome}</p>
                      <p className="text-xs text-cream/50">{o.sub}</p>
                    </div>
                    <span
                      className="col-span-3 self-center justify-self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ background: o.bg, color: o.cor }}
                    >
                      {o.status}
                    </span>
                    <span className="col-span-2 self-center justify-self-end text-sm font-semibold">
                      {o.valor}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 p-5 md:col-span-4">
              <p className="text-sm font-semibold">Clientes recorrentes</p>
              <ul className="mt-4 space-y-3">
                {CLIENTES.map((c) => (
                  <li key={c.nome} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-ember"
                      style={{ background: "rgba(234,88,12,0.2)" }}>
                      {c.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.nome}</p>
                      <p className="text-xs text-cream/50">{c.pedidos}</p>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase text-cream/70"
                      style={{ background: "rgba(255,255,255,0.05)" }}>
                      {c.badge}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-charcoal p-4">
                <p className="text-[10px] uppercase tracking-wider text-cream/50">Top do dia</p>
                <p className="mt-2 font-display text-xl font-semibold">Smash Bacon Duplo</p>
                <p className="text-xs text-cream/60">38 unidades · R$ 1.478</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WhatsApp + QR Section ─────────────────────────────────────────────────────
const QR_MESAS = [
  { label: "Mesa 01", active: false },
  { label: "Mesa 02", active: false },
  { label: "Mesa 03", active: false },
  { label: "Mesa 08", active: true },
  { label: "Balcão", active: false },
];

const QR_DOTS = [1,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,0,1,1,0,1,1,0,1];

function WhatsAppQRSection() {
  return (
    <section className="border-b border-lborder bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
        {/* WhatsApp card */}
        <div className="rounded-2xl border border-lborder bg-white p-7 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-whatsapp text-sm font-bold text-white">W</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-lmuted">Integração WhatsApp</p>
          </div>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal">
            Menos áudio.<br />Mais venda.
          </h3>
          <p className="mt-3 text-charcoal/70">
            Mensagens viram pedidos formais. Confirmação automática, atualizações de status e
            campanhas para sua base de clientes — tudo dentro do WhatsApp oficial.
          </p>
          <div className="mt-6 space-y-2">
            {[
              { text: "Quero 2 smash bacon e uma coca 2L", side: "right", bg: "rgba(37,211,102,0.15)", color: "#1C1917" },
              { text: "Pedido #1024 confirmado · R$ 92,80 · entrega em 35min", side: "left", bg: "#F5F0EC", color: "#1C1917" },
              { text: "PIX já fiz", side: "right", bg: "rgba(37,211,102,0.15)", color: "#1C1917" },
              { text: "Recebido ✅ Cozinha já está preparando.", side: "left", bg: "#F5F0EC", color: "#1C1917" },
            ].map((b, i) => (
              <div key={i} className={`flex ${b.side === "right" ? "justify-end" : "justify-start"}`}>
                <p
                  className="max-w-[78%] rounded-2xl px-3 py-2 text-sm"
                  style={{ background: b.bg, color: b.color,
                    borderRadius: b.side === "right" ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem" }}
                >
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code card */}
        <div className="rounded-2xl bg-charcoal p-7 text-cream shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ember text-sm font-bold text-white">QR</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/60">QR Code para mesas</p>
          </div>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-tight">
            Cliente pede sem chamar garçom.
          </h3>
          <p className="mt-3 text-cream/70">
            Cada mesa tem seu próprio QR. O cliente abre o cardápio, monta o pedido, paga no PIX
            — e o garçom só leva.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {QR_MESAS.map((mesa) => (
              <div
                key={mesa.label}
                className="rounded-xl p-3"
                style={{ background: mesa.active ? "#EA580C" : "#292524" }}
              >
                <div className="grid h-16 w-16 grid-cols-5 grid-rows-5 gap-[2px] rounded-md bg-cream p-1.5">
                  {QR_DOTS.map((on, i) => (
                    <span
                      key={i}
                      className="rounded-[1px]"
                      style={{ background: on ? "#1C1917" : "transparent" }}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] font-medium">{mesa.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Depoimentos + Stats ───────────────────────────────────────────────────────
const DEPOIMENTOS = [
  {
    initials: "PB", nome: "Patrick Bartholzai", cargo: "Dono · BBB Burger", receita: "+R$ 60 mil/mês",
    texto: "Saímos do caos do WhatsApp. Hoje a cozinha enxerga tudo, e os pedidos saem no tempo certo. Cresci 40% em 3 meses.",
  },
  {
    initials: "JM", nome: "Júlia Martins", cargo: "Pizzaria da Júlia", receita: "+R$ 100 mil/mês",
    texto: "Atendia 1 cliente por vez no atendimento. Hoje atendo 12. O MeVêUm pagou ele mesmo na primeira semana.",
  },
  {
    initials: "BF", nome: "Bruno Felipe", cargo: "Open Burger", receita: "+R$ 30 mil/mês",
    texto: "Sou de cidade pequena. Achava que tecnologia não era pra mim. Em uma noite de 40 pedidos, 3 manuais e 37 no app.",
  },
];

const STATS = [
  { value: "+2.400", label: "restaurantes ativos" },
  { value: "30M", label: "pedidos processados" },
  { value: "R$ 5bi", label: "transacionados" },
  { value: "20%", label: "aumento médio em vendas" },
];

function DepoimentosSection() {
  return (
    <section className="border-b border-lborder bg-sand">
      <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember-deep">
          Quem usa, vende mais
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-charcoal md:text-5xl">
          Restaurantes brasileiros que viraram a chave.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <figure key={d.nome} className="flex flex-col rounded-2xl border border-lborder bg-white p-6 shadow-soft">
              <div className="text-ember">★★★★★</div>
              <blockquote className="mt-3 flex-1 text-pretty text-charcoal/85">
                "{d.texto}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-lborder pt-4">
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-ember"
                  style={{ background: "rgba(234,88,12,0.15)" }}
                >
                  {d.initials}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal">{d.nome}</p>
                  <p className="text-xs text-lmuted">{d.cargo}</p>
                </div>
                <span className="rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-bold uppercase text-cream">
                  {d.receita}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-lborder pt-8 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-semibold text-charcoal md:text-4xl">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-lmuted">{s.label}</p>
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
    <section id="faq" className="border-b border-lborder bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ember">FAQ</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] text-charcoal">
            Ficou com dúvida?
          </h2>
          <p className="mt-3 text-charcoal/70">
            Fale direto com um consultor. Sem formulário longo, sem agendamento de meia hora.
          </p>
          <a
            href="#cta"
            className="mt-5 inline-flex rounded-md bg-ember px-4 py-2 text-sm font-semibold text-white shadow-ember hover:bg-ember-deep"
          >
            Falar com consultor
          </a>
        </div>
        <ul className="divide-y divide-lborder md:col-span-8">
          {FAQS.map((faq, i) => (
            <li key={faq.q}>
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-display text-lg font-medium text-charcoal">{faq.q}</span>
                <span
                  className="grid h-7 w-7 place-items-center rounded-full border border-lborder text-sm transition flex-shrink-0"
                  style={open === i ? { background: "#1C1917", color: "#FBF7F4", transform: "rotate(45deg)" } : {}}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-5 pr-10 text-charcoal/70">{faq.a}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  { title: "Produto", links: ["Cardápio digital", "QR Code para mesas", "WhatsApp", "Cozinha", "Dashboard", "Cupons"] },
  { title: "MeVêUm", links: ["Sobre", "Blog", "Parceiros", "Trabalhe conosco", "Central de ajuda"] },
  { title: "Suporte", links: ["Seg a sáb · 8h–23h", "Domingos · 14h–22h", "WhatsApp", "E-mail", "Status"] },
  { title: "Comunidade", links: ["Grupo de donos", "Mentoria gratuita", "Eventos"] },
];

function Footer() {
  return (
    <footer className="bg-charcoal text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/logo.png" alt="MeVêUm" width={130} height={52} className="h-12 w-auto object-contain" />
          <p className="mt-3 max-w-xs text-sm">
            Sistema de pedidos, cardápio digital e gestão para restaurantes brasileiros.
          </p>
          <p className="mt-5 text-xs">
            Av. Paulista, 1000 · São Paulo, SP
            <br />
            contato@mevenum.com.br
          </p>
        </div>
        {FOOTER_COLS.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-cream transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-cream/50">
          <p>© 2026 MeVêUm Tecnologia · Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#">Termos de uso</a>
            <a href="#">Política de privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <IntegracoesMaquee />
        <ProblemaSection />
        <FuncionalidadesSection />
        <CardapioSection />
        <DashboardSection />
        <WhatsAppQRSection />
        <DepoimentosSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
