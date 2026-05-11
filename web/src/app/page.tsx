import Link from "next/link";
import { ArrowRight, MessageCircle, Check, Star, QrCode, ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <a href="#produto" className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Produto</a>
          <a href="#funcionalidades" className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Funcionalidades</a>
          <a href="#depoimentos" className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">Depoimentos</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors px-3 py-2">
            Entrar
          </Link>
          <Link href="/register" className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-orange-hover)] transition-colors" data-testid="header-cta-button">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Mockup: painel de pedidos ────────────────────────────────────────────────
function MockupPainel() {
  const pedidos = [
    { n: 48, nome: "Ana Paula S.", itens: "Smash Bacon + Milkshake", total: "R$ 58,80", status: "recebido", statusColor: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
    { n: 47, nome: "Marcos Oliveira", itens: "2× Smash Clássico + Batata + Refri", total: "R$ 105,50", status: "em preparo", statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
    { n: 46, nome: "Ricardo F.", itens: "Smash Clássico + Onion Rings", total: "R$ 60,80", status: "pronto", statusColor: "bg-green-500/20 text-green-400 border-green-500/20" },
    { n: 45, nome: "Camila Torres", itens: "2× Smash Bacon + Brownie c/ sorvete", total: "R$ 137,50", status: "saiu p/ entrega", statusColor: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
      {/* barra do topo */}
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-[11px] text-[var(--color-muted)]">Smash Burguer do Centro · ao vivo</span>
        </div>
        <div className="ml-auto text-[10px] font-mono text-[var(--color-muted-2)]">15:42</div>
      </div>

      {/* métricas */}
      <div className="grid grid-cols-4 gap-px border-b border-[var(--color-border)] bg-[var(--color-border)]">
        {[
          { l: "Pedidos hoje", v: "23" },
          { l: "Faturamento", v: "R$ 1.847" },
          { l: "Em preparo", v: "4" },
          { l: "Ticket médio", v: "R$ 80" },
        ].map(({ l, v }) => (
          <div key={l} className="bg-[var(--color-surface-2)] px-3 py-2.5">
            <div className="text-[9px] uppercase tracking-wider text-[var(--color-muted-2)]">{l}</div>
            <div className="text-sm font-bold text-[var(--color-foreground)]">{v}</div>
          </div>
        ))}
      </div>

      {/* lista de pedidos */}
      <div className="divide-y divide-[var(--color-border)]">
        {pedidos.map((p) => (
          <div key={p.n} className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[10px] font-bold text-[var(--color-muted)]">
              #{p.n}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[var(--color-foreground)] truncate">{p.nome}</div>
              <div className="text-[10px] text-[var(--color-muted-2)] truncate">{p.itens}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs font-bold text-[var(--color-foreground)]">{p.total}</div>
              <div className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${p.statusColor}`}>
                {p.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 md:pt-20 md:pb-24">
      {/* glow fundo */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--color-orange)]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
          {/* col esquerda */}
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-orange)]/25 bg-[var(--color-orange)]/8 px-3 py-1.5 text-xs font-medium text-[var(--color-orange)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
              +1.200 restaurantes já usam o MeVêUm
            </div>

            <h1 className="mb-5 text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-[var(--color-foreground)] md:text-5xl lg:text-[3.25rem]">
              Pedido entrou.{" "}
              <span className="text-[var(--color-orange)]">Cozinha viu.</span>
              <br />
              Simples assim.
            </h1>

            <p className="mb-7 text-[1.05rem] leading-relaxed text-[var(--color-muted)]">
              Cardápio digital com QR Code, pedidos chegando organizados na tela e
              gestão completa — sem depender de marketplace, sem bagunça no WhatsApp.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-orange)] px-6 py-3.5 text-base font-semibold text-white hover:bg-[var(--color-orange-hover)] transition-colors shadow-lg shadow-[var(--color-orange)]/20"
                data-testid="hero-cta-button"
              >
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)] transition-colors"
                data-testid="hero-demo-button"
              >
                Ver demonstração ao vivo
              </Link>
            </div>

            {/* prova social inline */}
            <div className="mt-8 flex items-center gap-5 border-t border-[var(--color-border)] pt-6">
              <div>
                <div className="text-xl font-bold text-[var(--color-foreground)]">1.200+</div>
                <div className="text-xs text-[var(--color-muted)]">restaurantes ativos</div>
              </div>
              <div className="h-8 w-px bg-[var(--color-border)]" />
              <div>
                <div className="text-xl font-bold text-[var(--color-foreground)]">50k+</div>
                <div className="text-xs text-[var(--color-muted)]">pedidos por mês</div>
              </div>
              <div className="h-8 w-px bg-[var(--color-border)]" />
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--color-amber)] text-[var(--color-amber)]" />
                  ))}
                </div>
                <span className="text-xs text-[var(--color-muted)]">4.9/5</span>
              </div>
            </div>
          </div>

          {/* col direita — mockup + flutuantes */}
          <div className="relative lg:pl-4">
            {/* notificação PIX */}
            <div className="absolute -left-2 top-6 z-10 flex items-center gap-2 rounded-[var(--radius-md)] border border-green-500/20 bg-[var(--color-surface)] px-3 py-2 shadow-xl md:-left-8">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15">
                <Check className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-green-400">PIX confirmado</div>
                <div className="text-[10px] text-[var(--color-muted)]">R$ 105,50 · #47</div>
              </div>
            </div>

            {/* badge novo pedido */}
            <div className="absolute -right-2 top-24 z-10 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-orange)]/20 bg-[var(--color-surface)] px-3 py-2 shadow-xl md:-right-4">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-orange)]/15">
                <span className="text-sm">🔔</span>
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--color-orange)]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[var(--color-orange)]">Novo pedido</div>
                <div className="text-[10px] text-[var(--color-muted)]">#48 · Ana Paula</div>
              </div>
            </div>

            {/* QR Code badge */}
            <div className="absolute -bottom-3 -right-2 z-10 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-xl md:-right-4">
              <QrCode className="h-5 w-5 text-[var(--color-muted)]" />
              <div>
                <div className="text-[11px] font-semibold text-[var(--color-foreground)]">QR Code na mesa 7</div>
                <div className="text-[10px] text-[var(--color-muted)]">3 pedidos via link hoje</div>
              </div>
            </div>

            <MockupPainel />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Logos strip ──────────────────────────────────────────────────────────────
function LogosStrip() {
  const nomes = ["Burguer House SP", "Coxinha da Vó", "Pizza Moderna", "Açaí do João", "Hot Dog da Esquina", "Sushi Ryu Itaim", "Pastel do Zé"];
  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-5 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-widest text-[var(--color-muted-2)]">
          Confiado por restaurantes em todo o Brasil
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2.5">
          {nomes.map((n) => (
            <span key={n} className="text-sm font-semibold text-[var(--color-muted-2)]">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Seção: O fim da bagunça ──────────────────────────────────────────────────
function FimDaBaguncaSection() {
  return (
    <section id="produto" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-14 md:gap-20 lg:grid-cols-2 lg:items-center">
          {/* Mockup WhatsApp → Painel */}
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3">
              {/* mock WhatsApp (antes) */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[#075e54] px-3 py-2.5">
                  <div className="h-6 w-6 rounded-full bg-[var(--color-border)]" />
                  <div>
                    <div className="text-[10px] font-semibold text-white">WhatsApp da loja</div>
                    <div className="text-[9px] text-green-200">online</div>
                  </div>
                </div>
                <div className="space-y-1.5 p-2.5">
                  {[
                    { msg: "oi quero 2 smash e 1 batata", who: "them" },
                    { msg: "manda o pix aí", who: "them" },
                    { msg: "qual o endereço?", who: "them" },
                    { msg: "👋🏻 Oi! Tá anotado!", who: "me" },
                    { msg: "sem cebola no meu", who: "them" },
                    { msg: "vc aceita débito?", who: "them" },
                    { msg: "qual o tempo?", who: "them" },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.who === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded px-2 py-1 text-[9px] leading-tight ${m.who === "me" ? "bg-[#dcf8c6] text-gray-800" : "bg-white text-gray-800"}`}>
                        {m.msg}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--color-border)] px-3 py-1.5">
                  <div className="text-[9px] font-semibold text-red-400 text-center">😵 Antes: total caos</div>
                </div>
              </div>

              {/* mock painel (depois) */}
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5">
                  <div className="text-[10px] font-semibold text-[var(--color-foreground)]">Pedidos — ao vivo</div>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {[
                    { n: 48, nome: "Ana Paula", valor: "R$ 58,80", s: "recebido", c: "text-blue-400" },
                    { n: 47, nome: "Marcos O.", valor: "R$ 105,50", s: "em preparo", c: "text-amber-400" },
                    { n: 46, nome: "Ricardo F.", valor: "R$ 60,80", s: "pronto", c: "text-green-400" },
                  ].map((p) => (
                    <div key={p.n} className="flex items-center justify-between px-3 py-2">
                      <div>
                        <div className="text-[10px] font-semibold text-[var(--color-foreground)]">#{p.n} {p.nome}</div>
                        <div className={`text-[9px] font-medium ${p.c}`}>{p.s}</div>
                      </div>
                      <div className="text-[10px] font-bold text-[var(--color-foreground)]">{p.valor}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--color-border)] px-3 py-1.5">
                  <div className="text-[9px] font-semibold text-green-400 text-center">✓ Depois: tudo organizado</div>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 flex items-center gap-2 rounded-full border border-[var(--color-orange)]/20 bg-[var(--color-orange-dim)] px-4 py-1.5 whitespace-nowrap">
              <span className="text-xs font-semibold text-[var(--color-orange)]">Menos áudio. Menos print. Menos bagunça.</span>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-orange)]">O problema</p>
            <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
              Ainda recebe pedido por áudio no WhatsApp?
            </h2>
            <p className="mb-6 text-base leading-relaxed text-[var(--color-muted)]">
              Todo pedido virou uma conversa. Uma conversa virou dez mensagens.
              Dez mensagens viraram um pedido errado. E um pedido errado virou prejuízo.
            </p>
            <ul className="space-y-3">
              {[
                "Cada pedido chega organizado na sua tela",
                "Nome, itens, endereço e pagamento em uma única view",
                "Zero digitação manual, zero pedido perdido",
                "A cozinha vê em tempo real, sem intermediário",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-orange)]/15">
                    <Check className="h-3 w-3 text-[var(--color-orange)]" />
                  </div>
                  <span className="text-sm text-[var(--color-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Seção: Cardápio digital ──────────────────────────────────────────────────
function CardapioSection() {
  return (
    <section className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Texto */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-orange)]">Cardápio digital</p>
            <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
              Seu cardápio online,<br />
              <span className="text-[var(--color-orange)]">seus clientes, suas regras.</span>
            </h2>
            <p className="mb-6 text-base leading-relaxed text-[var(--color-muted)]">
              Monte o cardápio em minutos, gere o QR Code e coloque nas mesas. O cliente
              abre no celular, escolhe o que quer e o pedido cai direto na sua tela.
              Sem baixar aplicativo, sem taxas de marketplace.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                { label: "QR Code nas mesas", desc: "Pedido direto sem garçom" },
                { label: "Link compartilhável", desc: "Mande pelo WhatsApp" },
                { label: "Fotos e descrições", desc: "Cardápio bonito e completo" },
                { label: "Sem taxa por pedido", desc: "100% da venda é sua" },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                  <div className="text-xs font-semibold text-[var(--color-foreground)]">{label}</div>
                  <div className="text-[11px] text-[var(--color-muted)]">{desc}</div>
                </div>
              ))}
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-orange)] hover:underline">
              Criar meu cardápio agora <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mockup cardápio */}
          <div className="relative">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden shadow-2xl">
              {/* header do cardápio */}
              <div className="bg-[var(--color-surface-2)] px-5 py-5 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-[var(--radius-md)] bg-[var(--color-orange)] flex items-center justify-center text-white font-bold text-lg">S</div>
                  <div>
                    <div className="font-bold text-sm text-[var(--color-foreground)]">Smash Burguer do Centro</div>
                    <div className="flex items-center gap-1 text-[11px] text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Aberto agora · Entrega 30–45min
                    </div>
                  </div>
                </div>
                {/* categorias */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {["Hambúrgueres", "Porções", "Bebidas", "Sobremesas"].map((c, i) => (
                    <div key={c} className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${i === 0 ? "bg-[var(--color-orange)] text-white" : "border border-[var(--color-border)] text-[var(--color-muted)]"}`}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* produtos */}
              <div className="divide-y divide-[var(--color-border)]">
                {[
                  { nome: "Smash Clássico", desc: "2 smash burgers, cheddar, molho especial, picles", preco: "R$ 32,90", destaque: true },
                  { nome: "Smash Bacon Supreme", desc: "2 smash burgers, bacon artesanal, cheddar, barbecue", preco: "R$ 38,90" },
                  { nome: "Batata Frita Clássica", desc: "300g de batata crocante com sal e páprica", preco: "R$ 18,90" },
                ].map((p) => (
                  <div key={p.nome} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-14 w-14 shrink-0 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--color-foreground)]">{p.nome}</span>
                        {p.destaque && <span className="rounded bg-[var(--color-orange)]/15 px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-orange)]">MAIS PEDIDO</span>}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)] leading-tight truncate">{p.desc}</div>
                    </div>
                    <div className="shrink-0">
                      <div className="text-xs font-bold text-[var(--color-foreground)]">{p.preco}</div>
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-orange)] ml-auto">
                        <span className="text-white text-xs font-bold leading-none">+</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating QR */}
            <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-xl">
              <div className="h-12 w-12 rounded border-2 border-[var(--color-foreground)] bg-white p-1 grid grid-cols-5 gap-[1px]">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`${[0,1,2,5,7,10,12,14,17,22,23,24,6,18].includes(i) ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-foreground)]">QR Code</div>
                <div className="text-[9px] text-[var(--color-muted)]">Imprimir e colar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Seção: Funcionalidades ───────────────────────────────────────────────────
function FuncionalidadesSection() {
  return (
    <section id="funcionalidades" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-orange)]">Tudo em um lugar</p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
            Tudo que um restaurante precisa para operar bem.
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted)]">
            Nada faltando. Nada que você não vai usar.
          </p>
        </div>

        {/* grid editorial */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* card grande */}
          <div className="md:row-span-2 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 flex flex-col">
            <div className="mb-4 text-3xl">📋</div>
            <h3 className="mb-2 text-lg font-bold text-[var(--color-foreground)]">Painel de pedidos em tempo real</h3>
            <p className="mb-5 text-sm text-[var(--color-muted)] leading-relaxed flex-1">
              Cada pedido que chega aparece instantaneamente na tela. Você ou a cozinha vê o nome, os itens, o endereço e o pagamento — sem precisar abrir nenhuma mensagem.
            </p>
            <div className="mt-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted-2)] mb-2">Fluxo de status</div>
              <div className="flex items-center gap-1 flex-wrap">
                {["Recebido", "Em preparo", "Pronto", "Entregue"].map((s, i, arr) => (
                  <>
                    <span key={s} className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${i === 1 ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "border-[var(--color-border)] text-[var(--color-muted)]"}`}>{s}</span>
                    {i < arr.length - 1 && <span key={`arr-${i}`} className="text-[var(--color-muted-2)] text-[10px]">→</span>}
                  </>
                ))}
              </div>
            </div>
          </div>

          {/* cards menores */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-3 text-2xl">💬</div>
            <h3 className="mb-1.5 font-bold text-[var(--color-foreground)]">WhatsApp organizado</h3>
            <p className="text-sm text-[var(--color-muted)]">Pedidos do WhatsApp viram comandas organizadas. Acabou o caos de mensagens.</p>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-3 text-2xl">📊</div>
            <h3 className="mb-1.5 font-bold text-[var(--color-foreground)]">Dashboard de faturamento</h3>
            <p className="text-sm text-[var(--color-muted)]">Pedidos do dia, ticket médio e faturamento na palma da mão.</p>
          </div>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="mb-3 text-2xl">🗺️</div>
            <h3 className="mb-1.5 font-bold text-[var(--color-foreground)]">Taxas de entrega por bairro</h3>
            <p className="text-sm text-[var(--color-muted)]">Configure taxas por bairro ou CEP. O cliente já vê o valor antes de pedir.</p>
          </div>

          {/* card largo WhatsApp */}
          <div className="md:col-span-2 rounded-[var(--radius-xl)] border border-[var(--color-green-wa)]/20 bg-[var(--color-green-wa-dim)] p-6">
            <div className="flex items-start gap-4">
              <MessageCircle className="h-8 w-8 shrink-0 text-[var(--color-green-wa)]" />
              <div>
                <h3 className="mb-1.5 text-lg font-bold text-[var(--color-foreground)]">Venda pelo WhatsApp, link ou QR Code</h3>
                <p className="text-sm text-[var(--color-muted)]">
                  Compartilhe o link do cardápio no status do WhatsApp, cole o QR Code nas embalagens de delivery ou imprima para colocar nas mesas. Cada canal vira pedido organizado no mesmo painel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Seção: Números ───────────────────────────────────────────────────────────
function NumerosSection() {
  return (
    <section className="bg-[var(--color-surface)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-4 overflow-hidden rounded-[var(--radius-xl)]">
          {[
            { n: "1.200+", l: "restaurantes ativos" },
            { n: "50k+", l: "pedidos por mês" },
            { n: "R$ 2,4M", l: "em pedidos processados" },
            { n: "10min", l: "para estar no ar" },
          ].map(({ n, l }) => (
            <div key={l} className="bg-[var(--color-surface)] px-6 py-8 text-center">
              <div className="text-3xl font-extrabold text-[var(--color-foreground)] md:text-4xl">{n}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Seção: Dashboard showcase ────────────────────────────────────────────────
function DashboardShowcase() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-orange)]">Dashboard</p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
            Tudo organizado em uma única tela.
          </h2>
          <p className="mt-3 text-base text-[var(--color-muted)] max-w-lg mx-auto">
            Sem planilha, sem caderninho. Você vê em tempo real tudo que está acontecendo na sua loja.
          </p>
        </div>

        {/* dashboard mockup grande */}
        <div className="relative mx-auto max-w-4xl">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
            {/* topbar */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs text-[var(--color-muted)]">meveum.com.br/dashboard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs text-green-400">Loja aberta</span>
              </div>
            </div>

            <div className="flex">
              {/* mini sidebar */}
              <div className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 md:block w-36">
                {["Início", "Pedidos", "Cardápio", "Clientes", "Config."].map((i, idx) => (
                  <div key={i} className={`flex items-center gap-2 rounded px-2 py-2 text-xs mb-0.5 ${idx === 0 ? "bg-[var(--color-orange-dim)] text-[var(--color-orange)] font-medium" : "text-[var(--color-muted)]"}`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                    {i}
                  </div>
                ))}
              </div>

              {/* conteúdo */}
              <div className="flex-1 p-4 md:p-5">
                {/* métricas */}
                <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { l: "Pedidos hoje", v: "23", var: "+12%", ok: true },
                    { l: "Faturamento", v: "R$ 1.847", var: "+8%", ok: true },
                    { l: "Ticket médio", v: "R$ 80" },
                    { l: "Em preparo", v: "4", destaque: true },
                  ].map(({ l, v, var: va, ok, destaque }) => (
                    <div key={l} className={`rounded-[var(--radius-md)] border p-3 ${destaque ? "border-[var(--color-orange)]/20 bg-[var(--color-orange-dim)]" : "border-[var(--color-border)] bg-[var(--color-surface-2)]"}`}>
                      <div className="text-[9px] uppercase tracking-wider text-[var(--color-muted-2)]">{l}</div>
                      <div className={`text-base font-bold ${destaque ? "text-[var(--color-orange)]" : "text-[var(--color-foreground)]"}`}>{v}</div>
                      {va && <div className={`text-[9px] font-medium ${ok ? "text-green-400" : "text-red-400"}`}>{va}</div>}
                    </div>
                  ))}
                </div>

                {/* pedidos recentes */}
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
                    <span className="text-[11px] font-semibold text-[var(--color-foreground)]">Pedidos recentes</span>
                    <span className="text-[9px] text-[var(--color-muted)]">ao vivo</span>
                  </div>
                  {[
                    { n: 48, nome: "Ana Paula Santos", t: "Retirada", v: "R$ 58,80", s: "Recebido", c: "text-blue-400" },
                    { n: 47, nome: "Marcos Oliveira", t: "Delivery · Vila Mariana", v: "R$ 105,50", s: "Em preparo", c: "text-amber-400" },
                    { n: 46, nome: "Ricardo Ferreira", t: "Delivery · Bela Vista", v: "R$ 60,80", s: "Pronto", c: "text-green-400" },
                  ].map((p) => (
                    <div key={p.n} className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 last:border-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-[9px] font-bold text-[var(--color-muted)]">#{p.n}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-[var(--color-foreground)] truncate">{p.nome}</div>
                        <div className="text-[9px] text-[var(--color-muted-2)]">{p.t}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] font-bold text-[var(--color-foreground)]">{p.v}</div>
                        <div className={`text-[9px] font-medium ${p.c}`}>{p.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* glow */}
          <div className="absolute -bottom-8 left-1/2 h-16 w-2/3 -translate-x-1/2 rounded-full bg-[var(--color-orange)]/8 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

// ─── Seção: Depoimentos ───────────────────────────────────────────────────────
function DepoimentosSection() {
  const depoimentos = [
    {
      texto: "Antes eu ficava no celular o dia todo respondendo pedido. Agora abro o painel e vejo tudo de uma vez. Minha operação mudou completamente.",
      nome: "Carlos Mendes",
      loja: "Burguer do Carlos · São Paulo, SP",
      pedidos: "14 pedidos/dia",
    },
    {
      texto: "Montei o cardápio em uma tarde. Na sexta seguinte já tinha QR Code nas mesas. No final de semana, os pedidos chegaram sem eu precisar abrir o WhatsApp uma vez.",
      nome: "Patrícia Souza",
      loja: "Coxinha da Vó · Campinas, SP",
      pedidos: "23 pedidos/dia",
    },
    {
      texto: "Faturamento aumentou 18% no primeiro mês. Não porque o sistema faz milagre, mas porque eu parei de perder pedido por bagunça.",
      nome: "Rafael Lima",
      loja: "Sushi Ryu · São Paulo, SP",
      pedidos: "31 pedidos/dia",
    },
  ];

  return (
    <section id="depoimentos" className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-orange)]">Depoimentos</p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
            Quem usa, não volta<br />para o WhatsApp bagunçado.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {depoimentos.map(({ texto, nome, loja, pedidos }) => (
            <div key={nome} className="relative rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 flex flex-col">
              {/* aspas decorativas */}
              <div className="absolute right-5 top-5 text-5xl font-serif leading-none text-[var(--color-border)] select-none">"</div>
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--color-amber)] text-[var(--color-amber)]" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-foreground)] flex-1 mb-5">
                "{texto}"
              </p>
              <div className="border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-foreground)]">{nome}</p>
                    <p className="text-xs text-[var(--color-muted)]">{loja}</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-orange)]/20 bg-[var(--color-orange-dim)] px-2.5 py-1">
                    <span className="text-[11px] font-bold text-[var(--color-orange)]">{pedidos}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const perguntas = [
    { p: "Preciso de algum conhecimento técnico?", r: "Não. Em 10 minutos você cadastra o restaurante, adiciona os produtos e já tem o link e o QR Code prontos. Sem TI, sem manual." },
    { p: "Meu cliente precisa baixar algum aplicativo?", r: "Não. O cardápio abre direto no navegador do celular. Nenhum aplicativo é instalado." },
    { p: "Como funciona a integração com WhatsApp?", r: "Os pedidos recebidos pelo WhatsApp aparecem automaticamente no painel. Você não precisa copiar ou digitar nada." },
    { p: "Posso usar sem pagar nada?", r: "Sim. No plano gratuito você tem até 50 pedidos por mês. Para ilimitado, é só fazer upgrade sem burocracia." },
    { p: "Preciso ter site ou domínio próprio?", r: "Não. O MeVêUm fornece o link do cardápio e o QR Code prontos para usar imediatamente." },
  ];

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-[var(--color-foreground)]">Dúvidas frequentes</h2>
        </div>
        <div className="space-y-2">
          {perguntas.map(({ p, r }) => (
            <details key={p} className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] open:border-[var(--color-orange)]/20 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-semibold text-[var(--color-foreground)] list-none">
                {p}
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4 text-sm text-[var(--color-muted)] leading-relaxed">
                {r}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-orange)]/15">
          <span className="text-3xl">🍔</span>
        </div>
        <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] md:text-4xl">
          Seu próximo pedido já pode<br />chegar organizado.
        </h2>
        <p className="mb-8 text-base text-[var(--color-muted)]">
          Comece agora, grátis. Sem cartão de crédito, sem contrato, sem TI.
          Em 10 minutos você está no ar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-orange)] px-8 py-4 text-base font-bold text-white hover:bg-[var(--color-orange-hover)] transition-colors shadow-lg shadow-[var(--color-orange)]/20"
            data-testid="footer-cta-button"
          >
            Criar conta grátis <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="https://wa.me/551199999999?text=Quero+saber+mais+sobre+o+MeVêUm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-green-wa)]/30 bg-[var(--color-green-wa-dim)] px-8 py-4 text-base font-semibold text-[var(--color-green-wa)] hover:bg-[var(--color-green-wa)]/15 transition-colors"
            data-testid="whatsapp-cta-button"
          >
            <MessageCircle className="h-5 w-5" />
            Falar com a gente
          </a>
        </div>
        <p className="mt-5 text-xs text-[var(--color-muted-2)]">
          Sem cartão · Setup em 10 minutos · Cancele quando quiser
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <Logo size="sm" />
          <p className="text-xs text-[var(--color-muted-2)] text-center">
            © 2025 MeVêUm · Feito com cuidado para restaurantes brasileiros
          </p>
          <div className="flex gap-5 text-xs text-[var(--color-muted-2)]">
            <a href="#" className="hover:text-[var(--color-muted)] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[var(--color-muted)] transition-colors">Termos</a>
            <a href="#" className="hover:text-[var(--color-muted)] transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <LogosStrip />
      <FimDaBaguncaSection />
      <CardapioSection />
      <FuncionalidadesSection />
      <NumerosSection />
      <DashboardShowcase />
      <DepoimentosSection />
      <FAQSection />
      <CTAFinal />
      <Footer />
    </>
  );
}
