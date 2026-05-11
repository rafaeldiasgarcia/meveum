import Link from "next/link";
import {
  ArrowRight, MessageCircle, QrCode, BarChart3,
  ClipboardList, UtensilsCrossed, Star, ChevronDown,
  CheckCircle2, Zap, Shield, Clock,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-muted)]">
          <a href="#como-funciona" className="hover:text-[var(--color-foreground)] transition-colors">Como funciona</a>
          <a href="#funcionalidades" className="hover:text-[var(--color-foreground)] transition-colors">Funcionalidades</a>
          <a href="#depoimentos" className="hover:text-[var(--color-foreground)] transition-colors">Depoimentos</a>
          <a href="#faq" className="hover:text-[var(--color-foreground)] transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" data-testid="header-cta-button">Começar grátis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-orange-dim),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-orange)]/30 bg-[var(--color-orange-dim)] px-3 py-1.5 text-xs font-medium text-[var(--color-orange)]">
            <Zap className="h-3 w-3" />
            Mais de 1.200 restaurantes já usam o MeVêUm
          </div>

          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-[var(--color-foreground)] md:text-5xl lg:text-6xl">
            Seus pedidos organizados,{" "}
            <span className="text-[var(--color-orange)]">sem bagunça no WhatsApp</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-muted)] leading-relaxed">
            Cardápio digital com QR Code, pedidos chegando direto na tela, controle de entregas e
            gestão completa — tudo em um lugar. Sem mensalidade no começo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="xl" className="w-full sm:w-auto" data-testid="hero-cta-button">
                Começar grátis agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="xl" className="w-full sm:w-auto" data-testid="hero-demo-button">
                Ver demonstração
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-[var(--color-muted)]">
            Sem cartão de crédito · Setup em 10 minutos · Cancele quando quiser
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 relative mx-auto max-w-4xl">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
              <div className="ml-3 h-5 w-48 rounded bg-[var(--color-border)]" />
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Pedidos hoje", val: "23" },
                  { label: "Faturamento", val: "R$ 1.847" },
                  { label: "Ticket médio", val: "R$ 80" },
                  { label: "Em preparo", val: "4" },
                ].map(({ label, val }) => (
                  <div key={label} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
                    <div className="text-[10px] text-[var(--color-muted)] uppercase">{label}</div>
                    <div className="text-lg font-bold text-[var(--color-foreground)]">{val}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Recebido", "Em preparo", "Pronto"].map((s, i) => (
                  <div key={s} className={`rounded-[var(--radius-md)] border p-3 ${i === 1 ? "border-[var(--color-orange)]/30 bg-[var(--color-orange-dim)]" : "border-[var(--color-border)] bg-[var(--color-surface-2)]"}`}>
                    <div className="text-xs text-[var(--color-muted)] mb-2">{s}</div>
                    {[1, 2].map((n) => (
                      <div key={n} className="mb-1.5 h-12 rounded bg-[var(--color-border)]/50" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-3/4 rounded-full bg-[var(--color-orange)]/10 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

// ─── Social proof strip ───────────────────────────────────────────────────────
function SocialProofStrip() {
  const logos = ["Burguer House", "Coxinha da Vó", "Pizza Moderna", "Açaí do João", "Hot Dog SP", "Sushi Ryu"];
  return (
    <section className="border-y border-[var(--color-border)] py-5">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="mb-4 text-center text-xs text-[var(--color-muted)] uppercase tracking-wider">
          Restaurantes que confiam no MeVêUm
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {logos.map((name) => (
            <span key={name} className="text-sm font-medium text-[var(--color-muted-2)]">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Como funciona ────────────────────────────────────────────────────────────
function ComoFunciona() {
  const passos = [
    { n: "01", titulo: "Cadastre seu restaurante", desc: "Crie sua conta, coloque o nome e endereço da loja. Leva menos de 5 minutos." },
    { n: "02", titulo: "Monte seu cardápio digital", desc: "Adicione seus produtos, categorias e preços. Gere o QR Code para deixar nas mesas." },
    { n: "03", titulo: "Receba pedidos na tela", desc: "Cada pedido do WhatsApp ou QR Code aparece direto no painel, organizado por status." },
    { n: "04", titulo: "Gerencie e entregue", desc: "Mude o status dos pedidos, controle entregas e veja o faturamento do dia." },
  ];
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">
            Do pedido ao prato em quatro passos
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">Sem treinamento. Sem manual. Você abre o sistema e já entende.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {passos.map(({ n, titulo, desc }) => (
            <div key={n} className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="mb-3 text-4xl font-black text-[var(--color-border)]">{n}</div>
              <h3 className="mb-1.5 font-semibold text-[var(--color-foreground)]">{titulo}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Funcionalidades ──────────────────────────────────────────────────────────
function Funcionalidades() {
  const items = [
    {
      icon: ClipboardList,
      titulo: "Pedidos organizados por status",
      desc: "Recebido, em preparo, pronto, saiu para entrega. Cada pedido no lugar certo, sem confusão.",
    },
    {
      icon: UtensilsCrossed,
      titulo: "Cardápio digital com QR Code",
      desc: "Seu cardápio bonito, com foto e descrição. QR Code pronto para colocar na mesa ou enviar pelo WhatsApp.",
    },
    {
      icon: MessageCircle,
      titulo: "Receba pedidos pelo WhatsApp",
      desc: "Tudo que chegar no WhatsApp vira pedido organizado na tela. Sem ficar copiando texto.",
      highlight: true,
    },
    {
      icon: BarChart3,
      titulo: "Dashboard de faturamento",
      desc: "Veja quanto você vendeu hoje, esta semana e este mês. Ticket médio, pedidos por hora e mais.",
    },
    {
      icon: QrCode,
      titulo: "QR Code nas mesas",
      desc: "Cliente scanneia, escolhe o que quer e o pedido cai direto na cozinha. Zero papel, zero erro.",
    },
    {
      icon: Shield,
      titulo: "Seus dados, suas regras",
      desc: "Sem depender de marketplace. Seus clientes são seus. Você decide preço, taxa e entrega.",
    },
  ];
  return (
    <section id="funcionalidades" className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">
            Tudo que um restaurante precisa
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">Nada faltando. Nada sobrando.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, titulo, desc, highlight }) => (
            <div
              key={titulo}
              className={`rounded-[var(--radius-lg)] border p-5 transition-colors ${
                highlight
                  ? "border-[var(--color-green-wa)]/30 bg-[var(--color-green-wa-dim)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-orange)]/30"
              }`}
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${
                  highlight ? "bg-[var(--color-green-wa)]/20" : "bg-[var(--color-border)]"
                }`}
              >
                <Icon className={`h-5 w-5 ${highlight ? "text-[var(--color-green-wa)]" : "text-[var(--color-muted)]"}`} />
              </div>
              <h3 className="mb-1.5 font-semibold text-[var(--color-foreground)]">{titulo}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────
function WhatsAppSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-green-wa)]/20 bg-[var(--color-green-wa-dim)] p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-green-wa)]/20">
                <MessageCircle className="h-7 w-7 text-[var(--color-green-wa)]" />
              </div>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-[var(--color-foreground)]">
              Ainda recebe pedido por mensagem de voz?
            </h2>
            <p className="mb-6 text-[var(--color-muted)]">
              Com o MeVêUm, cada pedido que chega pelo WhatsApp vira uma comanda organizada na tela.
              Sem digitação manual. Sem erro. Sem estresse.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button variant="whatsapp" size="lg" data-testid="whatsapp-cta-button">
                  <MessageCircle className="h-4 w-4" />
                  Ativar integração com WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Depoimentos ─────────────────────────────────────────────────────────────
function Depoimentos() {
  const depoimentos = [
    {
      nome: "Carlos Mendes",
      cargo: "Dono · Burguer do Carlos",
      texto: "Antes eu perdia pedido porque não conseguia acompanhar as mensagens. Agora chega tudo organizado na tela. Minha operação mudou.",
      rating: 5,
    },
    {
      nome: "Patrícia Souza",
      cargo: "Gerente · Coxinha da Vó",
      texto: "Montei o cardápio em uma tarde. Coloquei o QR Code nas mesas no sábado seguinte. No domingo já tinha pedidos chegando pelo sistema.",
      rating: 5,
    },
    {
      nome: "Rafael Lima",
      cargo: "Chef e proprietário · Sushi Ryu",
      texto: "Não preciso mais ficar no celular respondendo pedido. A equipe vê tudo na tela da cozinha e eu consigo trabalhar tranquilo.",
      rating: 5,
    },
  ];
  return (
    <section id="depoimentos" className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">
            Quem já usa não volta para o WhatsApp bagunçado
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {depoimentos.map(({ nome, cargo, texto, rating }) => (
            <div key={nome} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--color-amber)] text-[var(--color-amber)]" />
                ))}
              </div>
              <p className="mb-4 text-sm text-[var(--color-foreground)] leading-relaxed">"{texto}"</p>
              <div className="border-t border-[var(--color-border)] pt-3">
                <p className="text-sm font-semibold text-[var(--color-foreground)]">{nome}</p>
                <p className="text-xs text-[var(--color-muted)]">{cargo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Benefícios ───────────────────────────────────────────────────────────────
function Beneficios() {
  const items = [
    "Menos erro no pedido, mais tempo para vender",
    "Seu cardápio online, seus clientes, suas regras",
    "Tudo que chega vira pedido organizado na tela",
    "Faturamento do dia na palma da mão",
    "Sem dependência de marketplace",
    "Setup em 10 minutos, sem precisar de TI",
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-5 text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">
              Mais controle, menos caos
            </h2>
            <p className="mb-8 text-[var(--color-muted)]">
              Restaurante bem gerenciado é restaurante que cresce. Com o MeVêUm você
              enxerga tudo que está acontecendo em tempo real.
            </p>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-orange)] mt-0.5" />
                  <span className="text-sm text-[var(--color-foreground)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock, label: "Tempo médio de preparo", val: "18min" },
              { icon: Star, label: "Satisfação dos clientes", val: "4.8/5" },
              { icon: BarChart3, label: "Crescimento médio/mês", val: "+23%" },
              { icon: Zap, label: "Pedidos sem erro", val: "99.2%" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="h-5 w-5 text-[var(--color-orange)]" />
                </div>
                <div className="text-xl font-bold text-[var(--color-foreground)]">{val}</div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const perguntas = [
    { p: "Preciso de conhecimento técnico para configurar?", r: "Não. Em 10 minutos você cadastra o restaurante, adiciona os produtos e já tem o QR Code pronto para colocar nas mesas." },
    { p: "Meu cliente precisa baixar algum aplicativo?", r: "Não. O cardápio abre direto no navegador pelo QR Code. Nenhum aplicativo precisa ser instalado." },
    { p: "Como funciona a integração com WhatsApp?", r: "Os pedidos recebidos pelo WhatsApp da loja aparecem automaticamente no painel. Você não precisa copiar nada manualmente." },
    { p: "O plano gratuito tem limitação?", r: "Sim. No plano gratuito você tem até 50 pedidos por mês. Para ilimitado, é só fazer upgrade." },
    { p: "Posso cancelar quando quiser?", r: "Sim. Sem multa, sem burocracia. Cancele quando quiser direto nas configurações da conta." },
  ];
  return (
    <section id="faq" className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">Dúvidas frequentes</h2>
        </div>
        <div className="space-y-3">
          {perguntas.map(({ p, r }) => (
            <details key={p} className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-[var(--color-foreground)] list-none">
                {p}
                <ChevronDown className="h-4 w-4 text-[var(--color-muted)] transition-transform group-open:rotate-180 shrink-0 ml-4" />
              </summary>
              <div className="px-5 pb-5 text-sm text-[var(--color-muted)] leading-relaxed">{r}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA final ────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
        <div className="mb-4 text-5xl">🍔</div>
        <h2 className="mb-4 text-3xl font-bold text-[var(--color-foreground)] md:text-4xl">
          Seu próximo pedido já pode chegar organizado
        </h2>
        <p className="mb-8 text-[var(--color-muted)]">
          Comece grátis agora. Sem cartão de crédito, sem contrato.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <Button size="xl" data-testid="footer-cta-button">
              Começar grátis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a
            href="https://wa.me/551199999999?text=Quero+saber+mais+sobre+o+MeVêUm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="xl">
              <MessageCircle className="h-4 w-4" />
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-[var(--color-muted)] text-center">
            © 2025 MeVêUm · Feito com cuidado para restaurantes brasileiros
          </p>
          <div className="flex gap-4 text-xs text-[var(--color-muted)]">
            <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Termos</a>
            <a href="#" className="hover:text-[var(--color-foreground)] transition-colors">Contato</a>
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
      <SocialProofStrip />
      <ComoFunciona />
      <Funcionalidades />
      <WhatsAppSection />
      <Beneficios />
      <Depoimentos />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}
