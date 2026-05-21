"use client";

import { useEffect, useState } from "react";
import { Image, Eye, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buscarAparencia, atualizarAparencia, verificarSlugDisponivel } from "@/lib/api/configuracoes.api";
import type { AparenciaLoja } from "@/types";

const CORES_SUGERIDAS = ["#EA580C", "#16A34A", "#2563EB", "#9333EA", "#DC2626", "#D97706", "#0891B2"];

function slugify(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "";
}

export default function AparenciaPage() {
  const [form, setForm] = useState<AparenciaLoja>({ nome: "", slug: "", logoUrl: "", capaBannerUrl: "", corPrimaria: "#EA580C" });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [slugTimeout, setSlugTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    buscarAparencia()
      .then((a) => setForm({ corPrimaria: "#EA580C", ...a }))
      .catch(() => toast.error("Erro ao carregar aparência."))
      .finally(() => setLoading(false));
  }, []);

  function handleNomeChange(nome: string) {
    setForm((f) => ({ ...f, nome, slug: f.slug || slugify(nome) }));
  }

  function handleSlugChange(slug: string) {
    const s = slugify(slug) || slug;
    setForm((f) => ({ ...f, slug: s }));
    setSlugStatus("checking");
    if (slugTimeout) clearTimeout(slugTimeout);
    setSlugTimeout(
      setTimeout(async () => {
        const disponivel = await verificarSlugDisponivel(s).catch(() => true);
        setSlugStatus(disponivel ? "available" : "taken");
      }, 600),
    );
  }

  async function salvar() {
    if (slugStatus === "taken") {
      toast.error("Este slug já está em uso. Escolha outro.");
      return;
    }
    setSalvando(true);
    try {
      await atualizarAparencia(form);
      toast.success("Aparência atualizada!");
    } catch {
      toast.error("Erro ao salvar aparência.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="aparencia-loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-orange)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-foreground)]">Aparência da loja</h1>
        <p className="text-sm text-[var(--color-muted)]">Personalize a identidade visual do seu cardápio público</p>
      </div>

      {/* Identidade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Image className="h-4 w-4 text-[var(--color-muted)]" />
            Identidade visual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-testid="aparencia-form">
          <div className="space-y-1.5">
            <Label>Nome da loja</Label>
            <Input
              value={form.nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              placeholder="Burger do Bairro"
              data-testid="aparencia-nome-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Descrição <span className="text-[var(--color-muted)]">(opcional)</span></Label>
            <Input
              value={form.descricao ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              placeholder="Os melhores smash burgers da cidade"
              data-testid="aparencia-descricao-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>URL do cardápio (slug)</Label>
            <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-orange)]">
              <span className="px-3 py-2 text-xs text-[var(--color-muted)] bg-[var(--color-surface-2)] border-r border-[var(--color-border)] shrink-0">
                meveum.com/
              </span>
              <input
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="burger-do-bairro"
                data-testid="aparencia-slug-input"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--color-foreground)] outline-none"
              />
              <span className="px-3">
                {slugStatus === "available" && <Check className="h-4 w-4 text-green-500" />}
                {slugStatus === "taken" && <AlertCircle className="h-4 w-4 text-red-500" />}
              </span>
            </div>
            {slugStatus === "taken" && (
              <p className="text-xs text-red-500" data-testid="aparencia-slug-error">Este slug já está em uso.</p>
            )}
            {slugStatus === "available" && (
              <p className="text-xs text-green-500" data-testid="aparencia-slug-ok">Slug disponível!</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>URL da logo <span className="text-[var(--color-muted)]">(opcional)</span></Label>
            <Input
              value={form.logoUrl ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
              data-testid="aparencia-logo-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>URL da foto de capa <span className="text-[var(--color-muted)]">(opcional)</span></Label>
            <Input
              value={form.capaBannerUrl ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, capaBannerUrl: e.target.value }))}
              placeholder="https://..."
              data-testid="aparencia-capa-input"
            />
          </div>

          <div className="space-y-2">
            <Label>Cor primária</Label>
            <div className="flex items-center gap-3" data-testid="aparencia-cor-container">
              <div className="flex gap-2 flex-wrap">
                {CORES_SUGERIDAS.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, corPrimaria: cor }))}
                    className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: cor,
                      borderColor: form.corPrimaria === cor ? "#fff" : "transparent",
                      boxShadow: form.corPrimaria === cor ? `0 0 0 2px ${cor}` : undefined,
                    }}
                    data-testid={`aparencia-cor-${cor.replace("#", "")}`}
                    title={cor}
                  />
                ))}
              </div>
              <input
                type="color"
                value={form.corPrimaria ?? "#EA580C"}
                onChange={(e) => setForm((f) => ({ ...f, corPrimaria: e.target.value }))}
                data-testid="aparencia-cor-custom-input"
                className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--color-muted)]" />
            Pré-visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-xl overflow-hidden border border-[var(--color-border)]"
            data-testid="aparencia-preview"
          >
            <div
              className="h-20 flex items-end p-3"
              style={{ backgroundColor: form.corPrimaria ?? "#EA580C" }}
            >
              {form.logoUrl && (
                <img src={form.logoUrl} alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-white" />
              )}
            </div>
            <div className="p-4 bg-white">
              <p className="font-bold text-gray-900">{form.nome || "Nome da loja"}</p>
              {form.descricao && <p className="text-sm text-gray-500 mt-0.5">{form.descricao}</p>}
              {form.slug && <p className="text-xs text-gray-400 mt-1">meveum.com/{form.slug}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={salvar} loading={salvando} data-testid="aparencia-salvar-button">
          Salvar aparência
        </Button>
      </div>
    </div>
  );
}
